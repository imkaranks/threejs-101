import * as THREE from "three";
import gsap from "gsap";

const canvas = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const scene = new THREE.Scene();

const group = new THREE.Group();

scene.add(group);

const camera = new THREE.PerspectiveCamera(
  75,
  canvas.width / canvas.height,
  0.1,
  100
);
camera.position.set(1, 1, 5);

scene.add(camera);

const boxGeometry1 = new THREE.BoxGeometry(0.75, 0.75, 0.75);
const boxMaterial1 = new THREE.MeshBasicMaterial({ color: "red" });
const box1 = new THREE.Mesh(boxGeometry1, boxMaterial1);

const boxGeometry2 = new THREE.BoxGeometry(0.75, 0.75, 0.75);
const boxMaterial2 = new THREE.MeshBasicMaterial({ color: "blue" });
const box2 = new THREE.Mesh(boxGeometry2, boxMaterial2);

// console.log(box.position.length()); // distance from center
// console.log(box.position.distanceTo(camera.position)); // distance between two objects
// box.position.normalize();
// box.scale.set(0.5, 0.5, 0.5);
// box.rotation.y = 2.5;
// box.rotation.reorder("ZYX");
// box.rotation.y = Math.PI * 2;
// camera.lookAt(box.position);

box1.position.set(0, 1, 1);
box2.position.set(1.5, 1, 1);

scene.add(box1, box2);

group.add(box1, box2);

group.rotation.y = 1;

// const axesHelper = new THREE.AxesHelper();

// scene.add(axesHelper);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(canvas.width, canvas.height);
document.body.appendChild(renderer.domElement);
renderer.render(scene, camera);
