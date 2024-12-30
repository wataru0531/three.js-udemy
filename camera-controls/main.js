

import {
  Scene,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  PerspectiveCamera,
  AxesHelper,
  WebGLRenderer,
} from "./build/three.module.js";
import { OrbitControls } from './controls/OrbitControls.js';

//サイズ
const sizes = {
  // width: 800,
  // height: 600,
  width: window.innerWidth,
  height: window.innerHeight,
};

const scene = new Scene(); //シーン

const geometry = new BoxGeometry(1, 1, 1, 5, 5, 5);
const material = new MeshBasicMaterial({
  color: 0x00ffff,
  wireframe: false,
});

//オブジェクト
const mesh = new Mesh(geometry, material);
scene.add(mesh);

//カメラ
const camera = new PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  .1,
  1000
);

camera.position.z = 3;
scene.add(camera);

const axes = new AxesHelper(20);
scene.add(axes);

//レンダラー
const renderer = new WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// カメラ制御
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;


// EventListeners

window.addEventListener("DOMContentLoaded", init);

let cursorX = 0;
let cursorY = 0;

window.addEventListener('mousemove', ({clientX, clientY}) => {
  // 座標を変換 → 中央を(0, 0) に変更
  // cursorX = event.clientX / 800 - 0.5;
  // cursorY = event.clientY / 600 - 0.5;
  cursorX = clientX / sizes.width - 0.5;
  cursorY = clientY / sizes.height - 0.5;

  console.log(`x軸: ${cursorX}, y軸: ${cursorY}`);
});

let timerId = null;

window.addEventListener("resize", () => {
  clearTimeout(timerId);

  timerId = setTimeout(() => {
    // console.log("resize done!!");

    _onResize()
  }, 500);
})

// Functions

function init(){
  animate();
}

function _onResize(){
  sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

// シーンをフレームごとに更新
// → canvas(特にWebGLコンテキストを使う場合)の性質上、
// 動的なシーンのレンダリングはフレームごとに更新する必要がある。
// 静的なシーンであれば一度描画するだけで済むが、動きやインタラクションがある場合は常に再描画が必要
const animate = () => {
  // カメラの制御...ここではオブジェクトが動いているのではなくカメラが動いている。
  // カメラの制御が遅いのでスピードを*3する。 
  // camera.position.x = cursorX * 3;
  // camera.position.y = cursorY * 3;

  // camera.position.x = Math.sin(Math.PI * 2 * cursorX) * 3;
  // camera.position.z = Math.cos(Math.PI * 2 * cursorX) * 3;
  // camera.position.y = cursorY * 5;
  // camera.lookAt(mesh.position);

  // controlsのupdate()をする。オブジェクトに慣性がつく
  controls.update();

  //レンダリング
  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
};




/**************************************************************
元のコード
***************************************************************/
// import * as THREE from "./build/three.module.js";
// import { OrbitControls } from './controls/OrbitControls.js';


// let cursorX = 0;
// let cursorY = 0;

// window.addEventListener('mousemove', (event) => {
//   // 座標を変換 → 中央を(0, 0) に変更
//   cursorX = event.clientX / 800 - 0.5;
//   cursorY = event.clientY / 600 - 0.5;

//   console.log(cursorX, cursorY);
// });


// //サイズ
// const sizes = {
//   width: 800,
//   height: 600,
// };

// //シーン
// const scene = new THREE.Scene();

// const geometry = new THREE.BoxGeometry(1, 1, 1, 5, 5, 5);
// const material = new THREE.MeshBasicMaterial({
//   color: 0x00ffff,
//   wireframe: false,
// });

// //オブジェクト
// const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

// //カメラ
// const camera = new THREE.PerspectiveCamera(
//   75,
//   sizes.width / sizes.height
// );

// camera.position.z = 3;
// scene.add(camera);

// const axes = new THREE.AxesHelper(20);
// scene.add(axes);

// //レンダラー
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(sizes.width, sizes.height);
// document.body.appendChild(renderer.domElement);

// // カメラ制御
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;

// //アニメーション
// const animate = () => {
//   // カメラの制御...ここではオブジェクトが動いているのではなくカメラが動いている。
//   // カメラの制御が遅いのでスピードを*3する。 
//   // camera.position.x = cursorX * 3;
//   // camera.position.y = cursorY * 3;

//   // camera.position.x = Math.sin(Math.PI * 2 * cursorX) * 3;
//   // camera.position.z = Math.cos(Math.PI * 2 * cursorX) * 3;
//   // camera.position.y = cursorY * 5;
//   // camera.lookAt(mesh.position);

//   // controlsのupdate()をする。オブジェクトに慣性がつく
//   controls.update();

//   //レンダリング
//   renderer.render(scene, camera);
//   window.requestAnimationFrame(animate);
// };

// animate();
