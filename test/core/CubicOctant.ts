import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { Box3, Vector3 } from "three";
import { CubicOctant } from "sparse-octree";

const box = new Box3(
	new Vector3(-1, -1, -1),
	new Vector3(1, 1, 1)
);

describe("CubicOctant", () => {

	it("can be instantiated", () => {

		assert.doesNotThrow(() => new CubicOctant());

	});

	it("can compute its center", () => {

		const octant = new CubicOctant(box.min, 2);

		assert.ok(
			octant.getCenter(new Vector3()).equals(new Vector3(0, 0, 0)),
			"should be able to compute its center"
		);

	});

	it("can compute its dimensions", () => {

		const octant = new CubicOctant(box.min, 2);

		assert.ok(
			octant.getDimensions(new Vector3()).equals(new Vector3(2, 2, 2)),
			"should be able to compute its dimensions"
		);

	});

	it("can be split", () => {

		const octant = new CubicOctant(box.min, 2);

		octant.split();

		assert.equal(octant.children?.length, 8, "should create eight children");

	});

});
