import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { Raycaster, Vector3 } from "three";
import { Octant, Octree } from "sparse-octree";

const root = new Octant(
	new Vector3(-1, -1, -1),
	new Vector3(1, 1, 1)
);

describe("OctreeRaycaster", () => {

	it("can find intersecting octants", () => {

		const raycaster = new Raycaster(
			new Vector3(0.5, 0.5, 2),
			new Vector3(0, 0, -1)
		);

		root.split();

		const octree = new Octree(root);
		const intersects = octree.getIntersectingNodes(raycaster);

		assert.equal(intersects.length, 2, "should return 2 intersecting octants");
		assert.equal(intersects[0], root.children![7], "should return octant #8");

	});

});
