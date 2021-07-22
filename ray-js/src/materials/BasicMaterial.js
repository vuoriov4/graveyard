const Material = require('../Material.js');
module.exports = class BasicMaterial extends Material {
	constructor({
		color = new RAY.Vec3(1.0, 1.0, 1.0),
		reflectivity = 0.0,
		transparency = 0.0,
		scattering = 0.0
	} = {}) {
		const uniforms = {
			color: {
				type: 'vec3',
				value: color
			},
			reflectivity: {
				type: 'float',
				value: reflectivity
			},
			transparency: {
				type: 'float',
				value: transparency
			},
			scattering: {
				type: 'float',
				value: scattering
			}
		};
		const glsl = `
			material main(vec3 pos) {
				material basicMaterial;
				basicMaterial.color = this.color;
				basicMaterial.reflectivity = this.reflectivity;
				basicMaterial.transparency = this.transparency;
				basicMaterial.scattering = this.scattering;
				return basicMaterial;
			}
		`;
		super(uniforms, glsl);
	}
}
