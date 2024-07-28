import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const canvas = {
  width: innerWidth,
  height: innerHeight,
};
const fps = 60;
const frameDuration = 1000 / fps;
let ticker = 0;
let prevTimestamp = 0;
let hue = 0;

const scene = new THREE.Scene();

// const geometry = new THREE.BufferGeometry();
// const array = new Float32Array([1, 0, 1, 0, 0, 2, 2, 0, 2]);
// const positionAttribute = new THREE.BufferAttribute(array, 3);
// geometry.setAttribute("position", positionAttribute);

const count = 10;

const geometry = new THREE.BoxGeometry();
const array = new Float32Array(count * 9);
for (let i = 0; i < count * 9; i++) {
  array[i] = (Math.random() - 0.5) * 4;
}
const positionAttribute = new THREE.BufferAttribute(array, 3);
geometry.setAttribute("position", positionAttribute);

const material = new THREE.MeshBasicMaterial({ color: "red", wireframe: true });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height);
camera.position.set(2, 2, 5);
scene.add(camera);

camera.lookAt(mesh.position);

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
  renderer.render(scene, camera);
}

const animate = (timestamp) => {
  const deltaTime = timestamp - prevTimestamp;
  prevTimestamp = timestamp;

  if (ticker > frameDuration) {
    mesh.rotation.y += 0.005;
    mesh.rotation.x += 0.005;
    mesh.rotation.z += 0.005;
    mesh.material.color = new THREE.Color(`hsl(${(hue += 0.5)}, 100%, 50%)`);

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
