/**
 * Calculates an offset index from octant key coordinates.
 *
 * The index identifies the octant's positional offset relative to its parent:
 *
 * ```text
 *  0: [0, 0, 0]
 *  1: [0, 0, 1]
 *  2: [0, 1, 0]
 *  3: [0, 1, 1]
 *  4: [1, 0, 0]
 *  5: [1, 0, 1]
 *  6: [1, 1, 0]
 *  7: [1, 1, 1]
 * ```
 *
 * Note: This binary layout is defined in the external module `sparse-octree`.
 *
 * For more information on fast bitwise modulo with power of two divisors see:
 *  https://graphics.stanford.edu/~seander/bithacks.html#ModulusDivisionEasy
 *
 * @param x - The X-coordinate of the octant key.
 * @param y - The Y-coordinate of the octant key.
 * @param z - The Z-coordinate of the octant key.
 * @return The index of the relative positional offset. Range: [0, 7].
 */

export function calculateOffsetIndex(x: number, y: number, z: number): number {

	// Bitwise modulo: n % (1 << s) = n & ((1 << s) - 1) for positive integers.
	const offsetX = x & 1;
	const offsetY = y & 1;
	const offsetZ = z & 1;

	// Using a reversed packing order for correct indexing (X * 4 + Y * 2 + Z).
	return (offsetX << 2) + (offsetY << 1) + offsetZ;

}
