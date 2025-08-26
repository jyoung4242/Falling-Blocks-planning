export const rockyMaterial = `#version 300 es
precision mediump float;

uniform float u_seed;

uniform vec2 u_resolution;
uniform float u_roughness;
uniform float u_time;
uniform vec4 u_baseColor;   // main rock color
uniform vec4 u_bgColor;     // background color
uniform float u_borderSize; // thickness of border in UV space (0.0 -> 0.5)

in vec2 v_uv;
out vec4 fragColor;

// Simple 2D noise function
float random(vec2 st) {
  // Fold in seed so each actor hashes differently
  return fract(sin(dot(st.xy + u_seed, vec2(12.9898,78.233))) * 43758.5453123);
}

float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);

  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));

  vec2 u = f*f*(3.0-2.0*f);

  return mix(a, b, u.x) +
         (c - a)* u.y * (1.0 - u.x) +
         (d - b) * u.x * u.y;
}
         
// Rounded rectangle SDF
float roundedRectSDF(vec2 uv, vec2 size, float radius) {
    // center uv around (0.0,0.0), range -0.5..0.5
    vec2 p = uv - 0.5;

    // half-size of rect
    vec2 _half = size * 0.5;

    // distance to edges with corner radius
    vec2 d = abs(p) - _half + vec2(radius);

    float outsideDist = length(max(d, 0.0)) - radius;
    float insideDist = min(max(d.x, d.y), 0.0);

    return outsideDist + insideDist; // < 0 inside, > 0 outside
}


void main() {
  // --- derive per-actor offset and scale from seed ---
  float seedX = fract(sin(u_seed * 91.7) * 43758.5453);
  float seedY = fract(sin(u_seed * 12.3) * 12345.6789);
  vec2 seedOffset = vec2(seedX, seedY) * 50.0;   // big offset to decorrelate blocks
  float seedScale = 8.0 + 4.0 * seedX;           // vary noise scale per actor

  // --- noise sampling ---
  vec2 st = v_uv * seedScale * u_roughness + seedOffset;

 float freq = 3.0 + fract(u_seed) * 5.0; // 3 → 8 range
float n = noise(v_uv * freq + u_seed);
  n = pow(n, 3.0); // makes darks darker, lights sharper

  // --- blend between background and rock ---
  vec4 rockColor = mix(u_bgColor, u_baseColor, n);

  // --- border effect (simple rectangular border) ---
 // control rounded corners
  float radius = 0.15; // 0.0 = square, higher = rounder
  float sdf = roundedRectSDF(v_uv, vec2(1.0), radius);

  // border threshold
  float border = smoothstep(0.0, 0.01, sdf + u_borderSize) -
               smoothstep(0.0, 0.01, sdf);

               if (sdf > 0.0) {
    // Outside shape → transparent (or background color if you prefer)
    fragColor = vec4(0.);
} else if (border > 0.0) {
    // Border zone
    fragColor = u_baseColor;
} else {
    // Inside rock pattern
    fragColor = rockColor;
}


}
`;
