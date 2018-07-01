import test from "ava";
import { Box3, Vector3 } from "math-ds";
import { OctantIterator, Octree } from "../../build/sparse-octree.js";

const box = new Box3(
	new Vector3(-1, -1, -1),
	new Vector3(1, 1, 1)
);

const region = new Box3(
	new Vector3(0.1, 0.1, 0.1),
	new Vector3(0.2, 0.2, 0.2)
);

test("can be instantiated", t => {

	const object = new OctantIterator(new Octree());

	t.truthy(object);

});

test("iterates over all leaf octants", t => {

	const octree = new Octree(box.min, box.max);
	const iterator = octree.leaves();

	let i = 0;

	octree.root.split();

	while(!iterator.next().done) {

		++i;

	}

	t.is(i, 8, "should return eight leaf octants");

});

test("can cull leaf octants", t => {

	const octree = new Octree(box.min, box.max);
	const iterator = octree.leaves(region);

	let i = 0;

	octree.root.split();

	while(!iterator.next().done) {

		++i;

	}

	t.is(i, 1, "should return one leaf octant");

});
