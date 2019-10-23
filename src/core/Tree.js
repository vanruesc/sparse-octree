/**
 * The Tree contract.
 *
 * Implemented by objects that organize data in a tree structure.
 *
 * @interface
 */

export class Tree {

	/**
	 * Calculates the depth of this tree.
	 *
	 * @return {Number} The depth.
	 */

	getDepth() {}

	/**
	 * Fetches all nodes of a specific depth level.
	 *
	 * @param {Number} level - The depth level.
	 * @return {Node[]} The nodes.
	 */

	findNodesByLevel(level) {}

}
