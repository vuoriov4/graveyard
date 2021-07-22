module.exports = class Light {
	constructor(uniforms = {}, glsl) {
		this.id = RAY.lightId;
		RAY.lightId += 1;
		this.uniforms = uniforms === undefined ? {} : uniforms;
		this.glsl = glsl;
		this.position = new RAY.Vec3();
	}
}
