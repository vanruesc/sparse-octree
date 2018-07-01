import { Vector3 } from "math-ds";
import { Octree } from "../core/Octree.js";
import { PointOctant } from "./PointOctant.js";
import { RayPointIntersection } from "./RayPointIntersection.js";

/**
 * A threshold for distance comparisons.
 *
 * @type {Number}
 * @private
 */

const THRESHOLD = 1e-6;

/**
 * Recursively counts how many points are in the given octant.
 *
 * @private
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
 * Recursively places a point into the octree.
 *
 * @private
 * @param {Vector3} point - A point.
 * @param {Object} data - An object that the point represents.
 * @param {Octree} octree - The octree.
 * @param {Octant} octant - The current octant.
 * @param {Number} depth - The current depth.
 * @return {Boolean} Whether the operation was successful.
 */

function put(point, data, octree, octant, depth) {

	let children = octant.children;
	let exists = false;
	let done = false;
	let i, l;

	if(octant.contains(point, octree.bias)) {

		if(children === null) {

			if(octant.points === null) {

				octant.points = [];
				octant.data = [];

			} else {

				for(i = 0, l = octant.points.length; !exists && i < l; ++i) {

					exists = octant.points[i].equals(point);

				}

			}

			if(exists) {

				octant.data[i - 1] = data;
				done = true;

			} else if(octant.points.length < octree.maxPoints || depth === octree.maxDepth) {

				octant.points.push(point.clone());
				octant.data.push(data);
				++octree.pointCount;
				done = true;

			} else {

				octant.split();
				octant.redistribute(octree.bias);
				children = octant.children;

			}

		}

		if(children !== null) {

			++depth;

			for(i = 0, l = children.length; !done && i < l; ++i) {

				done = put(point, data, octree, children[i], depth);

			}

		}

	}

	return done;

}

/**
 * Recursively finds a point in the octree and removes it.
 *
 * @private
 * @param {Vector3} point - A point.
 * @param {Octree} octree - The octree.
 * @param {Octant} octant - The current octant.
 * @param {Octant} parent - The parent of the current octant.
 * @return {Object} The data entry of the removed point or null if it didn't exist.
 */

function remove(point, octree, octant, parent) {

	const children = octant.children;

	let result = null;

	let i, l;
	let points, data, last;

	if(octant.contains(point, octree.bias)) {

		if(children !== null) {

			for(i = 0, l = children.length; result === null && i < l; ++i) {

				result = remove(point, octree, children[i], octant);

			}

		} else if(octant.points !== null) {

			points = octant.points;
			data = octant.data;

			for(i = 0, l = points.length; i < l; ++i) {

				if(points[i].equals(point)) {

					last = l - 1;
					result = data[i];

					// If the point is NOT the last one in the array:
					if(i < last) {

						// Overwrite with the last point and data entry.
						points[i] = points[last];
						data[i] = data[last];

					}

					// Drop the last entry.
					points.pop();
					data.pop();

					--octree.pointCount;

					if(parent !== null && countPoints(parent) <= octree.maxPoints) {

						parent.merge();

					}

					break;

				}

			}

		}

	}

	return result;

}

/**
 * Recursively finds a point in the octree and fetches the associated data.
 *
 * @private
 * @param {Vector3} point - A point.
 * @param {Octree} octree - The octree.
 * @param {Octant} octant - The current octant octant.
 * @return {Object} The data entry that is associated with the given point or null if it doesn't exist.
 */

function fetch(point, octree, octant) {

	const children = octant.children;

	let result = null;

	let i, l;
	let points;

	if(octant.contains(point, octree.bias)) {

		if(children !== null) {

			for(i = 0, l = children.length; result === null && i < l; ++i) {

				result = fetch(point, octree, children[i]);

			}

		} else if(octant.points !== null) {

			points = octant.points;

			for(i = 0, l = points.length; result === null && i < l; ++i) {

				if(point.distanceToSquared(points[i]) <= THRESHOLD) {

					result = octant.data[i];

				}

			}

		}

	}

	return result;

}

/**
 * Recursively moves an existing point to a new position.
 *
 * @private
 * @param {Vector3} point - The point.
 * @param {Vector3} position - The new position.
 * @param {Octree} octree - The octree.
 * @param {Octant} octant - The current octant.
 * @param {Octant} parent - The parent of the current octant.
 * @param {Number} depth - The current depth.
 * @return {Object} The data entry of the updated point or null if it didn't exist.
 */

