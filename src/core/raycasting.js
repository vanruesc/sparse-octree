/**
 * Contains bytes used for bitwise operations. The last byte is used to store
 * raycasting flags.
 *
 * @property flags
 * @type Uint8Array
 * @private
 * @static
 * @final
 */

const flags = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 0]);

/**
 * A lookup-table containing octant ids. Used to determine the exit plane from
 * an octant.
 *
 * @property octantTable
 * @type Array
 * @private
 * @static
 * @final
 */

const octantTable = [

	new Uint8Array([4, 2, 1]),
	new Uint8Array([5, 3, 8]),
	new Uint8Array([6, 8, 3]),
	new Uint8Array([7, 8, 8]),
	new Uint8Array([8, 6, 5]),
	new Uint8Array([8, 7, 8]),
	new Uint8Array([8, 8, 7]),
	new Uint8Array([8, 8, 8])

];

/**
 * Finds the entry plane of the first octant that a ray travels through.
 *
 * Determining the first octant requires knowing which of the t0's is the
 * largest. The tm's of the other axes must also be compared against that
 * largest t0.
 *
 * @method findEntryOctant
 * @private
 * @static
 * @param {Number} tx0 - Ray projection parameter.
 * @param {Number} ty0 - Ray projection parameter.
 * @param {Number} tz0 - Ray projection parameter.
 * @param {Number} txm - Ray projection parameter mean.
 * @param {Number} tym - Ray projection parameter mean.
 * @param {Number} tzm - Ray projection parameter mean.
 * @return {Number} The index of the first octant that the ray travels through.
 */

function findEntryOctant(tx0, ty0, tz0, txm, tym, tzm) {

	let entry = 0;

	// Find the entry plane.
	if(tx0 > ty0 && tx0 > tz0) {

		// YZ-plane.
		if(tym < tx0) { entry = entry | 2; }
		if(tzm < tx0) { entry = entry | 1; }

	} else if(ty0 > tz0) {

		// XZ-plane.
		if(txm < ty0) { entry = entry | 4; }
		if(tzm < ty0) { entry = entry | 1; }

	} else {

		// XY-plane.
		if(txm < tz0) { entry = entry | 4; }
		if(tym < tz0) { entry = entry | 2; }

	}

	return entry;

}

/**
 * Finds the next octant that intersects with the ray based on the exit plane of
 * the current one.
 *
 * @method findNextOctant
 * @private
 * @static
 * @param {Number} currentOctant - The index of the current octant.
 * @param {Number} tx1 - Ray projection parameter.
 * @param {Number} ty1 - Ray projection parameter.
 * @param {Number} tz1 - Ray projection parameter.
 * @return {Number} The index of the next octant that the ray travels through.
 */

function findNextOctant(currentOctant, tx1, ty1, tz1) {

	let min;
	let exit = 0;

	// Find the exit plane.
	if(tx1 < ty1) {

		min = tx1;
		exit = 0; // YZ-plane.

	} else {

		min = ty1;
		exit = 1; // XZ-plane.

	}

	if(tz1 < min) {

		exit = 2; // XY-plane.

	}

	return octantTable[currentOctant][exit];

}

/**
 * Finds all octants that intersect with the given ray.
 *
 * @method raycastOctant
 * @private
 * @static
 * @param {Octant} octant - The current octant.
 * @param {Number} tx0 - Ray projection parameter. Initial tx0 = (minX - rayOriginX) / rayDirectionX.
 * @param {Number} ty0 - Ray projection parameter. Initial ty0 = (minY - rayOriginY) / rayDirectionY.
 * @param {Number} tz0 - Ray projection parameter. Initial tz0 = (minZ - rayOriginZ) / rayDirectionZ.
 * @param {Number} tx1 - Ray projection parameter. Initial tx1 = (maxX - rayOriginX) / rayDirectionX.
 * @param {Number} ty1 - Ray projection parameter. Initial ty1 = (maxY - rayOriginY) / rayDirectionY.
 * @param {Number} tz1 - Ray projection parameter. Initial tz1 = (maxZ - rayOriginZ) / rayDirectionZ.
 * @param {Raycaster} raycaster - The raycaster.
 * @param {Array} intersects - An array to be filled with the intersecting octants.
 */

