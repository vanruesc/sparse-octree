"use strict";

const lib = require("../build/sparse-octree");
const THREE = require("three");

const box = new THREE.Box3(
	new THREE.Vector3(-1, -1, -1),
	new THREE.Vector3(1, 1, 1)
);

const region = new THREE.Box3(
	new THREE.Vector3(0.1, 0.1, 0.1),
	new THREE.Vector3(0.2, 0.2, 0.2)
);

module.exports = {

	"Octant": {

		"can be instantiated": function(test) {

			const octant = new lib.Octant();

			test.ok(octant, "octant");
			test.done();

		},

		"can compute its center": function(test) {

			const octant = new lib.Octant(box.min, box.max);

			test.ok(octant.getCenter().equals(new THREE.Vector3(0, 0, 0)), "should be able to compute its center");
			test.done();

		},

		"can compute its dimensions": function(test) {

			const octant = new lib.Octant(box.min, box.max);

			test.ok(octant.getDimensions().equals(new THREE.Vector3(2, 2, 2)), "should be able to compute its dimensions");
			test.done();

		},

		"can be split": function(test) {

			const octant = new lib.Octant(box.min, box.max);

			octant.split();

			test.equal(octant.children.length, 8, "should create eight children");
			test.done();

		},

		"can recycle child octants": function(test) {

			const octant = new lib.Octant(box.min, box.max);

			const mid = octant.getCenter();

			const octant011 = new lib.Octant(
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

			const octant = new lib.CubicOctant();

			test.ok(octant, "cubic octant");
			test.done();

		},

		"can compute its center": function(test) {

			const octant = new lib.CubicOctant(box.min, 2);

			test.ok(octant.getCenter().equals(new THREE.Vector3(0, 0, 0)), "should be able to compute its center");
			test.done();

		},

		"can compute its dimensions": function(test) {

			const octant = new lib.CubicOctant(box.min, 2);

			test.ok(octant.getDimensions().equals(new THREE.Vector3(2, 2, 2)), "should be able to compute its dimensions");
			test.done();

		},

		"can be split": function(test) {

			const octant = new lib.CubicOctant(box.min, 2);

			octant.split();

			test.equal(octant.children.length, 8, "should create eight children");
			test.done();

		},

		"can recycle child octants": function(test) {

			const octant = new lib.CubicOctant(box.min, 2);

			const mid = octant.getCenter();

			const octant011 = new lib.CubicOctant(new THREE.Vector3(octant.min.x, mid.y, mid.z), 1);

			octant.split([octant011]);

			test.equal(octant.children.length, 8, "should create missing octants");
			test.equal(octant.children[3], octant011, "should recycle suitable octants");
			test.done();

		}

	},

	"Octree": {

		"can be instantiated": function(test) {

			const octree = new lib.Octree();

			test.ok(octree, "octree");
			test.done();

		},

		"can compute its center": function(test) {

			const octree = new lib.Octree(box.min, box.max);

			test.ok(octree.getCenter().equals(new THREE.Vector3(0, 0, 0)), "should be able to compute its center");
			test.done();

		},

		"can compute its dimensions": function(test) {

			const octree = new lib.Octree(box.min, box.max);

			test.ok(octree.getDimensions().equals(new THREE.Vector3(2, 2, 2)), "should be able to compute its dimensions");
			test.done();

		},

		"can compute its depth": function(test) {

			const octree = new lib.Octree(box.min, box.max);

			octree.root.split();
			octree.root.children[0].split();
			octree.root.children[0].children[0].split();

			test.equal(octree.getDepth(), 3, "should be able to compute the current tree depth");
			test.done();

		},

		"finds octants by depth level": function(test) {

			const octree = new lib.Octree(box.min, box.max);

			octree.root.split();
			octree.root.children[0].split();
			octree.root.children[7].split();

			const octants = octree.findOctantsByLevel(2);

			test.ok(Array.isArray(octants), "should return a list");
			test.equal(octants.length, 16, "should find all octants");
			test.done();

		},

	},

	"OctreeIterator": {

		"can be instantiated": function(test) {

			const iterator = new lib.OctreeIterator(new lib.Octree());

			test.ok(iterator, "iterator");
			test.done();

		},

		"iterates over all leaf octants": function(test) {

			const octree = new lib.Octree(box.min, box.max);
			const iterator = octree.leaves();

			let i = 0;

			octree.root.split();

			while(!iterator.next().done) {

				++i;

			}

			test.equal(i, 8, "should return eight leaf octants");
			test.done();

		},

		"can cull leaf octants": function(test) {

			const octree = new lib.Octree(box.min, box.max);
			const iterator = octree.leaves(region);

			let i = 0;

			octree.root.split();

			while(!iterator.next().done) {

				++i;

			}

			test.equal(i, 1, "should return one leaf octant");
			test.done();

		}

	},

	"OctreeRaycaster": {

		"can find intersecting octants": function(test) {

			const octree = new lib.Octree(box.min, box.max);
			const raycaster = new THREE.Raycaster(
				new THREE.Vector3(0.5, -1, 0.5),
				new THREE.Vector3(1, 1, 1)
			);

			octree.root.split();

			const intersects = octree.raycast(raycaster);

			test.equal(intersects.length, 1, "should return one intersecting octant");
			test.equal(intersects[0], octree.root.children[5], "should return the sixth child");
			test.done();

		}

	}

};
