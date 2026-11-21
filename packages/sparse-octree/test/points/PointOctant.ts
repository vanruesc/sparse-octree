import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { Box3, Vector3 } from "three";
import { PointOctant } from "sparse-octree";

const box = new Box3(
	new Vector3(-1, -1, -1),
	new Vector3(1, 1, 1)
);

describe("PointOctant", () => {

	it("can be instantiated", () => {

		assert.doesNotThrow(() => new PointOctant(box.min, box.max));

	});

	it("correctly computes the distance to a point", () => {

		const octant = new PointOctant(
			new Vector3(-1, -1, -1),
			new Vector3(1, 1, 1)
		);

		const point = new Vector3(1, 2, 3);

		assert.equal(
			octant.distanceToSquared(point),
			octant.max.distanceToSquared(point),
			"should calculate the squared distance"
		);

	});

	it("correctly computes the distance from its center to a point", () => {

		const octant = new PointOctant(
			new Vector3(-1, -1, -1),
			new Vector3(1, 1, 1)
		);

		const point = new Vector3(1, 2, 3);

		assert.equal(
			octant.distanceToCenterSquared(point),
			octant.getCenter(new Vector3()).distanceToSquared(point),
			"should calculate the squared distance"
		);

	});

	it("can determine whether a point lies inside it", () => {

		const octant = new PointOctant(
			new Vector3(-1, -1, -1),
			new Vector3(1, 1, 1)
		);

		const point = new Vector3(0, 0, 0);

		assert.equal(octant.contains(point.set(0, 0, 0), 0), true, "should determine that it contains the point");
		assert.equal(octant.contains(point.set(2, 0, 0), 0), false, "should determine that the point lies outside");

	});

});
