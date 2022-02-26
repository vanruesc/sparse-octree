import {
	BoxGeometry,
	Camera,
	CameraHelper,
	Frustum,
	InstancedMesh,
	Material,
	Matrix4,
	Mesh,
	MeshBasicMaterial,
	PerspectiveCamera,
	Quaternion,
	Spherical,
	Vector3
} from "three";

import { GUI } from "dat.gui";
import { Octree } from "../../../src";

const frustum = new Frustum();
const m = new Matrix4();
const s = new Vector3();
const p = new Vector3();
const q = new Quaternion();

/**
 * A frustum-based octree culling helper.
 */

export class FrustumCuller {

	/**
	 * An octree.
	 */

	private octree: Octree;

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
	 * The measured processing time.
	 */

	private time: string;

	/**
	 * A camera helper.
	 */

	private cameraHelper: CameraHelper;

	/**
	 * A mesh that represents intersecting octants.
	 */

	private mesh: InstancedMesh;

	/**
	 * Constructs a new octree culler.
	 *
	 * @param octree - An octree.
	 */

	constructor(octree: Octree) {

		this.octree = octree;
		this.cullCamera = new PerspectiveCamera(20, 1.77, 0.5, 5);
		this.s = new Spherical(5, Math.PI / 3, Math.PI * 1.75);
		this.cameraHelper = new CameraHelper(this.cullCamera);

		this.mesh = new InstancedMesh(
			new BoxGeometry(1, 1, 1),
			new MeshBasicMaterial({
				transparent: true,
				color: 0xccff00,
				opacity: 0.75
			}),
			2000
		);

		this.mesh.visible = false;
		this.cameraHelper.visible = false;
		this.enabled = false;
		this.time = "";

	}

	/**
	 * Returns a mesh that represents intersecting octants.
	 *
	 * @return The mesh.
	 */

	getMesh(): Mesh {

		return this.mesh;

	}

	/**
	 * Returns the camera helper.
	 *
	 * @return The camera helper.
	 */

	getCameraHelper(): CameraHelper {

		return this.cameraHelper;

	}

	/**
	 * Updates the cull camera.
	 */

	private updateCamera(): void {

		const cullCamera = this.cullCamera;
		cullCamera.position.setFromSpherical(this.s.makeSafe());
		cullCamera.lookAt(p.set(0, 0, 0));
		cullCamera.updateMatrixWorld(true);

		frustum.setFromProjectionMatrix(
			m.multiplyMatrices(
				cullCamera.projectionMatrix,
				cullCamera.matrixWorldInverse
			)
		);

	}

	/**
	 * Culls the octree.
	 */

	cull(): void {

		const mesh = this.mesh;

		if(this.enabled) {

			this.updateCamera();

			const t0 = performance.now();
			const intersections = this.octree.cull(frustum);
			this.time = (performance.now() - t0).toFixed(2) + " ms";

			mesh.count = intersections.length;

			if(intersections.length > 0) {

				for(let i = 0, l = intersections.length; i < l; ++i) {

					const x = intersections[i];
					x.getCenter(p);
					x.getDimensions(s);
					mesh.setMatrixAt(i, m.compose(p, q, s));

				}

				mesh.instanceMatrix.needsUpdate = true;

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

		folder.add(this, "enabled").onChange((value: boolean) => {

			this.cameraHelper.visible = value;
			this.mesh.visible = value;
			this.cull();

		});

		folder.add(this, "time").listen();
		folder.open();

		const subFolder = folder.addFolder("Camera Adjustment");
		subFolder.add(this.s, "radius", 0.1, 10.0, 0.1).onChange(() => this.cull());
		subFolder.add(this.s, "phi", 1e-6, Math.PI - 1e-6, 0.0001).onChange(() => this.cull());
		subFolder.add(this.s, "theta", 0.0, Math.PI * 2.0, 0.0001).onChange(() => this.cull());

	}

	/**
	 * Deletes this frustum culler.
	 */

	dispose(): void {

		const geometry = this.mesh.geometry;
		const material = this.mesh.material as Material;

		geometry.dispose();
		material.dispose();

	}

}
