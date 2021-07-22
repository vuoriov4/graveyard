const objects = (scene) => {
	let result = scene.meshes.map(mesh => {
		return mesh.geometry.glsl.replace('float main', 'float sdist_' + mesh.id).replace(/this./g, `_o${mesh.id}_`)
			+ mesh.material.glsl.replace('material main', 'material shade_' + mesh.id).replace(/this./g, `_o${mesh.id}_`)
			+ `
				mesh mesh_${mesh.id}(vec3 pos) {
					mesh result;
					result.distance = sdist_${mesh.id}(pos);
					result.id = ${mesh.id}.0;
					// note: 5.0 factor because of sdf smoothing
					// todo: do something about that shit
					if (result.distance < 5.0 * RAYMARCH_EPSILON) {
						material mat = shade_${mesh.id}(pos);
						result.color = mat.color;
						result.reflectivity = mat.reflectivity;
						result.transparency = mat.transparency;
						result.scattering = mat.scattering;
					}
					return result;
				}
			`;
	}).join('');
	return result;
};

module.exports = objects;
