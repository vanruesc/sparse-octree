/**
 * sparse-octree v6.0.2 build Sat Jan 18 2020
 * https://github.com/vanruesc/sparse-octree
 * Copyright 2020 Raoul van Rüschen
 * @license Zlib
 */
import { Vector3, Box3, Ray } from 'math-ds';
import IteratorResult from 'iterator-result';

/**
 * Describes all possible octant corner connections.
 *
 * @type {Uint8Array[]}
 */

const edges = [

	// X-Axis.
	new Uint8Array([0, 4]),
	new Uint8Array([1, 5]),
	new Uint8Array([2, 6]),
	new Uint8Array([3, 7]),

	// Y-Axis.
	new Uint8Array([0, 2]),
	new Uint8Array([1, 3]),
	new Uint8Array([4, 6]),
	new Uint8Array([5, 7]),

	// Z-Axis.
	new Uint8Array([0, 1]),
	new Uint8Array([2, 3]),
	new Uint8Array([4, 5]),
	new Uint8Array([6, 7])

];

/**
 * A binary pattern that describes the standard octant layout:
 *
 * ```text
 *    3____7
 *  2/___6/|
 *  | 1__|_5
 *  0/___4/
 * ```
 *
 * This common layout is crucial for positional assumptions.
 *
 * @type {Uint8Array[]}
 */

const layout = [

	new Uint8Array([0, 0, 0]),
	new Uint8Array([0, 0, 1]),
	new Uint8Array([0, 1, 0]),
	new Uint8Array([0, 1, 1]),

	new Uint8Array([1, 0, 0]),
	new Uint8Array([1, 0, 1]),
	new Uint8Array([1, 1, 0]),
	new Uint8Array([1, 1, 1])

];

/**
 * A vector.
 *
 * @type {Vector3}
 * @private
 */

const c = new Vector3();

/**
 * A cubic octant.
 *
 * @implements {Node}
 */

class CubicOctant {

	/**
	 * Constructs a new cubic octant.
	 *
	 * @param {Vector3} [min] - The lower bounds.
	 * @param {Number} [size=0] - The size of the octant.
	 */

	constructor(min = new Vector3(), size = 0) {

		/**
		 * The lower bounds of this octant.
		 *
		 * @type {Vector3}
		 */

		this.min = min;

		/**
		 * The size of this octant.
		 *
		 * @type {Number}
		 */

		this.size = size;

		/**
		 * The children of this octant.
		 *
		 * @type {CubicOctant[]}
		 */

		this.children = null;

	}

	/**
	 * The upper bounds of this octant.
	 *
	 * Attention: Accessing this property creates a new vector!
	 *
	 * @type {Vector3}
	 */

	get max() {

		return this.min.clone().addScalar(this.size);

	}

	/**
	 * Computes the center of this octant.
	 *
	 * @param {Vector3} target - A target vector.
	 * @return {Vector3} The center.
	 */

	getCenter(target) {

		return target.copy(this.min).addScalar(this.size * 0.5);

	}

	/**
	 * Returns the size of this octant as a vector.
	 *
	 * @param {Vector3} target - A target vector.
	 * @return {Vector3} The size.
	 */

	getDimensions(target) {

		return target.set(this.size, this.size, this.size);

	}

	/**
	 * Splits this octant into eight smaller ones.
	 */

	split() {

		const min = this.min;
		const mid = this.getCenter(c);
		const halfSize = this.size * 0.5;

		const children = this.children = [
			null, null, null, null,
			null, null, null, null
		];

		let i, combination;

		for(i = 0; i < 8; ++i) {

			combination = layout[i];

			children[i] = new this.constructor(

				new Vector3(
					(combination[0] === 0) ? min.x : mid.x,
					(combination[1] === 0) ? min.y : mid.y,
					(combination[2] === 0) ? min.z : mid.z
				),

				halfSize

			);

		}

	}

}

/**
 * A vector.
 *
 * @type {Vector3}
 * @private
 */

const c$1 = new Vector3();

