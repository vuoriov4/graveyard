#version 300 es
#define DISTANCE_EPSILON 0.0000001
#define SCATTER_EPSILON 0.0001
#define MAX_DISTANCE 100000.0
#define MAX_MESHES 16
#define PI 3.14159265359

precision highp float;
uniform float uWidth;
uniform float uHeight;
uniform float uAspectRatio;
uniform mat3 uCameraOrientation;
uniform vec3 uCameraPosition;
uniform vec3[MAX_MESHES] uMeshPositions;
uniform vec3[MAX_MESHES] uMaterialDiffuseColors;
uniform vec3[MAX_MESHES] uMaterialProperties;
uniform vec3[MAX_MESHES] uBoundingBoxMaxima;
uniform vec3[MAX_MESHES] uBoundingBoxMinima;
uniform int[MAX_MESHES] uMeshStartingIndices;
uniform int[MAX_MESHES] uMeshTotalVertices;
uniform sampler2D sceneTexture;
uniform int uSceneTextureSize;
uniform int uTotalVertices;
uniform int uTotalMeshes;

in vec2 v_position;
layout(location = 0) out vec4 fragmentColor;

struct Ray {
  vec3 origin;
  vec3 direction;
};

struct Vertex {
  vec3 position;
  vec3 normal;
  vec2 uv;
  int meshIndex;
};

struct Triangle {
  Vertex a;
  Vertex b;
  Vertex c;
};

struct Intersection {
  bool hit;
	float distance;
	Triangle triangle;
};

Intersection intersectTriangle(Ray ray, Triangle tri) {
	// Möller–Trumbore intersection algorithm
	Intersection result;
	result.hit = false;
	vec3 edge_a = tri.b.position - tri.a.position;
	vec3 edge_b = tri.c.position - tri.a.position;
	vec3 h = cross(ray.direction, edge_b);
	float a = dot(edge_a, h);
  bool fail = (a > -DISTANCE_EPSILON && a < DISTANCE_EPSILON);
	float f = 1.0 / a;
	vec3 s = ray.origin - tri.a.position;
	float u = f * dot(s, h);
	fail = fail || (u < 0.0 || u > 1.0);
	vec3 q = cross(s, edge_a);
	float v = f * dot(ray.direction, q);
	fail = fail || (v < 0.0 || u + v > 1.0);
	float t = f * dot(edge_b, q);
  fail = fail || t <= DISTANCE_EPSILON;
	result.hit = !fail;
	result.distance = t;
  result.triangle = tri;
	return result;
}

vec2 sceneIndexToTextureCoords(int index) {
  float width = sqrt(float(uSceneTextureSize));
  float dtex = 1.0 / width;
  float x = float(index % int(width));
  float y = floor(float(index) / width);
  return vec2(x*dtex, y*dtex);
}

Triangle getTriangle(int sceneIndex) {
  Triangle tri;
  // Triangle Vertex 1
  Vertex a;
  vec4 v0 = texture(sceneTexture, sceneIndexToTextureCoords(sceneIndex + 0));
  vec4 n0 = texture(sceneTexture, sceneIndexToTextureCoords(sceneIndex + 1));
  vec4 t0 = texture(sceneTexture, sceneIndexToTextureCoords(sceneIndex + 2));
  a.meshIndex = int(t0.a);
  a.position = v0.xyz + uMeshPositions[a.meshIndex];
  a.normal = n0.xyz;
  a.uv = t0.xy;
  tri.a = a;
  // Triangle Vertex 2
  Vertex b;
  int triIndex = int(t0.b);
  vec4 v1 = texture(sceneTexture, sceneIndexToTextureCoords(triIndex + 0));
  vec4 n1 = texture(sceneTexture, sceneIndexToTextureCoords(triIndex + 1));
  vec4 t1 = texture(sceneTexture, sceneIndexToTextureCoords(triIndex + 2));
  b.meshIndex = int(t1.a);
  b.position = v1.xyz + uMeshPositions[b.meshIndex];
  b.normal = n1.xyz;
  b.uv = t1.xy;
  tri.b = b;
  // Triangle Vertex 3
  Vertex c;
  triIndex = int(t1.b);
  vec4 v2 = texture(sceneTexture, sceneIndexToTextureCoords(triIndex + 0));
  vec4 n2 = texture(sceneTexture, sceneIndexToTextureCoords(triIndex + 1));
  vec4 t2 = texture(sceneTexture, sceneIndexToTextureCoords(triIndex + 2));
  c.meshIndex = int(t2.a);
  c.position = v2.xyz + uMeshPositions[c.meshIndex];
  c.normal = n2.xyz;
  c.uv = t2.xy;
  tri.c = c;
  return tri;
}

