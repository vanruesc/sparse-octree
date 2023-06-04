import { Vector3 } from "three";
import { DataContainer } from "../core/DataContainer.js";

/**
 * A container for a single point and its data.
 *
 * @param T - The type of the data.
 */

export class PointContainer<T> implements DataContainer<T> {

	data: T | null;

	/**
	 * The point.
	 */

	point: Vector3 | null;

	/**
	 * A contextual distance to another reference point.
	 *
	 * - (Nearest) point search: Distance to the search point or center.
	 * - Raycasting: Distance to the origin of the ray.
	 */

	distance: number;

	/**
	 * Constructs a new point.
	 *
	 * @param point - The point.
	 * @param data - The data.
	 * @param distance - A distance.
	 */

	constructor(point: Vector3 | null = null, data: T | null = null, distance = 0.0) {

		this.point = point;
		this.data = data;
		this.distance = distance;

	}

}