/**
 * An octant.
 *
 * @implements {Node}
 */

class Octant {

	/**
	 * Constructs a new octant.
	 *
	 * @param {Vector3} [min] - The lower bounds.
	 * @param {Vector3} [max] - The upper bounds.
	 */

	constructor(min = new Vector3(), max = new Vector3()) {

		/**
		 * The lower bounds of this octant.
		 *
		 * @type {Vector3}
		 */

		this.min = min;

		/**
		 * The upper bounds of the octant.
		 *
		 * @type {Vector3}
		 */

		this.max = max;

		/**
		 * The children of this octant.
		 *
		 * @type {Octant[]}
		 */

		this.children = null;

	}

	/**
	 * Computes the center of this octant.
	 *
	 * @param {Vector3} target - A target vector.
	 * @return {Vector3} The center.
	 */

	getCenter(target) {

		return target.addVectors(this.min, this.max).multiplyScalar(0.5);

	}

	/**
	 * Computes the size of this octant.
	 *
	 * @param {Vector3} target - A target vector.
	 * @return {Vector3} The size.
	 */

	getDimensions(target) {

		return target.subVectors(this.max, this.min);

	}

	/**
	 * Splits this octant into eight smaller ones.
	 */

	split() {

		const min = this.min;
		const max = this.max;
		const mid = this.getCenter(c$1);

		const children = this.children = [
			null, null, null, null,
			null, null, null, null
		];

		let i, combination;

		for(i = 0; i < 8; ++i) {

			combination = layout[i];

			children[i] = new this.constructor(

				new Vector3(
					(combination[0] === 0) ? min.x : mid.x,
					(combination[1] === 0) ? min.y : mid.y,
					(combination[2] === 0) ? min.z : mid.z
				),

				new Vector3(
					(combination[0] === 0) ? mid.x : max.x,
					(combination[1] === 0) ? mid.y : max.y,
					(combination[2] === 0) ? mid.z : max.z
				)

			);

		}

	}

}

/**
 * A collection of ray-point intersection data.
 */

class RayPointIntersection {

	/**
	 * Constructs new ray-point intersection data.
	 *
	 * @param {Number} distance - The distance from the origin of the ray to the point.
	 * @param {Number} distanceToRay - The distance from the point to the ray.
	 * @param {Vector3} point - The point.
	 * @param {Object} [object=null] - The point's data.
	 */

	constructor(distance, distanceToRay, point, object = null) {

		/**
		 * The distance from the origin of the ray to the point.
		 *
		 * @type {Number}
		 */

		this.distance = distance;

		/**
		 * The shortest distance from the point to the ray.
		 *
		 * @type {Number}
		 */

		this.distanceToRay = distanceToRay;

		/**
		 * The point.
		 *
		 * @type {Vector3}
		 */

		this.point = point;

		/**
		 * The point's data.
		 *
		 * @type {Object}
		 */

		this.object = object;

	}

}

/**
 * Collects points that intersect with the given ray.
 *
 * @param {PointOctant[]} octants - An array containing octants that intersect with the ray.
 * @param {Raycaster} raycaster - The raycaster.
 * @param {RayPointIntersection[]} intersects - An array to be filled with intersecting points.
 */

