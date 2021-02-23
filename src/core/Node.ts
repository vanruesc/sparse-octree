import { Vector3 } from "three";

/**
 * A tree node.
 */

export interface Node<T> {

	/**
	 * The lower bounds of this node.
	 */

	min: Vector3;

	/**
	 * The upper bounds of the node.
	 */

	max: Vector3;

	/**
	 * The data that belongs to this node.
	 */

	data?: T;

	/**
	 * The children of this node.
	 */

	children?: Node<T>[];

	/**
	 * Calculates the center of this octree.
	 *
	 * @param target - A target vector.
	 * @return A vector that describes the center of this octree.
	 */

	getCenter(target: Vector3): Vector3;

	/**
	 * Calculates the size of this octree.
	 *
	 * @param target - A target vector.
	 * @return A vector that describes the size of this octree.
	 */

	getDimensions(target: Vector3): Vector3;

}
