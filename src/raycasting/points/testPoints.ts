import { Raycaster, Vector3 } from "three";
import { PointOctant } from "../../points/PointOctant";
import { RayPointIntersection } from "./RayPointIntersection";

/**
 * Collects points that intersect with the given ray.
 *
 * @param octants - An array containing octants that intersect with the ray.
 * @param raycaster - The raycaster.
 * @param intersects - An array to be filled with intersecting points.
 */

export function testPoints<T>(octants: PointOctant<T>[], raycaster: Raycaster,
	intersects: RayPointIntersection<T>[]): void {

	const threshold = raycaster.params.Points.threshold;
	const thresholdSq = threshold * threshold;

	for(let i = 0, il = octants.length; i < il; ++i) {

		const octant = octants[i];
		const pointData = octant.data;

		if(pointData !== null) {

			const points = pointData.points;
			const data = pointData.data;

			for(let j = 0, jl = points.length; j < jl; ++j) {

				const point = points[j];
				const distanceToRaySquared = raycaster.ray.distanceSqToPoint(point);

				if(distanceToRaySquared < thresholdSq) {

					const closestPoint = raycaster.ray.closestPointToPoint(point, new Vector3());
					const distance = raycaster.ray.origin.distanceTo(closestPoint);

					if(distance >= raycaster.near && distance <= raycaster.far) {

						intersects.push(new RayPointIntersection<T>(
							distance,
							Math.sqrt(distanceToRaySquared),
							closestPoint,
							data[j]
						));

					}

				}

			}

		}

	}

}
