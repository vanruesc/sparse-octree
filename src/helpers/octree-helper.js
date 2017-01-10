import {
	BufferAttribute,
	BufferGeometry,
	LineSegments,
	LineBasicMaterial,
	Object3D
} from "three";

import { PATTERN, EDGES } from "../core/octant.js";

/**
 * An octree helper.
 *
 * @class OctreeHelper
 * @submodule helpers
 * @constructor
 * @extends Object3D
 * @param {Octree} [octree=null] - The octree to visualise.
 */

export class OctreeHelper extends Object3D {

	constructor(octree = null) {

		super();

		this.name = "OctreeHelper";

		/**
		 * The octree.
		 *
		 * @property octree
		 * @type Octree
		 */

		this.octree = octree;

		this.update();

	}

	/**
	 * Creates octant geometry.
	 *
	 * @method createLineSegments
	 * @private
	 * @param {Array} octants - The octants.
	 */

	createLineSegments(octants) {

		const maxOctants = (Math.pow(2, 16) / 8) - 1;
		const group = new Object3D();

		const material = new LineBasicMaterial({
			color: 0xffffff * Math.random()
		});

		let octantCount = octants.length;
		let vertexCount;
		let length;

		let indices, positions;
		let octant, min, max;
		let geometry;

		let i, j, c, d, n;
		let corner, edge;

		// Create geometry in multiple runs to limit the amount of vertices.
		for(i = 0, length = 0, n = Math.ceil(octantCount / maxOctants); n > 0; --n) {

			length += (octantCount < maxOctants) ? octantCount : maxOctants;
			octantCount -= maxOctants;

			vertexCount = length * 8;
			indices = new Uint16Array(vertexCount * 3);
			positions = new Float32Array(vertexCount * 3);

			// Don't reset i, continue where a previous run left off.
			for(c = 0, d = 0; i < length; ++i) {

				octant = octants[i];
				min = octant.min;
				max = octant.max;

				for(j = 0; j < 12; ++j) {

					edge = EDGES[j];

					indices[d++] = c + edge[0];
					indices[d++] = c + edge[1];

				}

				for(j = 0; j < 8; ++j, ++c) {

					corner = PATTERN[j];

					positions[c * 3] = (corner[0] === 0) ? min.x : max.x;
					positions[c * 3 + 1] = (corner[1] === 0) ? min.y : max.y;
					positions[c * 3 + 2] = (corner[2] === 0) ? min.z : max.z;

				}

			}

			geometry = new BufferGeometry();
			geometry.setIndex(new BufferAttribute(indices, 1));
			geometry.addAttribute("position", new BufferAttribute(positions, 3));

			group.add(new LineSegments(geometry, material));

		}

		this.add(group);

	}

	/**
	 * Updates the helper geometry.
	 *
	 * @method update
	 */

	update() {

		const depth = (this.octree !== null) ? this.octree.getDepth() : -1;

		let level = 0;

		// Remove existing geometry.
		this.dispose();

		while(level <= depth) {

			this.createLineSegments(this.octree.findOctantsByLevel(level));

			++level;

		}

	}

	/**
	 * Destroys this helper.
	 *
	 * @method dispose
	 */

	dispose() {

		const groups = this.children;

		let group, children;
		let i, j, il, jl;

		for(i = 0, il = groups.length; i < il; ++i) {

			group = groups[i];
			children = group.children;

			for(j = 0, jl = children.length; j < jl; ++j) {

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
