const lights = (scene) => {
	let result = scene.lights.map(light => {
		return light.glsl.replace('vec3 main', 'vec3 light_' + light.id).replace(/this./g, `_l${light.id}_`);
	}).join('');
	return result;
};

module.exports = lights;
