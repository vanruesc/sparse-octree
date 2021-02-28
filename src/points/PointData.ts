import { Vector3 } from "three";

/**
 * A collection of many points and associated data entries.
 */

export class PointData<T> {

	/**
	 * The points.
	 */

	points: Vector3[];

	/**
	 * The data entries.
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
