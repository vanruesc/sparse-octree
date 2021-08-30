/**
 * A lookup-table containing octant ids. Used to determine the exit plane from
 * an octant.
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
 * Finds the next octant that intersects with the ray based on the exit plane of
 * the current one.
 *
 * @param currentOctant - The index of the current octant.
 * @param tx1 - Ray projection parameter.
 * @param ty1 - Ray projection parameter.
 * @param tz1 - Ray projection parameter.
 * @return The index of the next octant that the ray travels through.
 */

export function findNextOctant(currentOctant: number, tx1: number, ty1: number,
	tz1: number): number {

	let min: number;
	let exit: number;

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
