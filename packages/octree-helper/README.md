# Octree Helper

A Three.js wireframe helper for both octree libraries.

[Sparse octree docs](https://vanruesc.github.io/sparse-octree/docs/) ·
[Linear octree docs](https://vanruesc.github.io/sparse-octree/linear-octree/docs/)

```js
import { OctreeHelper } from "octree-helper";

const helper = new OctreeHelper(octree);
scene.add(helper);
```

Call `helper.update()` after the octree changes and `helper.dispose()` to release its geometry and materials.
