import test from "ava";
import { Raycaster, Vector3 } from "three";
import { Octant, Octree } from "../../dist/sparse-octree.js";

const root = new Octant(
	new Vector3(-1, -1, -1),
	new Vector3(1, 1, 1)
);

test("can find intersecting octants", t => {

	const octree = new Octree(root);
	const raycaster = new Raycaster(
		new Vector3(0.5, -1, 0.5),
		new Vector3(1, 1, 1)
	);

	octree.root.split();

	const intersects = octree.getIntersectingNodes(raycaster);

	t.is(intersects.length, 1, "should return one intersecting octant");
	t.is(intersects[0], octree.root.children[5], "should return the sixth child");

});
