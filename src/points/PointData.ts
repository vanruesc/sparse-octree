import { Vector3 } from "three";

/**
 * A collection of points and data.
 */

export class PointData<T> {

	/**
	 * The points.
	 */

	points: Vector3[];

	/**
	 * The data.
	 */

	data: T[];

	/**
	 * Constructs new point data.
	 */

	constructor() {

		this.points = [];
		this.data = [];

	}

}
