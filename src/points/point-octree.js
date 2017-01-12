import { Octree } from "../core/octree.js";
import { PointOctant } from "./point-octant.js";

/**
 * Recursively counts how many points are in the given octree.
 *
 * @method countPoints
 * @private
 * @static
 * @param {Octant} octant - An octant.
 * @return {Number} The amount of points.
 */

function countPoints(octant) {

	const children = octant.children;

	let result = 0;
	let i, l;

	if(children !== null) {

		for(i = 0, l = children.length; i < l; ++i) {

			result += countPoints(children[i]);

		}

	} else if(octant.points !== null) {

		result = octant.points.length;

	}

	return result;

}

/**
 * Recursively adds a point to the octree.
 *
 * @method add
 * @param {Octant} octant - An octant.
 * @param {Vector3} p - A point.
 * @param {Object} data - An object that the point represents.
 * @param {Number} depth - The current depth.
 * @param {Number} bias - A threshold for proximity checks.
 * @param {Number} maxPoints - Number of distinct points per octant before it splits up.
 * @param {Number} maxDepth - The maximum tree depth level, starting at 0.
 */

function add(octant, p, data, depth, bias, maxPoints, maxDepth) {

	let children = octant.children;
	let exists = false;
	let done = false;
	let i, l;

	if(octant.contains(p, bias)) {

		if(children === null) {

			if(octant.points === null) {

				octant.points = [];
				octant.data = [];

			} else {

				for(i = 0, l = octant.points.length; !exists && i < l; ++i) {

					exists = octant.points[i].equals(p);

				}

			}

			if(exists) {

				octant.data[i - 1] = data;

				done = true;

			} else if(octant.points.length < maxPoints || depth === maxDepth) {

				octant.points.push(p.clone());
				octant.data.push(data);

				done = true;

			} else {

				octant.split();
				octant.redistribute(bias);
				children = octant.children;

			}

		}

		if(children !== null) {

			++depth;

			for(i = 0, l = children.length; !done && i < l; ++i) {

				done = add(children[i], p, data, depth, bias, maxPoints, maxDepth);

			}

		}

	}

	return done;

}

/**
 * Recursively finds a point in the octree and removes it.
 *
 * @method remove
 * @param {Octant} octant - An octant.
 * @param {Octant} parent - The parent of the octant.
 * @param {Vector3} p - A point.
 * @param {Number} bias - A threshold for proximity checks.
 * @param {Number} maxPoints - Number of distinct points per octant before it splits up.
 */

function remove(octant, parent, p, bias, maxPoints) {

	const children = octant.children;

	let done = false;

	let i, l;
	let points, data, last;

	if(octant.contains(p, bias)) {

		if(children !== null) {

			for(i = 0, l = children.length; !done && i < l; ++i) {

				done = remove(children[i], octant, p, bias, maxPoints);

			}

		} else if(octant.points !== null) {

			points = octant.points;
			data = octant.data;

			for(i = 0, l = points.length; !done && i < l; ++i) {

				if(points[i].equals(p)) {

					last = l - 1;

					// If the point is NOT the last one in the array:
					if(i < last) {

						// Overwrite with the last point and data entry.
						points[i] = points[last];
						data[i] = data[last];

					}

					// Drop the last entry.
					points.pop();
					data.pop();

					if(parent !== null && countPoints(parent) <= maxPoints) {

						parent.merge();

					}

					done = true;

				}

			}

		}

	}

	return done;

}

/**
 * Recursively finds a point in the octree and fetches the associated data.
 *
 * @method fetch
 * @param {Octant} octant - An octant.
 * @param {Vector3} p - A point.
 * @param {Number} bias - A threshold for proximity checks.
 * @param {Number} biasSquared - The threshold squared.
 * @return {Object} The data entry that is associated with the given point or null if it doesn't exist.
 */

function fetch(octant, p, bias, biasSquared) {

	const children = octant.children;

	let result = null;

	let i, l;
	let points;

	if(octant.contains(p, bias)) {

		if(children !== null) {

			for(i = 0, l = children.length; result === null && i < l; ++i) {

				result = fetch(children[i], p, bias, biasSquared);

			}

		} else {

			points = octant.points;

			for(i = 0, l = points.length; result === null && i < l; ++i) {

				if(p.distanceToSquared(points[i]) <= biasSquared) {

					result = octant.data[i];

				}

			}

		}

	}

	return result;

}

