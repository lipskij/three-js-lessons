import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
// import * as dat from "lil-gui";

////////////////////////
// Nav bar mobile

const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const links = document.querySelectorAll(".nav-links li");
const lines = document.querySelectorAll(".line");

hamburger.addEventListener("click", () => {
  document.body.classList.toggle("open");

  navLinks.classList.toggle("open");
  links.forEach((link) => {
    link.classList.add("fade");
    document.body.style.height = "100%";
  });

  lines.forEach((line) => {
    line.classList.toggle("open");
  });
});

navLinks.addEventListener("click", () => {
  const sepLink = navLinks;
  sepLink.classList.remove("open");

  document.body.style.overflow = "auto";

  lines.forEach((line) => {
    line.classList.toggle("open");
  });
});

// Intersection observer for images

const options = {
  root: null,
  threshold: 0.5,
};

function observerFn(entries) {
  entries.forEach((entry) => {
    entry.target.style.transform = "translateX(-100px)";
    entry.target.style.opacity = 0;

    if (entry.isIntersecting) {
      entry.target.style.transform = "translateX(0)";
      entry.target.style.opacity = 1;
    }
  });
}
const observer = new IntersectionObserver(observerFn, options);

const image = document.querySelectorAll(".image");

image.forEach((img) => {
  observer.observe(img);
});

// Footers year

const footer = document.querySelector("footer");
footer.appendChild(document.createTextNode(new Date().getFullYear()))

////////////////////////

const mouse = new THREE.Vector2();

function onMouseClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  const x = event.pageX;
  const y = event.pageY;

  if (x > 450 && x < 990 && y > 620 && y < 830) {
    window.scrollTo(0, "2000");
  }
}

// Mobiele touch
function onTouchEnd(e) {
  const x = e.changedTouches[0].pageX;
  const y = e.changedTouches[0].pageY;

  const mobileHeight = window.innerHeight;
  // const mobileWidth = window.innerWidth;

  // Adjust for big phones
  if (mobileHeight > 790 && mobileHeight < 890) {
    if (x > 35 && x < 350 && y > 550 && y < 670) {
      window.scrollTo(0, "2000");
    }
  }

  // Adjust for small phones
  if (mobileHeight > 500 && mobileHeight < 600) {
    if (x > 50 && x < 280 && y > 400 && y < 470) {
      window.scrollTo(0, "1800");
    }
  }
}

// Base
// Debug
// const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0c0c0c);

// Light
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// Spot Light
const spotLight = new THREE.SpotLight(0xffffff, 1, 10, Math.PI * 0.55);
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.fov = 30;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 6;

spotLight.position.set(0, 2, 5);
scene.add(spotLight);
scene.add(spotLight.target);

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
spotLightCameraHelper.visible = false;
scene.add(spotLightCameraHelper);

// Textures
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("/textures/matcaps/lgtv_matcap.jpeg");
const buttonTexture = textureLoader.load("/textures/matcaps/lgtv_matcap.jpeg");
const buttonTextTexture = textureLoader.load(
  "/textures/matcaps/dark_matcap.jpeg"
);

// Mobile sizes
const mobilesSize = window.innerWidth < 700;

const fontsLoader = new THREE.FontLoader();
fontsLoader.load("/fonts/font.json", (font) => {
  const textOneGeometry = new THREE.TextBufferGeometry("Emil Lipskij", {
    font: font,
    size: mobilesSize ? 0.45 : 0.8,
    height: 0.15,
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
      size: mobilesSize ? 0.45 : 0.8,
      height: 0.2,
      bevelEnabled: true,
      curvedSegment: 5,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 4,
    }
  );

  // Text over button
  const buttonText = new THREE.TextBufferGeometry("GET IN TOUCH", {
    font: font,
    size: mobilesSize ? 0.2 : 0.3,
    height: 0.2,
    bevelEnabled: true,
    curvedSegment: 5,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
  });

  // smiley
  const smileyText = new THREE.TextBufferGeometry(
    "Curious one... I like you  :)",
    {
      font: font,
      size: mobilesSize ? 0.15 : 0.2,
      height: 0.2,
      bevelEnabled: true,
      curvedSegment: 5,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 4,
    }
  );
  //

  textOneGeometry.center();
  textTwoGeometry.center();
  buttonText.center();
  smileyText.center();

  const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

  const buttonTextMaterial = new THREE.MeshMatcapMaterial({
    matcap: buttonTextTexture,
  });

  const text = new THREE.Mesh(textOneGeometry, material);
  const textTwo = new THREE.Mesh(textTwoGeometry, material);
  const button = new THREE.Mesh(buttonText, buttonTextMaterial);
  const smiley = new THREE.Mesh(smileyText, buttonTextMaterial);

  text.castShadow = true;
  textTwo.castShadow = true;

  text.receiveShadow = true;
  textTwo.receiveShadow = true;
  buttonText.receiveShadow = true;

  text.position.y = mobilesSize ? 2 : 1.5;
  text.position.z = 0.3;
  text.rotation.x = -0.1;

  textTwo.position.z = 0.4;
  textTwo.position.y = mobilesSize ? 0.5 : 0.2;
  textTwo.scale.x = 0.48;
  textTwo.scale.y = 0.48;
  textTwo.scale.z = 0.48;
  textTwo.rotation.x = -0.1;

  button.position.z = 1;
  button.rotation.x = -0.1;

  smiley.rotation.x = -0.1;
  smiley.position.z = 0.6;
  smiley.rotateY(Math.PI);
  // smiley.rotateZ(Math.PI / -2);

  scene.add(text, textTwo, button, smiley);

  const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    button.position.y = -1 + Math.sin(elapsedTime * 2) * -0.1;
    smiley.position.y = -1 + Math.sin(elapsedTime * 2) * -0.1;
    // Update controlss
    controls.update();
    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
  };

  tick();
});

const cubeGeometry = new RoundedBoxGeometry(
  mobilesSize ? 2.7 : 3.5,
  1,
  0.5,
  7,
  0.1
);
const cubeMaterial = new THREE.MeshMatcapMaterial({ matcap: buttonTexture });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

cube.position.z = 0.8;
cube.rotation.x = -0.1;
scene.add(cube);

// const material = new THREE.MeshStandardMaterial();
// material.roughness = 0.7;

// Sizes
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

// Base camera
const camera = new THREE.PerspectiveCamera(
  100,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0.2;
camera.position.z = 3.5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableZoom = false;

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
  const elapsedTime = clock.getElapsedTime();
  cube.position.y = -1 + Math.sin(elapsedTime * 2) * -0.1;

  // Update controls
  controls.update();
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.addEventListener("click", onMouseClick, false);
  window.addEventListener("touchend", onTouchEnd);

  window.requestAnimationFrame(tick);
};

tick();
