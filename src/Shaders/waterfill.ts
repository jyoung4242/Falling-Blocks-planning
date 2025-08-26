export const waterfill = `#version 300 es 
precision mediump float; 
in vec2 v_uv; 
out vec4 fragColor; 
uniform sampler2D u_screen_texture;
 uniform sampler2D u_graphic; 
 uniform float u_fillAmount; 
 uniform float u_time; 
 uniform vec4 u_waterColor;
 uniform float u_waterOpacity; 
 uniform float u_waveAmplitude; // wave height 
 uniform float u_waveFrequency; // number of ripples 
 uniform float u_waveSpeed; // wave animation speed  
 uniform float u_noiseAmplitude; // extra noise 
  
 
 // // pseudo-random function 
 float rand(vec2 co){ 
 return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453); 
 }
 
 void main() { 
 vec2 uv = v_uv; 
 vec4 tex = texture(u_screen_texture, vec2(uv.x, 1.0 - uv.y)); // sine wave 
 
 float wave = u_waveAmplitude * sin((uv.x * u_waveFrequency) + (u_time * u_waveSpeed));
  // add some random noise

  float noise = (rand(uv + u_time) - 0.5) * u_noiseAmplitude; 
  float cutoff = u_fillAmount + wave + noise; 
  
  if (1.0 - uv.y <= cutoff) { 
  fragColor = mix(tex, u_waterColor, u_waterOpacity) * tex.a; 
  } else {
    fragColor = tex;
 }
 } `;