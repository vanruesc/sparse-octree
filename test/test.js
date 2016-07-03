"use strict";

const LIBRARY = require("../build/sparse-octree");
const THREE = require("three");

const box = new THREE.Box3(new THREE.Vector3(-1, -1, -1), new THREE.Vector3(1, 1, 1));
const data = {};

module.exports = {

	"Octant": {

		"can be instantiated": function(test) {

			let octant = new LIBRARY.Octant();

			test.ok(octant, "octant");
			test.done();

		},

		"can add a point": function(test) {

			let octant = new LIBRARY.Octant(box.min, box.max);

			octant.add(new THREE.Vector3(0, 0, 0), data);
			test.equal(octant.totalPoints, 1, "should be able to add a point");
			test.done();

		},

		"recognises duplicates": function(test) {

			let octant = new LIBRARY.Octant(box.min, box.max);

			octant.add(new THREE.Vector3(0, 0, 0), data);
			octant.add(new THREE.Vector3(1, 0, 0), data);
			octant.add(new THREE.Vector3(0, 1, 0), data);
			octant.add(new THREE.Vector3(0, 0, 1), data);
			octant.add(new THREE.Vector3(0, 0, 0), data);
			test.equal(octant.totalPoints, 4, "should recognise duplicates");
			test.done();

		},

		"can remove a point": function(test) {

			let octant = new LIBRARY.Octant(box.min, box.max);

			octant.add(new THREE.Vector3(0, 0, 0), data);
			octant.add(new THREE.Vector3(0, 0, 0), {});
			octant.remove(new THREE.Vector3(0, 0, 0));
			test.equal(octant.totalPoints, 0, "should remove a point completely if no data is provided");

			test.done();

		},

		"can unfold and remove accumulated data": function(test) {

			let octant = new LIBRARY.Octant(box.min, box.max);

			octant.add(new THREE.Vector3(0, 0, 0), data);
			octant.add(new THREE.Vector3(0, 0, 0), {});
			octant.remove(new THREE.Vector3(0, 0, 0), data);
			test.equal(octant.dataSets[0].size, 1, "should be able to remove single data entries");
			test.equal(octant.totalPoints, 1, "the amount of points should remain unaffected");

			test.done();

		}

	},

	"Octree": {

		"can be instantiated": function(test) {

			let octree = new LIBRARY.Octree();

			test.ok(octree, "octree");
			test.done();

		},

		"can look a point up": function(test) {

			let octree = new LIBRARY.Octree(box.min, box.max, 0.0, 1, 2);

			octree.add(new THREE.Vector3(0, 0, 0), data);
			test.ok(octree.fetch(new THREE.Vector3(0, 0, 0)).has(data), "should find points and return their data set");

			test.done();

		},

		"uses data to distinguish multiple identical points": function(test) {

			let octree = new LIBRARY.Octree(box.min, box.max, 0.0, 1, 2);

			octree.add(new THREE.Vector3(0, 0, 0), data);
			octree.add(new THREE.Vector3(0, 0, 0), {});
			octree.add(new THREE.Vector3(0, 0, 0));
			test.equal(octree.fetch(new THREE.Vector3(0, 0, 0)).size, 2, "undefined data should not be considered unique");
			test.done();

		},

		"can add multiple points": function(test) {

			let octree = new LIBRARY.Octree(box.min, box.max, 0.0, 1, 1);

			octree.addPoints([-1, -1, -1, 0, 0, 0, 1, 1, 1], data);
			test.ok(octree.totalPoints, 3, "should be able to store multiple points");
			test.ok(octree.fetch(new THREE.Vector3(-1, -1, -1)), "should find all added points");
			test.ok(octree.fetch(new THREE.Vector3(0, 0, 0)), "should find all added points");
			test.ok(octree.fetch(new THREE.Vector3(1, 1, 1)), "should find all added points");

			test.done();

		},

		"can remove multiple points": function(test) {

			let octree = new LIBRARY.Octree(box.min, box.max, 0.0, 1, 1);

			octree.addPoints([-1, -1, -1, 0, 0, 0, 1, 1, 1], data);
			octree.addPoints([-1, -1, -1, 1, 1, 1], data);
			test.ok(octree.totalPoints, 1, "should be able to remove multiple points");

			test.done();

		},

		"adds points to intersecting octants": function(test) {

			let octree = new LIBRARY.Octree(box.min, box.max, 0.0, 1, 2);

			octree.add(new THREE.Vector3(2, 0, 0));
			test.equal(octree.totalPoints, 0, "should not add if position is out of range");

			test.done();

		},

		"retains all points after a split": function(test) {

			let octree = new LIBRARY.Octree(box.min, box.max, 0.0, 1, 2);

			octree.add(new THREE.Vector3(0, 0, 0));
			octree.add(new THREE.Vector3(0, 0, 0.005));
			test.equal(octree.totalPoints, 2, "should not lose any points during a split");

			test.done();

		},

		"splits octants that are at maximum capacity": function(test) {

			let octree = new LIBRARY.Octree(box.min, box.max, 0.0, 1, 2);

			octree.add(new THREE.Vector3(0, 0, 0));
			octree.add(new THREE.Vector3(1, 0, 0));
			octree.add(new THREE.Vector3(0.9, 0, 0));
			test.equal(octree.depth(), octree.maxDepth, "should split octants when necessary");

			test.done();

		},

		"merges octants if possible": function(test) {

			let octree = new LIBRARY.Octree(box.min, box.max, 0.0, 1, 1);

			octree.add(new THREE.Vector3(0, 0, 0));
			octree.add(new THREE.Vector3(1, 0, 0));
			octree.remove(new THREE.Vector3(1, 0, 0));
			test.equal(octree.depth(), octree.maxDepth - 1, "should merge octants when possible");

			test.done();

		},

		"forces a merge when necessary": function(test) {

			let octree = new LIBRARY.Octree(box.min, box.max, 0.0, 1, 1);

			octree.add(new THREE.Vector3(0, 0, 0));
			octree.add(new THREE.Vector3(1, 0, 0));
			octree.maxDepth = 0;
			test.equal(octree.depth(), octree.maxDepth, "should reduce the tree depth");

			test.done();

		},

		"forces a split when necessary": function(test) {

			let octree = new LIBRARY.Octree(box.min, box.max, 0.0, 2, 1);

			octree.add(new THREE.Vector3(0, 0, 0));
			octree.add(new THREE.Vector3(1, 0, 0));
			octree.maxPoints = 1;
			test.equal(octree.depth(), octree.maxDepth, "should split if the octant capacity changes");

			test.done();

		},

		"can find the nearest point": function(test) {

			let octree = new LIBRARY.Octree(box.min, box.max, 0.0, 1, 2);

			octree.add(new THREE.Vector3(0, 0, 0));
			octree.add(new THREE.Vector3(1, 0, 0));
			octree.add(new THREE.Vector3(0.9, 0, 0));
			octree.add(new THREE.Vector3(0.9, 0, 0.00125), data);
			test.ok(octree.findNearestPoint(new THREE.Vector3(0.9, 0, 0.001)).data.has(data), "should find the nearest point");
			test.ok(octree.findNearestPoint(new THREE.Vector3(0.9, 0, 0), Infinity, true).data.has(data), "should be able to skip itself");

			test.done();

		},

		"can find points inside a radius": function(test) {

			let octree = new LIBRARY.Octree(box.min, box.max, 0.0, 1, 2);

			octree.add(new THREE.Vector3(0, 0, 0));
			octree.add(new THREE.Vector3(0, 0.1, 0.005));
			octree.add(new THREE.Vector3(-0.075, -0.1, 0.005));
			octree.add(new THREE.Vector3(1, 0, 0));
			octree.add(new THREE.Vector3(0.9, 0, 0));
			octree.add(new THREE.Vector3(0.9, 0, 0.00125));
			test.equal(octree.findPoints(new THREE.Vector3(0, 0, 0), 0.15).length, 3, "should find points inside a radius");
			test.equal(octree.findPoints(new THREE.Vector3(0, 0, 0), 0.15, true).length, 2, "should be able to skip itself");

			test.done();

		}

	},

	"OctreeHelper": {

		"can be instantiated": function(test) {

			let helper = new LIBRARY.OctreeHelper();

			test.ok(helper, "helper");
			test.done();

		},

		"creates geometry for each tree level": function(test) {

			let octree = new LIBRARY.Octree(box.min, box.max, 0.0, 1, 2);

			octree.add(new THREE.Vector3(0, 0, 0));
			octree.add(new THREE.Vector3(1, 0, 0));
			octree.add(new THREE.Vector3(0.9, 0, 0));

			let helper = new LIBRARY.OctreeHelper(octree);

			test.equal(helper.children.length, 3, "should have a child for each level");
			test.done();

		}

	}

};
