import * as THREE from "three";
import gsap from "gsap";

const canvas = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  canvas.width / canvas.height,
  0.1,
  100
);
camera.position.z = 6;
// camera.position.y = 2;

scene.add(camera);

const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
const boxMaterial = new THREE.MeshBasicMaterial({ color: "red" });
const box = new THREE.Mesh(boxGeometry, boxMaterial);

scene.add(box);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(canvas.width, canvas.height);
document.body.appendChild(renderer.domElement);
renderer.render(scene, camera);
