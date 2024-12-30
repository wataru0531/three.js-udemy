
import {
  Scene,
  PerspectiveCamera,
  AmbientLight,
  DirectionalLight,
  HemisphereLight,
  PointLight,
  RectAreaLight,
  SpotLight,
  DirectionalLightHelper,
  HemisphereLightHelper,
  PointLightHelper,
  // RectAreaLightHelper, // モジュールに入っていない
  SpotLightHelper,
  MeshStandardMaterial,
  SphereGeometry,
  BoxGeometry,
  TorusGeometry,
  PlaneGeometry,
  Mesh,
  WebGLRenderer,
  Clock,
  AxesHelper,

} from "./build/three.module.js";

import { OrbitControls } from "./controls/OrbitControls.js";

//UIデバッグ
const gui = new dat.GUI();

//サイズ
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//シーン
const scene = new Scene();

//カメラ
const camera = new PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.x = -2;
camera.position.y = 1;
camera.position.z = 4;
scene.add(camera);

/**************************************************************

光源

****************************************************************/
// アンビエントライト ... シーン全体にあたる。太陽と同じような光源
// → ヘルパーはない
const ambientLight = new AmbientLight(0xffffff, 0.5); // 
// scene.add(ambientLight);

// UIデバック
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);

// 平行光源 ////////////////////////////
// 平行にあたる。デフォルトでは真上からあたる
const directionalLight = new DirectionalLight(0x0fffff, 0.5);
// directionalLight.position.set(1, 0.55, 0);
// scene.add(directionalLight);

const directionalLightHelper = new DirectionalLightHelper(
  directionalLight, // 表示したい光源
  0.3, // 大きさ
);
// scene.add(directionalLightHelper);

// 半球光源 //////////////////////////
// 上半分が第一引数、下半分が第二引数 → ここでは、上半分が水色、下半分が黄色
const hemisphereLight = new HemisphereLight(0x0ffff0, 0xffff00, 1);
hemisphereLight.position.set(1, .55, 0);
// scene.add(hemisphereLight);

const hemisphereLightHelper = new HemisphereLightHelper(hemisphereLight, 0.3);
// scene.add(hemisphereLightHelper);

// ポイントライト... ///////////////////////////////////
// 一点から全方向に放射される。(色, 強さ, 距離, 減衰)。デフォルトでは原点に配置される
const pointLight = new PointLight(0xff4000, 0.4, 10, 2);
// const pointLight = new PointLight(0xffffff, 2, 10, 10); // 白の光
pointLight.position.set(-1, 0, 1.5);
// scene.add(pointLight);

// ポイントライトヘルパー
const pointLightHelper = new PointLightHelper(pointLight, 0.3);
// scene.add(pointLightHelper);


// レクトエリアライト //////////////////////////////////////
// 長方形の平面全体に均一に光を放射する。
// MeshStandartMaterial, MeshPhysicalMaterialにしか使えない。
const rectAreaLight = new RectAreaLight(0x4eff00, 1, 2, 2);
rectAreaLight.position.set(1.5, 0, 1.5);
rectAreaLight.lookAt(0, 0, 0);
scene.add(rectAreaLight);

// RectAreaLightHelperはthreeには入っていないので公式などからソースをダウンロードする。
// const rectAreaLightHelper = new RectAreaLightHelper(
//   rectAreaLight,
// );
// scene.add(rectAreaLightHelper);


// スポットライト...懐中電灯。 /////////////////////////////
const spotLight = new SpotLight(
  0xffffff,
  0.7,            // 強さ
  6,              // 距離、光が届く距離
  Math.PI * 0.1,  // 光の広がる角度。最大はラジアン単位で、Math.PI / 2。
  0.1,            // 光のぼやけ具合
  1               // 減衰。値が大きくなればなるほど見えなくなる
);
spotLight.position.set(0, 2, 3);
spotLight.target.position.x = 1; // スポットライトの向きの変更。シーンにもaddする。
// scene.add(spotLight, spotLight.target);

const spotLightHelper = new SpotLightHelper(
  spotLight, // スポットライトはこれのみでOK
);
scene.add(spotLightHelper);

window.requestAnimationFrame(() => {
  spotLightHelper.update();
})

// x, y, zの軸 /////////////////////////////
const axes = new AxesHelper(20);
scene.add(axes);



// マテリアル..
const material = new MeshStandardMaterial(); // 光源が必要
material.roughness = 0.3;

//オブジェクト
const sphere = new Mesh(new SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

const cube = new Mesh(new BoxGeometry(0.75, 0.75, 0.75), material);

const torus = new Mesh(new TorusGeometry(0.3, 0.2, 32, 64), material);
torus.position.x = 1.5;

const plane = new Mesh(new PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);

// レンダラー
const renderer = new WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// コントロール
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;


// EventListeners
window.addEventListener("DOMContentLoaded", init);

let timerId = null;

window.addEventListener("resize", () => {
  clearTimeout(timerId);

  timerId = setTimeout(() => {
    // console.log("resize done!!");

    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }, 500);
});


// Functions
function init(){
  animate();
}

const clock = new Clock();

const animate = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  cube.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(animate);
};



