/**
 * A collection of ray-point intersection data.
 */

export class RayPointIntersection {

	/**
	 * Constructs new ray-point intersection data.
	 *
	 * @param {Number} distance - The distance from the origin of the ray to the point.
	 * @param {Number} distanceToRay - The distance from the point to the ray.
	 * @param {Vector3} point - The point.
	 * @param {Object} [object=null] - The point's data.
	 */

	constructor(distance, distanceToRay, point, object = null) {

		/**
		 * The distance from the origin of the ray to the point.
		 *
		 * @type {Number}
		 */

		this.distance = distance;

		/**
		 * The shortest distance from the point to the ray.
		 *
		 * @type {Number}
		 */

		this.distanceToRay = distanceToRay;

		/**
		 * The point.
		 *
		 * @type {Vector3}
		 */

		this.point = point;

		/**
		 * The point's data.
		 *
		 * @type {Object}
		 */

		this.object = object;

	}

}
