import { Box3 } from "../box3.js";
import { Octant } from "./octant.js";
import { Raycasting } from "./raycasting.js";

/**
 * An octree that subdivides space for fast spatial searches.
 *
 * @class Octree
 * @submodule core
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

		let h0 = [this.root];
		let h1 = [];

		let depth = 0;
		let octant, children;

		while(h0.length > 0) {

			octant = h0.pop();
			children = octant.children;

			if(children !== null) {

				h1.push(...children);

			}

			if(h0.length === 0) {

				h0 = h1;
				h1 = [];

				if(h0.length > 0) { ++depth; }

			}

		}

		return depth;

	}

	/**
	 * Collects octants that lie inside the specified region.
	 *
	 * @method cull
	 * @param {Frustum|Box3} region - A frustum or a bounding box.
	 * @return {Array} The octants.
	 */

	cull(region) {

		const result = [];
		const heap = [this.root];
		const box = new Box3();

		let octant, children;

		while(heap.length > 0) {

			octant = heap.pop();
			children = octant.children;

			// Cache the computed max vector of cubic octants.
			box.min = octant.min;
			box.max = octant.max;

			if(region.intersectsBox(box)) {

				if(children !== null) {

					heap.push(...children);

				} else {

					result.push(octant);

				}

			}

		}

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
	 * Finds the octants that intersect with the given ray.
	 *
	 * @method raycast
	 * @param {Raycaster} raycaster - The raycaster.
	 * @param {Array} intersects - An array to be filled with the intersecting octants.
	 */

	raycast(raycaster, intersects) {

		Raycasting.raycast(this, raycaster, intersects);

	}

}
