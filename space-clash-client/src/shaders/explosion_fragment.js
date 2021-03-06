export default `
#define DURATION 1.0
#ifdef GL_ES
   precision mediump float;
#endif

varying vec2 vUV;

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x*34.0)+1.0)*x);
}

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i); // Avoid truncation effects in permutation
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
		+ i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float distanceCircle(vec2 pos, vec2 origin, float radius) {
	return length(pos - origin) - radius;
}

float distanceGlobal(vec2 uv, float time) {
    vec2 center = vec2(0.5, 0.5);
    float d;
    for (int i = 0; i < 8; i++) {
        float sx = cos(float(i) * 1.0);
        float sy = sin(float(i) * 1.0);
        float sz = sx + sy;
        vec2 v0 = 0.055 * vec2(snoise(vec2(sx, sy)), vec2(sy, sx));
        float radius = 0.08 + 0.25 * time / DURATION;
    	float d0 = distanceCircle(uv, center + v0 * time, radius);
        if (i == 0) d = d0;
        else d = min(d, d0);
    }
	return d;
}


void main(void) {
   vec2 uv = 2.0 * vUv - vec2(1.0);
   vec4 color;
   float time = mod(iTime, DURATION);
   float linpol =  (DURATION - time) / DURATION;
   vec4 grey = vec4(0.5 * linpol);
   vec4 red = vec4(1.0, 0.1, 0.0, 1.0) * linpol;
   vec4 orange = vec4(1.0, 0.99, 0.0, 1.0) * linpol;
   float d = distanceGlobal(uv, time);
   if (d > 0.0) color = vec4(0);
   else if (d > -0.25 * time * 0.4) color = grey;
   else if (d > -0.66 * time * 0.4) color = orange;
   else  color = red;
   color = vec4(1,1,1,1);
   gl_FragColor = color;
}
`
