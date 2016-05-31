# Sparse Octree
[![Build status](https://travis-ci.org/vanruesc/sparse-octree.svg?branch=master)](https://travis-ci.org/vanruesc/sparse-octree) 
[![npm version](https://badge.fury.io/js/sparse-octree.svg)](http://badge.fury.io/js/sparse-octree) 
[![Dependencies](https://david-dm.org/vanruesc/sparse-octree.svg?branch=master)](https://david-dm.org/vanruesc/sparse-octree)

A sparse octree data structure for three.js. Sparse octrees can have empty nodes. Nodes that aren't empty can either have children themselves or they can be leaf nodes that contain point data. 

This octree doesn't support moving objects and its focus lies on managing point data. Support for triangles and dynamic updates is planned, but has low priority. 

## Preface

This module uses modern ECMAScript features and requires one of the following browsers:
 - Chrome ≥ 42
 - Firefox ≥ 45
 - IE Edge ≥ 13

[Semantic versioning](http://semver.org/) is used in this module to indicate whether an update 
introduces breaking changes. However, backwards-compatibility regarding ECMAScript versions is 
entirely neglected in favor of cleaner code and development convenience.


## Installation

```sh
$ npm install sparse-octree
``` 


## Usage

```javascript
// Attention: Three is not yet an ES6 module!
import {
  WebGLRenderer, Scene, PerspectiveCamera,
  Points, PointsMaterial, BoxBufferGeometry, Box3
} from "three";

import { Octree, OctreeHelper } from "sparse-octree";

let renderer = new WebGLRenderer();
let scene = new Scene();

let camera = new PerspectiveCamera();
scene.add(camera);

let points = new Points(
  new TorusKnotBufferGeometry(1, 1, 64, 64),
  new PointsMaterial({
    color: 0xffffff, size: 1, sizeAttenuation: false
  })
);

scene.add(points);

let bbox = new THREE.Box3();
bbox.setFromObject(scene);

let octree = new Octree(bbox.min, bbox.max, 0.0, 8, 8);
octree.addPoints(points.geometry.getAttribute("position").array, points);

scene.add(new OctreeHelper(octree));

(function render(now) {

  requestAnimationFrame(render);
  renderer.render(scene, camera);

}());
```


## Demo
[Octree Raycasting](http://vanruesc.github.io/sparse-octree/public/index.html)


## Documentation
[API](http://vanruesc.github.io/sparse-octree/docs)


## Contributing
Maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.


## License
[Zlib](https://github.com/vanruesc/sparse-octree/blob/master/LICENSE)  
