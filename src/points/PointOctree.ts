import { Raycaster, Vector3 } from "three";
import { Octree } from "../core/Octree.js";
import { PointContainer } from "./PointContainer.js";
import { PointData } from "./PointData.js";
import { PointOctant } from "./PointOctant.js";
import { RayPointIntersection } from "./RayPointIntersection.js";

/**
 * A Symbol that indicates a lookup miss.
 *
 * @remarks Using a Symbol instead of `null` or `undefined` to support these values as user data.
 */

const NOT_FOUND = Symbol("NOT_FOUND");

/**
 * Removes a point and its data by replacing them with the last entry.
 *
 * @param pointData - The point collection.
 * @param index - The index of the entry to remove.
 */

function swapAndPop<T>(pointData: PointData<T>, index: number): void {

	const points = pointData.points;
	const data = pointData.data;
	const last = points.length - 1;

	if(index < last) {

		points[index] = points[last];
		data[index] = data[last];

	}

	points.pop();
	data.pop();

}

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

		const pointData = octant.data;
		result = pointData.points.length;

	}

	return result;

}

/**
 * Recursively adds a point to the octree.
 *
 * @param point - A point.
 * @param data - The data that belongs to the point.
 * @param octree - The octree.
 * @param octant - The current octant.
 * @param depth - The current depth.
 * @return Whether the operation was successful.
 */

function set<T>(point: Vector3, data: T, octree: PointOctree<T>, octant: PointOctant<T> | null,
	depth: number): boolean {

	if(octant === null || !octant.contains(point, octree.getBias())) {

		return false;

	}

	let children = octant.children;

	if(children === null) {

		const pointData = octant.data ??= new PointData<T>();
		const points = pointData.points;

		for(let i = 0, l = points.length; i < l; ++i) {

			if(points[i].equals(point)) {

				pointData.data[i] = data;
				return true;

			}

		}

		if(points.length < octree.getMaxPoints() || depth === octree.getMaxDepth()) {

			points.push(point.clone());
			pointData.data.push(data);
			return true;

		}

		octant.split();
		octant.redistribute(octree.getBias());
		children = octant.children;

	}

	++depth;

	for(let i = 0, l = children!.length; i < l; ++i) {

		if(set(point, data, octree, children![i] as PointOctant<T>, depth)) {

			return true;

		}

	}

	return false;

}

/**
 * Recursively finds a point in the octree and removes it.
 *
 * @param point - A point.
 * @param octree - The octree.
 * @param octant - The current octant.
 * @param parent - The parent of the current octant.
 * @return The data entry of the removed point, or NOT_FOUND if it didn't exist.
 */

