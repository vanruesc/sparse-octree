import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { Box3, Vector3 } from "three";
import { KeyDesign, Octree } from "linear-octree";

const bounds = new Box3(
	new Vector3(-1, -1, -1),
	new Vector3(1, 1, 1)
);

const p = new Vector3();
const v = new Vector3();
const keyCoordinates = new Vector3();

describe("Octree", () => {

	it("can be instantiated", () => {

		const keyDesign = new KeyDesign(1, 1, 1);
		assert.doesNotThrow(() => new Octree(bounds, keyDesign));

	});

	it("can return its depth", () => {

		const keyDesign = new KeyDesign(32, 0, 21);
		const octree = new Octree(bounds, keyDesign);
		const levels = 1 + Math.max(keyDesign.x, keyDesign.y, keyDesign.z);
		assert.equal(octree.getDepth(), levels - 1, "should return the tree depth");
		assert.equal(octree.getLevels(), levels, "should return the levels");

	});

	it("correctly calculates key coordinates", () => {

		const keyDesign = new KeyDesign(21, 11, 21);
		const octree = new Octree(bounds, keyDesign);

		p.set(1, 1, 1);
		keyDesign.getMaxKeyCoordinates(v);
		octree.calculateKeyCoordinates(p, 0, keyCoordinates);
		let key = keyDesign.packKey(keyCoordinates.x, keyCoordinates.y, keyCoordinates.z);

		assert.deepEqual(keyCoordinates, v, "should return the max key coordinates");
		assert.equal(key, keyDesign.packKey(v.x, v.y, v.z), "should return the last key");

		p.set(0, 0, 0);
		v.divideScalar(2).round();
		octree.calculateKeyCoordinates(p, 0, keyCoordinates);
		key = keyDesign.packKey(keyCoordinates.x, keyCoordinates.y, keyCoordinates.z);

		assert.deepEqual(keyCoordinates, v, "should return the center (+0.5) key coordinates");
		assert.equal(key, keyDesign.packKey(v.x, v.y, v.z), "should return the center (+0.5) key");

	});

	it("can set and get data", () => {

		const keyDesign = new KeyDesign(2, 2, 2);
		const octree = new Octree(bounds, keyDesign);
		const data = "text";

		p.set(0.5, 0, 0);
		octree.calculateKeyCoordinates(p, 0, keyCoordinates);
		octree.set(keyCoordinates, 0, data);

		assert.equal(octree.get(keyCoordinates, 0), data, "should return the data");

	});

	it("can delete data", () => {

		const keyDesign = new KeyDesign(2, 2, 2);
		const octree = new Octree(bounds, keyDesign);
		const data = "text";

		p.set(0.5, 0, 0);
		octree.calculateKeyCoordinates(p, 0, keyCoordinates);
		octree.set(keyCoordinates, 0, data);
		octree.delete(keyCoordinates, 0);

		assert.notEqual(octree.get(keyCoordinates, 0), data, "should no longer have the data");

	});

	it("can get an octant by point", () => {

		const keyDesign = new KeyDesign(2, 2, 2);
		const octree = new Octree(bounds, keyDesign);
		const data = "text";

		p.set(0, 0, 0);
		octree.calculateKeyCoordinates(p, 0, keyCoordinates);
		octree.set(keyCoordinates, 0, null);

		p.set(1, 0.1, -0.7);
		octree.calculateKeyCoordinates(p, 0, keyCoordinates);
		octree.set(keyCoordinates, 0, data);

		const octant = octree.getOctantByPoint(p, 0);

		assert.equal(octant?.data, data, "should find the right octant");

	});

	it("finds nodes by depth level", () => {

		const keyDesign = new KeyDesign(2, 2, 2);
		const octree = new Octree(bounds, keyDesign);
		octree.set(keyCoordinates.set(0, 0, 0), 0, "test");

		const nodes = octree.findNodesByLevel(0);

		assert.ok(Array.isArray(nodes), "should return a list");
		assert.equal(nodes.length, 1, "should find all nodes");

	});

});
