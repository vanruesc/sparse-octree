import { Box3, Raycaster, Vector3 } from "three";
import { BoxIntersector, layout, Node, Tree } from "sparse-octree";
import { IntermediateOctant } from "./IntermediateOctant.js";
import { KeyDesign } from "./KeyDesign.js";
import { Octant } from "./Octant.js";
import { OctantWrapper } from "./OctantWrapper.js";
import { OctreeIterator } from "./OctreeIterator.js";
import { OctreeRaycaster } from "../raycasting/OctreeRaycaster.js";
import { calculateOffsetIndex } from "../utils/calculateOffsetIndex.js";

const u = /* @__PURE__ */ new Vector3();
const v = /* @__PURE__ */ new Vector3();
const b = /* @__PURE__ */ new Box3();

/**
 * Recursively deletes octant children.
 *
 * @param octree - An octree.
 * @param octant - The current octant.
 * @param keyX - The X-coordinate of the current octant's key.
 * @param keyY - The Y-coordinate of the current octant's key.
 * @param keyZ - The Z-coordinate of the current octant's key.
 * @param level - The level.
 */

function removeChildren<T>(octree: Octree<T>, octant: IntermediateOctant<T>,
	keyX: number, keyY: number, keyZ: number, level: number): void {

	// The octants in level zero have no children.
	if(level === 0) {

		return;

	}

	// Go to the next lower level.
	--level;

	const grid = octree.getGrid(level);
	const keyDesign = octree.keyDesign;
	const children = octant.children;

	// Translate the key coordinates to the next lower level.
	keyX *= 2; keyY *= 2; keyZ *= 2;

	for(let i = 0; i < 8; ++i) {

		// Check if the child exists.
		if((children & (1 << i | 0)) !== 0) {

			const offset = layout[i];
			v.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
			const key = keyDesign.packKey(v.x, v.y, v.z);

			// Get the child octant and remove it from the grid.
			const child = grid.get(key) as IntermediateOctant<T>;
			grid.delete(key);

			removeChildren(octree, child, v.x, v.y, v.z, level);

		}

	}

	octant.children = 0;

}

/**
 * Recursively creates intermediate parent octants from the bottom up.
 *
 * @param octree - An octree.
 * @param keyX - The X-coordinate of the created octant's key.
 * @param keyY - The Y-coordinate of the created octant's key.
 * @param keyZ - The Z-coordinate of the created octant's key.
 * @param level - The current level.
 */

function createParents<T>(octree: Octree<T>, keyX: number, keyY: number, keyZ: number, level: number): void {

	// Go to the next higher level.
	++level;

	// Determine the position of the created octant relative to its parent.
	const i = calculateOffsetIndex(keyX, keyY, keyZ);

	if(level < octree.getLevels()) {

		const grid = octree.getGrid(level);

		// Translate the key coordinates to the next higher level.
		v.set(keyX >>> 1, keyY >>> 1, keyZ >>> 1);

		// The resulting coordinates identify the parent octant.
		const key = octree.keyDesign.packKey(v.x, v.y, v.z);

		if(grid.has(key)) {

			// The parent node already exists.
			const parent = grid.get(key) as IntermediateOctant<T>;

			// Set the existence flag of the created child and stop.
			parent.children |= 1 << i | 0;

		} else {

			// Create a new intermediate node.
			const parent = new IntermediateOctant<T>();
			grid.set(key, parent);

			// Set the existence flag of the created child and recur.
			parent.children |= 1 << i | 0;
			createParents(octree, v.x, v.y, v.z, level);

		}

	} else {

		// Set the existence flag of the created child and stop.
		const rootOctant = octree.root.octant as IntermediateOctant<T>;
		rootOctant.children |= 1 << i | 0;

	}

}

/**
 * Recursively removes empty parent nodes from the bottom up.
 *
 * @param octree - An octree.
 * @param keyX - The X-coordinate of the deleted octant's key.
 * @param keyY - The Y-coordinate of the deleted octant's key.
 * @param keyZ - The Z-coordinate of the deleted octant's key.
 * @param level - The current level.
 */

