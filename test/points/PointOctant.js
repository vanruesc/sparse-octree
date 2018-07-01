import test from "ava";
import { Box3, Vector3 } from "math-ds";
import { PointOctant } from "../../build/sparse-octree.js";

const box = new Box3(
	new Vector3(-1, -1, -1),
	new Vector3(1, 1, 1)
);

test("can be instantiated", t => {

	const object = new PointOctant();

	t.truthy(object);

});

test("correctly computes the distance to a point", t => {

	const octant = new PointOctant(box.min, box.max);
	const point = new Vector3(1, 2, 3);

	t.is(octant.distanceToSquared(point), box.max.distanceToSquared(point), "should calculate the squared distance");

});

test("correctly computes the distance from its center to a point", t => {

	const octant = new PointOctant(box.min, box.max);
	const point = new Vector3(1, 2, 3);

	t.is(octant.distanceToCenterSquared(point), octant.getCenter().distanceToSquared(point), "should calculate the squared distance");

});

test("can determine whether a point lies inside it", t => {

	const octant = new PointOctant(box.min, box.max);
	const point = new Vector3();

	t.true(octant.contains(point.set(0, 0, 0), 0), "should determine that it contains the point");
	t.false(octant.contains(point.set(2, 0, 0), 0), "should determine that the point lies outside");

});
