
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  SphereGeometry,
  PlaneGeometry,
  OctahedronGeometry,
  TextureLoader,
  MeshBasicMaterial,
  DoubleSide,
  MeshNormalMaterial,
  MeshStandardMaterial,
  MeshPhongMaterial,
  Color,
  AmbientLight,
  PointLight,
  PointLightHelper,
  Mesh,
  Clock,
} from "./build/three.module.js";

import { OrbitControls } from "./controls/OrbitControls.js";

let scene, camera, renderer, pointLight, controls, sphere, plane, octahedron;

// EventListeners
window.addEventListener("load", init);

let timerId = null;
window.addEventListener("resize", () => {
  clearTimeout(timerId);

  timerId = setTimeout(() => {
    onWindowResize()
  }, 500);
});

function init() {
  scene = new Scene(); //シーン
  camera = new PerspectiveCamera( //カメラ
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(1, 1, 5);

  renderer = new WebGLRenderer(); //レンダラー
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  document.body.appendChild(renderer.domElement);

  // ジオメトリ
  const sphereGeometry = new SphereGeometry(0.5, 16, 16);
  const planeGeometry = new PlaneGeometry(1, 1);
  const octahedronGeometry = new OctahedronGeometry(0.5);

  // テキスチャ...ここでは画像
  const texture = new TextureLoader().load('./textures/brick.avif');

  /***************************************************************
  マテリル...色、画像などをジオメトリにつける
  ****************************************************************/
  // ①MeshBasicMaterial...光源の必要なし
  // const material = new MeshBasicMaterial({
  //   color: 0xff4f4e,
  //   // map: texture,
  //   wireframe: true,
  //   side: DoubleSide, // 裏側も見たい場合。PlaneGeometryなど
  //   // opacity: 0.1, // opacityをかける場合はtransparentをtrueにする。
  //   // transparent: true,
  // });

  // ②MeshNormalMaterial...色(RGB)を可視化したマテリアル。
  //                       光源必要なし
  // const material = new MeshNormalMaterial({
  //   side: DoubleSide,
  // });
  // material.flatShading = true; // 平坦を表現できる

  // ③MeshStandardMaterial...光源が必要。
  const material = new MeshStandardMaterial();
  material.color.set("#049ef4");
  material.roughness = 0.1; // 荒さ。小さくすれば荒さがなくなる。
  material.metalness = .16; // 金属製。小さくすればするほど明るくなる
  // material.map = texture; // テクスチャーを持ちながらも金属製を持たせることもできる。
  
  // ④MeshPhongMaterial...光の反射などを表現できる。
  //                       光源が必要
  // const material = new MeshPhongMaterial();
  // material.shininess = 100;
  // material.specular = new Color("red"); // 赤色でポイントライトを反射できる。

  // 光源
  // アンビエントライト
  const ambientLight = new AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);

  // ポイントライト
  const pointLight = new PointLight(0xffffff, 0.7);
  pointLight.position.set(1, 1, 3);
  scene.add(pointLight);

  // ポイントライトのヘルパー
  const pointLightHelper = new PointLightHelper(pointLight, 0.3);
  scene.add(pointLightHelper);
  

  // メッシュ
  sphere = new Mesh(sphereGeometry, material);
  plane = new Mesh(planeGeometry, material);
  octahedron = new Mesh(octahedronGeometry, material);

  // 位置を変える
  sphere.position.x = -1.5;
  octahedron.position.x = 1.5;

  scene.add(sphere, plane, octahedron);
  
  //マウスタッチによるカメラの制御
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  animate();
}

// 時間を取得
const clock = new Clock();

function animate() {
  // getElapseTime()...ここではanimate関数が呼ばれてからどのくらい時間が経ったかを計測
  const elapsedTime = clock.getElapsedTime();
  // console.log(elapsedTime)

  // オブジェクトを回転させる
  sphere.rotation.x = elapsedTime;
  plane.rotation.x = elapsedTime;
  octahedron.rotation.x = elapsedTime;

  sphere.rotation.y = elapsedTime;
  plane.rotation.y = elapsedTime;
  octahedron.rotation.y = elapsedTime;

  controls.update();

  //レンダリング
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

// リサイズ
function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}


/**************************************************************
元のコード
***************************************************************/

