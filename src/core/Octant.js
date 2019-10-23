import { Vector3 } from "math-ds";
import { layout } from "./layout.js";

/**
 * A vector.
 *
 * @type {Vector3}
 * @private
 */

const c = new Vector3();

/**
 * An octant.
 *
 * @implements {Octant}
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
		 */

		this.children = null;

	}

	/**
	 * Computes the center of this octant.
	 *
	 * @param {Vector3} target - A target vector.
	 * @return {Vector3} The center.
	 */

	getCenter(target) {

		return target.addVectors(this.min, this.max).multiplyScalar(0.5);

	}

	/**
	 * Computes the size of this octant.
	 *
	 * @param {Vector3} target - A target vector.
	 * @return {Vector3} The size.
	 */

	getDimensions(target) {

		return target.subVectors(this.max, this.min);

	}

	/**
	 * Splits this octant into eight smaller ones.
	 */

	split() {

		const min = this.min;
		const max = this.max;
		const mid = this.getCenter(c);

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

				new Vector3(
					(combination[0] === 0) ? mid.x : max.x,
					(combination[1] === 0) ? mid.y : max.y,
					(combination[2] === 0) ? mid.z : max.z
				)

			);

		}

	}

}