function move(point, position, octree, octant, parent, depth) {

	const children = octant.children;

	let result = null;

	let i, l;
	let points;

	if(octant.contains(point, octree.bias)) {

		if(octant.contains(position, octree.bias)) {

			// The point and the new position both fall into the current octant.
			if(children !== null) {

				++depth;

				for(i = 0, l = children.length; result === null && i < l; ++i) {

					result = move(point, position, octree, children[i], octant, depth);

				}

			} else if(octant.points !== null) {

				// No divergence - the point can be updated in place.
				points = octant.points;

				for(i = 0, l = points.length; i < l; ++i) {

					if(point.distanceToSquared(points[i]) <= THRESHOLD) {

						// The point exists! Update its position.
						points[i].copy(position);
						result = octant.data[i];

						break;

					}

				}

			}

		} else {

			// Retrieve the point and remove it.
			result = remove(point, octree, octant, parent);

			// Go back to the parent octant and add the updated point.
			put(position, result, octree, parent, depth - 1);

		}

	}

	return result;

}

/**
 * Recursively finds the closest point to the given one.
 *
 * @private
 * @param {Vector3} point - The point.
 * @param {Number} maxDistance - The maximum distance.
 * @param {Boolean} skipSelf - Whether a point that is exactly at the given position should be skipped.
 * @param {Octant} octant - The current octant.
 * @return {Object} An object representing the nearest point or null if there is none. The object has a point and a data property.
 */

