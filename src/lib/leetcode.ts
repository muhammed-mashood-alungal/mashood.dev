import { cacheLife } from "next/cache";
import { site } from "@/content/site";
import { fetchJson } from "./fetch-json";

export type Difficulty = "Easy" | "Medium" | "Hard";

export type DifficultyStat = {
  difficulty: Difficulty;
  solved: number;
  total: number;
};

export type LeetcodeStats = {
  solved: number;
  totalQuestions: number;
  breakdown: DifficultyStat[];
  streak: number | null;
  activeDays: number | null;
};

const QUERY = /* GraphQL */ `
  query userStats($username: String!) {
    allQuestionsCount {
      difficulty
      count
    }
    matchedUser(username: $username) {
      submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
        }
      }
      userCalendar {
        streak
        totalActiveDays
      }
    }
  }
`;

type Count = { difficulty: string; count: number };

type GraphQLResponse = {
  data?: {
    allQuestionsCount: Count[];
    matchedUser: {
      submitStatsGlobal: { acSubmissionNum: Count[] };
      userCalendar: { streak: number; totalActiveDays: number } | null;
    } | null;
  };
  errors?: { message: string }[];
};

const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];

function countFor(list: Count[], difficulty: string): number {
  return list.find((item) => item.difficulty === difficulty)?.count ?? 0;
}

/**
 * Solved counts and calendar stats from LeetCode's public GraphQL endpoint.
 * Returns null on any failure. Cached for a day on success, an hour on failure.
 */
export async function getLeetcodeStats(): Promise<LeetcodeStats | null> {
  "use cache";

  try {
    const json = await fetchJson<GraphQLResponse>("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.com",
        Origin: "https://leetcode.com",
        "User-Agent": "Mozilla/5.0 (compatible; portfolio-stats/1.0)",
      },
      body: JSON.stringify({
        query: QUERY,
        variables: { username: site.usernames.leetcode },
      }),
    });

    const user = json.data?.matchedUser;
    const all = json.data?.allQuestionsCount;
    if (!user || !all) {
      throw new Error(
        json.errors?.map((e) => e.message).join("; ") ?? "No user in response",
      );
    }

    const solvedList = user.submitStatsGlobal.acSubmissionNum;
    const stats: LeetcodeStats = {
      solved: countFor(solvedList, "All"),
      totalQuestions: countFor(all, "All"),
      breakdown: DIFFICULTIES.map((difficulty) => ({
        difficulty,
        solved: countFor(solvedList, difficulty),
        total: countFor(all, difficulty),
      })),
      streak: user.userCalendar?.streak ?? null,
      activeDays: user.userCalendar?.totalActiveDays ?? null,
    };

    cacheLife("days");
    return stats;
  } catch (error) {
    console.error("[leetcode] Failed to load stats:", error);
    cacheLife("hours");
    return null;
  }
}
