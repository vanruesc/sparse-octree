import { Octant } from "../core/octant.js";

/**
 * An octant that maintains points.
 *
 * @class PointOctant
 * @submodule points
 * @extends Octant
 * @constructor
 * @param {Vector3} min - The lower bounds.
 * @param {Vector3} max - The upper bounds.
 */

export class PointOctant extends Octant {

	constructor(min, max) {

		super(min, max);

		/**
		 * The points that are inside this octant.
		 *
		 * @property points
		 * @type Array
		 */

		this.points = null;

		/**
		 * Point data.
		 *
		 * @property data
		 * @type Array
		 */

		this.data = null;

	}

	/**
	 * Computes the distance squared from this octant to the given point.
	 *
	 * @method distanceToSquared
	 * @param {Vector3} p - A point.
	 * @return {Number} The distance squared.
	 */

	distanceToSquared(p) {

		const clampedPoint = p.clone().clamp(this.min, this.max);

		return clampedPoint.sub(p).lengthSq();

	}

	/**
	 * Computes the distance squared from the center of this octant to the given
	 * point.
	 *
	 * @method distanceToCenterSquared
	 * @param {Vector3} p - A point.
	 * @return {Number} The distance squared.
	 */

	distanceToCenterSquared(p) {

		const center = this.getCenter();

		const dx = p.x - center.x;
		const dy = p.y - center.x;
		const dz = p.z - center.z;

		return dx * dx + dy * dy + dz * dz;

	}

	/**
	 * Checks if the given point lies inside this octant's boundaries.
	 *
	 * This method can also be used to check if this octant intersects a sphere by
	 * providing a radius as bias.
	 *
	 * @method contains
	 * @param {Vector3} p - A point.
	 * @param {Number} bias - A padding that extends the boundaries temporarily.
	 * @return {Boolean} Whether the given point lies inside this octant.
	 */

	contains(p, bias) {

		const min = this.min;
		const max = this.max;

		return (
			p.x >= min.x - bias &&
			p.y >= min.y - bias &&
			p.z >= min.z - bias &&
			p.x <= max.x + bias &&
			p.y <= max.y + bias &&
			p.z <= max.z + bias
		);

	}

	/**
	 * Redistributes existing points to child octants.
	 *
	 * @method redistribute
	 * @param {Number} bias - A proximity threshold.
	 */

	redistribute(bias) {

		const children = this.children;
		const points = this.points;
		const data = this.data;

		let i, l;
		let child, point, entry;

		if(children !== null) {

			while(points.length > 0) {

				point = points.pop();
				entry = data.pop();

				for(i = 0, l = children.length; i < l; ++i) {

					child = children[i];

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
	 *
	 * @method merge
	 * @private
	 */

	merge() {

		const children = this.children;

		let i, l;
		let child;

		if(children !== null) {

			this.points = [];
			this.data = [];

			for(i = 0, l = children.length; i < l; ++i) {

				child = children[i];

				if(child.points !== null) {

					this.points.push(...child.points);
					this.data.push(...child.data);

				}

			}

			this.children = null;

		}

	}

}
