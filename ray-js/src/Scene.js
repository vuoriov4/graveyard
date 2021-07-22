module.exports = class Scene {
	constructor() {
		this.meshes = [];
		this.lights = [];
		this.compiled = false;
	}
	add(x) {
		if (x.constructor === RAY.Mesh) {
			this.meshes.push(x);
		} else if (x.constructor === RAY.DirectionalLight || x.constructor === RAY.AmbientLight) {
			this.lights.push(x);
		}
	};
	remove(obj) {
		var index = this.meshes.indexOf(mesh);
		if (index > -1) {
			this.meshes.splice(index, 1);
		}
		// TODO : LIGHTS DELETION
	};
};
