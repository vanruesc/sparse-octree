import { Octant } from "./octant";
import { Raycasting } from "./raycasting";

/**
 * An octree that subdivides space for fast spatial searches.
 *
 * @class Octree
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
	 * Calculates the size of this octree.
	 *
	 * @method dimensions
	 * @return {Vector3} A new vector that describes the size of this octree.
	 */

	dimensions() { return this.root.dimensions(); }

	/**
	 * Calculates the center of this octree.
	 *
	 * @method center
	 * @return {Vector3} A new vector that describes the center of this octree.
	 */

	center() { return this.root.center(); }

	/**
	 * Calculates the current depth of this octree.
	 *
	 * @method depth
	 * @return {Number} The depth.
	 */

	depth() { return this.root.depth(); }

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

		let octant, children;

		while(heap.length > 0) {

			octant = heap.pop();
			children = octant.children;

			if(region.intersectsBox(octant)) {

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
	 * Fetches all octants with the specified level.
	 *
	 * @method findOctantsByLevel
	 * @param {Number} level - The depth level.
	 * @return {Array} The octants.
	 */

	findOctantsByLevel(level) {

		const result = [];
		const heap = [this.root];

		let octant, children;

		while(heap.length > 0) {

			octant = heap.pop();
			children = octant.children;

			if(octant.level === level) {

				result.push(octant);

			} else if(children !== null) {

				heap.push(...children);

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
