import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseMove(event) {
  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}
/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("/textures/matcaps/2.png");
const cubeTexture1 = textureLoader.load("/textures/matcaps/11.jpeg");
const cubeTexture2 = textureLoader.load("/textures/matcaps/8.png");
// Fonts
const fontsLoader = new THREE.FontLoader();
fontsLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const textOneGeometry = new THREE.TextBufferGeometry("Emil Lipskij", {
    font: font,
    size: 0.5,
    height: 0.2,
    bevelEnabled: true,
    curvedSegment: 5,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
  });
  const textTwoGeometry = new THREE.TextBufferGeometry(
    "Front   End   Developer",
    {
      font: font,
      size: 0.5,
      height: 0.2,
      bevelEnabled: true,
      curvedSegment: 5,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 4,
    }
  );

  textOneGeometry.center();
  textTwoGeometry.center();

  const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

  const text = new THREE.Mesh(textOneGeometry, material);
  const textTwo = new THREE.Mesh(textTwoGeometry, material);

  text.position.y = 1;
  textTwo.position.y = 0;
  textTwo.scale.x = 0.48;
  textTwo.scale.y = 0.48;
  textTwo.scale.z = 0.48;
  scene.add(text);
  scene.add(textTwo);

  // optimization for loading
  const cubeGeometry = new RoundedBoxGeometry(1, 1, 1, 7, 0.1);
  const cubeMaterial = new THREE.MeshMatcapMaterial({ matcap: cubeTexture2 });

  for (let i = 0; i < 300; i++) {
    // cube with rounded egdes
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

    cube.position.x = (Math.random() - 0.5) * 20;
    cube.position.y = (Math.random() - 0.5) * 20;
    cube.position.z = (Math.random() - 0.5) * 20;
    cube.rotation.x = 0;

    const scale = (Math.random() - 0.5) / 2;
    cube.scale.set(scale, scale, scale);
    scene.add(cube);
  }
});

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  100,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 20;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  const elapsedTime = clock.getElapsedTime();

  // Update objects
  for (let i = 0; i < intersects.length; i++) {
    if (intersects[i].object.id === 11 || intersects[i].object.id === 12) {
      intersects[i].object.rotation.y = 0;
    } else {
      intersects[i].object.rotation.y = elapsedTime;
    }
  }

  // Zoom in animation
  let lol = 150 - elapsedTime * 100;
  camera.position.z = lol;

  if (camera.position.z < 2) {
    camera.position.z = 2;
  }

  // Update controls
  controls.update();
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.addEventListener("mousemove", onMouseMove, false);
  window.requestAnimationFrame(tick);
};

tick();
