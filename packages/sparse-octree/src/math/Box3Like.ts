import { Vector3Like } from "./Vector3Like.js";

/**
 * The bounds of an axis-aligned box.
 */

export interface Box3Like {

	/**
	 * The lower bounds.
	 */

	readonly min: Readonly<Vector3Like>;

	/**
	 * The upper bounds.
	 */

	readonly max: Readonly<Vector3Like>;

}
