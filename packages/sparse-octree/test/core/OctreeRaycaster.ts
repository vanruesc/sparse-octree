import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { Box3, Ray, Raycaster, Vector3 } from "three";
import { intersectOctree, Octant, Octree, RaycastingFlags } from "sparse-octree";

const root = new Octant(
	new Vector3(-1, -1, -1),
	new Vector3(1, 1, 1)
);

describe("OctreeRaycaster", () => {

	it("finds intersecting octants", () => {

		const raycaster = new Raycaster(
			new Vector3(0.5, 0.5, 2),
			new Vector3(0, 0, -1)
		);

		root.split();

		const octree = new Octree(root);
		const intersects = octree.getIntersectingNodes(raycaster);

		assert.equal(intersects.length, 2, "should return 2 intersecting octants");
		assert.equal(intersects[0], root.children![7], "should return octant #8");

	});

	it("finds octants for rays parallel to the outer faces", () => {

		for(const split of [false, true]) {

			const root = new Octant(new Vector3(-1, -1, -1), new Vector3(1, 1, 1));

			if(split) {

				root.split();

			}

			const octree = new Octree(root);

			for(let axis = 0; axis < 3; ++axis) {

				for(const boundary of [-1, 1]) {

					const origin = new Vector3(0.5, 0.5, 0.5).setComponent(axis, boundary);
					origin.setComponent((axis + 1) % 3, 2);

					const direction = new Vector3().setComponent((axis + 1) % 3, -1);
					const raycaster = new Raycaster(origin, direction);
					const expected = [...octree].filter(node => raycaster.ray.intersectsBox(new Box3(node.min, node.max)));

					const result = octree.getIntersectingNodes(raycaster);
					assert.ok(expected.length > 0);
					assert.equal(result.length, expected.length, "should include nodes along the boundary face");
					assert.deepEqual(new Set(result), new Set(expected));

				}

			}

		}

	});

	it("uses infinite intervals for parallel axes on root boundary faces", () => {

		const root = new Octant(new Vector3(2, 3, 4), new Vector3(6, 7, 8));
		const ray = new Ray(new Vector3(2, 7, 10), new Vector3(-0, 0, -1));
		const flags = new RaycastingFlags();

		assert.deepEqual(intersectOctree(root, ray, flags), [-Infinity, -Infinity, 2, Infinity, Infinity, 6]);
		assert.equal(flags.value, 1);
		assert.deepEqual(ray.origin, new Vector3(2, 7, 10));
		assert.deepEqual(ray.direction, new Vector3(-0, 0, -1));

	});

	it("rejects parallel rays outside the root slabs", () => {

		const octree = new Octree(new Octant(new Vector3(-1, -1, -1), new Vector3(1, 1, 1)));

		for(let axis = 0; axis < 3; ++axis) {

			for(const position of [-1.001, 1.001]) {

				const origin = new Vector3().setComponent(axis, position);
				origin.setComponent((axis + 1) % 3, 2);
				const direction = new Vector3().setComponent((axis + 1) % 3, -1);

				assert.deepEqual(octree.getIntersectingNodes(new Raycaster(origin, direction)), []);

			}

		}

	});

	it("traverses a translated tree in ray order after two splits", () => {

		const root = new Octant(new Vector3(2, -3, 5), new Vector3(6, 1, 13));
		const octree = new Octree(root);

		root.split();

		for(const child of root.children!) {

			child.split();

		}

		// Each leaf is 1 × 1 × 2. List the lower corners in the order the ray visits them.
		const cases = [
			{
				name: "uses the upper half of the root's Y split",
				origin: new Vector3(1, -1, 6),
				direction: new Vector3(1, 0, 0),
				expected: [[2, -1, 5], [3, -1, 5], [4, -1, 5], [5, -1, 5]]
			},
			{
				name: "uses the upper half of a child's X split while moving along negative Y",
				origin: new Vector3(3, 2, 7.5),
				direction: new Vector3(0, -1, 0),
				expected: [[3, 0, 7], [3, -1, 7], [3, -2, 7], [3, -3, 7]]
			},
			{
				name: "starts inside a leaf and moves along negative Z",
				origin: new Vector3(4.5, -2.5, 10),
				direction: new Vector3(0, 0, -1),
				expected: [[4, -3, 9], [4, -3, 7], [4, -3, 5]]
			},
			{
				name: "crosses X and Z splits while staying on a child's Y split",
				origin: new Vector3(7, -2, 6.25),
				direction: new Vector3(-1, 0, 0.5).normalize(),
				expected: [[5, -2, 5], [5, -2, 7], [4, -2, 7], [3, -2, 7], [2, -2, 7]]
			}
		];

		for(const { name, origin, direction, expected } of cases) {

			const result = octree.getIntersectingNodes(new Raycaster(origin, direction));
			assert.deepEqual(result.map(node => node.min.toArray()), expected, name);

		}

	});

});
