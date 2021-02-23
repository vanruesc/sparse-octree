import { Raycaster, Vector3 } from "three";
import { Octree } from "../core/Octree";
import { RayPointIntersection } from "../raycasting/points/RayPointIntersection";
import { testPoints } from "../raycasting/points/testPoints";
import { NearestPoint } from "./NearestPoint";
import { Point } from "./Point";
import { PointData } from "./PointData";
import { PointOctant } from "./PointOctant";

/**
 * Recursively counts the points that are in the given octant.
 *
 * @param octant - An octant.
 * @return The amount of points.
 */

function countPoints<T>(octant: PointOctant<T>): number {

	const children = octant.children;
	let result = 0;

	if(children !== null) {

		for(let i = 0, l = children.length; i < l; ++i) {

			result += countPoints(children[i] as PointOctant<T>);

		}

	} else if(octant.data !== null) {

		const pointData = octant.data as PointData<T>;
		result = pointData.points.length;

	}

	return result;

}

/**
 * Recursively inserts a point into the octree.
 *
 * @param point - A point.
 * @param data - The data that belongs to the point.
 * @param octree - The octree.
 * @param octant - The current octant.
 * @param depth - The current depth.
 * @return Whether the operation was successful.
 */

function insert<T>(point: Vector3, data: T, octree: PointOctree,
	octant: PointOctant<T>, depth: number): boolean {

	let children = octant.children;
	let exists = false;
	let done = false;

	if(octant.contains(point, octree.bias)) {

		if(children === null) {

			let index = 0;

			if(octant.data === null) {

				octant.data = new PointData<T>();

			} else {

				const pointData = octant.data as PointData<T>;
				const points = pointData.points;

				for(let i = 0, l = points.length; !exists && i < l; ++i) {

					exists = points[i].equals(point);
					index = i;

				}

			}

			const pointData = octant.data as PointData<T>;

			if(exists) {

				pointData.data[index - 1] = data;
				done = true;

			} else if(pointData.points.length < octree.maxPoints || depth === octree.maxDepth) {

				pointData.points.push(point.clone());
				pointData.data.push(data);
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

			for(let i = 0, l = children.length; !done && i < l; ++i) {

				done = insert(point, data, octree, children[i] as PointOctant<T>, depth);

			}

		}

	}

	return done;

}

/**
 * Recursively finds a point in the octree and removes it.
 *
 * @param point - A point.
 * @param octree - The octree.
 * @param octant - The current octant.
 * @param parent - The parent of the current octant.
 * @return The data entry of the removed point or null if it didn't exist.
 */

function remove<T>(point: Vector3, octree: PointOctree, octant: PointOctant<T>,
	parent: PointOctant<T>): T {

	const children = octant.children;
	let result = null;

	if(octant.contains(point, octree.bias)) {

		if(children !== null) {

			for(let i = 0, l = children.length; result === null && i < l; ++i) {

				result = remove(point, octree, children[i] as PointOctant<T>, octant);

			}

		} else if(octant.points !== null) {

			const pointData = octant.data as PointData<T>;
			const points = pointData.points;
			const data = pointData.data;

			for(let i = 0, l = points.length; i < l; ++i) {

				if(points[i].equals(point)) {

					const last = l - 1;
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
 * @param point - A point.
 * @param octree - The octree.
 * @param octant - The current octant octant.
 * @return The data entry that is associated with the given point or null if it doesn't exist.
 */

function get<T>(point: Vector3, octree: PointOctree, octant: PointOctant<T>): T {

	const children = octant.children;
	let result = null;

	if(octant.contains(point, octree.bias)) {

		if(children !== null) {

			for(let i = 0, l = children.length; result === null && i < l; ++i) {

				result = get(point, octree, children[i] as PointOctant<T>);

			}

		} else if(octant.points !== null) {

			const pointData = octant.data as PointData<T>;
			const points = pointData.points;
			const data = pointData.data;

			for(let i = 0, l = points.length; result === null && i < l; ++i) {

				if(point.equals(points[i])) {

					result = data[i];

				}

			}

		}

	}

	return result;

}

/**
 * Recursively moves an existing point to a new position.
 *
 * @param point - The point.
 * @param position - The new position.
 * @param octree - The octree.
 * @param octant - The current octant.
 * @param parent - The parent of the current octant.
 * @param depth - The current depth.
 * @return The data entry of the updated point or null if it didn't exist.
 */

function move<T>(point: Vector3, position: Vector3, octree: PointOctree,
	octant: PointOctant<T>, parent: PointOctant<T>, depth: number): T {

	const children = octant.children;
	let result = null;

	if(octant.contains(point, octree.bias)) {

		if(octant.contains(position, octree.bias)) {

			// The point and the new position both fall into the current octant.
			if(children !== null) {

				++depth;

				for(let i = 0, l = children.length; result === null && i < l; ++i) {

					result = move(point, position, octree, children[i] as PointOctant<T>, octant, depth);

				}

			} else if(octant.points !== null) {

				// No divergence - the point can be updated in place.
				const pointData = octant.data as PointData<T>;
				const points = pointData.points;
				const data = pointData.data;

				for(let i = 0, l = points.length; i < l; ++i) {

					if(point.equals(points[i])) {

						// The point exists! Update its position.
						points[i].copy(position);
						result = data[i];

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
 * @param point - The point.
 * @param maxDistance - The maximum distance.
 * @param skipSelf - Whether a point that is exactly at the given position should be skipped.
 * @param octant - The current octant.
 * @return An object that represents the nearest point, or null if there is none.
 */

function findNearestPoint<T>(point: Vector3, maxDistance: number,
	skipSelf: boolean, octant: PointOctant<T>): NearestPoint {

	let result = null;
	let bestDistance = maxDistance;

	if(octant.children !== null) {

		// Sort the children: smallest distance to the point first, ASC.
		const sortedChildren: { octant: PointOctant<T>, distance: number }[] = octant.children.map((child) => {

			const octant = child as PointOctant<T>;

			// Precompute distances.
			return {
				octant,
				distance: octant.distanceToCenterSquared(point)
			};

		}).sort((a, b) => a.distance - b.distance);

		// Traverse from closest to furthest.
		for(let i = 0, l = sortedChildren.length; i < l; ++i) {

			const child = sortedChildren[i].octant;

			if(child.contains(point, bestDistance)) {

				const intermediateResult = findNearestPoint(point, bestDistance, skipSelf, child);

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

		const pointData = octant.data as PointData<T>;
		const points = pointData.points;
		const data = pointData.data;

		let index = -1;

		for(let i = 0, l = points.length; i < l; ++i) {

			if(points[i].equals(point)) {

				if(!skipSelf) {

					bestDistance = 0.0;
					index = i;
					break;

				}

			} else {

				const distance = point.distanceTo(points[i]);

				if(distance < bestDistance) {

					bestDistance = distance;
					index = i;

				}

			}

		}

		if(index >= 0) {

			result = new NearestPoint(points[index], data[index], bestDistance);

		}

	}

	return result;

}

/**
 * Recursively finds points that are inside the specified radius around a given
 * position.
 *
 * @param point - A position.
 * @param radius - A radius.
 * @param skipSelf - Whether a point that is exactly at the given position should be skipped.
 * @param octant - The current octant.
 * @param result - An array to be filled with objects.
 */

function findPoints<T>(point: Vector3, radius: number, skipSelf: boolean,
	octant: PointOctant<T>, result: Point[]): Point[] {

	const children = octant.children;

	if(children !== null) {

		for(let i = 0, l = children.length; i < l; ++i) {

			const child = children[i] as PointOctant<T>;

			if(child.contains(point, radius)) {

				findPoints(point, radius, skipSelf, child, result);

			}

		}

	} else if(octant.points !== null) {

		const pointData = octant.data as PointData<T>;
		const points = pointData.points;
		const data = pointData.data;
		const rSq = radius * radius;

		for(let i = 0, l = points.length; i < l; ++i) {

			const p = points[i];

			if((p.equals(point) && !skipSelf) || p.distanceToSquared(point) <= rSq) {

				result.push(new Point(p.clone(), data[i]));

			}

		}

	}

}

/**
 * An octree that manages points.
 */

export class PointOctree<T> extends Octree<PointData<T>> {

	/**
	 * An octant boundary bias.
	 */

	private bias: number;

	/**
	 * The number of points per octant before a split occurs.
	 *
	 * This value works together with the maximum depth as a secondary limiting
	 * factor. Smaller values cause splits to occur earlier which results in a
	 * faster and deeper tree growth.
	 */

	private maxPoints: number;

	/**
	 * The maximum tree depth level.
	 *
	 * It's possible to use Infinity, but keep in mind that allowing infinitely
	 * small octants can have a severely negative impact on performance.
	 * Finding a value that works best for a specific scene is advisable.
	 */

	private maxDepth: number;

	/**
	 * The amount of points that are currently in this octree.
	 */

	pointCount: number;

	/**
	 * Constructs a new point octree.
	 *
	 * @param min - The lower bounds of the tree.
	 * @param max - The upper bounds of the tree.
	 * @param bias - An octant boundary bias. The octree is considered "loose" with a bias greater than 0.
	 * @param maxPoints - Number of distinct points per octant before it splits up.
	 * @param maxDepth - The maximum tree depth level, starting at 0.
	 */

	constructor(min: Vector3, max: Vector3, bias = 0.0, maxPoints = 8, maxDepth = 8) {

		super(new PointOctant<T>(min, max));

		this.bias = Math.max(0.0, bias);
		this.maxPoints = Math.max(1, Math.round(maxPoints));
		this.maxDepth = Math.max(0, Math.round(maxDepth));
		this.pointCount = 0;

	}

	/**
	 * Counts the points in the given octant.
	 *
	 * @param octant - An octant.
	 * @return The amount of points.
	 */

	countPoints(octant: PointOctant<T>): number {

		return countPoints(octant);

	}

	/**
	 * Puts a point into the octree.
	 *
	 * @param point - A point. If it's already in the octree, the data entry will be updated.
	 * @param data - A data object that belongs to the point.
	 * @return Whether the operation was successful.
	 */

	insert(point: Vector3, data: T): boolean {

		return insert(point, data, this, this.root, 0);

	}

	/**
	 * Removes a point from the tree.
	 *
	 * @param point - A point.
	 * @return The data entry of the removed point or null if it didn't exist.
	 */

	remove(point: Vector3): T {

		return remove(point, this, this.root, null);

	}

	/**
	 * Retrieves the data of the specified point.
	 *
	 * @param point - A position.
	 * @return The data entry that is associated with the given point or null if it doesn't exist.
	 */

	get(point: Vector3): T {

		return get(point, this, this.root);

	}

	/**
	 * Moves an existing point to a new position. Has no effect if the point
	 * doesn't exist.
	 *
	 * @param point - The point.
	 * @param position - The new position.
	 * @return The data entry of the updated point or null if it didn't exist.
	 */

	move(point: Vector3, position: Vector3): T {

		return move(point, position, this, this.root, null, 0);

	}

	/**
	 * Finds the closest point to the given one.
	 *
	 * @param point - A point.
	 * @param maxDistance - An upper limit for the distance between the points.
	 * @param skipSelf - Whether a point that is exactly at the given position should be skipped.
	 * @return An object representing the nearest point or null if there is none.
	 */

	findNearestPoint(point: Vector3, maxDistance = Number.POSITIVE_INFINITY, skipSelf = false): NearestPoint {

		const result = findNearestPoint(point, maxDistance, skipSelf, this.root as PointOctant<T>);

		if(result !== null) {

			result.point = result.point.clone();

		}

		return result;

	}

	/**
	 * Finds points that are in the specified radius around the given position.
	 *
	 * @param point - A position.
	 * @param radius - A radius.
	 * @param skipSelf - Whether a point that is exactly at the given position should be skipped.
	 * @return An array of objects.
	 */

	findPoints(point: Vector3, radius: number, skipSelf = false): Point[] {

		const result: Point[] = [];
		findPoints(point, radius, skipSelf, this.root, result);
		return result;

	}

	/**
	 * Finds the points that intersect with the given ray.
	 *
	 * @param raycaster - The raycaster.
	 * @param intersects - An array to be filled with the intersecting points.
	 * @return The intersecting points.
	 */

	raycast(raycaster: Raycaster, intersects: RayPointIntersection<T>[] = []): RayPointIntersection<T>[] {

		const octants = super.raycast(raycaster) as PointOctant<T>[];

		if(octants.length > 0) {

			testPoints(octants, raycaster, intersects);

		}

		return intersects;

	}

}
