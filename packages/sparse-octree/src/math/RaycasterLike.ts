import { RayLike } from "./RayLike.js";

/**
 * A ray and optional settings for point queries.
 */

export interface RaycasterLike {

	/**
	 * The ray to cast.
	 */

	readonly ray: RayLike;

	/**
	 * The minimum point hit distance from the ray origin. Defaults to zero.
	 */

	readonly near?: number;

	/**
	 * The maximum point hit distance from the ray origin. Defaults to infinity.
	 */

	readonly far?: number;

	/**
	 * The maximum distance from a point to the ray. Defaults to zero.
	 */

	readonly threshold?: number;

	/**
	 * An alternate threshold setting accepted for compatibility with Three.js raycasters.
	 */

	readonly params?: {

		/**
		 * Point settings used when the top-level threshold is omitted.
		 */

		// eslint-disable-next-line @typescript-eslint/naming-convention -- Matches the legacy raycaster field.
		readonly Points?: {

			/**
			 * The maximum distance from a point to the ray.
			 */

			readonly threshold?: number;

		};

	};

}

/**
 * Reads the threshold for a point query.
 *
 * @param raycaster - The ray and its settings.
 * @return The point threshold, or zero when unspecified.
 * @internal
 */

export function getPointThreshold(raycaster: RaycasterLike): number {

	return raycaster.threshold ?? raycaster.params?.Points?.threshold ?? 0;

}
