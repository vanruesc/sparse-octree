import {
	BufferAttribute,
	BufferGeometry,
	Group,
	LineSegments,
	LineBasicMaterial
} from "three";

import { edges, layout, Node, Tree } from "../core";

/**
 * An octree helper.
 */

export class OctreeHelper extends Group {

	/**
	 * The octree.
	 */

	octree: Tree;

	/**
	 * Constructs a new octree helper.
	 *
	 * @param octree - An octree.
	 */

	constructor(octree: Tree = null) {

		super();

		this.name = "OctreeHelper";
		this.octree = octree;

		this.update();

	}

	/**
	 * Creates the octant geometry.
	 *
	 * @param octants - An octree iterator.
	 * @param octantCount - The size of the given sequence.
	 */

	private createLineSegments(octants: Node[], octantCount: number): void {

		const iterator = octants[Symbol.iterator]();
		const maxOctants = (Math.pow(2, 16) / 8) - 1;
		const group = new Group();

		const material = new LineBasicMaterial({
			color: 0xffffff * Math.random()
		});

		// Create geometry in multiple runs to limit the amount of vertices.
		for(let i = 0, l = 0, n = Math.ceil(octantCount / maxOctants); n > 0; --n) {

			l += (octantCount < maxOctants) ? octantCount : maxOctants;
			octantCount -= maxOctants;

			const vertexCount = l * 8;
			const indices = new Uint16Array(vertexCount * 3);
			const positions = new Float32Array(vertexCount * 3);

			// Continue where the previous run left off.
			for(let c = 0, d = 0, result = iterator.next(); !result.done && i < l;) {

				const octant = result.value as Node;
				const min = octant.min;
				const max = octant.max;

				// Create line connections based on the current vertex count.
				for(let j = 0; j < 12; ++j) {

					const edge = edges[j];

					indices[d++] = c + edge[0];
					indices[d++] = c + edge[1];

				}

				// Create the vertices.
				for(let j = 0; j < 8; ++j, ++c) {

					const corner = layout[j];

					positions[c * 3] = (corner[0] === 0) ? min.x : max.x;
					positions[c * 3 + 1] = (corner[1] === 0) ? min.y : max.y;
					positions[c * 3 + 2] = (corner[2] === 0) ? min.z : max.z;

				}

				if(++i < l) {

					result = iterator.next();

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

		// Remove existing geometry.
		this.dispose();

		const depth = (this.octree !== null) ? this.octree.getDepth() : -1;

		for(let level = 0; level <= depth; ++level) {

			const result = this.octree.findNodesByLevel(level);
			this.createLineSegments(result, result.length);

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

				const lineSegments = children[j] as LineSegments;
				lineSegments.geometry.dispose();

				if(Array.isArray(lineSegments.material)) {

					for(const m of lineSegments.material) {

						m.dispose();

					}

				} else {

					lineSegments.material.dispose();

				}

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
