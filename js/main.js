// Modules
import * as THREE from 'three';
import { OrbitControls } from './three/addons/OrbitControls.js'

// Starting Position
const START_POS = { x: 0, y: 0, z: 2 }

// Floor Paramteres
const FLOOR_HEIGHT = 0.05;
const FLOOR_SIDE = 6;
const FLOOR_COLOR = 0xffffff;

// Car Parameters
const CAR_BODY_LENGTH = 1;
const CAR_BODY_HEIGHT = 0.2;
const CAR_BODY_WIDTH = 0.5;

const CAR_WHEEL_RADIUS = 0.15;
const CAR_WHEEL_THICKNESS = 0.1;

// Global Variables
var scene, camera, renderer, controls;

// Draw Floor Function
function drawFloor(scene) {

    let floorGeometry = new THREE.BoxGeometry(FLOOR_SIDE, FLOOR_HEIGHT, FLOOR_SIDE);
    let floorMaterial = new THREE.MeshBasicMaterial({ color: FLOOR_COLOR });
    let floor = new THREE.Mesh(floorGeometry, floorMaterial)
    floor.translateY(- 0.5 - FLOOR_HEIGHT / 2)
    scene.add(floor);

}

// Draw Car Function
function drawCar(scene) {

    const car = new THREE.Group();
    const bodyMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const wheelMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

    // Car Middle
    const middleGeometry = new THREE.BoxGeometry(CAR_BODY_LENGTH, CAR_BODY_HEIGHT, CAR_BODY_WIDTH);
    const middle = new THREE.Mesh(middleGeometry, bodyMaterial);
    car.add(middle);

    // Car Top
    const topGeometry = new THREE.BoxGeometry(CAR_BODY_LENGTH * (2 / 3), CAR_BODY_HEIGHT, CAR_BODY_WIDTH);
    const top = new THREE.Mesh(topGeometry, bodyMaterial);
    top.translateY(CAR_BODY_HEIGHT)
    car.add(top)

    // Car Wheels
    const wheelGeometry = new THREE.CylinderGeometry(CAR_WHEEL_RADIUS, CAR_WHEEL_RADIUS, CAR_WHEEL_THICKNESS, 16);
    const wheels = []

    for (let i = 0; i < 4; i++) {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial)
        wheel.rotateX(Math.PI/2);
        wheels.push(wheel);
        car.add(wheel)
    }

    wheels[0].translateX(  CAR_BODY_LENGTH / 2 - CAR_WHEEL_RADIUS).translateY(  CAR_BODY_WIDTH / 2 + CAR_WHEEL_THICKNESS / 2).translateZ(CAR_BODY_HEIGHT / 2)
    wheels[1].translateX(  CAR_BODY_LENGTH / 2 - CAR_WHEEL_RADIUS).translateY(- CAR_BODY_WIDTH / 2 - CAR_WHEEL_THICKNESS / 2).translateZ(CAR_BODY_HEIGHT / 2)
    wheels[2].translateX(- CAR_BODY_LENGTH / 2 + CAR_WHEEL_RADIUS).translateY(  CAR_BODY_WIDTH / 2 + CAR_WHEEL_THICKNESS / 2).translateZ(CAR_BODY_HEIGHT / 2)
    wheels[3].translateX(- CAR_BODY_LENGTH / 2 + CAR_WHEEL_RADIUS).translateY(- CAR_BODY_WIDTH / 2 - CAR_WHEEL_THICKNESS / 2).translateZ(CAR_BODY_HEIGHT / 2)

    // Add Car to Scene
    car.translateY(- 0.5 + CAR_BODY_HEIGHT / 2 + CAR_WHEEL_RADIUS)

    scene.add(car);

}

// Setup Function
function setup() {

    // Intialize Scene, Camera and Renderer
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Draw Floor
    drawFloor(scene);

    // Draw Car
    drawCar(scene);

    // Adjust Camera Position
    camera.position.x = START_POS.x
    camera.position.y = START_POS.y
    camera.position.z = START_POS.z

    // Window Resize Handler
    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Add Orbit Controls
    controls = new OrbitControls(camera, renderer.domElement);

    // Call Animate Function
    animate();

}

function animate() {

    // Update Orbit Controls
    controls.update();

    // Render Frame
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

}

// Call Setup Function
setup();