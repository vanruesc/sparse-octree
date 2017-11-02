"use strict";

const three = require("three");
const CubicOctant = require("../../build/sparse-octree").CubicOctant;

const Box3 = three.Box3;
const Vector3 = three.Vector3;

const box = new Box3(
	new Vector3(-1, -1, -1),
	new Vector3(1, 1, 1)
);

module.exports = {

	"CubicOctant": {

		"can be instantiated": function(test) {

			const octant = new CubicOctant();

			test.ok(octant, "cubic octant");
			test.done();

		},

		"can compute its center": function(test) {

			const octant = new CubicOctant(box.min, 2);

			test.ok(octant.getCenter().equals(new Vector3(0, 0, 0)), "should be able to compute its center");
			test.done();

		},

		"can compute its dimensions": function(test) {

			const octant = new CubicOctant(box.min, 2);

			test.ok(octant.getDimensions().equals(new Vector3(2, 2, 2)), "should be able to compute its dimensions");
			test.done();

		},

		"can be split": function(test) {

			const octant = new CubicOctant(box.min, 2);

			octant.split();

			test.equal(octant.children.length, 8, "should create eight children");
			test.done();

		}

	}

};
