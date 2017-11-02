"use strict";

const three = require("three");
const lib = require("../../build/sparse-octree");

const Box3 = three.Box3;
const Vector3 = three.Vector3;
const OctantIterator = lib.OctantIterator;
const Octree = lib.Octree;

const box = new Box3(
	new Vector3(-1, -1, -1),
	new Vector3(1, 1, 1)
);

const region = new Box3(
	new Vector3(0.1, 0.1, 0.1),
	new Vector3(0.2, 0.2, 0.2)
);

module.exports = {

	"OctantIterator": {

		"can be instantiated": function(test) {

			const iterator = new OctantIterator(new Octree());

			test.ok(iterator, "iterator");
			test.done();

		},

		"iterates over all leaf octants": function(test) {

			const octree = new Octree(box.min, box.max);
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

			const octree = new Octree(box.min, box.max);
			const iterator = octree.leaves(region);

			let i = 0;

			octree.root.split();

			while(!iterator.next().done) {

				++i;

			}

			test.equal(i, 1, "should return one leaf octant");
			test.done();

		}

	}

};
