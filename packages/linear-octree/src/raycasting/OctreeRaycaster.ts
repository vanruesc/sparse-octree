import {
	layout,
	Ray,
	RaycastingFlags,
	RayLike,
	Vector3,
	findEntryOctant,
	findNextOctant,
	intersectOctree
} from "sparse-octree";

import { IntermediateOctant } from "../core/IntermediateOctant.js";
import { OctantWrapper } from "../core/OctantWrapper.js";
import { Octree } from "../core/Octree.js";

const octantWrapper = /* @__PURE__ */ new OctantWrapper<unknown>();
const flags = /* @__PURE__ */ new RaycastingFlags();
const u = /* @__PURE__ */ new Vector3();
const v = /* @__PURE__ */ new Vector3();

/**
 * Recursively traverses the given octant to find (pseudo) leaf octants that intersect with the given ray.
 *
 * @param octree - The octree.
 * @param octant - The current octant.
 * @param ray - The original ray, used to resolve parallel axes.
 * @param keyX - The X-coordinate of the current octant key.
 * @param keyY - The Y-coordinate of the current octant key.
 * @param keyZ - The Z-coordinate of the current octant key.
 * @param level - The current depth.
 * @param tx0 - A ray projection parameter.
 * @param ty0 - A ray projection parameter.
 * @param tz0 - A ray projection parameter.
 * @param tx1 - A ray projection parameter.
 * @param ty1 - A ray projection parameter.
 * @param tz1 - A ray projection parameter.
 * @param result - An array to be filled with the intersecting octants.
 */

function raycastOctant<T>(octree: Octree<T>, octant: IntermediateOctant<T>, ray: RayLike,
	keyX: number, keyY: number, keyZ: number, level: number,
	tx0: number, ty0: number, tz0: number, tx1: number, ty1: number, tz1: number,
	result: OctantWrapper<T>[]): void {

	if(tx1 < 0 || ty1 < 0 || tz1 < 0.0) {

		return;

	}

	const keyDesign = octree.keyDesign;

	if(octant.data !== null) {

		const cellSize = octree.getCellSize(level, u);
		const octantWrapper = new OctantWrapper<T>(octant);
		octantWrapper.id.set(keyDesign.packKey(keyX, keyY, keyZ), level);
		octantWrapper.setBounds(keyX, keyY, keyZ, cellSize, octree.min);

		result.push(octantWrapper);

	}

	if(level === 0 || octant.children === 0) {

		return;

	}

	// Go to the next lower level.
	const grid = octree.getGrid(--level);
	const children = octant.children;

	const { origin, direction } = ray;
	const min = octree.min;
	const leafSize = octree.getCellSize(0, u);
	const halfCells = Math.pow(2, level);

	// Parallel slabs have infinite endpoints. Use the split plane of the stretched traversal grid.
	const txm = (direction.x === 0.0) ?
		((origin.x < min.x + (2 * keyX + 1) * halfCells * leafSize.x) ? Infinity : -Infinity) : 0.5 * (tx0 + tx1);
	const tym = (direction.y === 0.0) ?
		((origin.y < min.y + (2 * keyY + 1) * halfCells * leafSize.y) ? Infinity : -Infinity) : 0.5 * (ty0 + ty1);
	const tzm = (direction.z === 0.0) ?
		((origin.z < min.z + (2 * keyZ + 1) * halfCells * leafSize.z) ? Infinity : -Infinity) : 0.5 * (tz0 + tz1);

	let currentOctant = findEntryOctant(tx0, ty0, tz0, txm, tym, tzm);

	// Translate the key coordinates to the next lower level.
	keyX *= 2; keyY *= 2; keyZ *= 2;

	while(currentOctant < 8) {

		const i = flags.value ^ currentOctant;
		const childExists = ((children & (1 << i | 0)) !== 0);
		const offset = layout[i];

		v.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);

		let child = null;

		if(childExists) {

			child = grid.get(keyDesign.packKey(v.x, v.y, v.z)) as IntermediateOctant<T>;

		}

		switch(currentOctant) {

			case 0: {

				if(child !== null) {

					raycastOctant(
						octree, child, ray, v.x, v.y, v.z, level,
						tx0, ty0, tz0, txm, tym, tzm, result
					);

				}

				currentOctant = findNextOctant(currentOctant, txm, tym, tzm);
				break;

			}

			case 1: {

				if(child !== null) {

					raycastOctant(
						octree, child, ray, v.x, v.y, v.z, level,
						tx0, ty0, tzm, txm, tym, tz1, result
					);

				}

				currentOctant = findNextOctant(currentOctant, txm, tym, tz1);
				break;

			}

			case 2: {

				if(child !== null) {

					raycastOctant(
						octree, child, ray, v.x, v.y, v.z, level,
						tx0, tym, tz0, txm, ty1, tzm, result
					);

				}

				currentOctant = findNextOctant(currentOctant, txm, ty1, tzm);
				break;

			}

			case 3: {

				if(child !== null) {

					raycastOctant(
						octree, child, ray, v.x, v.y, v.z, level,
						tx0, tym, tzm, txm, ty1, tz1, result
					);

				}

				currentOctant = findNextOctant(currentOctant, txm, ty1, tz1);
				break;

			}

			case 4: {

				if(child !== null) {

					raycastOctant(
						octree, child, ray, v.x, v.y, v.z, level,
						txm, ty0, tz0, tx1, tym, tzm, result
					);

				}

				currentOctant = findNextOctant(currentOctant, tx1, tym, tzm);
				break;

			}

			case 5: {

				if(child !== null) {

					raycastOctant(
						octree, child, ray, v.x, v.y, v.z, level,
						txm, ty0, tzm, tx1, tym, tz1, result
					);

				}

				currentOctant = findNextOctant(currentOctant, tx1, tym, tz1);
				break;

			}

			case 6: {

				if(child !== null) {

					raycastOctant(
						octree, child, ray, v.x, v.y, v.z, level,
						txm, tym, tz0, tx1, ty1, tzm, result
					);

				}

				currentOctant = findNextOctant(currentOctant, tx1, ty1, tzm);
				break;

			}

			case 7: {

				if(child !== null) {

					raycastOctant(
						octree, child, ray, v.x, v.y, v.z, level,
						txm, tym, tzm, tx1, ty1, tz1, result
					);

				}

				// Far top right octant: no other octants can be reached from here.
				currentOctant = 8;
				break;

			}

		}

	}

}

