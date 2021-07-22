const Geometry = require('../Geometry.js');
module.exports = class BoxGeometry extends Geometry {
	constructor() {
		const uniforms = {};
		const glsl = `
			float main(vec3 pos) {
				vec3 d = abs(pos) - vec3(10.0, 10.0, 10.0);
	    		return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
			}
		`;
		super(uniforms, glsl);
	}
}
