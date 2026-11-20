import { Raycaster } from "three";
import { RayAxis } from "../math/RayAxis.js";
import { PointOctant } from "./PointOctant.js";
import { RayPointIntersection } from "./RayPointIntersection.js";

/**
 * Traverses an octant whose padded bounds intersect the ray over the given interval.
 *
 * @param octant - The current octant.
 * @param raycaster - The raycaster used to test points at the leaves.
 * @param padding - The absolute point threshold plus the octree boundary bias.
 * @param x - The ray projection along the X axis.
 * @param y - The ray projection along the Y axis.
 * @param z - The ray projection along the Z axis.
 * @param flags - The layout bits for axes with negative ray directions (X = 4, Y = 2, Z = 1).
 * @param entry - The lower ray parameter of the current padded interval.
 * @param exit - The upper ray parameter of the current padded interval.
 * @param result - A list to be filled with intersecting points.
 */

function raycastOctant<T>(octant: PointOctant<T>, raycaster: Raycaster, padding: number,
	x: RayAxis, y: RayAxis, z: RayAxis, flags: number, entry: number, exit: number,
	result: RayPointIntersection<T>[]): void {

	const children = octant.children;

	if(children === null) {

		octant.data?.testPoints(raycaster, result);
		return;

	}

	// The first child is the lower half on every axis, so its upper corner is the split point.
	const mid = children[0].max;

	// The padded halves overlap between mid - padding and mid + padding.
	// In ray order, the far half starts at the overlap's entry and the near half ends at its exit.
	const tx0 = x.entry(mid.x - padding, mid.x + padding);
	const tx1 = x.exit(mid.x - padding, mid.x + padding);
	const ty0 = y.entry(mid.y - padding, mid.y + padding);
	const ty1 = y.exit(mid.y - padding, mid.y + padding);
	const tz0 = z.entry(mid.z - padding, mid.z + padding);
	const tz1 = z.exit(mid.z - padding, mid.z + padding);
	const nearZ = flags & 1;

	// Adjacent children share X and Y bounds and differ only along Z.
	for(let i = 0; i < children.length; i += 2) {

		// Reflect the layout bits for negative directions. A set bit selects the far half on that axis.
		const index = i ^ flags;
		const entryXY = Math.max(entry, (index & 4) !== 0 ? tx0 : -Infinity, (index & 2) !== 0 ? ty0 : -Infinity);
		const exitXY = Math.min(exit, (index & 4) === 0 ? tx1 : Infinity, (index & 2) === 0 ? ty1 : Infinity);

		if(!(entryXY <= exitXY && entryXY < Infinity)) {

			continue;

		}

		for(let j = 0; j < 2; ++j) {

			const child = children[i + j] as PointOctant<T>;

			if(child.children === null && child.data === null) {

				continue;

			}

			const farZ = j !== nearZ;
			const childEntry = farZ ? Math.max(entryXY, tz0) : entryXY;
			const childExit = farZ ? exitXY : Math.min(exitXY, tz1);

			// Keep boundary contacts, but reject intervals that can only start at infinity.
			if(childEntry <= childExit && childEntry < Infinity) {

				raycastOctant(child, raycaster, padding, x, y, z, flags, childEntry, childExit, result);

			}

		}

	}

}

/**
 * Finds point intersections by clipping one padded ray interval per octant.
 *
 * @param root - The root octant.
 * @param raycaster - The raycaster.
 * @param bias - The octree boundary bias.
 * @return The intersecting points. Sorted by distance, closest first.
 */

export function raycastPoints<T>(root: PointOctant<T>, raycaster: Raycaster, bias: number): RayPointIntersection<T>[] {

	const result: RayPointIntersection<T>[] = [];
	const threshold = raycaster.params.Points?.threshold ?? 0;

	if(!(threshold * threshold > 0.0)) {

		return result;

	}

	const { origin, direction } = raycaster.ray;
	const { min, max } = root;

	const padding = Math.abs(threshold) + bias;
	const x = new RayAxis(origin.x, direction.x);
	const y = new RayAxis(origin.y, direction.y);
	const z = new RayAxis(origin.z, direction.z);

	const entry = Math.max(
		0.0,
		x.entry(min.x - padding, max.x + padding),
		y.entry(min.y - padding, max.y + padding),
		z.entry(min.z - padding, max.z + padding)
	);

	const exit = Math.min(
		x.exit(min.x - padding, max.x + padding),
		y.exit(min.y - padding, max.y + padding),
		z.exit(min.z - padding, max.z + padding)
	);

	if(entry <= exit && entry < Infinity) {

		const flags = (x.reversed ? 4 : 0) | (y.reversed ? 2 : 0) | (z.reversed ? 1 : 0);
		raycastOctant(root, raycaster, padding, x, y, z, flags, entry, exit, result);

	}

	return result.sort((a, b) => a.distance - b.distance);

}
