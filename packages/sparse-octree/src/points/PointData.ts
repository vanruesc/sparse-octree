import { getPointThreshold, RaycasterLike } from "../math/RaycasterLike.js";
import { Vector3Like } from "../math/Vector3Like.js";
import { RayPointHit } from "./raycasting/RayPointHit.js";
import { RayPointIntersection } from "./raycasting/RayPointIntersection.js";

const hit = /* @__PURE__ */ new RayPointHit();

/**
 * A collection of many points and associated data entries.
 *
 * @param T - The type of the data.
 */

export class PointData<T = unknown> {

	/**
	 * The points.
	 */

	points: Vector3Like[];

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

	/**
	 * Collects points that intersect with the given ray.
	 *
	 * @param raycaster - The raycaster.
	 * @param result - An array to be filled with intersecting points.
	 */

	testPoints(raycaster: RaycasterLike, result: RayPointIntersection<T>[]): void {

		const threshold = getPointThreshold(raycaster);
		const thresholdSq = threshold * threshold;
		const points = this.points;
		const data = this.data;

		for(let i = 0, l = points.length; i < l; ++i) {

			if(hit.testPoint(raycaster, points[i], thresholdSq)) {

				result.push(hit.toIntersection(data[i]));

			}

		}

	}

	/**
	 * Updates the closest intersection with points from this leaf.
	 *
	 * @param raycaster - The raycaster.
	 * @param closest - The current closest hit, or null if none has been found.
	 * @return The closest intersection so far. Reuses the input hit when provided.
	 * @internal
	 */

	testClosestPoint(raycaster: RaycasterLike, closest: RayPointIntersection<T> | null): RayPointIntersection<T> | null {

		const threshold = getPointThreshold(raycaster);
		const thresholdSq = threshold * threshold;
		const points = this.points;
		const data = this.data;

		let result = closest;

		for(let i = 0, l = points.length; i < l; ++i) {

			// Keep the first hit at a given distance, matching the stable order of raycast().
			if(hit.testPoint(raycaster, points[i], thresholdSq) && (result === null || hit.distance < result.distance)) {

				if(result === null) {

					result = hit.toIntersection(data[i]);

				} else {

					result.distance = hit.distance;
					result.distanceToRay = Math.sqrt(hit.distanceToRaySq);
					const { x, y, z } = hit.point;
					const point = result.point!;
					point.x = x;
					point.y = y;
					point.z = z;
					result.data = data[i] ?? null;

				}

			}

		}

		return result;

	}

}
