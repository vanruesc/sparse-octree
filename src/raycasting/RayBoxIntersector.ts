import { Box3, Ray } from "three";
import { BoxIntersector } from "../core/BoxIntersector.js";

/**
 * Tests a ray against padded boxes using a reusable scratch box.
 *
 * @remarks Used by `PointOctree` to account for the octree bias and point range threshold.
 * @internal
 */

export class RayBoxIntersector implements BoxIntersector {

	/**
	 * A scratch box that preserves the original bounds.
	 */

	private readonly box: Box3;

	/**
	 * The ray used for intersection tests.
	 */

	ray: Ray | null;

	/**
	 * The padding applied to each box.
	 */

	padding: number;

	/**
	 * Constructs a new ray-box intersector.
	 */

	constructor() {

		this.box = new Box3();
		this.ray = null;
		this.padding = 0;

	}

	intersectsBox(bounds: Box3): boolean {

		return this.ray !== null && this.ray.intersectsBox(this.box.copy(bounds).expandByScalar(this.padding));

	}

}
