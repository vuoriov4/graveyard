#version 300 es
precision highp float;
uniform sampler2D renderTexture;
in vec2 v_position;
out vec4 fragmentColor;

void main() {
    vec4 color = texture(renderTexture, vec2(0.5) + 0.5 * v_position);
    fragmentColor = color;
}
