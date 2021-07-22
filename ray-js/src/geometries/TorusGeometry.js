const Geometry = require('../Geometry.js');
module.exports = class TorusGeometry extends Geometry {
	constructor({radius = 1.0, tubeRadius = 1.0} = {}) {
		const uniforms = {
			radius: {
				type: 'float',
				value: radius
			},
			tubeRadius: {
				type: 'float',
				value: tubeRadius
			}
		};
		const glsl = `
			float main(vec3 pos) {
				vec2 t = vec2(this.radius, this.tubeRadius);
				vec3 p = pos - this.position;
				return length(vec2(length(p.xz) - t.x, p.y)) - t.y;
			}
		`;
		super(uniforms, glsl);
	}
}
