# AGENTS.md

## Agent guidance

* Follow existing project patterns and inspect relevant source code, tests, and documentation before making assumptions.
* New classes, class members and functions should include appropriate documentation comments.
* Keep changes focused and avoid unrelated refactoring.
* Use the project's scripts rather than invoking underlying tools directly.
* `pnpm run lint` is read-only; use `pnpm run format` when ESLint fixes are needed.
* Use `pnpm run build:js` before running unit tests if sources have been changed.
* Distinguish pre-existing test failures from regressions introduced by the change.
  If necessary, compare against the pristine baseline using `git stash` or a separate `git worktree`.
* Do not change `package.json` unless explicitly asked to do so.

Before considering a change complete, run `pnpm test` or a more focused test for final verification.
