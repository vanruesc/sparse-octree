import { Octant } from "../octant";

/**
 * A threshold for proximity checks.
 *
 * @property bias
 * @type Number
 * @private
 * @static
 * @default 0.0
 */

let bias = 0.0;

/**
 * The proximity threshold squared.
 *
 * @property biasSquared
 * @type Number
 * @private
 * @static
 * @default 0.0
 */

let biasSquared = 0.0;

/**
 * The maximum tree depth level.
 *
 * @property maxDepth
 * @type Number
 * @private
 * @static
 * @default 8
 */

let maxDepth = 8;

/**
 * Number of points per octant before a split occurs.
 *
 * @property maxPoints
 * @type Number
 * @private
 * @static
 * @default 8
 */

let maxPoints = 8;

/**
 * An octant that maintains points.
 *
 * @class PointOctant
 * @submodule point
 * @extends Octant
 * @constructor
 * @param {Vector3} min - The lower bounds.
 * @param {Vector3} max - The upper bounds.
 * @param {Number} level - The depth level.
 */

export class PointOctant extends Octant {

	constructor(min, max, level) {

		super(min, max, level);

		/**
		 * The amount of points in this octant.
		 *
		 * @property totalPoints
		 * @type Number
		 */

		this.totalPoints = 0;

		/**
		 * The points that are inside this node.
		 *
		 * @property points
		 * @type Array
		 */

		this.points = null;

		/**
		 * Additional data that is kept in sets for individual points.
		 *
		 * @property dataSets
		 * @type Array
		 */

		this.dataSets = null;

	}

	/**
	 * A threshold for proximity checks.
	 *
	 * @property bias
	 * @type Number
	 * @static
	 * @default 0.0
	 */

	static get bias() { return bias; }

	static set bias(x) {

		bias = Math.max(0.0, x);
		biasSquared = bias * bias;

	}

	/**
	 * The maximum tree depth level.
	 *
	 * @property maxDepth
	 * @type Number
	 * @static
	 * @default 8
	 */

	static get maxDepth() { return maxDepth; }

	static set maxDepth(x) { maxDepth = Math.max(0, Math.round(x)); }

	/**
	 * Number of points per octant before a split occurs.
	 *
	 * @property maxPoints
	 * @type Number
	 * @static
	 * @default 8
	 */

	static get maxPoints() { return maxPoints; }

	static set maxPoints(x) { maxPoints = Math.max(1, Math.round(x)); }

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

		const center = this.center();

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
	 * @method containsPoint
	 * @param {Vector3} p - A point.
	 * @param {Number} bias - A padding that extends the boundaries temporarily.
	 * @return {Boolean} Whether the given point lies inside this octant.
	 */

