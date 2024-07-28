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
camera.position.set(0, 0, 5);

scene.add(camera);

const stagger = 0.1,
  boxCount = 15,
  boxSpaceBetween = 0,
  boxSize = 0.75,
  waveYSpeed = 0.05;

const boxes = new Array(boxCount).fill(0).map((_, idx) => {
  // const [x, y, z] = [(boxSize + boxSpaceBetween) * idx, 0, 0];
  const [x, y, z, hue] = [
    (boxSize + boxSpaceBetween) * idx,
    Math.cos(idx * waveYSpeed),
    0,
    idx,
  ];
  const boxGeometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize, 3, 3, 3);
  const boxMaterial = new THREE.MeshBasicMaterial({
    color: `hsl(${hue}, 100%, 50%)`,
    // wireframe: true,
  });
  const box = new THREE.Mesh(boxGeometry, boxMaterial);
  box.position.set(x, y, z);
  scene.add(box);
  group.add(box);
  return { object: box, x, y, z, delay: idx * stagger, hue };
});

group.position.x = -(
  boxCount * (boxSize + boxSpaceBetween) * 0.5 -
  boxSpaceBetween
);

// camera.lookAt(group.position);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(canvas.width, canvas.height);
document.body.appendChild(renderer.domElement);
renderer.render(scene, camera);

const speed = 0.001;
let time = Date.now();

// #### Using Clock ####
const clock = new THREE.Clock();

// gsap.to(group.rotation, {
//   y: Math.PI * 2,
//   // duration: 1,
// });

boxes.forEach((box, idx) => {
  gsap.to(box.object.scale, {
    y: 3,
    delay: idx * 0.05,
    repeat: -1,
    duration: 1,
    yoyoEase: true,
  });
});

const animate = () => {
  // #### Using frame rate diff ####
  // const currentTime = Date.now();
  // const deltaTime = currentTime - time;
  // time = currentTime;

  // #### Using Clock ####
  const elapsedTime = clock.getElapsedTime();

  boxes.forEach((box) => {
    // if (elapsedTime > box.delay) {
    const y = Math.cos((box.y += waveYSpeed));
    const hue = (box.hue += 0.075);
    box.object.position.y = y;
    box.object.material.color = new THREE.Color(`hsl(${hue}, 100%, 50%)`);
    // }
  });

  // group.rotation.y += speed * deltaTime;
  // group.rotation.y = elapsedTime;
  // group.rotation.x = elapsedTime;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();
