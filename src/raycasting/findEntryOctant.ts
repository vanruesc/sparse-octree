/**
 * Finds the entry plane of the first octant that a ray travels through.
 *
 * Determining the first octant requires knowing which of the t0s is the
 * largest. The tms of the other axes must also be compared against that
 * largest t0.
 *
 * @param tx0 - Ray projection parameter.
 * @param ty0 - Ray projection parameter.
 * @param tz0 - Ray projection parameter.
 * @param txm - Ray projection parameter mean.
 * @param tym - Ray projection parameter mean.
 * @param tzm - Ray projection parameter mean.
 * @return The index of the first octant that the ray travels through.
 */

export function findEntryOctant(tx0: number, ty0: number, tz0: number,
	txm: number, tym: number, tzm: number): number {

	let entry = 0;

	// Find the entry plane.
	if(tx0 > ty0 && tx0 > tz0) {

		// YZ-plane.
		if(tym < tx0) {

			entry |= 2;

		}

		if(tzm < tx0) {

			entry |= 1;

		}

	} else if(ty0 > tz0) {

		// XZ-plane.
		if(txm < ty0) {

			entry |= 4;

		}

		if(tzm < ty0) {

			entry |= 1;

		}

	} else {

		// XY-plane.
		if(txm < tz0) {

			entry |= 4;

		}

		if(tym < tz0) {

			entry |= 2;

		}

	}

	return entry;

}
