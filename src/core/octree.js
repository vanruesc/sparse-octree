import { Box3 } from "../math/box3.js";
import { Octant } from "./octant.js";
import { OctreeIterator } from "./octree-iterator.js";
import { OctreeRaycaster } from "./octree-raycaster.js";

/**
 * A computation helper.
 *
 * @property BOX3
 * @type Box3
 * @private
 * @static
 * @final
 */

const BOX3 = new Box3();

/**
 * Calculates the depth of the given octree.
 *
 * @method getDepth
 * @private
 * @static
 * @param {Octant} octant - An octant.
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
 * Collects octants that lie inside the specified region.
 *
 * @method calculateDepth
 * @private
 * @static
 * @param {Octant} octant - An octant.
 * @param {Frustum|Box3} region - A region.
 * @param {Array} result - A list that will be filled with octants that lie inside the region.
 */

function cull(octant, region, result) {

	const children = octant.children;

	let i, l;

	// Cache the computed max vector of cubic octants.
	BOX3.min = octant.min;
	BOX3.max = octant.max;

	if(region.intersectsBox(BOX3)) {

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
 * An octree that subdivides space for fast spatial searches.
 *
 * @class Octree
 * @submodule core
 * @implements Iterable
 * @constructor
 * @param {Vector3} [min] - The lower bounds of the tree.
 * @param {Vector3} [max] - The upper bounds of the tree.
 */

export class Octree {

	constructor(min, max) {

		/**
		 * The root octant.
		 *
		 * @property root
		 * @type Octant
		 * @default null
		 */

		this.root = (min !== undefined && max !== undefined) ? new Octant(min, max) : null;

	}

	/**
	 * The lower bounds of the root octant.
	 *
	 * @property min
	 * @type Vector3
	 */

	get min() { return this.root.min; }

	/**
	 * The upper bounds of the root octant.
	 *
	 * @property max
	 * @type Vector3
	 */

	get max() { return this.root.max; }

	/**
	 * The children of the root octant.
	 *
	 * @property children
	 * @type Array
	 */

	get children() { return this.root.children; }

	/**
	 * Calculates the center of this octree.
	 *
	 * @method getCenter
	 * @return {Vector3} A new vector that describes the center of this octree.
	 */

	getCenter() { return this.root.getCenter(); }

	/**
	 * Calculates the size of this octree.
	 *
	 * @method getDimensions
	 * @return {Vector3} A new vector that describes the size of this octree.
	 */

	getDimensions() { return this.root.getDimensions(); }

	/**
	 * Calculates the current depth of this octree.
	 *
	 * @method getDepth
	 * @return {Number} The depth.
	 */

	getDepth() {

		return getDepth(this.root);

	}

	/**
	 * Collects octants that lie inside the specified region.
	 *
	 * @method cull
	 * @param {Frustum|Box3} region - A region.
	 * @return {Array} The octants.
	 */

	cull(region) {

		const result = [];

		cull(this.root, region, result);

		return result;

	}

	/**
	 * Fetches all octants with the specified depth level.
	 *
	 * @method findOctantsByLevel
	 * @param {Number} level - The depth level.
	 * @return {Array} The octants.
	 */

	findOctantsByLevel(level) {

		const result = [];

		let h0 = [this.root];
		let h1 = [];

		let octant, children;
		let currentLevel = 0;

		while(h0.length > 0) {

			octant = h0.pop();
			children = octant.children;

			if(currentLevel === level) {

				result.push(octant);

			} else if(children !== null) {

				h1.push(...children);

			}

			if(h0.length === 0) {

				h0 = h1;
				h1 = [];

				if(++currentLevel > level) { break; }

			}

		}

		return result;

	}

	/**
	 * Finds the octants that intersect with the given ray. The intersecting
	 * octants are sorted by distance, closest first.
	 *
	 * @method raycast
	 * @param {Raycaster} raycaster - A raycaster.
	 * @param {Array} [intersects] - A list to be filled with intersecting octants.
	 */

	raycast(raycaster, intersects = []) {

		OctreeRaycaster.intersectOctree(this, raycaster, intersects);

	}

	/**
	 * Returns an iterator that traverses the octree and returns all leaf nodes.
	 *
	 * @method leaves
	 * @return {OctreeIterator} An iterator.
	 */

	leaves() {

		return this[Symbol.iterator]();

	}

	/**
	 * Returns an iterator that traverses the octree and returns all leaf nodes.
	 *
	 * @method Symbol.iterator
	 * @return {OctreeIterator} An iterator.
	 */

	[Symbol.iterator]() {

		return new OctreeIterator(this);

	}

}
