import { Vector3 } from "three";
import { NearestPoint } from "../../points/NearestPoint";

/**
 * A collection of ray-point intersection data.
 */

export class RayPointIntersection<T> {

	/**
	 * The shortest distance from the point to the ray.
	 */

	distanceToRay: number;

	/**
	 * The point, data and distance to the origin of the ray.
	 */

	point: NearestPoint<T>;

	/**
	 * Constructs new ray-point intersection data.
	 *
	 * @param distance - The distance from the origin of the ray to the point.
	 * @param distanceToRay - The distance from the point to the ray.
	 * @param point - The point.
	 * @param data - The point's data.
	 */

	constructor(distance: number, distanceToRay: number, point: Vector3, data: T = null) {

		this.distanceToRay = distanceToRay;
		this.point = new NearestPoint(point, data, distance);

	}

}
