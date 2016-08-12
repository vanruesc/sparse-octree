import { Octree } from "../octree";
import { Vector3 } from "../vector3";
import { PointOctant } from "./octant";

/**
 * An octree that manages points.
 *
 * @class PointOctree
 * @submodule point
 * @extends Octree
 * @constructor
 * @param {Vector3} min - The lower bounds of the tree.
 * @param {Vector3} max - The upper bounds of the tree.
 * @param {Number} [bias=0.0] - A threshold for proximity checks.
 * @param {Number} [maxPoints=8] - Number of distinct points per octant before it splits up.
 * @param {Number} [maxDepth=8] - The maximum tree depth level, starting at 0.
 */

export class PointOctree extends Octree {

	constructor(min, max, bias, maxPoints, maxDepth) {

		super();

		this.root = new PointOctant(min, max);

		this.bias = bias;
		this.maxDepth = maxDepth;
		this.maxPoints = maxPoints;

	}

	/**
	 * A threshold for proximity checks.
	 *
	 * @property bias
	 * @type Number
	 * @default 0.0
	 */

	get bias() { return PointOctant.bias; }

	set bias(x) { PointOctant.bias = x; }

	/**
	 * The maximum tree depth level.
	 * Setting this value refreshes the entire tree.
	 *
	 * It's possible to set this value to Infinity, but be aware that allowing
	 * infinitely small octants can have a negative impact on performance. Finding
	 * a value that works best for a specific scene is advisable.
	 *
	 * @property maxDepth
	 * @type Number
	 * @default 8
	 */

	get maxDepth() { return PointOctant.maxDepth; }

	set maxDepth(x) {

		PointOctant.maxDepth = x;
		this.root.update();

	}

	/**
	 * Number of points per octant before a split occurs. Setting this value
	 * refreshes the entire tree.
	 *
	 * This value works together with the maximum depth as a secondary limiting
	 * factor. Smaller values cause splits to occur earlier which results in a
	 * faster and deeper tree growth.
	 *
	 * @property maxPoints
	 * @type Number
	 * @default 8
	 */

	get maxPoints() { return PointOctant.maxPoints; }

	set maxPoints(x) {

		PointOctant.maxPoints = x;
		this.root.update();

	}

	/**
	 * The amount of points that are currently in the tree.
	 *
	 * @property totalPoints
	 * @type Number
	 */

	get totalPoints() { return this.root.totalPoints; }

	/**
	 * Adds a point to the tree.
	 *
	 * @method add
	 * @param {Vector3} p - A point.
	 * @param {Object} [data] - An arbitrary object that will be associated with the point.
	 */

	add(p, data) {

		if(this.root.containsPoint(p, this.bias)) {

			this.root.add(p.clone(), data);

		}

	}

	/**
	 * Adds all points from the given array of position triples to the tree.
	 *
	 * @method addPoints
	 * @param {Float32Array} array - An array containing point position triples.
	 * @param {Object} [data] - An arbitrary object that will be associated with the points.
	 */

	addPoints(array, data) {

		const v = new Vector3();

		let i, l;

		for(i = 0, l = array.length; i < l; i += 3) {

			this.add(v.fromArray(array, i).clone(), data);

		}

	}

	/**
	 * Removes a point from the tree.
	 *
	 * @method remove
	 * @param {Vector3} p - A point.
	 * @param {Object} [data] - An object that is associated with the point.
	 */

	remove(p, data) {

		if(this.root.containsPoint(p, this.bias)) {

			this.root.remove(p, data);

		}

	}

	/**
	 * Removes all points from the tree that are in the given array of position
	 * triples.
	 *
	 * @method removePoints
	 * @param {Float32Array} array - An array containing point position triples.
	 * @param {Object} [data] - An object that is associated with the points.
	 */

	removePoints(array, data) {

		const v = new Vector3();

		let i, l;

		for(i = 0, l = array.length; i < l; i += 3) {

			this.remove(v.fromArray(array, i), data);

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

		return this.root.fetch(p);

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

	findNearestPoint(p, maxDistance, skipSelf) {

		if(maxDistance === undefined) { maxDistance = Infinity; }
		if(skipSelf === undefined) { skipSelf = false; }

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

	findPoints(p, r, skipSelf) {

		if(skipSelf === undefined) { skipSelf = false; }

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
		let octant, point, dataSet, data;

		for(i = 0, il = octants.length; i < il; ++i) {

			octant = octants[i];

			for(j = 0, jl = octant.totalPoints; j < jl; ++j) {

				point = octant.points[j];
				rayPointDistanceSq = raycaster.ray.distanceSqToPoint(point);

				if(rayPointDistanceSq < thresholdSq) {

					intersectPoint = raycaster.ray.closestPointToPoint(point);
					distance = raycaster.ray.origin.distanceTo(intersectPoint);

					if(distance >= raycaster.near && distance <= raycaster.far) {

						dataSet = octant.dataSets[j];
						distanceToRay = Math.sqrt(rayPointDistanceSq);

						if(dataSet.size > 0) {

							// Unfold data aggregation.
							for(data of dataSet) {

								intersects.push({
									distance: distance,
									distanceToRay: distanceToRay,
									point: intersectPoint.clone(),
									object: data
								});

							}

						} else {

							intersects.push({
								distance: distance,
								distanceToRay: distanceToRay,
								point: intersectPoint.clone(),
								object: null
							});

						}

					}

				}

			}

		}

	}

}
