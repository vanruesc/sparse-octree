import { Box3, Frustum, Raycaster, Vector3 } from "three";
import { OctreeRaycaster } from "../raycasting";
import { OctreeIterator } from "./OctreeIterator";
import { Node } from "./Node";
import { Tree } from "./Tree";

const b = new Box3();

/**
 * Recursively calculates the depth of the given node.
 *
 * @param node - A node.
 * @return The depth.
 */

function getDepth(node: Node): number {

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

function cull(node: Node, region: Frustum | Box3, result: Node[]): void {

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

function findNodesByLevel(node: Node, level: number, depth: number, result: Node[]): void {

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

export class Octree implements Tree, Iterable<Node> {

	/**
	 * The root octant.
	 */

	protected root: Node;

	/**
	 * Constructs a new octree.
	 *
	 * @param root - The root node. See {@link Octant} or {@link CubicOctant}.
	 */

	constructor(root: Node) {

		this.root = root;

	}

	get min(): Vector3 {

		return this.root.min;

	}

	get max(): Vector3 {

		return this.root.max;

	}

	get children(): Node[] {

		return this.root.children;

	}

	getCenter(result: Vector3): Vector3 {

		return this.root.getCenter(result);

	}

	getDimensions(result: Vector3): Vector3 {

		return this.root.getDimensions(result);

	}

	/**
	 * Recursively collects nodes that intersect with the specified region.
	 *
	 * @param region - A region.
	 * @return The nodes.
	 */

	cull(region: Frustum | Box3): Node[] {

		const result: Node[] = [];
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

	findNodesByLevel(level: number): Node[] {

		const result: Node[] = [];
		findNodesByLevel(this.root, level, 0, result);
		return result;

	}

	/**
	 * Finds nodes that intersect with the given ray. The intersecting nodes are sorted by distance, closest first.
	 *
	 * @param raycaster - A raycaster.
	 * @return The intersecting nodes.
	 */

	getIntersectingNodes(raycaster: Raycaster): Node[] {

		return OctreeRaycaster.intersectOctree(this.root, raycaster.ray);

	}

	/**
	 * Returns an iterator that traverses the octree and returns leaf nodes.
	 *
	 * When a cull region is provided, the iterator will only return leaves that intersect with that region.
	 *
	 * @param region - A cull region.
	 * @return An iterator.
	 */

	leaves(region: Frustum | Box3 = null): Iterator<Node> {

		return new OctreeIterator(this.root, region);

	}

	/**
	 * Returns an iterator that traverses the octree and returns all leaf nodes.
	 *
	 * @return An iterator.
	 */

	[Symbol.iterator](): Iterator<Node> {

		return new OctreeIterator(this.root);

	}

}
