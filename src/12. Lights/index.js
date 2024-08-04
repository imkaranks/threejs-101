import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const canvas = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const fps = 60;
const frameDuration = 1000 / fps;
let prevTimestamp = 0;
let ticker = 0;

const scene = new THREE.Scene();

const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x00fffc, 1.5);
directionalLight.position.set(1, 0.25, 0);
scene.add(directionalLight);

// const directionalLightHelper = new THREE.DirectionalLightHelper(
//   directionalLight,
//   0.2
// );
// scene.add(directionalLightHelper);

const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 1);
scene.add(hemisphereLight);

// const hemisphereLightHelper = new THREE.HemisphereLightHelper(
//   hemisphereLight,
//   0.2
// );
// scene.add(hemisphereLightHelper);

const pointLight = new THREE.PointLight(0xff9000, 1, 10, 2);
pointLight.position.set(1, -0.5, 1);
scene.add(pointLight);

// const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
// scene.add(pointLightHelper);

const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 6, 1, 1);
rectAreaLight.position.set(-1.5, 0, 1.5);
rectAreaLight.lookAt(new THREE.Vector3());
scene.add(rectAreaLight);

const spotLight = new THREE.SpotLight(
  0x78ff00,
  4.5,
  10,
  Math.PI * 0.1,
  0.25,
  1
);
spotLight.position.set(0, 2, 3);
spotLight.target.position.x = -0.75;
scene.add(spotLight);

// const spotLightHelper = new THREE.SpotLightHelper(spotLight, 0x00ff00);
// scene.add(spotLightHelper);

const camera = new THREE.PerspectiveCamera(
  75,
  canvas.width / canvas.height,
  0.1,
  100
);
camera.position.set(1, 1, 5);
scene.add(camera);

const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);
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

const animate = (timestamp) => {
  const deltaTime = timestamp - prevTimestamp;
  prevTimestamp = timestamp;

  if (ticker > frameDuration) {
    sphere.rotation.y += 0.01;
    cube.rotation.y += 0.01;
    torus.rotation.y += 0.01;

    sphere.rotation.x += 0.015;
    cube.rotation.x += 0.015;
    torus.rotation.x += 0.015;

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
