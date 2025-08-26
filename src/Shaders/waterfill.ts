export const waterfill = `#version 300 es
precision mediump float;

in vec2 v_uv;
out vec4 fragColor;

uniform sampler2D u_graphic;      // the object/shape texture
uniform float u_fillAmount;
uniform float u_time;
uniform vec4 u_waterColor;
uniform float u_waterOpacity;

uniform float u_waveAmplitude;  // wave height
uniform float u_waveFrequency;  // number of ripples
uniform float u_waveSpeed;      // wave animation speed
uniform float u_noiseAmplitude; // extra noise

// pseudo-random function
float rand(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
    vec2 uv = v_uv;

    // get the graphic (mask/shape)
    vec4 base = texture(u_graphic, uv);

    // discard fully transparent pixels so background won’t show
    if (base.a < 0.01) {
        discard;
    }

    // sine wave
    float wave = u_waveAmplitude * sin((uv.x * u_waveFrequency) + (u_time * u_waveSpeed));

    // add some random noise
    float noise = (rand(uv + u_time) - 0.5) * u_noiseAmplitude;

    float cutoff = u_fillAmount + wave + noise;

    if (1.0 - uv.y <= cutoff) {
        // inside fill → tint with water color
        fragColor = mix(base, u_waterColor, u_waterOpacity);
    } else {
        // above fill → original graphic color
        fragColor = base;
    }
}
`;
