import { Box3, Raycaster, Vector3 } from "three";
import { OctreeRaycaster } from "../raycasting/index.js";
import { BoxIntersector } from "./BoxIntersector.js";
import { Node } from "./Node.js";
import { OctreeIterator } from "./OctreeIterator.js";
import { Tree } from "./Tree.js";

const b = /* @__PURE__ */ new Box3();

/**
 * Recursively calculates the depth of the given node.
 *
 * @param node - A node.
 * @return The depth.
 */

function getDepth(node: Node): number {

	const children = node.children;

	let result = 0;

	if(children !== undefined && children !== null) {

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
 * Recursively collects octants that lie inside the specified intersector.
 *
 * @param node - An octant.
 * @param intersector - An intersector.
 * @param result - A list to be filled with intersecting nodes.
 */

function cull(node: Node, intersector: BoxIntersector, result: Node[]): void {

	const children = node.children;

	b.min = node.min;
	b.max = node.max;

	if(!intersector.intersectsBox(b)) {

		return;

	}

	if(children !== undefined && children !== null) {

		for(let i = 0, l = children.length; i < l; ++i) {

			cull(children[i], intersector, result);

		}

	} else {

		result.push(node);

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

function findNodesByLevel(node: Node, level: number, depth: number, result: Node[]): void {

	const children = node.children;

	if(depth === level) {

		result.push(node);

	} else if(children !== undefined && children !== null) {

		++depth;

		for(let i = 0, l = children.length; i < l; ++i) {

			findNodesByLevel(children[i], level, depth, result);

		}

	}

}

/**
 * A pointer-based octree that subdivides space for fast spatial searches.
 *
 * @param T - The type of the octants.
 */

export class Octree<T extends Node = Node> implements Tree<T>, Iterable<T> {

	/**
	 * The root octant.
	 */

	protected root: T;

	/**
	 * Constructs a new octree.
	 *
	 * @param root - The root node.
	 */

	constructor(root: T) {

		this.root = root;

	}

	get min(): Vector3 {

		return this.root.min;

	}

	get max(): Vector3 {

		return this.root.max;

	}

	get children(): T[] | null {

		return (this.root.children ?? null) as T[] | null;

	}

	getCenter(result: Vector3): Vector3 {

		return this.root.getCenter(result);

	}

	getDimensions(result: Vector3): Vector3 {

		return this.root.getDimensions(result);

	}

	/**
	 * Recursively collects nodes that intersect with the given intersector.
	 *
	 * @param intersector - A intersector.
	 * @return The nodes.
	 */

	cull(intersector: BoxIntersector): T[] {

		const result: T[] = [];
		cull(this.root, intersector, result);
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

	findNodesByLevel(level: number): T[] {

		const result: T[] = [];
		findNodesByLevel(this.root, level, 0, result);
		return result;

	}

	/**
	 * Finds nodes that intersect with the given ray. The intersecting nodes are sorted by distance, closest first.
	 *
	 * @param raycaster - A raycaster.
	 * @return The intersecting nodes.
	 */

	getIntersectingNodes(raycaster: Raycaster): T[] {

		return OctreeRaycaster.intersectOctree(this.root, raycaster.ray) as T[];

	}

	/**
	 * Returns an iterator that traverses the octree and returns leaf nodes.
	 *
	 * When an intersector is provided, the iterator will only return intersecting leaves.
	 *
	 * @param intersector - An intersector used for culling.
	 * @return An iterator.
	 */

	leaves(intersector: BoxIntersector | null = null): OctreeIterator<T> {

		return new OctreeIterator<T>(this.root, intersector);

	}

	/**
	 * Returns an iterator that traverses the octree and returns all leaf nodes.
	 *
	 * @return An iterator.
	 */

	[Symbol.iterator](): Iterator<T> {

		return new OctreeIterator<T>(this.root);

	}

}
