import { Raycaster, Vector3 } from "three";
import { RayPointIntersection } from "./RayPointIntersection.js";

/**
 * Reusable storage for a point raycast candidate.
 *
 * @internal
 */

export class RayPointHit {

	/**
	 * The closest position on the ray.
	 */

	readonly point: Vector3;

	/**
	 * The distance from the ray origin to the closest position.
	 */

	distance: number;

	/**
	 * The squared distance from the tested point to the ray.
	 */

	distanceToRaySq: number;

	/**
	 * Constructs reusable storage for a point raycast candidate.
	 */

	constructor() {

		this.point = new Vector3();
		this.distance = 0.0;
		this.distanceToRaySq = 0.0;

	}

	/**
	 * Projects a point onto the ray and checks the threshold and distance limits.
	 *
	 * @param raycaster - The raycaster.
	 * @param point - The point to test.
	 * @param thresholdSq - The squared point threshold.
	 * @return Whether the point hits. The stored hit data is valid when this method returns true.
	 */

	testPoint(raycaster: Raycaster, point: Vector3, thresholdSq: number): boolean {

		const ray = raycaster.ray;
		ray.closestPointToPoint(point, this.point);
		const distanceToRaySq = this.point.distanceToSquared(point);

		if(distanceToRaySq < thresholdSq) {

			const distance = ray.origin.distanceTo(this.point);

			if(distance >= raycaster.near && distance <= raycaster.far) {

				this.distance = distance;
				this.distanceToRaySq = distanceToRaySq;
				return true;

			}

		}

		return false;

	}

	/**
	 * Creates an intersection from the current hit with its own projected point.
	 *
	 * @remarks Call after a successful {@link testPoint} and before testing another point.
	 * @param data - The tested point's data.
	 * @return The intersection for the current hit.
	 */

	toIntersection<T>(data: T): RayPointIntersection<T> {

		return new RayPointIntersection<T>(this.distance, Math.sqrt(this.distanceToRaySq), this.point.clone(), data);

	}

}