function testPoints(octants, raycaster, intersects) {

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

/**
 * A container for raycasting flags.
 */

class Flags {

	/**
	 * Creates a new container for raycasting flags.
	 */

	constructor() {

		/**
		 * The current flags.
		 *
		 * @type {Number}
		 */

		this.value = 0;

	}

}

/**
 * Finds the entry plane of the first octant that a ray travels through.
 *
 * Determining the first octant requires knowing which of the t0s is the
 * largest. The tms of the other axes must also be compared against that
 * largest t0.
 *
 * @param {Number} tx0 - Ray projection parameter.
 * @param {Number} ty0 - Ray projection parameter.
 * @param {Number} tz0 - Ray projection parameter.
 * @param {Number} txm - Ray projection parameter mean.
 * @param {Number} tym - Ray projection parameter mean.
 * @param {Number} tzm - Ray projection parameter mean.
 * @return {Number} The index of the first octant that the ray travels through.
 */

function findEntryOctant(tx0, ty0, tz0, txm, tym, tzm) {

	let entry = 0;

	// Find the entry plane.
	if(tx0 > ty0 && tx0 > tz0) {

		// YZ-plane.
		if(tym < tx0) {

			entry |= 2;

		}

		if(tzm < tx0) {

			entry |= 1;

		}

	} else if(ty0 > tz0) {

		// XZ-plane.
		if(txm < ty0) {

			entry |= 4;

		}

		if(tzm < ty0) {

			entry |= 1;

		}

	} else {

		// XY-plane.
		if(txm < tz0) {

			entry |= 4;

		}

		if(tym < tz0) {

			entry |= 2;

		}

	}

	return entry;

}

/**
 * A lookup-table containing octant ids. Used to determine the exit plane from
 * an octant.
 *
 * @type {Uint8Array[]}
 * @private
 */

const octantTable = [

	new Uint8Array([4, 2, 1]),
	new Uint8Array([5, 3, 8]),
	new Uint8Array([6, 8, 3]),
	new Uint8Array([7, 8, 8]),
	new Uint8Array([8, 6, 5]),
	new Uint8Array([8, 7, 8]),
	new Uint8Array([8, 8, 7]),
	new Uint8Array([8, 8, 8])

];

/**
 * Finds the next octant that intersects with the ray based on the exit plane of
 * the current one.
 *
 * @param {Number} currentOctant - The index of the current octant.
 * @param {Number} tx1 - Ray projection parameter.
 * @param {Number} ty1 - Ray projection parameter.
 * @param {Number} tz1 - Ray projection parameter.
 * @return {Number} The index of the next octant that the ray travels through.
 */

function findNextOctant(currentOctant, tx1, ty1, tz1) {

	let min;
	let exit = 0;

	// Find the exit plane.
	if(tx1 < ty1) {

		min = tx1;
		exit = 0; // YZ-plane.

	} else {

		min = ty1;
		exit = 1; // XZ-plane.

	}

	if(tz1 < min) {

		exit = 2; // XY-plane.

	}

	return octantTable[currentOctant][exit];

}

/**
 * A vector.
 *
 * @type {Vector3}
 * @private
 */

const v = new Vector3();

/**
 * A box.
 *
 * @type {Box3}
 * @private
 */

const b = new Box3();

/**
 * A box.
 *
 * @type {Box3}
 * @private
 */

const d = new Box3();

/**
 * A ray.
 *
 * @type {Ray}
 * @private
 */

const r = new Ray();

/**
 * Calculates ray projection parameters for the given octree and ray setup.
 *
 * @param {Octree} octree - The octree.
 * @param {Ray} ray - A ray.
 * @param {Flags} flags - Raycasting flags.
 * @return {Number[]} The ray parameters tx0, ty0, tz0, tx1, ty1 and tz1, in that order, or null if the ray doesn't hit the octree.
 */

function intersectOctree(octree, ray, flags) {

	// Translate the octant extents to the scene origin.
	const min = b.min.set(0, 0, 0);
	const max = b.max.subVectors(octree.max, octree.min);

	const dimensions = octree.getDimensions(d.min);
	const halfDimensions = d.max.copy(dimensions).multiplyScalar(0.5);

	const origin = r.origin.copy(ray.origin);
	const direction = r.direction.copy(ray.direction);

	let invDirX, invDirY, invDirZ;
	let tx0, tx1, ty0, ty1, tz0, tz1;

	// Translate the ray to the center of the octant.
	origin.sub(octree.getCenter(v)).add(halfDimensions);

	// Reset all flags.
	flags.value = 0;

	// Handle rays with negative directions.
	if(direction.x < 0.0) {

		origin.x = dimensions.x - origin.x;
		direction.x = -direction.x;
		flags.value |= 4;

	}

	if(direction.y < 0.0) {

		origin.y = dimensions.y - origin.y;
		direction.y = -direction.y;
		flags.value |= 2;

	}

	if(direction.z < 0.0) {

		origin.z = dimensions.z - origin.z;
		direction.z = -direction.z;
		flags.value |= 1;

	}

	// Improve IEEE double stability.
	invDirX = 1.0 / direction.x;
	invDirY = 1.0 / direction.y;
	invDirZ = 1.0 / direction.z;

	// Project the ray to the octant's boundaries.
	tx0 = (min.x - origin.x) * invDirX;
	tx1 = (max.x - origin.x) * invDirX;
	ty0 = (min.y - origin.y) * invDirY;
	ty1 = (max.y - origin.y) * invDirY;
	tz0 = (min.z - origin.z) * invDirZ;
	tz1 = (max.z - origin.z) * invDirZ;

	// Check if the ray hits the octree.
	return (Math.max(Math.max(tx0, ty0), tz0) < Math.min(Math.min(tx1, ty1), tz1)) ?
		[tx0, ty0, tz0, tx1, ty1, tz1] : null;

}

/**
 * Raycasting flags.
 *
 * @type {Flags}
 */

const flags = new Flags();

/**
 * Finds all octants that intersect with the given ray.
 *
 * @private
 * @param {Octant} octant - The current octant.
 * @param {Number} tx0 - A ray projection parameter.
 * @param {Number} ty0 - A ray projection parameter.
 * @param {Number} tz0 - A ray projection parameter.
 * @param {Number} tx1 - A ray projection parameter.
 * @param {Number} ty1 - A ray projection parameter.
 * @param {Number} tz1 - A ray projection parameter.
 * @param {Array} intersects - An array to be filled with the intersecting octants.
 */

function raycastOctant(octant, tx0, ty0, tz0, tx1, ty1, tz1, intersects) {

	if(tx1 >= 0.0 && ty1 >= 0.0 && tz1 >= 0.0) {

		const children = octant.children;

		if(children === null) {

			// Leaf.
			intersects.push(octant);

		} else {

			// Compute means.
			const txm = 0.5 * (tx0 + tx1);
			const tym = 0.5 * (ty0 + ty1);
			const tzm = 0.5 * (tz0 + tz1);

			const f = flags.value;
			let currentOctant = findEntryOctant(tx0, ty0, tz0, txm, tym, tzm);

			/* The possibilities for the next node are passed in the same respective
			order as the t-values. Hence, if the first value is found to be the
			greatest, the fourth one will be returned. If the second value is the
			greatest, the fifth one will be returned, etc. */

			do {

				switch(currentOctant) {

					case 0:
						raycastOctant(children[f], tx0, ty0, tz0, txm, tym, tzm, intersects);
						currentOctant = findNextOctant(currentOctant, txm, tym, tzm);
						break;

					case 1:
						raycastOctant(children[f ^ 1], tx0, ty0, tzm, txm, tym, tz1, intersects);
						currentOctant = findNextOctant(currentOctant, txm, tym, tz1);
						break;

					case 2:
						raycastOctant(children[f ^ 2], tx0, tym, tz0, txm, ty1, tzm, intersects);
						currentOctant = findNextOctant(currentOctant, txm, ty1, tzm);
						break;

					case 3:
						raycastOctant(children[f ^ 3], tx0, tym, tzm, txm, ty1, tz1, intersects);
						currentOctant = findNextOctant(currentOctant, txm, ty1, tz1);
						break;

					case 4:
						raycastOctant(children[f ^ 4], txm, ty0, tz0, tx1, tym, tzm, intersects);
						currentOctant = findNextOctant(currentOctant, tx1, tym, tzm);
						break;

					case 5:
						raycastOctant(children[f ^ 5], txm, ty0, tzm, tx1, tym, tz1, intersects);
						currentOctant = findNextOctant(currentOctant, tx1, tym, tz1);
						break;

					case 6:
						raycastOctant(children[f ^ 6], txm, tym, tz0, tx1, ty1, tzm, intersects);
						currentOctant = findNextOctant(currentOctant, tx1, ty1, tzm);
						break;

					case 7:
						raycastOctant(children[f ^ 7], txm, tym, tzm, tx1, ty1, tz1, intersects);
						// Far top right octant. No other octants can be reached from here.
						currentOctant = 8;
						break;

				}

			} while(currentOctant < 8);

		}

	}

}

/**
 * A raycaster for pointer-based octrees.
 *
 * Reference:
 *  "An Efficient Parametric Algorithm for Octree Traversal"
 *  by J. Revelles et al. (2000)
 */

class OctreeRaycaster {

	/**
	 * Finds (pseudo) leaf octants that intersect with the given ray.
	 *
	 * @param {Octree} octree - An octree.
	 * @param {Ray} ray - A ray.
	 * @param {Octant[]} [intersects] - An optional target list to be filled with the intersecting octants.
	 * @return {Octant[]} The intersecting octants. Sorted by distance, closest first.
	 */

	static intersectOctree(octree, ray, intersects = []) {

		const parameters = intersectOctree(octree, ray, flags);

		if(parameters !== null) {

			raycastOctant(octree.root, ...parameters, intersects);

		}

	}

}

/**
 * A 3D box.
 *
 * @type {Box3}
 * @private
 */

const b$1 = new Box3();

/**
 * An octree iterator.
 *
 * @implements {Iterator}
 * @implements {Iterable}
 */

class OctreeIterator {

	/**
	 * Constructs a new octant iterator.
	 *
	 * @param {Octree} octree - An octree.
	 * @param {Frustum|Box3} [region=null] - A cull region.
	 */

	constructor(octree, region = null) {

		/**
		 * The octree.
		 *
		 * @type {Octree}
		 * @private
		 */

		this.octree = octree;

		/**
		 * A region used for octree culling.
		 *
		 * @type {Frustum|Box3}
		 */

		this.region = region;

		/**
		 * Whether this iterator should respect the cull region.
		 *
		 * @type {Boolean}
		 */

		this.cull = (region !== null);

		/**
		 * An iterator result.
		 *
		 * @type {IteratorResult}
		 * @private
		 */

		this.result = new IteratorResult();

		/**
		 * An octant trace.
		 *
		 * @type {Octant[]}
		 * @private
		 */

		this.trace = null;

		/**
		 * Iteration indices.
		 *
		 * @type {Number[]}
		 * @private
		 */

		this.indices = null;

		this.reset();

	}

	/**
	 * Resets this iterator.
	 *
	 * @return {OctreeIterator} This iterator.
	 */

	reset() {

		const root = this.octree.root;

		this.trace = [];
		this.indices = [];

		if(root !== null) {

			b$1.min = root.min;
			b$1.max = root.max;

			if(!this.cull || this.region.intersectsBox(b$1)) {

				this.trace.push(root);
				this.indices.push(0);

			}

		}

		this.result.reset();

		return this;

	}

	/**
	 * Iterates over the leaf octants.
	 *
	 * @return {IteratorResult} The next leaf octant.
	 */

	next() {

		const cull = this.cull;
		const region = this.region;
		const indices = this.indices;
		const trace = this.trace;

		let octant = null;
		let depth = trace.length - 1;

		let index, children, child;

		while(octant === null && depth >= 0) {

			index = indices[depth]++;
			children = trace[depth].children;

			if(index < 8) {

				if(children !== null) {

					child = children[index];

					if(cull) {

						b$1.min = child.min;
						b$1.max = child.max;

						if(!region.intersectsBox(b$1)) {

							// Cull this octant.
							continue;

						}

					}

					trace.push(child);
					indices.push(0);

					++depth;

				} else {

					octant = trace.pop();
					indices.pop();

				}

			} else {

				trace.pop();
				indices.pop();

				--depth;

			}

		}

		this.result.value = octant;
		this.result.done = (octant === null);

		return this.result;

	}

	/**
	 * Called when this iterator will no longer be run to completion.
	 *
	 * @param {Object} value - An interator result value.
	 * @return {IteratorResult} - A premature completion result.
	 */

	return(value) {

		this.result.value = value;
		this.result.done = true;

		return this.result;

	}

	/**
	 * Returns this iterator.
	 *
	 * @return {Iterator} An iterator.
	 */

	[Symbol.iterator]() {

		return this;

	}

}

/**
 * A 3D box.
 *
 * @type {Box3}
 * @private
 */

const b$2 = new Box3();

/**
 * Recursively calculates the depth of the given octree.
 *
 * @private
 * @param {Node} octant - An octant.
 * @return {Number} The depth.
 */

function getDepth(octant) {

	const children = octant.children;

	let result = 0;
	let i, l, d;

	if(children !== null) {

		for(i = 0, l = children.length; i < l; ++i) {

			d = 1 + getDepth(children[i]);

			if(d > result) {

				result = d;

			}

		}

	}

	return result;

}

/**
 * Recursively collects octants that lie inside the specified region.
 *
 * @private
 * @param {Node} octant - An octant.
 * @param {Frustum|Box3} region - A region.
 * @param {Node[]} result - A list to be filled with octants that intersect with the region.
 */

function cull(octant, region, result) {

	const children = octant.children;

	let i, l;

	b$2.min = octant.min;
	b$2.max = octant.max;

	if(region.intersectsBox(b$2)) {

		if(children !== null) {

			for(i = 0, l = children.length; i < l; ++i) {

				cull(children[i], region, result);

			}

		} else {

			result.push(octant);

		}

	}

}

/**
 * Recursively fetches all octants with the specified depth level.
 *
 * @private
 * @param {Node} octant - An octant.
 * @param {Number} level - The target depth level.
 * @param {Number} depth - The current depth level.
 * @param {Node[]} result - A list to be filled with the identified octants.
 */

function findNodesByLevel(octant, level, depth, result) {

	const children = octant.children;

	let i, l;

	if(depth === level) {

		result.push(octant);

	} else if(children !== null) {

		++depth;

		for(i = 0, l = children.length; i < l; ++i) {

			findNodesByLevel(children[i], level, depth, result);

		}

	}

}

/**
 * A pointer-based octree that subdivides space for fast spatial searches.
 *
 * @implements {Iterable}
 * @implements {Node}
 * @implements {Tree}
 */

class Octree {

	/**
	 * Constructs a new octree.
	 *
	 * @param {Node} root - The root node. See {@link Octant} or {@link CubicOctant}.
	 */

	constructor(root) {

		/**
		 * The root octant.
		 *
		 * @type {Node}
		 * @protected
		 */

		this.root = root;

	}

	/**
	 * The lower bounds of the root octant.
	 *
	 * @type {Vector3}
	 */

	get min() {

		return this.root.min;

	}

	/**
	 * The upper bounds of the root octant.
	 *
	 * @type {Vector3}
	 */

	get max() {

		return this.root.max;

	}

	/**
	 * The children of the root node.
	 *
	 * @type {Node[]}
	 */

	get children() {

		return this.root.children;

	}

	/**
	 * Calculates the center of this octree.
	 *
	 * @param {Vector3} target - A target vector.
	 * @return {Vector3} A vector that describes the center of this octree.
	 */

	getCenter(target) {

		return this.root.getCenter(target);

	}

	/**
	 * Calculates the size of this octree.
	 *
	 * @param {Vector3} target - A target vector.
	 * @return {Vector3} A vector that describes the size of this octree.
	 */

	getDimensions(target) {

		return this.root.getDimensions(target);

	}

	/**
	 * Recursively collects nodes that intersect with the specified region.
	 *
	 * @param {Frustum|Box3} region - A region.
	 * @return {Node[]} The nodes.
	 */

	cull(region) {

		const result = [];

		cull(this.root, region, result);

		return result;

	}

	/**
	 * Calculates the current depth of this octree.
	 *
	 * @return {Number} The depth.
	 */

	getDepth() {

		return getDepth(this.root);

	}

	/**
	 * Fetches all nodes of a specific depth level.
	 *
	 * @param {Number} level - The depth level.
	 * @return {Node[]} The nodes.
	 */

	findNodesByLevel(level) {

		const result = [];

		findNodesByLevel(this.root, level, 0, result);

		return result;

	}

	/**
	 * Finds the nodes that intersect with the given ray. The intersecting
	 * nodes are sorted by distance, closest first.
	 *
	 * @param {Raycaster} raycaster - A raycaster.
	 * @param {Node[]} [intersects] - An optional target list to be filled with the intersecting nodes.
	 * @return {Node[]} The intersecting nodes.
	 */

	raycast(raycaster, intersects = []) {

		OctreeRaycaster.intersectOctree(this, raycaster.ray, intersects);

		return intersects;

	}

	/**
	 * Returns an iterator that traverses the octree and returns leaf nodes.
	 *
	 * When a cull region is provided, the iterator will only return leaves that
	 * intersect with that region.
	 *
	 * @param {Frustum|Box3} [region] - A cull region.
	 * @return {Iterator} An iterator.
	 */

	leaves(region) {

		return new OctreeIterator(this, region);

	}

	/**
	 * Returns an iterator that traverses the octree and returns all leaf nodes.
	 *
	 * @return {Iterator} An iterator.
	 */

	[Symbol.iterator]() {

		return new OctreeIterator(this);

	}

}

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

class PointOctant extends Octant {

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
	 * Calculates the distance squared from this octant to the given point.
	 *
	 * @param {Vector3} point - A point.
	 * @return {Number} The distance squared.
	 */

	distanceToSquared(point) {

		const clampedPoint = p.copy(point).clamp(this.min, this.max);

		return clampedPoint.sub(point).lengthSquared();

	}

	/**
	 * Calculates the distance squared from the center of this octant to the given
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
	 * Redistributes the points of this octant to its children.
	 *
	 * Has no effect if there are no points or if this octant has no children.
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

			this.points = null;
			this.data = null;

		}

	}

	/**
	 * Deletes all child nodes and collects their points.
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

			/** @ignore */
			this.children = null;
			this.points = points;
			this.data = data;

		}

	}

}

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
 * Recursively inserts a point into the octree.
 *
 * @private
 * @param {Vector3} point - A point.
 * @param {Object} data - An object that the point represents.
 * @param {Octree} octree - The octree.
 * @param {Octant} octant - The current octant.
 * @param {Number} depth - The current depth.
 * @return {Boolean} Whether the operation was successful.
 */

