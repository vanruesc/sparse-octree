import { Vector3 } from "math-ds";
import { layout } from "../core/layout.js";

/**
 * A vector.
 *
 * @type {Vector3}
 * @private
 */

const c = new Vector3();

/**
 * A cubic octant.
 *
 * @implements {Octant}
 */

export class CubicOctant {

	/**
	 * Constructs a new cubic octant.
	 *
	 * @param {Vector3} [min] - The lower bounds.
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
		 */

		this.children = null;

	}

	/**
	 * The upper bounds of this octant.
	 *
	 * Attention: Accessing this property creates a new vector!
	 *
	 * @type {Vector3}
	 */

	get max() {

		return this.min.clone().addScalar(this.size);

	}

	/**
	 * Computes the center of this octant.
	 *
	 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
	 * @return {Vector3} A vector that describes the center of this octant.
	 */

	getCenter(target = new Vector3()) {

		return target.copy(this.min).addScalar(this.size * 0.5);

	}

	/**
	 * Returns the size of this octant as a vector.
	 *
	 * @param {Vector3} [target] - A target vector. If none is provided, a new one will be created.
	 * @return {Vector3} A vector that describes the size of this octant.
	 */

	getDimensions(target = new Vector3()) {

		return target.set(this.size, this.size, this.size);

	}

	/**
	 * Splits this octant into eight smaller ones.
	 */

	split() {

		const min = this.min;
		const mid = this.getCenter(c);
		const halfSize = this.size * 0.5;

		const children = this.children = [
			null, null, null, null,
			null, null, null, null
		];

		let i, combination;

		for(i = 0; i < 8; ++i) {

			combination = layout[i];

			children[i] = new this.constructor(

				new Vector3(
					(combination[0] === 0) ? min.x : mid.x,
					(combination[1] === 0) ? min.y : mid.y,
					(combination[2] === 0) ? min.z : mid.z
				),

				halfSize

			);

		}

	}

}
