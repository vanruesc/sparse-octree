import { Vector3Like } from "./Vector3Like.js";

/**
 * Library-owned storage for three coordinates.
 *
 * @internal
 */

export class Vector3 implements Vector3Like {

	/**
	 * The X coordinate.
	 */

	x: number;

	/**
	 * The Y coordinate.
	 */

	y: number;

	/**
	 * The Z coordinate.
	 */

	z: number;

	/**
	 * Creates a vector. Omitted coordinates default to zero.
	 *
	 * @param x - The X coordinate.
	 * @param y - The Y coordinate.
	 * @param z - The Z coordinate.
	 */

	constructor(x = 0, y = 0, z = 0) {

		this.x = x;
		this.y = y;
		this.z = z;

	}

	/**
	 * Updates this vector's coordinates.
	 *
	 * @param x - The X coordinate.
	 * @param y - The Y coordinate.
	 * @param z - The Z coordinate.
	 * @return This vector.
	 */

	set(x: number, y: number, z: number): this {

		this.x = x;
		this.y = y;
		this.z = z;
		return this;

	}

	/**
	 * Copies coordinates into a new vector.
	 *
	 * @param source - The coordinates to copy.
	 * @return A new vector with the given coordinates.
	 */

	static from(source: Vector3Like): Vector3 {

		return new Vector3(source.x, source.y, source.z);

	}

	/**
	 * Checks whether two vectors have identical coordinates.
	 *
	 * @param a - The first vector.
	 * @param b - The second vector.
	 * @return Whether the coordinates match.
	 */

	static equals(a: Vector3Like, b: Vector3Like): boolean {

		return a.x === b.x && a.y === b.y && a.z === b.z;

	}

	/**
	 * Computes the squared distance between two vectors.
	 *
	 * @param a - The first vector.
	 * @param b - The second vector.
	 * @return The squared distance.
	 */

	static distanceToSquared(a: Vector3Like, b: Vector3Like): number {

		const x = a.x - b.x;
		const y = a.y - b.y;
		const z = a.z - b.z;
		return x * x + y * y + z * z;

	}

}
