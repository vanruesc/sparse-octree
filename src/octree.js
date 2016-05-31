import { Octant } from "./octant";
import { flags, testPoints } from "./raycasting";
import THREE from "three";

/**
 * A collection of vectors. Used for computations.
 *
 * @property vectors
 * @type Array
 * @private
 * @static
 * @final
 */

const vectors = [
	new THREE.Vector3(),
	new THREE.Vector3(),
	new THREE.Vector3(),
	new THREE.Vector3(),
	new THREE.Vector3(),
	new THREE.Vector3()
];

/**
 * An octree that subdivides 3D space into regular cells for 
 * fast spatial searches.
 *
 * The Octree extends Object3D for smooth raycasting integration. 
 * It doesn't respect scale, rotation or position translations.
 *
 * @class Octree
 * @constructor
 * @extends Object3D
 * @param {Vector3} min - The lower bounds of the tree.
 * @param {Vector3} max - The upper bounds of the tree.
 * @param {Number} [bias=0.0] - A threshold for proximity checks.
 * @param {Number} [maxPoints=8] - Number of distinct points per octant before it's split up.
 * @param {Number} [maxDepth=8] - The maximum tree depth level, starting at 0.
 * @param {Number} [minSize] - The minimum octant size.
 */

export class Octree extends THREE.Object3D {

	constructor(min, max, bias, maxPoints, maxDepth, minSize) {

		super();

		this.name = "Octree";

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
		this.minSize = minSize;

	}

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
	 * infinitely small octants can have a negative impact on performance. 
	 * Finding a value that works best for a specific scene is advisable.
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
	 * Number of points per octant before a split occurs.
	 * Setting this value refreshes the entire tree.
	 *
	 * This value works together with the maximum depth as a secondary 
	 * limiting factor. Smaller values cause splits to occur earlier 
	 * which results in a faster and deeper tree growth.
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
	 * The minimum size of an octant.
	 *
	 * Octants won't split if their children would have a side 
	 * that's smaller than the respective x, y or z minimum value.
	 *
	 * This value acts just like the maximum depth as a primary 
	 * limiting factor.
	 *
	 * @property minSize
	 * @type Vector3
	 * @default Vector3(1e-12, 1e-12, 1e-12)
	 */

	get minSize() { return Octant.minSize; }

	set minSize(x) {

		if(x instanceof THREE.Vector3) {

			Octant.minSize.copy(x).max(vectors[0].set(1e-12, 1e-12, 1e-12));
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

			this.root.add(p, data);

		}

	}

	/**
	 * Adds all points that are described by a given array of position 
	 * values to the tree.
	 *
	 * @method addPoints
	 * @param {Float32Array} array - An array containing point position triples.
	 * @param {Object} [data] - An arbitrary object that will be associated with the points.
	 */

	addPoints(array, data) {

		const v = vectors[0];

		let i, l;

		for(i = 0, l = array.length; i < l; i += 3) {

			this.add(v.fromArray(array, i), data);

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
	 * Removes all points that are described by a given array of position 
	 * values from the tree.
	 *
	 * @method removePoints
	 * @param {Float32Array} array - An array containing point position triples.
	 * @param {Object} [data] - An object that is associated with the points.
	 */

	removePoints(array, data) {

		const v = vectors[0];

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
	 * Finds the octants that intersect with the given ray.
	 *
	 * @method raycastOctants
	 * @param {Raycaster} raycaster - The raycaster.
	 * @param {Array} octants - An array to be filled with the intersecting octants.
	 */

	raycastOctants(raycaster, octants) {

		const root = this.root;

		const size = vectors[0].copy(root.size());
		const halfSize = vectors[1].copy(size).multiplyScalar(0.5);

		// Translate the octree extents to the center of the octree.
		const min = vectors[2].copy(root.min).sub(root.min);
		const max = vectors[3].copy(root.max).sub(root.min);

		const direction = vectors[4].copy(raycaster.ray.direction);
		const origin = vectors[5].copy(raycaster.ray.origin);

		// Translate the ray to the center of the octree.
		origin.sub(root.center()).add(halfSize);

		let invDirX, invDirY, invDirZ;
		let tx0, tx1, ty0, ty1, tz0, tz1;

		// Reset the last byte.
		flags[8] = flags[0];

		// Handle rays with negative directions.
		if(direction.x < 0.0) {

			origin.x = size.x - origin.x;
			direction.x = -direction.x;
			flags[8] |= flags[4];

		}

		if(direction.y < 0.0) {

			origin.y = size.y - origin.y;
			direction.y = -direction.y;
			flags[8] |= flags[2];

		}

		if(direction.z < 0.0) {

			origin.z = size.z - origin.z;
			direction.z = -direction.z;
			flags[8] |= flags[1];

		}

		// Improve IEEE double stability.
		invDirX = 1.0 / direction.x;
		invDirY = 1.0 / direction.y;
		invDirZ = 1.0 / direction.z;

		// Project the ray to the root's boundaries.
		tx0 = (min.x - origin.x) * invDirX;
		tx1 = (max.x - origin.x) * invDirX;
		ty0 = (min.y - origin.y) * invDirY;
		ty1 = (max.y - origin.y) * invDirY;
		tz0 = (min.z - origin.z) * invDirZ;
		tz1 = (max.z - origin.z) * invDirZ;

		// Check if the ray hits the octree.
		if(Math.max(Math.max(tx0, ty0), tz0) < Math.min(Math.min(tx1, ty1), tz1)) {

			root.raycast(tx0, ty0, tz0, tx1, ty1, tz1, raycaster, octants);

		}

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

		this.raycastOctants(raycaster, octants);

		if(octants.length > 0) {

			// Collect intersecting points.
			testPoints(octants, raycaster, intersects);

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
