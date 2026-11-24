import { Vector3Like } from "./Vector3Like.js";

/**
 * The coordinates of a ray.
 */

export interface RayLike {

	/**
	 * The origin of the ray.
	 */

	readonly origin: Readonly<Vector3Like>;

	/**
	 * The direction of the ray. Use a unit vector for point raycasting.
	 */

	readonly direction: Readonly<Vector3Like>;

}
