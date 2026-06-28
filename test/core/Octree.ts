import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { Vector3 } from "three";
import { CubicOctant, Octant, Octree } from "sparse-octree";

const root = new Octant(
	new Vector3(-1, -1, -1),
	new Vector3(1, 1, 1)
);

describe("Octree", () => {

	it("can be instantiated", () => {

		assert.doesNotThrow(() => new Octree(new Octant<number>(
			new Vector3(-1, -1, -1),
			new Vector3(1, 1, 1)
		)));

		assert.doesNotThrow(() => new Octree(new CubicOctant<string>(
			new Vector3(-1, -1, -1),
			2
		)));

	});

	it("can compute its center", () => {

		const octree = new Octree(root);

		assert.ok(
			octree.getCenter(new Vector3()).equals(new Vector3(0, 0, 0)),
			"should be able to compute its center"
		);

	});

	it("can compute its dimensions", () => {

		const octree = new Octree(root);

		assert.ok(
			octree.getDimensions(new Vector3()).equals(new Vector3(2, 2, 2)),
			"should be able to compute its dimensions"
		);

	});

	it("can compute its depth", () => {

		root.split();
		root.children![0].split();
		root.children![0].children![0].split();

		const octree = new Octree(root);

		assert.equal(octree.getDepth(), 3, "should be able to compute the current tree depth");

	});

	it("finds octants by depth level", () => {

		root.split();
		root.children![0].split();
		root.children![7].split();

		const octree = new Octree(root);
		const octants = octree.findNodesByLevel(2);

		assert.ok(Array.isArray(octants), "should return a list");
		assert.equal(octants.length, 16, "should find all octants");

	});

});
