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
const text = "!tenalp ,olleH";

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
       
        });
    }

   // Crear un sistema de partículas para las estrellas
function createStars() {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.01,
    });

    const starCount = 1000;
    const positions = [];

    for (let i = 0; i < starCount; i++) {
        const x = (Math.random() - 0.5) * 50; // Distribución aleatoria
        const y = (Math.random() - 0.5) * 50;
        const z = (Math.random() - 0.5) * 50;
        positions.push(x, y, z);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);

    scene.add(stars);

    // Animar las estrellas (simular un efecto de movimiento espacial)
    function animateStars() {
        stars.rotation.x += 0.0005;
        stars.rotation.y += 0.0005;
    }

    return animateStars;
}

// Crear las estrellas y obtener su animación
const animateStars = createStars();

// Integrar la animación de las estrellas en el bucle principal
function animate() {
    requestAnimationFrame(animate);

    // Rotación del planeta
    planet.rotation.y += 0.004;

    // Animación del texto
    animateText();

    // Animación de las estrellas
    animateStars();

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
