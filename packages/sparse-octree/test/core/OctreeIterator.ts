import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { Box3, Vector3 } from "three";
import { Octant, OctreeIterator, Octree } from "sparse-octree";

const root = new Octant(
	new Vector3(-1, -1, -1),
	new Vector3(1, 1, 1)
);

const region = new Box3(
	new Vector3(0.1, 0.1, 0.1),
	new Vector3(0.2, 0.2, 0.2)
);

describe("OctreeIterator", () => {

	it("can be instantiated", () => {

		assert.doesNotThrow(() => new OctreeIterator(new Octree(root)));

	});

	it("iterates over all leaf octants", () => {

		root.split();

		const octree = new Octree(root);
		const iterator = octree.leaves();

		let i = 0;

		while(!(iterator.next().done ?? false)) {

			++i;

		}

		assert.equal(i, 8, "should return eight leaf octants");

	});

	it("can cull leaf octants", () => {

		root.split();

		const octree = new Octree(root);
		const iterator = octree.leaves(region);

		let i = 0;

		while(!(iterator.next().done ?? false)) {

			++i;

		}

		assert.equal(i, 1, "should return one leaf octant");

	});

});
