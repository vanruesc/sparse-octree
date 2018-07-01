import test from "ava";
import { Box3, Vector3 } from "math-ds";
import { CubicOctant, Octant, OctreeUtils } from "../../build/sparse-octree.js";

const box = new Box3(
	new Vector3(-1, -1, -1),
	new Vector3(1, 1, 1)
);

test("can recycle child octants", t => {

	const octant = new Octant(box.min, box.max);

	const mid = octant.getCenter();

	const octant011 = new Octant(
		new Vector3(octant.min.x, mid.y, mid.z),
		new Vector3(mid.x, octant.max.y, octant.max.z)
	);

	octant.split();

	OctreeUtils.recycleOctants(octant, [octant011]);

	t.is(octant.children.length, 8, "should maintain eight children");
	t.is(octant.children[3], octant011, "should recycle suitable octants");

});

test("can recycle cubic child octants", t => {

	const octant = new CubicOctant(box.min, 2);

	const mid = octant.getCenter();

	const octant011 = new CubicOctant(
		new Vector3(octant.min.x, mid.y, mid.z),
		1
	);

	octant.split();

	OctreeUtils.recycleOctants(octant, [octant011]);

	t.is(octant.children.length, 8, "should maintain eight children");
	t.is(octant.children[3], octant011, "should recycle suitable octants");

});
