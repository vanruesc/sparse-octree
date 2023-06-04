import test from "ava";
import { Vector3 } from "three";
import { Octant, Octree } from "sparse-octree";

const root = new Octant(
	new Vector3(-1, -1, -1),
	new Vector3(1, 1, 1)
);

test("can be instantiated", t => {

	const object = new Octree(root);
	t.truthy(object);

});

test("can compute its center", t => {

	const octree = new Octree(root);

	t.true(
		octree.getCenter(new Vector3()).equals(new Vector3(0, 0, 0)),
		"should be able to compute its center"
	);

});

test("can compute its dimensions", t => {

	const octree = new Octree(root);

	t.true(
		octree.getDimensions(new Vector3()).equals(new Vector3(2, 2, 2)),
		"should be able to compute its dimensions"
	);

});

test("can compute its depth", t => {

	root.split();
	root.children[0].split();
	root.children[0].children[0].split();

	const octree = new Octree(root);

	t.is(octree.getDepth(), 3, "should be able to compute the current tree depth");

});

test("finds octants by depth level", t => {

	root.split();
	root.children[0].split();
	root.children[7].split();

	const octree = new Octree(root);
	const octants = octree.findNodesByLevel(2);

	t.true(Array.isArray(octants), "should return a list");
	t.is(octants.length, 16, "should find all octants");

});
