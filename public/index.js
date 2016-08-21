(function() { "use strict";

	/**
	 * Loads assets.
	 *
	 * @method loadAssets
	 */

	window.addEventListener("load", function loadAssets() {

		window.removeEventListener("load", loadAssets);

		const loadingManager = new THREE.LoadingManager();

		const assets = {};

		loadingManager.onProgress = function(item, loaded, total) {

			if(loaded === total) { setupScene(assets); }

		};

		setupScene(assets);

	});

	/**
	 * Creates the scene and initiates the render loop.
	 *
	 * @method setupScene
	 * @param {Object} assets - Preloaded assets.
	 */

	function setupScene(assets) {

		const viewport = document.getElementById("viewport");
		viewport.removeChild(viewport.children[0]);

		// Renderer and Scene.

		const renderer = new THREE.WebGLRenderer({antialias: true, logarithmicDepthBuffer: true});
		renderer.setClearColor(0x000000);
		renderer.setSize(window.innerWidth, window.innerHeight);
		viewport.appendChild(renderer.domElement);

		const scene = new THREE.Scene();

		// Camera.

		const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
		const controls = new THREE.OrbitControls(camera, renderer.domElement);
		controls.target.set(0, 0, 0);
		controls.maxDistance = 15;
		camera.position.set(5, 6, 8);
		camera.lookAt(controls.target);

		scene.add(camera);

		// Overlays.

		const stats = new Stats();
		stats.showPanel(0);
		stats.dom.id = "stats";
		const aside = document.getElementById("aside");
		aside.style.visibility = "visible";
		aside.appendChild(stats.dom);

		const gui = new dat.GUI();
		aside.appendChild(gui.domElement.parentNode);

		// Hide interface on alt key press.
		document.addEventListener("keydown", function(event) {

			if(event.altKey) {

				event.preventDefault();
				aside.style.visibility = (aside.style.visibility === "hidden") ? "visible" : "hidden";

			}

		});

		// Helper.

		scene.add(new THREE.AxisHelper(1));

		// Points.

		const points = (function generatePoints() {

			function createPlaneGeometry(particles, n, z) {

				const geometry = new THREE.BufferGeometry();
				const positions = new Float32Array(particles * 3);
				const n2 = n / 2;

				let x, y;
				let i;

				for(i = 0; i < positions.length; i += 3) {

					x = Math.random() * n - n2;
					y = Math.random() * n - n2;

					positions[i] = x;
					positions[i + 1] = y;
					positions[i + 2] = z;

				}

				geometry.addAttribute("position", new THREE.BufferAttribute(positions, 3));
				geometry.computeBoundingSphere();

				return geometry;

			}

			const points = new THREE.Object3D();

			const w = 128;
			const h = 128;

			let d = 8;

			const size = 6;
			const zStep = size / (d - 1);

			let z = size * -0.5;
			let p;

			let material = new THREE.PointsMaterial({
				color: 0xc00000, size: 1, sizeAttenuation: false
			});

			while(0 < d--) {

				p = new THREE.Points(createPlaneGeometry(w * h, size, z), material);
				material = material.clone();
				z += zStep;

				points.add(p);

			}

			return points;

		}());

		scene.add(points);

		// Octree.

		const octree = (function createOctree() {

			const bbox = new THREE.Box3();
			bbox.setFromObject(scene);

			let time = performance.now();

			const octree = new OCTREE.PointOctree(bbox.min, bbox.max, 0.0, 8, 5);

			const v = new THREE.Vector3();

			let i, l;
			let d, p;
			let array;

			for(d = points.children.length - 1; d >= 0; --d) {

				p = points.children[d];
				array = p.geometry.getAttribute("position").array;

				for(i = 0, l = array.length; i < l; i += 3) {

					octree.add(v.fromArray(array, i), p);

				}

			}

			console.log("Octree:", octree, "created in", (((performance.now() - time) * 100.0) / 100.0).toFixed(2) + " ms");

			return octree;

		}());

		// Octree Helper.

		const octreeHelper = (function createOctreeHelper() {

			let time = performance.now();

			const octreeHelper = new OCTREE.OctreeHelper(octree);

			try {

				octreeHelper.update();

			} catch(error) {

				console.warn(error.message);

			}

			octreeHelper.visible = false;

			console.log("OctreeHelper:", octreeHelper, "created in", (((performance.now() - time) * 100.0) / 100.0).toFixed(2) + " ms");

			return octreeHelper;

		}());

		scene.add(octreeHelper);

		// Raycasting.

		(function setupRaycasting() {

			const mouse = new THREE.Vector2();
			const raycaster = new THREE.Raycaster();

			let raycasting = true;
			let selection = null;

			raycaster.params.Points.threshold = 0.1;

			viewport.addEventListener("mousemove", function raycast(event) {

				let intersects;
				let t0, t;

				mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
				mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

				raycaster.setFromCamera(mouse, camera);

				if(params["use octree"]) {

					t0 = performance.now();
					intersects = raycaster.intersectObject(octree);
					t = performance.now();

				} else {

					// Brute force.
					t0 = performance.now();
					intersects = raycaster.intersectObjects(points.children);
					t = performance.now();

				}

				params["search time"] = (((t - t0) * 100.0) / 100.0).toFixed(2) + " ms";

				if(selection !== null) {

					selection.material.color.setHex(0xc00000);
					selection = null;

				}

				if(intersects.length > 0) {

					if(intersects[0].object !== undefined) {

						selection = intersects[0].object;
						selection.material.color.setHex(0xccff00);

					} else {

						console.log(intersects);

					}

				}

			});

		}());

		// Frustum culling.

		const frustumCulling = (function() {

			const frustum = new THREE.Frustum();
			const cullCamera = new THREE.PerspectiveCamera(20, 1.77, 0.5, 5);
			cullCamera.matrixAutoUpdate = false;

			const s = new THREE.Spherical(5, Math.PI / 3, Math.PI * 1.75);
			const m = new THREE.Matrix4();

			function updateCamera() {

				cullCamera.position.setFromSpherical(s);
				cullCamera.lookAt(scene.position);

				cullCamera.updateMatrix();
				cullCamera.updateMatrixWorld();
				cullCamera.matrixWorldInverse.getInverse(cullCamera.matrixWorld);

				m.identity().multiplyMatrices(cullCamera.projectionMatrix, cullCamera.matrixWorldInverse);
				frustum.setFromMatrix(m)

			}

			let material = new THREE.PointsMaterial({
				color: 0xccff00, size: 1, sizeAttenuation: false
			});

			const culledOctants = new THREE.Points(new THREE.BufferGeometry(), material);
			culledOctants.visible = false;

			function cull() {

				let t0, t;
				let i, j, l;
				let octant, octants;
				let positions;

				if(params["show culling"]) {

					updateCamera();

					t0 = performance.now();
					octants = octree.cull(frustum);
					t = performance.now();

					if(octants.length > 0) {

						positions = new Float32Array(octants.length * 3 * 2);

						for(i = 0, j = 0, l = octants.length; i < l; ++i) {

							octant = octants[i];
							positions[j++] = octant.min.x;
							positions[j++] = octant.min.y;
							positions[j++] = octant.min.z;
							positions[j++] = octant.max.x;
							positions[j++] = octant.max.y;
							positions[j++] = octant.max.z;

						}

						culledOctants.geometry.removeAttribute("position");
						culledOctants.geometry.addAttribute("position", new THREE.BufferAttribute(positions, 3));

						scene.add(culledOctants);

					} else {

						scene.remove(culledOctants);

					}

					params["cull time"] = (((t - t0) * 100.0) / 100.0).toFixed(2) + " ms";

				}

			}

			const cameraHelper = new THREE.CameraHelper(cullCamera);
			cameraHelper.visible = false;

			return {
				cameraHelper: cameraHelper,
				cullCamera: cullCamera,
				culledOctants: culledOctants,
				cull: cull,
				s: s
			};

		}());

		scene.add(frustumCulling.cullCamera);
		scene.add(frustumCulling.cameraHelper);

		// Configuration.

		const params = {
			"show points": points.visible,
			"show octree": octreeHelper.visible,
			"level mask": octreeHelper.children.length,
			"use octree": true,
			"search time": "",
			"show culling": false,
			"radius": frustumCulling.s.radius,
			"phi": frustumCulling.s.phi,
			"theta": frustumCulling.s.theta,
			"cull time": "",
		};

		gui.add(params, "show points").onChange(function() { points.visible = params["show points"]; });

		let f = gui.addFolder("Octree Helper");
		f.add(params, "show octree").onChange(function() { octreeHelper.visible = params["show octree"]; });
		f.add(params, "level mask").min(0).max(octreeHelper.children.length).step(1).onChange(function() {

			let i, l;

			for(i = 0, l = octreeHelper.children.length; i < l; ++i) {

				octreeHelper.children[i].visible = (params["level mask"] === octreeHelper.children.length || i === params["level mask"]);

			}

		});
		f.open();

		f = gui.addFolder("Raycasting");
		f.add(params, "use octree");
		f.add(params, "search time").listen();
		f.open();

		f = gui.addFolder("Frustum Culling");
		f.add(params, "show culling").onChange(function() {

			frustumCulling.cameraHelper.visible = frustumCulling.culledOctants.visible = params["show culling"];
			frustumCulling.cull();

		});
		f.add(params, "cull time").listen();
		f.open();

		let ff = f.addFolder("Camera Adjustment");
		ff.add(params, "radius").min(0.1).max(10.0).step(0.1).onChange(function() { frustumCulling.s.radius = params["radius"]; frustumCulling.cull(); });
		ff.add(params, "phi").min(1e-6).max(Math.PI - 1e-6).onChange(function() { frustumCulling.s.phi = params["phi"]; frustumCulling.cull(); });
		ff.add(params, "theta").min(0.0).max(Math.PI * 2.0).onChange(function() { frustumCulling.s.theta = params["theta"]; frustumCulling.cull(); });

		/**
		 * Handles resizing.
		 *
		 * @method resize
		 */

		window.addEventListener("resize", function resize() {

			const width = window.innerWidth;
			const height = window.innerHeight;

			renderer.setSize(width, height);
			camera.aspect = width / height;
			camera.updateProjectionMatrix();

		});

		/**
		 * The main render loop.
		 *
		 * @method render
		 * @param {DOMHighResTimeStamp} now - Indicaties the time when requestAnimationFrame fired.
		 */

		(function render(now) {

			requestAnimationFrame(render);

			stats.begin();

			frustumCulling.cameraHelper.update();

			renderer.render(scene, camera);

			stats.end();

		}());

	}

}());
