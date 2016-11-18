import { Octree } from "../core/octree.js";
import { PointOctant } from "./point-octant.js";

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

		return this.root.countPoints();

	}

	/**
	 * Adds a point to the tree.
	 *
	 * @method add
	 * @param {Vector3} p - A point.
	 * @param {Object} data - An object that the point represents.
	 */

	add(p, data) {

		p = p.clone();

		let heap = [this.root];
		let currentLevel = 0;

		let octant, children;
		let i, l;

		let exists = false;

		if(data !== undefined && data !== null) {

			while(heap.length > 0) {

				octant = heap.pop();
				children = octant.children;

				if(octant.contains(p, this.bias)) {

					heap = [];

					if(children !== null) {

						heap.push(...children);

						++currentLevel;

					} else {

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

						} else if(octant.points.length < this.maxPoints || currentLevel === this.maxDepth) {

							octant.points.push(p);
							octant.data.push(data);

						} else {

							octant.split();
							octant.redistribute(this.bias);

							heap.push(...octant.children);

							++currentLevel;

						}

					}

				}

			}

		}

	}

	/**
	 * Removes a point from the tree.
	 *
	 * @method remove
	 * @param {Vector3} p - A point.
	 */

	remove(p) {

		let heap = [this.root];
		let parent = this.root;

		let octant, children;

		let i, l;
		let points, data;
		let point, last;

		while(heap.length > 0) {

			octant = heap.pop();
			children = octant.children;

			if(octant.contains(p, this.bias)) {

				heap = [];

				if(children !== null) {

					heap.push(...children);
					parent = octant;

				} else if(octant.points !== null) {

					points = octant.points;
					data = octant.data;

					for(i = 0, l = points.length; i < l; ++i) {

						point = points[i];

						if(point.equals(p)) {

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

							if(parent.countPoints() <= this.maxPoints) {

								parent.merge();

							}

							break;

						}

					}

				}

			}

		}

	}

	/**
	 * Retrieves the data of the point at the specified position.
	 *
	 * @method fetch
	 * @param {Vector3} p - A position.
	 * @return {Object} The data entry that is associated with the given point or null if it doesn't exist.
	 */

	fetch(p) {

		let heap = [this.root];

		let result = null;

		let octant, children;
		let i, l;
		let point;

		while(heap.length > 0) {

			octant = heap.pop();
			children = octant.children;

			if(octant.contains(p, this.bias)) {

				heap = [];

				if(children !== null) {

					heap.push(...children);

				} else {

					for(i = 0, l = octant.points.length; i < l; ++i) {

						point = octant.points[i];

						if(p.distanceToSquared(point) <= this.biasSquared) {

							result = octant.data[i];

							break;

						}

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
	 * @param {Vector3} p - A point.
	 * @param {Number} [maxDistance=Infinity] - An upper limit for the distance between the points.
	 * @param {Boolean} [skipSelf=false] - Whether a point that is exactly at the given position should be skipped.
	 * @return {Object} An object representing the nearest point or null if there is none. The object has a point and a data property.
	 */

	findNearestPoint(p, maxDistance = Infinity, skipSelf = false) {

		return this.root.findNearestPoint(p, maxDistance, skipSelf);

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

		this.root.findPoints(p, r, skipSelf, result);

		return result;

	}

	/**
	 * Finds the points that intersect with the given ray.
	 *
	 * @method raycast
	 * @param {Raycaster} raycaster - The raycaster.
	 * @param {Array} intersects - An array to be filled with the intersecting points.
	 */

	raycast(raycaster, intersects) {

		const octants = [];

		super.raycast(raycaster, octants);

		if(octants.length > 0) {

			// Collect intersecting points.
			this.testPoints(octants, raycaster, intersects);

		}

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
