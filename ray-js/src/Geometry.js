module.exports = class Geometry {
	constructor(uniforms, glsl) {
		this.uniforms = uniforms === undefined ? {} : uniforms;
		this.glsl = glsl;
	}
}
