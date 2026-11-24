# Compatibility

Sparse Octree accepts any point or vector with numeric `x`, `y`, and `z` coordinates. It works with plain objects
and can be used independently of a renderer.

| Framework | How to use it |
| --- | --- |
| **Three.js / React Three Fiber** | Pass `Vector3` values directly. Point raycasts accept a Three.js `Raycaster`, including the one available through `useThree`. Pass a Three.js `Frustum` directly to `cull()`. [Three.js Raycaster](https://threejs.org/docs/pages/Raycaster.html) · [Three.js Frustum](https://threejs.org/docs/pages/Frustum.html) · [React Three Fiber hooks](https://r3f.docs.pmnd.rs/api/hooks) |
| **Babylon.js** | Pass `Vector3` values directly. Use `{ ray, threshold, far: ray.length }` for a point raycast with a finite Babylon.js ray. For a world-space tree, use the bounding box's `minimumWorld` and `maximumWorld`. [Ray source](https://github.com/BabylonJS/Babylon.js/blob/master/packages/dev/core/src/Culling/ray.core.ts#L53-L77) · [Bounding boxes](https://doc.babylonjs.com/features/featuresDeepDive/mesh/displayBoundingBoxes/) |
| **PlayCanvas** | Pass `Vec3` values directly and use `{ ray, threshold }` for point raycasts. Read the tree bounds from `BoundingBox.getMin()` and `getMax()`. [Ray](https://api.playcanvas.com/engine/classes/Ray.html) · [BoundingBox](https://api.playcanvas.com/engine/classes/BoundingBox.html) |
| **PixiJS** | With `@pixi/3d`, pass its `Vector3` values directly and use `{ ray: view.screenToRay(point), threshold }` for point raycasts. With 2D PixiJS, convert a `Point` to `{ x: point.x, y: point.y, z: 0 }` to index it on a plane. [PixiJS 3D coordinates](https://pixijs.com/3d/guides/concepts/view3d) · [2D Point](https://pixijs.download/release/docs/maths.Point.html) |
| **CesiumJS** | Pass `Cartesian3` values directly. Wrap a Cesium `Ray` as `{ ray, threshold }` for point raycasts, and use `AxisAlignedBoundingBox.minimum` and `maximum` for tree bounds. [Ray](https://cesium.com/learn/cesiumjs/ref-doc/Ray.html) · [AxisAlignedBoundingBox](https://cesium.com/learn/cesiumjs/ref-doc/AxisAlignedBoundingBox.html) |

Keep indexed points, bounds, and rays in the same coordinate space. Use a unit-length direction for point
raycasts. For engine-specific culling, adapt the engine's visibility test to `intersectsBox({ min, max })`.
