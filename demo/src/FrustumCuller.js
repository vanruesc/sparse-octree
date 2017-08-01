import {
	BufferAttribute,
	BufferGeometry,
	CameraHelper,
	Frustum,
	Matrix4,
	PerspectiveCamera,
	Points,
	PointsMaterial,
	Spherical
} from "three";

/**
 * A matrix.
 *
 * @type {Matrix4}
 * @private
 */

const matrix4 = new Matrix4();

/**
 * A frustum.
 *
 * @type {Frustum}
 * @private
 */

const frustum = new Frustum();

/**
 * A frustum-based octree culler.
 */

export class FrustumCuller {

	/**
	 * Constructs a new octree culler.
	 *
	 * @param {Octree} octree - An octree.
	 * @param {Scene} scene - A scene.
	 */

	constructor(octree, scene) {

		/**
		 * An octree.
		 *
		 * @type {Octree}
		 * @private
		 */

		this.octree = octree;

		/**
		 * A scene.
		 *
		 * @type {Scene}
		 */

		this.scene = scene;

		/**
		 * Indicates whether the frustum culling is active.
		 *
		 * @type {Boolean}
		 * @default false
		 */

		this.enabled = false;

		/**
		 * A camera.
		 *
		 * @type {PerspectiveCamera}
		 */

		this.cullCamera = new PerspectiveCamera(20, 1.77, 0.5, 5);
		this.cullCamera.matrixAutoUpdate = false;

		/**
		 * A spherical coordinate system.
		 *
		 * @type {Spherical}
		 */

		this.s = new Spherical(5, Math.PI / 3, Math.PI * 1.75);

		/**
		 * A delta time.
		 *
		 * @type {String}
		 */

		this.delta = "";

		/**
		 * A point cloud that visualises the culled octants.
		 *
		 * @type {Points}
		 */

		this.culledOctants = new Points(
			new BufferGeometry(),
			new PointsMaterial({
				color: 0xccff00,
				sizeAttenuation: false,
				size: 2
			})
		);

		this.culledOctants.visible = false;

		/**
		 * A camera helper.
		 *
		 * @type {CameraHelper}
		 */

		this.cameraHelper = new CameraHelper(this.cullCamera);
		this.cameraHelper.visible = false;

	}

	/**
	 * Updates the cull camera.
	 *
	 * @private
	 */

	updateCamera() {

		const cullCamera = this.cullCamera;

		cullCamera.position.setFromSpherical(this.s);
		cullCamera.lookAt(this.scene.position);

		cullCamera.updateMatrix();
		cullCamera.updateMatrixWorld();

		frustum.setFromMatrix(
			matrix4.multiplyMatrices(
				cullCamera.projectionMatrix,
				cullCamera.matrixWorldInverse
			)
		);

	}

	/**
	 * Culls the octree.
	 */

	cull() {

		const culledOctants = this.culledOctants;

		let t0;
		let i, j, l;
		let octant, octants;
		let positions;

		if(this.enabled) {

			this.updateCamera();

			t0 = performance.now();
			octants = this.octree.cull(frustum);

			this.delta = (performance.now() - t0).toFixed(2) + " ms";

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
				culledOctants.geometry.addAttribute("position", new BufferAttribute(positions, 3));

				this.scene.remove(culledOctants);
				this.scene.add(culledOctants);

			} else {

				this.scene.remove(culledOctants);

			}

			this.cameraHelper.update();

		}

	}

	/**
	 * Registers configuration options.
	 *
	 * @param {GUI} gui - A GUI.
	 */

	configure(gui) {

		const folder = gui.addFolder("Frustum Culling");

		folder.add(this, "enabled").onChange(() => {

			this.cameraHelper.visible = this.culledOctants.visible = this.enabled;
			this.cull();

		});

		folder.add(this, "delta").listen();
		folder.open();

		const subFolder = folder.addFolder("Camera Adjustment");

		subFolder.add(this.s, "radius").min(0.1).max(10.0).step(0.1).onChange(() => { this.cull(); });
		subFolder.add(this.s, "phi").min(1e-6).max(Math.PI - 1e-6).onChange(() => { this.cull(); });
		subFolder.add(this.s, "theta").min(0.0).max(Math.PI * 2.0).onChange(() => { this.cull(); });

	}

}
