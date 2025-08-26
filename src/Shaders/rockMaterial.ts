export const rockyMaterial = `#version 300 es
precision mediump float;

uniform vec2 u_resolution;
uniform float u_roughness;
uniform float u_time;
uniform vec4 u_baseColor;  // main rock color
uniform vec4 u_bgColor;    // background color
uniform float u_borderSize; // thickness of border in UV space (0.0–0.5)

in vec2 v_uv;
out vec4 fragColor;

// Simple 2D noise function
float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
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

void main() {
  // Scale UV for noise
  

vec2 st = v_uv * 10.0 * u_roughness + vec2(u_time);
float n = noise(st);
n = pow(n, 3.0); // makes darks darker, lights sharper

  // Blend between background and rock
  vec4 rockColor = mix(u_bgColor, u_baseColor, n);

  // Border effect (simple UV check)
  float border = step(v_uv.x, u_borderSize) +
                 step(v_uv.y, u_borderSize) +
                 step(1.0 - v_uv.x, u_borderSize) +
                 step(1.0 - v_uv.y, u_borderSize);

  if (border > 0.0) {
  rockColor = u_baseColor; // <-- use background color instead of black
}

  fragColor = rockColor;
}
`;
