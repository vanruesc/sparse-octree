import { DataContainer } from "../core/DataContainer.js";
import { Vector3 } from "../math/Vector3.js";
import { Vector3Like } from "../math/Vector3Like.js";

/**
 * A container for a single point and its data.
 *
 * @param T - The type of the data.
 */

export class PointContainer<T = unknown> implements DataContainer<T> {

	data: T | null;

	/**
	 * The point.
	 */

	point: Vector3Like | null;

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

	constructor(point: Vector3Like | null = null, data: T | null = null, distance = 0.0) {

		this.point = (point === null) ? null : Vector3.from(point);
		this.data = data;
		this.distance = distance;

	}

}
