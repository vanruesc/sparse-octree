import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { Octant } from "linear-octree";

describe("CubicOctant", () => {

	it("can be instantiated", () => {

		assert.doesNotThrow(() => new Octant());

	});

});
