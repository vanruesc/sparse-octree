import test from "ava";
import { Box3, Vector3 } from "three";
import { CubicOctant } from "sparse-octree";

const box = new Box3(
	new Vector3(-1, -1, -1),
	new Vector3(1, 1, 1)
);

test("can be instantiated", t => {

	const object = new CubicOctant();
	t.truthy(object);

});

test("can compute its center", t => {

	const octant = new CubicOctant(box.min, 2);

	t.true(
		octant.getCenter(new Vector3()).equals(new Vector3(0, 0, 0)),
		"should be able to compute its center"
	);

});

test("can compute its dimensions", t => {

	const octant = new CubicOctant(box.min, 2);

	t.true(
		octant.getDimensions(new Vector3()).equals(new Vector3(2, 2, 2)),
		"should be able to compute its dimensions"
	);

});

test("can be split", t => {

	const octant = new CubicOctant(box.min, 2);

	octant.split();

	t.is(octant.children.length, 8, "should create eight children");

});
