import {
	BufferAttribute,
	BufferGeometry,
	Group,
	LineSegments,
	LineBasicMaterial
} from "three";

import { edges, layout, Node, OctreeIterator, Tree } from "../core";

/**
 * An octree helper.
 */

export class OctreeHelper extends Group {

	/**
	 * The name of this object.
	 */

	protected name: string;

	/**
	 * The octree.
	 */

	octree: Tree;

	/**
	 * Constructs a new octree helper.
	 *
	 * @param octree - An octree.
	 */

	constructor(octree?: Tree = null) {

		super();

		this.name = "OctreeHelper";
		this.octree = octree;

		this.update();

	}

	/**
	 * Creates the octant geometry.
	 *
	 * @param octants - An octant iterator.
	 * @param octantCount - The size of the given sequence.
	 */

	private createLineSegments(octants: OctreeIterator, octantCount: number): void {

		const maxOctants = (Math.pow(2, 16) / 8) - 1;
		const group = new Group();

		const material = new LineBasicMaterial({
			color: 0xffffff * Math.random()
		});

		// Create geometry in multiple runs to limit the amount of vertices.
		for(let i = 0, length = 0, n = Math.ceil(octantCount / maxOctants); n > 0; --n) {

			length += (octantCount < maxOctants) ? octantCount : maxOctants;
			octantCount -= maxOctants;

			const vertexCount = length * 8;
			const indices = new Uint16Array(vertexCount * 3);
			const positions = new Float32Array(vertexCount * 3);

			// Continue where the previous run left off.
			for(let c = 0, d = 0, result = octants.next(); !result.done && i < length;) {

				const octant = result.value;
				const min = octant.min;
				const max = octant.max;

				// Create line connections based on the current vertex count.
				for(j = 0; j < 12; ++j) {

					const edge = edges[j];

					indices[d++] = c + edge[0];
					indices[d++] = c + edge[1];

				}

				// Create the vertices.
				for(j = 0; j < 8; ++j, ++c) {

					const corner = layout[j];

					positions[c * 3] = (corner[0] === 0) ? min.x : max.x;
					positions[c * 3 + 1] = (corner[1] === 0) ? min.y : max.y;
					positions[c * 3 + 2] = (corner[2] === 0) ? min.z : max.z;

				}

				if(++i < length) {

					result = octants.next();

				}

			}

			const geometry = new BufferGeometry();
			geometry.setIndex(new BufferAttribute(indices, 1));
			geometry.setAttribute("position", new BufferAttribute(positions, 3));

			group.add(new LineSegments(geometry, material));

		}

		this.add(group);

	}

	/**
	 * Updates the helper geometry.
	 */

	update(): void {

		const depth = (this.octree !== null) ? this.octree.getDepth() : -1;

		let level = 0;

		// Remove existing geometry.
		this.dispose();

		while(level <= depth) {

			const result = this.octree.findNodesByLevel(level);

			this.createLineSegments(
				result[Symbol.iterator](),
				(typeof result.size === "number") ? result.size : result.length
			);

			++level;

		}

	}

	/**
	 * Destroys the helper geometry.
	 */

	dispose(): void {

		const groups = this.children;

		for(let i = 0, il = groups.length; i < il; ++i) {

			const group = groups[i];
			const children = group.children;

			for(let j = 0, jl = children.length; j < jl; ++j) {

				children[j].geometry.dispose();
				children[j].material.dispose();

			}

			while(children.length > 0) {

				group.remove(children[0]);

			}

		}

		while(groups.length > 0) {

			this.remove(groups[0]);

		}

	}

}
