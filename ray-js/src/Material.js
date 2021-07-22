module.exports = class Material {
	constructor(uniforms, glsl) {
		this.uniforms = uniforms === undefined ? {} : uniforms;
		this.glsl = glsl;
	}
}
