import { Vector3 } from "math-ds";
import { pattern } from "../core/Octant.js";

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

		const a = new Vector3();
		const b = new Vector3();
		const c = new Vector3();

		const min = octant.min;
		const mid = octant.getCenter();
		const halfDimensions = octant.getDimensions().multiplyScalar(0.5);

		const children = octant.children;
		const l = octants.length;

		let i, j;
		let combination, candidate;

		for(i = 0; i < 8; ++i) {

			combination = pattern[i];

			b.addVectors(min, a.fromArray(combination).multiply(halfDimensions));
			c.addVectors(mid, a.fromArray(combination).multiply(halfDimensions));

			// Find an octant that matches the current combination.
			for(j = 0; j < l; ++j) {

				candidate = octants[j];

				if(candidate !== null && b.equals(candidate.min) && c.equals(candidate.max)) {

					children[i] = candidate;
					octants[j] = null;

					break;

				}

			}

		}

	}

}
