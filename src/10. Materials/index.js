import * as THREE from "three";
import GUI from "lil-gui";
import { RGBELoader } from "three/examples/jsm/Addons.js";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const canvas = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const fps = 60;
const frameDuration = 1000 / fps;
const materialOptions = {
  useDisplacement: false,
  displacementScale: 0.15,
  useNormal: true,
  normalScaleX: 1,
  normalScaleY: 1,
};
let ticker = 0;
let prevTimestamp = 0;

const scene = new THREE.Scene();

const gui = new GUI();

const camera = new THREE.PerspectiveCamera(
  75,
  canvas.width / canvas.height,
  0.1,
  100
);
camera.position.z = 5;
scene.add(camera);

const textureLoader = new THREE.TextureLoader();
const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
doorColorTexture.colorSpace = THREE.SRGBColorSpace;
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
doorAmbientOcclusionTexture.encoding = THREE.LinearEncoding; // Linear for AO maps
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
doorAlphaTexture.encoding = THREE.LinearEncoding; // Optional, depending on your texture setup
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
doorHeightTexture.encoding = THREE.LinearEncoding; // Linear for height maps
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
doorNormalTexture.encoding = THREE.LinearEncoding; // Linear for normal maps;
const doorRoughnessTexture = new THREE.TextureLoader().load(
  "/textures/door/roughness.jpg"
);
doorRoughnessTexture.encoding = THREE.LinearEncoding; // Linear for roughness maps
const doorMetalnessTexture = new THREE.TextureLoader().load(
  "/textures/door/metalness.jpg"
);
doorMetalnessTexture.encoding = THREE.LinearEncoding;
const matcapTexture = textureLoader.load("/textures/matcaps/1.png");
matcapTexture.colorSpace = THREE.SRGBColorSpace;
const gradientTexture = textureLoader.load("/textures/gradients/3.png");
gradientTexture.magFilter = THREE.NearestFilter;
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.generateMipmaps = true;

const rgbeLoader = new RGBELoader();
rgbeLoader.load("/textures/environmentMap/2k.hdr", (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = environmentMap;
  scene.environment = environmentMap;
});

// const material = new THREE.MeshBasicMaterial({
//   map: doorColorTexture,
//   alphaMap: doorColorTexture,
// });
// // material.color = new THREE.Color("#fff");
// material.transparent = true;
// // material.alphaMap = doorColorTexture;
// material.side = THREE.DoubleSide; // for minimal use only as it can affect performance
// // material.opacity = 0.5;

// const material = new THREE.MeshNormalMaterial({
//   // wireframe: true,
//   flatShading: true,
// });

// const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
// material.side = THREE.DoubleSide;

// const material = new THREE.MeshDepthMaterial();

// const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// scene.add(ambientLight);
// const pointLight = new THREE.PointLight(0xffffff, 30);
// pointLight.position.set(3, 4, 3);
// scene.add(pointLight);

// const material = new THREE.MeshLambertMaterial();

// const material = new THREE.MeshToonMaterial({ gradientMap: gradientTexture });

const material = new THREE.MeshStandardMaterial({
  // Color texture map, defines the base color of the material
  map: doorColorTexture,

  // Ambient Occlusion (AO) map, adds shading to the material to simulate how light interacts with crevices and details
  aoMap: doorAmbientOcclusionTexture, // Enhances dark areas to appear more shaded

  // Alpha map, used for controlling the transparency of different parts of the material
  alphaMap: doorAlphaTexture,

  // Displacement map (commented out), could be used to add surface details by altering the geometry based on the map
  // displacementMap: doorHeightTexture,
  // displacementScale: 0.1, // Amount by which the displacement map affects the geometry

  // Normal map, provides detailed surface texture by altering the way light interacts with the surface
  normalMap: doorNormalTexture,

  // Roughness map, defines the roughness of different parts of the surface
  roughnessMap: doorRoughnessTexture,

  // Metalness map, defines the metallic properties of different parts of the surface
  metalnessMap: doorMetalnessTexture,

  // Set to true to allow the material to be transparent, useful when using alpha maps
  transparent: true,

  // Controls how metallic the material appears. 0 means non-metallic, 1 means fully metallic.
  metalness: 0.5,

  // Controls the surface roughness. 0 means a smooth, shiny surface, and 1 means a rough, matte surface.
  roughness: 0,

  // Ensures that the material is visible from both sides of the geometry
  side: THREE.DoubleSide,
});

const materialGui = gui.addFolder("Material");
materialGui
  .add(material, "metalness")
  .min(0)
  .max(1)
  .onChange((value) => {
    material.metalness = value;
  });
materialGui
  .add(material, "roughness")
  .min(0)
  .max(1)
  .onChange((value) => {
    material.roughness = value;
  });

const updateMaterial = () => {
  if (materialOptions.useDisplacement) {
    material.displacementMap = doorHeightTexture;
    material.displacementScale = materialOptions.displacementScale;
  } else {
    material.displacementMap = null;
    material.displacementScale = 0;
  }

  if (materialOptions.useNormal) {
    material.normalMap = doorNormalTexture;
  } else {
    material.normalMap = null;
  }

  material.needsUpdate = true;
};

materialGui
  .add(materialOptions, "useDisplacement")
  .name("Displacement Map")
  .onChange(updateMaterial);
materialGui
  .add(materialOptions, "useNormal")
  .name("Normal Map")
  .onChange(updateMaterial);
materialGui
  .add(materialOptions, "displacementScale")
  .name("Displacement Scale")
  .min(0.1)
  .max(1)
  .onChange((value) => {
    material.displacementScale = value;
  });

const updateNormalScale = () => {
  material.normalScale.set(
    materialOptions.normalScaleX,
    materialOptions.normalScaleY
  );
  material.needsUpdate = true;
};

materialGui
  .add(materialOptions, "normalScaleX")
  .min(0)
  .max(5)
  .name("Normal Scale X")
  .onChange(updateNormalScale);
materialGui
  .add(materialOptions, "normalScaleY")
  .min(0)
  .max(5)
  .name("Normal Scale Y")
  .onChange(updateNormalScale);

const size = 1.5;
const spaceBetween = 1;

const torusGeometry = new THREE.TorusGeometry(size / 3, size * 0.25, 64, 128);
const torus = new THREE.Mesh(torusGeometry, material);

const sphereGeometry = new THREE.SphereGeometry(size / 2, 64, 64);
const sphere = new THREE.Mesh(sphereGeometry, material);

const planeGeometry = new THREE.PlaneGeometry(size, size, 100, 100);
const plane = new THREE.Mesh(planeGeometry, material);

sphere.position.set(-(size + spaceBetween), 0, 0);
torus.position.set(size + spaceBetween, 0, 0);

scene.add(plane, torus, sphere);

camera.lookAt(plane.position);

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

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
    [plane, torus, sphere].forEach((mesh) => {
      mesh.rotation.x += 0.025;
      mesh.rotation.y += 0.025;
      mesh.rotation.z += 0.025;
    });

    orbit.update();
    renderer.render(scene, camera);

    ticker = 0;
  } else {
    ticker += deltaTime;
  }

  requestAnimationFrame(animate);
};

window.addEventListener("load", () => {
  init();
  animate(0);
});

window.addEventListener("resize", () => {
  init();
});
