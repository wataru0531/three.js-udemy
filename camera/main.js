
import {
  Scene,
  PerspectiveCamera,
  OrthographicCamera,
  WebGLRenderer,
  AxesHelper,
  SphereGeometry,
  Mesh,
  MeshBasicMaterial,

} from "./build/three.module.js";
import { OrbitControls } from "./controls/OrbitControls.js";

let scene, camera, renderer;
let sphere;

window.addEventListener("DOMContentLoaded", init);

function init() {
  const width = innerWidth;
  const height = innerHeight;

  // シーン
  scene = new Scene();

  /***********************************************************
  カメラ（レクチャー部分）
  ***************************************************************/
  // PerspectiveCamera
  // camera = new PerspectiveCamera(
  //   75, // 視野角(75°が一般的)
  //   window.innerWidth / window.innerHeight, // アスペクト比
  //   0.1, // 開始位置
  //   3000 // 終端位置(10000以内が妥当。大きい値にすると写す範囲が広くてGPUに負荷がかかってしまう)
  // );
  // camera.position.z = 550; // カメラを離す

  // OrthographicCamera...オブジェクトのサイズがカメラからの距離に関係なく一定に保たれる。
  const aspectRatio = window.innerWidth / window.innerHeight;
  // console.log(aspectRatio)
  camera = new OrthographicCamera(
    // ブラウザは右、左に拡大縮小するので、右左にaspectRationを適用させれば大きさに従って左右の引数がいい感じに調整される。
    500 * aspectRatio, // 左
    -500 * aspectRatio, // 右
    -500, // 上
    500, // 下
    0.1, // 開始距離
    3000 // 終端位置
  );
  // オブジェクトとカメラからの距離を変更してもオブジェクトの大きさは変わらない。
  camera.position.z = 100; // 1000, 10000 に変更しても球の大きさは変わらない

  // レンダラー
  renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  document.body.appendChild(renderer.domElement);

  // 座標軸を表示
  const axes = new AxesHelper(1500);
  axes.position.x = 0;
  scene.add(axes); // x 軸は赤, y 軸は緑, z 軸は青

  // ボックスを作成
  const geometry = new SphereGeometry(200, 64, 32);
  const material = new MeshBasicMaterial({
    color: 0xc7ebb,
    wireframe: true,
  });
  sphere = new Mesh(geometry, material);
  scene.add(sphere);

  //マウス操作
  new OrbitControls(camera, renderer.domElement);

  animate();
};

// EventListeners
window.addEventListener("DOMContentLoaded", init);

let timerId = null;

window.addEventListener("resize", () => {
  clearTimeout(timerId);

  timerId = setTimeout(() => {
    // console.log("resize done!!");
    onWindowResize()
  }, 500);

});


// Functions

function animate() {
  requestAnimationFrame(animate);

  sphere.rotation.x += 0.01;
  sphere.rotation.y += 0.01;

  // レンダリング
  renderer.render(scene, camera);
};

function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
};


/**************************************************************
元のコード
***************************************************************/
// import * as THREE from "./build/three.module.js";
// import { OrbitControls } from "./controls/OrbitControls.js";

// let scene, camera, renderer;
// let sphere;

// window.addEventListener("DOMContentLoaded", init);

// function init() {
//   const width = innerWidth;
//   const height = innerHeight;

//   // シーン
//   scene = new THREE.Scene();

//   /***********************************************************
//   カメラ（レクチャー部分）
//   ***************************************************************/
//   // PerspectiveCamera
//   // camera = new THREE.PerspectiveCamera(
//   //   75, // 視野角(75°が一般的)
//   //   window.innerWidth / window.innerHeight, // アスペクト比
//   //   0.1, // 開始位置
//   //   3000 // 終端位置(10000以内が妥当。大きい値にすると写す範囲が広くてGPUに負荷がかかってしまう)
//   // );
//   // camera.position.z = 550; // カメラを離す

//   // OrthographicCamera...オブジェクトのサイズがカメラからの距離に関係なく一定に保たれる。
//   const aspectRatio = window.innerWidth / window.innerHeight;
//   // console.log(aspectRatio)
//   camera = new THREE.OrthographicCamera(
//     // ブラウザは右、左に拡大縮小するので、右左にaspectRationを適用させれば大きさに従って左右の引数がいい感じに調整される。
//     500 * aspectRatio, // 左
//     -500 * aspectRatio, // 右
//     -500, // 上
//     500, // 下
//     0.1, // 開始距離
//     3000 // 終端位置
//   );
//   // オブジェクトとカメラからの距離を変更してもオブジェクトの大きさは変わらない。
//   camera.position.z = 100;

//   // レンダラー
//   renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//   renderer.setPixelRatio(window.devicePixelRatio);
//   renderer.setSize(width, height);
//   document.body.appendChild(renderer.domElement);

//   // 座標軸を表示
//   const axes = new THREE.AxesHelper(1500);
//   axes.position.x = 0;
//   scene.add(axes); // x 軸は赤, y 軸は緑, z 軸は青

//   // ボックスを作成
//   const geometry = new THREE.SphereGeometry(200, 64, 32);
//   const material = new THREE.MeshBasicMaterial({
//     color: 0xc7ebb,
//     wireframe: true,
//   });
//   sphere = new THREE.Mesh(geometry, material);
//   scene.add(sphere);

//   //マウス操作
//   new OrbitControls(camera, renderer.domElement);

//   window.addEventListener("resize", onWindowResize);
//   animate();
// };


// function animate() {
//   requestAnimationFrame(animate);

//   sphere.rotation.x += 0.01;
//   sphere.rotation.y += 0.01;

//   // レンダリング
//   renderer.render(scene, camera);
// };

// function onWindowResize() {
//   renderer.setSize(window.innerWidth, window.innerHeight);

//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
// };
