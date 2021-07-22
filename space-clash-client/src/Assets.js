import 'babylonjs-loaders'
import { state } from '@/State.js'
import { INSTANCES, EXPLOSIONS  } from '@/Constants.js'
import explosion_vertex from '@/shaders/explosion_vertex.js'
import explosion_fragment from '@/shaders/explosion_fragment.js'

const importAssets = scene => {
	return new Promise((resolve, reject) => {
		// Base
		const base = BABYLON.MeshBuilder.CreateSphere("", {diameter: 2, segments: 32}, scene);
		state.assets.base = base;
		state.assets.base.setEnabled(false);
		// Projectiles: Laser
		state.assets.laser = BABYLON.MeshBuilder.CreateBox("", {height: 0.075, width: 0.3, depth: 0.075}, scene);
		state.assets.laser.material = new BABYLON.StandardMaterial("", scene);
		state.assets.laser.material.emissiveColor = new BABYLON.Color3(1, 0, 0);
		state.assets.laser.material.diffuseColor = new BABYLON.Color3(0, 0, 0);
		state.assets.laser.material.specularColor = new BABYLON.Color3(0, 0, 0);
		state.assets.laser.setEnabled(false);
		state.assets.laser.isProjectile = true;
		// Explosions: Laser
		state.collisionAssets.xplLaser = new BABYLON.Mesh.CreatePlane("", 2, scene, true);
		const shaderMaterial = new BABYLON.ShaderMaterial("shader", state.scene, {
			vertexElement: "vertexShaderCode",
			fragmentElement: "fragmentShaderCode",
		},
		{
			needAlphaBlending : true,
			attributes: ["position", "normal", "uv", "world0", "world1", "world2", "world3", "instanceID"],
			uniforms: ["world", "viewProjection", "worldView", "worldViewProjection", "view", "projection", "sessionTime", "startTimes"],
			defines: ["#define INSTANCES"]
		});
		shaderMaterial.backFaceCulling = false;
		state.collisionAssets.xplLaser.material = shaderMaterial;
		state.collisionAssets.xplLaser.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
		state.collisionAssets.xplLaser.setEnabled(false);
		console.log(shaderMaterial);
		// Units: Fighter
		BABYLON.SceneLoader.ImportMesh(null, "/static/assets/", "fighter.obj", scene, (mesh) => {
			state.assets.fighter = mesh[0];
			state.assets.fighter.material.backFaceCulling = false;
			state.assets.fighter.material.diffuseTexture = new BABYLON.Texture("/static/assets/fighter.png", scene);
			state.assets.fighter.setEnabled(false)
			return resolve();
		});

	});
}

const createInstances = () => {
	Object.keys(state.assets).forEach(key => {
		for (let i = 0; i < INSTANCES[key]; i++) {
			const instance = state.assets[key].createInstance("instance_" + key + "_" + i);
			instance.velocity = [0, 0, 0];
			instance.setEnabled(false);
			state.instances[key][i] = instance;
		}
	});
	Object.keys(state.collisionAssets).forEach(key => {
		for (let i = 0; i < EXPLOSIONS[key]; i++) {
			const instance = state.collisionAssets[key].createInstance("instance_" + key + "_" + i);
			instance.setEnabled(false);
			state.collisionInstances[key][i] = instance;
		}
	});
}

export const load = scene => {
	return importAssets(scene).then(createInstances);
}
