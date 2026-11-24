import { Octant } from "../core/Octant.js";
import { Vector3 } from "../math/Vector3.js";
import { Vector3Like } from "../math/Vector3Like.js";
import { PointData } from "./PointData.js";

const p = /* @__PURE__ */ new Vector3();

/**
 * An octant that contains points.
 *
 * @param T - The type of the data.
 */

export class PointOctant<T = unknown> extends Octant<PointData<T>> {

	/**
	 * Constructs a new point octant.
	 *
	 * @param min - The lower bounds.
	 * @param max - The upper bounds.
	 */

	constructor(min: Vector3Like, max: Vector3Like) {

		super(min, max);

	}

	/**
	 * Calculates the squared distance from this octant to the given point.
	 *
	 * @param point - A point.
	 * @return The distance squared.
	 */

	distanceToSquared(point: Vector3Like): number {

		const { min, max } = this;
		const clampedPoint = p.set(
			Math.max(min.x, Math.min(max.x, point.x)),
			Math.max(min.y, Math.min(max.y, point.y)),
			Math.max(min.z, Math.min(max.z, point.z))
		);
		return Vector3.distanceToSquared(clampedPoint, point);

	}

	/**
	 * Calculates the squared distance from the center of this octant to the given point.
	 *
	 * @param point - A point.
	 * @return The distance squared.
	 */

	distanceToCenterSquared(point: Vector3Like): number {

		return Vector3.distanceToSquared(point, this.getCenter(p));

	}

	/**
	 * Checks if the given point lies inside this octant's boundaries.
	 *
	 * This method can also be used to check if this octant intersects a sphere by providing a radius as bias.
	 *
	 * @param point - A point.
	 * @param bias - A padding that extends the boundaries temporarily.
	 * @return Whether the given point lies inside this octant.
	 */

	contains(point: Vector3Like, bias: number): boolean {

		const min = this.min;
		const max = this.max;

		return (
			point.x >= min.x - bias &&
			point.y >= min.y - bias &&
			point.z >= min.z - bias &&
			point.x <= max.x + bias &&
			point.y <= max.y + bias &&
			point.z <= max.z + bias
		);

	}

	/**
	 * Redistributes the points of this octant to its children.
	 *
	 * Has no effect if there are no points or if this octant has no children.
	 *
	 * @param bias - A proximity threshold.
	 */

	redistribute(bias: number): void {

		const children = this.children;
		const pointData = this.data;

		if(children === null || pointData === null) {

			return;

		}

		const points = pointData.points;
		const data = pointData.data;

		for(let i = 0, il = points.length; i < il; ++i) {

			const point = points[i];
			const entry = data[i];

			for(let j = 0, jl = children.length; j < jl; ++j) {

				const child = children[j] as PointOctant<T>;

				if(child.contains(point, bias)) {

					child.data ??= new PointData<T>();

					const childData = child.data;
					childData.points.push(point);
					childData.data.push(entry);

					break;

				}

			}

		}

		this.data = null;

	}

	/**
	 * Deletes all child nodes and collects their points.
	 */

	merge(): void {

		const children = this.children;

		if(children === null) {

			return;

		}

		const pointData = new PointData<T>();

		for(let i = 0, l = children.length; i < l; ++i) {

			(children[i] as PointOctant<T>).merge();
			const childData = children[i].data;

			if(childData !== null) {

				pointData.points = pointData.points.concat(childData.points);
				pointData.data = pointData.data.concat(childData.data);

			}

		}

		this.children = null;
		this.data = pointData;

	}

}
