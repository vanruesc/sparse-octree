import { Vector3 } from "./vector3";

/**
 * A bounding box.
 *
 * This class is a copy of THREE.Box3. It can be removed as soon as three.js
 * starts supporting ES6 modules.
 *
 * @class Box3
 * @constructor
 */

export class Box3 {

	constructor(min, max) {

		/**
		 * The min bounds.
		 *
		 * @property min
		 * @type Vector3
		 */

		this.min = (min !== undefined) ? min : new Vector3(Infinity, Infinity, Infinity);

		/**
		 * The max bounds.
		 *
		 * @property max
		 * @type Vector3
		 */

		this.max = (max !== undefined) ? max : new Vector3(-Infinity, -Infinity, -Infinity);

	}

	/**
	 * Sets the values of this box.
	 *
	 * @method set
	 * @param {Number} min - The min bounds.
	 * @param {Number} max - The max bounds.
	 * @return {Matrix3} This box.
	 */

	set(min, max) {

		this.min.copy(min);
		this.max.copy(max);

		return this;

	}

	/**
	 * Copies the values of a given box.
	 *
	 * @method copy
	 * @param {Matrix3} b - A box.
	 * @return {Box3} This box.
	 */

	copy(b) {

		this.min.copy(b.min);
		this.max.copy(b.max);

		return this;

	}

	/**
	 * Clones this matrix.
	 *
	 * @method clone
	 * @return {Matrix3} A clone of this matrix.
	 */

	clone() {

		return new this.constructor().copy(this);

	}

	/**
	 * Expands this box by the given point.
	 *
	 * @method expandByPoint
	 * @param {Matrix3} p - A point.
	 * @return {Box3} This box.
	 */

	expandByPoint(p) {

		this.min.min(p);
		this.max.max(p);

		return this;

	}

	/**
	 * Expands this box by combining it with the given one.
	 *
	 * @method union
	 * @param {Box3} b - A box.
	 * @return {Box3} This box.
	 */

	union(b) {

		this.min.min(b.min);
		this.max.max(b.max);

		return this;

	}

	/**
	 * Defines this box by the given points.
	 *
	 * @method setFromPoints
	 * @param {Array} points - The points.
	 * @return {Box3} This box.
	 */

	setFromPoints(points) {

		let i, l;

		for(i = 0, l = points.length; i < l; ++i) {

			this.expandByPoint(points[i]);

		}

		return this;

	}

	/**
	 * Defines this box by the given center and size.
	 *
	 * @method setFromCenterAndSize
	 * @param {Vector3} center - The center.
	 * @param {Number} size - The size.
	 * @return {Box3} This box.
	 */

	setFromCenterAndSize(center, size) {

		const halfSize = size.clone().multiplyScalar(0.5);

		this.min.copy(center).sub(halfSize);
		this.max.copy(center).add(halfSize);

		return this;

	}

	/**
	 * Checks if this box intersects with the given one.
	 *
	 * @method intersectsBox
	 * @param {Matrix3} box - A box.
	 * @return {Boolean} Whether the boxes intersect.
	 */

	intersectsBox(box) {

		return !(
			box.max.x < this.min.x || box.min.x > this.max.x ||
			box.max.y < this.min.y || box.min.y > this.max.y ||
			box.max.z < this.min.z || box.min.z > this.max.z
		);

	}

}
