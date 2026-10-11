import type { ContributionDay } from "@/lib/github";

const CELL = 10;
const GAP = 3;
const STEP = CELL + GAP;
const LABEL_HEIGHT = 16;

const LEVEL_FILL = [
  "var(--color-heat-0)",
  "var(--color-heat-1)",
  "var(--color-heat-2)",
  "var(--color-heat-3)",
  "var(--color-heat-4)",
];

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

function formatDay(date: string) {
  const d = new Date(`${date}T00:00:00Z`);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

/** Month labels placed above the first week that starts in a new month. */
function monthLabels(weeks: ContributionDay[][]) {
  const labels: { x: number; text: string }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, i) => {
    const first = week[0];
    if (!first) return;
    const month = new Date(`${first.date}T00:00:00Z`).getUTCMonth();
    if (month !== lastMonth) {
      // Skip a label that would collide with the previous one.
      const x = i * STEP;
      if (labels.length === 0 || x - labels[labels.length - 1].x >= STEP * 3) {
        labels.push({ x, text: MONTHS[month] });
      }
      lastMonth = month;
    }
  });
  // Drop a leading label squeezed in before the first full month.
  if (labels.length > 1 && labels[1].x - labels[0].x < STEP * 3) labels.shift();
  return labels;
}

export function Heatmap({ weeks, total }: { weeks: ContributionDay[][]; total: number }) {
  const width = weeks.length * STEP - GAP;
  const height = LABEL_HEIGHT + 7 * STEP - GAP;

  return (
    <div>
      {/* Scales to the card width; on narrow screens it scrolls, and
          row-reverse starts the scroll position at the most recent weeks. */}
      <div className="flex flex-row-reverse overflow-x-auto overscroll-x-contain pb-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`Contribution heatmap: ${total} contributions in the last year`}
          className="h-auto w-full min-w-[600px] shrink-0"
        >
          {monthLabels(weeks).map((label) => (
            <text
              key={label.x}
              x={label.x}
              y={10}
              fill="var(--color-muted)"
              fontSize={10}
              fontFamily="var(--font-mono)"
            >
              {label.text}
            </text>
          ))}
          {weeks.map((week, x) =>
            week.map((day) => {
              const weekday = new Date(`${day.date}T00:00:00Z`).getUTCDay();
              return (
                <rect
                  key={day.date}
                  x={x * STEP}
                  y={LABEL_HEIGHT + weekday * STEP}
                  width={CELL}
                  height={CELL}
                  rx={2}
                  fill={LEVEL_FILL[day.level]}
                >
                  <title>{`${day.count} contribution${day.count === 1 ? "" : "s"} on ${formatDay(day.date)}`}</title>
                </rect>
              );
            }),
          )}
        </svg>
      </div>

      <div
        aria-hidden
        className="mt-2 flex items-center justify-end gap-1 font-mono text-[11px] text-muted"
      >
        <span className="mr-1">less</span>
        {LEVEL_FILL.map((fill) => (
          <span
            key={fill}
            className="size-2.5 rounded-[2px]"
            style={{ background: fill }}
          />
        ))}
        <span className="ml-1">more</span>
      </div>
    </div>
  );
}
