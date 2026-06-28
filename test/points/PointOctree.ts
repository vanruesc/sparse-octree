import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { Box3, Raycaster, Vector3 } from "three";
import { PointOctree } from "sparse-octree";

const box = new Box3(
	new Vector3(-1, -1, -1),
	new Vector3(1, 1, 1)
);

const data0 = {};
const data1 = {};
const data2 = {};

describe("PointOctree", () => {

	it("can be instantiated", () => {

		assert.doesNotThrow(() => new PointOctree(box.min, box.max));

	});

	it("can add a point", () => {

		const octree = new PointOctree(box.min, box.max, 0.0, 1, 1);

		assert.ok(octree.set(new Vector3(0, 0, 0), data0), "should succeed");
		assert.equal(octree.countPoints(), 1, "should be able to add a point");

	});

	it("overwrites duplicates", () => {

		const octree = new PointOctree(box.min, box.max, 0.0, 1, 1);
		const p1 = new Vector3(0, 0, 0);
		const p2 = new Vector3(1, 0, 0);

		octree.set(p1, data0);
		octree.set(p1, data1);
		octree.set(p2, data0);
		octree.set(p2, data2);

		assert.equal(octree.countPoints(), 2, "should overwrite duplicates");
		assert.equal(octree.get(p1), data1, "should find the correct data");
		assert.equal(octree.get(p2), data2, "should find the correct data");

	});

	it("can remove a point", () => {

		const octree = new PointOctree(box.min, box.max, 0.0, 1, 1);

		octree.set(new Vector3(0, 0, 0), data0);

		assert.equal(octree.remove(new Vector3(0, 0, 0)), data0, "should return the data of the removed point");
		assert.equal(octree.countPoints(), 0, "should remove a point completely");

	});

	it("can look a point up", () => {

		const octree = new PointOctree(box.min, box.max, 0.0, 1, 1);

		assert.equal(octree.get(new Vector3(0, 0, 0)), null, "should return null if there is no point");

		octree.set(new Vector3(0, 0, 0), data0);

		assert.equal(octree.get(new Vector3(0, 0, 0)), data0, "should find points and return their data");

	});

	it("adds points to intersecting octants", () => {

		const octree = new PointOctree(box.min, box.max, 0.0, 1, 1);

		octree.set(new Vector3(2, 0, 0), data0);

		assert.equal(octree.countPoints(), 0, "should not add if the point lies outside");

	});

	it("splits octants that are at maximum capacity", () => {

		const octree = new PointOctree(box.min, box.max, 0.0, 1, 1);

		octree.set(new Vector3(0, 0, 0), data0);
		octree.set(new Vector3(1, 0, 0), data1);

		assert.equal(octree.getDepth(), 1, "should split octants when necessary");
		assert.equal(octree.countPoints(), 2, "should not lose any points during a split");

	});

	it("merges octants if possible", () => {

		const octree = new PointOctree(box.min, box.max, 0.0, 1, 2);

		octree.set(new Vector3(0, 0, 0), data0);
		octree.set(new Vector3(1, 0, 0), data1);
		octree.set(new Vector3(0.9, 0, 0), data2);

		octree.remove(new Vector3(1, 0, 0));

		assert.equal(octree.getDepth(), 1, "should merge octants when possible");

	});

	it("can move points", () => {

		const octree = new PointOctree(box.min, box.max, 0.0, 1, 2);

		octree.set(new Vector3(0.5, 0.5, 0.5), data0);
		octree.set(new Vector3(-0.5, -0.5, -0.5), data1);

		const result0 = octree.move(new Vector3(0.5, 0.5, 0.5), new Vector3(0.5, 0.6, 0.5));
		const result1 = octree.move(new Vector3(-0.5, -0.5, -0.5), new Vector3(1, -0.5, 1));

		assert.equal(octree.countPoints(), 2, "should correctly relocate points");
		assert.equal(result0, data0, "should return the data of the updated point");
		assert.equal(result1, data1, "should return the data of the updated point");
		assert.equal(octree.get(new Vector3(0.5, 0.6, 0.5)), data0, "should correctly update points");
		assert.equal(octree.get(new Vector3(1, -0.5, 1)), data1, "should correctly update points");

	});

	it("can find the nearest point", () => {

		const octree = new PointOctree(box.min, box.max, 0.0, 1, 2);

		octree.set(new Vector3(0, 0, 0), null);
		octree.set(new Vector3(0.2, 0, 0), data1);
		octree.set(new Vector3(0.3, 0, 0), data0);
		octree.set(new Vector3(-0.75, -0.75, -0.75), data2);
		octree.set(new Vector3(-1, -1, -1), data2);

		let result = octree.findNearestPoint(new Vector3(0.2, 0, 0))?.data;
		assert.equal(result, data1, "should find the nearest point");
		result = octree.findNearestPoint(new Vector3(-0.9, -0.9, -0.9))?.data;
		assert.equal(result, data2, "should find the nearest point");
		result = octree.findNearestPoint(new Vector3(0.2, 0, 0), Infinity, true)?.data;
		assert.equal(result, data0, "should be able to skip itself");

	});

	it("can find points inside a radius", () => {

		const octree = new PointOctree(box.min, box.max, 0.0, 1, 2);

		octree.set(new Vector3(0, 0, 0), data0);
		octree.set(new Vector3(0, 0.1, 0.005), data0);
		octree.set(new Vector3(-0.075, -0.1, 0.005), data1);
		octree.set(new Vector3(1, 0, 0), data1);
		octree.set(new Vector3(0.9, 0, 0), data2);
		octree.set(new Vector3(0.9, 0, 0.00125), data2);

		assert.equal(octree.findPoints(new Vector3(0, 0, 0), 0.15).length, 3, "should find points inside a radius");
		assert.equal(octree.findPoints(new Vector3(0, 0, 0), 0.15, true).length, 2, "should be able to skip itself");

	});

	it("retrieves leaves when octree is small", () => {

		const octree = new PointOctree(box.min, box.max);

		octree.set(new Vector3(0.0, 0, 0), data0);
		octree.set(new Vector3(0.1, 0, 0), data1);
		octree.set(new Vector3(0.2, 0, 0), data2);

		const found = [];

		for(const node of octree.leaves()) {

			if(node.data !== null && node.data.points !== null) {

				found.push(...node.data.points);

			}

		}

		assert.equal(found.length, 3, "should find 3 points");

	});

	it("retrieves leaves when octree is large", () => {

		const octree = new PointOctree(box.min, box.max);

		for(let i = 0; i < 100; i++) {

			octree.set(new Vector3(i / 100, 0, 0), data0);

		}

		const found = [];

		for(const node of octree.leaves()) {

			if(node.data !== null && node.data.points !== null) {

				found.push(...node.data.points);

			}

		}

		assert.equal(found.length, 100, "should find 100 points");

	});

	it("intersects root when octree is small", () => {

		const octree = new PointOctree(box.min, box.max);

		octree.set(new Vector3(0.0, 0, 0), data0);
		octree.set(new Vector3(0.1, 0, 0), data1);
		octree.set(new Vector3(0.2, 0, 0), data2);

		const raycaster = new Raycaster(
			new Vector3(0, 0, 0),
			new Vector3(0, 0, -1)
		);

		raycaster.params.Points.threshold = 0.5;
		const found = octree.raycast(raycaster);

		assert.equal(found.length, 3, "should find 3 points");

	});

});
