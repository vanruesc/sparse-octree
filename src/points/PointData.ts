import { Raycaster, Vector3 } from "three";
import { RayPointIntersection } from "./RayPointIntersection";

/**
 * A collection of many points and associated data entries.
 *
 * @param T - The type of the data.
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

	/**
	 * Collects points that intersect with the given ray.
	 *
	 * @param raycaster - The raycaster.
	 * @param result - An array to be filled with intersecting points.
	 */

	testPoints(raycaster: Raycaster, result: RayPointIntersection<T>[]): void {

		const threshold = raycaster.params.Points.threshold;
		const thresholdSq = threshold * threshold;
		const ray = raycaster.ray;

		const points = this.points;
		const data = this.data;

		for(let i = 0, l = points.length; i < l; ++i) {

			const point = points[i];
			const distanceToRaySq = ray.distanceSqToPoint(point);

			if(distanceToRaySq < thresholdSq) {

				const closestPoint = ray.closestPointToPoint(point, new Vector3());
				const distance = ray.origin.distanceTo(closestPoint);

				if(distance >= raycaster.near && distance <= raycaster.far) {

					result.push(new RayPointIntersection<T>(
						distance,
						Math.sqrt(distanceToRaySq),
						closestPoint,
						data[i]
					));

				}

			}

		}

	}

}
