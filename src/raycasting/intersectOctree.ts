import { Box3, Ray, Vector3 } from "three";
import { Node } from "../core/Node";
import { RaycastingFlags } from "./RaycastingFlags";

const v = new Vector3();
const b = new Box3();
const d = new Box3();
const r = new Ray();

/**
 * Calculates ray projection parameters for the given octree and ray setup.
 *
 * @param octree - The octree.
 * @param ray - A ray.
 * @param flags - Raycasting flags.
 * @return The ray parameters `[tx0, ty0, tz0, tx1, ty1, tz1]`, or null if the ray doesn't hit the octree.
 */

export function intersectOctree(octree: Node, ray: Ray, flags: RaycastingFlags): number[] {

	// Translate the octant extents to the scene origin.
	const min = b.min.set(0, 0, 0);
	const max = b.max.subVectors(octree.max, octree.min);

	const dimensions = octree.getDimensions(d.min);
	const halfDimensions = d.max.copy(dimensions).multiplyScalar(0.5);

	const origin = r.origin.copy(ray.origin);
	const direction = r.direction.copy(ray.direction);

	// Translate the ray to the center of the octant.
	origin.sub(octree.getCenter(v)).add(halfDimensions);

	// Reset all flags.
	flags.value = 0;

	// Handle rays with negative directions and prevent division by zero.
	if(direction.x < 0.0) {

		origin.x = dimensions.x - origin.x;
		direction.x = -direction.x;
		flags.value |= 4;

	} else if(direction.x === 0.0) {

		direction.x = Number.EPSILON;

	}

	if(direction.y < 0.0) {

		origin.y = dimensions.y - origin.y;
		direction.y = -direction.y;
		flags.value |= 2;

	} else if(direction.y === 0.0) {

		direction.y = Number.EPSILON;

	}

	if(direction.z < 0.0) {

		origin.z = dimensions.z - origin.z;
		direction.z = -direction.z;
		flags.value |= 1;

	} else if(direction.z === 0.0) {

		direction.z = Number.EPSILON;

	}

	// Improve IEEE double stability.
	const invDirX = 1.0 / direction.x;
	const invDirY = 1.0 / direction.y;
	const invDirZ = 1.0 / direction.z;

	// Project the ray to the octant's boundaries.
	const tx0 = (min.x - origin.x) * invDirX;
	const tx1 = (max.x - origin.x) * invDirX;
	const ty0 = (min.y - origin.y) * invDirY;
	const ty1 = (max.y - origin.y) * invDirY;
	const tz0 = (min.z - origin.z) * invDirZ;
	const tz1 = (max.z - origin.z) * invDirZ;

	// Check if the ray hits the octree.
	const hit = (Math.max(tx0, ty0, tz0) < Math.min(tx1, ty1, tz1));
	return hit ? [tx0, ty0, tz0, tx1, ty1, tz1] : null;

}
