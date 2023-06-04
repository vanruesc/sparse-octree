import { Vector3 } from "three";
import { Octant } from "../core/Octant.js";
import { PointData } from "./PointData.js";

const p = new Vector3();

/**
 * An octant that contains points.
 *
 * @param T - The type of the data.
 */

export class PointOctant<T> extends Octant<PointData<T>> {

	/**
	 * Constructs a new point octant.
	 *
	 * @param min - The lower bounds.
	 * @param max - The upper bounds.
	 */

	constructor(min: Vector3, max: Vector3) {

		super(min, max);

	}

	/**
	 * Calculates the squared distance from this octant to the given point.
	 *
	 * @param point - A point.
	 * @return The distance squared.
	 */

	distanceToSquared(point: Vector3): number {

		const clampedPoint = p.copy(point).clamp(this.min, this.max);
		return clampedPoint.sub(point).lengthSq();

	}

	/**
	 * Calculates the squared distance from the center of this octant to the given point.
	 *
	 * @param point - A point.
	 * @return The distance squared.
	 */

	distanceToCenterSquared(point: Vector3): number {

		const center = this.getCenter(p);

		const dx = point.x - center.x;
		const dy = point.y - center.x;
		const dz = point.z - center.z;

		return dx * dx + dy * dy + dz * dz;

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

	contains(point: Vector3, bias: number): boolean {

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

		if(children !== null && pointData !== null) {

			const points = pointData.points;
			const data = pointData.data;

			for(let i = 0, il = points.length; i < il; ++i) {

				const point = points[i];
				const entry = data[i];

				for(let j = 0, jl = children.length; j < jl; ++j) {

					const child = children[j] as PointOctant<T>;

					if(child.contains(point, bias)) {

						if(child.data === null) {

							child.data = new PointData<T>();

						}

						const childData = child.data;
						childData.points.push(point);
						childData.data.push(entry);

						break;

					}

				}

			}

			this.data = null;

		}

	}

	/**
	 * Deletes all child nodes and collects their points.
	 */

	merge(): void {

		const children = this.children;

		if(children !== null) {

			const pointData = new PointData<T>();

			for(let i = 0, l = children.length; i < l; ++i) {

				const child = children[i] as PointOctant<T>;
				const childData = child.data;

				if(childData !== null) {

					pointData.points = pointData.points.concat(childData.points);
					pointData.data = pointData.data.concat(childData.data);

				}

			}

			this.children = null;
			this.data = pointData;

		}

	}

}
