"use strict";

const LIBRARY = require("../build/sparse-octree");
const THREE = require("three");

const box = new THREE.Box3(new THREE.Vector3(-1, -1, -1), new THREE.Vector3(1, 1, 1));

module.exports = {

	"Octant": {

		"can be instantiated": function(test) {

			const octant = new LIBRARY.Octant();

			test.ok(octant, "octant");
			test.done();

		},

		"can be split": function(test) {

			const octant = new LIBRARY.Octant(box.min, box.max);

			octant.split();

			test.equal(octant.children.length, 8, "should create eight children");
			test.done();

		},

		"can be repaired": function(test) {

			const octant = new LIBRARY.Octant(box.min, box.max);

			const mid = box.min.clone().add(box.max).multiplyScalar(0.5);

			const octant011 = new LIBRARY.Octant(
				new THREE.Vector3(box.min.x, mid.y, mid.z),
				new THREE.Vector3(mid.x, box.max.y, box.max.z)
			);

			octant.children = [octant011];
			octant.repair();

			test.equal(octant.children.length, 8, "should create missing octants");
			test.equal(octant.children[3], octant011, "should recycle existing octants");
			test.done();

		}

	},

	"Octree": {

		"can be instantiated": function(test) {

			const octree = new LIBRARY.Octree();

			test.ok(octree, "octree");
			test.done();

		},

	},

	"OctreeHelper": {

		"can be instantiated": function(test) {

			const helper = new LIBRARY.OctreeHelper();

			test.ok(helper, "helper");
			test.done();

		},

		"creates geometry for each tree level": function(test) {

			const octree = new LIBRARY.Octree(box.min, box.max);

			octree.root.split();

			const helper = new LIBRARY.OctreeHelper(octree);

			try {

				helper.update();

			} catch(error) {

				test.ok(false, "could not update the helper");

			}

			test.equal(helper.children.length, 2, "should have a child for each level");
			test.done();

		}

	}

};
