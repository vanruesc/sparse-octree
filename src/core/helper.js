import THREE from "three";

/**
 * An octree helper.
 *
 * The update method must be called manually to generate the octree geometry.
 *
 * @class OctreeHelper
 * @submodule core
 * @constructor
 * @extends Object3D
 * @param {Octree} tree - The octree to visualise.
 */

export class OctreeHelper extends THREE.Object3D {

	constructor(tree) {

		super();

		this.name = "OctreeHelper";

		/**
		 * The octree.
		 *
		 * @property tree
		 * @type Octree
		 */

		this.tree = (tree !== undefined) ? tree : null;

	}

	/**
	 * Creates the octree geometry.
	 *
	 * @method update
	 * @throws {Error} An error is thrown if too many vertices are created.
	 */

	update() {

		const vertexMap = new Map();
		const depth = (this.tree !== null) ? this.tree.depth() : -1;

		const connections = [
			/* 0 */ [1, 4],
			/* 1 */ [2, 5],
			/* 2 */ [3, 6],
			/* 3 */ [0, 7],
			/* 4 */ [5],
			/* 5 */ [6],
			/* 6 */ [7],
			/* 7 */ [4]
		];

		let i, j, k, il, kl;
		let octants, octant;

		let vertices, v, c;
		let entry, key;

		let geometry, lineSegments, material;

		let indexCount;
		let indices = null;
		let positions = null;

		let level = 0;

		// Remove existing geometry.
		for(i = 0, il = this.children.length; i < il; ++i) {

			this.children[i].geometry.dispose();
			this.children[i].material.dispose();

		}

		while(this.children.length > 0) {

			this.remove(this.children[0]);

		}

		while(level <= depth) {

			octants = this.tree.findOctantsByLevel(level);

			indexCount = 0;
			vertexMap.clear();

			for(i = 0, j = 0, il = octants.length; i < il; ++i) {

				octant = octants[i];

				vertices = [
					/* 0 */ [octant.max.x, octant.max.y, octant.max.z],
					/* 1 */ [octant.min.x, octant.max.y, octant.max.z],
					/* 2 */ [octant.min.x, octant.min.y, octant.max.z],
					/* 3 */ [octant.max.x, octant.min.y, octant.max.z],
					/* 4 */ [octant.max.x, octant.max.y, octant.min.z],
					/* 5 */ [octant.min.x, octant.max.y, octant.min.z],
					/* 6 */ [octant.min.x, octant.min.y, octant.min.z],
					/* 7 */ [octant.max.x, octant.min.y, octant.min.z]
				];

				// Update the vertex map.
				for(j = 0; j < 8; ++j) {

					v = vertices[j];
					c = connections[j];

					key = v.toString();
					entry = vertexMap.get(key);

					// Prevent duplicates.
					if(entry !== undefined) {

						// Adopt unique connections.
						for(k = 0, kl = c.length; k < kl; ++k) {

							key = vertices[c[k]].toString();

							if(entry.connectionKeys.indexOf(key) < 0) {

								entry.connectionKeys.push(key);
								++indexCount;

							}

						}

					} else {

						// No duplicate, create new entry.
						entry = {
							position: v,
							connectionKeys: [],
							index: vertexMap.size
						};

						for(k = 0, kl = c.length; k < kl; ++k) {

							entry.connectionKeys.push(vertices[c[k]].toString());
							++indexCount;

						}

						vertexMap.set(key, entry);

					}

				}

			}

			// Create the geometry for this level.
			if(vertexMap.size < 65536) {

				indices = new Uint16Array(indexCount * 2);
				positions = new Float32Array(vertexMap.size * 3);

				i = 0; j = 0;

				for(entry of vertexMap.values()) {

					v = entry.position;

					positions[i++] = v[0];
					positions[i++] = v[1];
					positions[i++] = v[2];

					c = entry.connectionKeys;

					// Add the index pairs that describe the lines.
					for(k = 0, kl = c.length; k < kl; ++k) {

						indices[j++] = entry.index;
						indices[j++] = vertexMap.get(c[k]).index;

					}

				}

				geometry = new THREE.BufferGeometry();
				geometry.setIndex(new THREE.BufferAttribute(indices, 1));
				geometry.addAttribute("position", new THREE.BufferAttribute(positions, 3));

				material = new THREE.LineBasicMaterial({
					color: new THREE.Color(0xffffff * Math.random())
				});

				lineSegments = new THREE.LineSegments(geometry, material);

				this.add(lineSegments);

			} else {

				throw new Error(
					"Could not create geometry for octree depth level " + level +
					" (vertex count of " + vertexMap.size + " exceeds limit of 65536)"
				);

			}

			++level;

		}

	}

}
