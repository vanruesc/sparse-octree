"use strict";

const three = require("three");
const PointOctant = require("../../build/sparse-octree").PointOctant;

const Box3 = three.Box3;
const Vector3 = three.Vector3;

const box = new Box3(
	new Vector3(-1, -1, -1),
	new Vector3(1, 1, 1)
);

module.exports = {

	"PointOctant": {

		"can be instantiated": function(test) {

			const octant = new PointOctant();

			test.ok(octant, "point octant");
			test.done();

		},

		"correctly computes the distance to a point": function(test) {

			const octant = new PointOctant(box.min, box.max);

			const point = new Vector3(1, 2, 3);

			test.equal(octant.distanceToSquared(point), box.max.distanceToSquared(point), "should calculate the squared distance");
			test.done();

		},

		"correctly computes the distance from its center to a point": function(test) {

			const octant = new PointOctant(box.min, box.max);

			const point = new Vector3(1, 2, 3);

			test.equal(octant.distanceToCenterSquared(point), octant.getCenter().distanceToSquared(point), "should calculate the squared distance");
			test.done();

		},

		"can determine whether a point lies inside it": function(test) {

			const octant = new PointOctant(box.min, box.max);

			const point = new Vector3();

			test.equal(octant.contains(point.set(0, 0, 0), 0), true, "should determine that it contains the point");
			test.equal(octant.contains(point.set(2, 0, 0), 0), false, "should determine that the point lies outside");
			test.done();

		}

	}

};
