import { Box3 } from "math-ds";
import { OctreeRaycaster } from "../raycasting";
import { OctreeIterator } from "./OctreeIterator.js";

/**
 * A 3D box.
 *
 * @type {Box3}
 * @private
 */

const b = new Box3();

/**
 * Recursively calculates the depth of the given octree.
 *
 * @private
 * @param {Node} octant - An octant.
 * @return {Number} The depth.
 */

function getDepth(octant) {

	const children = octant.children;

	let result = 0;
	let i, l, d;

	if(children !== null) {

		for(i = 0, l = children.length; i < l; ++i) {

			d = 1 + getDepth(children[i]);

			if(d > result) {

				result = d;

			}

		}

	}

	return result;

}

/**
 * Recursively collects octants that lie inside the specified region.
 *
 * @private
 * @param {Node} octant - An octant.
 * @param {Frustum|Box3} region - A region.
 * @param {Node[]} result - A list to be filled with octants that intersect with the region.
 */

function cull(octant, region, result) {

	const children = octant.children;

	let i, l;

	b.min = octant.min;
	b.max = octant.max;

	if(region.intersectsBox(b)) {

		if(children !== null) {

			for(i = 0, l = children.length; i < l; ++i) {

				cull(children[i], region, result);

			}

		} else {

			result.push(octant);

		}

	}

}

/**
 * Recursively fetches all octants with the specified depth level.
 *
 * @private
 * @param {Node} octant - An octant.
 * @param {Number} level - The target depth level.
 * @param {Number} depth - The current depth level.
 * @param {Node[]} result - A list to be filled with the identified octants.
 */

function findNodesByLevel(octant, level, depth, result) {

	const children = octant.children;

	let i, l;

	if(depth === level) {

		result.push(octant);

	} else if(children !== null) {

		++depth;

		for(i = 0, l = children.length; i < l; ++i) {

			findNodesByLevel(children[i], level, depth, result);

		}

	}

}

/**
 * A pointer-based octree that subdivides space for fast spatial searches.
 *
 * @implements {Iterable}
 * @implements {Node}
 * @implements {Tree}
 */

export class Octree {

	/**
	 * Constructs a new octree.
	 *
	 * @param {Node} root - The root node. See {@link Octant} or {@link CubicOctant}.
	 */

	constructor(root) {

		/**
		 * The root octant.
		 *
		 * @type {Node}
		 * @protected
		 */

		this.root = root;

	}

	/**
	 * The lower bounds of the root octant.
	 *
	 * @type {Vector3}
	 */

	get min() {

		return this.root.min;

	}

	/**
	 * The upper bounds of the root octant.
	 *
	 * @type {Vector3}
	 */

	get max() {

		return this.root.max;

	}

	/**
	 * The children of the root node.
	 *
	 * @type {Node[]}
	 */

	get children() {

		return this.root.children;

	}

	/**
	 * Calculates the center of this octree.
	 *
	 * @param {Vector3} target - A target vector.
	 * @return {Vector3} A vector that describes the center of this octree.
	 */

	getCenter(target) {

		return this.root.getCenter(target);

	}

	/**
	 * Calculates the size of this octree.
	 *
	 * @param {Vector3} target - A target vector.
	 * @return {Vector3} A vector that describes the size of this octree.
	 */

	getDimensions(target) {

		return this.root.getDimensions(target);

	}

	/**
	 * Recursively collects nodes that intersect with the specified region.
	 *
	 * @param {Frustum|Box3} region - A region.
	 * @return {Node[]} The nodes.
	 */

	cull(region) {

		const result = [];

		cull(this.root, region, result);

		return result;

	}

	/**
	 * Calculates the current depth of this octree.
	 *
	 * @return {Number} The depth.
	 */

	getDepth() {

		return getDepth(this.root);

	}

	/**
	 * Fetches all nodes of a specific depth level.
	 *
	 * @param {Number} level - The depth level.
	 * @return {Node[]} The nodes.
	 */

	findNodesByLevel(level) {

		const result = [];

		findNodesByLevel(this.root, level, 0, result);

		return result;

	}

	/**
	 * Finds the nodes that intersect with the given ray. The intersecting
	 * nodes are sorted by distance, closest first.
	 *
	 * @param {Raycaster} raycaster - A raycaster.
	 * @param {Node[]} [intersects] - An optional target list to be filled with the intersecting nodes.
	 * @return {Node[]} The intersecting nodes.
	 */

	raycast(raycaster, intersects = []) {

		OctreeRaycaster.intersectOctree(this, raycaster.ray, intersects);

		return intersects;

	}

	/**
	 * Returns an iterator that traverses the octree and returns leaf nodes.
	 *
	 * When a cull region is provided, the iterator will only return leaves that
	 * intersect with that region.
	 *
	 * @param {Frustum|Box3} [region] - A cull region.
	 * @return {Iterator} An iterator.
	 */

	leaves(region) {

		return new OctreeIterator(this, region);

	}

	/**
	 * Returns an iterator that traverses the octree and returns all leaf nodes.
	 *
	 * @return {Iterator} An iterator.
	 */

	[Symbol.iterator]() {

		return new OctreeIterator(this);

	}

}
