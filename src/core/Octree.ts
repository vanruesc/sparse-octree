import { Box3, Frustum, Raycaster, Vector3 } from "three";
import { OctreeRaycaster } from "../raycasting";
import { OctreeIterator } from "./OctreeIterator";
import { Node } from "./Node";
import { Tree } from "./Tree";

/**
 * 3D bounds.
 */

const b = new Box3();

/**
 * Recursively calculates the depth of the given node.
 *
 * @param node - A node.
 * @return The depth.
 */

function getDepth<T>(node: Node<T>): number {

	const children = node.children;

	let result = 0;

	if(children !== null) {

		for(let i = 0, l = children.length; i < l; ++i) {

			const d = 1 + getDepth(children[i]);

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
 * @param node - An octant.
 * @param region - A region.
 * @param result - A list to be filled with nodes that intersect with the region.
 */

function cull<T>(node: Node<T>, region: Frustum|Box3, result: Node<T>[]) {

	const children = node.children;

	b.min = node.min;
	b.max = node.max;

	if(region.intersectsBox(b)) {

		if(children !== null) {

			for(let i = 0, l = children.length; i < l; ++i) {

				cull(children[i], region, result);

			}

		} else {

			result.push(node);

		}

	}

}

/**
 * Recursively fetches all octants with the specified depth level.
 *
 * @param node - A node.
 * @param level - The target depth level.
 * @param depth - The current depth level.
 * @param result - A list to be filled with the identified octants.
 */

function findNodesByLevel<T>(node: Node<T>, level: number, depth: number, result: Node<T>[]) {

	const children = node.children;

	if(depth === level) {

		result.push(node);

	} else if(children !== null) {

		++depth;

		for(let i = 0, l = children.length; i < l; ++i) {

			findNodesByLevel(children[i], level, depth, result);

		}

	}

}

/**
 * A pointer-based octree that subdivides space for fast spatial searches.
 */

export class Octree<T> implements Node<T>, Tree<T>, Iterable {

	/**
	 * The root octant.
	 */

	protected root: Node<T>;

	/**
	 * Constructs a new octree.
	 *
	 * @param root - The root node. See {@link Octant} or {@link CubicOctant}.
	 */

	constructor(root: Node<T>) {

		this.root = root;

	}

	get min() {

		return this.root.min;

	}

	get max() {

		return this.root.max;

	}

	get data() {

		return this.root.data;

	}

	get children(): Node<T>[] {

		return this.root.children;

	}

	getCenter(target: Vector3): Vector3 {

		return this.root.getCenter(target);

	}

	getDimensions(target: Vector3): Vector3 {

		return this.root.getDimensions(target);

	}

	/**
	 * Recursively collects nodes that intersect with the specified region.
	 *
	 * @param region - A region.
	 * @return The nodes.
	 */

	cull(region: Frustum|Box3): Node<T>[] {

		const result: Node<T>[] = [];
		cull(this.root, region, result);
		return result;

	}

	/**
	 * Calculates the current depth of this octree.
	 *
	 * @return The depth.
	 */

	getDepth(): number {

		return getDepth(this.root);

	}

	/**
	 * Fetches all nodes of a specific depth level.
	 *
	 * @param level - The depth level.
	 * @return The nodes.
	 */

	findNodesByLevel(level: number): Node<T>[] {

		const result: Node<T>[] = [];
		findNodesByLevel(this.root, level, 0, result);
		return result;

	}

	/**
	 * Finds the nodes that intersect with the given ray. The intersecting
	 * nodes are sorted by distance, closest first.
	 *
	 * @param raycaster - A raycaster.
	 * @param intersects - An optional target list to be filled with the intersecting nodes.
	 * @return The intersecting nodes.
	 */

	raycast(raycaster: Raycaster, intersects: Node<T>[] = []): Node<T>[] {

		OctreeRaycaster.intersectOctree(this, raycaster.ray, intersects);
		return intersects;

	}

	/**
	 * Returns an iterator that traverses the octree and returns leaf nodes.
	 *
	 * When a cull region is provided, the iterator will only return leaves that
	 * intersect with that region.
	 *
	 * @param region - A cull region.
	 * @return An iterator.
	 */

	leaves(region: Frustum|Box3 = null): Iterator<Node<T>> {

		return new OctreeIterator<T>(this, region);

	}

	/**
	 * Returns an iterator that traverses the octree and returns all leaf nodes.
	 *
	 * @return An iterator.
	 */

	[Symbol.iterator](): Iterator<Node<T>> {

		return new OctreeIterator<T>(this);

	}

}