/**
 * Recursively finds the closest point to the given one.
 *
 * @method findNearestPoint
 * @private
 * @static
 * @param {Octant} octant - An octant.
 * @param {Vector3} p - The point.
 * @param {Number} maxDistance - The maximum distance.
 * @param {Boolean} skipSelf - Whether a point that is exactly at the given position should be skipped.
 * @return {Object} An object representing the nearest point or null if there is none. The object has a point and a data property.
 */

function findNearestPoint(octant, p, maxDistance, skipSelf) {

	const points = octant.points;
	const children = octant.children;

	let result = null;
	let bestDist = maxDistance;

	let i, l;
	let point, distSq;

	let sortedChildren;
	let child, childResult;

	if(children !== null) {

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

			if(child.contains(p, bestDist)) {

				childResult = findNearestPoint(child, p, bestDist, skipSelf);

				if(childResult !== null) {

					distSq = childResult.point.distanceToSquared(p);

					if((!skipSelf || distSq > 0.0) && distSq < bestDist) {

						bestDist = distSq;
						result = childResult;

					}

				}

			}

		}

	} else if(points !== null) {

		for(i = 0, l = points.length; i < l; ++i) {

			point = points[i];
			distSq = p.distanceToSquared(point);

			if((!skipSelf || distSq > 0.0) && distSq < bestDist) {

				bestDist = distSq;

				result = {
					point: point.clone(),
					data: octant.data[i]
				};

			}

		}

	}

	return result;

}

/**
 * Recursively finds points that are inside the specified radius around a given
 * position.
 *
 * @method findPoints
 * @private
 * @static
 * @param {Octant} octant - An octant.
 * @param {Vector3} p - A position.
 * @param {Number} r - A radius.
 * @param {Boolean} skipSelf - Whether a point that is exactly at the given position should be skipped.
 * @param {Array} result - An array to be filled with objects, each containing a point and a data property.
 */

function findPoints(octant, p, r, skipSelf, result) {

	const points = octant.points;
	const children = octant.children;
	const rSq = r * r;

	let i, l;

	let point, distSq;
	let child;

	if(children !== null) {

		for(i = 0, l = children.length; i < l; ++i) {

			child = children[i];

			if(child.contains(p, r)) {

				findPoints(child, p, r, skipSelf, result);

			}

		}

	} else if(points !== null) {

		for(i = 0, l = points.length; i < l; ++i) {

			point = points[i];
			distSq = p.distanceToSquared(point);

			if((!skipSelf || distSq > 0.0) && distSq <= rSq) {

				result.push({
					point: point.clone(),
					data: octant.data[i]
				});

			}

		}

	}

}

/**
 * An octree that manages points.
 *
 * @class PointOctree
 * @submodule points
 * @extends Octree
 * @constructor
 * @param {Vector3} min - The lower bounds of the tree.
 * @param {Vector3} max - The upper bounds of the tree.
 * @param {Number} [bias=0.0] - A threshold for proximity checks.
 * @param {Number} [maxPoints=8] - Number of distinct points per octant before it splits up.
 * @param {Number} [maxDepth=8] - The maximum tree depth level, starting at 0.
 */

export class PointOctree extends Octree {

	constructor(min, max, bias = 0.0, maxPoints = 8, maxDepth = 8) {

		super();

		this.root = new PointOctant(min, max);

		/**
		 * A threshold for proximity checks.
		 *
		 * @property bias
		 * @type Number
		 * @private
		 * @default 0.0
		 */

		this.bias = Math.max(0.0, bias);

		/**
		 * The proximity threshold squared.
		 *
		 * @property biasSquared
		 * @type Number
		 * @private
		 * @default 0.0
		 */

		this.biasSquared = this.bias * this.bias;

		/**
		 * Number of points per octant before a split occurs.
		 *
		 * This value works together with the maximum depth as a secondary limiting
		 * factor. Smaller values cause splits to occur earlier which results in a
		 * faster and deeper tree growth.
		 *
		 * @property maxPoints
		 * @type Number
		 * @private
		 * @default 8
		 */

		this.maxPoints = Math.max(1, Math.round(maxPoints));

		/**
		 * The maximum tree depth level.
		 *
		 * It's possible to use Infinity, but be aware that allowing infinitely
		 * small octants can have a negative impact on performance.
		 * Finding a value that works best for a specific scene is advisable.
		 *
		 * @property maxDepth
		 * @type Number
		 * @private
		 * @default 8
		 */

		this.maxDepth = Math.max(0, Math.round(maxDepth));

	}

