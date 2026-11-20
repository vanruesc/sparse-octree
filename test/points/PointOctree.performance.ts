import { it } from "node:test";
import assert from "node:assert/strict";
import { isDeepStrictEqual } from "node:util";
import { Raycaster, Vector3 } from "three";
import { PointData, PointOctree, RayPointIntersection } from "sparse-octree";

// After pnpm build:js, run:
// RUN_RAYCAST_BENCHMARK=1 node --test --test-isolation=none test/points/PointOctree.performance.ts
const runBenchmark = process.env.RUN_RAYCAST_BENCHMARK === "1" && process.env.CI === undefined;

function raycastNominal(octree: PointOctree<number>, raycaster: Raycaster): RayPointIntersection<number>[] {

	// The centerline traversal can miss valid hits in neighboring or biased octants.
	const result: RayPointIntersection<number>[] = [];

	for(const octant of octree.getIntersectingNodes(raycaster)) {

		octant.data?.testPoints(raycaster, result);

	}

	return result.sort((a, b) => a.distance - b.distance);

}

function measure(rays: Raycaster[], raycast: (ray: Raycaster) => RayPointIntersection<number>[]): string {

	const warmupRounds = 4;
	const measuredRounds = 7;
	const samples: number[] = [];

	let hits = 0;

	for(let round = 0; round < warmupRounds + measuredRounds; ++round) {

		let roundHits = 0;
		const start = performance.now();

		for(const ray of rays) {

			roundHits += raycast(ray).length;

		}

		const elapsed = performance.now() - start;

		if(round >= warmupRounds) {

			samples.push(1000 * elapsed / rays.length);
			hits += roundHits;

		}

	}

	samples.sort((a, b) => a - b);
	const median = samples[Math.floor(samples.length / 2)];
	const hitsPerRay = hits / (measuredRounds * rays.length);

	return `${median.toFixed(1)} µs/ray, ${hitsPerRay.toFixed(1)} hits/ray`;

}

it("benchmarks PointOctree raycasting", { skip: !runBenchmark }, (t) => {

	const pointCount = 100_000;
	const rayCount = 512;
	const min = new Vector3(-1, -1, -1);
	const max = new Vector3(1, 1, 1);
	const pointData = new PointData<number>();

	let seed = 0x0c7ee;

	function random(): number {

		seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
		return seed / 4294967296;

	}

	for(let i = 0; i < pointCount; ++i) {

		pointData.points.push(new Vector3(2 * random() - 1, 2 * random() - 1, 2 * random() - 1));
		pointData.data.push(i);

	}

	const rays = Array.from({ length: rayCount }, () => new Raycaster(
		new Vector3(random() - 0.5, random() - 0.5, 2),
		new Vector3(0.3 * (random() - 0.5), 0.3 * (random() - 0.5), -1).normalize()
	));

	t.diagnostic(`${pointCount} seeded points, ${rayCount} rays, median of 7 measured rounds`);

	const octrees = [0, 0.025].map(bias => {

		const octree = new PointOctree<number>(min, max, bias);

		for(let i = 0; i < pointCount; ++i) {

			octree.set(pointData.points[i], pointData.data[i]);

		}

		return octree;

	});

	for(const threshold of [0.005, 0.025, 0.1]) {

		// Both trees contain the same points, so they share the same brute-force reference.
		const reference = rays.map(ray => {

			ray.params.Points.threshold = threshold;

			const hits: RayPointIntersection<number>[] = [];
			pointData.testPoints(ray, hits);
			return new Set(hits.map(hit => hit.data));

		});

		const referenceHitsPerRay = reference.reduce((total, ids) => total + ids.size, 0) / rayCount;

		for(const octree of octrees) {

			const bias = octree.getBias();
			const raycastCenterline = (ray: Raycaster) => raycastNominal(octree, ray);
			const raycastPadded = (ray: Raycaster) => octree.raycast(ray);
			const centerline = measure(rays, raycastCenterline);
			const padded = measure(rays, raycastPadded);

			let centerlineMatches = 0;
			let paddedMatches = 0;

			// Compare point IDs on every ray outside the timed rounds.
			for(let i = 0; i < rayCount; ++i) {

				const ray = rays[i];
				const expectedIds = reference[i];
				const centerlineHits = raycastCenterline(ray);
				const paddedHits = raycastPadded(ray);

				if(centerlineHits.length === expectedIds.size &&
					isDeepStrictEqual(new Set(centerlineHits.map(hit => hit.data)), expectedIds)) {

					++centerlineMatches;

				}

				if(paddedHits.length === expectedIds.size &&
					isDeepStrictEqual(new Set(paddedHits.map(hit => hit.data)), expectedIds)) {

					++paddedMatches;

				}

			}

			t.diagnostic(`bias ${bias}, threshold ${threshold} | centerline ${centerline} | padded ${padded} | ` +
				`brute-force reference ${referenceHitsPerRay.toFixed(1)} hits/ray`);

			t.diagnostic("  Rays with exactly the brute-force hit IDs | " +
				`centerline ${centerlineMatches}/${rayCount} | padded ${paddedMatches}/${rayCount}`);
			assert.equal(paddedMatches, rayCount, `padded hit mismatch at bias ${bias}, threshold ${threshold}`);

		}

	}

});
