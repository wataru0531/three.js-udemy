
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  CubeTextureLoader,
  WebGLCubeRenderTarget,
  CubeCamera,
  SphereGeometry,
  MeshBasicMaterial,
  Mesh,
} from "./build/three.module.js";
// import { Camera } from "three";
import { Camera } from "./build/three.module.js";
import { OrbitControls } from './controls/OrbitControls.js';

const scene = new Scene();

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

const camera = new PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  3000,
);
camera.position.set(0, 500, 1000);

scene.add(camera);

const canvas = document.getElementById('js-canvas');

const renderer = new WebGLRenderer({
  canvas: canvas,
  antialias: true, // ギザギザがなくなる
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);


// envimageの配列など
const urls = [
  './envImage/right.png',
  './envImage/left.png',
  './envImage/up.png',
  './envImage/down.png',
  './envImage/front.png',
  './envImage/back.png',
];

// 画像をロードする。
const loader = new CubeTextureLoader();
scene.background = loader.load(urls);

// OrbitControls...カメラを動かすために使う
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;


// キューブカメラ...6台のカメラを作成。立方体の中に６台のカメラを置くイメージ*****************/
// ターゲットを決める。解像度は100に設定。高すぎるとパソコンが固まる
const cubeRenderTarget = new WebGLCubeRenderTarget(100);

// キューブカメラ...(カメラからの近い位置, 映せる距離, ターゲット)
const cubeCamera = new CubeCamera(
  1,
  1000,
  cubeRenderTarget,
);
scene.add(cubeCamera);

// オブジェクト
const sphereGeometry = new SphereGeometry(350, 50, 50);

// マテリアル
const material = new MeshBasicMaterial({
  // 
  envMap: cubeRenderTarget.texture,
  // reflectivity: 0.5, // 反射率
});

// メッシュ
const sphere = new Mesh(sphereGeometry, material);
scene.add(sphere);


// EventListeners
window.addEventListener("DOMContentLoaded", init);

// ブラウザのリサイズ操作
let timerId = null;
window.addEventListener('resize', () => {
  clearTimeout(timerId);

  timerId = setTimeout(() => {
    // OrbitControlsの更新。必ず呼ぶ
    controls.update();

    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix(); // カメラに変更を加えたら必ず呼ぶ。

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(window.devicePixelRatio);
  }, 500);
});

// Functions
function init(){
  animate();
}

// アニメーション
function animate(){
  renderer.render(scene, camera);

  // キューブカメラも必ずアップデートする
  cubeCamera.update(renderer, scene);

  controls.update();

  // フレーム更新ごとに何度も呼びだす。
  requestAnimationFrame(animate);
};


/**************************************************************
元のコード
***************************************************************/
// import {
//   Scene,
//   PerspectiveCamera,
//   WebGLRenderer,
//   CubeTextureLoader,
//   WebGLCubeRenderTarget,
//   CubeCamera,
//   SphereGeometry,
//   MeshBasicMaterial,
//   Mesh,
// } from "./build/three.module.js";
// // import { Camera } from "three";
// import { Camera } from "./build/three.module.js";
// import { OrbitControls } from './controls/OrbitControls.js';

// const scene = new Scene();

// const sizes = {
//   width: window.innerWidth,
//   height: window.innerHeight
// };

// const camera = new PerspectiveCamera(
//   75,
//   sizes.width / sizes.height,
//   0.1,
//   3000,
// );
// camera.position.set(0, 500, 1000);

// scene.add(camera);

// const canvas = document.getElementById('js-canvas');

// const renderer = new WebGLRenderer({
//   canvas: canvas,
//   antialias: true, // ギザギザがなくなる
// });

// renderer.setSize(sizes.width, sizes.height);
// renderer.setPixelRatio(window.devicePixelRatio);


// // envimageの配列など
// const urls = [
//   './envImage/right.png',
//   './envImage/left.png',
//   './envImage/up.png',
//   './envImage/down.png',
//   './envImage/front.png',
//   './envImage/back.png',
// ];

// // 画像をロードする。
// const loader = new CubeTextureLoader();
// scene.background = loader.load(urls);


// // OrbitControls...カメラを動かすために使う
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;


// // キューブカメラ...6台のカメラを作成。立方体の中に６台のカメラを置くイメージ*****************/
//  // ターゲットを決める。解像度は100に設定。高すぎるとパソコンが固まる
// const cubeRenderTarget = new WebGLCubeRenderTarget(100);

// // キューブカメラ...(カメラからの近い位置, 映せる距離, ターゲット)
// const cubeCamera = new CubeCamera(
//   1,
//   1000,
//   cubeRenderTarget,
// );
// scene.add(cubeCamera);


// // オブジェクト
// // ジオメトリ
// const sphereGeometry = new SphereGeometry(350, 50, 50);

// // マテリアル
// const material = new MeshBasicMaterial({
//   // 
//   envMap: cubeRenderTarget.texture,
//   // reflectivity: 0.5, // 反射率
// });

// // メッシュ化
// const sphere = new Mesh(sphereGeometry, material);
// scene.add(sphere);


// // アニメーション
// function animate(){
//   renderer.render(scene, camera);

//   // キューブカメラも必ずアップデートする
//   cubeCamera.update(renderer, scene);

//   // フレーム更新ごとに何度も呼びだす。
//   requestAnimationFrame(animate);
// };
// animate();


// // ブラウザのリサイズ操作
// window.addEventListener('resize', () => {
//   // OrbitControlsの更新。必ず呼ぶ
//   controls.update();

//   sizes.width = window.innerWidth;
//   sizes.height = window.innerHeight;

//   camera.aspect = sizes.width / sizes.height;
//   camera.updateProjectionMatrix(); // カメラに変更を加えたら必ず呼ぶ。

//   renderer.setSize(sizes.width, sizes.height);
//   renderer.setPixelRatio(window.devicePixelRatio);
// });