function remove<T>(point: Vector3, octree: PointOctree<T>, octant: PointOctant<T>,
	parent: PointOctant<T> | null): T | typeof NOT_FOUND {

	const children = octant.children;
	let result: T | typeof NOT_FOUND = NOT_FOUND;

	if(!octant.contains(point, octree.getBias())) {

		return NOT_FOUND;

	}

	if(children !== null) {

		for(let i = 0, l = children.length; result === NOT_FOUND && i < l; ++i) {

			result = remove(point, octree, children[i] as PointOctant<T>, octant);

		}

	} else if(octant.data !== null) {

		const pointData = octant.data;
		const points = pointData.points;
		const data = pointData.data;

		for(let i = 0, l = points.length; i < l; ++i) {

			if(points[i].equals(point)) {

				result = data[i];
				swapAndPop(pointData, i);

				if(parent !== null && countPoints(parent) <= octree.getMaxPoints()) {

					parent.merge();

				}

				return result;

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
 * @return The data entry that is associated with the given point, or NOT_FOUND if it doesn't exist.
 */

function get<T>(point: Vector3, octree: PointOctree<T>, octant: PointOctant<T>): T | typeof NOT_FOUND {

	const children = octant.children;
	let result: T | typeof NOT_FOUND = NOT_FOUND;

	if(octant.contains(point, octree.getBias())) {

		if(children !== null) {

			for(let i = 0, l = children.length; result === NOT_FOUND && i < l; ++i) {

				result = get(point, octree, children[i] as PointOctant<T>);

			}

		} else if(octant.data !== null) {

			const pointData = octant.data;
			const points = pointData.points;
			const data = pointData.data;

			for(let i = 0, l = points.length; result === NOT_FOUND && i < l; ++i) {

				if(points[i].equals(point)) {

					result = data[i];

				}

			}

		}

	}

	return result;

}

/**
 * Moves a point within a leaf's point collection, replacing any point at the destination.
 *
 * @param point - The point.
 * @param position - The new position.
 * @param pointData - The point collection.
 * @return The data entry of the updated point, or NOT_FOUND if it didn't exist.
 */

function movePoint<T>(point: Vector3, position: Vector3, pointData: PointData<T>): T | typeof NOT_FOUND {

	const points = pointData.points;
	const data = pointData.data;
	let result: T | typeof NOT_FOUND = NOT_FOUND;

	let sourceIndex = -1;
	let destinationIndex = -1;

	for(let i = 0, l = points.length; i < l; ++i) {

		if(sourceIndex === -1 && points[i].equals(point)) {

			// Found the point.
			sourceIndex = i;

		}

		if(destinationIndex === -1 && points[i].equals(position)) {

			// Found another point at the destination.
			destinationIndex = i;

		}

	}

	if(sourceIndex !== -1) {

		// The point exists; update its position.
		points[sourceIndex].copy(position);
		result = data[sourceIndex];

		if(destinationIndex !== -1) {

			// There was another point at the destination; remove it.
			swapAndPop(pointData, destinationIndex);

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
 * @return The data entry of the updated point, or NOT_FOUND if it didn't exist.
 */

function move<T>(point: Vector3, position: Vector3, octree: PointOctree<T>,
	octant: PointOctant<T>, parent: PointOctant<T> | null, depth: number): T | typeof NOT_FOUND {

	if(point.equals(position)) {

		return get(point, octree, octant);

	}

	const children = octant.children;
	const bias = octree.getBias();
	let result: T | typeof NOT_FOUND = NOT_FOUND;

	if(!octant.contains(point, bias)) {

		return NOT_FOUND;

	}

	if(!octant.contains(position, bias)) {

		// Retrieve the point and remove it.
		result = remove(point, octree, octant, parent);

		if(result !== NOT_FOUND) {

			// Go back to the parent octant and add the updated point.
			set(position, result, octree, parent, depth - 1);

		}

		return result;

	}

	// The point and the new position both fall into the current octant.
	if(children !== null) {

		let source: PointOctant<T> | null = null;
		let destination: PointOctant<T> | null = null;

		// Match set() and redistribute(): the first containing child owns the point.
		for(let i = 0, l = children.length; (source === null || destination === null) && i < l; ++i) {

			const child = children[i] as PointOctant<T>;

			if(source === null && child.contains(point, bias)) {

				source = child;

			}

			if(destination === null && child.contains(position, bias)) {

				destination = child;

			}

		}

		if(source !== null) {

			if(source === destination) {

				return move(point, position, octree, source, octant, depth + 1);

			}

			result = remove(point, octree, source, octant);

			if(result !== NOT_FOUND) {

				// The paths diverge here. Removal may merge children, so reinsert via this octant.
				set(position, result, octree, octant, depth);

			}

		}

	} else if(octant.data !== null) {

		result = movePoint(point, position, octant.data);

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
 * @return The nearest point, or null if there is none.
 */

function findNearestPoint<T>(point: Vector3, maxDistance: number,
	skipSelf: boolean, octant: PointOctant<T>): PointContainer<T> | null {

	interface SortableOctant<T> {

		octant: PointOctant<T>;
		distance: number;

	}

	let result = null;
	let bestDistance = maxDistance;

	if(octant.children !== null) {

		// Sort the children: smallest distance to the point first, ASC.
		const sortedChildren: SortableOctant<T>[] = octant.children.map((child) => {

			// Precompute distances.
			const octant = child as PointOctant<T>;

			return {
				distance: octant.distanceToCenterSquared(point),
				octant
			};

		}).sort((a, b) => a.distance - b.distance);

		// Traverse from closest to furthest.
		for(let i = 0, l = sortedChildren.length; i < l; ++i) {

			const child = sortedChildren[i].octant;

			if(child.contains(point, bestDistance)) {

				const intermediateResult = findNearestPoint(
					point, bestDistance, skipSelf, child
				);

				if(intermediateResult !== null) {

					bestDistance = intermediateResult.distance;
					result = intermediateResult;

					if(bestDistance === 0.0) {

						break;

					}

				}

			}

		}

	} else if(octant.data !== null) {

		const pointData = octant.data;
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

			result = new PointContainer(points[index], data[index], bestDistance);

		}

	}

	return result;

}

/**
 * Recursively finds points within a specific radius around a given point.
 *
 * @param point - The point.
 * @param radius - The radius.
 * @param skipSelf - Whether a point that is exactly at the given position should be skipped.
 * @param octant - The current octant.
 * @param result - An array to be filled with points.
 */

function findPoints<T>(point: Vector3, radius: number, skipSelf: boolean,
	octant: PointOctant<T>, result: PointContainer<T>[]): void {

	const children = octant.children;

	if(children !== null) {

		for(let i = 0, l = children.length; i < l; ++i) {

			const child = children[i] as PointOctant<T>;

			if(child.contains(point, radius)) {

				findPoints(point, radius, skipSelf, child, result);

			}

		}

	} else if(octant.data !== null) {

		const pointData = octant.data;
		const points = pointData.points;
		const data = pointData.data;

		for(let i = 0, l = points.length; i < l; ++i) {

			const p = points[i];

			if(p.equals(point)) {

				if(!skipSelf) {

					result.push(new PointContainer(p.clone(), data[i], 0.0));

				}

			} else {

				const rSq = radius * radius;
				const dSq = p.distanceToSquared(point);

				if(dSq <= rSq) {

					result.push(new PointContainer(p.clone(), data[i], Math.sqrt(dSq)));

				}

			}

		}

	}

}

/**
 * An octree that manages points.
 *
 * @param T - The type of the data.
 */

export class PointOctree<T = unknown> extends Octree<PointOctant<T>> {

	/**
	 * An octant boundary bias.
	 */

	private bias: number;

	/**
	 * The number of points per octant before a split occurs.
	 *
	 * This value works together with the maximum depth as a secondary limiting factor. Smaller values cause splits to
	 * occur earlier which results in a faster and deeper tree growth.
	 */

	private maxPoints: number;

	/**
	 * The maximum tree depth level.
	 *
	 * Infinity is a valid value, but allowing infinitely small octants can result in poor performance.
	 */

	private maxDepth: number;

	/**
	 * Constructs a new point octree.
	 *
	 * @param min - The lower bounds of the tree.
	 * @param max - The upper bounds of the tree.
	 * @param bias - An octant boundary bias. The octree is considered "loose" with a bias greater than 0.
	 * @param maxPoints - The maximum amount of distinct points per leaf octant.
	 * @param maxDepth - The maximum tree depth level, starting at 0.
	 */

	constructor(min: Vector3, max: Vector3, bias = 0.0, maxPoints = 8, maxDepth = 8) {

		super(new PointOctant<T>(min, max));

		this.bias = Math.max(0.0, bias);
		this.maxPoints = Math.max(1, Math.round(maxPoints));
		this.maxDepth = Math.max(0, Math.round(maxDepth));

	}

	/**
	 * Returns the octree bias.
	 *
	 * @return The bias.
	 */

	getBias(): number {

		return this.bias;

	}

	/**
	 * Returns the maximum amount of points per leaf octant.
	 *
	 * @return The maximum amount of points per leaf octant.
	 */

	getMaxPoints(): number {

		return this.maxPoints;

	}

	/**
	 * Returns the maximum tree depth.
	 *
	 * @return The maximum tree depth.
	 */

	getMaxDepth(): number {

		return this.maxDepth;

	}

	/**
	 * Counts the points in the given octant.
	 *
	 * @param octant - An octant. Defaults to the root octant.
	 * @return The amount of points.
	 */

	countPoints(octant: PointOctant<T> = this.root): number {

		return countPoints(octant);

	}

	/**
	 * Inserts a point into the octree.
	 *
	 * If the point exists in the tree already, the data entry will be replaced.
	 *
	 * @param point - The point.
	 * @param data - Data that belongs to the point.
	 * @return Whether the operation was successful.
	 */

	set(point: Vector3, data: T): boolean {

		return set(point, data, this, this.root, 0);

	}

	/**
	 * Removes a point from the tree.
	 *
	 * @param point - The point.
	 * @return The data entry of the removed point or null if it didn't exist.
	 */

	remove(point: Vector3): T | null {

		const result = remove(point, this, this.root, null);
		return result === NOT_FOUND ? null : result;

	}

	/**
	 * Retrieves the data of the specified point.
	 *
	 * @param point - A position.
	 * @return The data that belongs to the given point, or null if it doesn't exist.
	 */

	get(point: Vector3): T | null {

		const result = get(point, this, this.root);
		return result === NOT_FOUND ? null : result;

	}

	/**
	 * Moves an existing point to a new position. Has no effect if the point doesn't exist.
	 *
	 * @param point - The point.
	 * @param position - The new position.
	 * @return The data of the updated point, or null if it didn't exist.
	 */

	move(point: Vector3, position: Vector3): T | null {

		const result = move(point, position, this, this.root, null, 0);
		return result === NOT_FOUND ? null : result;

	}

	/**
	 * Finds the closest point to the given one.
	 *
	 * @param point - A point.
	 * @param maxDistance - An upper limit for the distance between the points.
	 * @param skipSelf - Whether a point that is exactly at the given position should be skipped.
	 * @return The nearest point, or null if there is none.
	 */

	findNearestPoint(point: Vector3, maxDistance = Number.POSITIVE_INFINITY, skipSelf = false): PointContainer<T> | null {

		const result = findNearestPoint(point, maxDistance, skipSelf, this.root);

		if(result !== null && result.point !== null) {

			result.point = result.point.clone();

		}

		return result;

	}

	/**
	 * Finds points within a specific radius around a given point.
	 *
	 * @param point - A position.
	 * @param radius - A radius.
	 * @param skipSelf - Whether a point that is exactly at the given position should be skipped.
	 * @return A list of points.
	 */

	findPoints(point: Vector3, radius: number, skipSelf = false): PointContainer<T>[] {

		const result: PointContainer<T>[] = [];
		findPoints(point, radius, skipSelf, this.root, result);
		return result;

	}

	/**
	 * Finds the points that intersect with the given ray.
	 *
	 * @param raycaster - The raycaster.
	 * @return The intersecting points.
	 */

	raycast(raycaster: Raycaster): RayPointIntersection<T>[] {

		const result: RayPointIntersection<T>[] = [];
		const octants = super.getIntersectingNodes(raycaster);

		if(octants.length > 0) {

			for(let i = 0, l = octants.length; i < l; ++i) {

				const octant = octants[i];
				const pointData = octant.data;

				if(pointData !== null) {

					pointData.testPoints(raycaster, result);

				}

			}

		}

		return result;

	}

}
