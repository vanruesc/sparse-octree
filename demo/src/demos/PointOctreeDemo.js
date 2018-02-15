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

import { DeltaControls } from "delta-controls";
import OctreeHelper from "octree-helper";
import { Demo } from "three-demo";
import { PointOctree } from "../../../src";
import { OctreeRaycaster } from "./OctreeRaycaster.js";
import { FrustumCuller } from "./FrustumCuller.js";

/**
 * A point octree demo application.
 */

export class PointOctreeDemo extends Demo {

	/**
	 * Constructs a new demo.
	 */

	constructor() {

		super("point-octree");

		/**
		 * A point cloud.
		 *
		 * @type {Points}
		 * @private
		 */

		this.points = null;

		/**
		 * An octree helper.
		 *
		 * @type {OctreeHelper}
		 * @private
		 */

		this.octreeHelper = null;

		/**
		 * An octree raycaster.
		 *
		 * @type {OctreeRaycaster}
		 * @private
		 */

		this.octreeRaycaster = null;

		/**
		 * A frustum culler.
		 *
		 * @type {FrustumCuller}
		 * @private
		 */

		this.frustumCuller = null;

	}

	/**
	 * Creates the scene.
	 */

	initialize() {

		const scene = this.scene;
		const renderer = this.renderer;

		// Camera.

		const camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 200);
		camera.position.set(10, 6, 10);
		this.camera = camera;

		// Controls.

		const controls = new DeltaControls(camera.position, camera.quaternion, renderer.domElement);
		controls.settings.pointer.lock = false;
		controls.settings.zoom.maxDistance = 60.0;
		controls.settings.sensitivity.translation = 10.0;
		controls.settings.sensitivity.zoom = 1.0;
		controls.lookAt(scene.position);
		this.controls = controls;

		// Fog.

		scene.fog = new FogExp2(0x0d0d0d, 0.025);
		renderer.setClearColor(scene.fog.color);

		// Points.

		const points = (function generatePoints() {

			function createPlaneGeometry(particles, n, zBase, zBias) {

				const geometry = new BufferGeometry();
				const positions = new Float32Array(particles * 3);
				const n2 = n / 2;

				let x, y, z, i, l;

				for(i = 0, l = positions.length; i < l; i += 3) {

					x = Math.random() * n - n2;
					y = Math.random() * n - n2;
					z = zBase + (Math.random() * zBias * 2 - zBias);

					positions[i] = x;
					positions[i + 1] = y;
					positions[i + 2] = z;

				}

				geometry.addAttribute("position", new BufferAttribute(positions, 3));

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

		// Octree.

		const octree = (function createOctree(points) {

			const v = new Vector3();
			const bbox = new Box3();
			bbox.setFromObject(scene);

			const t0 = performance.now();

			let d, p, i, l;
			let array;

			const octree = new PointOctree(bbox.min, bbox.max, 0.0, 8, 5);

			for(d = points.children.length - 1; d >= 0; --d) {

				p = points.children[d];
				array = p.geometry.getAttribute("position").array;

				for(i = 0, l = array.length; i < l; i += 3) {

					octree.put(v.fromArray(array, i), p);

				}

			}

			console.log("Octree:", octree, "created in", (performance.now() - t0).toFixed(2) + " ms");

			return octree;

		}(points));

		// Octree Helper.

		const octreeHelper = (function createOctreeHelper(octree) {

			const t0 = performance.now();
			const octreeHelper = new OctreeHelper(octree);
			octreeHelper.visible = false;

			console.log("OctreeHelper:", octreeHelper, "created in", (performance.now() - t0).toFixed(2) + " ms");

			return octreeHelper;

		}(octree));

		this.octreeHelper = octreeHelper;
		scene.add(octreeHelper);

		// Raycasting.

		this.raycaster = new OctreeRaycaster(octree, camera, points);

		renderer.domElement.addEventListener("mousemove", this.raycaster);
		scene.add(this.raycaster.selectedPoint);

		// Frustum culling.

		this.frustumCuller = new FrustumCuller(octree, scene);

		scene.add(this.frustumCuller.cameraHelper);

	}

	/**
	 * Renders this demo.
	 *
	 * @param {Number} delta - The time since the last frame in seconds.
	 */

	render(delta) {

		this.controls.update(delta);

		super.render(delta);

	}

	/**
	 * Registers configuration options.
	 *
	 * @param {GUI} menu - A menu.
	 */

	registerOptions(menu) {

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

		folder.add(params, "level mask").min(0).max(octreeHelper.children.length).step(1).onChange(function() {

			let i, l;

			for(i = 0, l = octreeHelper.children.length; i < l; ++i) {

				octreeHelper.children[i].visible = (params["level mask"] === octreeHelper.children.length || i === params["level mask"]);

			}

		});

		folder.open();

	}

	/**
	 * Resets this demo.
	 *
	 * @return {Demo} This demo.
	 */

	reset() {

		super.reset();

		this.composer.renderer.domElement.removeEventListener("mousemove", this.raycaster);

		return this;

	}

}
