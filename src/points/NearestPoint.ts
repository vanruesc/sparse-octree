import { Vector3 } from "three";
import { Point } from "./Point";

/**
 * A point that contains proximity information.
 */

export class NearestPoint<T> extends Point<T> {

	/**
	 * The distance to another point.
	 */

	distance: number;

	/**
	 * Constructs a new nearest point.
	 *
	 * @param point - The point.
	 * @param data - The data.
	 * @param distance - The distance.
	 */

	constructor(point: Vector3 = null, data: T = null, distance: number = 0) {

		super(point, data);
		this.distance = distance;

	}

}
