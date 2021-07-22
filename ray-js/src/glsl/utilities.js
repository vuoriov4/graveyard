module.exports = `
	float smin(float a, float b) {
		float k = 1.0;
    float h = max( k-abs(a-b), 0.0 )/k;
    return min( a, b ) - h*h*h*k*(1.0/6.0);
	}
	float when_eq(float x, float y) {
			return 1.0 - abs(sign(x - y));
	}
	float when_neq(float x, float y) {
		return abs(sign(x - y));
	}
	float when_gt(float x, float y) {
		return max(sign(x - y), 0.0);
	}
	float when_lt(float x, float y) {
		return max(sign(y - x), 0.0);
	}
	float when_ge(float x, float y) {
		return 1.0 - when_lt(x, y);
	}
	float when_le(float x, float y) {
		return 1.0 - when_gt(x, y);
	}
	mesh mmin(mesh a, mesh b) {
		mesh result;
		float ca = when_lt(a.distance, b.distance);
		float cb = 1.0 - ca;
		result.distance = ca * a.distance + cb * b.distance;
		result.color = ca * a.color + cb * b.color;
		result.reflectivity = ca * a.reflectivity + cb * b.reflectivity;
		result.transparency = ca * a.transparency + cb * b.transparency;
		result.scattering = ca * a.scattering + cb * b.scattering;
		return result;
	}
	vec4 quatFromAxisAngle(float angle, vec3 axis) {
		float half_sin = sin(0.5 * angle);
		float half_cos = cos(0.5 * angle);
		return vec4(half_sin * axis.x,
					half_sin * axis.y,
					half_sin * axis.z,
					half_cos);
	}
	vec4 quatFromUnitVectors(vec3 u, vec3 v) {
		vec3 w = cross(u, v);
		vec4 q = vec4(w.x, w.y, w.z, 1.0 + dot(u, v));
		return normalize(q);
	}
	vec4 multQuats(vec4 q, vec4 p) {
		return vec4(
			vec3(q.w * p.xyz + p.w * q.xyz + cross(q.xyz, p.xyz)),
			q.w * p.w - dot(q.xyz, p.xyz)
		);
	}
	vec3 applyQuat(vec4 q, vec3 v) {
		return multQuats(q, multQuats(vec4(v, 1.0), vec4(vec3(-q.xyz), q.w))).xyz;
	}
`;
