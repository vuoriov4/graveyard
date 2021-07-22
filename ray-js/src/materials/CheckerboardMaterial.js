const Material = require('../Material.js');
module.exports = class CheckerboardMaterial extends Material {
	constructor(opts = {}) {
		const uniforms = {};
		const glsl = `
			material main(vec3 pos) {
				material mat;
				mat.reflectivity = 0.0;
				float scale = 0.005;
				if (mod(pos.x*scale, 1.0) < 0.5 && mod(pos.z*scale, 1.0) < 0.5
					|| mod(pos.x*scale, 1.0) > 0.5 && mod(pos.z*scale, 1.0) > 0.5) {
					mat.color = vec3(0.8);
				} else {
					mat.color = vec3(0.2);
				}
				return mat;
			}
		`;
		super(uniforms, glsl);
	}
}
