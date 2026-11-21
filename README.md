# Octree workspace

## Packages

- [`sparse-octree`](./packages/sparse-octree/) — A sparse, pointer-based octree library. [API documentation](https://vanruesc.github.io/sparse-octree/docs/)

## Demos

- [`sparse-octree-demo`](./apps/sparse-octree-demo/) — An interactive Three.js demo. [Live demo](https://vanruesc.github.io/sparse-octree/demo/)

## Development

- `pnpm install` installs workspace dependencies.
- `pnpm build` builds the library, API docs, and demo.
- `pnpm test` runs the library tests and checks the demo build and types.
- `pnpm watch` rebuilds both projects on changes and serves the demo at `/demo/`.
- `pnpm run -r deploy` moves the built docs and demo to `public/docs/` and `public/demo/`.
