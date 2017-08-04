import { Clock, WebGLRenderer } from "three";
import dat from "dat.gui";
import Stats from "stats.js";

import { PointOctreeDemo } from "./demos/PointOctreeDemo.js";

/**
 * A demo application.
 */

export class App {

	/**
	 * Constructs a new demo application.
	 */

	constructor() {

		/**
		 * A clock.
		 *
		 * @type {Clock}
		 * @private
		 */

		this.clock = new Clock();

		/**
		 * A renderer.
		 *
		 * @type {WebGLRenderer}
		 * @private
		 */

		this.renderer = new WebGLRenderer({
			logarithmicDepthBuffer: true,
			antialias: true
		});

		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setClearColor(0x000000);
		this.renderer.setPixelRatio(window.devicePixelRatio);

		/**
		 * Statistics.
		 *
		 * @type {Stats}
		 * @private
		 */

		this.stats = (function() {

			const stats = new Stats();
			stats.showPanel(0);
			stats.dom.id = "stats";

			return stats;

		}());

		/**
		 * Available demos.
		 *
		 * @type {Map}
		 * @private
		 */

		this.demos = (function(renderer) {

			const demos = new Map();

			demos.set("point-octree", new PointOctreeDemo(renderer));

			return demos;

		}(this.renderer));

		/**
		 * The key of the current demo.
		 *
		 * @type {String}
		 * @private
		 */

		this.key = (function(demos) {

			let key = window.location.hash.slice(1);

			if(key.length === 0 || !demos.has(key)) {

				key = demos.keys().next().value;

			}

			return key;

		}(this.demos));

	}

	/**
	 * Initialises the demo.
	 *
	 * @param {HTMLElement} viewport - The viewport.
	 * @param {HTMLElement} aside - A secondary DOM container.
	 * @param {HTMLElement} loadingMessage - A loading message.
	 */

	initialise(viewport, aside, loadingMessage) {

		const app = this;

		const renderer = this.renderer;
		const clock = this.clock;
		const stats = this.stats;
		const demos = this.demos;

		let demo = null;
		let gui = null;

		viewport.appendChild(renderer.domElement);
		aside.appendChild(stats.dom);

		/**
		 * Activates the currently selected demo.
		 *
		 * @private
		 */

		function activateDemo() {

			demo.initialise();

			demo.camera.aspect = window.innerWidth / window.innerHeight;
			demo.camera.updateProjectionMatrix();

			gui = new dat.GUI({ autoPlace: false });
			gui.add(app, "key", Array.from(demos.keys())).onChange(loadDemo);
			demo.configure(gui);
			aside.appendChild(gui.domElement);

			loadingMessage.style.display = "none";
			renderer.domElement.style.visibility = "visible";

		}

		/**
		 * Loads the currently selected demo.
		 *
		 * @private
		 */

		function loadDemo() {

			const size = renderer.getSize();

			loadingMessage.style.display = "block";
			renderer.domElement.style.visibility = "hidden";

			if(gui !== null) {

				gui.destroy();
				aside.removeChild(gui.domElement);

			}

			if(demo !== null) {

				demo.reset();
				renderer.setSize(size.width, size.height);

			}

			demo = demos.get(app.key);
			demo.load(activateDemo);

		}

		loadDemo();

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

		window.addEventListener("resize", (function() {

			let id = 0;

			function handleResize(event) {

				const width = event.target.innerWidth;
				const height = event.target.innerHeight;

				renderer.setSize(width, height);
				demo.camera.aspect = width / height;
				demo.camera.updateProjectionMatrix();

				id = 0;

			}

			return function onResize(event) {

				if(id === 0) {

					id = setTimeout(handleResize, 66, event);

				}

			};

		}()));

		/**
		 * The main render loop.
		 *
		 * @private
		 * @param {DOMHighResTimeStamp} now - An execution timestamp.
		 */

		(function render(now) {

			const delta = clock.getDelta();

			requestAnimationFrame(render);

			stats.begin();

			demo.render(delta);

			stats.end();

		}());

	}

}
