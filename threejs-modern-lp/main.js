

import {
  Scene,
  PerspectiveCamera,
  MeshPhysicalMaterial,
  Mesh,
  TorusGeometry,
  OctahedronGeometry,
  TorusKnotGeometry,
  IcosahedronGeometry,
  BufferGeometry,
  BufferAttribute,
  PointsMaterial,
  Points,
  DirectionalLight,
  WebGLRenderer,
  Clock,
  AxesHelper,
  DirectionalLightHelper,

} from "./build/three.module.js";

// import { OrbitControls } from "./controls/OrbitControls.js";
import GUI from "https://cdn.jsdelivr.net/npm/lil-gui@0.15/+esm";

const gui = new GUI(); // UIデバック lil-gui
// console.log(gui);

const scene = new Scene();

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const camera = new PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100,
);
// camera.position.z = 6;
camera.position.set(1, 1, 6);

scene.add(camera);

// マテリアル
const material = new MeshPhysicalMaterial({
  color: "#3c94d7",
  metalness: .86, // 1に近づけば近づくほど金属然となる
  roughness: .5, // 粗さ。0(完全に滑らか) 〜　1(非常に荒い)
  flatShading: true, 
});

gui.addColor(material, "color");
gui.add(material, "metalness").min(0).max(1).step(0.001);
gui.add(material, "roughness").min(0).max(1).step(0.001);


// メッシュ化 ジオメトリ + マテリアル
const mesh1 = new Mesh(new TorusGeometry(1, 0.4, 16, 60), material);
const mesh2 = new Mesh(new OctahedronGeometry(), material);
const mesh3 = new Mesh(new TorusKnotGeometry(0.8, 0.35, 100, 16), material);
const mesh4 = new Mesh(new IcosahedronGeometry(), material);

//  回転用に配置する
mesh1.position.set(2, 0, 0); // ドーナッツ
mesh2.position.set(-1, 0, 0); // 円錐
mesh3.position.set(2, 0, -6); // 
mesh4.position.set(5, 0, 3); // 

// メッシュの配列
const meshes = [mesh1, mesh2, mesh3, mesh4];

scene.add(mesh1, mesh2, mesh3, mesh4);


// パーティクルを追加
const particlesGeometry = new BufferGeometry();

const count = 100;

//　頂点の位置情報を作っていく
// 3...x,y,zの座標。
const positionArray = new Float32Array(count * 3);

const length = count * 3;
for(let i = length -1; i >= 0; i--){ // 逆からループ
  positionArray[i] = (Math.random() - .5) * 10;
}
// console.log(positionArray)

// 属性情報
// BufferAttribute ... 
// → 各頂点の位置情報を保持させる
//   BufferGeometryに属性(例えば頂点位置、法線、色など)を追加するためのクラス
//   3 ... itemSize。3つ(x, y, z)でde1つの頂点となる
const bufferAttribute = new BufferAttribute(positionArray, 3);
// console.log(bufferAttribute); // BufferAttribute {name: '', array: Float32Array(300), itemSize: 3, count: 100, normalized: false, …}

// ジオメトリに属性を付与
particlesGeometry.setAttribute('position',bufferAttribute);
// console.log(particlesGeometry)

// マテリアル
const pointsMaterial = new PointsMaterial({
  size: 0.015,
  color: "#ffffff",
});

// メッシュ
const particles = new Points(particlesGeometry, pointsMaterial);
scene.add(particles);

// ライト
const directionalLight = new DirectionalLight(
  "#ffffff",
  4,
);
directionalLight.position.set(0.5, 1, 0);
const dHelper = new DirectionalLightHelper(directionalLight, .3);

scene.add(directionalLight, dHelper);

const canvas = document.getElementById("js-canvas");

