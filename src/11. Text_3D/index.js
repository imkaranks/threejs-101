import * as THREE from "three";
import GUI from "lil-gui";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { FontLoader } from "three/examples/jsm/Addons.js";
import { TextGeometry } from "three/examples/jsm/Addons.js";

const canvas = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const fps = 60;
const frameDuration = 1000 / fps;
const extrudeGeometryOptions = {
  heartColor: 0xffffff,
  depth: 8,
  bevelEnabled: true,
  bevelSegments: 2,
  steps: 2,
  bevelSize: 1,
  bevelThickness: 1,
};
const textGeometryParams = {
  size: 0.5,
  depth: 0.2,
  curveSegments: 7,
  bevelEnabled: true,
  bevelThickness: 0.1,
  bevelSize: 0.02,
  bevelOffset: 0,
  bevelSegments: 4,
};
let prevTimestamp = 0;
let ticker = 0;

const gui = new GUI();

const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();

const camera = new THREE.PerspectiveCamera(
  75,
  canvas.width / canvas.height,
  0.1,
  100
);
camera.position.set(0, 2, 5);
scene.add(camera);

const fontLoader = new FontLoader();
fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const textGeometry = new TextGeometry("Karan Sethi", {
    font,
    ...textGeometryParams,
  });
  textGeometry.computeBoundingBox();
  // textGeometry.translate(
  //   -(textGeometry.boundingBox.max.x - 0.02) * 0.5,
  //   -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
  //   -(textGeometry.boundingBox.max.z - 0.1) * 0.5
  // );
  textGeometry.center();
  const textMaterial = new THREE.MeshNormalMaterial();
  const text = new THREE.Mesh(textGeometry, textMaterial);
  scene.add(text);
  camera.lookAt(text.position);

  const textGUI = gui.addFolder("Text");

  for (const param in textGeometryParams) {
    textGUI.add(textGeometryParams, param).onChange((value) => {
      text.geometry.dispose();
      text.geometry = new TextGeometry("Karan Sethi", {
        font,
        ...textGeometryParams,
      });
      text.geometry.center();
    });
  }
});

const heartX = -25;
const heartY = -25;
const heartShape = new THREE.Shape();
heartShape.moveTo(25 + heartX, 25 + heartY);
heartShape.bezierCurveTo(
  25 + heartX,
  25 + heartY,
  20 + heartX,
  0 + heartY,
  0 + heartX,
  0 + heartY
);
heartShape.bezierCurveTo(
  -30 + heartX,
  0 + heartY,
  -30 + heartX,
  35 + heartY,
  -30 + heartX,
  35 + heartY
);
heartShape.bezierCurveTo(
  -30 + heartX,
  55 + heartY,
  -10 + heartX,
  77 + heartY,
  25 + heartX,
  95 + heartY
);
heartShape.bezierCurveTo(
  60 + heartX,
  77 + heartY,
  80 + heartX,
  55 + heartY,
  80 + heartX,
  35 + heartY
);
heartShape.bezierCurveTo(
  80 + heartX,
  35 + heartY,
  80 + heartX,
  0 + heartY,
  50 + heartX,
  0 + heartY
);
heartShape.bezierCurveTo(
  35 + heartX,
  0 + heartY,
  25 + heartX,
  25 + heartY,
  25 + heartX,
  25 + heartY
);

const materialHeart = new THREE.MeshBasicMaterial({
  color: extrudeGeometryOptions.heartColor,
});
const geometryHeart = new THREE.ExtrudeGeometry(
  heartShape,
  extrudeGeometryOptions
);

const heartGUI = gui.addFolder("Heart");

heartGUI.addColor(extrudeGeometryOptions, "heartColor").onChange((color) => {
  materialHeart.color.set(color);
});

// Heart Objects
const hearts = new Array(50).fill(0).map((_, i) => {
  const meshHeart = new THREE.Mesh(geometryHeart, materialHeart);

  meshHeart.scale.set(0.01, 0.01, 0.01);
  meshHeart.rotation.x = Math.PI;
  meshHeart.position.set(
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 20
  );

  gsap.to(meshHeart.scale, {
    x: 0.008,
    y: 0.008,
    z: 0.008,
    duration: 1,
    delay: (i % 2) * 0.5,
    repeat: -1,
  });

  scene.add(meshHeart);

  return meshHeart;
});

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
