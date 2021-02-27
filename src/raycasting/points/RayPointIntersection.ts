import { Vector3 } from "three";

/**
 * A collection of ray-point intersection data.
 */

export class RayPointIntersection<T> {

	/**
	 * The distance from the origin of the ray to the point.
	 */

	distanceToOrigin: number;

	/**
	 * The shortest distance from the point to the ray.
	 */

	distanceToRay: number;

	/**
	 * The point.
	 */

	point: Vector3;

	/**
	 * The data.
	 */

	data: T;

	/**
	 * Constructs new ray-point intersection data.
	 *
	 * @param distanceToOrigin - The distance from the origin of the ray to the point.
	 * @param distanceToRay - The distance from the point to the ray.
	 * @param point - The point.
	 * @param data - The point's data.
	 */

	constructor(distanceToOrigin: number, distanceToRay: number, point: Vector3, data: T = null) {

		this.distanceToOrigin = distanceToOrigin;
		this.distanceToRay = distanceToRay;
		this.point = point;
		this.data = data;

	}

}
