# Linear Octree

[![CI](https://github.com/vanruesc/sparse-octree/actions/workflows/ci.yml/badge.svg)](https://github.com/vanruesc/sparse-octree/actions/workflows/ci.yml)
[![Version](https://badgen.net/npm/v/linear-octree?color=green)](https://www.npmjs.com/package/linear-octree)

A sparse, linear octree data structure.

*[Demo](https://vanruesc.github.io/sparse-octree/linear-octree/demo/)&ensp;&middot;&ensp;[Documentation](https://vanruesc.github.io/sparse-octree/linear-octree/docs/)*

## Installation

```sh
npm install linear-octree
```

## Usage

```ts
import { KeyDesign, Octree } from "linear-octree";

// Define the bit distribution for the X-, Y- and Z-axis.
const keyDesign = new KeyDesign(4, 4, 4); // Tree depth = 4, 2^12 leaf octants

// Define the octree world bounds.
const bounds = {
	min: { x: -1, y: -1, z: -1 },
	max: { x: 1, y: 1, z: 1 }
};
// Alternatively, derive the bounds from a cell size.
// keyDesign.calculateBounds({ x: 1, y: 1, z: 1 }, bounds);

// Create the octree (this one stores strings).
const octree = new Octree<string>(bounds, keyDesign);

// Octree operations expect Uint key coordinates.
const level = 0; // Octants of every level can store data.
const keyCoordinates = { x: 0, y: 0, z: 0 };
const worldPosition = { x: 0.5, y: 0.5, z: 0.5 };
octree.calculateKeyCoordinates(worldPosition, level, keyCoordinates);

// Set and retrieve data.
octree.set(keyCoordinates, level, "my data");
octree.get(keyCoordinates, level); // => "my data"
octree.delete(keyCoordinates, level);
octree.get(keyCoordinates, level); // => undefined
```

## Key Design

```ts
// The largest uniform octree can contain 2^51 octants.
const keyDesign = new KeyDesign(17, 17, 17);
// Octrees can be non-uniform with uneven bit distributions.
const keyDesign = new KeyDesign(21, 11, 21);
// Bits can be set to zero to emulate a quad tree.
const keyDesign = new KeyDesign(26, 0, 26);
```

## Features

- Linear structure
  - Packs positional data into numeric keys
  - Constant time access to octants, parents and neighbors at any depth level
  - Low memory usage (no explicit positional data stored in octants)
- Adheres to a [common octant layout](https://vanruesc.github.io/sparse-octree/docs/variables/layout.html)
- Supports raycasting
- Supports culling
- Can be extended to manage any data
- Fully customizable 3-dimensional subdivisions

## Compatibility

See the [compatibility guide](https://github.com/vanruesc/sparse-octree/blob/main/COMPATIBILITY.md)
for renderer-specific examples of vectors, rays, and culling.

## Contributing

Maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.
