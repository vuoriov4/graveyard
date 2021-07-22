/*
float line2(vec3 a, vec3 b, float thickness, vec3 pos) {
  return max(0.0, length((pos-a) - clamp(dot(pos-a, b-a), 0.0, dot(b-a,b-a)) * (b-a)/dot(b-a,b-a)) - thickness);
}
*/

const Geometry = require('../Geometry.js');
module.exports = class LineGeometry extends Geometry {
	constructor({thickness = 1.0, a = new RAY.Vec3(0,0,0), b = new RAY.Vec3(0,0,1)} = {}) {
		const uniforms = {
			thickness: {
				type: 'float',
				value: thickness
			},
			a: {
				type: 'vec3',
				value: a
			},
			b: {
				type: 'vec3',
				value: b
			}
		};
		const glsl = `
			float main(vec3 pos) {
				vec3 a = this.position + this.a;
				vec3 b = this.position + this.b;
				float d = dot(b-a, b-a);
				return max(0.0, length((pos-a) - clamp(dot(pos-a, b-a), 0.0, d) * (b-a)/d) - this.thickness);
			}
		`;
		super(uniforms, glsl);
	}
}
