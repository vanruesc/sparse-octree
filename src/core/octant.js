import { Vector3 } from "../vector3.js";

/**
 * An octant.
 *
 * @class Octant
 * @submodule core
 * @constructor
 * @param {Vector3} min - The lower bounds.
 * @param {Vector3} max - The upper bounds.
 */

export class Octant {

	constructor(min, max) {

		/**
		 * The lower bounds of this octant.
		 *
		 * @property min
		 * @type Vector3
		 */

		this.min = (min !== undefined) ? min : new Vector3();

		/**
		 * The upper bounds of the octant.
		 *
		 * @property max
		 * @type Vector3
		 */

		this.max = (max !== undefined) ? max : new Vector3();

		/**
		 * The children of this octant.
		 *
		 * @property children
		 * @type Array
		 * @default null
		 */

		this.children = null;

	}

	/**
	 * Computes the center of this octant.
	 *
	 * @method getCenter
	 * @return {Vector3} A new vector that describes the center of this octant.
	 */

	getCenter() { return this.min.clone().add(this.max).multiplyScalar(0.5); }

	/**
	 * Computes the size of this octant.
	 *
	 * @method getDimensions
	 * @return {Vector3} A new vector that describes the size of this octant.
	 */

	getDimensions() { return this.max.clone().sub(this.min); }

	/**
	 * Splits this octant into eight smaller ones.
	 *
	 * @method split
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
 * <pre>
 *    3____7
 *  2/___6/|
 *  | 1__|_5
 *  0/___4/
 * </pre>
 *
 * This common layout is crucial for positional assumptions.
 *
 * @property PATTERN
 * @type Array
 * @static
 * @final
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

