/**
 * Projects slab boundaries onto the ray along one axis.
 *
 * A parallel ray inside the slab, including on either boundary, leaves the ray interval unbounded on this axis.
 *
 * @internal
 */

export class RayAxis {

	/**
	 * Indicates whether the direction is negative, so the ray enters at the upper bound.
	 */

	readonly reversed: boolean;

	/**
	 * The ray origin's coordinate on this axis.
	 */

	private readonly origin: number;

	/**
	 * The ray direction's component on this axis.
	 */

	private readonly direction: number;

	/**
	 * The reciprocal of the direction component, cached for projecting bounds.
	 */

	private readonly inverseDirection: number;

	/**
	 * Constructs a new ray axis.
	 *
	 * @param origin - The ray origin's coordinate on this axis.
	 * @param direction - The ray direction's component on this axis.
	 */

	constructor(origin: number, direction: number) {

		this.origin = origin;
		this.direction = direction;
		this.reversed = direction < 0.0;
		this.inverseDirection = 1.0 / direction;

	}

	/**
	 * Projects the given bound by solving `origin + direction * t = bound`.
	 *
	 * @param bound - The boundary coordinate on this axis.
	 * @return The ray parameter at the boundary.
	 */

	private project(bound: number): number {

		const offset = bound - this.origin;

		// A tiny nonzero direction can have an infinite reciprocal.
		return Number.isFinite(this.inverseDirection) ? offset * this.inverseDirection : offset / this.direction;

	}

	/**
	 * Determines the ray parameter at which the ray enters the slab along this axis.
	 *
	 * For a parallel ray, returns `Infinity` if the origin is below `min` and `-Infinity` otherwise.
	 *
	 * @param min - The lower slab boundary.
	 * @param max - The upper slab boundary.
	 * @return The entry parameter.
	 */

	entry(min: number, max: number): number {

		if(this.direction === 0.0) {

			return (this.origin < min) ? Infinity : -Infinity;

		}

		return this.project(this.reversed ? max : min);

	}

	/**
	 * Determines the ray parameter at which the ray exits the slab along this axis.
	 *
	 * For a parallel ray, returns `-Infinity` if the origin is above `max` and `Infinity` otherwise.
	 *
	 * @param min - The lower slab boundary.
	 * @param max - The upper slab boundary.
	 * @return The exit parameter.
	 */

	exit(min: number, max: number): number {

		if(this.direction === 0.0) {

			return (this.origin > max) ? -Infinity : Infinity;

		}

		return this.project(this.reversed ? min : max);

	}

}
