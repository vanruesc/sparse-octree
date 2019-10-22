/**
 * The Octree contract.
 *
 * Implemented by objects that subdivide 3D space using octants.
 *
 * @interface
 */

export class Octree {

	/**
	 * Calculates the current depth of this octree.
	 *
	 * @return {Number} The depth.
	 */

	getDepth() {}

	/**
	 * Fetches all octants with the specified depth level.
	 *
	 * @param {Number} level - The depth level.
	 * @return {Octant[]} The octants.
	 */

	findOctantsByLevel(level) {}

}
