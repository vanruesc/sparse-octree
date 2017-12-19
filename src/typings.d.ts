declare module 'sparse-octree' {
  import { Vector3, Frustum, Box3, Raycaster } from 'three';

  export class OctreeIterator<T> implements Iterator<T> {
    cull: boolean;
    region: Frustum | Box3;

    next(): IteratorResult<T>;
    reset(): OctreeIterator<T>;
    return(value: object): IteratorResult<T>;
  }

  export class Octant {
    children: Octant[];
    max: Vector3;
    min: Vector3;

    constructor(min?: Vector3, max?: Vector3);

    getCenter(target: Vector3): Vector3;
    getDimensions(target: Vector3): Vector3;
    split(): void;
  }

  export class CubicOctant extends Octant {
    children: CubicOctant[];
    size: number;

    constructor(min?: Vector3, size?: number);
  }

  export class PointOctant extends Octant {
    children: PointOctant[];
    data: any[];
    points: Vector3[];

    contains(point: Vector3, bias: number): boolean;
    distanceToCenterSquared(point: Vector3): number;
    distanceToSquared(point: Vector3): number;
    merge(): void;
    redistribute(bias: number): void;
  }

  export class Octree {
    children: Octant[];
    max: Vector3;
    min: Vector3;
    root: Octant;

    constructor(min?: Vector3, max?: Vector3);

    cull(region: Frustum | Box3): Octant[];
    findOctantsByLevel(level: number): Octant[];
    getCenter(target: Vector3): Vector3;
    getDepth(): number;
    getDimensions(target: Vector3): Vector3;
    leaves(region: Frustum | Box3): OctreeIterator<Octant>;
  }

  export class PointOctree<T = any> extends Octree {
    pointCount: number;
    root: PointOctant;

    constructor(min?: Vector3, max?: Vector3, bias?: number, maxPoints?: number, maxDepth?: number);

    countPoints(octant: Octant): number;
    fetch(point: Vector3): any;
    findNearestPoint(
      point: Vector3,
      maxDistance?: number,
      skipSelf?: boolean,
    ): PointResult<T> | null;
    findPoints(point: Vector3, radius: number, skipSelf?: boolean): PointResult<T>[];
    move(point: Vector3, position: Vector3): T | null;
    put(point: Vector3, data: any): boolean;
    raycast(
      raycaster: Raycaster,
      intersects?: RayPointIntersection<T>[],
    ): RayPointIntersection<T>[];
    remove(point: Vector3): T | null;
    testPoints(
      octants: Octant[],
      raycaster: Raycaster,
      intersects: RayPointIntersection<T>[],
    ): void;
  }

  export interface PointResult<T> {
    point: Vector3;
    data: T;
  }

  export class RayPointIntersection<T> {
    distance: number;
    distanceToRay: number;
    object: T;
    point: Vector3;

    constructor(distance: number, distanceToRay: number, point: Vector3, object?: T);
  }

  export class OctreeRaycaster<T> {
    static intersectOctree(octree: Octree, raycaster: Raycaster, intersects: Octant[]): void;
  }

  export class OctreeUtils {
    static recycleOctants(octant: Octant, octants: Octant[]): void;
  }
}