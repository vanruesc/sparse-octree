# Sparse Octree
[![Build status](https://travis-ci.org/vanruesc/sparse-octree.svg?branch=master)](https://travis-ci.org/vanruesc/sparse-octree) 
[![npm version](https://badge.fury.io/js/sparse-octree.svg)](http://badge.fury.io/js/sparse-octree) 
[![Dependencies](https://david-dm.org/vanruesc/sparse-octree.svg?branch=master)](https://david-dm.org/vanruesc/sparse-octree)

A sparse octree data structure for three.js. Sparse octrees can have empty nodes. 
Nodes that aren't empty can either have children themselves or they can be leaf nodes that contain data. 


## Installation

```sh
$ npm install sparse-octree
``` 


## Usage

```javascript
// Attention: Three is not yet an ES6 module!
import { Vector3 } from "three";
import { PointOctree } from "sparse-octree";

const min = new Vector3(-1, -1, -1);
const max = new Vector3(1, 1, 1);

const octree = new PointOctree(min, max);
octree.add(new Vector3(0, 0, 0), {});
octree.fetch(new Vector3(0, 0, 0)); // {}
```

A full scene setup can be found [here](https://jsfiddle.net/py89hgn3/2/).


## Extensive Demo
[Octree Features](http://vanruesc.github.io/sparse-octree/public/index.html)


## Documentation
[API](http://vanruesc.github.io/sparse-octree/docs)


## Contributing
Maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.


## License
[Zlib](https://github.com/vanruesc/sparse-octree/blob/master/LICENSE)  