function prune<T>(octree: Octree<T>, keyX: number, keyY: number, keyZ: number, level: number): void {

	// Go to the next higher level.
	++level;

	// Determine the position of the deleted octant relative to its parent.
	const i = calculateOffsetIndex(keyX, keyY, keyZ);

	if(level < octree.getLevels()) {

		const grid = octree.getGrid(level);

		// Translate the key coordinates to the next higher level.
		v.set(keyX >>> 1, keyY >>> 1, keyZ >>> 1);

		// The resulting coordinates identify the parent octant.
		const key = octree.keyDesign.packKey(v.x, v.y, v.z);
		const parent = grid.get(key) as IntermediateOctant<T>;

		// Unset the existence flag of the deleted child.
		parent.children &= ~(1 << i | 0);

		// Check if there are any children left.
		if(parent.children === 0) {

			// Remove the empty parent and recur.
			grid.delete(key);
			prune(octree, v.x, v.y, v.z, level);

		}

	} else {

		// Unset the existence flag of the deleted child and stop.
		const rootOctant = octree.root.octant as IntermediateOctant<T>;
		rootOctant.children &= ~(1 << i | 0);

	}

}

/**
 * Recursively collects octants that lie inside the specified region.
 *
 * @param octree - An octree.
 * @param octant - The current octant.
 * @param keyX - The X-coordinate of the current octant's key.
 * @param keyY - The Y-coordinate of the current octant's key.
 * @param keyZ - The Z-coordinate of the current octant's key.
 * @param level - The level.
 * @param region - A region.
 * @param result - A list to be filled with intersecting nodes.
 */

function cull<T>(octree: Octree<T>, octant: IntermediateOctant<T>,
	keyX: number, keyY: number, keyZ: number, level: number,
	region: BoxIntersector, result: Node[]): void {

	const cellSize = octree.getCellSize(level, u);
	b.min.copy(v.set(keyX, keyY, keyZ)).multiply(cellSize).add(octree.min);
	b.max.copy(b.min).add(cellSize);

	if(!region.intersectsBox(b)) {

		return;

	}

	const keyDesign = octree.keyDesign;

	if(octant.data !== null) {

		const octantWrapper = new OctantWrapper<T>(octant);
		octantWrapper.id.set(keyDesign.packKey(v.x, v.y, v.z), level);
		octantWrapper.min.copy(b.min);
		octantWrapper.max.copy(b.max);
		result.push(octantWrapper);

	}

	// The octants in level zero have no children.
	if(level === 0) {

		return;

	}

	// Go to the next lower level.
	--level;

	const grid = octree.getGrid(level);
	const children = octant.children;

	// Translate the key coordinates to the next lower level.
	keyX *= 2; keyY *= 2; keyZ *= 2;

	for(let i = 0; i < 8; ++i) {

		// Check if the child exists.
		if((children & (1 << i | 0)) !== 0) {

			const offset = layout[i];
			v.set(keyX + offset[0], keyY + offset[1], keyZ + offset[2]);
			const key = keyDesign.packKey(v.x, v.y, v.z);

			const child = grid.get(key) as IntermediateOctant<T>;
			cull(octree, child, v.x, v.y, v.z, level, region, result);

		}

	}

}

/**
 * An octree that subdivides space for fast spatial searches.
 *
 * This linear implementation offers constant time access to octants at any depth level as well as octant neighbours
 * and parent nodes.
 *
 * @param T - The type of the octant data.
 */

export class Octree<T> implements Tree, Iterable<OctantWrapper<T>> {

	/**
	 * The level zero cell size.
	 */

	private readonly cellSize: Vector3;

	/**
	 * @see {@link keyDesign}
	 */

	private readonly _keyDesign: KeyDesign;

	/**
	 * The hierarchical octant grids.
	 */

	private grids: Map<number, Octant<T>>[];

	/**
	 * The root node of this octree.
	 */

	readonly root: OctantWrapper<T>;

	/**
	 * Constructs a new octree.
	 *
	 * Each octant can be uniquely identified by a 3D coordinate and a level. The tree depth is defined by the highest
	 * number of bits in the key design.
	 *
	 * If the bounds of the octree are defined directly, the cell size will depend on the bounds and the key design.
	 * Alternatively, the bounds can be calculated from a desired cell size via {@link KeyDesign.calculateBounds}.
	 *
	 * @param bounds - The bounds of the octree.
	 * @param keyDesign - The bit allotments for the octant coordinates.
	 */

