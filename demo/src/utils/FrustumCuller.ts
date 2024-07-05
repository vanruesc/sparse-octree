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

import { Pane } from "tweakpane";
import { Octree } from "sparse-octree";

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
	 * A camera.
	 */

	private cullCamera: Camera;

	/**
	 * Spherical coordinates.
	 */

	private s: Spherical;

	/**
	 * A camera helper.
	 */

	private cameraHelper: CameraHelper;

	/**
	 * A mesh that represents intersecting octants.
	 */

	private mesh: InstancedMesh;

	/**
	 * Indicates whether the frustum culling is active.
	 */

	enabled: boolean;

	/**
	 * The measured processing time.
	 */

	time: string;

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
			2500
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
	 * @param pane - A settings pane.
	 */

	registerOptions(pane: Pane): void {

		const folder = pane.addFolder({ title: "Frustum Culling" });

		folder.addBinding(this, "enabled").on("change", (e) => {

			this.cameraHelper.visible = e.value;
			this.mesh.visible = e.value;
			this.cull();

		});

		folder.addBinding(this, "time", { readonly: true });

		const subfolder = folder.addFolder({ title: "Camera Adjustment" });
		subfolder.addBinding(this.s, "radius", { min: 0.1, max: 10.0, step: 0.1 })
			.on("change", (e) => this.cull());
		subfolder.addBinding(this.s, "phi", { min: 1e-6, max: Math.PI - 1e-6, step: 0.0001 })
			.on("change", (e) => this.cull());
		subfolder.addBinding(this.s, "theta", { min: 0.0, max: Math.PI * 2.0, step: 0.0001 })
			.on("change", (e) => this.cull());

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
