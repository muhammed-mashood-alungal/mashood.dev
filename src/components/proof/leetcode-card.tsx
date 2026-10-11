import Image from "next/image";
import { getLeetcodeStats, type Difficulty } from "@/lib/leetcode";
import { SkeletonBar, StatCard, StatsUnavailable } from "./stat-card";

const BAR_COLOR: Record<Difficulty, string> = {
  Easy: "bg-easy",
  Medium: "bg-medium",
  Hard: "bg-hard",
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** "2025-10-11" → "Oct 2025" */
function formatMonth(isoDate: string) {
  const [year, month] = isoDate.split("-").map(Number);
  return month ? `${MONTHS[month - 1]} ${year}` : isoDate;
}

export async function LeetcodeCard() {
  const stats = await getLeetcodeStats();

  return (
    <StatCard network="leetcode">
      {stats ? (
        <div className="grid gap-5 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-10">
          <div>
            <p className="text-sm">
              <span className="text-2xl font-semibold text-fg tabular-nums">
                {stats.solved}
              </span>{" "}
              <span className="text-muted">problems solved</span>
            </p>

            {(stats.streak !== null || stats.activeDays !== null) && (
              <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4">
                {stats.streak !== null && (
                  <div>
                    <dt className="font-mono text-xs text-muted">best streak</dt>
                    <dd className="tabular-nums">{stats.streak} days</dd>
                  </div>
                )}
                {stats.activeDays !== null && (
                  <div>
                    <dt className="font-mono text-xs text-muted">active days</dt>
                    <dd className="tabular-nums">{stats.activeDays}</dd>
                  </div>
                )}
                <p className="col-span-2 -mt-1 font-mono text-[11px] text-muted">
                  past 12 months
                </p>
              </dl>
            )}

            {stats.badge && (
              <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <Image
                  src={stats.badge.icon}
                  alt=""
                  width={40}
                  height={40}
                  className="size-10 shrink-0"
                />
                <div className="min-w-0 text-sm">
                  <p className="truncate">{stats.badge.name}</p>
                  <p className="font-mono text-xs text-muted">
                    earned {formatMonth(stats.badge.earned)}
                    {stats.badgeCount > 1 && ` · +${stats.badgeCount - 1} more`}
                  </p>
                </div>
              </div>
            )}
          </div>

          <ul className="space-y-3.5 sm:self-center">
            {stats.breakdown.map((item) => {
              const pct = item.total > 0 ? (item.solved / item.total) * 100 : 0;
              return (
                <li key={item.difficulty}>
                  <div className="flex items-baseline justify-between text-sm">
                    <span>{item.difficulty}</span>
                    <span className="font-mono text-xs text-muted tabular-nums">
                      {item.solved}
                      <span aria-hidden> / </span>
                      <span className="sr-only"> of </span>
                      {item.total}
                    </span>
                  </div>
                  <div
                    className="mt-1.5 h-1 overflow-hidden rounded-full bg-border"
                    aria-hidden
                  >
                    <div
                      className={`h-full rounded-full ${BAR_COLOR[item.difficulty]}`}
                      style={{ width: `${Math.max(pct, 1)}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <StatsUnavailable />
      )}
    </StatCard>
  );
}

export function LeetcodeCardSkeleton() {
  return (
    <StatCard network="leetcode">
      <div className="grid gap-5 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-10">
        <div>
          <SkeletonBar className="h-7 w-40" />
          <SkeletonBar className="mt-5 h-12 w-full" />
        </div>
        <div className="space-y-3.5">
          <SkeletonBar className="h-8 w-full" />
          <SkeletonBar className="h-8 w-full" />
          <SkeletonBar className="h-8 w-full" />
        </div>
      </div>
    </StatCard>
  );
}
