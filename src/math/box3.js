import { Vector3 } from "./vector3.js";

/**
 * A 3D box.
 */

export class Box3 {

	/**
	 * Constructs a new box3.
	 *
	 * @param {Vector3} [min] - The lower bounds.
	 * @param {Vector3} [max] - The upper bounds.
	 */

	constructor(
		min = new Vector3(Infinity, Infinity, Infinity),
		max = new Vector3(-Infinity, -Infinity, -Infinity)
	) {

		/**
		 * The lower bounds.
		 *
		 * @type {Vector3}
		 */

		this.min = min;

		/**
		 * The upper bounds.
		 *
		 * @type {Vector3}
		 */

		this.max = max;

	}

	/**
	 * Sets the values of this box.
	 *
	 * @param {Number} min - The lower bounds.
	 * @param {Number} max - The upper bounds.
	 * @return {Box3} This box.
	 */

	set(min, max) {

		this.min.copy(min);
		this.max.copy(max);

		return this;

	}

	/**
	 * Copies the values of a given box.
	 *
	 * @param {Box3} b - A box.
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
	 * @return {Box3} A clone of this matrix.
	 */

	clone() {

		return new this.constructor().copy(this);

	}

	/**
	 * Expands this box by the given point.
	 *
	 * @param {Vector3} p - A point.
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
	 * @param {Vector3[]} points - The points.
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
	 * @param {Box3} box - A box.
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
