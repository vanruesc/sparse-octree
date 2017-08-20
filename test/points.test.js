"use strict";

const lib = require("../build/sparse-octree");
const THREE = require("three");

const box = new THREE.Box3(
	new THREE.Vector3(-1, -1, -1),
	new THREE.Vector3(1, 1, 1)
);

const data0 = {};
const data1 = {};
const data2 = {};

module.exports = {

	"PointOctant": {

		"can be instantiated": function(test) {

			const octant = new lib.PointOctant();

			test.ok(octant, "point octant");
			test.done();

		},

		"correctly computes the distance to a point": function(test) {

			const octant = new lib.PointOctant(box.min, box.max);

			const point = new THREE.Vector3(1, 2, 3);

			test.equal(octant.distanceToSquared(point), box.max.distanceToSquared(point), "should calculate the squared distance");
			test.done();

		},

		"correctly computes the distance from its center to a point": function(test) {

			const octant = new lib.PointOctant(box.min, box.max);

			const point = new THREE.Vector3(1, 2, 3);

			test.equal(octant.distanceToCenterSquared(point), octant.getCenter().distanceToSquared(point), "should calculate the squared distance");
			test.done();

		},

		"can determine whether a point lies inside it": function(test) {

			const octant = new lib.PointOctant(box.min, box.max);

			const point = new THREE.Vector3();

			test.equal(octant.contains(point.set(0, 0, 0), 0), true, "should determine that it contains the point");
			test.equal(octant.contains(point.set(2, 0, 0), 0), false, "should determine that the point lies outside");
			test.done();

		}

	},

	"PointOctree": {

		"can be instantiated": function(test) {

			const octree = new lib.PointOctree();

			test.ok(octree, "point octree");
			test.done();

		},

		"can add a point": function(test) {

			const octree = new lib.PointOctree(box.min, box.max, 0.0, 1, 1);

			test.ok(octree.put(new THREE.Vector3(0, 0, 0), data0), "should succeed");
			test.equal(octree.pointCount, 1, "should be able to add a point");
			test.done();

		},

		"overwrites duplicates": function(test) {

			const octree = new lib.PointOctree(box.min, box.max, 0.0, 1, 1);

			octree.put(new THREE.Vector3(0, 0, 0), data0);
			octree.put(new THREE.Vector3(0, 0, 0), data1);
			octree.put(new THREE.Vector3(1, 0, 0), data2);

			test.equal(octree.pointCount, 2, "should overwrite duplicates");
			test.done();

		},

		"can remove a point": function(test) {

			const octree = new lib.PointOctree(box.min, box.max, 0.0, 1, 1);

			octree.put(new THREE.Vector3(0, 0, 0), data0);

			test.equal(octree.remove(new THREE.Vector3(0, 0, 0)), data0, "should return the data of the removed point");
			test.equal(octree.pointCount, 0, "should remove a point completely");
			test.done();

		},

		"can look a point up": function(test) {

			const octree = new lib.PointOctree(box.min, box.max, 0.0, 1, 1);

			octree.put(new THREE.Vector3(0, 0, 0), data0);

			test.equal(octree.fetch(new THREE.Vector3(0, 0, 0)), data0, "should find points and return their data");
			test.done();

		},

		"adds points to intersecting octants": function(test) {

			const octree = new lib.PointOctree(box.min, box.max, 0.0, 1, 1);

			octree.put(new THREE.Vector3(2, 0, 0), data0);

			test.equal(octree.pointCount, 0, "should not add if the point lies outside");
			test.done();

		},

		"splits octants that are at maximum capacity": function(test) {

			const octree = new lib.PointOctree(box.min, box.max, 0.0, 1, 1);

			octree.put(new THREE.Vector3(0, 0, 0), data0);
			octree.put(new THREE.Vector3(1, 0, 0), data1);

			test.equal(octree.getDepth(), 1, "should split octants when necessary");
			test.equal(octree.pointCount, 2, "should not lose any points during a split");
			test.done();

		},

		"merges octants if possible": function(test) {

			const octree = new lib.PointOctree(box.min, box.max, 0.0, 1, 2);

			octree.put(new THREE.Vector3(0, 0, 0), data0);
			octree.put(new THREE.Vector3(1, 0, 0), data1);
			octree.put(new THREE.Vector3(0.9, 0, 0), data2);

			octree.remove(new THREE.Vector3(1, 0, 0));

			test.equal(octree.getDepth(), 1, "should merge octants when possible");
			test.done();

		},

		"can move points": function(test) {

			const octree = new lib.PointOctree(box.min, box.max, 0.0, 1, 2);

			octree.put(new THREE.Vector3(0.5, 0.5, 0.5), data0);
			octree.put(new THREE.Vector3(-0.5, -0.5, -0.5), data1);

			const result0 = octree.move(new THREE.Vector3(0.5, 0.5, 0.5), new THREE.Vector3(0.5, 0.6, 0.5));
			const result1 = octree.move(new THREE.Vector3(-0.5, -0.5, -0.5), new THREE.Vector3(1, -0.5, 1));

			test.equal(octree.pointCount, 2, "should correctly relocate points");
			test.equal(result0, data0, "should return the data of the updated point");
			test.equal(result1, data1, "should return the data of the updated point");
			test.equal(octree.fetch(new THREE.Vector3(0.5, 0.6, 0.5)), data0, "should correctly update points");
			test.equal(octree.fetch(new THREE.Vector3(1, -0.5, 1)), data1, "should correctly update points");
			test.done();

		},

		"can find the nearest point": function(test) {

			const octree = new lib.PointOctree(box.min, box.max, 0.0, 1, 2);

			octree.put(new THREE.Vector3(0, 0, 0), data0);
			octree.put(new THREE.Vector3(1, 0, 0), data0);
			octree.put(new THREE.Vector3(0.9, 0, 0), data0);
			octree.put(new THREE.Vector3(0.9, 0, 0.00125), data1);

			test.equal(octree.findNearestPoint(new THREE.Vector3(0.9, 0, 0.001)).data, data1, "should find the nearest point");
			test.equal(octree.findNearestPoint(new THREE.Vector3(0.9, 0, 0), Infinity, true).data, data1, "should be able to skip itself");
			test.done();

		},

		"can find points inside a radius": function(test) {

			const octree = new lib.PointOctree(box.min, box.max, 0.0, 1, 2);

			octree.put(new THREE.Vector3(0, 0, 0), data0);
			octree.put(new THREE.Vector3(0, 0.1, 0.005), data0);
			octree.put(new THREE.Vector3(-0.075, -0.1, 0.005), data1);
			octree.put(new THREE.Vector3(1, 0, 0), data1);
			octree.put(new THREE.Vector3(0.9, 0, 0), data2);
			octree.put(new THREE.Vector3(0.9, 0, 0.00125), data2);

			test.equal(octree.findPoints(new THREE.Vector3(0, 0, 0), 0.15).length, 3, "should find points inside a radius");
			test.equal(octree.findPoints(new THREE.Vector3(0, 0, 0), 0.15, true).length, 2, "should be able to skip itself");
			test.done();

		}

	}

};
