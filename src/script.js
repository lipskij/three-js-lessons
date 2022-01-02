import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import * as dat from "lil-gui";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

// const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  const x = event.clientX;
  const y = event.clientY;

  if (x > 180 && x < 533 && y > 500 && y < 600) {
    window.scrollTo(0, "1000");
  }
}

/**
 * Base
 */
// Debug
// const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0c0c0c);

// Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// Spot Light
const spotLight = new THREE.SpotLight(0xffffff, 0.5, 10, Math.PI * 0.55);
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 624;
spotLight.shadow.mapSize.height = 624;
spotLight.shadow.camera.fov = 30;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 6;

spotLight.position.set(0, 5, 2);
scene.add(spotLight);
scene.add(spotLight.target);

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
spotLightCameraHelper.visible = false;
scene.add(spotLightCameraHelper);

// Textures
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("/textures/matcaps/9.jpeg");
const buttonTexture = textureLoader.load("/textures/matcaps/3.png");
const buttonTextTexture = textureLoader.load("/textures/matcaps/9.jpeg");

const fontsLoader = new THREE.FontLoader();
fontsLoader.load("/fonts/font.json", (font) => {
  const textOneGeometry = new THREE.TextBufferGeometry("Emil Lipskij", {
    font: font,
    size: 0.8,
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
      size: 0.8,
      height: 0.2,
      bevelEnabled: true,
      curvedSegment: 5,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 4,
    }
  );

  // create text to put it over button
  const buttonText = new THREE.TextBufferGeometry("GET IN TOUCH", {
    font: font,
    size: 0.3,
    height: 0.2,
    bevelEnabled: true,
    curvedSegment: 5,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
  });

  textOneGeometry.center();
  textTwoGeometry.center();
  buttonText.center();

  const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
  const buttonMaterial = new THREE.MeshMatcapMaterial({
    matcap: buttonTexture,
  });
  const buttonTextMaterial = new THREE.MeshMatcapMaterial({
    matcap: buttonTextTexture,
  });

  const text = new THREE.Mesh(textOneGeometry, material);
  const textTwo = new THREE.Mesh(textTwoGeometry, material);
  const button = new THREE.Mesh(buttonText, buttonTextMaterial);

  text.castShadow = true;
  textTwo.castShadow = true;

  text.receiveShadow = true;
  textTwo.receiveShadow = true;
  buttonText.receiveShadow = true;

  text.position.y = 1;
  text.position.z = 0.3;
  text.rotation.x = -0.1;

  textTwo.position.z = 0.8;
  textTwo.position.y = 0;
  textTwo.scale.x = 0.48;
  textTwo.scale.y = 0.48;
  textTwo.scale.z = 0.48;
  textTwo.rotation.x = -0.1;

  button.position.y = -1.45;
  button.position.z = 1.2;
  button.rotation.x = -0.1;

  scene.add(text, textTwo, button);
});

const cubeGeometry = new RoundedBoxGeometry(3.5, 1, 0.5, 7, 0.1);
const cubeMaterial = new THREE.MeshMatcapMaterial({ matcap: buttonTexture });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

cube.position.y = -1.5;
cube.position.z = 1;
cube.rotation.x = -0.1;
scene.add(cube);

const material = new THREE.MeshStandardMaterial();
material.roughness = 0.7;
// gui.add(material, "metalness").min(0).max(1).step(0.001);
// gui.add(material, "roughness").min(0).max(1).step(0.001);

// const plane = new THREE.Mesh(new THREE.PlaneGeometry(6.5,3.5), material);
// plane.rotation.x = -Math.PI * 0.5;
// plane.position.y = -0.5;
// shadow
// plane.receiveShadow = true;
// scene.add(plane);
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth / 1.5,
  height: window.innerHeight / 1.5,
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

// Base camera
const camera = new THREE.PerspectiveCamera(
  100,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0.5;
camera.position.z = 3.5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// shadow
renderer.shadowMap.enabled = true;
// renderer.shadowMap.enabled = false;
// shadow radius dont work with this
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Animate
const clock = new THREE.Clock();

const tick = () => {
  // raycaster.setFromCamera(mouse, camera);
  // const intersects = raycaster.intersectObjects(scene.children);

  const elapsedTime = clock.getElapsedTime();

  // Update objects
  // for (let i = 0; i < intersects.length; i++) {
  //   if (intersects[i].object.id === 11 || intersects[i].object.id === 12) {
  //     intersects[i].object.rotation.y = 0;
  //   } else {
  //     intersects[i].object.rotation.y = elapsedTime;
  //   }
  // }
  // Zoom in animation
  // let lol = 150 - elapsedTime * 100;
  // camera.position.z = lol;

  // if (camera.position.z < 3) {
  //   camera.position.z = 3.5;
  // }

  // Update controls
  controls.update();
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.addEventListener("click", onMouseClick, false);
  window.requestAnimationFrame(tick);
};

tick();