bool intersectBox(vec3 bmin, vec3 bmax, Ray ray) {
  vec3 dirfrac;
  dirfrac.x = 1.0f / ray.direction.x; // todo: precompute
  dirfrac.y = 1.0f / ray.direction.y; // todo: precompute
  dirfrac.z = 1.0f / ray.direction.z; // todo: precompute
  float t1 = (bmin.x - ray.origin.x)*dirfrac.x;
  float t2 = (bmax.x - ray.origin.x)*dirfrac.x;
  float t3 = (bmin.y - ray.origin.y)*dirfrac.y;
  float t4 = (bmax.y - ray.origin.y)*dirfrac.y;
  float t5 = (bmin.z - ray.origin.z)*dirfrac.z;
  float t6 = (bmax.z - ray.origin.z)*dirfrac.z;
  float tmin = max(max(min(t1, t2), min(t3, t4)), min(t5, t6));
  float tmax = min(min(max(t1, t2), max(t3, t4)), max(t5, t6));
  // if tmax < 0, ray (line) is intersecting AABB, but the whole AABB is behind us
  if (tmax < 0.0) return false;
  // if tmin > tmax, ray doesn't intersect AABB
  if (tmin > tmax) return false;
  return true;
}

Intersection intersectScene(Ray ray) {
	Intersection result;
	result.hit = false;
    result.distance = MAX_DISTANCE;
    for (int k = 0; k < uTotalMeshes; k++) {
        bool bbHit = intersectBox(uBoundingBoxMinima[k] + uMeshPositions[k], uBoundingBoxMaxima[k] + uMeshPositions[k], ray);
        if (!bbHit) continue;
        for (int i = 0; i < uMeshTotalVertices[k] / 3; i++) {
            Triangle tri = getTriangle(uMeshStartingIndices[k] + 9 * i);
            Intersection it = intersectTriangle(ray, tri);
            bool near = it.hit && (it.distance < result.distance);
            result.hit = it.hit || result.hit;
            if (near) {
                result.triangle = it.triangle;
                result.distance = it.distance;
            }
        }
    }
    return result;
}

// Compute barycentric coordinates (u, v, w) for
// point with respect to triangle (a, b, c)
vec3 barycentric(vec3 point, Triangle triangle) {
    vec3 v0 = triangle.b.position - triangle.a.position;
	vec3 v1 = triangle.c.position - triangle.a.position;
	vec3 v2 = point - triangle.a.position;
    float d00 = dot(v0, v0);
    float d01 = dot(v0, v1);
    float d11 = dot(v1, v1);
    float d20 = dot(v2, v0);
    float d21 = dot(v2, v1);
    float denom = d00 * d11 - d01 * d01;
    float v = (d11 * d20 - d01 * d21) / denom;
    float w = (d00 * d21 - d01 * d20) / denom;
    float u = 1.0f - v - w;
    return vec3(u, v, w);
}

vec3 flatNormal(Triangle triangle) {
    return normalize(cross(triangle.b.position - triangle.a.position, triangle.c.position - triangle.a.position));
}

vec3 smoothNormal(vec3 position, Triangle triangle) {
    vec3 weights = barycentric(position, triangle);
    vec3 normal = normalize(weights.x * triangle.a.normal + weights.y * triangle.b.normal + weights.z * triangle.c.normal);
    return normal;
}

