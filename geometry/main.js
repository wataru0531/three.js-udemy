
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  SphereGeometry,
  PlaneGeometry,
  TorusGeometry,
  BufferGeometry,
  BufferAttribute,
  MeshBasicMaterial,
  Mesh,
  AmbientLight,
  Clock,
} from "./build/three.module.js";

import { OrbitControls } from "./controls/OrbitControls.js";


// シーン
const scene = new Scene();
// カメラ
const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(1, 1, 4);

// レンダラー ... canvasに描画する設定
const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// renderer.setPixelRatio(1);
document.body.appendChild(renderer.domElement);


// ジオメトリを作ってみよう。
// ボックス
const boxGeometry = new BoxGeometry(1, 1, 1, 10, 10, 10);
// 球
const sphereGeometry = new SphereGeometry(0.5 ,32, 16, 16);
// 平面
const planeGeometry = new PlaneGeometry(10, 10, 16, 16);
// ドーナツ型
const torusGeometry = new TorusGeometry(0.5, 0.2, 15, 100, Math.PI * 2);
// Math.PI...円周率が返る。円周率...円の周りの長さは直径の何倍か
// ラジアン単位...360°→2π、180°→π、30°→π/6


// バッファジオメメトリ　自作のGeometry
const bufferGeometry = new BufferGeometry();
// console.log(bufferGeometry)

const count = 10;

// Float32Array()...型付き配列。小数点しか入らない配列。実際は整数も入る。
// 型の情報を指定することで、メモリ効率が高く、JavaScriptの通常の配列よりも高速にデータを処理できる
// ここでいう計算の精度というのは、少数のために計算結果が細かく正確ということで、
// 少数の計算が大量におこなわれるので決して負荷が小さいというわけではない
const positionArray = new Float32Array(9 * count);
// console.log(positionArray); // Float32Array(90) [0, 0, 0, ...]

for(let i = 0; i < count * 9; i++){
  // console.log(positionArray[i]);

  // Math.random()...0から1未満の小数がランダムに入る
  positionArray[i] = (Math.random() - 0.5) * 2;
}
// console.log(positionArray)

// 座標①
// positionArray[0] = 0; // X座標
// positionArray[1] = 0; // Y座標
// positionArray[2] = 0; // Z座標
// 座標②
// positionArray[3] = 0;
// positionArray[4] = 1;
// positionArray[5] = 0;
// 座標③
// positionArray[6] = 1;
// positionArray[7] = 0;
// positionArray[8] = 0;

// console.log(positionArray);

// 位置の属性を取得
// BufferAttribute(配列, itemSize)
// itemSize →　各頂点属性の要素数。
//             この場合、3が渡されているので、各頂点の位置情報が3つの要素（X座標、Y座標、Z座標）で構成されていることを示す
const positionAttribute = new BufferAttribute(positionArray, 3);
// console.log(positionAttribute); // BufferAttribute {name: '', array: Float32Array(90), itemSize: 3, count: 30, normalized: false, …}

// bufferGeometryの頂点にpositionという名前で、頂点の配列を追加している
// console.log(bufferGeometry);
bufferGeometry.setAttribute('position', positionAttribute);
console.log(bufferGeometry);

// マテリアル...色などの材質
// const material = new MeshNormalMaterial({
//   // wireframe: true,
// });

// BufferGeometryにのみMeshBasicMaterialを適用。
// MeshBasicMaterial...公言を必要としない。
const material = new MeshBasicMaterial({
  wireframe: true,
  color: "lightgreen",
});


// メッシュ化
const box = new Mesh(boxGeometry, material);
const sphere = new Mesh(sphereGeometry, material);
const plane = new Mesh(planeGeometry, material);
const torus = new Mesh(torusGeometry, material);

// オリジナルで作ったbufferGeometryを使ってメッシュにする
const buffer = new Mesh(bufferGeometry, material);

sphere.position.x = 1.5;
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;
torus.position.x = -2;
torus.position.y = 0.5;

// シーンにメッシュ化したものをaddしていく
// scene.add(box, sphere, plane, torus);

scene.add(buffer);

// ライト
const ambientLight = new AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

// マウス操作
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const clock = new Clock();

// EventListeners

window.addEventListener("DOMContentLoaded", init);

let timerId;
window.addEventListener("resize", () => {
  clearTimeout(timerId);

  timerId = setTimeout(() => {
    onWindowResize();
  }, 500);
});

// Functions
function init(){
  animate();
}

//ブラウザのリサイズに対応
function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

function animate() {
  const elapsedTime = clock.getElapsedTime();
  // console.log(elapsedTime);

  //オブジェクトの回転
  // sphere.rotation.x = elapsedTime;
  // plane.rotation.x = elapsedTime;
  // octahedron.rotation.x = elapsedTime;
  // torus.rotation.x = elapsedTime;

  // sphere.rotation.y = elapsedTime;
  // plane.rotation.y = elapsedTime;
  // octahedron.rotation.y = elapsedTime;

  // torus.rotation.y = elapsedTime;

  controls.update();

  //レンダリング
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}


