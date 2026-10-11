import { cacheLife } from "next/cache";
import { site } from "@/content/site";
import { fetchJson } from "./fetch-json";

export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export type ContributionDay = {
  date: string;
  count: number;
  level: ContributionLevel;
};

export type PinnedRepo = {
  name: string;
  description: string | null;
  url: string;
  stars: number;
  language: string | null;
};

export type GithubStats = {
  totalContributions: number;
  /** Weeks of the calendar, oldest first. Each week is Sunday → Saturday. */
  weeks: ContributionDay[][];
  pinned: PinnedRepo[];
};

const LEVELS: Record<string, ContributionLevel> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

const QUERY = /* GraphQL */ `
  query ($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
            }
          }
        }
      }
      pinnedItems(first: 3, types: REPOSITORY) {
        nodes {
          ... on Repository {
            name
            description
            url
            stargazerCount
            primaryLanguage {
              name
            }
          }
        }
      }
    }
  }
`;

type GraphQLResponse = {
  data?: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: {
            contributionDays: {
              date: string;
              contributionCount: number;
              contributionLevel: string;
            }[];
          }[];
        };
      };
      pinnedItems: {
        nodes: {
          name: string;
          description: string | null;
          url: string;
          stargazerCount: number;
          primaryLanguage: { name: string } | null;
        }[];
      };
    } | null;
  };
  errors?: { message: string }[];
};

/**
 * Contribution calendar + pinned repos for the configured user.
 * Returns null when the token is missing or the API fails, so the card can
 * render its fallback. Cached for a day on success, an hour on failure.
 */
export async function getGithubStats(): Promise<GithubStats | null> {
  "use cache";

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.warn("[github] GITHUB_TOKEN is not set; showing fallback card.");
    cacheLife("hours");
    return null;
  }

  try {
    const json = await fetchJson<GraphQLResponse>("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": site.usernames.github,
      },
      body: JSON.stringify({ query: QUERY, variables: { login: site.usernames.github } }),
    });

    const user = json.data?.user;
    if (!user) {
      throw new Error(
        json.errors?.map((e) => e.message).join("; ") ?? "No user in response",
      );
    }

    const calendar = user.contributionsCollection.contributionCalendar;
    const stats: GithubStats = {
      totalContributions: calendar.totalContributions,
      weeks: calendar.weeks.map((week) =>
        week.contributionDays.map((day) => ({
          date: day.date,
          count: day.contributionCount,
          level: LEVELS[day.contributionLevel] ?? 0,
        })),
      ),
      pinned: user.pinnedItems.nodes
        .filter((node) => node && node.name)
        .map((node) => ({
          name: node.name,
          description: node.description,
          url: node.url,
          stars: node.stargazerCount,
          language: node.primaryLanguage?.name ?? null,
        })),
    };

    cacheLife("days");
    return stats;
  } catch (error) {
    console.error("[github] Failed to load stats:", error);
    cacheLife("hours");
    return null;
  }
}