vec3 shade(Ray ray, Intersection is) {
  vec3 position = ray.origin + is.distance * ray.direction;
  vec3 weights = barycentric(position, is.triangle);
  // vec2 uv = vec2(weights.x * is.triangle.a.uv + weights.y * is.triangle.b.uv + weights.z * is.triangle.c.uv);
  vec3 lightDirection = normalize(vec3(0,-1,0));
  vec3 normal = smoothNormal(position, is.triangle);
  int diffuseType = int(uMaterialProperties[is.triangle.a.meshIndex].g);
  vec3 diffuseColor;
  if (diffuseType == 0) {
    // COLOR
    diffuseColor = uMaterialDiffuseColors[is.triangle.a.meshIndex];
  } else if (diffuseType == 1) {
    // TEXTURE
    // vec3 diffuseColor = texture(diffuseTexture, vec2(uv.x, 1.0-uv.y)).rgb;
    diffuseColor = vec3(1);
  } else {
    // CHECKERBOARD
    float s = 3.0;
    float cz = float(mod(position.z, 2.0 * s) < s);
    float c = float(mod(position.x + s*cz, 2.0 * s) < s);
    diffuseColor = vec3(0.25 * c + 0.125);
  }
  diffuseColor *= (max(0.2, dot(normal, -lightDirection)));
  vec3 h = -1.0 * normalize(ray.direction + lightDirection);
  vec3 specularColor = vec3(0.5) * pow(max(0.0, dot(normal, h)), 10.0);
  vec3 c = diffuseColor + specularColor;
  return float(!is.hit) * vec3(0) + float(is.hit) * c;
}


vec3 color(Ray initialRay) {
  vec3 lightDirection = normalize(vec3(0,-1,0));
  Intersection is = intersectScene(initialRay);
  vec3 color;
  if (is.hit) {
    vec3 position = initialRay.origin + is.distance * initialRay.direction;
    vec3 normal = smoothNormal(position, is.triangle);
    // Reflection
    Ray reflectionRay;
    reflectionRay.origin = position + SCATTER_EPSILON * normal;
    reflectionRay.direction = reflect(initialRay.direction, normal);
    Intersection ris = intersectScene(reflectionRay);
    float reflectivity = float(ris.hit) * uMaterialProperties[is.triangle.a.meshIndex].x;
    // Shadow
    float shadow;
    if (dot(normal, lightDirection) > 0.0) shadow = 0.8;
    else {
      Ray shadowRay;
      shadowRay.origin = position + SCATTER_EPSILON * normal;
      shadowRay.direction = -lightDirection;
      Intersection sis = intersectScene(shadowRay);
      shadow = float(!sis.hit) * 0.8;
    }
    // Shade
    color = (0.2 + shadow) * (reflectivity * shade(reflectionRay, ris) + (1.0 - reflectivity) * shade(initialRay, is));
  } else {
    color = vec3(0);
  }
  return max(vec3(0.05), color);
}

Ray ray(vec2 point) {
  Ray ray;
  float fov = PI/3.0;
  float Z = 1.0 / tan(fov/2.0);
  ray.origin = uCameraPosition + uCameraOrientation * vec3(point.x, point.y / uAspectRatio, Z);
  ray.direction = normalize(uCameraOrientation * vec3(point.x, point.y / uAspectRatio, Z));
  return ray;
}

void main() {
  float q = 1.0;
  int antialiasWidthSegments = int(pow(2.0, q));
  int antialiasHeightSegments = int(pow(2.0, q));
  vec3 c = vec3(0);
  for (int i = 0; i < antialiasWidthSegments; i++) {
    for (int j = 0; j < antialiasHeightSegments; j++) {
      float Px = 2.0 / uWidth;
      float Py = 2.0 / uHeight;
      float Ix = Px / float(antialiasWidthSegments);
      float Iy = Py / float(antialiasHeightSegments);
      vec2 point = vec2((Ix - Px)/2.0 + float(i)*Ix, (Iy - Py)/2.0 + float(j)*Iy);
      c += color(ray(v_position + point)) / float(antialiasWidthSegments * antialiasHeightSegments);
    }
  }
  fragmentColor = vec4(c, 1.0);
}