/**************************************************************
元のコード
***************************************************************/
// import * as THREE from "./build/three.module.js";
// import { OrbitControls } from "./controls/OrbitControls.js";

// // import {

// // } from "./build/three.module.js";
// /****************************************************************
// シーン
// ****************************************************************/
// const scene = new THREE.Scene();

// /****************************************************************
// カメラ
// ****************************************************************/
// const camera = new THREE.PerspectiveCamera(
//   75,
//   window.innerWidth / window.innerHeight,
//   0.1,
//   100
// );
// camera.position.set(1, 1, 2);

// /****************************************************************
// レンダラー
// ****************************************************************/
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// document.body.appendChild(renderer.domElement);

// /****************************************************************
// ジオメトリを作ってみよう。
// ****************************************************************/
// // ボックス
// const boxGeometry = new THREE.BoxGeometry(1, 1, 1, 10, 10, 10);
// // 球体
// const sphereGeometry = new THREE.SphereGeometry(0.5 ,32, 16, 16);
// // 平面
// const planeGeometry = new THREE.PlaneGeometry(10, 10, 16, 16);
// // ドーナツ型
// const torusGeometry = new THREE.TorusGeometry(0.5, 0.2, 15, 100, Math.PI * 2);
// // Math.PI...円周率が返る。円周率...円の周りの長さは直径の何倍か
// // ラジアン単位...360°→2π、180°→π、30°→π/6

// /****************************************************************
// バッファジオメメトリ　　自作
// ****************************************************************/
// const bufferGeometry = new THREE.BufferGeometry();

// const count = 10;

// // Float32Array()...型付き配列。小数点しか入らない配列。実際は整数も入る。
// // 型の情報を指定することで高速に処理されるのでメリットがある。
// const positionArray = new Float32Array(9 * count);

// for(let i = 0; i < count * 9; i++){
//   // console.log(positionArray[i]);

//   // Math.random()...0から1までの不動小数点がランダムにni入る
//   positionArray[i] = (Math.random() - 0.5) * 2;
// }

// // 座標①
// // positionArray[0] = 0; // X座標
// // positionArray[1] = 0; // Y座標
// // positionArray[2] = 0; // Z座標
// // 座標②
// // positionArray[3] = 0;
// // positionArray[4] = 1;
// // positionArray[5] = 0;
// // 座標③
// // positionArray[6] = 1;
// // positionArray[7] = 0;
// // positionArray[8] = 0;

// console.log(positionArray);

// // 位置の属性を取得
// // BufferAttribute(配列, 頂点の数)
// const positionAttribute = new THREE.BufferAttribute(positionArray, 3)

// bufferGeometry.setAttribute('position', positionAttribute);

// /****************************************************************
// マテリアル...色などの材質
// ****************************************************************/
// // const material = new THREE.MeshNormalMaterial({
// //   // wireframe: true,
// // });

// // BufferGeometryにのみMeshBasicMaterialを適用。
// // MeshBasicMaterial...公言を必要としない。
// const material = new THREE.MeshBasicMaterial({
//   wireframe: true,
//   color: "lightgreen",
// });

// /****************************************************************
// メッシュ化
// ****************************************************************/
// const box = new THREE.Mesh(boxGeometry, material);
// const sphere = new THREE.Mesh(sphereGeometry, material);
// const plane = new THREE.Mesh(planeGeometry, material);
// const torus = new THREE.Mesh(torusGeometry, material);

// // バッファ
// const buffer = new THREE.Mesh(bufferGeometry, material);

// sphere.position.x = 1.5;
// plane.rotation.x = -Math.PI * 0.5;
// plane.position.y = -0.5;
// torus.position.x = -2;
// torus.position.y = 0.5;


// // シーンにメッシュ化したものをaddしていく
// // scene.add(box, sphere, plane, torus);

// scene.add(buffer);

// /****************************************************************
// ライト
// ****************************************************************/
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
// scene.add(ambientLight);

// /****************************************************************
// マウス操作
// ****************************************************************/
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;

// window.addEventListener("resize", onWindowResize);

// const clock = new THREE.Clock();

// function animate() {
//   const elapsedTime = clock.getElapsedTime();
//   // console.log(elapsedTime);

//   //オブジェクトの回転
//   // sphere.rotation.x = elapsedTime;
//   // plane.rotation.x = elapsedTime;
//   // octahedron.rotation.x = elapsedTime;
//   // torus.rotation.x = elapsedTime;

//   // sphere.rotation.y = elapsedTime;
//   // plane.rotation.y = elapsedTime;
//   // octahedron.rotation.y = elapsedTime;

//   // torus.rotation.y = elapsedTime;

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
