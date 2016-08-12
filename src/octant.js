import { Vector3 } from "./vector3";

/**
 * An octant.
 *
 * @class Octant
 * @constructor
 * @param {Vector3} min - The lower bounds.
 * @param {Vector3} max - The upper bounds.
 * @param {Number} [level] - The depth level.
 */

export class Octant {

	constructor(min, max, level) {

		/**
		 * The lower bounds of this octant.
		 *
		 * @property min
		 * @type Vector3
		 */

		this.min = min;

		/**
		 * The upper bounds of the octant.
		 *
		 * @property max
		 * @type Vector3
		 */

		this.max = max;

		/**
		 * The depth level of this octant.
		 *
		 * @property level
		 * @type Number
		 * @default 0
		 */

		this.level = (level !== undefined) ? level : 0;

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

		let result = 0;
		let depth;
		let i, l;

		if(this.children !== null) {

			for(i = 0, l = this.children.length; i < l; ++i) {

				depth = 1 + this.children[i].depth();

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
		const mid = this.center();
		const max = this.max;

		const nextLevel = this.level + 1;

		/* The order is important for positional assumptions.
		 *
		 *    3____7
		 *  2/___6/|
		 *  | 1__|_5
		 *  0/___4/
		 *
		 */

		this.children = [
			new this.constructor(min, mid, nextLevel),
			new this.constructor(new Vector3(min.x, min.y, mid.z), new Vector3(mid.x, mid.y, max.z), nextLevel),
			new this.constructor(new Vector3(min.x, mid.y, min.z), new Vector3(mid.x, max.y, mid.z), nextLevel),
			new this.constructor(new Vector3(min.x, mid.y, mid.z), new Vector3(mid.x, max.y, max.z), nextLevel),
			new this.constructor(new Vector3(mid.x, min.y, min.z), new Vector3(max.x, mid.y, mid.z), nextLevel),
			new this.constructor(new Vector3(mid.x, min.y, mid.z), new Vector3(max.x, mid.y, max.z), nextLevel),
			new this.constructor(new Vector3(mid.x, mid.y, min.z), new Vector3(max.x, max.y, mid.z), nextLevel),
			new this.constructor(mid, max, nextLevel)
		];

	}

}
