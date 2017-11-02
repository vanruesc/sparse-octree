import { Box3, Vector3 } from "math-ds";
import { pattern } from "../core/Octant.js";

/**
 * A box.
 *
 * @type {Box3}
 * @private
 * @final
 */

const b = new Box3();

/**
 * A vector.
 *
 * @type {Vector3}
 * @private
 * @final
 */

const c = new Vector3();

/**
 * A vector.
 *
 * @type {Vector3}
 * @private
 * @final
 */

const u = new Vector3();

/**
 * A vector.
 *
 * @type {Vector3}
 * @private
 * @final
 */

const v = new Vector3();

/**
 * A collection of octree utility functions.
 */

export class OctreeUtils {

	/**
	 * Integrates octants into a parent octant.
	 *
	 * @param {Octant} octant - The parent octant.
	 * @param {Octant[]} octants - A list of potential child octants. Will be used destructively.
	 */

	static recycleOctants(octant, octants) {

		const min = octant.min;
		const mid = octant.getCenter(u);
		const halfDimensions = octant.getDimensions(v).multiplyScalar(0.5);

		const children = octant.children;
		const l = octants.length;

		let i, j;
		let combination, candidate;

		for(i = 0; i < 8; ++i) {

			combination = pattern[i];

			b.min.addVectors(min, c.fromArray(combination).multiply(halfDimensions));
			b.max.addVectors(mid, c.fromArray(combination).multiply(halfDimensions));

			// Find an octant that matches the current combination.
			for(j = 0; j < l; ++j) {

				candidate = octants[j];

				if(candidate !== null && b.min.equals(candidate.min) && b.max.equals(candidate.max)) {

					children[i] = candidate;
					octants[j] = null;

					break;

				}

			}

		}

	}

}
