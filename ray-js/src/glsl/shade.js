module.exports = `
	vec3 shade(march result) {
		mesh m = global(result.position);
		vec3 n = normal(result.position);
		vec3 diffuseColor = m.color;
		vec3 specularColor = vec3(1);
		vec3 lightDirection = normalize(vec3(0, 1, -0.5)); // Todo: uniform
		vec3 h = normalize(lightDirection - normalize(result.position));
		float diffuseRatio = 0.85;
		float shininess = 10.0;
		float occlusion = 1.0 - float(result.iterations) / float(STEPS);
		march sm = raymarch(result.position + n * SHADOW_EPSILON, lightDirection);
		float fog = exp(-0.0005 * result.distance);
		float envAmbience = 0.1;
		float diffuseAmbience = 0.1;
		return vec3(0) * (1.0 - fog) + max(envAmbience, fog * occlusion * sm.shadow) * result.hit * (
			(1.0 - diffuseAmbience) * diffuseRatio * diffuseColor * light_0(result.position, n)
			+ (1.0 - diffuseRatio) * pow(max(0.0, dot(n, h)), shininess)
			+ diffuseAmbience * diffuseColor
		);
	}
`;
