# Agent Instructions

AI-powered LinkedIn marketing engine. Topics are planned, AI drafts content and
visuals, humans review and approve, approved posts publish via Buffer.

## Read before writing code

| Working on | Read first |
|---|---|
| Lambda, CDK, Mongoose, layers, workers, cron, integrations | `skills/backend-aws-lambda/SKILL.md` |
| React, Vite, Tailwind, shadcn, any UI or design | `skills/frontend-react-vite/SKILL.md` |

These are not suggestions. If your change touches either side, read that file
before writing, and run its checklist before reporting done.

## Stack

- **Backend:** AWS CDK + Lambda (ARM64), Node, shared Lambda Layers
  (`modules_layer` for deps, `utils_layer` mounted at `/opt/nodejs` for shared app
  code), domain-grouped Lambdas, config-driven routing via
  `config/functions-config.json`, MongoDB Atlas + Mongoose (Atlas Vector Search
  for embeddings), SQS + Step Functions for async work, EventBridge for cron. Local dev runs on `server.local.js`, which
  patches Node's resolver so `/opt/nodejs/*` maps to the layer folder.
- **Frontend:** React + Vite + TypeScript, Tailwind + shadcn/ui, TanStack Query,
  React Hook Form + zod.
- **Shared contract:** zod schemas in `layers/utils_layer/nodejs/contracts/`,
  published to the frontend as a package. Single source of truth for every
  request and response. Nobody hand-writes an API type on either side.

## The three priorities, in order

1. **Speed.** p95 under 100 ms on our own APIs. Anything involving an LLM, image
   generation, PDF rendering, or a publishing API is asynchronous — accept, queue,
   return 202, report status. There are no exceptions to this.
2. **Modularity.** Feature-scoped folders with one public entry point. Strict
   dependency direction. Every module should be deletable in an afternoon.
3. **Adaptability.** Requirements change often. Thresholds, limits, rules and
   windows live in config or the database, not in conditionals. The post
   lifecycle is one explicit state machine in
   `layers/utils_layer/nodejs/domain/post-status.js`. Routes are declared in
   `functions-config.json`, never hardcoded in CDK. Migrations are additive and
   forward-only. Routes are versioned at `/v1`.

## Shared conventions

- Frontend is TypeScript `strict`, no `any`. Backend follows the existing
  CommonJS style — keep it consistent, and use zod (plus JSDoc where it helps)
  for the type safety TypeScript would otherwise give you. Named exports on both
  sides.
- Validation at every boundary with zod, using the shared schema.
- UTC ISO strings on the wire; format at the edges.
- All data access goes through a repository. Mongoose models are never imported
  by a controller or service.
- Post status is a single shared enum. Adding a state means updating the
  transition map, the badge component, and the calendar filter — all three, in
  the same PR.
- Adding an endpoint always starts with `functions-config.json` and a contract
  schema. If those two steps didn't happen, the endpoint isn't real.
- Structured logs with a `requestId` that the frontend surfaces in error states.

## Working style

- Do not add a dependency without saying why in the PR description and checking
  the bundle impact.
- Do not create a new top-level directory without asking.
- Do not abstract on the first instance. Duplicate twice, extract on the third.
- When a requirement is ambiguous, state your assumption in a comment and keep
  moving — do not invent scope.
