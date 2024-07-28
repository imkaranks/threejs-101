import * as THREE from "three";
import gsap from "gsap";

const canvas = {
    width: window.innerWidth,
    height: window.innerHeight,
  },
  aspectRatio = canvas.width / canvas.height;

const scene = new THREE.Scene();

const group = new THREE.Group();

scene.add(group);

// const camera = new THREE.PerspectiveCamera(
//   75,
//   aspectRatio,
//   0.1,
//   100
// );
const camera = new THREE.OrthographicCamera(
  -1 * aspectRatio,
  1 * aspectRatio,
  1,
  -1,
  0.1,
  100
);
camera.position.set(0, 0, 5);

scene.add(camera);

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshBasicMaterial({ color: "red" });
const box = new THREE.Mesh(boxGeometry, boxMaterial);

box.position.set(0, -1, 1);

camera.lookAt(box.position);

scene.add(box);

box.rotation.y = 1;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(canvas.width, canvas.height);
document.body.appendChild(renderer.domElement);
renderer.render(scene, camera);

const clock = new THREE.Clock();

const animate = () => {
  const elapsedTime = clock.getElapsedTime();
  box.rotation.y = elapsedTime;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();