function findNearestPoint(point, maxDistance, skipSelf, octant) {

	const points = octant.points;
	const children = octant.children;

	let result = null;
	let bestDist = maxDistance;

	let i, l;
	let p, distSq;

	let sortedChildren;
	let child, childResult;

	if(children !== null) {

		// Sort the children: smallest distance to the point first, ASC.
		sortedChildren = children.map((child) => {

			// Precompute distances.
			return {
				octant: child,
				distance: child.distanceToCenterSquared(point)
			};

		}).sort((a, b) => a.distance - b.distance);

		// Traverse from closest to furthest.
		for(i = 0, l = sortedChildren.length; i < l; ++i) {

			// Unpack octant.
			child = sortedChildren[i].octant;

			if(child.contains(point, bestDist)) {

				childResult = findNearestPoint(point, bestDist, skipSelf, child);

				if(childResult !== null) {

					distSq = childResult.point.distanceToSquared(point);

					if((!skipSelf || distSq > 0.0) && distSq < bestDist) {

						bestDist = distSq;
						result = childResult;

					}

				}

			}

		}

	} else if(points !== null) {

		for(i = 0, l = points.length; i < l; ++i) {

			p = points[i];
			distSq = point.distanceToSquared(p);

			if((!skipSelf || distSq > 0.0) && distSq < bestDist) {

				bestDist = distSq;

				result = {
					point: p.clone(),
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
 * @private
 * @param {Vector3} point - A position.
 * @param {Number} radius - A radius.
 * @param {Boolean} skipSelf - Whether a point that is exactly at the given position should be skipped.
 * @param {Octant} octant - The current octant.
 * @param {Array} result - An array to be filled with objects, each containing a point and a data property.
 */

function findPoints(point, radius, skipSelf, octant, result) {

	const points = octant.points;
	const children = octant.children;
	const rSq = radius * radius;

	let i, l;

	let p, distSq;
	let child;

	if(children !== null) {

		for(i = 0, l = children.length; i < l; ++i) {

			child = children[i];

			if(child.contains(point, radius)) {

				findPoints(point, radius, skipSelf, child, result);

			}

		}

	} else if(points !== null) {

		for(i = 0, l = points.length; i < l; ++i) {

			p = points[i];
			distSq = point.distanceToSquared(p);

			if((!skipSelf || distSq > 0.0) && distSq <= rSq) {

				result.push({
					point: p.clone(),
					data: octant.data[i]
				});

			}

		}

	}

}

/**
 * An octree that manages points.
 */

export class PointOctree extends Octree {

	/**
	 * Constructs a new point octree.
	 *
	 * @param {Vector3} [min] - The lower bounds of the tree.
	 * @param {Vector3} [max] - The upper bounds of the tree.
	 * @param {Number} [bias=0.0] - An octant boundary bias.
	 * @param {Number} [maxPoints=8] - Number of distinct points per octant before it splits up.
	 * @param {Number} [maxDepth=8] - The maximum tree depth level, starting at 0.
	 */

	constructor(min, max, bias = 0.0, maxPoints = 8, maxDepth = 8) {

		super();

		/**
		 * The root octant.
		 *
		 * @type {PointOctant}
		 */

		this.root = new PointOctant(min, max);

		/**
		 * An octant boundary bias.
		 *
		 * The octree is considered "loose" with a bias greater than 0.
		 *
		 * @type {Number}
		 * @private
		 */

		this.bias = Math.max(0.0, bias);

		/**
		 * Number of points per octant before a split occurs.
		 *
		 * This value works together with the maximum depth as a secondary limiting
		 * factor. Smaller values cause splits to occur earlier which results in a
		 * faster and deeper tree growth.
		 *
		 * @type {Number}
		 * @private
		 */

		this.maxPoints = Math.max(1, Math.round(maxPoints));

		/**
		 * The maximum tree depth level.
		 *
		 * It's possible to use Infinity, but keep in mind that allowing infinitely
		 * small octants can have a severely negative impact on performance.
		 * Finding a value that works best for a specific scene is advisable.
		 *
		 * @type {Number}
		 * @private
		 */

		this.maxDepth = Math.max(0, Math.round(maxDepth));

		/**
		 * The amount of points that are currently in this octree.
		 *
		 * @type {Number}
		 */

		this.pointCount = 0;

	}

	/**
	 * Counts how many points are in the given octant.
	 *
	 * @param {Octant} octant - An octant.
	 * @return {Number} The amount of points.
	 */

	countPoints(octant) {

		return countPoints(octant);

	}

	/**
	 * Puts a point into the octree.
	 *
	 * @param {Vector3} point - A point. If it's already in the octree, the data entry will be updated.
	 * @param {Object} data - A data object that belongs to the point.
	 * @return {Boolean} Whether the operation was successful.
	 */

	put(point, data) {

		return put(point, data, this, this.root, 0);

	}

	/**
	 * Removes a point from the tree.
	 *
	 * @param {Vector3} point - A point.
	 * @return {Object} The data entry of the removed point or null if it didn't exist.
	 */

	remove(point) {

		return remove(point, this, this.root, null);

	}

	/**
	 * Retrieves the data of the specified point.
	 *
	 * @param {Vector3} point - A position.
	 * @return {Object} The data entry that is associated with the given point or null if it doesn't exist.
	 */

	fetch(point) {

		return fetch(point, this, this.root);

	}

	/**
	 * Moves an existing point to a new position. Has no effect if the point
	 * doesn't exist.
	 *
	 * @param {Vector3} point - The point.
	 * @param {Vector3} position - The new position.
	 * @return {Object} The data entry of the updated point or null if it didn't exist.
	 */

	move(point, position) {

		return move(point, position, this, this.root, null, 0);

	}

	/**
	 * Finds the closest point to the given one.
	 *
	 * @param {Vector3} point - A point.
	 * @param {Number} [maxDistance=Infinity] - An upper limit for the distance between the points.
	 * @param {Boolean} [skipSelf=false] - Whether a point that is exactly at the given position should be skipped.
	 * @return {Object} An object representing the nearest point or null if there is none. The object has a point and a data property.
	 */

	findNearestPoint(point, maxDistance = Infinity, skipSelf = false) {

		return findNearestPoint(point, maxDistance, skipSelf, this.root);

	}

	/**
	 * Finds points that are in the specified radius around the given position.
	 *
	 * @param {Vector3} point - A position.
	 * @param {Number} radius - A radius.
	 * @param {Boolean} [skipSelf=false] - Whether a point that is exactly at the given position should be skipped.
	 * @return {Array} An array of objects, each containing a point and a data property.
	 */

	findPoints(point, radius, skipSelf = false) {

		const result = [];

		findPoints(point, radius, skipSelf, this.root, result);

		return result;

	}

	/**
	 * Finds the points that intersect with the given ray.
	 *
	 * @param {Raycaster} raycaster - The raycaster.
	 * @param {Array} [intersects] - An array to be filled with the intersecting points.
	 * @return {RayPointIntersection[]} The intersecting points.
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
	 * @param {Octant[]} octants - An array containing octants that intersect with the ray.
	 * @param {Raycaster} raycaster - The raycaster.
	 * @param {Array} intersects - An array to be filled with intersecting points.
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

						intersectPoint = raycaster.ray.closestPointToPoint(point, new Vector3());
						distance = raycaster.ray.origin.distanceTo(intersectPoint);

						if(distance >= raycaster.near && distance <= raycaster.far) {

							distanceToRay = Math.sqrt(rayPointDistanceSq);

							intersects.push(new RayPointIntersection(
								distance,
								distanceToRay,
								intersectPoint,
								octant.data[j]
							));

						}

					}

				}

			}

		}

	}

}
