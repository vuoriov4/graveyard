#version 300 es
precision highp float;
uniform sampler2D distanceTexture;
in vec2 v_position;
layout(location = 0) out vec4 fragmentColor;

void main()
{
	fragmentColor = texture(distanceTexture, vec2(0.5) + 0.5 * v_position);
}
