# AGENTS.md

## Working in this repository

- Inspect the relevant source code, tests, and documentation before making changes. Follow nearby conventions and keep
  changes focused on the request.
- Add JSDoc to new classes, class members, and functions, including private members and file-local helpers. Match the
  surrounding style and explain parameters, return values, and assumptions where they need clarification.
- Do not edit `package.json` unless the user explicitly asks for it.

## Exports and internal APIs

- Re-export new library modules through the relevant `index.ts` so tests can import them from `sparse-octree`.
- Mark implementation-only exports with `@internal`. TypeDoc and the published TypeScript declarations omit these
  symbols. Test tooling resolves types from source, and the test runner loads the built JavaScript bundle, where those
  exports remain available.

## Verification

- Prefer using the project's `pnpm` scripts.
  `pnpm run lint` checks files without modifying them. Use `pnpm run format` when ESLint fixes are needed.
- Run `pnpm test` for full verification. For a localized change, a focused run such as `node --test test/core/Octree.ts`
  is sufficient when it covers the affected behavior. Use the full suite for changes that affect multiple areas or
  shared behavior.
- `pnpm test` builds the project through `pretest`. If a test invocation bypasses `pretest`, run `pnpm run build:js`
  first whenever source files have changed.
- If a test fails and the cause is unclear, compare against the baseline. Use `HEAD` as the baseline for uncommitted
  changes and prefer a separate worktree to preserve the current working tree. Report which checks ran and identify any
  failures reproduced on the baseline.
