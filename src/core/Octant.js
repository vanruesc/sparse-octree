import { Vector3 } from "math-ds";

/**
 * An octant.
 */

export class Octant {

	/**
	 * Constructs a new octant.
	 *
	 * @param {Vector3} [min] - The lower bounds.
	 * @param {Vector3} [max] - The upper bounds.
	 */

	constructor(min = new Vector3(), max = new Vector3()) {

		/**
		 * The lower bounds of this octant.
		 *
		 * @type {Vector3}
		 */

		this.min = min;

		/**
		 * The upper bounds of the octant.
		 *
		 * @type {Vector3}
		 */

		this.max = max;

		/**
		 * The children of this octant.
		 *
		 * @type {Octant[]}
		 * @default null
		 */

		this.children = null;

	}

	/**
	 * Computes the center of this octant.
	 *
	 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
	 * @return {Vector3} A vector that describes the center of this octant.
	 */

	getCenter(target = new Vector3()) {

		return target.copy(this.min).add(this.max).multiplyScalar(0.5);

	}

	/**
	 * Computes the size of this octant.
	 *
	 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
	 * @return {Vector3} A vector that describes the size of this octant.
	 */

	getDimensions(target = new Vector3()) {

		return target.copy(this.max).sub(this.min);

	}

	/**
	 * Splits this octant into eight smaller ones.
	 *
	 * @param {Array} [octants] - A list of octants to recycle.
	 */

	split(octants) {

		const min = this.min;
		const max = this.max;
		const mid = this.getCenter();

		let i, j;
		let l = 0;
		let combination;

		let halfDimensions;
		let v, child, octant;

		if(Array.isArray(octants)) {

			halfDimensions = this.getDimensions().multiplyScalar(0.5);
			v = [new Vector3(), new Vector3(), new Vector3()];
			l = octants.length;

		}

		this.children = [];

		for(i = 0; i < 8; ++i) {

			combination = PATTERN[i];
			octant = null;

			if(l > 0) {

				v[1].addVectors(min, v[0].fromArray(combination).multiply(halfDimensions));
				v[2].addVectors(mid, v[0].fromArray(combination).multiply(halfDimensions));

				// Find an octant that matches the current combination.
				for(j = 0; j < l; ++j) {

					child = octants[j];

					if(child !== null && v[1].equals(child.min) && v[2].equals(child.max)) {

						octant = child;
						octants[j] = null;

						break;

					}

				}

			}

			this.children.push((octant !== null) ? octant : new this.constructor(

				new Vector3(
					((combination[0] === 0) ? min.x : mid.x),
					((combination[1] === 0) ? min.y : mid.y),
					((combination[2] === 0) ? min.z : mid.z)
				),

				new Vector3(
					((combination[0] === 0) ? mid.x : max.x),
					((combination[1] === 0) ? mid.y : max.y),
					((combination[2] === 0) ? mid.z : max.z)
				)

			));

		}

	}

}

/**
 * A binary pattern that describes the standard octant layout:
 *
 * ```text
 *    3____7
 *  2/___6/|
 *  | 1__|_5
 *  0/___4/
 * ```
 *
 * This common layout is crucial for positional assumptions.
 *
 * @type {Uint8Array[]}
 */

export const PATTERN = [

	new Uint8Array([0, 0, 0]),
	new Uint8Array([0, 0, 1]),
	new Uint8Array([0, 1, 0]),
	new Uint8Array([0, 1, 1]),

	new Uint8Array([1, 0, 0]),
	new Uint8Array([1, 0, 1]),
	new Uint8Array([1, 1, 0]),
	new Uint8Array([1, 1, 1])

];

/**
 * Describes all possible octant corner connections.
 *
 * @type {Uint8Array[]}
 */

export const EDGES = [

	// X-Axis.
	new Uint8Array([0, 4]),
	new Uint8Array([1, 5]),
	new Uint8Array([2, 6]),
	new Uint8Array([3, 7]),

	// Y-Axis.
	new Uint8Array([0, 2]),
	new Uint8Array([1, 3]),
	new Uint8Array([4, 6]),
	new Uint8Array([5, 7]),

	// Z-Axis.
	new Uint8Array([0, 1]),
	new Uint8Array([2, 3]),
	new Uint8Array([4, 5]),
	new Uint8Array([6, 7])

];
