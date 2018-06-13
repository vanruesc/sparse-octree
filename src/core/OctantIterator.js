import { Box3 } from "math-ds";
import IteratorResult from "iterator-result";

/**
 * A 3D box.
 *
 * @type {Box3}
 * @private
 */

const b = new Box3();

/**
 * An octant iterator.
 *
 * @implements {Iterator}
 * @implements {Iterable}
 */

export class OctantIterator {

	/**
	 * Constructs a new octant iterator.
	 *
	 * @param {Octree} octree - An octree.
	 * @param {Frustum|Box3} [region=null] - A cull region.
	 */

	constructor(octree, region = null) {

		/**
		 * The octree.
		 *
		 * @type {Octree}
		 * @private
		 */

		this.octree = octree;

		/**
		 * A region used for octree culling.
		 *
		 * @type {Frustum|Box3}
		 */

		this.region = region;

		/**
		 * Whether this iterator should respect the cull region.
		 *
		 * @type {Boolean}
		 */

		this.cull = (region !== null);

		/**
		 * An iterator result.
		 *
		 * @type {IteratorResult}
		 * @private
		 */

		this.result = new IteratorResult();

		/**
		 * An octant trace.
		 *
		 * @type {Octant[]}
		 * @private
		 */

		this.trace = null;

		/**
		 * Iteration indices.
		 *
		 * @type {Number[]}
		 * @private
		 */

		this.indices = null;

		this.reset();

	}

	/**
	 * Resets this iterator.
	 *
	 * @return {OctantIterator} This iterator.
	 */

	reset() {

		const root = this.octree.root;

		this.trace = [];
		this.indices = [];

		if(root !== null) {

			b.min = root.min;
			b.max = root.max;

			if(!this.cull || this.region.intersectsBox(b)) {

				this.trace.push(root);
				this.indices.push(0);

			}

		}

		this.result.reset();

		return this;

	}

	/**
	 * Iterates over the leaf octants.
	 *
	 * @return {IteratorResult} The next leaf octant.
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

			index = indices[depth]++;
			children = trace[depth].children;

			if(index < 8) {

				if(children !== null) {

					child = children[index];

					if(cull) {

						b.min = child.min;
						b.max = child.max;

						if(!region.intersectsBox(b)) {

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
	 * @return {OctantIterator} An iterator.
	 */

	[Symbol.iterator]() {

		return this;

	}

}
