export const staminaShader = `#version 300 es
precision mediump float;

in vec2 v_uv;
out vec4 fragColor;

uniform sampler2D u_graphic;  // Actor's texture
uniform float u_time_ms;
uniform float u_maxStamina;
uniform float u_currentStamina;

void main() {
  vec4 baseColor = texture(u_graphic, v_uv);

  // Don't tint transparent pixels
  if (baseColor.a < 0.01) {
    fragColor = baseColor;
    return;
  }

  float staminaPct = u_currentStamina / max(u_maxStamina, 0.0001);

  vec3 finalColor = baseColor.rgb;

  if (staminaPct < 0.5) {
    // How low stamina is (0 at 50%, 1 at 0%)
    float lowFactor = (0.5 - staminaPct) / 0.5;

    // Tint goes from orange -> red
    vec3 orange = vec3(1.0, 0.6, 0.2);
    vec3 red    = vec3(1.0, 0.0, 0.0);
    vec3 tint   = mix(orange, red, lowFactor);

    // Much faster, more aggressive pulsing
    float speed = mix(0.025, 0.06, lowFactor);
    float pulse = sin(u_time_ms * speed) * 0.5 + 0.5; // 0..1
    
    // Strong base tint with dramatic pulse variation
    float minIntensity = mix(0.4, 0.7, lowFactor);  // minimum tint strength
    float maxIntensity = mix(0.8, 1.2, lowFactor);  // maximum tint strength
    float intensity = mix(minIntensity, maxIntensity, pulse);
    
    // Apply very strong tinting effect
    finalColor = mix(baseColor.rgb, tint, intensity);
    
    // Boost saturation for more dramatic effect
    vec3 luminance = vec3(dot(finalColor, vec3(0.299, 0.587, 0.114)));
    finalColor = mix(luminance, finalColor, 1.5); // increase saturation
    
    // Clamp values
    finalColor = clamp(finalColor, vec3(0.0), vec3(1.0));
  }

  fragColor = vec4(finalColor, baseColor.a);
}
`;