	constructor(bounds: Box3, keyDesign = new KeyDesign()) {

		this._keyDesign = keyDesign;
		this._keyDesign.addEventListener(KeyDesign.EVENT_CHANGE, () => {

			this.createGrids();
			this.updateCellSize();

		});

		const root = new OctantWrapper<T>(new IntermediateOctant<T>());
		root.min.copy(bounds.min);
		root.max.copy(bounds.max);
		Object.freeze(root.min);
		Object.freeze(root.max);
		Object.freeze(root);
		this.root = root;

		this.grids = [];
		this.createGrids();

		this.cellSize = new Vector3();
		this.updateCellSize();

	}

	get min(): Vector3 {

		return this.root.min;

	}

	get max(): Vector3 {

		return this.root.max;

	}

	getCenter(result: Vector3): Vector3 {

		return this.root.getCenter(result);

	}

	getDimensions(result: Vector3): Vector3 {

		return this.root.getDimensions(result);

	}

	getDepth(): number {

		return this.grids.length - 1;

	}

	findNodesByLevel(level: number): Node[] {

		return Array.from(this.octants(level));

	}

	/**
	 * Returns the amount of depth levels.
	 *
	 * @return The levels.
	 */

	getLevels(): number {

		return this.grids.length;

	}

	/**
	 * The key design.
	 */

	get keyDesign(): KeyDesign {

		return this._keyDesign;

	}

	/**
	 * Creates new grids based on the current key design. Existing grids will be removed.
	 */

	private createGrids(): void {

		const keyDesign = this.keyDesign;
		const levels = 1 + Math.max(keyDesign.x, keyDesign.y, keyDesign.z);

		this.grids = [];

		while(this.grids.length < levels) {

			this.grids.push(new Map<number, Octant<T>>());

		}

	}

	/**
	 * Updates the cell size based on the current key design and root dimensions.
	 */

	private updateCellSize(): void {

		const cellSize = this.root.getDimensions(this.cellSize);

		cellSize.set(
			cellSize.x / this.keyDesign.rangeX,
			cellSize.y / this.keyDesign.rangeY,
			cellSize.z / this.keyDesign.rangeZ
		);

	}

	/**
	 * Returns the size of the cells in the specified grid.
	 *
	 * @param level - The level. Must be a positive integer.
	 * @param result - A vector to store the result in.
	 * @return The cell size.
	 */

	getCellSize(level: number, result: Vector3): Vector3 {

		const cellSize = this.cellSize;
		const keyDesign = this.keyDesign;

		return result.set(
			cellSize.x * (1 << Math.min(level, keyDesign.x) >>> 0),
			cellSize.y * (1 << Math.min(level, keyDesign.y) >>> 0),
			cellSize.z * (1 << Math.min(level, keyDesign.z) >>> 0)
		);

	}

	/**
	 * Returns the grid of the specified level.
	 *
	 * @throws If the given level is out of bounds.
	 * @param level - The level of the grid.
	 * @return The requested grid.
	 */

	getGrid(level: number): Map<number, Octant<T>> {

		if(level < 0 || level >= this.grids.length) {

			throw new Error(`Level ${level} is out of bounds [0, ${this.grids.length - 1}]`);

		}

		return this.grids[level];

	}

	/**
	 * Removes all octants.
	 */

	clear(): void {

		for(const grid of this.grids) {

			grid.clear();

		}

		const octant = this.root.octant as IntermediateOctant<T>;
		octant.children = 0;

	}

	/**
	 * Checks if the given point lies inside this octree's boundaries.
	 *
	 * @param point - A point.
	 * @return Whether the given point lies inside this octree.
	 */

	containsPoint(point: Vector3): boolean {

		return this.root.containsPoint(point);

	}

	/**
	 * Calculates key coordinates based on a given position and level.
	 *
	 * @param position - A position.
	 * @param level - The level.
	 * @param result - A vector to store the result in.
	 * @return The key coordinates.
	 */

	calculateKeyCoordinates(position: Vector3, level: number, result: Vector3): Vector3 {

		if(!this.containsPoint(position)) {

			throw new Error("Position out of bounds");

		}

		const cellSize = this.getCellSize(level, u);

		// Translate to the origin (zero-based unsigned coordinates).
		result.subVectors(position, this.min);

		result.set(
			Math.trunc(result.x / cellSize.x),
			Math.trunc(result.y / cellSize.y),
			Math.trunc(result.z / cellSize.z)
		);

		return result.min(this.keyDesign.getMaxKeyCoordinates(u));

	}

