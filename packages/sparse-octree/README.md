# Sparse Octree

[![CI](https://github.com/vanruesc/sparse-octree/actions/workflows/ci.yml/badge.svg)](https://github.com/vanruesc/sparse-octree/actions/workflows/ci.yml)
[![Version](https://badgen.net/npm/v/sparse-octree?color=green)](https://www.npmjs.com/package/sparse-octree)

A sparse, pointer-based octree data structure.

*[Demo](https://vanruesc.github.io/sparse-octree/demo/)&ensp;&middot;&ensp;[Sandbox](https://codesandbox.io/s/sparse-octree-3yn8o)&ensp;&middot;&ensp;[Documentation](https://vanruesc.github.io/sparse-octree/docs/)*

## Installation

```sh
npm install sparse-octree
``` 

## Usage

##### Points

```js
import { PointOctree } from "sparse-octree";

const min = { x: -1, y: -1, z: -1 };
const max = { x: 1, y: 1, z: 1 };

const octree = new PointOctree(min, max);

const myData = {};
const p1 = { x: 0, y: 0, z: 0 };
const p2 = { x: 0, y: 0, z: 0.5 };

octree.set(p1, myData);
octree.move(p1, p2);
octree.get(p2); // => myData

const hit = octree.raycastClosest({
	ray: {
		origin: { x: 0, y: 0, z: 2 },
		direction: { x: 0, y: 0, z: -1 }
	},
	threshold: 0.1
});

hit?.data; // => myData

octree.remove(p2);
octree.get(p2); // => null
```

`raycastClosest()` returns `null` if there is no hit. Use `raycast()` to get all hits, nearest first.

Bounds and points accept any object with numeric `x`, `y`, and `z` coordinates. The tree copies the constructor
bounds and stored points. Query results expose coordinates, which you can copy into your rendering framework's vectors.
Point raycasts expect a unit direction. Three.js vectors and raycasters can still be supplied directly.

Use an `intersectsBox(box)` method to cull nodes. The supplied box exposes `min` and `max` coordinates.

##### Custom Octrees

```js
import { Octree, CubicOctant } from "sparse-octree";

export class CubicOctree extends Octree {

	constructor(min, size) {

		super(new CubicOctant(min, size));

	}

}
```

## Features

- Pointer-based structure
  - Handles octant splitting
  - Supports cubic octrees for reduced memory usage
  - Dynamic depth
- Adheres to a [common octant layout](https://vanruesc.github.io/sparse-octree/docs/variables/layout.html)
- Supports raycasting
- Supports culling
- Can be extended to manage any data
- Provides a point management implementation

## Compatibility

See the [compatibility guide](https://github.com/vanruesc/sparse-octree/blob/main/COMPATIBILITY.md) for renderer-specific
examples of vectors, rays, and culling.

## Contributing

Maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.
