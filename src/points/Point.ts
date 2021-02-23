import { Vector3 } from "three";

/**
 * A container for a point and the associated data.
 */

export class Point<T> {

	/**
	 * The point.
	 */

	point: Vector3;

	/**
	 * The data.
	 */

	data: T;

	/**
	 * Constructs a new point data collection.
	 *
	 * @param point - The point.
	 * @param data - The data.
	 */

	constructor(point: Vector3 = null, data: T = null) {

		this.point = point;
		this.data = data;

	}

}
