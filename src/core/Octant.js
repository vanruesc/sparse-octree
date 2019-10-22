/**
 * The Octant contract.
 *
 * Implemented by objects that are managed by an octree.
 *
 * @interface
 */

export class Octant {

	/**
	 * The lower bounds of this octant.
	 *
	 * @type {Vector3}
	 */

	get min() { return null; }

	/**
	 * The upper bounds of the octant.
	 *
	 * @type {Vector3}
	 */

	get max() { return null; }

}
