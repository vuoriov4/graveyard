module.exports = `
	march raymarch(vec3 rayPosition, vec3 rayDirection) {
		float td = 0.0;
		vec3 pos = rayPosition;
		vec3 dir = rayDirection;
		float hit = 0.0;
		int iterations = 0;
		float shadow = 1.0;
		float ss = 20.0;
		for (int i = 0; i < STEPS; i++) {
			// Distance estimation
			float d = distance(pos);
			if (d < RAYMARCH_EPSILON) {
				hit = 1.0;
				shadow = 0.0;
				break;
			}
			shadow = min(shadow, ss * d / td);
			td += d;
			pos = pos + dir*d;
			iterations++;
		}
		march result;
		result.iterations = iterations;
		result.distance = td;
		result.position = pos;
		result.direction = dir;
		result.shadow = shadow;
		result.hit = hit;
		return result;
	}
`;
