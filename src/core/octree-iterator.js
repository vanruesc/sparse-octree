import IteratorResult from "iterator-result";

/**
 * An octree iterator.
 *
 * @class OctreeIterator
 * @submodule core
 * @implements Iterator
 * @constructor
 * @param {Octree} octree - An octree.
 */

export class OctreeIterator {

	constructor(octree) {

		/**
		 * The octree.
		 *
		 * @property octree
		 * @type Octree
		 * @private
		 */

		this.octree = octree;

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
	 */

	reset() {

		this.trace = [this.octree.root];
		this.indices = [0];

		this.result.reset();

	}

	/**
	 * Iterates over the volume chunks.
	 *
	 * @method next
	 * @return {IteratorResult} The next voxel.
	 */

	next() {

		const indices = this.indices;
		const trace = this.trace;

		let octant = null;
		let i = trace.length - 1;

		let index, children, child;

		while(octant === null && i >= 0) {

			index = indices[i];
			children = trace[i].children;

			++indices[i];

			if(index < 8) {

				if(children !== null) {

					child = children[index];

					trace.push(child);
					indices.push(0);

					++i;

				} else {

					octant = trace.pop();
					indices.pop();

				}

			} else {

				trace.pop();
				indices.pop();

				--i;

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
