

import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  SphereGeometry,
  TextureLoader,
  MeshPhysicalMaterial,
  Mesh,
  DirectionalLight,
  PointLight,
  PointLightHelper,
} from "./build/three.module.js";

import { OrbitControls } from './controls/OrbitControls.js';


// グローバル変数
let scene, camera, renderer, pointLight, controls;

let timerId = null;

// EventListeners
window.addEventListener('load', init);

window.addEventListener('resize', () => {

  clearTimeout(timerId);

  timerId = setTimeout(() => {
    // console.log("Resize done!!")
    onWindowResize();
  }, 500);
})

// Functions
function init () {
  // シーン
  scene = new Scene();
  // カメラ
  // → カメラはシーンを表示するための視点として使われる
  //   視点の定義に使われるので、実際にシーン内に存在するオブジェクトとして扱う必要はない
  //   レンダリング時にカメラの位置や向きを元にシーン全体が描画される
  camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.set(0, 0, 500);

  // WebGLレンダラー ... 
  // → WebGLを使用してシーンをレンダリング
  // 　レンダラーはcanvasに描画するサイズや解像度を設定している
  // 　canvasタグはブラウザのように自動で解像度を設定されないのでJS側から設定する
  // シェーダーの準備 → バッファの設定(GPUにデータが送られ、描画が高速化され) → 描画へ
  renderer = new WebGLRenderer({
    alpha: true, // 背景を透明に
  });

  // レンダラーの大きさをブラウザの大きさに合わせる。
  renderer.setSize(window.innerWidth, window.innerHeight);
  // デバイスの大きさに応じて解像度を調整
  renderer.setPixelRatio(window.devicePixelRatio);
  
  // domElement...WebGLRendererがシーンをレンダリングするcanvasタグ
  // → ブラウザのDOMツリーの一部として扱われ、シーンのレンダリング結果を表示するための領域
  // console.log(renderer.domElement)
  document.body.appendChild(renderer.domElement);
  
  // ジオメトリ 球
  const ballGeometry = new SphereGeometry(100, 64, 32);
  
  // マテリアル → 材質
  // テキスチャー
  const texture = new TextureLoader().load('./textures/earth.avif');

  const ballMaterial = new MeshPhysicalMaterial({
    map: texture,
  });

  // メッシュ 
  const ballMesh = new Mesh(ballGeometry, ballMaterial);

  scene.add(ballMesh);
  
  // 平行光源  MeshBasicMaterialなどは光源を必要としない
    const directionalLight = new DirectionalLight(
    0xffffff,
    2, // 光の強さ
  );
  directionalLight.position.set(1, 1, 1);

  scene.add(directionalLight);

  // マウス操作できるようにする
  controls = new OrbitControls(camera, renderer.domElement);
  
  // ポイント光源
  pointLight = new PointLight(0xffffff, 1);
  pointLight.position.set(200, 200, 50);

  scene.add(pointLight);

  // ポイント光源
  const pointLightHelper = new PointLightHelper(
    pointLight, // 対象物
    30, // どのくらいの大きさで
  );
  scene.add(pointLightHelper);

  // ポイント光源を回転させる
  // console.log(Date.now());

  animate();
};


// ブラウザのリサイズに対応させる
function onWindowResize(){
  // レンダラーのサイズを更新
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // カメラのアスペクト比を更新
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix(); 
  // → カメラの投影行列を更新
  //   カメラの設定(例えば、アスペクト比)が変更された場合は、この行列を更新する必要がある
};


function animate(){
  // console.log(Date.now())

  // 回転させる
  pointLight.position.set(
    // cos(ラジアン単位で入れる)
    200 * Math.cos(Date.now() / 1000),  // X軸
    200 * Math.sin(Date.now() / 1000), // Y軸
    // 0,
    200 * Math.sin(Date.now() / 500),  // Z軸
    200 * Math.sin(Date.now() / 1000),    // Z軸
  );

  // フレーム単位でanimate関数を更新する
  // アニメーションの実行と、次の再描画の前にアニメーションを更新する指定した関数を呼び出す事を、ブラウザに伝える。 
  requestAnimationFrame(animate);
  
  // レンダラー
  // → カメラの位置や向きを元にシーン全体が描画される
  // レンダー関数もフレーム単位で更新しないと画面にレンダリングしない。
  renderer.render(scene, camera);
};


