import { Box3 } from "three";
import { Node } from "./Node.js";
import { BoxIntersector } from "./BoxIntersector.js";

const b = /* @__PURE__ */ new Box3();

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
	 * A region used for octree culling.
	 */

	private region: BoxIntersector | null;

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
	 * @param region - A cull region.
	 */

	constructor(root: T, region: BoxIntersector | null = null) {

		this.root = root;
		this.region = region;
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

			b.min = root.min;
			b.max = root.max;

			if(this.region === null || this.region.intersectsBox(b)) {

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

		const region = this.region;
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

					if(region !== null) {

						b.min = child.min;
						b.max = child.max;

						if(!region.intersectsBox(b)) {

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

	[Symbol.iterator](): Iterator<T> {

		return this;

	}

}
