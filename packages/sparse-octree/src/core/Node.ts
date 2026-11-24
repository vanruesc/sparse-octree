import { Box3Like } from "../math/Box3Like.js";
import { Vector3Like } from "../math/Vector3Like.js";

/**
 * A tree node.
 */

export interface Node extends Box3Like {

	/**
	 * The lower bounds of this node.
	 */

	min: Vector3Like;

	/**
	 * The upper bounds of the node.
	 */

	max: Vector3Like;

	/**
	 * The children of this node.
	 */

	children?: Node[] | null;

	/**
	 * Calculates the center of this node.
	 *
	 * @param result - A vector to store the result in.
	 * @return A vector that describes the center of this node.
	 */

	getCenter<T extends Vector3Like>(result: T): T;

	/**
	 * Calculates the size of this node.
	 *
	 * @param result - A vector to store the result in.
	 * @return A vector that describes the size of this node.
	 */

	getDimensions<T extends Vector3Like>(result: T): T;

}
