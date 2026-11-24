# Octree workspace

## Packages

- [`sparse-octree`](./packages/sparse-octree/) — A sparse, pointer-based octree library. [API documentation](https://vanruesc.github.io/sparse-octree/docs/)
- [`linear-octree`](./packages/linear-octree/) — A sparse, linear octree library. [API documentation](https://vanruesc.github.io/sparse-octree/linear-octree/docs/)
- [`octree-helper`](./packages/octree-helper/) — A Three.js wireframe helper for both octree libraries. [API documentation](https://vanruesc.github.io/sparse-octree/octree-helper/docs/)

See the [compatibility guide](./COMPATIBILITY.md) for using either octree library with different rendering frameworks.

## Demos

- [`sparse-octree-demo`](./apps/sparse-octree-demo/) — An interactive Three.js demo. [Live demo](https://vanruesc.github.io/sparse-octree/demo/)
- [`linear-octree-demo`](./apps/linear-octree-demo/) — An interactive Three.js demo. [Live demo](https://vanruesc.github.io/sparse-octree/linear-octree/demo/)

## Development

- `pnpm install` installs workspace dependencies.
- `pnpm build` builds the libraries, API docs, and demos.
- `pnpm test` runs the library tests and checks the demo builds and types.
- `pnpm watch` rebuilds on changes and serves the sparse and linear demos at `http://localhost:3000/demo/` and
  `http://localhost:3001/demo/`, respectively.
- `pnpm run -r deploy` stages the docs and demos in the root `public/` directory.