// レンダラー
const renderer = new WebGLRenderer({
  canvas: canvas,
  alpha: true, // 背景画像が見えるようにする
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);

// へルパー
const axes = new AxesHelper(20);
scene.add(axes);


// EventListeners

document.addEventListener("DOMContentLoaded", init);


// ホイール...wheelイベントが発火している時の動き
let speed = 0;
let rotation = 0;

window.addEventListener('wheel', (e) => {
  // console.log(e); // WheelEvent {isTrusted: true, deltaX: -1, deltaY: 1, deltaZ: 0, deltaMode: 0, …}
  // console.log(e.deltaY);

  // deltaY...
  // → どれだけマウスホイールしたか。
  //   一度のホイールイベントで行われたスクロール量を示す。
  //   したがって、短時間に大きな値を示すこともある。
  // 注意 ホイールイベントは使っているデバイスや操作方法によって違うので注意する
  speed += e.deltaY * 0.002;

  // console.log(speed)
});

// カーソルの位置を取得
const cursor = { x: 0, y: 0 };
// console.log(cursor);

window.addEventListener('mousemove', (event) => {
  // 画面中央を(0, 0)の座標にする
  cursor.x = event.clientX / sizes.width - 0.5; 
  cursor.y = event.clientY / sizes.height - 0.5;

  console.log(`x軸: ${cursor.x}, y軸: ${cursor.y}`);
});

// ブラウザのリサイズ操作
let timerId = null;
window.addEventListener('resize', () => {
  clearTimeout(timerId);

  timerId = setTimeout(() => {
    // console.log("resize done!!")

    // サイズの更新
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // カメラのアップデート
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix(); // 変更を加えたらかならず呼び出す必要がある。

    // レンダラーのアップデート
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(window.devicePixelRatio);
  }, 500);
});

// アニメーション
// Clock()...時間を追跡するためのオブジェクト
const clock = new Clock();
const minX = -3; // 最小値
const maxX = 3;  // 最大値
const minY = -3;
const maxY = 3;

function init(){
  rot();
  render();
}

function rot(){
  rotation += speed;
  // console.log(rotation)

  speed *= 0.83; // フレームの更新ごとに0.93をかけ続けるので慣性がかかる。

  // メッシュ達を回転させる
  // 2, -3...原点をずらす。
  // 3.8...半径。
  // rotation...ここではθシータを意味する。
  // Math.PI / 2...ラジアン単位で90°を意味する。
  // 3 * (Math.PI / 2)...270°
  mesh1.position.x = 2 + 3.8 * Math.cos(rotation); // ドーナッツ
  mesh1.position.z = -3 + 3.8 * Math.sin(rotation);

  mesh2.position.x = 2 + 3.8 * Math.cos(rotation + Math.PI / 2);
  mesh2.position.z = -3 + 3.8 * Math.sin(rotation + Math.PI / 2);

  mesh3.position.x = 2 + 3.8 * Math.cos(rotation + Math.PI);
  mesh3.position.z = -3 + 3.8 * Math.sin(rotation + Math.PI);

  mesh4.position.x = 2 + 3.8 * Math.cos(rotation + 3 * (Math.PI / 2));
  mesh4.position.z = -3 + 3.8 * Math.sin(rotation + 3 * (Math.PI / 2));

  // フレームの更新ごとにrot()を呼び出す。
  window.requestAnimationFrame(rot);
};

function render (){
  renderer.render(scene, camera);

  // フレームの更新時間を取得する。(パソコンのスペックによって違う)
  let getDeltaTime = clock.getDelta();
  // console.log(getDeltaTime)

  // メッシュを回転させる
  meshes.forEach((mesh) => {
    // デルタタイムをかけることでどのデバイスのスペックでも同じように回転する。
    mesh.rotation.x += 0.1 * getDeltaTime;
    mesh.rotation.y += 0.1 * getDeltaTime;
  });

  // カメラの位置変更
  // getDeltaTimeをつけることで各デバイスで一定の負荷をつけることができる。
  // Y軸は上がマイナスになるので、上にカーソルを置いた場合カメラは下に向くのでマイナスをかけてやる。
  camera.position.x +=  cursor.x * getDeltaTime * 2;
  camera.position.y += -cursor.y * getDeltaTime * 2;

  // カメラの位置に制限を加える
  // ここでは、x軸, y軸とも -3 〜 3の範囲
  camera.position.x = Math.max(minX, Math.min(maxX, camera.position.x));
  camera.position.y = Math.max(minY, Math.min(maxY, camera.position.y));

  // フレームの更新(16.7m秒)毎にrender()が呼ばれる。
  window.requestAnimationFrame(render);
};



/**************************************************************
元のコード
***************************************************************/

// import {
//   Scene,
//   PerspectiveCamera,
//   MeshPhysicalMaterial,
//   Mesh,
//   TorusGeometry,
//   OctahedronGeometry,
//   TorusKnotGeometry,
//   IcosahedronGeometry,
//   BufferGeometry,
//   BufferAttribute,
//   PointsMaterial,
//   Points,
//   DirectionalLight,
//   WebGLRenderer,
//   Clock,

// } from "./build/three.module.js";

// import { OrbitControls } from "./controls/OrbitControls.js";
// import GUI from "https://cdn.jsdelivr.net/npm/lil-gui@0.15/+esm";

// // import * as dat from 'lil-gui';


// // UIデバック lil-gui
// const gui = new GUI();
// // console.log(gui);

// // シーン
// const scene = new Scene();

// // サイズ設定
// const sizes = {
//   width: window.innerWidth,
//   height: window.innerHeight,
// };

// const camera = new PerspectiveCamera(
//   75,
//   sizes.width / sizes.height,
//   0.1,
//   100,
// );
// camera.position.z = 6;

// scene.add(camera);


// // ジオメトリ

// // マテリアル
// const material = new MeshPhysicalMaterial({
//   // color: "#3c94d7",
//   color: "#3cd794",
//   metalness: 0.86,
//   roughness: 0.37,
//   flatShading: true,
// });

// gui.addColor(material, "color");
// gui.add(material, "metalness").min(0).max(1).step(0.001);
// gui.add(material, "roughness").min(0).max(1).step(0.001);


// // メッシュ化 ジオメトリ + マテリアル
// const mesh1 = new Mesh(new TorusGeometry(1, 0.4, 16, 60), material);
// const mesh2 = new Mesh(new OctahedronGeometry(), material);
// const mesh3 = new Mesh(new TorusKnotGeometry(0.8, 0.35, 100, 16), material);
// const mesh4 = new Mesh(new IcosahedronGeometry(), material);

// //  回転用に配置する
// mesh1.position.set(2, 0, 0);
// mesh2.position.set(-1, 0, 0);
// mesh3.position.set(2, 0, -6);
// mesh4.position.set(5, 0, 3);

// // メッシュの配列
// const meshes = [mesh1, mesh2, mesh3, mesh4];

// scene.add(mesh1, mesh2, mesh3, mesh4);


// // パーティクルを追加
// // バッファジオメトリ
// const particlesGeometry = new BufferGeometry();

// const count = 100;

// //　頂点の位置情報を作っていく
// // 3...x,y,zの座標。
// const positionArray = new Float32Array(count * 3);

// for(let i = 0; i < count * 3; i++){
//   // 0から1の値を取得し、正と負の値で情報が欲しいので-0.5とする。
//   positionArray[i] = (Math.random() - 0.5) * 10;
// };

// // 属性情報
// const bufferAttribute = new BufferAttribute(positionArray, 3);

// // ジオメトリに属性を付与
// particlesGeometry.setAttribute(
//   'position',
//   bufferAttribute,
// );

// // マテリアル
// const pointsMaterial = new PointsMaterial({
//   size: 0.015,
//   color: "#ffffff",
// });

// // メッシュ化...Pointsを使う。.
// const particles = new Points(particlesGeometry, pointsMaterial);

// scene.add(particles);


// // ライトを追加
// const directionalLight = new DirectionalLight(
//   "#ffffff",
//   4,
// );
// directionalLight.position.set(0.5, 1, 0);

// scene.add(directionalLight);




// const canvas = document.getElementById("js-canvas");

// // レンダラー
// const renderer = new WebGLRenderer({
//   canvas: canvas,
//   alpha: true, // 背景画像が見えるようにする
// });

// renderer.setSize(sizes.width, sizes.height);
// renderer.setPixelRatio(window.devicePixelRatio);


// // ホイール...wheelイベントが発火している時の動き
// let speed = 0;
// let rotation = 0;

// window.addEventListener('wheel', (event) => {
//   // deltaY...どれだけホイールしたか。浮き沈み。
//   speed += event.deltaY * 0.002;

//   console.log(speed)

// });

// rot()
// function rot(){
//   rotation += speed;
//   speed *= 0.83; // フレームの更新ごとに0.93をかけ続けるので慣性がかかる。

//   // メッシュ達を回転させる
//   // 2, -3...原点をずらす。
//   // 3.8...半径。
//   // rotation...ここではθシータを意味する。
//   // Math.PI / 2...ラジアン単位で90°を意味する。
//   // 3 * (Math.PI / 2)...270°
//   mesh1.position.x = 2 + 3.8 * Math.cos(rotation);
//   mesh1.position.z = -3 + 3.8 * Math.sin(rotation);

//   mesh2.position.x = 2 + 3.8 * Math.cos(rotation + Math.PI / 2);
//   mesh2.position.z = -3 + 3.8 * Math.sin(rotation + Math.PI / 2);

//   mesh3.position.x = 2 + 3.8 * Math.cos(rotation + Math.PI);
//   mesh3.position.z = -3 + 3.8 * Math.sin(rotation + Math.PI);

//   mesh4.position.x = 2 + 3.8 * Math.cos(rotation + 3 * (Math.PI / 2));
//   mesh4.position.z = -3 + 3.8 * Math.sin(rotation + 3 * (Math.PI / 2));


//   // フレームの更新ごとにrot()を呼び出す。
//   window.requestAnimationFrame(rot);
// };


// // カーソルの位置を取得
// const cursor = { x: 0, y: 0 };
// console.log(cursor);

// window.addEventListener('mousemove', (event) => {
//   cursor.x = event.clientX / sizes.width - 0.5; // 幅で割ることで0から1の間で値を取得できる。
//   cursor.y = event.clientY / sizes.height - 0.5; // 上が0。

//   console.log(cursor.x, cursor.y);
// });

// // ブラウザのリサイズ操作
// window.addEventListener('resize', () => {
//   // サイズの更新
//   sizes.width = window.innerWidth;
//   sizes.height = window.innerHeight;

//   // カメラのアップデート
//   camera.aspect = sizes.width / sizes.height;
//   camera.updateProjectionMatrix(); // 変更を加えたらかならず呼び出す必要がある。

//   // レンダラーのアップデート
//   renderer.setSize(sizes.width, sizes.height);
//   renderer.setPixelRatio(window.devicePixelRatio);
// });


// // アニメーション
// // Clock()...時間を追跡するためのオブジェクト
// const clock = new Clock();
// // console.log(clock.elapsedTime)

// const animate = () => {
//   renderer.render(scene, camera);

//   // フレームの更新時間を取得する。(パソコンのスペックによって違う)
//   let getDeltaTime = clock.getDelta();
//   // console.log(getDeltaTime)

//   // メッシュを回転させる
//   meshes.forEach((mesh) => {
//     // デルタタイムをかけることでどのデバイスのスペックでも同じように回転する。
//     mesh.rotation.x += 0.1 * getDeltaTime;
//     mesh.rotation.y += 0.1 * getDeltaTime;
//   });

//   // カメラの制御
//   // getDeltaTimeをつけることで各デバイスで一定の負荷をつけることができる。
//   // Y軸は上がマイナスになるので、上にカーソルを置いた場合カメラは下に向くのでマイナスをかけてやる。
//   camera.position.x += cursor.x * getDeltaTime * 2;
//   camera.position.y += -cursor.y *getDeltaTime * 2;

//   // フレームの更新(16.7m秒)毎にanimate()が呼ばれる。
//   window.requestAnimationFrame(animate);
// };

// animate();

