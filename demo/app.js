import {
	BufferAttribute,
	BufferGeometry,
	Box3,
	FogExp2,
	Object3D,
	OrbitControls,
	PerspectiveCamera,
	Points,
	PointsMaterial,
	Scene,
	Vector3,
	WebGLRenderer
} from "three";

import dat from "dat.gui";
import OctreeHelper from "octree-helper";
import Stats from "stats.js";

import { PointOctree } from "../src";
import { OctreeRaycaster } from "./OctreeRaycaster.js";
import { FrustumCuller } from "./FrustumCuller.js";

/**
 * A demo application.
 */

export class App {

	/**
	 * Initialises the demo.
	 *
	 * @param {HTMLElement} viewport - The viewport.
	 * @param {HTMLElement} aside - A secondary container.
	 */

	static initialise(viewport, aside) {

		const width = window.innerWidth;
		const height = window.innerHeight;
		const aspect = width / height;

		// Scene.

		const scene = new Scene();
		scene.fog = new FogExp2(0x0d0d0d, 0.025);

		// Renderer.

		const renderer = new WebGLRenderer({
			logarithmicDepthBuffer: true,
			antialias: true
		});

		renderer.setSize(width, height);
		renderer.setClearColor(scene.fog.color);
		renderer.setPixelRatio(window.devicePixelRatio);
		viewport.appendChild(renderer.domElement);

		// Camera.

		const camera = new PerspectiveCamera(50, aspect, 0.1, 200);
		const controls = new OrbitControls(camera, renderer.domElement);
		controls.target.set(0, 0, 0);
		controls.maxDistance = 60;
		camera.position.set(10, 6, 10);
		camera.lookAt(controls.target);

		// Overlays.

		const stats = new Stats();
		stats.showPanel(0);
		stats.dom.id = "stats";
		aside.appendChild(stats.dom);

		const gui = new dat.GUI();
		aside.appendChild(gui.domElement.parentNode);

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

					octree.add(v.fromArray(array, i), p);

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

		scene.add(octreeHelper);

		// Raycasting.

		const raycaster = new OctreeRaycaster(octree, camera, points);
		raycaster.configure(gui);

		viewport.addEventListener("mousemove", function onMouseMove(event) { raycaster.raycast(event); });

		scene.add(raycaster.selectedPoint);

		// Frustum culling.

		const frustumCuller = new FrustumCuller(octree, scene);
		frustumCuller.configure(gui);

		scene.add(frustumCuller.cameraHelper);

		// Additional Configurations.

		(function(gui, octreeHelper, points) {

			const params = {
				"level mask": octreeHelper.children.length
			};

			let folder = gui.addFolder("Points");
			folder.add(points, "visible");
			folder.open();

			folder = gui.addFolder("Octree Helper");
			folder.add(octreeHelper, "visible");

			folder.add(params, "level mask").min(0).max(octreeHelper.children.length).step(1).onChange(function() {

				let i, l;

				for(i = 0, l = octreeHelper.children.length; i < l; ++i) {

					octreeHelper.children[i].visible = (params["level mask"] === octreeHelper.children.length || i === params["level mask"]);

				}

			});

			folder.open();

		}(gui, octreeHelper, points));

		/**
		 * Toggles the visibility of the interface on alt key press.
		 *
		 * @private
		 * @param {Event} event - An event.
		 */

		document.addEventListener("keydown", function onKeyDown(event) {

			if(event.altKey) {

				event.preventDefault();
				aside.style.visibility = (aside.style.visibility === "hidden") ? "visible" : "hidden";

			}

		});

		/**
		 * Handles browser resizing.
		 *
		 * @private
		 * @param {Event} event - An event.
		 */

		window.addEventListener("resize", function onresize(event) {

			const width = event.target.innerWidth;
			const height = event.target.innerHeight;

			renderer.setSize(width, height);
			camera.aspect = width / height;
			camera.updateProjectionMatrix();

		});

		/**
		 * The main render loop.
		 *
		 * @private
		 * @param {DOMHighResTimeStamp} now - An execution timestamp.
		 */

		(function render(now) {

			requestAnimationFrame(render);

			stats.begin();

			renderer.render(scene, camera);

			stats.end();

		}());

	}

}
