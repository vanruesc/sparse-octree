import { BoxIntersector } from "../math/BoxIntersector.js";
import { Node } from "./Node.js";

/**
 * An octree iterator.
 *
 * @param T - The type of the octants.
 */

export class OctreeIterator<T extends Node = Node> implements Iterator<T>, Iterable<T> {

	/**
	 * The root node.
	 */

	private root: T;

	/**
	 * An intersector used for octree culling.
	 */

	private intersector: BoxIntersector | null;

	/**
	 * An iterator result.
	 */

	private result!: IteratorResult<T>;

	/**
	 * A node trace.
	 */

	private trace!: Node[];

	/**
	 * Iteration indices.
	 */

	private indices!: number[];

	/**
	 * Constructs a new octree iterator.
	 *
	 * @param root - The root node.
	 * @param intersector - A cull intersector.
	 */

	constructor(root: T, intersector: BoxIntersector | null = null) {

		this.root = root;
		this.intersector = intersector;
		this.reset();

	}

	/**
	 * Resets this iterator.
	 *
	 * @return This iterator.
	 */

	reset(): this {

		const root = this.root;

		this.trace = [];
		this.indices = [];

		if(root !== null) {

			if(this.intersector === null || this.intersector.intersectsBox(root)) {

				this.trace.push(root);
				this.indices.push(0);

			}

		}

		this.result = {
			done: false
		} as IteratorResult<T>;

		return this;

	}

	next(): IteratorResult<T> {

		const intersector = this.intersector;
		const indices = this.indices;
		const trace = this.trace;

		let octant = null;
		let depth = trace.length - 1;

		while(octant === null && depth >= 0) {

			const index = indices[depth]++;
			const children = trace[depth].children;

			if(index < 8) {

				if(children !== undefined && children !== null) {

					const child = children[index];

					if(intersector !== null && !intersector.intersectsBox(child)) {

						// Cull this octant.
						continue;

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

	[Symbol.iterator](): Iterator<T> {

		return this;

	}

}
