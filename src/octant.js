import { Vector3 } from "./vector3";

/**
 * An octant.
 *
 * @class Octant
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
		 * The children of this node.
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
	 * @method center
	 * @return {Vector3} A new vector that describes the center of this octant.
	 */

	center() { return this.min.clone().add(this.max).multiplyScalar(0.5); }

	/**
	 * Computes the size of this octant.
	 *
	 * @method dimensions
	 * @return {Vector3} A new vector that describes the size of this octant.
	 */

	dimensions() { return this.max.clone().sub(this.min); }

	/**
	 * Calculates the current tree depth recursively.
	 *
	 * @method depth
	 * @return {Number} The depth.
	 */

	depth() {

		const children = this.children;

		let result = 0;

		let i, l;
		let depth;

		if(children !== null) {

			for(i = 0, l = children.length; i < l; ++i) {

				depth = 1 + children[i].depth();

				if(depth > result) {

					result = depth;

				}

			}

		}

		return result;

	}

	/**
	 * Splits this octant into eight smaller ones.
	 *
	 * @method split
	 */

	split() {

		const min = this.min;
		const max = this.max;
		const mid = this.center();

		let i, combination;

		this.children = [];

		for(i = 0; i < 8; ++i) {

			combination = Octant.PATTERN[i];

			this.children.push(new this.constructor(

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

	/**
	 * Creates missing child octants and restores the layout.
	 *
	 * @method repair
	 */

	repair() {

		const min = this.min;
		const max = this.max;
		const mid = this.center();

		const halfDimensions = this.dimensions().multiplyScalar(0.5);

		const children = this.children;
		const corrected = [];

		const v0 = new Vector3();
		const v1 = new Vector3();
		const v2 = new Vector3();

		let i, j, l;
		let combination;
		let child, octant;

		if(children !== null) {

			for(i = 0, l = children.length; i < 8; ++i) {

				combination = Octant.PATTERN[i];

				octant = null;

				if(l > 0) {

					v1.addVectors(min, v0.fromArray(combination).multiply(halfDimensions));
					v2.addVectors(mid, v0.fromArray(combination).multiply(halfDimensions));

				}

				// Find an existing octant that matches the current combination.
				for(j = 0; j < l; ++j) {

					child = children[j];

					if(child !== null && v1.equals(child.min) && v2.equals(child.max)) {

						octant = child;
						children[j] = null;

						break;

					}

				}

				corrected.push(

					(octant !== null) ? octant : new this.constructor(

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

					)

				);

			}

			this.children = corrected;

		}

	}

}

/**
 * A binary pattern that describes the standard octant layout:
 *
 *    3____7
 *  2/___6/|
 *  | 1__|_5
 *  0/___4/
 *
 * This common layout is crucial for positional assumptions.
 *
 * @property PATTERN
 * @type Array
 * @static
 * @final
 */

Octant.PATTERN = [

	new Uint8Array([0, 0, 0]),
	new Uint8Array([0, 0, 1]),
	new Uint8Array([0, 1, 0]),
	new Uint8Array([0, 1, 1]),

	new Uint8Array([1, 0, 0]),
	new Uint8Array([1, 0, 1]),
	new Uint8Array([1, 1, 0]),
	new Uint8Array([1, 1, 1])

];
