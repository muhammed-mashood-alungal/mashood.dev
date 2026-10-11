import { Suspense } from "react";
import { Section } from "./section";
import { GithubCard, GithubCardSkeleton } from "./proof/github-card";
import { LeetcodeCard, LeetcodeCardSkeleton } from "./proof/leetcode-card";

export function ProofOfWork() {
  return (
    <Section id="proof" title="Proof of work">
      <div className="grid gap-4">
        <Suspense fallback={<GithubCardSkeleton />}>
          <GithubCard />
        </Suspense>
        <Suspense fallback={<LeetcodeCardSkeleton />}>
          <LeetcodeCard />
        </Suspense>
      </div>
    </Section>
  );
}
