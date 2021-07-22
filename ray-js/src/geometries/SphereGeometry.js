const Geometry = require('../Geometry.js');
module.exports = class SphereGeometry extends Geometry {
	constructor({radius = 1.0} = {}) {
		const uniforms = {
			radius: {
				type: 'float',
				value: radius
			}
		};
		const glsl = `
			float main(vec3 pos) {
				return length(pos - this.position) - this.radius;
			}
		`;
		super(uniforms, glsl);
	}
}
