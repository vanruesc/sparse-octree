import {
	BufferAttribute,
	BufferGeometry,
	Box3,
	FogExp2,
	Object3D,
	PerspectiveCamera,
	Points,
	PointsMaterial,
	Vector3
} from "three";

import { GUI } from "dat.gui";
import { SpatialControls } from "spatial-controls";
import { OctreeHelper } from "octree-helper";
import { Demo } from "three-demo";
import { PointOctree } from "../../../src";
import { OctreeRaycaster } from "./OctreeRaycaster.js";
import { FrustumCuller } from "./FrustumCuller.js";

/**
 * A point octree demo application.
 */

export class PointOctreeDemo extends Demo {

	/**
	 * The controls.
	 */

	private controls: SpatialControls;

	/**
	 * A point cloud.
	 */

	private points: Points;

	/**
	 * An octree helper.
	 */

	private octreeHelper: OctreeHelper;

	/**
	 * An octree raycaster.
	 */

	private octreeRaycaster: OctreeRaycaster;

	/**
	 * A frustum culler.
	 */

	private frustumCuller: FrustumCuller;

	/**
	 * Constructs a new demo.
	 */

	constructor() {

		super("point-octree");

		this.controls = null;
		this.points = null;
		this.octreeHelper = null;
		this.octreeRaycaster = null;
		this.frustumCuller = null;

	}

	initialize(): void {

		const scene = this.scene;
		const renderer = this.renderer;

		// Camera

		const aspect = window.innerWidth / window.innerHeight;
		const camera = new PerspectiveCamera(50, aspect, 0.3, 2000);
		this.camera = camera;

		// Controls

		const controls = new SpatialControls(camera.position, camera.quaternion, renderer.domElement);
		const settings = controls.settings;
		settings.general.setMode(ControlMode.THIRD_PERSON);
		settings.zoom.setRange(0.0, 60.0);
		settings.rotation.setSensitivity(2.2);
		settings.zoom.setSensitivity(1.0);
		this.controls = controls;

		camera.updateMatrixWorld();

		// Fog

		scene.fog = new FogExp2(0x0d0d0d, 0.025);
		renderer.setClearColor(scene.fog.color);

		// Points

		const points = (function generatePoints() {

			function createPlaneGeometry(particles, n, zBase, zBias) {

				const geometry = new BufferGeometry();
				const positions = new Float32Array(particles * 3);
				const n2 = n / 2;

				for(let i = 0, l = positions.length; i < l; i += 3) {

					const x = Math.random() * n - n2;
					const y = Math.random() * n - n2;
					const z = zBase + (Math.random() * zBias * 2 - zBias);

					positions[i] = x;
					positions[i + 1] = y;
					positions[i + 2] = z;

				}

				geometry.setAttribute("position", new BufferAttribute(positions, 3));

				return geometry;

			}

			const points = new Object3D();

			const w = 256;
			const h = 256;

			let d = 8;

			const size = 6;
			const zStep = size / (d - 1);

			let z = size * -0.5;
			let p;

			let material = new PointsMaterial({
				color: 0xc00000,
				sizeAttenuation: false,
				size: 1
			});

			console.log("Generating", w * h * d, "points...");

			while(d-- > 0) {

				p = new Points(createPlaneGeometry(w * h, size, z, 0.25), material);
				material = material.clone();
				z += zStep;

				points.add(p);

			}

			return points;

		}());

		this.points = points;
		scene.add(points);

		// Octree

		const octree = (function createOctree(points) {

			const v = new Vector3();
			const bbox = new Box3();
			bbox.setFromObject(scene);

			const t0 = performance.now();
			const octree = new PointOctree(bbox.min, bbox.max, 0.0, 8, 5);

			for(let d = points.children.length - 1; d >= 0; --d) {

				const p = points.children[d];
				const array = p.geometry.getAttribute("position").array;

				for(let i = 0, l = array.length; i < l; i += 3) {

					octree.insert(v.fromArray(array, i), p);

				}

			}

			console.log("Octree:", octree, "created in", (performance.now() - t0).toFixed(2) + " ms");

			return octree;

		}(points));

		// Octree Helper

		const octreeHelper = (function createOctreeHelper(octree) {

			const t0 = performance.now();
			const octreeHelper = new OctreeHelper(octree);
			octreeHelper.visible = false;

			console.log("OctreeHelper:", octreeHelper, "created in", (performance.now() - t0).toFixed(2) + " ms");

			return octreeHelper;

		}(octree));

		this.octreeHelper = octreeHelper;
		scene.add(octreeHelper);

		// Raycasting

		this.raycaster = new OctreeRaycaster(octree, camera, points);
		renderer.domElement.addEventListener("mousemove", this.raycaster, { passive: true });
		scene.add(this.raycaster.selectedPoint);

		// Frustum culling

		this.frustumCuller = new FrustumCuller(octree, scene);
		scene.add(this.frustumCuller.cameraHelper);

	}

	update(deltaTime: number, timestamp: number): void {

		this.controls.update(timestamp);

	}

	/**
	 * Registers configuration options.
	 *
	 * @param menu - A menu.
	 */

	registerOptions(menu: GUI): void {

		const points = this.points;
		const octreeHelper = this.octreeHelper;

		this.raycaster.registerOptions(menu);
		this.frustumCuller.registerOptions(menu);

		const params = {
			"level mask": octreeHelper.children.length
		};

		let folder = menu.addFolder("Points");
		folder.add(points, "visible");
		folder.open();

		folder = menu.addFolder("Octree Helper");
		folder.add(octreeHelper, "visible");

		folder.add(params, "level mask").min(0).max(octreeHelper.children.length).step(1).onChange(() => {

			for(let i = 0, l = octreeHelper.children.length; i < l; ++i) {

				octreeHelper.children[i].visible = (
					params["level mask"] === octreeHelper.children.length ||
					i === params["level mask"]
				);

			}

		});

		folder.open();

	}

	dispose() {

		this.renderer.domElement.removeEventListener("mousemove", this.raycaster);

	}

}
