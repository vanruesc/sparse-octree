import { it } from "node:test";
import assert from "node:assert/strict";
import { type BoxIntersector, PointOctree, type RaycasterLike } from "sparse-octree";

it("copies input coordinates and supports plain vectors, rays, and cull intersectors", () => {

	const min = { x: -1, y: -1, z: -1 };
	const max = { x: 1, y: 1, z: 1 };
	const octree = new PointOctree<string>(min, max, 0, 1);
	const p = { x: 0, y: 0, z: 0 };
	octree.set(p, "center");
	octree.set({ x: -0.5, y: -0.5, z: -0.5 }, "other");

	min.x = -10;
	max.y = 10;
	p.x = 10;

	const target = { x: 0, y: 0, z: 0 };
	assert.strictEqual(octree.getDimensions(target), target);
	assert.deepEqual(target, { x: 2, y: 2, z: 2 });
	assert.strictEqual(octree.getCenter(target), target);
	assert.deepEqual(target, { x: 0, y: 0, z: 0 });

	const intersector: BoxIntersector = { intersectsBox: box => box.max.x > 0 };
	assert.deepEqual(octree.cull(intersector), [...octree.leaves(intersector)]);
	assert.equal(octree.cull(intersector).length, 4);

	const raycaster: RaycasterLike = {
		ray: { origin: { x: 0, y: 0, z: 2 }, direction: { x: 0, y: 0, z: -1 } },
		threshold: 0.1,
		near: 2,
		far: 2
	};

	const hit = octree.raycastClosest(raycaster);
	assert.equal(hit?.data, "center");
	assert.deepEqual({ ...hit?.point }, target);
	assert.ok(hit !== null && hit.point !== null);
	hit.point.x = 10;

	const nearest = octree.findNearestPoint(target);
	assert.equal(nearest?.data, "center");
	assert.ok(nearest !== null && nearest.point !== null);
	nearest.point.y = 10;
	assert.equal(octree.get(target), "center");

});