	/**
	 * Counts how many points are in this octree.
	 *
	 * @method countPoints
	 * @return {Number} The amount of points.
	 */

	countPoints() {

		return countPoints(this.root);

	}

	/**
	 * Adds a point to the octree.
	 *
	 * @method add
	 * @param {Vector3} p - A point.
	 * @param {Object} data - An object that the point represents.
	 */

	add(p, data) {

		add(this.root, p, data, 0, this.bias, this.maxPoints, this.maxDepth);

	}

	/**
	 * Removes a point from the tree.
	 *
	 * @method remove
	 * @param {Vector3} p - A point.
	 */

	remove(p) {

		remove(this.root, null, p, this.bias, this.maxPoints);

	}

	/**
	 * Retrieves the data of the specified point.
	 *
	 * @method fetch
	 * @param {Vector3} p - A position.
	 * @return {Object} The data entry that is associated with the given point or null if it doesn't exist.
	 */

	fetch(p) {

		return fetch(this.root, p, this.bias, this.biasSquared);

	}

	/**
	 * Finds the closest point to the given one.
	 *
	 * @method findNearestPoint
	 * @param {Vector3} p - A point.
	 * @param {Number} [maxDistance=Infinity] - An upper limit for the distance between the points.
	 * @param {Boolean} [skipSelf=false] - Whether a point that is exactly at the given position should be skipped.
	 * @return {Object} An object representing the nearest point or null if there is none. The object has a point and a data property.
	 */

	findNearestPoint(p, maxDistance = Infinity, skipSelf = false) {

		return findNearestPoint(this.root, p, maxDistance, skipSelf);

	}

	/**
	 * Finds points that are in the specified radius around the given position.
	 *
	 * @method findPoints
	 * @param {Vector3} p - A position.
	 * @param {Number} r - A radius.
	 * @param {Boolean} [skipSelf=false] - Whether a point that is exactly at the given position should be skipped.
	 * @return {Array} An array of objects, each containing a point and a data property.
	 */

	findPoints(p, r, skipSelf = false) {

		const result = [];

		findPoints(this.root, p, r, skipSelf, result);

		return result;

	}

	/**
	 * Finds the points that intersect with the given ray.
	 *
	 * @method raycast
	 * @param {Raycaster} raycaster - The raycaster.
	 * @param {Array} [intersects] - An array to be filled with the intersecting points.
	 * @return {Array} The intersecting points.
	 */

	raycast(raycaster, intersects = []) {

		const octants = super.raycast(raycaster);

		if(octants.length > 0) {

			// Collect intersecting points.
			this.testPoints(octants, raycaster, intersects);

		}

		return intersects;

	}

	/**
	 * Collects points that intersect with the given ray.
	 *
	 * @method testPoints
	 * @param {Array} octants - An array containing octants that intersect with the ray.
	 * @param {Raycaster} raycaster - The raycaster.
	 * @param {Array} intersects - An array to be filled with the intersecting points.
	 */

	testPoints(octants, raycaster, intersects) {

		const threshold = raycaster.params.Points.threshold;
		const thresholdSq = threshold * threshold;

		let intersectPoint;
		let distance, distanceToRay;
		let rayPointDistanceSq;

		let i, j, il, jl;
		let octant, points, point;

		for(i = 0, il = octants.length; i < il; ++i) {

			octant = octants[i];
			points = octant.points;

			if(points !== null) {

				for(j = 0, jl = points.length; j < jl; ++j) {

					point = points[j];
					rayPointDistanceSq = raycaster.ray.distanceSqToPoint(point);

					if(rayPointDistanceSq < thresholdSq) {

						intersectPoint = raycaster.ray.closestPointToPoint(point);
						distance = raycaster.ray.origin.distanceTo(intersectPoint);

						if(distance >= raycaster.near && distance <= raycaster.far) {

							distanceToRay = Math.sqrt(rayPointDistanceSq);

							intersects.push({
								distance: distance,
								distanceToRay: distanceToRay,
								point: intersectPoint.clone(),
								object: octant.data[j]
							});

						}

					}

				}

			}

		}

	}

}
