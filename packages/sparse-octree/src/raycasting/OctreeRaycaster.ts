import { Node } from "../core/Node.js";
import { RayLike } from "../math/RayLike.js";
import { Vector3 } from "../math/Vector3.js";
import { RaycastingFlags } from "./RaycastingFlags.js";
import { findEntryOctant } from "./findEntryOctant.js";
import { findNextOctant } from "./findNextOctant.js";
import { intersectOctree } from "./intersectOctree.js";

const flags = /* @__PURE__ */ new RaycastingFlags();
const v = /* @__PURE__ */ new Vector3();

/**
 * Traverses the current octant and appends intersected leaves in ray order.
 *
 * @remarks The six parameters describe the intervals where the ray is inside each axis slab.
 * The octant's entry is the largest of the three entry parameters, and its exit is the smallest of the three
 * exit parameters. {@link intersectOctree} reflects negative directions at the root so the traversal can
 * assume non-negative directions. The reflection flags map child indices back to the original layout.
 * For a parallel axis, the original ray origin determines which side of the split plane to traverse.
 *
 * @param node - The current octant.
 * @param ray - The original ray, used to resolve parallel axes.
 * @param tx0 - The X slab entry parameter.
 * @param ty0 - The Y slab entry parameter.
 * @param tz0 - The Z slab entry parameter.
 * @param tx1 - The X slab exit parameter.
 * @param ty1 - The Y slab exit parameter.
 * @param tz1 - The Z slab exit parameter.
 * @param result - The array to append intersected leaves to, closest first.
 */

function raycastOctant(node: Node, ray: RayLike, tx0: number, ty0: number, tz0: number,
	tx1: number, ty1: number, tz1: number, result: Node[]): void {

	if(!(tx1 >= 0.0 && ty1 >= 0.0 && tz1 >= 0.0)) {

		return;

	}

	const c = node.children;

	if(c === null || c === undefined) {

		// Leaf.
		result.push(node);
		return;

	}

	const direction = ray.direction;
	const origin = ray.origin;
	const center = (direction.x === 0.0 || direction.y === 0.0 || direction.z === 0.0) ? node.getCenter(v) : v;

	// Section 3.3, equation 12: parallel axes use the spatial midpoint instead of averaging opposite infinities.
	const txm = (direction.x === 0.0) ? ((origin.x < center.x) ? Infinity : -Infinity) : 0.5 * (tx0 + tx1);
	const tym = (direction.y === 0.0) ? ((origin.y < center.y) ? Infinity : -Infinity) : 0.5 * (ty0 + ty1);
	const tzm = (direction.z === 0.0) ? ((origin.z < center.z) ? Infinity : -Infinity) : 0.5 * (tz0 + tz1);

	const f = flags.value;
	let currentOctant = findEntryOctant(tx0, ty0, tz0, txm, tym, tzm);

	// Section 4: parametric traversal pseudocode, using the state transitions from section 3.2, table 3.
	// The possibilities for the next node are passed in the same respective order as the t-values.
	// Hence, if the first value is found to be the greatest, the fourth one will be returned.
	// If the second value is the greatest, the fifth one will be returned, etc.
	while(currentOctant < 8) {

		switch(currentOctant) {

			case 0:
				raycastOctant(c[f], ray, tx0, ty0, tz0, txm, tym, tzm, result);
				currentOctant = findNextOctant(currentOctant, txm, tym, tzm);
				break;

			case 1:
				raycastOctant(c[f ^ 1], ray, tx0, ty0, tzm, txm, tym, tz1, result);
				currentOctant = findNextOctant(currentOctant, txm, tym, tz1);
				break;

			case 2:
				raycastOctant(c[f ^ 2], ray, tx0, tym, tz0, txm, ty1, tzm, result);
				currentOctant = findNextOctant(currentOctant, txm, ty1, tzm);
				break;

			case 3:
				raycastOctant(c[f ^ 3], ray, tx0, tym, tzm, txm, ty1, tz1, result);
				currentOctant = findNextOctant(currentOctant, txm, ty1, tz1);
				break;

			case 4:
				raycastOctant(c[f ^ 4], ray, txm, ty0, tz0, tx1, tym, tzm, result);
				currentOctant = findNextOctant(currentOctant, tx1, tym, tzm);
				break;

			case 5:
				raycastOctant(c[f ^ 5], ray, txm, ty0, tzm, tx1, tym, tz1, result);
				currentOctant = findNextOctant(currentOctant, tx1, tym, tz1);
				break;

			case 6:
				raycastOctant(c[f ^ 6], ray, txm, tym, tz0, tx1, ty1, tzm, result);
				currentOctant = findNextOctant(currentOctant, tx1, ty1, tzm);
				break;

			case 7:
				raycastOctant(c[f ^ 7], ray, txm, tym, tzm, tx1, ty1, tz1, result);
				// Far top right octant. No other octants can be reached from here.
				currentOctant = 8;
				break;

		}

	}

}

/**
 * A raycaster for pointer-based octrees.
 *
 * @see "An Efficient Parametric Algorithm for Octree Traversal" by J. Revelles et al. (2000)
 */

export class OctreeRaycaster {

	/**
	 * Finds (pseudo) leaf octants that intersect with the given ray.
	 *
	 * @remarks Rays parallel to an internal splitting plane traverse the upper half on that axis.
	 * @param node - An octree node.
	 * @param ray - A ray.
	 * @return The intersecting octants. Sorted by distance, closest first.
	 */

	static intersectOctree(node: Node, ray: RayLike): Node[] {

		const result: Node[] = [];
		const t = intersectOctree(node, ray, flags);

		if(t !== null) {

			raycastOctant(node, ray, t[0], t[1], t[2], t[3], t[4], t[5], result);

		}

		return result;

	}

}
