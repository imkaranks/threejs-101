import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import GUI from "lil-gui";
import gsap from "gsap";

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

const gui = new GUI({ width: 300, title: "DebugUI", closeFolders: true });
// gui.close();
// gui.hide();
const group1 = gui.addFolder("Group 1");
const group2 = gui.addFolder("Group 2");

const sphereOptions = {
  radius: 2,
  segments: 10,
  colorChange: false,
  color: 0xff0000,
};

const sphereGeometry = new THREE.SphereGeometry(
  sphereOptions.radius,
  sphereOptions.segments,
  sphereOptions.segments
);
const sphereMaterial = new THREE.MeshBasicMaterial({
  color: sphereOptions.color,
  wireframe: true,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

const updateMeshGeometry = (mesh, geometry) => {
  mesh.geometry.dispose();
  mesh.geometry = geometry;
};

// gui.add(sphereOptions, "radius", 1, 6).onChange((value) => {
group1.add(sphereOptions, "radius", 1, 6).onChange((value) => {
  updateMeshGeometry(
    sphere,
    new THREE.SphereGeometry(
      value,
      sphereOptions.segments,
      sphereOptions.segments
    )
  );
});
// gui.add(sphereOptions, "segments", 10, 100).onChange((value) => {
group1.add(sphereOptions, "segments", 10, 100).onChange((value) => {
  updateMeshGeometry(
    sphere,
    new THREE.SphereGeometry(sphereOptions.radius, value, value)
  );
});
// gui.add(sphereOptions, "colorChange");
group2.add(sphereOptions, "colorChange");
// gui.addColor(sphereOptions, "color").onChange((value) => {
group2.addColor(sphereOptions, "color").onChange((value) => {
  sphere.material.color = new THREE.Color(value);
});

sphereOptions.spin = () => {
  gsap.to(sphere.rotation, {
    y: sphere.rotation.y + Math.PI * 2,
  });
};

// gui.add(sphereOptions, "spin");
group2.add(sphereOptions, "spin");

const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height);
camera.position.set(2, 2, 5);
scene.add(camera);

camera.lookAt(sphere.position);

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
    sphere.rotation.y += 0.005;
    sphere.rotation.x += 0.005;
    sphere.rotation.z += 0.005;

    if (sphereOptions.colorChange) {
      sphere.material.color = new THREE.Color(`hsl(${hue++}, 100%, 50%)`);
    }

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
addEventListener("keydown", (e) => {
  if (e.key === "h") {
    gui.show(gui._hidden);
  }
});
