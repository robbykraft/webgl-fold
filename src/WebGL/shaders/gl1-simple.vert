attribute vec2 v_position;
attribute vec3 v_color;

uniform mat4 u_matrix;
varying vec3 blend_color;

void main () {
	gl_Position = u_matrix * vec4(v_position, 0, 1);
	blend_color = v_color;
}
