// lil-guiをインポート
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.17/+esm';

import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  AmbientLight,
  Clock

} from "./build/three.module.js";
import { OrbitControls } from "./controls/OrbitControls.js";

//シーン
const scene = new Scene();

//カメラ
const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(1, 1, 2);

//レンダラー
const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

//ジオメトリを作ってみよう。
const boxGeometry = new BoxGeometry(1, 1, 1);

//マテリアル
const material = new MeshBasicMaterial({ // 光源の影響を受けないマテリアル
  color: "red",
  wireframe: true,
});

//メッシュ
const box = new Mesh(boxGeometry, material);
scene.add(box);


/**************************************************************
UIデバッグ
***************************************************************/
const gui = new GUI();
// console.log(gui);

// UIデバッグを行う   下記のように登録を行うことでブラウザに変更の項目が現れる。
// ①位置情報を収めるフォルダ
const positionFolder = gui.addFolder("Position");

// -3から3の距離で0.01づつ位置を変更することができる。
// gui.add(box.position, "x", -3, 3, 0.01);
positionFolder.add(box.position, "x").min(-3).max(3).step(0.01).name("transformX");
positionFolder.add(box.position, "y").min(-3).max(3).step(0.01).name("transformY");
positionFolder.add(box.position, "z").min(-3).max(3).step(0.01).name("transformZ");

positionFolder.add(box.rotation, "x").min(-3).max(3).step(0.01).name("rotationX");
positionFolder.add(box.rotation, "y").min(-3).max(3).step(0.01).name("rotationY");

// ②on_offを切り替えるフォルダ
const visibleFolder = gui.addFolder("Visible");
//　ジオメトリをon/off
visibleFolder.add(box, "visible");
// ワイヤーフレームをon/off
visibleFolder.add(material, "wireframe");


// 色を変更するフォルダ
const colorFolder = gui.addFolder('Color')
// 色を変更する
colorFolder.addColor(material, "color");


//ライト
const ambientLight = new AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

//マウス操作
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// EventListener
window.addEventListener("DOMContentLoaded", init);

let timerId = null;

window.addEventListener("resize", () => {
  clearTimeout(timerId);

  timerId = setTimeout(() => {
    onWindowResize();
  }, 500)
});

// Functions
function init(){
  animate();

}

const clock = new Clock();

function animate() {
  const elapsedTime = clock.getElapsedTime();

  controls.update();

  //レンダリング
  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}

//ブラウザのリサイズに対応
function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}


/**************************************************************
元のコード
***************************************************************/
// // lil-guiをインポート
// import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.17/+esm';

// import * as THREE from "./build/three.module.js";
// import { OrbitControls } from "./controls/OrbitControls.js";

// /*************************************************************
// UIデバッグ
// *************************************************************/
// const gui = new GUI();
// // console.log(gui);



// //シーン
// const scene = new THREE.Scene();

// //カメラ
// const camera = new THREE.PerspectiveCamera(
//   75,
//   window.innerWidth / window.innerHeight,
//   0.1,
//   100
// );
// camera.position.set(1, 1, 2);

// //レンダラー
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// document.body.appendChild(renderer.domElement);

// //ジオメトリを作ってみよう。
// const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

// //マテリアル
// const material = new THREE.MeshBasicMaterial({
//   color: "red",
// });

// //メッシュ化
// const box = new THREE.Mesh(boxGeometry, material);
// scene.add(box);


// /*************************************************************
// UIデバッグを行う   下記のように登録を行うことでブラウザに変更の項目が現れる。
// *************************************************************/
// // ①位置情報を収めるフォルダ
// const positionFolder = gui.addFolder("Position");

// // -3から3の距離で0.01づつ位置を変更することができる。
// // gui.add(box.position, "x", -3, 3, 0.01);
// positionFolder.add(box.position, "x").min(-3).max(3).step(0.01).name("transformX");
// positionFolder.add(box.position, "y").min(-3).max(3).step(0.01).name("transformY");
// positionFolder.add(box.position, "z").min(-3).max(3).step(0.01).name("transformZ");

// positionFolder.add(box.rotation, "x").min(-3).max(3).step(0.01).name("rotationX");
// positionFolder.add(box.rotation, "y").min(-3).max(3).step(0.01).name("rotationY");

// // ②on_offを切り替えるフォルダ
// const visibleFolder = gui.addFolder("Visible");
// //　ジオメトリをon/off
// visibleFolder.add(box, "visible");
// // ワイヤーフレームをon/off
// visibleFolder.add(material, "wireframe");


// // 色を変更するフォルダ
// const colorFolder = gui.addFolder('Color')
// // 色を変更する
// colorFolder.addColor(material, "color");






// //ライト
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
// scene.add(ambientLight);

// //マウス操作
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;

// window.addEventListener("resize", onWindowResize);

// const clock = new THREE.Clock();

// function animate() {
//   const elapsedTime = clock.getElapsedTime();

//   controls.update();

//   //レンダリング
//   renderer.render(scene, camera);
//   requestAnimationFrame(animate);
// }

// //ブラウザのリサイズに対応
// function onWindowResize() {
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
// }

// animate();
