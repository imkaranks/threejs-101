import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import gsap from "gsap";

const canvas = {
  width: innerWidth,
  height: innerHeight,
};
const fps = 60;
const frameDuration = 1000 / fps;
let ticker = 0;
let prevTimestamp = 0;

const scene = new THREE.Scene();

// Using The Loading Manager for optimising load speed
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => {
  console.log("loading started");
};
loadingManager.onProgress = () => {
  console.log("loading in progress...");
};
loadingManager.onError = () => {
  console.log("loading error");
};
loadingManager.onLoad = () => {
  console.log("loading done");
};
// Using The Loading Manager for optimising load speed

const boxGeometry = new THREE.BoxGeometry(2, 2, 2, 4, 4, 4);
const textureLoader = new THREE.TextureLoader(loadingManager);
const color = textureLoader.load("/textures/door/color.jpg");
color.colorSpace = THREE.SRGBColorSpace;
// color.repeat.x = 2;
// color.repeat.y = 2;
// color.wrapS = THREE.RepeatWrapping;
// color.wrapT = THREE.RepeatWrapping;
// color.wrapS = THREE.MirroredRepeatWrapping;
// color.wrapT = THREE.MirroredRepeatWrapping;
color.rotation = Math.PI / 4;
color.center.x = 0.5;
color.center.y = 0.5;

// color.minFilter = THREE.LinearMipMapLinearFilter; // default
// color.minFilter = THREE.NearestFilter;

const minecraft = textureLoader.load("/textures/minecraft.png");
minecraft.colorSpace = THREE.SRGBColorSpace;
minecraft.magFilter = THREE.NearestFilter;

const boxMaterial = new THREE.MeshBasicMaterial({
  // map: color,
  map: minecraft,
});
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

// console.log(boxGeometry.attributes.uv);

const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height);
camera.position.set(2, 2, 5);
scene.add(camera);

camera.lookAt(box.position);

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.enableDamping = true;

function init() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  renderer.setSize(canvas.width, canvas.height);
  camera.aspect = canvas.width / canvas.height;
  camera.updateProjectionMatrix();
}

const animate = (timestamp) => {
  const deltaTime = timestamp - prevTimestamp;
  prevTimestamp = timestamp;

  if (ticker > frameDuration) {
    box.rotation.y += 0.005;
    box.rotation.x += 0.005;
    box.rotation.z += 0.005;

    orbit.update();

    renderer.render(scene, camera);
    ticker = 0;
  } else {
    ticker += deltaTime;
  }

  requestAnimationFrame(animate);
};

addEventListener("load", () => {
  init();
  animate(0);
});
addEventListener("resize", () => {
  init();
});
