import { Box3, Ray, Vector3 } from "three";
import { Node } from "../core/Node.js";
import { RaycastingFlags } from "./RaycastingFlags.js";

const v = /* @__PURE__ */ new Vector3();
const b = /* @__PURE__ */ new Box3();
const d = /* @__PURE__ */ new Box3();
const r = /* @__PURE__ */ new Ray();

/**
 * Calculates ray projection parameters for the given octree and ray setup.
 *
 * @param octree - The octree.
 * @param ray - A ray.
 * @param flags - Raycasting flags.
 * @return The ray parameters `[tx0, ty0, tz0, tx1, ty1, tz1]`, or null if the ray doesn't hit the octree.
 */

export function intersectOctree(octree: Node, ray: Ray, flags: RaycastingFlags): number[] | null {

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

	// Handle rays with negative directions.
	if(direction.x < 0.0) {

		origin.x = dimensions.x - origin.x;
		direction.x = -direction.x;
		flags.value |= 4;

	}

	if(direction.y < 0.0) {

		origin.y = dimensions.y - origin.y;
		direction.y = -direction.y;
		flags.value |= 2;

	}

	if(direction.z < 0.0) {

		origin.z = dimensions.z - origin.z;
		direction.z = -direction.z;
		flags.value |= 1;

	}

	// Parallel rays must lie inside the corresponding slab, including its boundary faces.
	if((direction.x === 0.0 && (origin.x < min.x || origin.x > max.x)) ||
		(direction.y === 0.0 && (origin.y < min.y || origin.y > max.y)) ||
		(direction.z === 0.0 && (origin.z < min.z || origin.z > max.z))) {

		return null;

	}

	// Improve IEEE double stability.
	const invDirX = 1.0 / direction.x;
	const invDirY = 1.0 / direction.y;
	const invDirZ = 1.0 / direction.z;

	// Project the ray to the octant's boundaries.
	const tx0 = (direction.x === 0.0) ? -Infinity : (min.x - origin.x) * invDirX;
	const tx1 = (direction.x === 0.0) ? Infinity : (max.x - origin.x) * invDirX;
	const ty0 = (direction.y === 0.0) ? -Infinity : (min.y - origin.y) * invDirY;
	const ty1 = (direction.y === 0.0) ? Infinity : (max.y - origin.y) * invDirY;
	const tz0 = (direction.z === 0.0) ? -Infinity : (min.z - origin.z) * invDirZ;
	const tz1 = (direction.z === 0.0) ? Infinity : (max.z - origin.z) * invDirZ;

	// Check if the ray hits the octree.
	const hit = (Math.max(tx0, ty0, tz0) < Math.min(tx1, ty1, tz1));
	return hit ? [tx0, ty0, tz0, tx1, ty1, tz1] : null;

}