function raycastOctant(octant, tx0, ty0, tz0, tx1, ty1, tz1, raycaster, intersects) {

	const children = octant.children;

	let currentOctant;
	let txm, tym, tzm;

	if(tx1 >= 0.0 && ty1 >= 0.0 && tz1 >= 0.0) {

		if(children === null) {

			// Leaf.
			intersects.push(octant);

		} else {

			// Compute means.
			txm = 0.5 * (tx0 + tx1);
			tym = 0.5 * (ty0 + ty1);
			tzm = 0.5 * (tz0 + tz1);

			currentOctant = findEntryOctant(tx0, ty0, tz0, txm, tym, tzm);

			do {

				/* The possibilities for the next node are passed in the same respective
				 * order as the t-values. Hence, if the first value is found to be the
				 * greatest, the fourth one will be returned. If the second value is the
				 * greatest, the fifth one will be returned, etc.
				 */

				switch(currentOctant) {

					case 0:
						raycastOctant(children[flags[8]], tx0, ty0, tz0, txm, tym, tzm, raycaster, intersects);
						currentOctant = findNextOctant(currentOctant, txm, tym, tzm);
						break;

					case 1:
						raycastOctant(children[flags[8] ^ flags[1]], tx0, ty0, tzm, txm, tym, tz1, raycaster, intersects);
						currentOctant = findNextOctant(currentOctant, txm, tym, tz1);
						break;

					case 2:
						raycastOctant(children[flags[8] ^ flags[2]], tx0, tym, tz0, txm, ty1, tzm, raycaster, intersects);
						currentOctant = findNextOctant(currentOctant, txm, ty1, tzm);
						break;

					case 3:
						raycastOctant(children[flags[8] ^ flags[3]], tx0, tym, tzm, txm, ty1, tz1, raycaster, intersects);
						currentOctant = findNextOctant(currentOctant, txm, ty1, tz1);
						break;

					case 4:
						raycastOctant(children[flags[8] ^ flags[4]], txm, ty0, tz0, tx1, tym, tzm, raycaster, intersects);
						currentOctant = findNextOctant(currentOctant, tx1, tym, tzm);
						break;

					case 5:
						raycastOctant(children[flags[8] ^ flags[5]], txm, ty0, tzm, tx1, tym, tz1, raycaster, intersects);
						currentOctant = findNextOctant(currentOctant, tx1, tym, tz1);
						break;

					case 6:
						raycastOctant(children[flags[8] ^ flags[6]], txm, tym, tz0, tx1, ty1, tzm, raycaster, intersects);
						currentOctant = findNextOctant(currentOctant, tx1, ty1, tzm);
						break;

					case 7:
						raycastOctant(children[flags[8] ^ flags[7]], txm, tym, tzm, tx1, ty1, tz1, raycaster, intersects);
						// Far top right octant. No other octants can be reached from here.
						currentOctant = 8;
						break;

				}

			} while(currentOctant < 8);

		}

	}

}

/**
 * A collection of utility functions for octree raycasting.
 *
 * Based on:
 *  "An Efficient Parametric Algorithm for Octree Traversal"
 *  by J. Revelles et al. (2000).
 *
 * @class Raycasting
 * @submodule core
 * @static
 */

export class Raycasting {

	/**
	 * Finds the octants that intersect with the given ray.
	 *
	 * @method raycast
	 * @static
	 * @param {Octree} octree - An octree.
	 * @param {Raycaster} raycaster - The raycaster.
	 * @param {Array} octants - An array to be filled with the intersecting octants.
	 */

	static raycast(octree, raycaster, octants) {

		const dimensions = octree.dimensions();
		const halfDimensions = dimensions.clone().multiplyScalar(0.5);

		// Translate the octree extents to the center of the octree.
		const min = octree.min.clone().sub(octree.min);
		const max = octree.max.clone().sub(octree.min);

		const direction = raycaster.ray.direction.clone();
		const origin = raycaster.ray.origin.clone();

		// Translate the ray to the center of the octree.
		origin.sub(octree.center()).add(halfDimensions);

		let invDirX, invDirY, invDirZ;
		let tx0, tx1, ty0, ty1, tz0, tz1;

		// Reset the last byte.
		flags[8] = flags[0];

		// Handle rays with negative directions.
		if(direction.x < 0.0) {

			origin.x = dimensions.x - origin.x;
			direction.x = -direction.x;
			flags[8] |= flags[4];

		}

		if(direction.y < 0.0) {

			origin.y = dimensions.y - origin.y;
			direction.y = -direction.y;
			flags[8] |= flags[2];

		}

		if(direction.z < 0.0) {

			origin.z = dimensions.z - origin.z;
			direction.z = -direction.z;
			flags[8] |= flags[1];

		}

		// Improve IEEE double stability.
		invDirX = 1.0 / direction.x;
		invDirY = 1.0 / direction.y;
		invDirZ = 1.0 / direction.z;

		// Project the ray to the root's boundaries.
		tx0 = (min.x - origin.x) * invDirX;
		tx1 = (max.x - origin.x) * invDirX;
		ty0 = (min.y - origin.y) * invDirY;
		ty1 = (max.y - origin.y) * invDirY;
		tz0 = (min.z - origin.z) * invDirZ;
		tz1 = (max.z - origin.z) * invDirZ;

		// Check if the ray hits the octree.
		if(Math.max(Math.max(tx0, ty0), tz0) < Math.min(Math.min(tx1, ty1), tz1)) {

			raycastOctant(octree.root, tx0, ty0, tz0, tx1, ty1, tz1, raycaster, octants);

		}

	}

}
