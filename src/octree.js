import { Octant } from "./octant";
import { Raycasting } from "./raycasting";
import { Vector3 } from "./vector3";

/**
 * An octree that subdivides space into regular cells for fast spatial searches.
 *
 * @class Octree
 * @constructor
 * @param {Vector3} min - The lower bounds of the tree.
 * @param {Vector3} max - The upper bounds of the tree.
 * @param {Number} [bias=0.0] - A threshold for proximity checks.
 * @param {Number} [maxPoints=8] - Number of distinct points per octant before it splits up.
 * @param {Number} [maxDepth=8] - The maximum tree depth level, starting at 0.
 */

export class Octree {

	constructor(min, max, bias, maxPoints, maxDepth) {

		/**
		 * The root node.
		 *
		 * @property root
		 * @type Octant
		 * @private
		 * @final
		 */

		this.root = new Octant(min, max, 0);

		// Octant settings.
		this.bias = bias;
		this.maxDepth = maxDepth;
		this.maxPoints = maxPoints;

	}

	/**
	 * The children of the root node.
	 *
	 * @property children
	 * @type Array
	 */

	get children() { return this.root.children; }

	/**
	 * A threshold for proximity checks.
	 *
	 * @property bias
	 * @type Number
	 * @default 0.0
	 */

	get bias() { return Octant.bias; }

	set bias(x) {

		if(typeof x === "number") {

			Octant.bias = Math.max(0.0, x);
			Octant.biasSquared = Octant.bias * Octant.bias;

		}

	}

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

	get maxDepth() { return Octant.maxDepth; }

	set maxDepth(x) {

		if(typeof x === "number") {

			Octant.maxDepth = Math.max(0, Math.round(x));
			this.root.update();

		}

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

	get maxPoints() { return Octant.maxPoints; }

	set maxPoints(x) {

		if(typeof x === "number") {

			Octant.maxPoints = Math.max(1, Math.round(x));
			this.root.update();

		}

	}

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

		Raycasting.raycast(this, raycaster, octants);

		if(octants.length > 0) {

			// Collect intersecting points.
			Raycasting.testPoints(octants, raycaster, intersects);

		}

	}

	/**
	 * Collects octants that lie inside the specified frustum.
	 *
	 * @method cull
	 * @param {Frustum} frustum - A frustum.
	 * @return {Array} The octants.
	 */

	cull(frustum) {

		const result = [];

		this.root.cull(frustum, result);

		return result;

	}

	/**
	 * Fetches all nodes with the specified level.
	 *
	 * @method getOctantsByLevel
	 * @param {Number} level - The depth level.
	 * @return {Array} The nodes.
	 */

	getOctantsByLevel(level) {

		const result = [];

		this.root.getOctantsByLevel(level, result);

		return result;

	}

	/**
	 * Returns the amount of points that are currently in the tree.
	 *
	 * @method getTotalPoints
	 * @return {Number} The total amount of points in the tree.
	 */

	getTotalPoints() {

		return this.root.totalPoints;

	}

	/**
	 * Calculates the current tree depth.
	 *
	 * @method getDepth
	 * @return {Number} The depth.
	 */

	getDepth() {

		return this.root.getDepth();

	}

}
