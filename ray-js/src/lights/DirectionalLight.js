const Light = require('../Light.js');
module.exports = class DirectionalLight extends Light {
	constructor(opts = {}) {
		const uniforms = {
			intensity: {
				type: 'float',
				value: opts.intensity === undefined ? 1.0 : opts.intensity
			},
			color: {
				type: 'vec3',
				value: opts.color === undefined ? new RAY.Vec3(1.0, 1.0, 1.0) : opts.color
			},
			falloff: {
				type: 'float',
				value: opts.falloff === undefined ? 2.0 : opts.falloff
			}
		};
		const glsl = `
			vec3 main(vec3 pos, vec3 normal) {
				return this.color * max(0.0, dot(normal, vec3(0.0, 1.0, -0.5)));
			}
		`;
		super(uniforms, glsl);
	}
}
