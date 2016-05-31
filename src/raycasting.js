import THREE from "three";

/**
 * A collection of utility functions for octree raycasting.
 *
 * Based on:
 *  "An Efficient Parametric Algorithm for Octree Traversal"
 *  by J. Revelles et al. (2000).
 *
 * @class Raycasting
 * @static
 */

/**
 * Contains bytes used for bitwise operations. The last byte 
 * is used to store raycasting flags.
 *
 * @property flags
 * @type Uint8Array
 * @static
 * @final
 */

export const flags = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 0]);

/**
 * A lookup-table containing octant ids. Used to determine 
 * the exit plane from an octant.
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
 * Determines the entry plane of the first octant that a 
 * ray travels through.
 *
 * Determining the first octant requires knowing which of 
 * the t0's is the largest. The tm's of the other axes must 
 * also be compared against that largest t0.
 *
 * @method getFirstOctant
 * @static
 * @param {Number} tx0 - Ray projection parameter.
 * @param {Number} ty0 - Ray projection parameter.
 * @param {Number} tz0 - Ray projection parameter.
 * @param {Number} txm - Ray projection parameter mean.
 * @param {Number} tym - Ray projection parameter mean.
 * @param {Number} tzm - Ray projection parameter mean.
 * @return {Number} The index of the first octant that the ray travels through.
 */

export function getFirstOctant(tx0, ty0, tz0, txm, tym, tzm) {

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
 * Fetches the next octant for raycasting based on the exit 
 * plane of the current one.
 *
 * @method getNextOctant
 * @static
 * @param {Number} currentOctant - The index of the current octant.
 * @param {Number} tx1 - Ray projection parameter.
 * @param {Number} ty1 - Ray projection parameter.
 * @param {Number} tz1 - Ray projection parameter.
 * @return {Number} The index of the next octant that the ray travels through.
 */

export function getNextOctant(currentOctant, tx1, ty1, tz1) {

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
 * Collects points that intersect with the ray.
 *
 * @method testPoints
 * @static
 * @param {Array} octants - An array containing octants that intersect with the ray.
 * @param {Raycaster} raycaster - The raycaster.
 * @param {Array} intersects - An array to be filled with the intersecting points.
 */

export function testPoints(octants, raycaster, intersects) {

	const threshold = raycaster.params.Points.threshold;
	const thresholdSq = threshold * threshold;
	const p = new THREE.Vector3();

	let intersectPoint;
	let distance, distanceToRay;
	let rayPointDistanceSq;

	let i, j, il, jl;
	let octant, dataSet, data;

	for(i = 0, il = octants.length; i < il; ++i) {

		octant = octants[i];

		for(j = 0, jl = octant.totalPoints; j < jl; ++j) {

			p.fromArray(octant.points[j]);
			rayPointDistanceSq = raycaster.ray.distanceSqToPoint(p);

			if(rayPointDistanceSq < thresholdSq) {

				intersectPoint = raycaster.ray.closestPointToPoint(p);
				distance = raycaster.ray.origin.distanceTo(intersectPoint);

				if(distance >= raycaster.near && distance <= raycaster.far) {

					dataSet = octant.dataSets[j];
					distanceToRay = Math.sqrt(rayPointDistanceSq);

					if(dataSet.size > 0) {

						// Unfold data aggregation.
						for(data of dataSet) {

							intersects.push({
								distance: distance,
								distanceToRay: distanceToRay,
								point: intersectPoint.clone(),
								object: data
							});

						}

					} else {

						intersects.push({
							distance: distance,
							distanceToRay: distanceToRay,
							point: intersectPoint.clone(),
							object: null
						});

					}

				}

			}

		}

	}

}
