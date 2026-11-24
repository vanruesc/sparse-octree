import { it } from "node:test";
import assert from "node:assert/strict";
import { KeyDesign, Octree } from "linear-octree";

it("supports plain bounds, coordinate targets, cull intersectors, and rays", () => {

	const keyDesign = new KeyDesign(1, 1, 1);
	const bounds = { min: { x: 0, y: 0, z: 0 }, max: { x: 0, y: 0, z: 0 } };
	assert.equal(keyDesign.calculateBounds({ x: 1, y: 2, z: 3 }, bounds), bounds);
	assert.deepEqual(bounds, { min: { x: -1, y: -2, z: -3 }, max: { x: 1, y: 2, z: 3 } });

	const tree = new Octree<string>(bounds, keyDesign);
	bounds.min.x = -100;
	assert.equal(tree.min.x, -1);

	const key = { x: 0, y: 0, z: 0 };
	const position = { x: 0.5, y: 1, z: 1.5 };
	assert.equal(tree.calculateKeyCoordinates(position, 0, key), key);
	assert.deepEqual(key, { x: 1, y: 1, z: 1 });
	assert.deepEqual([...keyDesign.keyRange(key, key)], [7]);
	tree.set(key, 0, "sample");

	const [octant] = tree;
	assert.equal(octant.distanceToCenterSquared(position), 0);
	assert.equal(octant.distanceToSquared(position), 0);
	assert.equal(tree.getOctantByPoint(position)?.data, "sample");
	assert.deepEqual(tree.cull({ intersectsBox: box => box.max.x >= position.x }), [octant]);

	const ray = { origin: { x: 0.5, y: 1, z: 4 }, direction: { x: 0, y: 0, z: -1 } };
	assert.deepEqual(tree.getIntersectingNodes({ ray }), [octant]);
	ray.direction.z = 1;
	assert.deepEqual(tree.getIntersectingNodes({ ray }), []);

});

it("dispatches key design changes and updates the tree dimensions", () => {

	const design = new KeyDesign(1);
	const bounds = { min: { x: -1, y: -1, z: -1 }, max: { x: 1, y: 1, z: 1 } };
	const tree = new Octree(bounds, design);
	let changes = 0;
	const listener = {

		/**
		 * Checks the dispatched event and counts the notification.
		 *
		 * @param event - The key design change event.
		 */

		handleEvent(event: { type: "change"; target?: KeyDesign }) {

			assert.equal(event.type, KeyDesign.EVENT_CHANGE);
			assert.equal(event.target, design);
			++changes;

		}

	};

	design.addEventListener(KeyDesign.EVENT_CHANGE, listener);
	design.set(2, 1, 1);
	assert.equal(changes, 1);
	assert.equal(tree.getDepth(), 2);
	assert.deepEqual(tree.getCellSize(0, { x: 0, y: 0, z: 0 }), { x: 0.5, y: 1, z: 1 });
	design.removeEventListener(KeyDesign.EVENT_CHANGE, listener);
	design.set(1, 1, 1);
	assert.equal(changes, 1);

});
