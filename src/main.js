import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

// Crea la escena, cámara y renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Fondo espacial
const spaceTexture = new THREE.TextureLoader().load('/assets/2k_stars.jpg');
scene.background = spaceTexture;

// Crea la esfera (planeta) con la textura de la Tierra
const planetTexture = new THREE.TextureLoader().load('/assets/earthx5400x2700.jpg');
const planetGeometry = new THREE.SphereGeometry(1, 32, 32);
const planetMaterial = new THREE.MeshStandardMaterial({ map: planetTexture });
const planet = new THREE.Mesh(planetGeometry, planetMaterial);
scene.add(planet);

// Añade luz para que el planeta sea visible
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(3, 3, 3);
scene.add(directionalLight);

// Luz ambiental para rellenar sombras
const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
scene.add(ambientLight);

const hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0x333333, 0.9);
scene.add(hemisphereLight);

// Posición inicial de la cámara
camera.position.z = 3;

// Añadir el texto giratorio
const fontLoader = new FontLoader();
fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
    // Crear geometría de texto
    const textGeometry = new TextGeometry('Hello, Planet!', {
        font: font,
        size: 0.2,
        height: 0.05,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5
    });

    // Material del texto
    const textMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);

    // Posición inicial del texto (orbita del planeta)
    const orbitRadius = 2; // Radio de la órbita del texto
    textMesh.position.set(orbitRadius, 0, 0);
    scene.add(textMesh);

    // Animación de rotación alrededor del planeta
    let angle = 0;
    function animateText() {
        angle += 0.01; // Ajusta la velocidad de rotación cambiando este valor
        textMesh.position.x = orbitRadius * Math.cos(angle);
        textMesh.position.z = orbitRadius * Math.sin(angle);
    }

    // Llamar a la animación principal
    function animate() {
        requestAnimationFrame(animate);

        // Rotación del planeta (ya existente en tu código)
        planet.rotation.y += 0.004;

        // Animación del texto
        animateText();

        renderer.render(scene, camera);
    }

    // Iniciar la animación
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