const global = (scene) => {
	let d, g;
	if (scene.meshes.length == 0) {
		d = `INFINITY`;
		g = `mesh`;
	} else if (scene.meshes.length == 1) {
		d = `sdist_0(pos)`;
		g = `mesh_0(pos)`;
	} else {
		for (let i = 0; i < scene.meshes.length; i++) {
			let id = scene.meshes[i].id;
			if (i == 0) {
				d = `sdist_${id}(pos)`;
				g = `mesh_${id}(pos)`;
			} else {
				d = `smin(${d}, sdist_${id}(pos))`;
				g = `mmin(${g}, mesh_${id}(pos))`;
			}
		}
	}
	return `
		float distance(vec3 pos) {
			return ${d};
		}
		mesh global(vec3 pos) {
			return ${g};
		}
		vec3 normal(vec3 pos) {
			return normalize(vec3(
				distance(vec3(pos.x + GRADIENT_EPSILON, pos.y, pos.z)) - distance(vec3(pos.x - GRADIENT_EPSILON, pos.y, pos.z)),
				distance(vec3(pos.x, pos.y + GRADIENT_EPSILON, pos.z)) - distance(vec3(pos.x, pos.y - GRADIENT_EPSILON, pos.z)),
				distance(vec3(pos.x, pos.y, pos.z + GRADIENT_EPSILON)) - distance(vec3(pos.x, pos.y, pos.z - GRADIENT_EPSILON))
			));
		}
		`;
}

module.exports = global;
