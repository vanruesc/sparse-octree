import { Vector3 } from "three";

/**
 * A container for a point and associated data.
 */

export class Point<T> {

	/**
	 * The position of the point.
	 */

	point: Vector3;

	/**
	 * The associated data.
	 */

	data: T;

	/**
	 * Constructs a new point.
	 *
	 * @param point - The point.
	 * @param data - The data.
	 */

	constructor(point: Vector3 = null, data: T = null) {

		this.point = point;
		this.data = data;

	}

}
