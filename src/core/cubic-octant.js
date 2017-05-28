import { Vector3 } from "../math/vector3.js";
import { PATTERN } from "./octant.js";

/**
 * A cubic octant.
 */

export class CubicOctant {

	/**
	 * Constructs a new cubic octant.
	 *
	 * @param {Vector3} min - The lower bounds.
	 * @param {Number} [size=0] - The size of the octant.
	 */

	constructor(min = new Vector3(), size = 0) {

		/**
		 * The lower bounds of this octant.
		 *
		 * @type {Vector3}
		 */

		this.min = min;

		/**
		 * The size of this octant.
		 *
		 * @type {Number}
		 */

		this.size = size;

		/**
		 * The children of this octant.
		 *
		 * @type {CubicOctant[]}
		 * @default null
		 */

		this.children = null;

	}

	/**
	 * The upper bounds of this octant.
	 *
	 * Accessing this property creates a new vector.
	 *
	 * @type {Vector3}
	 */

	get max() { return this.min.clone().addScalar(this.size); }

	/**
	 * Computes the center of this octant.
	 *
	 * @return {Vector3} A new vector that describes the center of this octant.
	 */

	getCenter() { return this.min.clone().addScalar(this.size * 0.5); }

	/**
	 * Returns the size of this octant as a vector.
	 *
	 * @return {Vector3} A new vector that describes the size of this octant.
	 */

	getDimensions() { return new Vector3(this.size, this.size, this.size); }

	/**
	 * Splits this octant into eight smaller ones.
	 *
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
