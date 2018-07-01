# Sparse Octree

[![Build status](https://travis-ci.org/vanruesc/sparse-octree.svg?branch=master)](https://travis-ci.org/vanruesc/sparse-octree) 
[![npm version](https://badge.fury.io/js/sparse-octree.svg)](http://badge.fury.io/js/sparse-octree) 
[![Peer dependencies](https://david-dm.org/vanruesc/sparse-octree/peer-status.svg)](https://david-dm.org/vanruesc/sparse-octree?type=peer)

A sparse octree data structure.

*[Extensive Demo](https://vanruesc.github.io/sparse-octree/public/demo) &there4;
[API Reference](https://vanruesc.github.io/sparse-octree/public/docs)*


## Installation

This library requires the peer dependencies [iterator-result](https://github.com/vanruesc/iterator-result) and [math-ds](https://github.com/vanruesc/math-ds).

```sh
npm install iterator-result math-ds sparse-octree
``` 


## Usage

##### Custom Octrees

```javascript
import { Octree, CubicOctant } from "sparse-octree";

export class CubicOctree extends Octree {

	constructor(min, size) {

		this.root = new CubicOctant(min, size);

	}

}
```

##### Points

```javascript
import { Vector3 } from "math-ds";
import { PointOctree } from "sparse-octree";

const min = new Vector3(-1, -1, -1);
const max = new Vector3(1, 1, 1);

const octree = new PointOctree(min, max);
const myData = {};

octree.put(new Vector3(0, 0, 0), myData);
octree.fetch(new Vector3(0, 0, 0)); // => myData
```

A full point octree example can be found [here](https://jsfiddle.net/6gt9fjmq/10/).


## Features

- Base Functionality
	- Pointer-based structure
  - Handles octant splitting
  - Adheres to a [common octant layout](http://vanruesc.github.io/sparse-octree/public/docs/variable/index.html#static-variable-pattern)
  - Supports raycasting
  - Supports culling
  - Supports cubic octrees
  - Can be extended to manage any data
- Provides a point management implementation


## Octree Helper

The [octree-helper](https://github.com/vanruesc/octree-helper) module provides
an octree visualisation tool for [three.js](https://threejs.org/).


## Contributing

Maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.
