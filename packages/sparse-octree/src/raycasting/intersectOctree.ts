import { Node } from "../core/Node.js";
import { RayLike } from "../math/RayLike.js";
import { Vector3 } from "../math/Vector3.js";
import { RaycastingFlags } from "./RaycastingFlags.js";

const center = /* @__PURE__ */ new Vector3();
const dimensions = /* @__PURE__ */ new Vector3();

/**
 * Calculates ray projection parameters for the given octree and ray setup.
 *
 * @param octree - The octree.
 * @param ray - A ray.
 * @param flags - Raycasting flags.
 * @return The ray parameters `[tx0, ty0, tz0, tx1, ty1, tz1]`, or null if the ray doesn't hit the octree.
 */

export function intersectOctree(octree: Node, ray: RayLike, flags: RaycastingFlags): number[] | null {

	// Translate the octant extents to the scene origin.
	const { min, max } = octree;
	const maxX = max.x - min.x;
	const maxY = max.y - min.y;
	const maxZ = max.z - min.z;

	const size = octree.getDimensions(dimensions);
	const midpoint = octree.getCenter(center);
	const { origin, direction } = ray;
	let ox = origin.x - midpoint.x + size.x * 0.5;
	let oy = origin.y - midpoint.y + size.y * 0.5;
	let oz = origin.z - midpoint.z + size.z * 0.5;
	let dx = direction.x;
	let dy = direction.y;
	let dz = direction.z;

	// Reset all flags.
	flags.value = 0;

	// Handle rays with negative directions.
	if(dx < 0.0) {

		ox = size.x - ox;
		dx = -dx;
		flags.value |= 4;

	}

	if(dy < 0.0) {

		oy = size.y - oy;
		dy = -dy;
		flags.value |= 2;

	}

	if(dz < 0.0) {

		oz = size.z - oz;
		dz = -dz;
		flags.value |= 1;

	}

	// Parallel rays must lie inside the corresponding slab, including its boundary faces.
	if((dx === 0.0 && (ox < 0.0 || ox > maxX)) ||
		(dy === 0.0 && (oy < 0.0 || oy > maxY)) ||
		(dz === 0.0 && (oz < 0.0 || oz > maxZ))) {

		return null;

	}

	// Improve IEEE double stability.
	const invDirX = 1.0 / dx;
	const invDirY = 1.0 / dy;
	const invDirZ = 1.0 / dz;

	// Project the ray to the octant's boundaries.
	const tx0 = (dx === 0.0) ? -Infinity : (0.0 - ox) * invDirX;
	const tx1 = (dx === 0.0) ? Infinity : (maxX - ox) * invDirX;
	const ty0 = (dy === 0.0) ? -Infinity : (0.0 - oy) * invDirY;
	const ty1 = (dy === 0.0) ? Infinity : (maxY - oy) * invDirY;
	const tz0 = (dz === 0.0) ? -Infinity : (0.0 - oz) * invDirZ;
	const tz1 = (dz === 0.0) ? Infinity : (maxZ - oz) * invDirZ;

	// Check if the ray hits the octree.
	const hit = (Math.max(tx0, ty0, tz0) < Math.min(tx1, ty1, tz1));
	return hit ? [tx0, ty0, tz0, tx1, ty1, tz1] : null;

}