	/**
	 * Retrieves an octant of a specific level that contains the given point.
	 *
	 * @param point - A point.
	 * @param level - The level.
	 * @return The octant, or undefined if it doesn't exist.
	 */

	getOctantByPoint(point: Vector3, level = 0): Octant<T> | undefined {

		const keyDesign = this.keyDesign;
		const grid = this.getGrid(level);
		this.calculateKeyCoordinates(point, level, v);

		return grid.get(keyDesign.packKey(v.x, v.y, v.z));

	}

	/**
	 * Removes a specific octant.
	 *
	 * Children and empty intermediate parent octants will be removed as well.
	 *
	 * @param key - A packed key or key coordinates.
	 * @param level - The level of the octant.
	 */

	delete(key: number | Vector3, level = 0): void {

		const keyDesign = this.keyDesign;
		const grid = this.getGrid(level);

		let keyCoordinates: Vector3 | null = null;

		if(typeof key !== "number") {

			keyCoordinates = key;
			key = keyDesign.packKey(key.x, key.y, key.z);

		}

		if(grid.has(key)) {

			// Recursively delete all children in the lower level grids.
			const octant = grid.get(key) as IntermediateOctant<T>;
			const { x, y, z } = keyCoordinates ?? keyDesign.unpackKey(key, v);
			removeChildren(this, octant, x, y, z, level);

			// Remove the octant.
			grid.delete(key);

			// Recursively delete empty parent nodes.
			prune(this, x, y, z, level);

		}

	}

	/**
	 * Retrieves data from a specific octant.
	 *
	 * @param key - A packed key or key coordinates.
	 * @param level - The level of the octant.
	 * @return The data, or undefined if the octant doesn't exist.
	 */

	get(key: number | Vector3, level: number): T | null | undefined {

		const keyDesign = this.keyDesign;
		const grid = this.getGrid(level);

		if(typeof key !== "number") {

			key = keyDesign.packKey(key.x, key.y, key.z);

		}

		return grid.get(key)?.data;

	}

	/**
	 * Adds data to a specific octant.
	 *
	 * Missing intermediate octants will be created automatically.
	 *
	 * @param key - A packed key or key coordinates.
	 * @param level - The level of the octant.
	 * @param data - The data.
	 */

	set(key: number | Vector3, level: number, data: T | null): void {

		const keyDesign = this.keyDesign;
		const grid = this.getGrid(level);

		let keyCoordinates: Vector3 | null = null;

		if(typeof key !== "number") {

			keyCoordinates = key;
			key = keyDesign.packKey(key.x, key.y, key.z);

		}

		if(grid.has(key)) {

			const octant = grid.get(key);

			if(octant !== undefined) {

				octant.data = data;

			}

		} else {

			// Create the octant.
			const octant = (level === 0) ? new Octant<T>() : new IntermediateOctant<T>();

			octant.data = data;
			grid.set(key, octant);

			// Recursively create intermediate parent nodes.
			const { x, y, z } = keyCoordinates ?? keyDesign.unpackKey(key, v);
			createParents(this, x, y, z, level);

		}

	}

	/**
	 * Recursively collects nodes that intersect with the specified region.
	 *
	 * @param region - A region.
	 * @return The nodes.
	 */

	cull(region: BoxIntersector): OctantWrapper<T>[] {

		const result: OctantWrapper<T>[] = [];
		const octant = this.root.octant as IntermediateOctant<T>;
		cull(this, octant, 0, 0, 0, this.getLevels(), region, result);
		return result;

	}

	/**
	 * Finds nodes that intersect with the given ray. The intersecting nodes are sorted by distance, closest first.
	 *
	 * @param raycaster - A raycaster.
	 * @return The intersecting nodes.
	 */

	getIntersectingNodes(raycaster: Raycaster): OctantWrapper<T>[] {

		return OctreeRaycaster.intersectOctree(this, raycaster.ray);

	}

	/**
	 * Returns a new octree iterator.
	 *
	 * The octants returned by this iterator are augmented wrappers with explicit positional information.
	 *
	 * @see {@link OctantWrapper}
	 * @param level - The depth level.
	 * @return An octree iterator.
	 */

	octants(level = 0): OctreeIterator<T> {

		return new OctreeIterator(this, level);

	}

	/**
	 * Returns an iterator that returns all leaf nodes.
	 *
	 * @return An iterator.
	 */

	[Symbol.iterator](): Iterator<OctantWrapper<T>> {

		return this.octants();

	}

}
