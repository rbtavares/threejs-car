// Modules
import * as THREE from 'three';
import { OrbitControls } from './three/addons/OrbitControls.js'

// Camera
var camera;
const CAM_INITIAL_POS = { x: 3, y: 3, z: 3 }
const CAM_FOV = 75;
const CAM_NEAR = 0.1;
const CAM_FAR = 1000;

// Renderer
var renderer;
const RND_ENABLE_SHADOWS = true;

// Floor
const FLOOR_HEIGHT = 0.05;
const FLOOR_SIDE = 6;
const FLOOR_COLOR = 0xffffff;

// Car
var car;
var wheels;
const SPEED = 0.015;
const CAR_BODY_LENGTH = 1;
const CAR_BODY_HEIGHT = 0.2;
const CAR_BODY_WIDTH = 0.5;
const CAR_BODY_COLOR = 0xff0000;
const CAR_WHEEL_RADIUS = 0.15;
const CAR_WHEEL_THICKNESS = 0.1;
const CAR_WHEEL_ROTATION_FRONT = Math.PI / 6;
const CAR_WHEEL_ROTATION_REAR = Math.PI / (6 * 3);
const CAR_WHEEL_COLOR = 0x222222;

// Lights
const AMBIENT_LIGHT_COLOR = 0x404040;

const LIGHTS_DATA = [
    {
        color: 0xffffff,
        intensity: 15,
        distance: 100,
        position: [-2.5, 0.75, -2.5],
    },
    {
        color: 0xffffff,
        intensity: 15,
        distance: 100,
        position: [2.5, 0.75, 2.5],
    }
];

const SHADOWS_DATA = {
    mapSize: 2048,
    near: 0.5,
    far: 500
};

// Controls
var controls;

// Scene
var scene;

// Active Key Table
var keys = {};

// Draw Floor Function
function drawFloor(scene) {

    let floorGeometry = new THREE.BoxGeometry(FLOOR_SIDE, FLOOR_HEIGHT, FLOOR_SIDE);
    let floorMaterial = new THREE.MeshPhongMaterial({ color: FLOOR_COLOR });
    let floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.translateY(- 0.5 - FLOOR_HEIGHT / 2);
    floor.receiveShadow = true;
    scene.add(floor);

}

// Draw Car Function
function drawCar(scene) {

    car = new THREE.Group();
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: CAR_BODY_COLOR, shininess: 64 });
    const wheelMaterial = new THREE.MeshPhongMaterial({ color: CAR_WHEEL_COLOR, shininess: 32 });

    // Car Middle
    const middleGeometry = new THREE.BoxGeometry(CAR_BODY_LENGTH, CAR_BODY_HEIGHT, CAR_BODY_WIDTH);
    const middle = new THREE.Mesh(middleGeometry, bodyMaterial);
    middle.castShadow = true;
    middle.receiveShadow = false;
    car.add(middle);

    // Car Top
    const topGeometry = new THREE.BoxGeometry(CAR_BODY_LENGTH * (1 / 3), CAR_BODY_HEIGHT, CAR_BODY_WIDTH);
    const top = new THREE.Mesh(topGeometry, bodyMaterial);
    top.translateY(CAR_BODY_HEIGHT);
    top.translateX(- CAR_BODY_LENGTH * (1/4));
    top.castShadow = true;
    top.receiveShadow = false;
    car.add(top);

    // Car Wheels
    const wheelGeometry = new THREE.CylinderGeometry(CAR_WHEEL_RADIUS, CAR_WHEEL_RADIUS, CAR_WHEEL_THICKNESS, 16);
    wheels = [];

    for (let i = 0; i < 4; i++) {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.castShadow = true;
        wheel.receiveShadow = false;
        wheel.rotateX(Math.PI / 2);
        wheels.push(wheel);
        car.add(wheel);
    }

    wheels[0].translateX(CAR_BODY_LENGTH / 2 - CAR_WHEEL_RADIUS).translateY(CAR_BODY_WIDTH / 2 + CAR_WHEEL_THICKNESS / 2).translateZ(CAR_BODY_HEIGHT / 2);
    wheels[1].translateX(CAR_BODY_LENGTH / 2 - CAR_WHEEL_RADIUS).translateY(- CAR_BODY_WIDTH / 2 - CAR_WHEEL_THICKNESS / 2).translateZ(CAR_BODY_HEIGHT / 2);
    wheels[2].translateX(- CAR_BODY_LENGTH / 2 + CAR_WHEEL_RADIUS).translateY(CAR_BODY_WIDTH / 2 + CAR_WHEEL_THICKNESS / 2).translateZ(CAR_BODY_HEIGHT / 2);
    wheels[3].translateX(- CAR_BODY_LENGTH / 2 + CAR_WHEEL_RADIUS).translateY(- CAR_BODY_WIDTH / 2 - CAR_WHEEL_THICKNESS / 2).translateZ(CAR_BODY_HEIGHT / 2);

    // Add Car to Scene
    car.translateY(- 0.5 + CAR_BODY_HEIGHT / 2 + CAR_WHEEL_RADIUS)
    scene.add(car);

}

