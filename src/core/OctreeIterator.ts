import { Box3, Frustum } from "three";
import { Node } from "./Node";

const b = new Box3();

/**
 * An octree iterator.
 */

export class OctreeIterator implements Iterator<Node>, Iterable<Node> {

	/**
	 * The root node.
	 */

	private root: Node;

	/**
	 * A region used for octree culling.
	 */

	private region: Frustum | Box3;

	/**
	 * Whether this iterator should respect the cull region.
	 */

	private cull: boolean;

	/**
	 * An iterator result.
	 */

	private result: IteratorResult<Node>;

	/**
	 * A node trace.
	 */

	private trace: Node[];

	/**
	 * Iteration indices.
	 */

	private indices: number[];

	/**
	 * Constructs a new octree iterator.
	 *
	 * @param root - The root node.
	 * @param region - A cull region.
	 */

	constructor(root: Node, region: Frustum | Box3 = null) {

		this.root = root;
		this.region = region;
		this.cull = (region !== null);
		this.trace = null;
		this.indices = null;

		this.reset();

	}

	/**
	 * Resets this iterator.
	 *
	 * @return This iterator.
	 */

	reset(): OctreeIterator {

		const root = this.root;

		this.trace = [];
		this.indices = [];

		if(root !== null) {

			b.min = root.min;
			b.max = root.max;

			if(!this.cull || this.region.intersectsBox(b)) {

				this.trace.push(root);
				this.indices.push(0);

			}

		}

		this.result = {
			done: false,
			value: null
		};

		return this;

	}

	next(): IteratorResult<Node> {

		const cull = this.cull;
		const region = this.region;
		const indices = this.indices;
		const trace = this.trace;

		let octant = null;
		let depth = trace.length - 1;

		while(octant === null && depth >= 0) {

			const index = indices[depth]++;
			const children = trace[depth].children;

			if(index < 8) {

				if(children !== null) {

					const child = children[index];

					if(cull) {

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

	[Symbol.iterator](): Iterator<Node> {

		return this;

	}

}
