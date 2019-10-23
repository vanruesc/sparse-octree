/**
 * The Node contract.
 *
 * Implemented by objects that are stored in a tree structure.
 *
 * @interface
 */

export class Node {

	/**
	 * The lower bounds of this node.
	 *
	 * @type {Vector3}
	 */

	get min() { return null; }

	/**
	 * The upper bounds of the node.
	 *
	 * @type {Vector3}
	 */

	get max() { return null; }

}