// import * as THREE from "./build/three.module.js";
// import { OrbitControls } from "./controls/OrbitControls.js";

// let scene, camera, renderer, pointLight, controls, sphere, plane, octahedron;

// window.addEventListener("load", init);

// function init() {
//   //シーン
//   scene = new THREE.Scene();

//   //カメラ
//   camera = new THREE.PerspectiveCamera(
//     75,
//     window.innerWidth / window.innerHeight,
//     0.1,
//     100
//   );
//   camera.position.set(1, 1, 5);

//   //レンダラー
//   renderer = new THREE.WebGLRenderer();
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//   document.body.appendChild(renderer.domElement);

//   /**
//    * マテリアルセクション
//    */

//   // ジオメトリ
//   const sphereGeometry = new THREE.SphereGeometry(0.5, 16, 16);
//   const planeGeometry = new THREE.PlaneGeometry(1, 1);
//   const octahedronGeometry = new THREE.OctahedronGeometry(0.5);

//   // テキスチャ...ここでは画像
//   const texture = new THREE.TextureLoader().load('./textures/brick.jpg');

//   /***************************************************************
//   マテリル...色、画像などをジオメトリにつける
//   ****************************************************************/
//   // ①MeshBasicMaterial...光源の必要なし
//   // const material = new THREE.MeshBasicMaterial({
//   //   color: 0xff4f4e,
//   //   // map: texture,
//   //   wireframe: true,
//   //   side: THREE.DoubleSide, // 裏側も見たい場合。PlaneGeometryなど
//   //   // opacity: 0.1, // opacityをかける場合はtransparentをtrueにする。
//   //   // transparent: true,
//   // });

//   // ②MeshNormalMaterial...色(RGB)を可視化したマテリアル
//   // const material = new THREE.MeshNormalMaterial({
//   //   side: THREE.DoubleSide,
//   // });
//   // material.flatShading = true; // 平坦を表現できる

//   // ③MeshStandardMaterial...光源が必要。
//   // const material = new THREE.MeshStandardMaterial();
//   // // material.color.set("#049ef4");
//   // material.roughness = 0.1; // 荒さ。小さくすれば荒さがなくなる。
//   // material.metalness = 0.64; // 金属製
//   // material.map = texture; // テクスチャーを持ちながらも金属製を持たせることもできる。
  

//   // ④MeshPhongMaterial...光の反射などを表現できる。
//   const material = new THREE.MeshPhongMaterial();
//   material.shininess = 100;
//   material.specular = new THREE.Color("red"); // 赤色でポイントライトを反射できる。


//   /***************************************************************
//   明かり
//   ****************************************************************/
//   // アンビエントライト
//   const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
//   scene.add(ambientLight);

//   // ポイントライト
//   const pointLight = new THREE.PointLight(0xffffff, 0.7);
//   pointLight.position.set(1, 1, 3);
//   scene.add(pointLight);

//   // ポイントライトのヘルパー
//   const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.3);
//   scene.add(pointLightHelper);

//   /***************************************************************
//   メッシュ化
//   ****************************************************************/
//   sphere = new THREE.Mesh(sphereGeometry, material);
//   plane = new THREE.Mesh(planeGeometry, material);
//   octahedron = new THREE.Mesh(octahedronGeometry, material);

//   // 位置を変える
//   sphere.position.x = -1.5;
//   octahedron.position.x = 1.5;

//   scene.add(sphere, plane, octahedron);
  

//   //マウス操作
//   const controls = new OrbitControls(camera, renderer.domElement);

//   window.addEventListener("resize", onWindowResize);

//   animate();
// }



// // 時間を取得
// const clock = new THREE.Clock();

// function animate() {
//   // getElapseTime()...ここではanimate関数が呼ばれてからどのくらい時間が経ったかを計測
//   const elapsedTime = clock.getElapsedTime();
//   // console.log(elapsedTime)

//   // オブジェクトを回転させる
//   sphere.rotation.x = elapsedTime;
//   plane.rotation.x = elapsedTime;
//   octahedron.rotation.x = elapsedTime;

//   sphere.rotation.y = elapsedTime;
//   plane.rotation.y = elapsedTime;
//   octahedron.rotation.y = elapsedTime;


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
