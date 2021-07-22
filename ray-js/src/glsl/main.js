module.exports =  `
	vec3 color(vec2 fragCoord) {
		vec3 u = cos(cameraRotation) * vec3(1.0, 0.0, 0.0) + sin(cameraRotation) * vec3(0.0, 1.0, 0.0);
		vec3 v = cos(cameraRotation) * vec3(0.0, 1.0, 0.0) - sin(cameraRotation) * vec3(1.0, 0.0, 0.0);
		vec3 ncd = normalize(cameraDirection);
		u = applyQuat(quatFromUnitVectors(vec3(0.0, 0.0, 1.0), ncd), u);
		v = applyQuat(quatFromUnitVectors(vec3(0.0, 0.0, 1.0), ncd), v);
		float scale = 1.0;
		vec3 z = (0.5*scale/tan(cameraFov*0.5)) * ncd;
		vec3 rayPosition = cameraPosition
			+ scale * 2.0 * (fragCoord.x - width/2.0) * u / height
			+ scale * 2.0 * (fragCoord.y - height/2.0)  * v / height
			+ z;
		vec3 rayDirection = normalize(rayPosition - cameraPosition);
		return shade(raymarch(rayPosition, rayDirection));
	}
	void main() {
		vec3 c = color(gl_FragCoord.xy);
		gl_FragColor = vec4(c, 1.0);
	}
`;
