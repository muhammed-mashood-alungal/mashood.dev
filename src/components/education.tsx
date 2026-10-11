import { Award } from "lucide-react";
import { site } from "@/content/site";
import { Section } from "./section";

export function Education() {
  return (
    <Section id="education" title="Education & recognition">
      <ul className="grid gap-4 sm:grid-cols-2">
        {site.education.map((item) => (
          <li key={item.title}>
            <h3 className="font-medium">
              {item.title} <span className="font-normal text-muted">· {item.org}</span>
            </h3>
            <p className="font-mono text-xs text-muted">{item.period}</p>
            {item.description && (
              <p className="mt-1 text-sm text-muted">{item.description}</p>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-6 flex gap-2.5 border-t border-border pt-5 text-sm text-muted">
        <Award size={16} aria-hidden className="mt-1 shrink-0 text-accent" />
        <span>
          <span className="text-fg">Recognition:</span> {site.recognition}
        </span>
      </p>
    </Section>
  );
}
