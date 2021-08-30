import {
	Event as Event3,
	PerspectiveCamera,
	sRGBEncoding,
	Vector3,
	WebGLRenderer
} from "three";

import { calculateVerticalFoV, DemoManager } from "three-demo";
import { PointOctreeDemo } from "./demos/PointOctreeDemo";

window.addEventListener("load", (event: Event) => {

	const debug = (window.location.hostname === "localhost");
	const viewport = document.getElementById("viewport");

	const renderer = new WebGLRenderer({
		powerPreference: "high-performance",
		antialias: true,
		stencil: false,
		alpha: false,
		depth: true
	});

	renderer.physicallyCorrectLights = true;
	renderer.outputEncoding = sRGBEncoding;
	renderer.debug.checkShaderErrors = debug;
	renderer.setSize(viewport.clientWidth, viewport.clientHeight);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setClearColor(0x000000, 0.0);

	const manager = new DemoManager(viewport, {
		aside: document.getElementById("aside"),
		renderer
	});

	const demo = new PointOctreeDemo();

	manager.addEventListener("change", (event: Event3) => {

		renderer.shadowMap.needsUpdate = true;
		document.querySelector(".loading").classList.remove("hidden");

	});

	manager.addEventListener("load", (event: Event3) => {

		document.querySelector(".loading").classList.add("hidden");

	});

	manager.addDemo(demo);

	window.addEventListener("resize", (event: Event) => {

		const width = window.innerWidth;
		const height = window.innerHeight;
		const camera = demo.getCamera() as PerspectiveCamera;

		if(camera !== null) {

			const aspect = Math.max(width / height, 16 / 9);
			const vFoV = calculateVerticalFoV(90, aspect);
			camera.fov = vFoV;

		}

		manager.setSize(width, height);

	});

	document.addEventListener("keyup", (event: KeyboardEvent) => {

		const p = new Vector3();
		const v = new Vector3();
		const controls = demo.controls;
		const aside = document.querySelector("aside");
		const footer = document.querySelector("footer");

		switch(event.key) {

			case "h":
				event.preventDefault();
				aside.classList.toggle("hidden");
				footer.classList.toggle("hidden");
				break;

			case "c":
				if(controls === null) { break; }
				console.log("Camera position", p.copy(controls.getPosition()));
				console.log("World direction", controls.getViewDirection(v));
				console.log("Target position", p.clone().add(v));
				break;

			case "i":
				console.log(renderer.info);
				break;

		}

	});

	requestAnimationFrame(function render(timestamp: number): void {

		requestAnimationFrame(render);
		manager.render(timestamp);

	});

});

document.addEventListener("DOMContentLoaded", (event: Event) => {

	const img = document.querySelector(".info img");
	const div = document.querySelector(".info div");

	if(img !== null && div !== null) {

		img.addEventListener("click", (event: Event) => {

			div.classList.toggle("hidden");

		});

	}

});
