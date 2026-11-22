import {
	Box3,
	FogExp2,
	PerspectiveCamera,
	Scene,
	WebGLRenderer
} from "three";

import { Pane } from "tweakpane";
import { OctreeHelper } from "octree-helper";
import { ControlMode, SpatialControls } from "spatial-controls";
import { calculateVerticalFoV, OctreeRaycaster, FrustumCuller } from "./utils/index.js";
import { KeyDesign, Octree } from "linear-octree";

window.addEventListener("load", () => {

	document.querySelector(".loading")?.classList.add("hidden");

	// Renderer

	const renderer = new WebGLRenderer({
		powerPreference: "high-performance",
		antialias: true,
		stencil: false,
		depth: true
	});

	renderer.debug.checkShaderErrors = (window.location.hostname === "localhost");
	renderer.setClearColor(0x000000, 0);

	const container = document.querySelector(".viewport")!;
	container.append(renderer.domElement);

	// Scene

	const scene = new Scene();
	scene.fog = new FogExp2(0x0d0d0d, 0.025);
	renderer.setClearColor(scene.fog.color);

	// Camera & Controls

	const camera = new PerspectiveCamera();
	const { position, quaternion } = camera;
	const controls = new SpatialControls(position, quaternion, renderer.domElement);
	const settings = controls.settings;
	settings.general.mode = ControlMode.THIRD_PERSON;
	settings.zoom.setRange(1e-6, 60);
	settings.rotation.sensitivity = 2.2;
	settings.rotation.damping = 0.05;
	settings.translation.sensitivity = 0.25;
	settings.translation.damping = 0.1;
	settings.zoom.sensitivity = 1;
	settings.zoom.damping = 0.1;
	controls.position.set(5, 2, 3);

	camera.updateMatrixWorld(); // Update for the first raycast operation.

	// Octree

	const keyDesign = new KeyDesign(3, 3, 3);
	const bounds = new Box3();
	bounds.min.set(-1, -1, -1);
	bounds.max.set(1, 1, 1);
	// Alternative:
	// const cellSize = new Vector3(0.25, 0.25, 0.25);
	// const bounds = keyDesign.calculateBounds(cellSize, new Box3());

	const octree = new Octree<number>(bounds, keyDesign);
	console.log(octree);

	function fillOctree() {

		const box = new Box3();
		keyDesign.getMinKeyCoordinates(box.min);
		keyDesign.getMaxKeyCoordinates(box.max);

		console.time("Filling octree");

		// Populate all cells for demo purposes.
		for(const key of keyDesign.keyRange(box.min, box.max)) {

			octree.set(key, 0, Math.random());

		}

		console.timeEnd("Filling octree");

	}

	fillOctree();

	// Octree Helper

	console.time("Creating octree helper");

	const octreeHelper = new OctreeHelper(octree);
	octreeHelper.visible = true;

	console.timeEnd("Creating octree helper");
	console.log(octreeHelper);

	scene.add(octreeHelper);

	keyDesign.addEventListener(KeyDesign.EVENT_CHANGE, () => {

		fillOctree();
		octreeHelper.update();

	});

	// Raycasting

	const octreeRaycaster = new OctreeRaycaster(octree, camera, renderer.domElement);
	scene.add(octreeRaycaster.getMesh());

	// Frustum culling

	const frustumCuller = new FrustumCuller(octree);
	scene.add(frustumCuller.getCameraHelper());
	scene.add(frustumCuller.getMesh());

	// Settings

	const pane = new Pane({ container: container.querySelector<HTMLElement>(".tp")! });
	const folder = pane.addFolder({ title: "Settings" });

	octreeRaycaster.registerOptions(folder);
	frustumCuller.registerOptions(folder);

	const maxLevels = 4;
	const params = {
		"level mask": maxLevels + 1,
		"bits": {
			"x": keyDesign.x,
			"y": keyDesign.y,
			"z": keyDesign.z
		}
	};

	let subfolder = folder.addFolder({ title: "Key Design", expanded: false });
	subfolder.addBinding(params.bits, "x", { min: 0, max: maxLevels, step: 1 })
		.on("change", () => keyDesign.set(params.bits.x, params.bits.y, params.bits.z));
	subfolder.addBinding(params.bits, "y", { min: 0, max: maxLevels, step: 1 })
		.on("change", () => keyDesign.set(params.bits.x, params.bits.y, params.bits.z));
	subfolder.addBinding(params.bits, "z", { min: 0, max: maxLevels, step: 1 })
		.on("change", () => keyDesign.set(params.bits.x, params.bits.y, params.bits.z));

	subfolder = folder.addFolder({ title: "Octree Helper" });
	subfolder.addBinding(octreeHelper, "visible");

	subfolder.addBinding(params, "level mask", { min: 0, max: maxLevels + 1, step: 1 }).on("change", () => {

		const mask = params["level mask"];
		const levels = octreeHelper.children.length;

		for(let i = 0, l = levels; i < l; ++i) {

			octreeHelper.children[i].visible = (mask >= levels || mask === i);

		}

	});

	// Resize Handler

	function onResize() {

		const width = container.clientWidth, height = container.clientHeight;
		camera.aspect = width / height;
		camera.fov = calculateVerticalFoV(90, Math.max(camera.aspect, 16 / 9));
		camera.updateProjectionMatrix();
		renderer.setSize(width, height);

	}

	window.addEventListener("resize", onResize);
	onResize();

	// Render Loop

	requestAnimationFrame(function render(timestamp: number): void {

		controls.update(timestamp);
		renderer.render(scene, camera);
		requestAnimationFrame(render);

	});

});
