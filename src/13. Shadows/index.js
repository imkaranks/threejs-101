import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

const canvas = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const fps = 60;
const frameDuration = 1000 / fps;
let prevTimestamp = 0;
let ticker = 0;

const gui = new GUI();

const scene = new THREE.Scene();

// Baking shadow
const textureLoader = new THREE.TextureLoader();
// const texture = textureLoader.load("/textures/bakedShadow.jpg");
const texture = textureLoader.load("/textures/simpleShadow.jpg");
texture.colorSpace = THREE.SRGBColorSpace;

// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
gui.add(ambientLight, "intensity").min(0).max(3).step(0.001);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.3);
directionalLight.position.set(2, 2, -1);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.far = 6;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.left = -2;
directionalLight.shadow.radius = 10;
gui.add(directionalLight, "intensity").min(0).max(3).step(0.001);
gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "y").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "z").min(-5).max(5).step(0.001);
scene.add(directionalLight);

const directionalLightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);
directionalLightCameraHelper.visible = false;
scene.add(directionalLightCameraHelper);

// Spot light
const spotLight = new THREE.SpotLight(0xffffff, 14, 10, Math.PI * 0.3);
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 6;
spotLight.position.set(0, 2, 2);
scene.add(spotLight, spotLight.target);

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
spotLightCameraHelper.visible = false;
scene.add(spotLightCameraHelper);

// Point light
const pointLight = new THREE.PointLight(0xffffff, 2.7);
pointLight.position.set(-1, 1, 0);
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 5;
scene.add(pointLight);
// console.log(pointLight.shadow.camera)

const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
pointLightCameraHelper.visible = false;
scene.add(pointLightCameraHelper);

const material = new THREE.MeshStandardMaterial();
material.roughness = 0.7;
gui.add(material, "metalness").min(0).max(1).step(0.001);
gui.add(material, "roughness").min(0).max(1).step(0.001);

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.castShadow = true;

const shadowMap = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1),
  // new THREE.MeshBasicMaterial({ map: texture })
  new THREE.MeshBasicMaterial({
    color: 0x000000,
    alphaMap: texture,
    transparent: true,
  })
);
shadowMap.rotation.x = -Math.PI / 2;
shadowMap.position.y = 0;
scene.add(shadowMap);

// const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5),
  new THREE.MeshStandardMaterial({ map: texture })
);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;
plane.receiveShadow = true;

shadowMap.position.y = plane.position.y + 0.01;

scene.add(sphere, plane);

const camera = new THREE.PerspectiveCamera(
  75,
  canvas.width / canvas.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);
// renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.render(scene, camera);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.enableDamping = true;

const init = () => {
  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
};

let tick = 0;
const animate = (timestamp) => {
  const deltaTime = timestamp - prevTimestamp;
  prevTimestamp = timestamp;

  if (ticker > frameDuration) {
    sphere.position.x = Math.cos(tick) * 1.5;
    sphere.position.y = Math.abs(Math.sin(tick * 2) * 1.5);
    sphere.position.z = Math.sin(tick) * 1.5;

    shadowMap.position.x = sphere.position.x;
    shadowMap.position.z = sphere.position.z;
    shadowMap.material.opacity = (1 - sphere.position.y) * 0.6;

    tick += deltaTime * 0.005;
    orbit.update();
    renderer.render(scene, camera);
    ticker = 0;
  } else {
    ticker += deltaTime;
  }

  requestAnimationFrame(animate);
};

window.addEventListener("resize", () => {
  init();
});

window.addEventListener("load", () => {
  init();
  animate(0);
});
