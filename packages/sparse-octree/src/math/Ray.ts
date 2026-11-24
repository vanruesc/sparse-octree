import { Box3Like } from "./Box3Like.js";
import { RayLike } from "./RayLike.js";
import { Vector3 } from "./Vector3.js";
import { Vector3Like } from "./Vector3Like.js";

/**
 * A half-line with an origin and a direction.
 */

export class Ray implements RayLike {

	/**
	 * The ray origin.
	 */

	readonly origin: Vector3;

	/**
	 * The ray direction. Use a unit vector for point raycasting.
	 */

	readonly direction: Vector3;

	/**
	 * Creates a ray with copies of the supplied coordinates.
	 *
	 * @param origin - The ray origin. Defaults to zero.
	 * @param direction - The ray direction. Defaults to the negative Z axis.
	 */

	constructor(origin?: Vector3Like, direction?: Vector3Like) {

		this.origin = (origin === undefined) ? new Vector3() : Vector3.from(origin);
		this.direction = (direction === undefined) ? new Vector3(0, 0, -1) : Vector3.from(direction);

	}

	/**
	 * Checks whether this ray touches or crosses an axis-aligned box.
	 *
	 * @param box - The box to test.
	 * @return Whether this ray intersects the box.
	 */

	intersectsBox(box: Box3Like): boolean {

		return Ray.intersectsBox(this, box);

	}

	/**
	 * Checks whether a structural ray touches or crosses an axis-aligned box.
	 *
	 * @param ray - The ray to test.
	 * @param box - The box to test.
	 * @return Whether the ray intersects the box.
	 */

	static intersectsBox(ray: RayLike, box: Box3Like): boolean {

		const { min, max } = box;
		const { origin, direction } = ray;

		let entry = 0;
		let exit = Infinity;

		if(direction.x === 0) {

			if(origin.x < min.x || origin.x > max.x) {

				return false;

			}

		} else {

			const a = (min.x - origin.x) / direction.x;
			const b = (max.x - origin.x) / direction.x;
			entry = Math.max(entry, Math.min(a, b));
			exit = Math.max(a, b);

			if(entry > exit) {

				return false;

			}

		}

		if(direction.y === 0) {

			if(origin.y < min.y || origin.y > max.y) {

				return false;

			}

		} else {

			const a = (min.y - origin.y) / direction.y;
			const b = (max.y - origin.y) / direction.y;
			entry = Math.max(entry, Math.min(a, b));
			exit = Math.min(exit, Math.max(a, b));

			if(entry > exit) {

				return false;

			}

		}

		if(direction.z === 0) {

			if(origin.z < min.z || origin.z > max.z) {

				return false;

			}

		} else {

			const a = (min.z - origin.z) / direction.z;
			const b = (max.z - origin.z) / direction.z;
			entry = Math.max(entry, Math.min(a, b));
			exit = Math.min(exit, Math.max(a, b));

		}

		return entry <= exit;

	}

}
