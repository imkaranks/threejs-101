import * as THREE from "three";

const canvas = {
  width: innerWidth,
  height: innerHeight,
};
const fps = 60;
const frameDuration = 1000 / fps;
let ticker = 0;
let prevTimestamp = 0;

const scene = new THREE.Scene();

const boxGeometry = new THREE.BoxGeometry(1, 1, 1, 5, 5, 5);
const boxMaterial = new THREE.MeshBasicMaterial({ color: "red" });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height);
camera.position.set(2, 2, 2);
scene.add(camera);
camera.lookAt(box.position);

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

function init() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  renderer.setSize(canvas.width, canvas.height);
  camera.aspect = canvas.width / canvas.height;
  camera.updateProjectionMatrix();
}

function toggleFullscreen() {
  const fullscreenElement =
    document.fullscreenElement || document.webkitFullscreenElement;

  if (!fullscreenElement) {
    const documentElement = document.documentElement;
    if (documentElement.requestFullscreen) {
      documentElement.requestFullscreen();
    } else if (documentElement.webkitRequestFullscreen) {
      documentElement.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.exitFullscreen();
    }
  }
}

const animate = (timestamp) => {
  const deltaTime = timestamp - prevTimestamp;
  prevTimestamp = timestamp;

  if (ticker > frameDuration) {
    box.rotation.y += 0.05;
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
addEventListener("dblclick", toggleFullscreen);
