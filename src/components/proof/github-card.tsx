import { Star } from "lucide-react";
import { getGithubStats } from "@/lib/github";
import { Heatmap } from "./heatmap";
import { SkeletonBar, StatCard, StatsUnavailable } from "./stat-card";

const numberFormat = new Intl.NumberFormat("en-US");

export async function GithubCard() {
  const stats = await getGithubStats();

  return (
    <StatCard network="github">
      {stats ? (
        <>
          <p className="text-sm">
            <span className="text-2xl font-semibold text-fg tabular-nums">
              {numberFormat.format(stats.totalContributions)}
            </span>{" "}
            <span className="text-muted">contributions in the last year</span>
          </p>
          <div className="mt-4">
            <Heatmap weeks={stats.weeks} total={stats.totalContributions} />
          </div>

          {stats.pinned.length > 0 && (
            <>
              <h4 className="mt-6 font-mono text-xs text-muted">pinned</h4>
              <ul className="mt-3 grid gap-3 sm:grid-cols-3">
                {stats.pinned.map((repo) => (
                  <li
                    key={repo.url}
                    className="flex flex-col rounded-lg border border-border px-3.5 pb-3"
                  >
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center font-medium break-all text-accent transition-colors hover:text-accent-hover"
                    >
                      {repo.name}
                    </a>
                    {repo.description && (
                      <p className="line-clamp-2 text-sm text-muted">
                        {repo.description}
                      </p>
                    )}
                    <p className="mt-auto flex items-center gap-3 pt-2 font-mono text-xs text-muted">
                      {repo.language && <span>{repo.language}</span>}
                      <span className="inline-flex items-center gap-1">
                        <Star size={12} aria-hidden />
                        <span className="sr-only">Stars:</span>
                        {repo.stars}
                      </span>
                    </p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      ) : (
        <StatsUnavailable />
      )}
    </StatCard>
  );
}

export function GithubCardSkeleton() {
  return (
    <StatCard network="github">
      <SkeletonBar className="h-7 w-48" />
      <SkeletonBar className="mt-4 h-[104px] w-full" />
      <SkeletonBar className="mt-6 h-4 w-16" />
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <SkeletonBar className="h-24" />
        <SkeletonBar className="h-24" />
        <SkeletonBar className="h-24" />
      </div>
    </StatCard>
  );
}
