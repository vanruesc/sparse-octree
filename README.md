# Sparse Octree

[![CI](https://github.com/vanruesc/sparse-octree/actions/workflows/ci.yml/badge.svg)](https://github.com/vanruesc/sparse-octree/actions/workflows/ci.yml)
[![Version](https://badgen.net/npm/v/sparse-octree?color=green)](https://www.npmjs.com/package/sparse-octree)
[![Peer dependencies](https://badgen.net/david/peer/vanruesc/sparse-octree)](https://david-dm.org/vanruesc/sparse-octree?type=peer)

A sparse, pointer-based octree data structure. For a linear implementation see [linear-octree](https://github.com/vanruesc/linear-octree).

*[Demo](https://vanruesc.github.io/sparse-octree/demo)&ensp;&middot;&ensp;[Sandbox](https://codesandbox.io/s/sparse-octree-3yn8o)&ensp;&middot;&ensp;[Documentation](https://vanruesc.github.io/sparse-octree/docs)*


## Installation

This library requires the peer dependency [three](https://github.com/mrdoob/three.js/).

```sh
npm install three sparse-octree
``` 


## Usage

##### Points

```js
import { Vector3 } from "three";
import { PointOctree } from "sparse-octree";

const min = new Vector3(-1, -1, -1);
const max = new Vector3(1, 1, 1);

const octree = new PointOctree(min, max);

const myData = {};
const p1 = new Vector3(0, 0, 0);
const p2 = new Vector3(0, 0, 0.5);

octree.set(p1, myData);
octree.move(p1, p2);
octree.get(p2); // => myData

octree.remove(p2);
octree.get(p2); // => null
```

##### Custom Octrees

```js
import { Octree, CubicOctant } from "sparse-octree";

export class CubicOctree extends Octree {

	constructor(min, size) {

		this.root = new CubicOctant(min, size);

	}

}
```


## Features

- Pointer-based structure
  - Handles octant splitting
  - Supports cubic octrees for reduced memory usage
  - Dynamic depth
- Adheres to a [common octant layout](https://vanruesc.github.io/sparse-octree/docs/index.html#layout)
- Supports raycasting
- Supports culling
- Can be extended to manage any data
- Provides a point management implementation


## Contributing

Maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.
