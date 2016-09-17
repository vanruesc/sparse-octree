import { PATTERN } from "./octant.js";
import { Vector3 } from "../vector3.js";

/**
 * A cubic octant.
 *
 * @class CubicOctant
 * @submodule core
 * @constructor
 * @param {Vector3} min - The lower bounds.
 * @param {Number} size - The size of the octant.
 */

export class CubicOctant {

	constructor(min, size) {

		/**
		 * The lower bounds of this octant.
		 *
		 * @property min
		 * @type Vector3
		 */

		this.min = (min !== undefined) ? min : new Vector3();

		/**
		 * The size of this octant.
		 *
		 * @property size
		 * @type Number
		 */

		this.size = (size !== undefined) ? size : 0;

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
	 * The upper bounds of this octant.
	 *
	 * @property max
	 * @type Vector3
	 */

	get max() { return this.min.clone().addScalar(this.size); }

	/**
	 * Computes the center of this octant.
	 *
	 * @method getCenter
	 * @return {Vector3} A new vector that describes the center of this octant.
	 */

	getCenter() { return this.min.clone().addScalar(this.size * 0.5); }

	/**
	 * Returns the size of this octant as a vector.
	 *
	 * @method getDimensions
	 * @return {Vector3} A new vector that describes the size of this octant.
	 */

	getDimensions() { return new Vector3(this.size, this.size, this.size); }

	/**
	 * Splits this octant into eight smaller ones.
	 *
	 * @method split
	 * @param {Array} [octants] - A list of octants to recycle.
	 */

	split(octants) {

		const min = this.min;
		const mid = this.getCenter();
		const halfSize = this.size * 0.5;

		let i, j;
		let l = 0;
		let combination;

		let v, child, octant;

		if(Array.isArray(octants)) {

			v = new Vector3();
			l = octants.length;

		}

		this.children = [];

		for(i = 0; i < 8; ++i) {

			combination = PATTERN[i];
			octant = null;

			if(l > 0) {

				v.fromArray(combination).multiplyScalar(halfSize).add(min);

				// Find an octant that matches the current combination.
				for(j = 0; j < l; ++j) {

					child = octants[j];

					if(child !== null && child.size === halfSize && v.equals(child.min)) {

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

				halfSize

			));

		}

	}

}
