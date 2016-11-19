"use strict";

const lib = require("../build/sparse-octree");
const THREE = require("three");

const box = new THREE.Box3(new THREE.Vector3(-1, -1, -1), new THREE.Vector3(1, 1, 1));
const data = {};

module.exports = {

	"PointOctant": {

		"can be instantiated": function(test) {

			const octant = new lib.PointOctant();

			test.ok(octant, "point octant");
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

			octree.add(new THREE.Vector3(0, 0, 0), data);

			test.equal(octree.countPoints(), 1, "should be able to add a point");
			test.done();

		},

		"overwrites duplicates": function(test) {

			const octree = new lib.PointOctree(box.min, box.max, 0.0, 1, 1);

			octree.add(new THREE.Vector3(0, 0, 0), data);
			octree.add(new THREE.Vector3(0, 0, 0), data);
			octree.add(new THREE.Vector3(1, 0, 0), data);

			test.equal(octree.countPoints(), 2, "should overwrite duplicates");
			test.done();

		},

		"can remove a point": function(test) {

			const octree = new lib.PointOctree(box.min, box.max, 0.0, 1, 1);

			octree.add(new THREE.Vector3(0, 0, 0), data);
			octree.remove(new THREE.Vector3(0, 0, 0));

			test.equal(octree.countPoints(), 0, "should remove a point completely");
			test.done();

		},

		"can look a point up": function(test) {

			const octree = new lib.PointOctree(box.min, box.max, 0.0, 1, 1);

			octree.add(new THREE.Vector3(0, 0, 0), data);

			test.equal(octree.fetch(new THREE.Vector3(0, 0, 0)), data, "should find points and return their data");
			test.done();

		},

		"adds points to intersecting octants": function(test) {

			const octree = new lib.PointOctree(box.min, box.max, 0.0, 1, 1);

			octree.add(new THREE.Vector3(2, 0, 0), data);

			test.equal(octree.countPoints(), 0, "should not add if the point lies outside");
			test.done();

		},

		"splits octants that are at maximum capacity": function(test) {

			const octree = new lib.PointOctree(box.min, box.max, 0.0, 1, 1);

			octree.add(new THREE.Vector3(0, 0, 0), data);
			octree.add(new THREE.Vector3(1, 0, 0), data);

			test.equal(octree.getDepth(), 1, "should split octants when necessary");
			test.equal(octree.countPoints(), 2, "should not lose any points during a split");
			test.done();

		},

		"merges octants if possible": function(test) {

			const octree = new lib.PointOctree(box.min, box.max, 0.0, 1, 2);

			octree.add(new THREE.Vector3(0, 0, 0), data);
			octree.add(new THREE.Vector3(1, 0, 0), data);
			octree.add(new THREE.Vector3(0.9, 0, 0), data);

			octree.remove(new THREE.Vector3(1, 0, 0));

			test.equal(octree.getDepth(), 1, "should merge octants when possible");
			test.done();

		},

		"can find the nearest point": function(test) {

			const octree = new lib.PointOctree(box.min, box.max, 0.0, 1, 2);
			const data2 = {};

			octree.add(new THREE.Vector3(0, 0, 0), data);
			octree.add(new THREE.Vector3(1, 0, 0), data);
			octree.add(new THREE.Vector3(0.9, 0, 0), data);
			octree.add(new THREE.Vector3(0.9, 0, 0.00125), data2);

			test.equal(octree.findNearestPoint(new THREE.Vector3(0.9, 0, 0.001)).data, data2, "should find the nearest point");
			test.equal(octree.findNearestPoint(new THREE.Vector3(0.9, 0, 0), Infinity, true).data, data2, "should be able to skip itself");
			test.done();

		},

		"can find points inside a radius": function(test) {

			const octree = new lib.PointOctree(box.min, box.max, 0.0, 1, 2);

			octree.add(new THREE.Vector3(0, 0, 0), data);
			octree.add(new THREE.Vector3(0, 0.1, 0.005), data);
			octree.add(new THREE.Vector3(-0.075, -0.1, 0.005), data);
			octree.add(new THREE.Vector3(1, 0, 0), data);
			octree.add(new THREE.Vector3(0.9, 0, 0), data);
			octree.add(new THREE.Vector3(0.9, 0, 0.00125), data);

			test.equal(octree.findPoints(new THREE.Vector3(0, 0, 0), 0.15).length, 3, "should find points inside a radius");
			test.equal(octree.findPoints(new THREE.Vector3(0, 0, 0), 0.15, true).length, 2, "should be able to skip itself");
			test.done();

		}

	}

};
