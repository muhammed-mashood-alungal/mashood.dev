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

export type LanguageShare = {
  name: string;
  /** Share of code across public repos, 0–100. */
  percent: number;
};

export type GithubStats = {
  totalContributions: number;
  /** Weeks of the calendar, oldest first. Each week is Sunday → Saturday. */
  weeks: ContributionDay[][];
  pinned: PinnedRepo[];
  publicRepos: number;
  totalStars: number;
  /** Year the account was created. */
  memberSince: number;
  /** Top languages by code size across public, non-fork repos. */
  languages: LanguageShare[];
};

const TOP_LANGUAGES = 5;

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
      createdAt
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
      repositories(first: 100, ownerAffiliations: OWNER, isFork: false, privacy: PUBLIC) {
        totalCount
        nodes {
          stargazerCount
          languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              size
              node {
                name
              }
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

type RepoNode = {
  stargazerCount: number;
  languages: { edges: { size: number; node: { name: string } }[] } | null;
};

type GraphQLResponse = {
  data?: {
    user: {
      createdAt: string;
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
      repositories: {
        totalCount: number;
        nodes: RepoNode[];
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

/** Top languages by bytes, with the remainder folded into "Other". */
function languageShares(repos: RepoNode[]): LanguageShare[] {
  const bytes = new Map<string, number>();
  for (const repo of repos) {
    for (const edge of repo.languages?.edges ?? []) {
      bytes.set(edge.node.name, (bytes.get(edge.node.name) ?? 0) + edge.size);
    }
  }
  const total = [...bytes.values()].reduce((sum, n) => sum + n, 0);
  if (total === 0) return [];

  const sorted = [...bytes.entries()].sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, TOP_LANGUAGES);
  const rest = sorted.slice(TOP_LANGUAGES).reduce((sum, [, n]) => sum + n, 0);
  const shares = top.map(([name, n]) => ({ name, percent: (n / total) * 100 }));
  if (rest > 0) shares.push({ name: "Other", percent: (rest / total) * 100 });
  return shares;
}

/**
 * Contribution calendar, repo stats and pinned repos for the configured user.
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
    const repos = user.repositories.nodes;
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
      publicRepos: user.repositories.totalCount,
      totalStars: repos.reduce((sum, repo) => sum + repo.stargazerCount, 0),
      memberSince: Number(user.createdAt.slice(0, 4)),
      languages: languageShares(repos),
    };

    cacheLife("days");
    return stats;
  } catch (error) {
    console.error("[github] Failed to load stats:", error);
    cacheLife("hours");
    return null;
  }
}