/**************************************************************
元のコード
***************************************************************/
// import * as THREE from "./build/three.module.js";
// import { OrbitControls } from "./controls/OrbitControls.js";

// //UIデバッグ
// const gui = new dat.GUI();

// //サイズ
// const sizes = {
//   width: window.innerWidth,
//   height: window.innerHeight,
// };

// //シーン
// const scene = new THREE.Scene();

// //カメラ
// const camera = new THREE.PerspectiveCamera(
//   75,
//   sizes.width / sizes.height,
//   0.1,
//   1000
// );
// camera.position.x = -2;
// camera.position.y = 1;
// camera.position.z = 4;
// scene.add(camera);

// /**************************************************************
// ライト
// ****************************************************************/
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// // scene.add(ambientLight);

// // UIデバック
// gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);

// // 平行光源
// const directionalLight = new THREE.DirectionalLight(0x0fffff, 0.5);
// // directionalLight.position.set(1, 0.55, 0);
// scene.add(directionalLight);

// // 上半分が第一引数、下半分が第二引数
// const hemisphereLight = new THREE.HemisphereLight(0x0ffff0, 0xffff00, 1);
// hemisphereLight.position.set(1, 0.55, 0);
// // scene.add(hemisphereLight);

// // ポイントライト...一点から全方向に放射される。(色, 強さ, 距離, 減衰)
// // デフォルトでは原点に配置される
// const pointLight = new THREE.PointLight(0xff4000, 0.4, 10, 2);
// pointLight.position.set(-1, 0, 1.5);
// scene.add(pointLight);

// // レクトエリアライト...長方形の平面全体に均一に光を放射する。
// // MeshStandartMaterial, MeshPhysicalMaterialにしか使えない。
// const rectAreaLight = new THREE.RectAreaLight(0x4eff00, 1, 2, 2);
// rectAreaLight.position.set(1.5, 0, 1.5);
// rectAreaLight.lookAt(0, 0, 0);
// // scene.add(rectAreaLight);

// // スポットライト...懐中電灯。
// const spotLight = new THREE.SpotLight(
//   0xffffff,
//   0.7,
//   6, // 距離、光が届く距離
//   Math.PI * 0.1, // 光の広がる角度。最大はラジアン単位で、Math.PI / 2。
//   0.1, // 光のぼやけ具合
//   1 // 減衰
// );
// spotLight.position.set(0, 2, 3);
// spotLight.target.position.x = 1; // スポットライトの向きの変更。シーンにもaddする。
// scene.add(spotLight, spotLight.target);

// /***********************************************************************
// ヘルパー
// ************************************************************************/
// const directionalLightHelper = new THREE.DirectionalLightHelper(
//   directionalLight, // 表示したい光源
//   0.3, // 大きさ
// );
// scene.add(directionalLightHelper);

// const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.3);
// // scene.add(hemisphereLightHelper);

// const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.3);
// scene.add(pointLightHelper);

// const spotLightHelper = new THREE.SpotLightHelper(
//   spotLight, // スポットライトはこれのみでOK
// );
// scene.add(spotLightHelper);
// window.requestAnimationFrame(() => {
//   spotLightHelper.update();
// })

// // RectAreaLightHelperはthreeには入っていないので公式などからソースをダウンロードする。
// // const rectAreaLightHelper = new RectAreaLightHelper(
// //   rectAreaLight,
// // );
// // scene.add(rectAreaLightHelper);



// //マテリアル..光がないと表現できないマテリアル
// const material = new THREE.MeshStandardMaterial();
// material.roughness = 0.3;

// //オブジェクト
// const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
// sphere.position.x = -1.5;

// const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

// const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 32, 64), material);
// torus.position.x = 1.5;

// const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
// plane.rotation.x = -Math.PI * 0.5;
// plane.position.y = -0.65;

// scene.add(sphere, cube, torus, plane);

// window.addEventListener("resize", () => {
//   sizes.width = window.innerWidth;
//   sizes.height = window.innerHeight;

//   camera.aspect = sizes.width / sizes.height;
//   camera.updateProjectionMatrix();

//   renderer.setSize(sizes.width, sizes.height);
//   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// });

// //レンダラー
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(sizes.width, sizes.height);
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// document.body.appendChild(renderer.domElement);

// //コントロール
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;

// const clock = new THREE.Clock();

// const animate = () => {
//   const elapsedTime = clock.getElapsedTime();

//   // Update objects
//   sphere.rotation.y = 0.1 * elapsedTime;
//   cube.rotation.y = 0.1 * elapsedTime;
//   torus.rotation.y = 0.1 * elapsedTime;

//   sphere.rotation.x = 0.15 * elapsedTime;
//   cube.rotation.x = 0.15 * elapsedTime;
//   torus.rotation.x = 0.15 * elapsedTime;

//   controls.update();

//   renderer.render(scene, camera);

//   window.requestAnimationFrame(animate);
// };

// animate();
