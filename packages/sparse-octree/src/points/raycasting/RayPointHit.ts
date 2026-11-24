import { RaycasterLike } from "../../math/RaycasterLike.js";
import { Vector3 } from "../../math/Vector3.js";
import { Vector3Like } from "../../math/Vector3Like.js";
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

	testPoint(raycaster: RaycasterLike, point: Vector3Like, thresholdSq: number): boolean {

		const { origin, direction } = raycaster.ray;
		const projection = (point.x - origin.x) * direction.x + (point.y - origin.y) * direction.y +
			(point.z - origin.z) * direction.z;

		if(projection < 0.0) {

			this.point.set(origin.x, origin.y, origin.z);

		} else {

			this.point.set(
				origin.x + direction.x * projection,
				origin.y + direction.y * projection,
				origin.z + direction.z * projection
			);

		}

		const distanceToRaySq = Vector3.distanceToSquared(this.point, point);

		if(distanceToRaySq < thresholdSq) {

			const distance = Math.sqrt(Vector3.distanceToSquared(origin, this.point));

			if(distance >= (raycaster.near ?? 0) && distance <= (raycaster.far ?? Infinity)) {

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

		return new RayPointIntersection<T>(this.distance, Math.sqrt(this.distanceToRaySq), this.point, data);

	}

}
