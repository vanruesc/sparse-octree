import { Raycaster, Vector3 } from "three";
import { RayPointIntersection } from "./RayPointIntersection.js";

const projection = /* @__PURE__ */ new Vector3();

type HitVisitor<T, R> = (result: R, distance: number, distanceToRaySq: number, point: Vector3, data: T) => void;

function appendHit<T>(result: RayPointIntersection<T>[], distance: number,
	distanceToRaySq: number, point: Vector3, data: T): void {

	result.push(new RayPointIntersection<T>(distance, Math.sqrt(distanceToRaySq), point.clone(), data));

}

/**
 * A collection of many points and associated data entries.
 *
 * @param T - The type of the data.
 */

export class PointData<T = unknown> {

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

		this.visitHits(raycaster, result, appendHit);

	}

	/**
	 * Visits the points that intersect with the given ray.
	 *
	 * @param raycaster - The raycaster.
	 * @param result - The result passed to the visitor.
	 * @param visit - A visitor that may use the projected point until it returns.
	 * @internal
	 */

	visitHits<R>(raycaster: Raycaster, result: R, visit: HitVisitor<T, R>): void {

		const threshold = raycaster.params.Points?.threshold ?? 0;
		const thresholdSq = threshold * threshold;
		const ray = raycaster.ray;

		const points = this.points;
		const data = this.data;

		for(let i = 0, l = points.length; i < l; ++i) {

			const point = points[i];
			const closestPoint = ray.closestPointToPoint(point, projection);
			const distanceToRaySq = closestPoint.distanceToSquared(point);

			if(distanceToRaySq < thresholdSq) {

				const distance = ray.origin.distanceTo(closestPoint);

				if(distance >= raycaster.near && distance <= raycaster.far) {

					visit(result, distance, distanceToRaySq, closestPoint, data[i]);

				}

			}

		}

	}

}
