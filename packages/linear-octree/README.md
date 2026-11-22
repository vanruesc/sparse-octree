# Linear Octree

[![CI](https://github.com/vanruesc/sparse-octree/actions/workflows/ci.yml/badge.svg)](https://github.com/vanruesc/sparse-octree/actions/workflows/ci.yml)
[![Version](https://badgen.net/npm/v/linear-octree?color=green)](https://www.npmjs.com/package/linear-octree)

A sparse, linear octree data structure. For a pointer-based implementation see [sparse-octree](https://github.com/vanruesc/sparse-octree).

*[Demo](https://vanruesc.github.io/sparse-octree/linear-octree/demo/)&ensp;&middot;&ensp;[Documentation](https://vanruesc.github.io/sparse-octree/linear-octree/docs/)*


## Installation

This library requires the peer dependency [three](https://github.com/mrdoob/three.js/).

```sh
npm install three linear-octree
``` 


## Usage

```ts
import { KeyDesign, Octree } from "linear-octree";
import { Box3, Vector3 } from "three";

// Define the bit distribution for the X-, Y- and Z-axis.
const keyDesign = new KeyDesign(4, 4, 4); // Tree depth = 4, 2^12 leaf octants

// Define the octree world bounds.
const bounds = new Box3();
bounds.min.set(-1, -1, -1);
bounds.max.set(1, 1, 1);
// Alternatively, define the bounds based on a cell size.
const cellSize = new Vector3(1, 1, 1);
const bounds = keyDesign.calculateBounds(cellSize, new Box3());

// Create the octree (this one stores strings).
const octree = new Octree<string>(bounds, keyDesign);

// Octree operations expect Uint key coordinates.
const keyCoordinates = new Vector3();
const worldPosition = new Vector3(0.5, 0.5, 0.5);
octree.calculateKeyCoordinates(worldPosition, keyCoordinates);

// Set and retrieve data.
const level = 0; // Octants of every level can store data.
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


## Contributing

Maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.
