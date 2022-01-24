uniform float time;
varying vec2 vUv;
varying vec2 vUv1;

uniform sampler2D texture1;
uniform sampler2D texture2;
uniform vec2 pixels;
uniform vec2 uvRate1;

void main() {
    vUv = uv;

    vec3 newPosition = position;

    newPosition.y += 0.1 * (sin(newPosition.y * 5. + time) * 0.5 + 0.5);
    newPosition.z += 0.05 * (sin(newPosition.y * 10. + time) * 0.5 + 0.5);

    vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
    gl_PointSize = 3. * (1. / - mvPosition.z );
    gl_Position = projectionMatrix * mvPosition;
}

