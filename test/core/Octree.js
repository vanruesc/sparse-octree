"use strict";

const three = require("three");
const Octree = require("../../build/sparse-octree").Octree;

const Box3 = three.Box3;
const Vector3 = three.Vector3;

const box = new Box3(
	new Vector3(-1, -1, -1),
	new Vector3(1, 1, 1)
);

module.exports = {

	"Octree": {

		"can be instantiated": function(test) {

			const octree = new Octree();

			test.ok(octree, "octree");
			test.done();

		},

		"can compute its center": function(test) {

			const octree = new Octree(box.min, box.max);

			test.ok(octree.getCenter().equals(new Vector3(0, 0, 0)), "should be able to compute its center");
			test.done();

		},

		"can compute its dimensions": function(test) {

			const octree = new Octree(box.min, box.max);

			test.ok(octree.getDimensions().equals(new Vector3(2, 2, 2)), "should be able to compute its dimensions");
			test.done();

		},

		"can compute its depth": function(test) {

			const octree = new Octree(box.min, box.max);

			octree.root.split();
			octree.root.children[0].split();
			octree.root.children[0].children[0].split();

			test.equal(octree.getDepth(), 3, "should be able to compute the current tree depth");
			test.done();

		},

		"finds octants by depth level": function(test) {

			const octree = new Octree(box.min, box.max);

			octree.root.split();
			octree.root.children[0].split();
			octree.root.children[7].split();

			const octants = octree.findOctantsByLevel(2);

			test.ok(Array.isArray(octants), "should return a list");
			test.equal(octants.length, 16, "should find all octants");
			test.done();

		}

	}

};
