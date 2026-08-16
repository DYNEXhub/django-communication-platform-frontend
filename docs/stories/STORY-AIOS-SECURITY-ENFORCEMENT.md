# STORY-AIOS-SECURITY-ENFORCEMENT — Repository security gates

**Status:** InProgress
**Canonical story:** `/Users/sobral/AIOS/docs/stories/STORY-AIOS-SECURITY-ENFORCEMENT/spec/story.md`

## Scope

Add blocking dependency, secret-history and CodeQL gates; pin supply-chain
actions; configure weekly dependency updates; and publish a private disclosure
policy. No production systems are scanned or mutated.

## Acceptance evidence

- `npm audit --audit-level=high` passes or the repository remains explicitly blocked.
- Current-tree and full-history Gitleaks scans pass after exact fixture review.
- Workflow YAML parses and all action references are immutable commit SHAs.
- Existing project quality gates are re-run before handoff.

