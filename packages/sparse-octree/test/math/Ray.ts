import { it } from "node:test";
import assert from "node:assert/strict";
import { Ray } from "sparse-octree";

it("tests box intersections with an owned ray or structural coordinates", () => {

	const box = { min: { x: -1, y: -1, z: -1 }, max: { x: 1, y: 1, z: 1 } };
	const origin = { x: -2, y: 0, z: 0 };
	const direction = { x: 1, y: 1, z: 0 };
	const ray = new Ray(origin, direction);

	assert.equal(ray.intersectsBox(box), true, "a corner contact counts as an intersection");
	assert.equal(Ray.intersectsBox({ origin, direction }, box), true);

	direction.x = -1;
	assert.equal(Ray.intersectsBox({ origin, direction }, box), false, "the box lies behind the ray");
	assert.equal(ray.intersectsBox(box), true, "the ray owns its direction");

	origin.z = 2;
	direction.x = 1;
	assert.equal(Ray.intersectsBox({ origin, direction }, box), false, "the ray is parallel to an outside slab");
	assert.equal(ray.intersectsBox(box), true, "the ray owns its origin");

});
