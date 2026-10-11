import { ArrowUpRight } from "lucide-react";
import { site } from "@/content/site";
import { BrandIcon } from "./icons";
import { Section, TagList } from "./section";

const linkClass =
  "text-accent hover:text-accent-hover inline-flex min-h-11 items-center gap-1.5 text-sm transition-colors";

export function Projects() {
  return (
    <Section id="projects" title="Projects">
      <div className="grid gap-4 lg:grid-cols-2">
        {site.projects.map((project) => {
          const titleId = `project-${project.name.toLowerCase()}`;
          return (
            <article
              key={project.name}
              aria-labelledby={titleId}
              className="flex flex-col rounded-card border border-border bg-surface p-5 sm:p-6"
            >
              <h3 id={titleId} className="font-medium">
                {project.name}
                <span className="font-normal text-muted"> — {project.tagline}</span>
              </h3>
              <p className="mt-3 text-muted">{project.description}</p>

              {project.highlights && (
                <ul className="mt-4 space-y-1 text-[0.9375rem]">
                  {project.highlights.map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <span aria-hidden className="font-mono text-accent">
                        –
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-auto pt-5">
                <TagList tags={project.tags} label={`${project.name} tech stack`} />
              </div>

              <div className="mt-3 -mb-2 flex flex-wrap gap-x-5">
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  <BrandIcon name="github" className="size-4" />
                  GitHub
                  <span className="sr-only"> repository for {project.name}</span>
                </a>
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    <ArrowUpRight size={16} aria-hidden />
                    Live
                    <span className="sr-only"> site for {project.name}</span>
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
