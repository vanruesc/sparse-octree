"use strict";

const three = require("three");
const lib = require("../../build/sparse-octree");

const Box3 = three.Box3;
const Vector3 = three.Vector3;
const CubicOctant = lib.CubicOctant;
const Octant = lib.Octant;
const OctreeUtils = lib.OctreeUtils;

const box = new Box3(
	new Vector3(-1, -1, -1),
	new Vector3(1, 1, 1)
);

module.exports = {

	"OctreeUtils": {

		"can recycle child octants": function(test) {

			const octant = new Octant(box.min, box.max);

			const mid = octant.getCenter();

			const octant011 = new Octant(
				new Vector3(octant.min.x, mid.y, mid.z),
				new Vector3(mid.x, octant.max.y, octant.max.z)
			);

			octant.split();

			OctreeUtils.recycleOctants(octant, [octant011]);

			test.equal(octant.children.length, 8, "should maintain eight children");
			test.equal(octant.children[3], octant011, "should recycle suitable octants");
			test.done();

		},

		"can recycle cubic child octants": function(test) {

			const octant = new CubicOctant(box.min, 2);

			const mid = octant.getCenter();

			const octant011 = new CubicOctant(
				new Vector3(octant.min.x, mid.y, mid.z),
				1
			);

			octant.split();

			OctreeUtils.recycleOctants(octant, [octant011]);

			test.equal(octant.children.length, 8, "should maintain eight children");
			test.equal(octant.children[3], octant011, "should recycle suitable octants");
			test.done();

		}

	}

};
