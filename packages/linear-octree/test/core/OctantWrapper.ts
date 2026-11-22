import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { Box3, Vector3 } from "three";
import { Octant, OctantWrapper } from "linear-octree";

const box = new Box3(
	new Vector3(-1, -1, -1),
	new Vector3(1, 1, 1)
);

describe("OctantWrapper", () => {

	it("can be instantiated", () => {

		assert.doesNotThrow(() => new OctantWrapper());

	});

	it("can compute its center", () => {

		const octantWrapper = new OctantWrapper(new Octant());
		octantWrapper.min.copy(box.min);
		octantWrapper.max.copy(box.max);

		assert.ok(
			octantWrapper.getCenter(new Vector3()).equals(new Vector3(0, 0, 0)),
			"should be able to compute its center"
		);

	});

	it("can compute its dimensions", () => {

		const octantWrapper = new OctantWrapper(new Octant());
		octantWrapper.min.copy(box.min);
		octantWrapper.max.copy(box.max);

		assert.ok(
			octantWrapper.getDimensions(new Vector3()).equals(new Vector3(2, 2, 2)),
			"should be able to compute its dimensions"
		);

	});

	it("can check if it contains a point", () => {

		const octantWrapper = new OctantWrapper(new Octant());
		octantWrapper.min.copy(box.min);
		octantWrapper.max.copy(box.max);

		assert.ok(
			octantWrapper.containsPoint(new Vector3(0, 0, 0)),
			"should determine that the point lies inside"
		);

		assert.equal(
			octantWrapper.containsPoint(new Vector3(2, 0, 0)),
			false,
			"should determine that the point lies outside"
		);

	});

});
