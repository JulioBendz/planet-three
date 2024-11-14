import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

// Crear escena, cámara y renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Fondo espacial
const spaceTexture = new THREE.TextureLoader().load('/assets/2k_stars.jpg');
scene.background = spaceTexture;

// Crear el planeta
const planetTexture = new THREE.TextureLoader().load('/assets/earthx5400x2700.jpg');
const planetGeometry = new THREE.SphereGeometry(1, 32, 32);
const planetMaterial = new THREE.MeshStandardMaterial({ map: planetTexture });
const planet = new THREE.Mesh(planetGeometry, planetMaterial);
scene.add(planet);

// Añadir luces
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(3, 3, 3);
scene.add(directionalLight);
const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
scene.add(ambientLight);
const hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0x333333, 0.9);
scene.add(hemisphereLight);

// Posición inicial de la cámara
camera.position.z = 3;

// Configuración para el texto curvado alrededor del planeta
const orbitRadiusX = 2.5;
const orbitRadiusZ = 1.5;
const text = "Hello, Planet!";

// Cargar la fuente y crear los caracteres individuales
const fontLoader = new FontLoader();
fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
    const letters = [];

    // Crear cada letra como un mesh independiente y agregarla a la escena
    for (let i = 0; i < text.length; i++) {
        const charGeometry = new TextGeometry(text[i], {
            font: font,
            size: 0.2,
            height: 0.05,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.01,
            bevelSize: 0.01,
            bevelOffset: 0,
            bevelSegments: 5
        });
        const charMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const charMesh = new THREE.Mesh(charGeometry, charMaterial);
        scene.add(charMesh);
        letters.push(charMesh);
    }

    // Función de animación del texto alrededor del planeta
    let angle = 0;
    function animateText() {
        angle += 0.01;

        // Calcular la posición de cada letra en la órbita
        letters.forEach((letter, index) => {
            const charAngle = angle + (index * 0.1); // Desfase para curvar el texto
            letter.position.x = orbitRadiusX * Math.cos(charAngle);
            letter.position.z = orbitRadiusZ * Math.sin(charAngle);
            letter.position.y = 0;

            // Hacer que cada letra mire al centro del planeta
            letter.lookAt(planet.position);
        });
    }

    // Llamar a la animación principal
    function animate() {
        requestAnimationFrame(animate);

        // Rotación del planeta
        planet.rotation.y += 0.004;

        // Animación del texto
        animateText();

        renderer.render(scene, camera);
    }

    animate();
});

// Ajustar tamaño del renderizador y cámara al cambiar el tamaño de la ventana
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});
