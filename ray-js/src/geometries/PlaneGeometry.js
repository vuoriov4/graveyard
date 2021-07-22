const Geometry = require('../Geometry.js');
module.exports = class PlaneGeometry extends Geometry {
	constructor({width = 1.0, height = 1.0} = {}) {
		const uniforms = {
			width: {
				type: 'float',
				value: width
			},
			height: {
				type: 'float',
				value: height
			}
		};
		const glsl = `
			float main(vec3 pos) {
				return pos.y - this.position.y;
			}
		`;
		super(uniforms, glsl);
	}
}
