import { Vector3 } from "three";
import { PointContainer } from "./PointContainer";

/**
 * A collection of ray-point intersection data.
 *
 * @param T - The type of the data.
 */

export class RayPointIntersection<T> extends PointContainer<T> {

	/**
	 * The shortest distance from the point to the ray.
	 */

	distanceToRay: number;

	/**
	 * Constructs new ray-point intersection data.
	 *
	 * @param distanceToOrigin - The distance from the origin of the ray to the point.
	 * @param distanceToRay - The distance from the point to the ray.
	 * @param point - The point.
	 * @param data - The point's data.
	 */

	constructor(distanceToOrigin: number, distanceToRay: number, point: Vector3, data: T = null) {

		super(point, data, distanceToOrigin);
		this.distanceToRay = distanceToRay;

	}

}
