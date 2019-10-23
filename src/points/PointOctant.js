import { Vector3 } from "math-ds";
import { Octant } from "../core";

/**
 * A point.
 *
 * @type {Vector3}
 * @private
 */

const p = new Vector3();

/**
 * An octant that maintains points.
 */

export class PointOctant extends Octant {

	/**
	 * Constructs a new point octant.
	 *
	 * @param {Vector3} [min] - The lower bounds.
	 * @param {Vector3} [max] - The upper bounds.
	 */

	constructor(min, max) {

		super(min, max);

		/**
		 * The points.
		 *
		 * @type {Vector3[]}
		 */

		this.points = null;

		/**
		 * Point data.
		 *
		 * @type {Array}
		 */

		this.data = null;

	}

	/**
	 * Computes the distance squared from this octant to the given point.
	 *
	 * @param {Vector3} point - A point.
	 * @return {Number} The distance squared.
	 */

	distanceToSquared(point) {

		const clampedPoint = p.copy(point).clamp(this.min, this.max);

		return clampedPoint.sub(point).lengthSquared();

	}

	/**
	 * Computes the distance squared from the center of this octant to the given
	 * point.
	 *
	 * @param {Vector3} point - A point.
	 * @return {Number} The distance squared.
	 */

	distanceToCenterSquared(point) {

		const center = this.getCenter(p);

		const dx = point.x - center.x;
		const dy = point.y - center.x;
		const dz = point.z - center.z;

		return dx * dx + dy * dy + dz * dz;

	}

	/**
	 * Checks if the given point lies inside this octant's boundaries.
	 *
	 * This method can also be used to check if this octant intersects a sphere by
	 * providing a radius as bias.
	 *
	 * @param {Vector3} point - A point.
	 * @param {Number} bias - A padding that extends the boundaries temporarily.
	 * @return {Boolean} Whether the given point lies inside this octant.
	 */

	contains(point, bias) {

		const min = this.min;
		const max = this.max;

		return (
			point.x >= min.x - bias &&
			point.y >= min.y - bias &&
			point.z >= min.z - bias &&
			point.x <= max.x + bias &&
			point.y <= max.y + bias &&
			point.z <= max.z + bias
		);

	}

	/**
	 * Redistributes existing points to child octants.
	 *
	 * @param {Number} bias - A proximity threshold.
	 */

	redistribute(bias) {

		const children = this.children;
		const points = this.points;
		const data = this.data;

		let i, j, il, jl;
		let child, point, entry;

		if(children !== null && points !== null) {

			for(i = 0, il = points.length; i < il; ++i) {

				point = points[i];
				entry = data[i];

				for(j = 0, jl = children.length; j < jl; ++j) {

					child = children[j];

					if(child.contains(point, bias)) {

						if(child.points === null) {

							child.points = [];
							child.data = [];

						}

						child.points.push(point);
						child.data.push(entry);

						break;

					}

				}

			}

		}

		this.points = null;
		this.data = null;

	}

	/**
	 * Gathers all points from the children. The children are expected to be leaf
	 * octants and will be dropped afterwards.
	 */

	merge() {

		const children = this.children;

		if(children !== null) {

			let points = [];
			let data = [];

			let i, l, child;

			for(i = 0, l = children.length; i < l; ++i) {

				child = children[i];

				if(child.points !== null) {

					points = points.concat(child.points);
					data = data.concat(child.data);

				}

			}

			this.children = null;
			this.points = points;
			this.data = data;

		}

	}

}