	containsPoint(p, bias) {

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
	 * Adds a point to this node. If this octant isn't a leaf node, the point will
	 * be added to a child octant.
	 *
	 * @method add
	 * @param {Vector3} p - A point.
	 * @param {Object} [data] - An object that will be associated with the point.
	 * @return {Boolean} Whether the point was a unique addition.
	 */

	add(p, data) {

		let unique = false;
		let hit = false;

		let i, l;
		let points, point;

		if(this.children !== null) {

			unique = this.addToChild(p, data);

		} else {

			if(this.totalPoints === 0) {

				this.points = [];
				this.dataSets = [];

			}

			points = this.points;

			// @todo: improve time complexity of duplicate check.
			for(i = 0, l = this.totalPoints; !hit && i < l; ++i) {

				point = points[i];
				hit = point.equals(p);

			}

			if(hit) {

				// Aggregate data of duplicates.
				if(data !== undefined) {

					this.dataSets[i - 1].add(data);

				}

			} else {

				unique = true;

				if(this.totalPoints === maxPoints && this.level < maxDepth) {

					// At maximum capacity and can still split.
					this.split();
					this.addToChild(p, data);

				} else {

					// Count distinct points in leaf nodes.
					this.totalPoints = this.points.push(p);
					this.dataSets.push(new Set());

					if(data !== undefined) {

						this.dataSets[this.totalPoints - 1].add(data);

					}

				}

			}

		}

		return unique;

	}

	/**
	 * Adds the given point to a child node that covers the point's position.
	 *
	 * @method addToChild
	 * @private
	 * @param {Vector3} p - A point.
	 * @param {Object} [data] - An object that will be associated with the point.
	 * @return {Boolean} Whether the point was a unique addition.
	 */

	addToChild(p, data) {

		let unique = false;

		let i, l;

		for(i = 0, l = this.children.length; i < l; ++i) {

			if(this.children[i].containsPoint(p, bias)) {

				unique = this.children[i].add(p, data);

				if(unique) {

					// Register addition in parent node.
					++this.totalPoints;

				}

				break;

			}

		}

		return unique;

	}

	/**
	 * Splits this octant up into eight smaller ones.
	 *
	 * @method split
	 * @private
	 */

	split() {

		super.split();

		let i;
		let point, data;

		// Distribute existing points to the new children.
		i = this.totalPoints - 1;
		this.totalPoints = 0;

		while(i >= 0) {

			point = this.points[i];

			if(this.dataSets[i].size > 0) {

				// Unfold data aggregations. Each entry is one point.
				for(data of this.dataSets[i].values()) {

					this.addToChild(point, data);

				}

			} else {

				this.addToChild(point);

			}

			--i;

		}

		this.points = null;
		this.dataSets = null;

	}

	/**
	 * Removes the given point from this octant. If this octant is not a leaf
	 * node, the point will be removed from a child node. If no data is provided,
	 * the point and all its respective data entries will be removed completely.
	 *
	 * @method remove
	 * @param {Vector3} p - The point.
	 * @param {Object} [data] - An object that is associated with the point.
	 * @return {Boolean} Whether the removed point was unique.
	 */

	remove(p, data) {

		const points = this.points;
		const dataSets = this.dataSets;

		let unique = false;

		let i, l;
		let point, last;

		let dataSet = null;

		if(this.children !== null) {

			unique = this.removeFromChild(p, data);

			if(this.totalPoints <= maxPoints) {

				this.merge();

			}

		} else if(this.totalPoints > 0) {

			for(i = 0, l = this.totalPoints; i < l; ++i) {

				point = points[i];

				if(point.equals(p)) {

					// Found it.
					dataSet = dataSets[i];

					if(data !== undefined) {

						dataSet.delete(data);

					} else {

						dataSet.clear();

					}

					if(dataSet.size === 0) {

						unique = true;
						last = l - 1;

						// If the point is NOT the last one in the array:
						if(i < last) {

							// Overwrite with the last point...
							points[i] = points[last];

							// ...and data set.
							dataSets[i] = dataSets[last];

						}

						// Drop the last entry.
						points.pop();
						dataSets.pop();

						// Register deletion in leaf node.
						--this.totalPoints;

					}

					break;

				}

			}

		}

		return unique;

	}

	/**
	 * Removes the given point from a child node.
	 *
	 * @method removeFromChild
	 * @private
	 * @param {Vector3} p - The point.
	 * @param {Object} [data] - An object that is associated with the point.
	 * @return {Boolean} Whether the removed point was unique.
	 */

	removeFromChild(p, data) {

		let unique = false;

		let i, l;

		for(i = 0, l = this.children.length; i < l; ++i) {

			if(this.children[i].containsPoint(p, bias)) {

				unique = this.children[i].remove(p, data);

				if(unique) {

					// Register deletion in parent node.
					--this.totalPoints;

				}

				break;

			}

		}

		return unique;

	}

	/**
	 * Gathers all points from the children. The children are expected to be leaf
	 * nodes and will be dropped afterwards.
	 *
	 * @method merge
	 * @private
	 */

	merge() {

		let i, j, il, jl;
		let child;

		this.totalPoints = 0;
		this.points = [];
		this.dataSets = [];

		for(i = 0, il = this.children.length; i < il; ++i) {

			child = this.children[i];

			for(j = 0, jl = child.totalPoints; j < jl; ++j) {

				this.totalPoints = this.points.push(child.points[j]);
				this.dataSets.push(child.dataSets[j]);

			}

		}

		this.children = null;

	}

	/**
	 * Refreshes this octant and its children to make sure that all constraints
	 * are satisfied.
	 *
	 * @method update
	 */

	update() {

		const children = this.children;

		let i, l;

		if(children !== null) {

			// Start from the bottom.
			for(i = 0, l = children.length; i < l; ++i) {

				children[i].update();

			}

			if(this.totalPoints <= maxPoints || this.level >= maxDepth) {

				// All points fit into one octant or the level is too high.
				this.merge();

			}

		} else if(this.totalPoints > maxPoints && this.level < maxDepth) {

			// Exceeding maximum capacity.
			this.split();

		}

	}

	/**
	 * Retrieves the data of the point at the specified position.
	 *
	 * @method fetch
	 * @param {Vector3} p - A position.
	 * @return {Set} A set of data entries that are associated with the given point or null if it doesn't exist.
	 */

	fetch(p) {

		let result = null;

		let i, l;
		let point;

		if(this.containsPoint(p, bias)) {

			if(this.children !== null) {

				for(i = 0, l = this.children.length; result === null && i < l; ++i) {

					result = this.children[i].fetch(p);

				}

			} else {

				for(i = 0, l = this.totalPoints; i < l; ++i) {

					point = this.points[i];

					if(p.distanceToSquared(point) <= biasSquared) {

						result = this.dataSets[i];

						break;

					}

				}

			}

		}

		return result;

	}

	/**
	 * Finds the closest point to the given one.
	 *
	 * @method findNearestPoint
	 * @param {Vector3} p - The point.
	 * @param {Number} maxDistance - The maximum distance.
	 * @param {Boolean} skipSelf - Whether a point that is exactly at the given position should be skipped.
	 * @return {Object} An object representing the nearest point or null if there is none. The object has a point and a data property.
	 */

	findNearestPoint(p, maxDistance, skipSelf) {

		const points = this.points;
		const children = this.children;

		let result = null;
		let bestDist = maxDistance;

		let i, l;
		let point, distSq;

		let sortedChildren;
		let child, childResult;

		// Only consider leaf nodes.
		if(children === null) {

			for(i = 0, l = this.totalPoints; i < l; ++i) {

				point = points[i];
				distSq = p.distanceToSquared(point);

				if((!skipSelf || distSq > 0.0) && distSq <= bestDist) {

					bestDist = distSq;

					result = {
						point: point.clone(),
						data: this.dataSets[i]
					};

				}

			}

		} else {

			// Sort the children.
			sortedChildren = children.map(function(child) {

				// Precompute distances.
				return {
					octant: child,
					distance: child.distanceToCenterSquared(p)
				};

			}).sort(function(a, b) {

				// Smallest distance to p first, ASC.
				return a.distance - b.distance;

			});

			// Traverse from closest to furthest.
			for(i = 0, l = sortedChildren.length; i < l; ++i) {

				// Unpack octant.
				child = sortedChildren[i].octant;

				if(child.totalPoints > 0 && child.containsPoint(p, bestDist)) {

					childResult = child.findNearestPoint(p, bestDist, skipSelf);

					if(childResult !== null) {

						distSq = childResult.point.distanceToSquared(p);

						if((!skipSelf || distSq > 0.0) && distSq <= bestDist) {

							bestDist = distSq;
							result = childResult;

						}

					}

				}

			}

		}

		return result;

	}

	/**
	 * Finds points that are inside the specified radius around a given position.
	 *
	 * @method findPoints
	 * @param {Vector3} p - A position.
	 * @param {Number} r - A radius.
	 * @param {Boolean} skipSelf - Whether a point that is exactly at the given position should be skipped.
	 * @param {Array} result - An array to be filled with objects, each containing a point and a data property.
	 */

	findPoints(p, r, skipSelf, result) {

		const points = this.points;
		const children = this.children;
		const rSq = r * r;

		let i, l;

		let point, distSq;
		let child;

		// Only consider leaf nodes.
		if(children === null) {

			for(i = 0, l = this.totalPoints; i < l; ++i) {

				point = points[i];
				distSq = p.distanceToSquared(point);

				if((!skipSelf || distSq > 0.0) && distSq <= rSq) {

					result.push({
						point: point.clone(),
						data: this.dataSets[i]
					});

				}

			}

		} else {

			// The order of the children is irrelevant.
			for(i = 0, l = children.length; i < l; ++i) {

				child = children[i];

				if(child.totalPoints > 0 && child.containsPoint(p, r)) {

					child.findPoints(p, r, skipSelf, result);

				}

			}

		}

	}

}
