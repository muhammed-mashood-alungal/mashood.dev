import { site } from "@/content/site";
import { Section } from "./section";
import { SkillsList } from "./skills-list";

export function Skills() {
  return (
    <Section id="skills" title="Skills">
      <SkillsList categories={site.skills} />
    </Section>
  );
}
