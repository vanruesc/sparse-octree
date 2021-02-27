import { Box3, Frustum } from "three";
import { Node } from "./Node";
import { Tree } from "./Tree";

const b = new Box3();

/**
 * An octree iterator.
 */

export class OctreeIterator implements Iterator<Node>, Iterable<Node> {

	/**
	 * The octree.
	 */

	private octree: Tree;

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
	 * An octant trace.
	 */

	private trace: Node[];

	/**
	 * Iteration indices.
	 */

	private indices: number[];

	/**
	 * Constructs a new octant iterator.
	 *
	 * @param octree - An octree.
	 * @param region - A cull region.
	 */

	constructor(octree: Tree, region: Frustum | Box3 = null) {

		this.octree = octree;
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

		const root = this.octree;

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
