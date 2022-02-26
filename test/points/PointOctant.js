import test from "ava";
import { Vector3 } from "three";
import { PointOctant } from "sparse-octree";

test("can be instantiated", t => {

	const object = new PointOctant();

	t.pass();

});

test("correctly computes the distance to a point", t => {

	const octant = new PointOctant(
		new Vector3(-1, -1, -1),
		new Vector3(1, 1, 1)
	);

	const point = new Vector3(1, 2, 3);

	t.is(octant.distanceToSquared(point), octant.max.distanceToSquared(point), "should calculate the squared distance");

});

test("correctly computes the distance from its center to a point", t => {

	const octant = new PointOctant(
		new Vector3(-1, -1, -1),
		new Vector3(1, 1, 1)
	);

	const point = new Vector3(1, 2, 3);

	t.is(octant.distanceToCenterSquared(point), octant.getCenter(new Vector3()).distanceToSquared(point), "should calculate the squared distance");

});

test("can determine whether a point lies inside it", t => {

	const octant = new PointOctant(
		new Vector3(-1, -1, -1),
		new Vector3(1, 1, 1)
	);

	const point = new Vector3(0, 0, 0);

	t.true(octant.contains(point.set(0, 0, 0), 0), "should determine that it contains the point");
	t.false(octant.contains(point.set(2, 0, 0), 0), "should determine that the point lies outside");

});
