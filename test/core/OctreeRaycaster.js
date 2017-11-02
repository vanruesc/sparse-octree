"use strict";

const three = require("three");
const Octree = require("../../build/sparse-octree").Octree;

const Box3 = three.Box3;
const Raycaster = three.Raycaster;
const Vector3 = three.Vector3;

const box = new Box3(
	new Vector3(-1, -1, -1),
	new Vector3(1, 1, 1)
);

module.exports = {

	"OctreeRaycaster": {

		"can find intersecting octants": function(test) {

			const octree = new Octree(box.min, box.max);
			const raycaster = new Raycaster(
				new Vector3(0.5, -1, 0.5),
				new Vector3(1, 1, 1)
			);

			octree.root.split();

			const intersects = octree.raycast(raycaster);

			test.equal(intersects.length, 1, "should return one intersecting octant");
			test.equal(intersects[0], octree.root.children[5], "should return the sixth child");
			test.done();

		}

	}

};
