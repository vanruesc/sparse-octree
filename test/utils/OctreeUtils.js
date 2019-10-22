import test from "ava";
import { Vector3 } from "math-ds";
import { CubicOctant, Octant, OctreeUtils } from "../../build/sparse-octree.js";

test("can recycle child octants", t => {

	const octant = new Octant(
		new Vector3(-1, -1, -1),
		new Vector3(1, 1, 1)
	);

	const mid = octant.getCenter(new Vector3());

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

	const octant = new CubicOctant(
		new Vector3(-1, -1, -1),
		2
	);

	const mid = octant.getCenter(new Vector3());

	const octant011 = new CubicOctant(
		new Vector3(octant.min.x, mid.y, mid.z),
		1
	);

	octant.split();

	OctreeUtils.recycleOctants(octant, [octant011]);

	t.is(octant.children.length, 8, "should maintain eight children");
	t.is(octant.children[3], octant011, "should recycle suitable octants");

});
