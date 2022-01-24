import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

import VertexShader from './shaders/vertex.glsl'
import FragmentShader from './shaders/fragment.glsl'
import particlesVertexShader from './shaders/vertexParticles.glsl'
import particlesFragmentShader from './shaders/fragmentParticles.glsl'

/**
 * Base
 */
let time = 0

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sphere
 */
// Geometry
const geometry = new THREE.SphereBufferGeometry(1, 462, 462)

// Material
const material = new THREE.ShaderMaterial({
    extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enale"
    },
    side: THREE.DoubleSide,
    uniforms: {
        time: { type: "f", value: 0 },
        resolution: { type: "v4", value: new THREE.Vector4() },
        uvRate1: { 
            value: new THREE.Vector2(1, 1) 
        },
    },
    vertexShader: VertexShader,
    fragmentShader: FragmentShader,
    side: THREE.DoubleSide
})

const sphere = new THREE.Mesh(geometry, material)
scene.add(sphere)

/**
 * Particles
 */

let count = 20000
let positions = new Float32Array(count * 3)
let particleGeometry = new THREE.BufferGeometry()

let inc = Math.PI * (3 - Math.sqrt(5))
let offset = 2/count
let radius = 1.8

for (let i = 0; i < count; i++) {
    
    let y = i * offset - 1 + (offset/2)
    let r = Math.sqrt(1 - y*y)
    let phi = i * inc

    positions[i * 3] = Math.cos(phi) * r * radius
    positions[i * 3 + 1] = y * radius
    positions[i * 3 + 2] = Math.sin(phi) * r * radius
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

const particleMaterial = new THREE.ShaderMaterial({
    extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enale"
    },
    side: THREE.DoubleSide,
    uniforms: {
        time: { type: "f", value: 0 },
        resolution: { type: "v4", value: new THREE.Vector4() },
        uvRate1: { 
            value: new THREE.Vector2(1, 1) 
        },
    },
    transparent: true,
    vertexShader: particlesVertexShader,
    fragmentShader: particlesFragmentShader,
})

const particles = new THREE.Points(particleGeometry, particleMaterial)
scene.add(particles)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 6)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    time += 0.05
    material.uniforms.time.value = time
    particleMaterial.uniforms.time.value = time
    particles.rotation.y = time/10

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()