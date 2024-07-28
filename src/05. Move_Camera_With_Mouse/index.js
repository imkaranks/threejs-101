import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import gsap from "gsap";

const canvas = {
    width: window.innerWidth,
    height: window.innerHeight,
  },
  cursor = { x: 0, y: 0 },
  stagger = 0.1,
  boxCount = 15,
  boxSpaceBetween = 0.125,
  boxSize = 0.75,
  waveMovementSpeed = 0.05,
  speed = 0.001,
  clock = new THREE.Clock(),
  sensitivity = 2,
  targetCameraPosition = { x: 0, y: 0, z: 0 },
  interpolationFactor = 0.1; // Controls the smoothness
let didHold = false;

const scene = new THREE.Scene();

const group = new THREE.Group();

scene.add(group);

const camera = new THREE.PerspectiveCamera(
  75,
  canvas.width / canvas.height,
  0.1,
  100
);
camera.position.set(0, 0, 5);

scene.add(camera);

const boxes = new Array(boxCount).fill(0).map((_, idx) => {
  const [x, y, z, hue] = [
    (boxSize + boxSpaceBetween) * idx,
    Math.cos(idx * 0.25),
    0,
    idx * 5,
  ];
  const boxGeometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize, 3, 3, 3);
  const boxMaterial = new THREE.MeshBasicMaterial({
    color: `hsl(${hue}, 100%, 50%)`,
  });
  const box = new THREE.Mesh(boxGeometry, boxMaterial);
  box.position.set(
    x - ((boxSize + boxSpaceBetween) * (boxCount - 1)) / 2,
    y,
    z
  );
  scene.add(box);
  group.add(box);
  return { object: box, x, y, z, delay: idx * stagger, hue };
});

boxes.forEach((box, idx) => {
  gsap.to(box.object.scale, {
    y: 3,
    delay: idx * 0.5,
    repeat: -1,
    duration: 1,
    yoyoEase: true,
  });
});

camera.lookAt(group.position);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(canvas.width, canvas.height);
document.body.appendChild(renderer.domElement);
renderer.render(scene, camera);

/* #### Built-in controls #### */
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.enableDamping = true;

const animate = () => {
  const elapsedTime = clock.getElapsedTime();

  boxes.forEach((box) => {
    const y = Math.cos((box.y += waveMovementSpeed));
    const hue = (box.hue += 0.075);
    box.object.position.y = y;
    box.object.material.color = new THREE.Color(`hsl(${hue}, 100%, 50%)`);
  });

  orbit.update();

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();

/* #### Manual way #### */
// window.addEventListener("mousedown", () => (didHold = true));
// window.addEventListener("mouseup", () => (didHold = false));

// window.addEventListener("mousemove", (event) => {
//   if (!didHold) return;

//   const { clientX, clientY } = event;

//   cursor.x = clientX / canvas.width - 0.5;
//   cursor.y = clientY / canvas.height - 0.5;

//   targetCameraPosition.x = Math.sin(cursor.x * Math.PI * 2) * 4;
//   targetCameraPosition.y = -(cursor.y * sensitivity);
//   targetCameraPosition.z = Math.cos(cursor.x * Math.PI * 2) * 4;

//   // Smoothly interpolate camera position
//   camera.position.x +=
//     (targetCameraPosition.x - camera.position.x) * interpolationFactor;
//   camera.position.y +=
//     (targetCameraPosition.y - camera.position.y) * interpolationFactor;
//   camera.position.z +=
//     (targetCameraPosition.z - camera.position.z) * interpolationFactor;

//   camera.lookAt(group.position);
// });
