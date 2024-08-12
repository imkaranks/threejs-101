import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

const canvas = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const fps = 60;
const frameDuration = 1000 / fps;
let prevTimestamp = 0;
let ticker = 0;
let animationTick = 0;

const gui = new GUI();

const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();

// Textures
const doorColorTexture = textureLoader.load(
  "/14. Haunted_House/textures/door/color.jpg"
);
const doorAlphaColorTexture = textureLoader.load(
  "/14. Haunted_House/textures/door/alpha.jpg"
);
const doorAmbientOcclusionTexture = textureLoader.load(
  "/14. Haunted_House/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load(
  "/14. Haunted_House/textures/door/height.jpg"
);
const doorNormalTexture = textureLoader.load(
  "/14. Haunted_House/textures/door/normal.jpg"
);
const doorMetalnessTexture = textureLoader.load(
  "/14. Haunted_House/textures/door/metalness.jpg"
);
const doorRoughnessTexture = textureLoader.load(
  "/14. Haunted_House/textures/door/roughness.jpg"
);

const brickAmbientOcclusionTexture = textureLoader.load(
  "/14. Haunted_House/textures/bricks/ambientOcclusion.jpg"
);
const brickColorTexture = textureLoader.load(
  "/14. Haunted_House/textures/bricks/color.jpg"
);
const brickNormalTexture = textureLoader.load(
  "/14. Haunted_House/textures/bricks/normal.jpg"
);
const brickRoughnessTexture = textureLoader.load(
  "/14. Haunted_House/textures/bricks/roughness.jpg"
);

const grassAmbientOcclusionTexture = textureLoader.load(
  "/14. Haunted_House/textures/grass/ambientOcclusion.jpg"
);
const grassColorTexture = textureLoader.load(
  "/14. Haunted_House/textures/grass/color.jpg"
);
const grassNormalTexture = textureLoader.load(
  "/14. Haunted_House/textures/grass/normal.jpg"
);
const grassRoughnessTexture = textureLoader.load(
  "/14. Haunted_House/textures/grass/roughness.jpg"
);

grassAmbientOcclusionTexture.repeat.set(8, 8);
grassColorTexture.repeat.set(8, 8);
grassNormalTexture.repeat.set(8, 8);
grassRoughnessTexture.repeat.set(8, 8);

grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
grassColorTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
grassColorTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

const house = new THREE.Group();
scene.add(house);

// Walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: brickColorTexture,
    aoMap: brickAmbientOcclusionTexture,
    normalMap: brickNormalTexture,
    roughnessMap: brickRoughnessTexture,
  })
);
walls.castShadow = true;
walls.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
);
walls.position.y = 2.5 / 2;
house.add(walls);

// Roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({ color: "#b35f45" })
);
roof.position.y = 2.5 + 0.5;
roof.rotation.y = Math.PI * 0.25;
house.add(roof);

// Door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaColorTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  })
);

door.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);
door.position.z = 2 + 0.01;
door.position.y = 1;
house.add(door);

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
  color: "#89c854",
});

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.castShadow = true;
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.castShadow = true;
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.2);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.castShadow = true;
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.2, 2.2);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.castShadow = true;
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);

const bush5 = new THREE.Mesh(bushGeometry, bushMaterial);
bush5.castShadow = true;
bush5.scale.set(0.9, 0.9, 0.9);
bush5.position.set(-1.6, 0, 1.8);

house.add(bush1, bush2, bush3, bush4, bush5);

// Graves
const graves = new THREE.Group();
scene.add(graves);

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({
  map: brickColorTexture,
  aoMap: brickAmbientOcclusionTexture,
  normalMap: brickNormalTexture,
  roughnessMap: brickRoughnessTexture,
});
graveGeometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(graveGeometry.attributes.uv.array, 2)
);

for (let i = 0; i < 100; i++) {
  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  graves.add(grave);
  grave.castShadow = true;

  const angle = Math.random() * Math.PI * 2;
  const radius = 3.5 + Math.random() * 6;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  grave.position.set(x, 0.3, z);

  grave.rotation.y = (Math.random() - 0.5) * 0.4;
  grave.rotation.z = (Math.random() - 0.5) * 0.4;
}

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({ color: "#a9c388" })
);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
floor.receiveShadow = true;
scene.add(floor);

// Ambient light
const ambientLight = new THREE.AmbientLight(0xb9d5ff, 0.0575);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight(0xb9d5ff, 0.0575);
moonLight.position.set(4, 5, -2);
moonLight.castShadow = true;
gui.add(moonLight, "intensity").min(0).max(1).step(0.001);
gui.add(moonLight.position, "x").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "y").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "z").min(-5).max(5).step(0.001);
scene.add(moonLight);

// Door light
const doorLight = new THREE.PointLight(0xff7d46, 5, 7);
doorLight.position.set(0, 2.5, 2.4);
doorLight.castShadow = true;
doorLight.shadow.mapSize.width = 256;
doorLight.shadow.mapSize.height = 256;
doorLight.shadow.camera.far = 7;
house.add(doorLight);

// Ghosts
const ghost1 = new THREE.PointLight("#ff00ff", 2, 3);
ghost1.castShadow = true;
ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 7;

const ghost2 = new THREE.PointLight("#ffff00", 2, 3);
ghost2.castShadow = true;
ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 7;

const ghost3 = new THREE.PointLight("#0000ff", 2, 3);
ghost3.castShadow = true;
ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 7;

scene.add(ghost1, ghost2, ghost3);

const camera = new THREE.PerspectiveCamera(
  75,
  canvas.width / canvas.height,
  0.1,
  100
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 10;
scene.add(camera);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(canvas.width, canvas.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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
    ghost1.position.x = Math.sin(animationTick * 0.5) * 4;
    ghost1.position.z = Math.cos(animationTick * 0.5) * 4;
    ghost1.position.y = Math.sin(animationTick * 3);

    ghost2.position.x = Math.sin(-animationTick * 0.3) * 6;
    ghost2.position.z = Math.cos(-animationTick * 0.3) * 6;
    ghost2.position.y =
      Math.sin(animationTick * 4) + Math.sin(animationTick * 2.5);

    ghost3.position.x =
      Math.sin(animationTick * 0.18) * (7 + Math.sin(animationTick * 0.32));
    ghost3.position.z =
      Math.cos(animationTick * 0.18) * (7 + Math.cos(animationTick * 0.32));
    ghost3.position.y = Math.tan(animationTick * 3);

    animationTick += 0.05;

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
