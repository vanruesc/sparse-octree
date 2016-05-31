/**
 * sparse-octree v0.1.0 build Jun 01 2016
 * https://github.com/vanruesc/sparse-octree
 * Copyright 2016 Raoul van Rüschen, Zlib
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('three')) :
	typeof define === 'function' && define.amd ? define(['exports', 'three'], factory) :
	(factory((global.OCTREE = global.OCTREE || {}),global.THREE));
}(this, function (exports,THREE) { 'use strict';

	THREE = 'default' in THREE ? THREE['default'] : THREE;

	/**
	 * A collection of utility functions for octree raycasting.
	 *
	 * Based on:
	 *  "An Efficient Parametric Algorithm for Octree Traversal"
	 *  by J. Revelles et al. (2000).
	 *
	 * @class Raycasting
	 * @static
	 */

	/**
	 * Contains bytes used for bitwise operations. The last byte 
	 * is used to store raycasting flags.
	 *
	 * @property flags
	 * @type Uint8Array
	 * @static
	 * @final
	 */

	const flags = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 0]);

	/**
	 * A lookup-table containing octant ids. Used to determine 
	 * the exit plane from an octant.
	 *
	 * @property octantTable
	 * @type Array
	 * @private
	 * @static
	 * @final
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
	 * Determines the entry plane of the first octant that a 
	 * ray travels through.
	 *
	 * Determining the first octant requires knowing which of 
	 * the t0's is the largest. The tm's of the other axes must 
	 * also be compared against that largest t0.
	 *
	 * @method getFirstOctant
	 * @static
	 * @param {Number} tx0 - Ray projection parameter.
	 * @param {Number} ty0 - Ray projection parameter.
	 * @param {Number} tz0 - Ray projection parameter.
	 * @param {Number} txm - Ray projection parameter mean.
	 * @param {Number} tym - Ray projection parameter mean.
	 * @param {Number} tzm - Ray projection parameter mean.
	 * @return {Number} The index of the first octant that the ray travels through.
	 */

	function getFirstOctant(tx0, ty0, tz0, txm, tym, tzm) {

		let entry = 0;

		// Find the entry plane.
		if(tx0 > ty0 && tx0 > tz0) {

			// YZ-plane.
			if(tym < tx0) { entry = entry | 2; }
			if(tzm < tx0) { entry = entry | 1; }

		} else if(ty0 > tz0) {

			// XZ-plane.
			if(txm < ty0) { entry = entry | 4; }
			if(tzm < ty0) { entry = entry | 1; }

		} else {

			// XY-plane.
			if(txm < tz0) { entry = entry | 4; }
			if(tym < tz0) { entry = entry | 2; }

		}

		return entry;

	}

	/**
	 * Fetches the next octant for raycasting based on the exit 
	 * plane of the current one.
	 *
	 * @method getNextOctant
	 * @static
	 * @param {Number} currentOctant - The index of the current octant.
	 * @param {Number} tx1 - Ray projection parameter.
	 * @param {Number} ty1 - Ray projection parameter.
	 * @param {Number} tz1 - Ray projection parameter.
	 * @return {Number} The index of the next octant that the ray travels through.
	 */

	function getNextOctant(currentOctant, tx1, ty1, tz1) {

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
	 * Collects points that intersect with the ray.
	 *
	 * @method testPoints
	 * @static
	 * @param {Array} octants - An array containing octants that intersect with the ray.
	 * @param {Raycaster} raycaster - The raycaster.
	 * @param {Array} intersects - An array to be filled with the intersecting points.
	 */

	function testPoints(octants, raycaster, intersects) {

		const threshold = raycaster.params.Points.threshold;
		const thresholdSq = threshold * threshold;
		const p = new THREE.Vector3();

		let intersectPoint;
		let distance, distanceToRay;
		let rayPointDistanceSq;

		let i, j, il, jl;
		let octant, dataSet, data;

		for(i = 0, il = octants.length; i < il; ++i) {

			octant = octants[i];

			for(j = 0, jl = octant.totalPoints; j < jl; ++j) {

				p.fromArray(octant.points[j]);
				rayPointDistanceSq = raycaster.ray.distanceSqToPoint(p);

				if(rayPointDistanceSq < thresholdSq) {

					intersectPoint = raycaster.ray.closestPointToPoint(p);
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

	/**
	 * A computation helper.
	 *
	 * @property v
	 * @type Vector3
	 * @private
	 * @static
	 * @final
	 */

	const v = new THREE.Vector3();

	/**
	 * An octant.
	 *
	 * @class Octant
	 * @constructor
	 * @param {Vector3} min - The lower bounds.
	 * @param {Vector3} max - The upper bounds.
	 * @param {Number} level - The depth level.
	 */

	class Octant {

		constructor(min, max, level) {

			/**
			 * The lower bounds of this octant.
			 *
			 * @property min
			 * @type Vector3
			 * @final
			 */

			this.min = (min !== undefined) ? min: new THREE.Vector3();

			/**
			 * The upper bounds of the octant.
			 *
			 * @property max
			 * @type Vector3
			 * @final
			 */

			this.max = (max !== undefined) ? max: new THREE.Vector3();

			/**
			 * The depth level of this octant.
			 *
			 * @property level
			 * @type Number
			 * @final
			 */

			this.level = (level !== undefined) ? level: 0;

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

			/**
			 * The children of this node.
			 *
			 * @property children
			 * @type Array
			 */

			this.children = null;

		}

		/**
		 * Computes the center of this octant.
		 *
		 * @method center
		 * @return {Vector3} The center of this octant.
		 */

		center() {

			return v.addVectors(this.min, this.max).multiplyScalar(0.5);

		}

		/**
		 * Computes the size of this octant.
		 *
		 * @method size
		 * @return {Vector3} The size of this octant.
		 */

		size() {

			return v.subVectors(this.max, this.min);

		}

		/**
		 * Computes the distance squared from the center of this octant to 
		 * the given point.
		 *
		 * @method distanceToCenterSquared
		 * @param {Vector3} p - A point.
		 * @return {Number} The distance squared.
		 */

		distanceToCenterSquared(p) {

			const center = this.center(); // @todo: cache this.

			const dx = p.x - center.x;
			const dy = p.y - center.x;
			const dz = p.z - center.z;

			return dx * dx + dy * dy + dz * dz;

		}

		/**
		 * Checks if the given point lies inside this octant's boundaries.
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
		 * Collects leaf octants that lie inside the given frustum.
		 *
		 * @method cull
		 * @param {Frustum} frustum - A frustum.
		 * @param {Array} intersects - An array to be filled with the intersecting octants.
		 */

		cull(frustum, intersects) {

			let i, l;

			if(frustum.intersectsBox(this)) {

				if(this.children !== null) {

					for(i = 0, l = this.children.length; i < l; ++i) {

						this.children[i].cull(frustum, intersects);

					}

				} else {

					intersects.push(this);

				}

			}

		}

		/**
		 * Adds a given point to this node. If this octant isn't a leaf node, 
		 * the point will be added to a child octant.
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
			let halfSize;

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
					hit = (point[0] === p.x && point[1] === p.y && point[2] === p.z);

				}

				if(hit) {

					// Aggregate data of duplicates.
					if(data !== undefined) {

						this.dataSets[i - 1].add(data);

					}

				} else {

					unique = true;

					halfSize = this.size().multiplyScalar(0.5);

					if(this.totalPoints === Octant.maxPoints && this.level < Octant.maxDepth &&
						halfSize.x >= Octant.minSize.x && halfSize.y >= Octant.minSize.y && halfSize.z >= Octant.minSize.z) {

						// At maximum capacity and can still split.
						this.split();
						this.addToChild(p, data);

					} else {

						// Count distinct points in leaf nodes.
						this.totalPoints = this.points.push(p.toArray());
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
			let hit = false;

			let i, l;

			for(i = 0, l = this.children.length; !hit && i < l; ++i) {

				hit = this.children[i].containsPoint(p, Octant.bias);

				if(hit) {

					unique = this.children[i].add(p, data);

					if(unique) {

						// Register addition in parent node.
						++this.totalPoints;

					}

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

			const p = new THREE.Vector3();

			const min = this.min;
			const mid = this.center().clone();
			const max = this.max;

			const nextLevel = this.level + 1;

			let i, l;
			let index, data;

			/* The order is important for raycasting.
			 *
			 *    3____7
			 *  2/___6/|
			 *  | 1__|_5
			 *  0/___4/
			 *
			 */

			this.children = [
				new Octant(min, mid, nextLevel),
				new Octant(new THREE.Vector3(min.x, min.y, mid.z), new THREE.Vector3(mid.x, mid.y, max.z), nextLevel),
				new Octant(new THREE.Vector3(min.x, mid.y, min.z), new THREE.Vector3(mid.x, max.y, mid.z), nextLevel),
				new Octant(new THREE.Vector3(min.x, mid.y, mid.z), new THREE.Vector3(mid.x, max.y, max.z), nextLevel),
				new Octant(new THREE.Vector3(mid.x, min.y, min.z), new THREE.Vector3(max.x, mid.y, mid.z), nextLevel),
				new Octant(new THREE.Vector3(mid.x, min.y, mid.z), new THREE.Vector3(max.x, mid.y, max.z), nextLevel),
				new Octant(new THREE.Vector3(mid.x, mid.y, min.z), new THREE.Vector3(max.x, max.y, mid.z), nextLevel),
				new Octant(mid, max, nextLevel)
			];

			// Distribute existing points to the new children.
			i = this.totalPoints - 1;
			this.totalPoints = 0;

			while(i >= 0) {

				p.fromArray(this.points[i]);

				if(this.dataSets[i].size > 0) {

					// Unfold data aggregations. Each entry is one point.
					for(data of this.dataSets[i].values()) {

						this.addToChild(p, data);

					}

				} else {

					this.addToChild(p);

				}

				--i;

			}

			this.points = null;
			this.dataSets = null;

		}

		/**
		 * Removes the given point from this octant. If this octant is not a leaf node, 
		 * the point will be removed from a child node. If no data is provided, the point 
		 * and all its respective data entries will be removed completely.
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

				if(this.totalPoints <= Octant.maxPoints) {

					this.merge();

				}

			} else if(this.totalPoints > 0) {

				for(i = 0, l = this.totalPoints; dataSet === null && i < l; ++i) {

					point = points[i];

					if(point[0] === p.x && point[1] === p.y && point[2] === p.z) {

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
			let hit = false;

			let i, l;

			for(i = 0, l = this.children.length; !hit && i < l; ++i) {

				hit = this.children[i].containsPoint(p, Octant.bias);

				if(hit) {

					unique = this.children[i].remove(p, data);

					if(unique) {

						// Register deletion in parent node.
						--this.totalPoints;

					}

				}

			}

			return unique;

		}

		/**
		 * Gathers all points from the children. The children are 
		 * expected to be leaf nodes and will be dropped afterwards.
		 *
		 * @method merge
		 * @private
		 */

		merge() {

			let i, j, il, jl;
			let child, id1, id2;

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
		 * Refreshes this octant and its children to make sure that all 
		 * constraints are satisfied.
		 *
		 * @method update
		 */

		update() {

			const children = this.children;

			let i, l;
			let halfSize;

			if(children !== null) {

				// Start from the bottom.
				for(i = 0, l = children.length; i < l; ++i) {

					children[i].update();

				}

				halfSize = this.size().multiplyScalar(0.5);

				if(this.totalPoints <= Octant.maxPoints || this.level >= Octant.maxDepth ||
					halfSize.x < Octant.minSize.x || halfSize.y < Octant.minSize.y || halfSize.z < Octant.minSize.z) {

					// All points fit into one octant or the level is too high or the child octants are too small.
					this.merge();

				}

			} else if(this.totalPoints > Octant.maxPoints && this.level < Octant.maxDepth) {

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
			let hit = false;

			let i, l;

			if(this.containsPoint(p, Octant.bias)) {

				if(this.children !== null) {

					for(i = 0, l = this.children.length; result === null && i < l; ++i) {

						result = this.children[i].fetch(p);

					}

				} else {

					for(i = 0, l = this.totalPoints; !hit && i < l; ++i) {

						hit = (p.distanceToSquared(v.fromArray(this.points[i])) <= Octant.biasSquared);

						if(hit) {

							result = this.dataSets[i];

						}

					}

				}

			}

			return result;

		}

		/**
		 * Finds the closest point to the given one, excluding itself.
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
			let distSq;

			let sortedChildren;
			let child, childResult;

			// Only consider leaf nodes.
			if(children === null) {

				for(i = 0, l = this.totalPoints; i < l; ++i) {

					distSq = p.distanceToSquared(v.fromArray(points[i]));

					if((!skipSelf || distSq > 0.0) && distSq <= bestDist) {

						bestDist = distSq;

						result = {
							point: v.clone(),
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
			let distSq;
			let child;

			// Only consider leaf nodes.
			if(children === null) {

				for(i = 0, l = this.totalPoints; i < l; ++i) {

					distSq = p.distanceToSquared(v.fromArray(points[i]));

					if((!skipSelf || distSq > 0.0) && distSq <= rSq) {

						result.push({
							point: v.clone(),
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

		/**
		 * Fetches all octants with the specified level.
		 *
		 * @method getOctantsByLevel
		 * @param {Number} level - The depth level.
		 * @param {Array} result - An array to be filled with octants. Empty octants will be excluded.
		 */

		getOctantsByLevel(level, result) {

			let i, l;

			if(this.level === level) {

				if(this.totalPoints > 0 || this.children !== null) {

					result.push(this);

				}

			} else if(this.children !== null) {

				for(i = 0, l = this.children.length; i < l; ++i) {

					this.children[i].getOctantsByLevel(level, result);

				}

			}

		}

		/**
		 * Finds the current tree depth recursively.
		 *
		 * @method getDepth
		 * @return {Number} The depth.
		 */

		getDepth() {

			let result = 0;
			let depth;
			let i, l;

			if(this.children !== null) {

				for(i = 0, l = this.children.length; i < l; ++i) {

					depth = 1 + this.children[i].getDepth();

					if(depth > result) {

						result = depth;

					}

				}

			}

			return result;

		}

		/**
		 * Finds all octants that intersect with the given ray.
		 *
		 * @method raycast
		 * @param {Number} tx0 - Ray projection parameter. Initial tx0 = (minX - rayOriginX) / rayDirectionX.
		 * @param {Number} ty0 - Ray projection parameter. Initial ty0 = (minY - rayOriginY) / rayDirectionY.
		 * @param {Number} tz0 - Ray projection parameter. Initial tz0 = (minZ - rayOriginZ) / rayDirectionZ.
		 * @param {Number} tx1 - Ray projection parameter. Initial tx1 = (maxX - rayOriginX) / rayDirectionX.
		 * @param {Number} ty1 - Ray projection parameter. Initial ty1 = (maxY - rayOriginY) / rayDirectionY.
		 * @param {Number} tz1 - Ray projection parameter. Initial tz1 = (maxZ - rayOriginZ) / rayDirectionZ.
		 * @param {Raycaster} raycaster - The raycaster.
		 * @param {Array} intersects - An array to be filled with the intersecting octants.
		 */

		raycast(tx0, ty0, tz0, tx1, ty1, tz1, raycaster, intersects) {

			const children = this.children;

			let currentOctant;
			let txm, tym, tzm;

			if(tx1 >= 0.0 && ty1 >= 0.0 && tz1 >= 0.0) {

				if(children === null) {

					// Leaf.
					if(this.totalPoints > 0) {

						intersects.push(this);

					}

				} else {

					// Compute means.
					txm = 0.5 * (tx0 + tx1);
					tym = 0.5 * (ty0 + ty1);
					tzm = 0.5 * (tz0 + tz1);

					currentOctant = getFirstOctant(tx0, ty0, tz0, txm, tym, tzm);

					do {

						/* The possibilities for the next node are passed in the same respective order as the t-values.
						 * Hence, if the first parameter is found as the greatest, the fourth one will be returned.
						 * If the 2nd parameter is the greatest, the 5th will be returned, etc.
						 */

						switch(currentOctant) {

							case 0:
								children[flags[8]].raycast(tx0, ty0, tz0, txm, tym, tzm, raycaster, intersects);
								currentOctant = getNextOctant(currentOctant, txm, tym, tzm);
								break;

							case 1:
								children[flags[8] ^ flags[1]].raycast(tx0, ty0, tzm, txm, tym, tz1, raycaster, intersects);
								currentOctant = getNextOctant(currentOctant, txm, tym, tz1);
								break;

							case 2:
								children[flags[8] ^ flags[2]].raycast(tx0, tym, tz0, txm, ty1, tzm, raycaster, intersects);
								currentOctant = getNextOctant(currentOctant, txm, ty1, tzm);
								break;

							case 3:
								children[flags[8] ^ flags[3]].raycast(tx0, tym, tzm, txm, ty1, tz1, raycaster, intersects);
								currentOctant = getNextOctant(currentOctant, txm, ty1, tz1);
								break;

							case 4:
								children[flags[8] ^ flags[4]].raycast(txm, ty0, tz0, tx1, tym, tzm, raycaster, intersects);
								currentOctant = getNextOctant(currentOctant, tx1, tym, tzm);
								break;

							case 5:
								children[flags[8] ^ flags[5]].raycast(txm, ty0, tzm, tx1, tym, tz1, raycaster, intersects);
								currentOctant = getNextOctant(currentOctant, tx1, tym, tz1);
								break;

							case 6:
								children[flags[8] ^ flags[6]].raycast(txm, tym, tz0, tx1, ty1, tzm, raycaster, intersects);
								currentOctant = getNextOctant(currentOctant, tx1, ty1, tzm);
								break;

							case 7:
								children[flags[8] ^ flags[7]].raycast(txm, tym, tzm, tx1, ty1, tz1, raycaster, intersects);
								// Far top right octant. No other octants can be reached from here.
								currentOctant = 8;
								break;

						}

					} while(currentOctant < 8);

				}

			}

		}

	}

	/**
	 * A threshold for proximity checks.
	 *
	 * @property bias
	 * @type Number
	 * @static
	 * @default 0.0
	 */

	Octant.bias = 0.0;

	/**
	 * The proximity threshold squared.
	 *
	 * @property biasSquared
	 * @type Number
	 * @static
	 * @default 0.0
	 */

	Octant.biasSquared = 0.0;

	/**
	 * The maximum tree depth level.
	 *
	 * @property maxDepth
	 * @type Number
	 * @static
	 * @default 8
	 */

	Octant.maxDepth = 8;

	/**
	 * Number of points per octant before a split occurs.
	 *
	 * @property maxPoints
	 * @type Number
	 * @static
	 * @default 8
	 */

	Octant.maxPoints = 8;

	/**
	 * The minimum size of an octant.
	 *
	 * @property minSize
	 * @type Vector3
	 * @static
	 * @default Vector3(1e-12, 1e-12, 1e-12)
	 */

	Octant.minSize = new THREE.Vector3(1e-12, 1e-12, 1e-12);

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

	class Octree extends THREE.Object3D {

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
		 * @param {Array} containsPoint - An array to be filled with the intersecting points.
		 */

		raycast(raycaster, containsPoint) {

			const octants = [];

			this.raycastOctants(raycaster, octants);

			if(octants.length > 0) {

				// Collect intersecting points.
				testPoints(octants, raycaster, containsPoint);

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

	/**
	 * An octree helper.
	 *
	 * @class OctreeHelper
	 * @constructor
	 * @extends Object3D
	 * @param {Octree} tree - The octree to visualise.
	 */

	class OctreeHelper extends THREE.Object3D {

		constructor(tree) {

			super();

			this.name = "OctreeHelper";

			/**
			 * The octree.
			 *
			 * @property tree
			 * @type Octree
			 */

			this.tree = (tree !== undefined) ? tree : null;

			this.update();

		}

		/**
		 * Updates the helper geometry.
		 *
		 * @method update
		 */

		update() {

			const vertexMap = new Map();
			const depth = (this.tree !== null) ? this.tree.getDepth() : -1;

			const connections = [
				/* 0 */ [1, 4],
				/* 1 */ [2, 5],
				/* 2 */ [3, 6],
				/* 3 */ [0, 7],
				/* 4 */ [5],
				/* 5 */ [6],
				/* 6 */ [7],
				/* 7 */ [4]
			];

			let i, j, k, il, kl;
			let octants, octant;

			let vertices, v, c;
			let entry, key;

			let geometry, lineSegments, material;

			let indexCount;
			let indices = null;
			let positions = null;

			let level = 0;

			// Remove existing geometry.
			for(i = 0, il = this.children.length; i < il; ++i) {

				this.children[i].geometry.dispose();
				this.children[i].material.dispose();

			}

			while(this.children.length > 0) {

				this.remove(this.children[0]);

			}

			while(level <= depth) {

				octants = this.tree.getOctantsByLevel(level);

				indexCount = 0;
				vertexMap.clear();

				for(i = 0, j = 0, il = octants.length; i < il; ++i) {

					octant = octants[i];

					vertices = [
						/* 0 */ [octant.max.x, octant.max.y, octant.max.z],
						/* 1 */ [octant.min.x, octant.max.y, octant.max.z],
						/* 2 */ [octant.min.x, octant.min.y, octant.max.z],
						/* 3 */ [octant.max.x, octant.min.y, octant.max.z],
						/* 4 */ [octant.max.x, octant.max.y, octant.min.z],
						/* 5 */ [octant.min.x, octant.max.y, octant.min.z],
						/* 6 */ [octant.min.x, octant.min.y, octant.min.z],
						/* 7 */ [octant.max.x, octant.min.y, octant.min.z]
					];

					// Update the vertex map.
					for(j = 0; j < 8; ++j) {

						v = vertices[j];
						c = connections[j];

						key = v.toString();
						entry = vertexMap.get(key);

						// Prevent duplicates.
						if(entry !== undefined) {

							// Adopt unique connections.
							for(k = 0, kl = c.length; k < kl; ++k) {

								key = vertices[c[k]].toString();

								if(entry.connectionKeys.indexOf(key) < 0) {

									entry.connectionKeys.push(key);
									++indexCount;

								}

							}

						} else {

							// No duplicate, create new entry.
							entry = {
								position: v,
								connectionKeys: [],
								index: vertexMap.size
							};

							for(k = 0, kl = c.length; k < kl; ++k) {

								entry.connectionKeys.push(vertices[c[k]].toString());
								++indexCount;

							}

							vertexMap.set(key, entry);

						}

					}

				}

				//console.log("level:", level, "vertices:", vertexMap.size, "ids:", indexCount * 2);

				// Create the geometry for this level.
				if(vertexMap.size < 65536) {

					indices = new Uint16Array(indexCount * 2);
					positions = new Float32Array(vertexMap.size * 3);

					i = 0; j = 0;

					for(entry of vertexMap.values()) {

						v = entry.position;

						positions[i++] = v[0];
						positions[i++] = v[1];
						positions[i++] = v[2];

						c = entry.connectionKeys;

						// Add the index pairs that describe the lines.
						for(k = 0, kl = c.length; k < kl; ++k) {

							indices[j++] = entry.index;
							indices[j++] = vertexMap.get(c[k]).index;

						}

					}

					geometry = new THREE.BufferGeometry();
					geometry.setIndex(new THREE.BufferAttribute(indices, 1));
					geometry.addAttribute("position", new THREE.BufferAttribute(positions, 3));

					material = new THREE.LineBasicMaterial({color: new THREE.Color(0xffffff * Math.random())});
					lineSegments = new THREE.LineSegments(geometry, material);

					this.add(lineSegments);

				} else {

					console.warn("Could not create geometry for Octree depth level", level, "(vertex count of", vertexMap.size, "exceeds limit of 65536)");

				}

				++level;

			}

		}

	}

	exports.Octree = Octree;
	exports.Octant = Octant;
	exports.OctreeHelper = OctreeHelper;

}));