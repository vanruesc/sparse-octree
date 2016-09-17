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

		"can compute its center": function(test) {

			const octant = new LIBRARY.Octant(box.min, box.max);

			test.ok(octant.getCenter().equals(new THREE.Vector3(0, 0, 0)), "should be able to compute its center");
			test.done();

		},

		"can compute its dimensions": function(test) {

			const octant = new LIBRARY.Octant(box.min, box.max);

			test.ok(octant.getDimensions().equals(new THREE.Vector3(2, 2, 2)), "should be able to compute its dimensions");
			test.done();

		},

		"can be split": function(test) {

			const octant = new LIBRARY.Octant(box.min, box.max);

			octant.split();

			test.equal(octant.children.length, 8, "should create eight children");
			test.done();

		},

		"can recycle child octants": function(test) {

			const octant = new LIBRARY.Octant(box.min, box.max);

			const mid = octant.getCenter();

			const octant011 = new LIBRARY.Octant(
				new THREE.Vector3(octant.min.x, mid.y, mid.z),
				new THREE.Vector3(mid.x, octant.max.y, octant.max.z)
			);

			octant.split([octant011]);

			test.equal(octant.children.length, 8, "should create missing octants");
			test.equal(octant.children[3], octant011, "should recycle suitable octants");
			test.done();

		}

	},

	"CubicOctant": {

		"can be instantiated": function(test) {

			const octant = new LIBRARY.CubicOctant();

			test.ok(octant, "cubic octant");
			test.done();

		},

		"can compute its center": function(test) {

			const octant = new LIBRARY.CubicOctant(box.min, 2);

			test.ok(octant.getCenter().equals(new THREE.Vector3(0, 0, 0)), "should be able to compute its center");
			test.done();

		},

		"can compute its dimensions": function(test) {

			const octant = new LIBRARY.CubicOctant(box.min, 2);

			test.ok(octant.getDimensions().equals(new THREE.Vector3(2, 2, 2)), "should be able to compute its dimensions");
			test.done();

		},

		"can be split": function(test) {

			const octant = new LIBRARY.CubicOctant(box.min, 2);

			octant.split();

			test.equal(octant.children.length, 8, "should create eight children");
			test.done();

		},

		"can recycle child octants": function(test) {

			const octant = new LIBRARY.CubicOctant(box.min, 2);

			const mid = octant.getCenter();

			const octant011 = new LIBRARY.CubicOctant(new THREE.Vector3(octant.min.x, mid.y, mid.z), 1);

			octant.split([octant011]);

			test.equal(octant.children.length, 8, "should create missing octants");
			test.equal(octant.children[3], octant011, "should recycle suitable octants");
			test.done();

		}

	},

	"Octree": {

		"can be instantiated": function(test) {

			const octree = new LIBRARY.Octree();

			test.ok(octree, "octree");
			test.done();

		},

		"can compute its center": function(test) {

			const octree = new LIBRARY.Octree(box.min, box.max);

			test.ok(octree.getCenter().equals(new THREE.Vector3(0, 0, 0)), "should be able to compute its center");
			test.done();

		},

		"can compute its dimensions": function(test) {

			const octree = new LIBRARY.Octree(box.min, box.max);

			test.ok(octree.getDimensions().equals(new THREE.Vector3(2, 2, 2)), "should be able to compute its dimensions");
			test.done();

		},

		"can compute its depth": function(test) {

			const octree = new LIBRARY.Octree(box.min, box.max);

			octree.root.split();
			octree.root.children[0].split();
			octree.root.children[0].children[0].split();

			test.equal(octree.depth(), 3, "should be able to compute the current tree depth");
			test.done();

		},

		"finds octants by depth level": function(test) {

			const octree = new LIBRARY.Octree(box.min, box.max);

			octree.root.split();
			octree.root.children[0].split();
			octree.root.children[7].split();

			const octants = octree.findOctantsByLevel(2);

			test.ok(Array.isArray(octants), "should return a list");
			test.equal(octants.length, 16, "should find all octants");
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