function insert(point, data, octree, octant, depth) {

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

				done = insert(point, data, octree, children[i], depth);

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

function get(point, octree, octant) {

	const children = octant.children;

	let result = null;

	let i, l;
	let points;

	if(octant.contains(point, octree.bias)) {

		if(children !== null) {

			for(i = 0, l = children.length; result === null && i < l; ++i) {

				result = get(point, octree, children[i]);

			}

		} else if(octant.points !== null) {

			points = octant.points;

			for(i = 0, l = points.length; result === null && i < l; ++i) {

				if(point.equals(points[i])) {

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

					if(point.equals(points[i])) {

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
			insert(position, result, octree, parent, depth - 1);

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
 * @return {Object} An object representing the nearest point or null if there is none.
 * @property {Vector3} point - The nearest point.
 * @property {Object} data - The data that belongs to the point.
 * @property {Number} distance - The distance to the given point.
 */

function findNearestPoint(point, maxDistance, skipSelf, octant) {

	let result = null;
	let bestDistance = maxDistance;
	let i, l;

	if(octant.children !== null) {

		// Sort the children: smallest distance to the point first, ASC.
		const sortedChildren = octant.children.map((child) => {

			// Precompute distances.
			return {
				octant: child,
				distance: child.distanceToCenterSquared(point)
			};

		}).sort((a, b) => a.distance - b.distance);

		let child, intermediateResult;

		// Traverse from closest to furthest.
		for(i = 0, l = sortedChildren.length; i < l; ++i) {

			child = sortedChildren[i].octant;

			if(child.contains(point, bestDistance)) {

				intermediateResult = findNearestPoint(point, bestDistance, skipSelf, child);

				if(intermediateResult !== null) {

					bestDistance = intermediateResult.distance;
					result = intermediateResult;

					if(bestDistance === 0.0) {

						break;

					}

				}

			}

		}

	} else if(octant.points !== null) {

		const points = octant.points;

		let index = -1;
		let distance;

		for(i = 0, l = points.length; i < l; ++i) {

			if(points[i].equals(point)) {

				if(!skipSelf) {

					bestDistance = 0.0;
					index = i;
					break;

				}

			} else {

				distance = point.distanceTo(points[i]);

				if(distance < bestDistance) {

					bestDistance = distance;
					index = i;

				}

			}

		}

		if(index >= 0) {

			result = {
				point: points[index],
				data: octant.data[index],
				distance: bestDistance
			};

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
 * @param {Array<Object>} result - An array to be filled with objects.
 * @property {Vector3} point - A point.
 * @property {Object} data - The data that belongs to the point.
 */

function findPoints(point, radius, skipSelf, octant, result) {

	const children = octant.children;

	let i, l;

	if(children !== null) {

		let child;

		for(i = 0, l = children.length; i < l; ++i) {

			child = children[i];

			if(child.contains(point, radius)) {

				findPoints(point, radius, skipSelf, child, result);

			}

		}

	} else if(octant.points !== null) {

		const points = octant.points;
		const rSq = radius * radius;

		let p;

		for(i = 0, l = points.length; i < l; ++i) {

			p = points[i];

			if(p.equals(point)) {

				if(!skipSelf) {

					result.push({
						point: p.clone(),
						data: octant.data[i]
					});

				}

			} else if(p.distanceToSquared(point) <= rSq) {

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

class PointOctree extends Octree {

	/**
	 * Constructs a new point octree.
	 *
	 * @param {Vector3} [min] - The lower bounds of the tree.
	 * @param {Vector3} [max] - The upper bounds of the tree.
	 * @param {Number} [bias=0.0] - An octant boundary bias. The octree is considered "loose" with a bias greater than 0.
	 * @param {Number} [maxPoints=8] - Number of distinct points per octant before it splits up.
	 * @param {Number} [maxDepth=8] - The maximum tree depth level, starting at 0.
	 */

	constructor(min, max, bias = 0.0, maxPoints = 8, maxDepth = 8) {

		super(new PointOctant(min, max));

		/**
		 * An octant boundary bias.
		 *
		 * @type {Number}
		 * @private
		 */

		this.bias = Math.max(0.0, bias);

		/**
		 * The number of points per octant before a split occurs.
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

	insert(point, data) {

		return insert(point, data, this, this.root, 0);

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

	get(point) {

		return get(point, this, this.root);

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
	 * @return {Object} An object representing the nearest point or null if there is none.
	 * @property {Vector3} point - The nearest point.
	 * @property {Object} data - The data that belongs to the point.
	 * @property {Number} distance - The distance to the given point.
	 */

	findNearestPoint(point, maxDistance = Infinity, skipSelf = false) {

		const result = findNearestPoint(point, maxDistance, skipSelf, this.root);

		if(result !== null) {

			result.point = result.point.clone();

		}

		return result;

	}

	/**
	 * Finds points that are in the specified radius around the given position.
	 *
	 * @param {Vector3} point - A position.
	 * @param {Number} radius - A radius.
	 * @param {Boolean} [skipSelf=false] - Whether a point that is exactly at the given position should be skipped.
	 * @return {Array<Object>} An array of objects.
	 * @property {Vector3} point - A point.
	 * @property {Object} data - The data that belongs to the point.
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

			testPoints(octants, raycaster, intersects);

		}

		return intersects;

	}

}

export { CubicOctant, Flags, Octant, Octree, OctreeIterator, OctreeRaycaster, PointOctant, PointOctree, RayPointIntersection, edges, findEntryOctant, findNextOctant, intersectOctree, layout, testPoints };
