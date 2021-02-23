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
	 * Constructs a new point data collection.
	 */

	constructor() {

		this.points = [];
		this.data = [];

	}

}
