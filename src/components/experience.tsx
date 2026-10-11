import { site } from "@/content/site";
import { Section, TagList } from "./section";

export function Experience() {
  return (
    <Section id="work" title="Experience">
      <ol className="border-l border-border">
        {site.experience.map((job) => (
          <li key={`${job.company}-${job.period}`} className="relative pb-2 pl-6">
            <span
              aria-hidden
              className="absolute top-[0.6rem] -left-[4.5px] size-2 rounded-full bg-accent"
            />
            <h3 className="font-medium">
              {job.role} <span className="font-normal text-muted">· {job.company}</span>
            </h3>
            <p className="font-mono text-xs text-muted">{job.period}</p>
            <ul className="mt-3 max-w-3xl list-disc space-y-1.5 pl-4 text-muted marker:text-border">
              {job.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <div className="mt-4">
              <TagList tags={job.tags} label={`Technologies used at ${job.company}`} />
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