/**
 * A raycaster for linear octrees.
 *
 * This octree traversal implementation uses octant child existence bitmasks to avoid hash table lookup misses.
 *
 * @see "An Efficient Parametric Algorithm for Octree Traversal" by J. Revelles et al. (2000)
 */

export class OctreeRaycaster {

	/**
	 * Finds (pseudo) leaf octants that intersect with the given ray.
	 *
	 * @param octree - A linear octree.
	 * @param ray - A ray.
	 * @return The intersecting octants. Sorted by distance, closest first.
	 */

	static intersectOctree<T>(octree: Octree<T>, ray: RayLike): OctantWrapper<T>[] {

		const result: OctantWrapper<T>[] = [];

		if(!Ray.intersectsBox(ray, octree)) {

			return result;

		}

		const level = octree.getLevels(); // Starting at the root octant.
		const rootOctant = octree.root.octant as IntermediateOctant<T>;

		const keyDesign = octree.keyDesign;
		const dimensions = octree.getDimensions(u);
		const maxBits = level; // = 1 + Math.max(keyDesign.x, keyDesign.y, keyDesign.z)

		// This vector describes how many times each dimension should be doubled.
		const bitDifference = v.set(
			maxBits - keyDesign.x,
			maxBits - keyDesign.y,
			maxBits - keyDesign.z
		);

		// Temporarily stretch the dimensions to account for bit imbalance.
		dimensions.set(
			dimensions.x * (1 << bitDifference.x >>> 0),
			dimensions.y * (1 << bitDifference.y >>> 0),
			dimensions.z * (1 << bitDifference.z >>> 0)
		);

		octantWrapper.setBounds(0, 0, 0, dimensions, octree.min);

		if(rootOctant.children > 0) {

			// Calculate the initial raycasting parameters.
			const t = intersectOctree(octantWrapper, ray, flags);

			if(t !== null) {

				// Find the intersecting children.
				raycastOctant(
					octree, rootOctant, ray, 0, 0, 0, level,
					t[0], t[1], t[2], t[3], t[4], t[5], result
				);

			}

		}

		if(rootOctant.data !== null) {

			result.push(octree.root.clone());

		}

		return result;

	}

}
