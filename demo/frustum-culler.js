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
 * A computation helper.
 *
 * @property MATRIX4
 * @type Matrix4
 * @private
 * @static
 * @final
 */

const MATRIX4 = new Matrix4();

/**
 * A frustum.
 *
 * @property FRUSTUM
 * @type Frustum
 * @private
 * @static
 * @final
 */

const FRUSTUM = new Frustum();

/**
 * A frustum-based octree culler.
 *
 * @class FrustumCuller
 * @constructor
 * @param {Octree} octree - An octree.
 * @param {Scene} scene - A scene.
 */

export class FrustumCuller {

	constructor(octree, scene) {

		/**
		 * An octree.
		 *
		 * @property octree
		 * @type Octree
		 * @private
		 */

		this.octree = octree;

		/**
		 * A scene.
		 *
		 * @property scene
		 * @type Scene
		 */

		this.scene = scene;

		/**
		 * Indicates whether the frustum culling is active.
		 *
		 * @property enabled
		 * @type Boolean
		 * @default false
		 */

		this.enabled = false;

		/**
		 * A camera.
		 *
		 * @property cullCamera
		 * @type PerspectiveCamera
		 */

		this.cullCamera = new PerspectiveCamera(20, 1.77, 0.5, 5);
		this.cullCamera.matrixAutoUpdate = false;

		/**
		 * A sphere descriptor.
		 *
		 * @property spherical
		 * @type Spherical
		 */

		this.s = new Spherical(5, Math.PI / 3, Math.PI * 1.75);

		/**
		 * A delta time.
		 *
		 * @property delta
		 * @type String
		 */

		this.delta = "";

		/**
		 * A point cloud that visualises the culled octants.
		 *
		 * @property culledOctants
		 * @type Points
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
		 * @property cameraHelper
		 * @type CameraHelper
		 */

		this.cameraHelper = new CameraHelper(this.cullCamera);
		this.cameraHelper.visible = false;

	}

	/**
	 * Updates the cull camera.
	 *
	 * @method updateCamera
	 * @private
	 */

	updateCamera() {

		const cullCamera = this.cullCamera;

		cullCamera.position.setFromSpherical(this.s);
		cullCamera.lookAt(this.scene.position);

		cullCamera.updateMatrix();
		cullCamera.updateMatrixWorld();
		cullCamera.matrixWorldInverse.getInverse(cullCamera.matrixWorld);

		FRUSTUM.setFromMatrix(
			MATRIX4.multiplyMatrices(
				cullCamera.projectionMatrix,
				cullCamera.matrixWorldInverse
			)
		);

	}

	/**
	 * Culls the octree.
	 *
	 * @method cull
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
			octants = this.octree.cull(FRUSTUM);

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

		}

	}

	/**
	 * Registers configuration options.
	 *
	 * @method configure
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

		subFolder.add(this.s, "radius").min(0.1).max(10.0).step(0.1).onChange(() => {

			this.s.radius = this.s.radius; this.cull();

		});

		subFolder.add(this.s, "phi").min(1e-6).max(Math.PI - 1e-6).onChange(() => {

			this.s.phi = this.s.phi; this.cull();

		});

		subFolder.add(this.s, "theta").min(0.0).max(Math.PI * 2.0).onChange(() => {

			this.s.theta = this.s.theta; this.cull();

		});

	}

}
