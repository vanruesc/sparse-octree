import {
	BufferAttribute,
	BufferGeometry,
	Box3,
	FogExp2,
	Group,
	Object3D,
	PerspectiveCamera,
	Points,
	PointsMaterial,
	Vector3
} from "three";

import { GUI } from "dat.gui";
import { ControlMode, SpatialControls } from "spatial-controls";
import { calculateVerticalFoV, Demo } from "three-demo";
import { OctreeHelper, PointOctree } from "../../../src";
import { OctreeRaycaster } from "../utils/OctreeRaycaster.js";
import { FrustumCuller } from "../utils/FrustumCuller.js";

/**
 * A point octree demo application.
 */

export class PointOctreeDemo extends Demo {

	/**
	 * The controls.
	 */

	controls: SpatialControls;

	/**
	 * A group of point clouds.
	 */

	private points: Group;

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

	override initialize(): void {

		const scene = this.scene;
		const renderer = this.renderer;
		const domElement = renderer.domElement;

		// Camera

		const aspect = window.innerWidth / window.innerHeight;
		const vFoV = calculateVerticalFoV(90, Math.max(aspect, 16 / 9));
		const camera = new PerspectiveCamera(vFoV, aspect, 0.1, 1000);
		this.camera = camera;

		// Controls

		const { position, quaternion } = camera;
		const controls = new SpatialControls(position, quaternion, domElement);
		const settings = controls.settings;
		settings.general.setMode(ControlMode.THIRD_PERSON);
		settings.zoom.setRange(1e-6, 60.0);
		settings.rotation.setSensitivity(2.2);
		settings.rotation.setDamping(0.05);
		settings.translation.setDamping(0.1);
		settings.zoom.setSensitivity(1.0);
		settings.zoom.setDamping(0.1);
		controls.setPosition(10, 6, 10);
		this.controls = controls;

		camera.updateMatrixWorld();

		// Fog

		scene.fog = new FogExp2(0x0d0d0d, 0.025);
		renderer.setClearColor(scene.fog.color);

		// Points

		function createParticlePlane(particles: number, n: number, zBase: number,
			zBias: number): BufferGeometry {

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

		this.points = points;
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

		this.octreeHelper = octreeHelper;
		scene.add(octreeHelper);

		// Raycasting

		this.octreeRaycaster = new OctreeRaycaster(octree, camera, points);
		renderer.domElement.addEventListener("pointermove", this.octreeRaycaster, {
			passive: true
		});

		scene.add(this.octreeRaycaster.getCursor());

		// Frustum culling

		this.frustumCuller = new FrustumCuller(octree, scene);
		scene.add(this.frustumCuller.getCameraHelper());

	}

	override update(deltaTime: number, timestamp: number): void {

		this.controls.update(timestamp);

	}

	override registerOptions(menu: GUI): void {

		const points = this.points;
		const octreeHelper = this.octreeHelper;

		this.octreeRaycaster.registerOptions(menu);
		this.frustumCuller.registerOptions(menu);

		const params = {
			"level mask": octreeHelper.children.length
		};

		let folder = menu.addFolder("Points");
		folder.add(points, "visible");
		folder.open();

		folder = menu.addFolder("Octree Helper");
		folder.add(octreeHelper, "visible");

		folder.add(params, "level mask", 0, octreeHelper.children.length, 1)
			.onChange(() => {

				for(let i = 0, l = octreeHelper.children.length; i < l; ++i) {

					octreeHelper.children[i].visible = (
						params["level mask"] === octreeHelper.children.length ||
						params["level mask"] === i
					);

				}

			});

		folder.open();

		if(window.innerWidth < 720) {

			menu.close();

		}

	}

	override dispose(): void {

		const domElement = this.renderer.domElement;
		domElement.removeEventListener("pointermove", this.octreeRaycaster);

	}

}
