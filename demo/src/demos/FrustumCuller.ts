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
 */

const matrix4 = new Matrix4();

/**
 * A frustum.
 */

const frustum = new Frustum();

/**
 * A frustum-based octree culler.
 */

export class FrustumCuller {

	/**
	 * An octree.
	 */

	private octree: Octree;

	/**
	 * A scene.
	 */

	private scene: Scene;

	/**
	 * Indicates whether the frustum culling is active.
	 */

	private enabled: boolean;

	/**
	 * A camera.
	 */

	private cullCamera: Camera;

	/**
	 * Spherical coordinates.
	 */

	private s: Spherical;

	/**
	 * A delta time.
	 */

	private delta: string;

	/**
	 * A camera helper.
	 */

	private cameraHelper: CameraHelper;

	/**
	 * A point cloud that visualises the culled octants.
	 */

	private culledOctants: Points;

	/**
	 * Constructs a new octree culler.
	 *
	 * @param octree - An octree.
	 * @param scene - A scene.
	 */

	constructor(octree: Octree, scene: Scene) {

		this.octree = octree;
		this.scene = scene;
		this.enabled = false;
		this.cullCamera = new PerspectiveCamera(20, 1.77, 0.5, 5);
		this.s = new Spherical(5, Math.PI / 3, Math.PI * 1.75);
		this.delta = "";
		this.cameraHelper = new CameraHelper(this.cullCamera);
		this.cameraHelper.visible = false;

		this.culledOctants = new Points(
			new BufferGeometry(),
			new PointsMaterial({
				color: 0xccff00,
				sizeAttenuation: false,
				size: 2
			})
		);

		this.culledOctants.visible = false;

	}

	/**
	 * Updates the cull camera.
	 */

	private updateCamera(): void {

		const cullCamera = this.cullCamera;

		cullCamera.position.setFromSpherical(this.s);
		cullCamera.lookAt(this.scene.position);
		cullCamera.updateMatrixWorld(true);

		frustum.setFromProjectionMatrix(
			matrix4.multiplyMatrices(
				cullCamera.projectionMatrix,
				cullCamera.matrixWorldInverse
			)
		);

	}

	/**
	 * Culls the octree.
	 */

	cull(): void {

		const culledOctants = this.culledOctants;

		if(this.enabled) {

			this.updateCamera();

			const t0 = performance.now();
			const octants = this.octree.cull(frustum);

			this.delta = (performance.now() - t0).toFixed(2) + " ms";

			if(octants.length > 0) {

				const positions = new Float32Array(octants.length * 3 * 2);

				for(let i = 0, j = 0, l = octants.length; i < l; ++i) {

					const octant = octants[i];
					positions[j++] = octant.min.x;
					positions[j++] = octant.min.y;
					positions[j++] = octant.min.z;
					positions[j++] = octant.max.x;
					positions[j++] = octant.max.y;
					positions[j++] = octant.max.z;

				}

				culledOctants.geometry.deleteAttribute("position");
				culledOctants.geometry.setAttribute("position", new BufferAttribute(positions, 3));

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
	 * @param menu - A menu.
	 */

	registerOptions(menu: GUI): void {

		const folder = menu.addFolder("Frustum Culling");

		folder.add(this, "enabled").onChange(() => {

			this.cameraHelper.visible = this.culledOctants.visible = this.enabled;
			this.cull();

		});

		folder.add(this, "delta").listen();
		folder.open();

		const subFolder = folder.addFolder("Camera Adjustment");

		subFolder.add(this.s, "radius", 0.1, 10.0, 0.1).onChange(() => this.cull());
		subFolder.add(this.s, "phi", 1e-6, Math.PI - 1e-6, 0.0001).onChange(() => this.cull());
		subFolder.add(this.s, "theta", 0.0, Math.PI * 2.0, 0.0001).onChange(() => this.cull());

	}

}