function addLights(scene) {

    // Point Lights
    for (let i = 0; i < LIGHTS_DATA.length; i++) {
        const LDATA = LIGHTS_DATA[i];

        const light = new THREE.PointLight(LDATA.color, LDATA.intensity, LDATA.distance);
        light.position.set(...LDATA.position);

        light.castShadow = true;
        light.shadow.mapSize.width = SHADOWS_DATA.mapSize;
        light.shadow.mapSize.height = SHADOWS_DATA.mapSize;
        light.shadow.camera.near = SHADOWS_DATA.near;
        light.shadow.camera.far = SHADOWS_DATA.far;

        scene.add(light);
    }

    // Ambient light to add some overall illumination
    const ambientLight = new THREE.AmbientLight(AMBIENT_LIGHT_COLOR);
    scene.add(ambientLight);

}

// Setup Function
function setup() {

    // Camera
    camera = new THREE.PerspectiveCamera(CAM_FOV, window.innerWidth / window.innerHeight, CAM_NEAR, CAM_FAR);

    camera.position.x = CAM_INITIAL_POS.x
    camera.position.y = CAM_INITIAL_POS.y
    camera.position.z = CAM_INITIAL_POS.z

    // Renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    if (RND_ENABLE_SHADOWS) {
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    document.body.appendChild(renderer.domElement);

    // Scene
    scene = new THREE.Scene();

    // Orbit Controls
    controls = new OrbitControls(camera, renderer.domElement);

    // Draw Floor
    drawFloor(scene);

    // Draw Car
    drawCar(scene);

    // Add Lights
    addLights(scene);

    // Window Resize Handler
    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Keyboard Handler
    window.addEventListener("keydown", (event) => { keys[event.code] = true; });
    window.addEventListener("keyup", (event) => { keys[event.code] = false; });

    // Call Animate Function
    animate();

}

// Car Movement Functions
function moveForward() {
    car.position.z += SPEED * Math.sin(car.rotation.y);
    car.position.x -= SPEED * Math.cos(car.rotation.y);
}

function moveBackward() {
    car.position.z -= SPEED * Math.sin(car.rotation.y);
    car.position.x += SPEED * Math.cos(car.rotation.y);
}

function turnRight() {
    car.rotation.y += 0.03;
}

function turnLeft() {
    car.rotation.y -= 0.03;
}

// Car Wheels Movement
function rotateWheelsLeft() {
    wheels[0].rotation.z = - CAR_WHEEL_ROTATION_REAR;
    wheels[1].rotation.z = - CAR_WHEEL_ROTATION_REAR;
    wheels[2].rotation.z = CAR_WHEEL_ROTATION_FRONT;
    wheels[3].rotation.z = CAR_WHEEL_ROTATION_FRONT;
}

function rotateWheelsRight() {
    wheels[0].rotation.z = CAR_WHEEL_ROTATION_REAR;
    wheels[1].rotation.z = CAR_WHEEL_ROTATION_REAR;
    wheels[2].rotation.z = - CAR_WHEEL_ROTATION_FRONT;
    wheels[3].rotation.z = - CAR_WHEEL_ROTATION_FRONT;
}

function resetWheelRotation() {
    for (let i = 0; i < wheels.length; i++) {
        wheels[i].rotation.z = 0;
    }
}

// Animate Function
function animate() {

    // Car Fwd/Bwd
    if (keys['KeyW']) {
        if (keys['KeyA']) { turnRight() }
        else if (keys['KeyD']) { turnLeft() }
        moveForward()
    }

    if (keys['KeyS']) {
        if (keys['KeyD']) { turnRight() }
        else if (keys['KeyA']) { turnLeft() }
        moveBackward()
    }

    // Car Turn
    if (keys['KeyA']) {
        rotateWheelsRight();
    } else if (keys['KeyD']) {
        rotateWheelsLeft();
    } else
        resetWheelRotation();

    // Color Cycle Car
    let dt = new Date();
    let secs = dt.getSeconds() + (60 * dt.getMinutes()) + (60 * 60 * dt.getHours());
    car.children[0].material.color.setHSL((secs / 86400), 100/100, 50/100);
    
    // Update Orbit Controls
    controls.update();

    // Render Frame
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

}

// Call Setup Function
setup();