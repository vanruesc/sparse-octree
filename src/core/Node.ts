import { Vector3 } from "three";

/**
 * A tree node.
 */

export interface Node {

	/**
	 * The lower bounds of this node.
	 */

	min: Vector3;

	/**
	 * The upper bounds of the node.
	 */

	max: Vector3;

	/**
	 * The children of this node.
	 */

	children?: Node[];

	/**
	 * Calculates the center of this node.
	 *
	 * @param result - A vector to store the result in.
	 * @return A vector that describes the center of this node.
	 */

	getCenter(result: Vector3): Vector3;

	/**
	 * Calculates the size of this node.
	 *
	 * @param result - A vector to store the result in.
	 * @return A vector that describes the size of this node.
	 */

	getDimensions(result: Vector3): Vector3;

}
