import { Ray } from "three";
import { Node } from "../core/Node";
import { Flags } from "./Flags";
import { findEntryOctant } from "./findEntryOctant";
import { findNextOctant } from "./findNextOctant";
import { intersectOctree } from "./intersectOctree";

/**
 * Raycasting flags.
 */

const flags = new Flags();

/**
 * Finds all octants that intersect with the given ray.
 *
 * @param node - The current node.
 * @param tx0 - A ray projection parameter.
 * @param ty0 - A ray projection parameter.
 * @param tz0 - A ray projection parameter.
 * @param tx1 - A ray projection parameter.
 * @param ty1 - A ray projection parameter.
 * @param tz1 - A ray projection parameter.
 * @param intersects - An array to be filled with the intersecting octants.
 */

function raycastOctant<T>(node: Node<T>, tx0: number, ty0: number, tz0: number,
	tx1: number, ty1: number, tz1: number, intersects: Node<T>[]) {

	if(tx1 >= 0.0 && ty1 >= 0.0 && tz1 >= 0.0) {

		const children = node.children;

		if(children === null) {

			// Leaf.
			intersects.push(node);

		} else {

			// Calculate mean values.
			const txm = 0.5 * (tx0 + tx1);
			const tym = 0.5 * (ty0 + ty1);
			const tzm = 0.5 * (tz0 + tz1);

			const f = flags.value;
			let currentOctant = findEntryOctant(tx0, ty0, tz0, txm, tym, tzm);

			/* The possibilities for the next node are passed in the same respective
			order as the t-values. Hence, if the first value is found to be the
			greatest, the fourth one will be returned. If the second value is the
			greatest, the fifth one will be returned, etc. */

			do {

				switch(currentOctant) {

					case 0:
						raycastOctant(children[f], tx0, ty0, tz0, txm, tym, tzm, intersects);
						currentOctant = findNextOctant(currentOctant, txm, tym, tzm);
						break;

					case 1:
						raycastOctant(children[f ^ 1], tx0, ty0, tzm, txm, tym, tz1, intersects);
						currentOctant = findNextOctant(currentOctant, txm, tym, tz1);
						break;

					case 2:
						raycastOctant(children[f ^ 2], tx0, tym, tz0, txm, ty1, tzm, intersects);
						currentOctant = findNextOctant(currentOctant, txm, ty1, tzm);
						break;

					case 3:
						raycastOctant(children[f ^ 3], tx0, tym, tzm, txm, ty1, tz1, intersects);
						currentOctant = findNextOctant(currentOctant, txm, ty1, tz1);
						break;

					case 4:
						raycastOctant(children[f ^ 4], txm, ty0, tz0, tx1, tym, tzm, intersects);
						currentOctant = findNextOctant(currentOctant, tx1, tym, tzm);
						break;

					case 5:
						raycastOctant(children[f ^ 5], txm, ty0, tzm, tx1, tym, tz1, intersects);
						currentOctant = findNextOctant(currentOctant, tx1, tym, tz1);
						break;

					case 6:
						raycastOctant(children[f ^ 6], txm, tym, tz0, tx1, ty1, tzm, intersects);
						currentOctant = findNextOctant(currentOctant, tx1, ty1, tzm);
						break;

					case 7:
						raycastOctant(children[f ^ 7], txm, tym, tzm, tx1, ty1, tz1, intersects);
						// Far top right octant. No other octants can be reached from here.
						currentOctant = 8;
						break;

				}

			} while(currentOctant < 8);

		}

	}

}

/**
 * A raycaster for pointer-based octrees.
 *
 * Reference:
 *  "An Efficient Parametric Algorithm for Octree Traversal"
 *  by J. Revelles et al. (2000)
 */

export class OctreeRaycaster {

	/**
	 * Finds (pseudo) leaf octants that intersect with the given ray.
	 *
	 * @param octree - An octree.
	 * @param ray - A ray.
	 * @param intersects - An array to be filled with the intersecting octants.
	 * @return The intersecting octants. Sorted by distance, closest first.
	 */

	static intersectOctree<T>(octree: Node<T>, ray: Ray, intersects: Node<T>[] = []): Node<T>[] {

		const parameters = intersectOctree(octree, ray, flags);

		if(parameters !== null) {

			raycastOctant(octree.root, ...parameters, intersects);

		}

	}

}
