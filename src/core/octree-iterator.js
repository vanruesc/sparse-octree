import { Box3 } from "../math/box3.js";
import IteratorResult from "iterator-result";

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
 * An octree iterator.
 *
 * @class OctreeIterator
 * @submodule core
 * @implements Iterator
 * @constructor
 * @param {Octree} octree - An octree.
 * @param {Frustum|Box3} [region] - A cull region.
 */

export class OctreeIterator {

	constructor(octree, region = null) {

		/**
		 * The octree.
		 *
		 * @property octree
		 * @type Octree
		 * @private
		 */

		this.octree = octree;

		/**
		 * A region used for octree culling.
		 *
		 * @property region
		 * @type Frustum|Box3
		 */

		this.region = region;

		/**
		 * Whether this iterator should respect the cull region.
		 *
		 * @property cull
		 * @type Boolean
		 * @default false
		 */

		this.cull = (region !== null);

		/**
		 * An iterator result.
		 *
		 * @property result
		 * @type IteratorResult
		 * @private
		 */

		this.result = new IteratorResult();

		/**
		 * An octant trace.
		 *
		 * @property trace
		 * @type Array
		 * @private
		 */

		this.trace = null;

		/**
		 * Iteration indices.
		 *
		 * @property indices
		 * @type Array
		 * @private
		 */

		this.indices = null;

		this.reset();

	}

	/**
	 * Resets this iterator.
	 *
	 * @method reset
	 * @chainable
	 * @return {OctreeIterator} This iterator.
	 */

	reset() {

		const root = this.octree.root;

		this.trace = [];
		this.indices = [];

		if(root !== null) {

			BOX3.min = root.min;
			BOX3.max = root.max;

			if(!this.cull || this.region.intersectsBox(BOX3)) {

				this.trace.push(root);
				this.indices.push(0);

			}

		}

		this.result.reset();

		return this;

	}

	/**
	 * Iterates over the volume chunks.
	 *
	 * @method next
	 * @return {IteratorResult} The next voxel.
	 */

	next() {

		const cull = this.cull;
		const region = this.region;
		const indices = this.indices;
		const trace = this.trace;

		let octant = null;
		let depth = trace.length - 1;

		let index, children, child;

		while(octant === null && depth >= 0) {

			index = indices[depth];
			children = trace[depth].children;

			++indices[depth];

			if(index < 8) {

				if(children !== null) {

					child = children[index];

					if(cull) {

						BOX3.min = child.min;
						BOX3.max = child.max;

						if(!region.intersectsBox(BOX3)) {

							// Cull this octant.
							continue;

						}

					}

					trace.push(child);
					indices.push(0);

					++depth;

				} else {

					octant = trace.pop();
					indices.pop();

				}

			} else {

				trace.pop();
				indices.pop();

				--depth;

			}

		}

		this.result.value = octant;
		this.result.done = (octant === null);

		return this.result;

	}

	/**
	 * Called when this iterator will no longer be run to completion.
	 *
	 * @method return
	 * @param {Object} value - An interator result value.
	 * @return {IteratorResult} - A premature completion result.
	 */

	return(value) {

		this.result.value = value;
		this.result.done = true;

		return this.result;

	}

	/**
	 * Returns this iterator.
	 *
	 * @method Symbol.iterator
	 * @return {VoxelIterator} An iterator.
	 */

	[Symbol.iterator]() {

		return this;

	}

}
