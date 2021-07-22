const uniforms = (scene) => {
	let result = `
		uniform float width;
		uniform float height;
		uniform float time;
		uniform vec3 cameraPosition;
		uniform vec3 cameraDirection;
		uniform float cameraRotation;
		uniform float cameraFov;
	`;
	scene.meshes.forEach(mesh => {
		result += `uniform vec3 _o${mesh.id}_position;\n`;
		Object.keys(mesh.geometry.uniforms).forEach(key => {
			result += `uniform ${mesh.geometry.uniforms[key].type} _o${mesh.id}_${key};\n`;
		});
		Object.keys(mesh.material.uniforms).forEach(key => {
			result += `uniform ${mesh.material.uniforms[key].type} _o${mesh.id}_${key};\n`;
		});
	});
	scene.lights.forEach(light => {
		result += `uniform vec3 _l${light.id}_position;\n`;
		Object.keys(light.uniforms).forEach(key => {
			result += `uniform ${light.uniforms[key].type} _l${light.id}_${key};\n`;
		});
	});
	return result;
};

module.exports = uniforms;
