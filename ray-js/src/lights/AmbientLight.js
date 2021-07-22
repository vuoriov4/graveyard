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
			}
		};
		const glsl = `
			vec3 main(vec3 pos, vec3 normal) {
				return this.color * this.intensity;
			}
		`;
		super(uniforms, glsl);
	}
}
