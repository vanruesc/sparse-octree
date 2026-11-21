import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { Box3, Vector3 } from "three";
import { Octant } from "sparse-octree";

const box = new Box3(
	new Vector3(-1, -1, -1),
	new Vector3(1, 1, 1)
);

describe("Octant", () => {

	it("can be instantiated", () => {

		assert.doesNotThrow(() => new Octant());

	});

	it("can compute its center", () => {

		const octant = new Octant(box.min, box.max);

		assert.ok(
			octant.getCenter(new Vector3()).equals(new Vector3(0, 0, 0)),
			"should be able to compute its center"
		);

	});

	it("can compute its dimensions", () => {

		const octant = new Octant(box.min, box.max);

		assert.ok(
			octant.getDimensions(new Vector3()).equals(new Vector3(2, 2, 2)),
			"should be able to compute its dimensions"
		);

	});

	it("can be split", () => {

		const octant = new Octant(box.min, box.max);

		octant.split();

		assert.equal(octant.children?.length, 8, "should create eight children");

	});

});
