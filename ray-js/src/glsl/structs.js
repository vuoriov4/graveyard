module.exports = `
	struct mesh {
		float distance;
		vec3 color;
		float id;
		float transparency;
		float reflectivity;
		float scattering;
	} Mesh;
	struct material {
		vec3 color;
		float transparency;
		float reflectivity;
		float scattering;
	};
	struct march {
    int iterations;
    float distance;
    vec3 position;
    vec3 direction;
    float shadow;
    float hit;
  };
`;
