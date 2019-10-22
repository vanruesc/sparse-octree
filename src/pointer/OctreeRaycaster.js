import {
	Flags,
	findEntryOctant,
	findNextOctant,
	intersectOctree
} from "../raycasting";

/**
 * Raycasting flags.
 *
 * @type {Flags}
 */

const flags = new Flags();

/**
 * Finds all octants that intersect with the given ray.
 *
 * @private
 * @param {Octant} octant - The current octant.
 * @param {Number} tx0 - A ray projection parameter.
 * @param {Number} ty0 - A ray projection parameter.
 * @param {Number} tz0 - A ray projection parameter.
 * @param {Number} tx1 - A ray projection parameter.
 * @param {Number} ty1 - A ray projection parameter.
 * @param {Number} tz1 - A ray projection parameter.
 * @param {Array} intersects - An array to be filled with the intersecting octants.
 */

function raycastOctant(octant, tx0, ty0, tz0, tx1, ty1, tz1, intersects) {

	if(tx1 >= 0.0 && ty1 >= 0.0 && tz1 >= 0.0) {

		const children = octant.children;

		if(children === null) {

			// Leaf.
			intersects.push(octant);

		} else {

			// Compute means.
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
	 * @param {PointerOctree} octree - An octree.
	 * @param {Ray} ray - A ray.
	 * @param {Octant[]} [intersects] - An optional target list to be filled with the intersecting octants.
	 * @return {Octant[]} The intersecting octants. Sorted by distance, closest first.
	 */

	static intersectOctree(octree, ray, intersects = []) {

		const result = intersectOctree(octree, ray, flags);

		if(result !== null) {

			raycastOctant(octree.root, ...result, intersects);

		}

	}

}
