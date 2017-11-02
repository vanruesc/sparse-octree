"use strict";

const three = require("three");
const Octant = require("../../build/sparse-octree").Octant;

const Box3 = three.Box3;
const Vector3 = three.Vector3;

const box = new Box3(
	new Vector3(-1, -1, -1),
	new Vector3(1, 1, 1)
);

module.exports = {

	"Octant": {

		"can be instantiated": function(test) {

			const octant = new Octant();

			test.ok(octant, "octant");
			test.done();

		},

		"can compute its center": function(test) {

			const octant = new Octant(box.min, box.max);

			test.ok(octant.getCenter().equals(new Vector3(0, 0, 0)), "should be able to compute its center");
			test.done();

		},

		"can compute its dimensions": function(test) {

			const octant = new Octant(box.min, box.max);

			test.ok(octant.getDimensions().equals(new Vector3(2, 2, 2)), "should be able to compute its dimensions");
			test.done();

		},

		"can be split": function(test) {

			const octant = new Octant(box.min, box.max);

			octant.split();

			test.equal(octant.children.length, 8, "should create eight children");
			test.done();

		}

	}

};
