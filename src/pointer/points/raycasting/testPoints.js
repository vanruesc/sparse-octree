import { Vector3 } from "math-ds";
import { RayPointIntersection } from "./RayPointIntersection.js";

/**
 * Collects points that intersect with the given ray.
 *
 * @param {PointOctant[]} octants - An array containing octants that intersect with the ray.
 * @param {Raycaster} raycaster - The raycaster.
 * @param {RayPointIntersection[]} intersects - An array to be filled with intersecting points.
 */

export function testPoints(octants, raycaster, intersects) {

	const threshold = raycaster.params.Points.threshold;
	const thresholdSq = threshold * threshold;

	let intersectPoint;
	let distance, distanceToRay;
	let rayPointDistanceSq;

	let i, j, il, jl;
	let octant, points, point;

	for(i = 0, il = octants.length; i < il; ++i) {

		octant = octants[i];
		points = octant.points;

		if(points !== null) {

			for(j = 0, jl = points.length; j < jl; ++j) {

				point = points[j];
				rayPointDistanceSq = raycaster.ray.distanceSqToPoint(point);

				if(rayPointDistanceSq < thresholdSq) {

					intersectPoint = raycaster.ray.closestPointToPoint(point, new Vector3());
					distance = raycaster.ray.origin.distanceTo(intersectPoint);

					if(distance >= raycaster.near && distance <= raycaster.far) {

						distanceToRay = Math.sqrt(rayPointDistanceSq);

						intersects.push(new RayPointIntersection(
							distance,
							distanceToRay,
							intersectPoint,
							octant.data[j]
						));

					}

				}

			}

		}

	}

}
