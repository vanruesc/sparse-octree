import {
	Box3,
	BufferGeometry,
	BufferAttribute,
	FogExp2,
	Group,
	Object3D,
	PerspectiveCamera,
	Points,
	PointsMaterial,
	Scene,
	Vector3,
	WebGLRenderer
} from "three";

import { Pane } from "tweakpane";
import { calculateVerticalFoV, OctreeRaycaster, FrustumCuller } from "./utils/index.js";
import { ControlMode, SpatialControls } from "spatial-controls";
import { OctreeHelper, PointOctree } from "sparse-octree";

function createParticlePlane(particles: number, n: number, zBase: number, zBias: number): BufferGeometry {

	const geometry = new BufferGeometry();
	const positions = new Float32Array(particles * 3);
	const halfN = n / 2;

	for(let i = 0, l = positions.length; i < l; i += 3) {

		const x = Math.random() * n - halfN;
		const y = Math.random() * n - halfN;
		const z = zBase + (Math.random() * zBias * 2 - zBias);

		positions[i] = x;
		positions[i + 1] = y;
		positions[i + 2] = z;

	}

	geometry.setAttribute("position", new BufferAttribute(positions, 3));
	return geometry;

}

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

	const container = document.querySelector(".viewport") as HTMLElement;
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
	controls.position.set(10, 6, 10);

	camera.updateMatrixWorld(); // Update for the first raycast operation.

	// Objects

	const points = new Group();

	let d = 8;
	const size = 6;
	const zStep = size / (d - 1);
	const w = 256, h = 256;
	let z = size * -0.5;

	console.log("Generating %d points", w * h * d);
	console.time("Point cloud creation");

	while(d-- > 0) {

		points.add(new Points(
			createParticlePlane(w * h, size, z, 0.25),
			new PointsMaterial({
				color: 0xc00000,
				sizeAttenuation: false
			})
		));

		z += zStep;

	}

	console.timeEnd("Point cloud creation");
	scene.add(points);

	// Octree

	const v = new Vector3();
	const bbox = new Box3();
	bbox.setFromObject(scene);

	const octree = new PointOctree<Object3D>(bbox.min, bbox.max, 0.0, 8, 5);

	console.time("Octree creation");

	for(let i = points.children.length - 1; i >= 0; --i) {

		const p = points.children[i] as Points;
		const array = p.geometry.getAttribute("position").array;

		for(let j = 0, l = array.length; j < l; j += 3) {

			octree.set(v.fromArray(array, j), p);

		}

	}

	console.timeEnd("Octree creation");
	console.log(octree);

	// Octree Helper

	console.time("Octree helper");

	const octreeHelper = new OctreeHelper(octree);
	octreeHelper.visible = false;

	console.timeEnd("Octree helper");
	console.log(octreeHelper);

	scene.add(octreeHelper);

	// Raycasting

	const octreeRaycaster = new OctreeRaycaster(octree, camera, points, renderer.domElement);
	scene.add(octreeRaycaster.cursor);

	// Frustum culling

	const frustumCuller = new FrustumCuller(octree);
	scene.add(frustumCuller.getCameraHelper());
	scene.add(frustumCuller.getMesh());

	// Settings

	const pane = new Pane({ container: container.querySelector(".tp") as HTMLElement });

	octreeRaycaster.registerOptions(pane);
	frustumCuller.registerOptions(pane);

	const params = {
		"level mask": octreeHelper.children.length
	};

	let folder = pane.addFolder({ title: "Points" });
	folder.addInput(points, "visible");

	folder = pane.addFolder({ title: "Octree Helper", expanded: false });
	folder.addInput(octreeHelper, "visible");

	folder.addInput(params, "level mask", { min: 0, max: octreeHelper.children.length, step: 1 }).on("change", () => {

		for(let i = 0, l = octreeHelper.children.length; i < l; ++i) {

			octreeHelper.children[i].visible = (
				params["level mask"] === octreeHelper.children.length ||
				params["level mask"] === i
			);

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
