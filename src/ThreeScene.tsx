import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Stats from 'three/examples/jsm/libs/stats.module'

import './App.css';


const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper(5))

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.y = 1
camera.position.z = 2

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)


const controls = new PointerLockControls(camera, renderer.domElement)


const planeGeometry = new THREE.PlaneGeometry(100, 100, 50, 50)
const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
})
const plane = new THREE.Mesh(planeGeometry, material)
plane.rotateX(-Math.PI / 2)
scene.add(plane)

const onKeyDown = function (event: KeyboardEvent) {
    switch (event.code) {
        case 'KeyW':
            controls.moveForward(0.25)
            break
        case 'KeyA':
            controls.moveRight(-0.25)
            break
        case 'KeyS':
            controls.moveForward(-0.25)
            break
        case 'KeyD':
            controls.moveRight(0.25)
            break
    }
}


const stats = new Stats()
document.body.appendChild(stats.dom)




function ThreeScene() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let controls: OrbitControls;
    const elm = document.getElementById('root');

    useEffect(() => {

        Init();

    }, []);

    function Init() {


        console.log(elm);
        //console.log(model1Path);
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);
        // scene.fog = new THREE.FogExp2(0xcccccc, 0.2);

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(500, 550);
        elm?.appendChild(renderer.domElement);
        camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.25,
            20
        );
        camera.position.set(-1.8, 0.6, 2.7);

        // controls

        controls = new OrbitControls(camera, renderer.domElement);
        controls.listenToKeyEvents(window); // optional

        controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        controls.dampingFactor = 0.05;

        controls.screenSpacePanning = false;

        controls.minDistance = 1;
        controls.maxDistance = 5;

        controls.maxPolarAngle = Math.PI / 2;

        // world
        const loader = new GLTFLoader();
        const fileURL = "https://storage.googleapis.com/www.halwa.ca/chair-model/scene.gltf";
        loader.load(
            fileURL,
            (gltf) => {
                const model1 = gltf.scene;
                model1.position.x = -2;
                // model1.applyMatrix4(commonMatrix);
                scene.add(model1);
            },
            undefined,
            (error) => {
                console.error(error);
            }
        );

        const loader1 = new GLTFLoader();
        const fileURL1 = "https://storage.googleapis.com/www.halwa.ca/chair-model/scene.gltf";
        loader1.load(
            fileURL1,
            (gltf) => {
                const model2 = gltf.scene;
                model2.position.x = 2;
                // model2.applyMatrix4(commonMatrix);
                scene.add(model2);
                //camera.position.z = 5;
            },
            undefined,
            (error) => {
                console.error(error);
            }
        );

        // lights

        const dirLight1 = new THREE.DirectionalLight(0xffffff);
        dirLight1.position.set(1, 1, 1);
        scene.add(dirLight1);

        const dirLight2 = new THREE.DirectionalLight(0x002288);
        dirLight2.position.set(-1, -1, -1);
        scene.add(dirLight2);

        const ambientLight = new THREE.AmbientLight(0x222222);
        scene.add(ambientLight);

        window.addEventListener('resize', onWindowResize);
        document.addEventListener('keydown', onKeyDown)
      

        animate();

        return <h1>I've rendered times!</h1>;

    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
        requestAnimationFrame(animate);

        controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

        render();

        stats.update()
    }

    function render() {
        renderer.render(scene, camera);
    }

    return <div ref={containerRef} />;
};

export default ThreeScene;