/**************************************************************
元のコード
***************************************************************/


// // import * as THREE from 'three';
// // orbitControlsはthreeの中には入ってないのでインポートする。
// import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';

// import {
//   Scene,
//   PerspectiveCamera,
//   WebGLRenderer,
//   SphereGeometry,
//   TextureLoader,
//   MeshPhysicalMaterial,
//   Mesh,
//   DirectionalLight,
//   PointLight,
//   PointLightHelper,
// } from "three";

// // グローバル変数
// let scene, camera, renderer, pointLight, controls;

// // EventListeners
// window.addEventListener('load', init);

// // Functions
// function init () {
//   // シーン
//   scene = new Scene();
//   // カメラ
//   camera = new PerspectiveCamera(
//     75,
//     window.innerWidth / window.innerHeight,
//     0.1,
//     1000,
//   );
//   // scene.add(camera);
//   camera.position.set(0, 0, 500);

//   // レンダラー WebGLレンダラーを使う
//   renderer = new WebGLRenderer({
//     alpha: true, // 背景を透明に
//   });

//   // レンダラーの大きさをブラウザの大きさに合わせる。
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   // デバイスの大きさに応じて解像度を調整
//   renderer.setPixelRatio(window.devicePixelRatio);
  
//   document.body.appendChild(renderer.domElement);
  
//   // ジオメトリ 球
//   const ballGeometry = new SphereGeometry(100, 64, 32);
  
//   // マテリアル → 材質
//   // テキスチャー
//   const texture = new TextureLoader().load('./textures/earth.jpg');

//   const ballMaterial = new MeshPhysicalMaterial({
//     map: texture,
//   });

//   // メッシュ 
//   const ballMesh = new Mesh(ballGeometry, ballMaterial);

//   scene.add(ballMesh);
  
//   // 平行光源  MeshBasicMaterialなどは光源を必要としない
//     const directionalLight = new DirectionalLight(
//     0xffffff,
//     2, // 光の強さ
//   );
//   directionalLight.position.set(1, 1, 1);

//   scene.add(directionalLight);

//   // マウス操作できるようにする
//   controls = new OrbitControls(camera, renderer.domElement);
  
//   // ポイント光源
//   pointLight = new PointLight(0xffffff, 1);
//   pointLight.position.set(200, 200, 50);

//   scene.add(pointLight);

//   // ポイント光源
//   const pointLightHelper = new PointLightHelper(
//     pointLight, // 対象物
//     30, // どのくらいの大きさで
//   );
//   scene.add(pointLightHelper);

//   // ポイント光源を回転させる
//   // console.log(Date.now());

//   window.addEventListener('resize', () => {
//     onWindowResize();
//   })

//   animate();
// };


// // ブラウザのリサイズに対応させる
// function onWindowResize(){
//   // レンダラーのサイズを更新
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   renderer.setPixelRatio(window.devicePixelRatio);

//   // カメラのアスペクト比を更新
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix(); // カメラの更新、変更をおこなったら必ず呼ぶ
// };


// function animate(){
//   // console.log(Date.now())
//   // 回転させる
//   pointLight.position.set(
//     // cos(ラジアン単位で入れる)
//     200 * Math.cos(Date.now() / 500), // X軸
//     200 * Math.sin(Date.now() / 1000), // Y軸
//     200 * Math.sin(Date.now() / 500), // Z軸
//   );

//   // フレーム単位でanimate関数を更新する
//   // アニメーションの実行と、次の再描画の前にアニメーションを更新する指定した関数を呼び出す事を、ブラウザに伝える。 
//   requestAnimationFrame(animate);
  
//   // レンダー関数もフレーム単位で更新しないと画面にレンダリングしない。
//   renderer.render(scene, camera);
// };

