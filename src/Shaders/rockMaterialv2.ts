export const rockyMaterial2 = `#version 300 es
precision mediump float;

in vec2 v_uv;
out vec4 fragColor;

uniform sampler2D u_rockGraphic; // Texture for fill
uniform float u_radius;      // Corner radius
uniform float u_border;      // Border thickness
uniform vec4 u_borderColor;  // Border color
uniform vec2 u_resolution;   // Actor resolution
uniform vec4 u_tintColor;         // Color to slightly tint the texture
uniform float u_tintStrength;     // 0.0 = no tint, 1.0 = full tint

// Signed distance to rounded rectangle
float sdRoundRect(vec2 p, vec2 size, float r) {
    vec2 d = abs(p) - size + vec2(r);
    return length(max(d, 0.0)) - r;
}

void main() {
    // Convert UV to -1..1 space
    vec2 p = (v_uv * 2.0 - 1.0) * u_resolution / max(u_resolution.x, u_resolution.y);

    // Half extents of rectangle
    vec2 halfSize = u_resolution / max(u_resolution.x, u_resolution.y);

    // Distance from point to rounded rectangle
    float dist = sdRoundRect(p, halfSize, u_radius);

    // Antialiasing width
    float aa = fwidth(dist);

     // Sample texture
    vec4 texColor = texture(u_rockGraphic, v_uv);
    //Apply slight tint
    texColor.rgb = mix(texColor.rgb, u_tintColor.rgb, u_tintStrength);
   
    // Full shape mask
    float inside = 1.0 - smoothstep(0.0, aa, dist);

    // Border mask: pixels within u_border of edge
    float borderMask = smoothstep(-u_border - aa, -u_border + aa, dist);

    // Fill mask: inside minus border
    float fillMask = inside * (1.0 - borderMask);

    // Compose final color
    vec4 fillColor = texColor * fillMask;
    vec4 edgeColor = u_borderColor * (inside * borderMask);

    fragColor = fillColor + edgeColor;

    if (inside <= 0.0) discard;
}


`;
