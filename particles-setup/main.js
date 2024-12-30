

import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  TextureLoader,
  BufferGeometry,
  BufferAttribute,
  Mesh,
  PointsMaterial,
  AdditiveBlending,
  Points,
  Clock,
  SphereGeometry,
  MeshNormalMaterial,
  AxesHelper,

} from "./build/three.module.js";
import { OrbitControls } from "./controls/OrbitControls.js";
import GUI from "https://cdn.jsdelivr.net/npm/lil-gui@0.15/+esm";

//UIデバッグ
const gui = new GUI();

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
camera.position.set(1, 1, 15);

//レンダラー
const renderer = new WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// BufferGeometry...メモリの効率化に良い
// → position頂点を格納する
const particlesGeometry = new BufferGeometry(1, 100, 100);

// パーティクルの数
const count = 100;

// 頂点、色の座標を作り、それぞれに浮動小数を格納
const positionArray = new Float32Array(count * 3);
const colorArray = new Float32Array(count * 3);

for(let i = 0; i < count * 3; i++){
  positionArray[i] = (Math.random() -0.5) * 10; // -5 〜 5の範囲
  colorArray[i] = Math.random(); // 0 〜 1未満の範囲
};


// BufferGeometryに頂点のデータを格納する
// → 基本的にジオメトリは頂点データを決定づける
// 3 → itemSize。x, y, z軸があるのでそれぞれに当てはめて1つの頂点とする。
particlesGeometry.setAttribute('position', new BufferAttribute(positionArray, 3));
// console.log(particlesGeometry)

// BufferGeometryに色のデータを格納
particlesGeometry.setAttribute('color',new BufferAttribute(colorArray, 3));

// テクスチャ
const particlesTexture = loadTex('./textures/particles/1.png');

// マテリアル
const pointsMaterial = new PointsMaterial({
  size: 0.15,
  sizeAttenuation: true, // デフォルトでtrue。
  alphaMap: particlesTexture, // transparentもtrueにする必要がある。
  transparent: true,
  // alphaTest: 0.001, // パーティクルの画像のエッジを見えなくする。
  // depthTest: false, // 深度のテストが行われなくなる。深さを関係なくする。
  depthWrite: false, // 奥行きをなくす。
  // color: "green",
  vertexColors: true, // 頂点座標の色を設定。カラフルに設置する。
  blending: AdditiveBlending, // 物体やパーティクル同士とが重なったら光る。
});
// pointsMaterial.map = particlesTexture;


// メッシュ
// Points...パーティクル専用のメッシュ。
const particles = new Points(particlesGeometry, pointsMaterial);

scene.add(particles);


const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // 慣性


// console.log(particleGeometry)

// ヘルパー
const axes = new AxesHelper(20);
scene.add(axes);


// EventListeners
window.addEventListener("DOMContentLoaded", init);

let timerId = null;
window.addEventListener("resize", () => {
  clearTimeout(timerId);

  timerId = setTimeout(() => {
    onWindowResize();
  }, 500);
});


// Functions
function loadTex(_url){
  const textureLoader = new TextureLoader();
  const texture = textureLoader.load(_url);

  return texture;
}

function init(){
  animate();

}

const clock = new Clock();


// console.log(particlesGeometry.attributes.position)
function animate() {
  const elapsedTime = clock.getElapsedTime();

  controls.update();

  // particlesGeometryの頂点1つ１つに動きをつける
  // → fot文は逆ループさせる
  for(let i = count -1; i >= 0; i--){
    // let i = count - 1 ... 初期化部分。配列の最後のインデックス
    // i >= 0 ... 継続条件。iが0以上である限りループを計測
    // i-- ... iの値をマイナスしていく

    // console.log(i)
    const i3 = i * 3;
    // console.log(i3) // 3の倍数の数値

    // y座標 ... i3 + 1 と表す
    // particlesGeometry.attributes.position.array[i3 + 1] = 0; 
    
    // x座標を変更しばらつきを加える ... i3 + 0 と表せる
    const x = particlesGeometry.attributes.position.array[i3 + 0];
    // console.log(x)

    // 3の倍数の値の次の値をアニメーションさせる
    // sin() ... -1 〜 1 の値を返す。波のような動き
    particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x); 
  };

  // 注意...particlesGeometryの位置座標をアニメーションで動かしたい場合、needsUpdateをtrueにする。
  particlesGeometry.attributes.position.needsUpdate = true;

  //レンダリング
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

//ブラウザのリサイズに対応
function onWindowResize() {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
};


/**************************************************************
元のコード
***************************************************************/
// import * as THREE from "./build/three.module.js";
// import { OrbitControls } from "./controls/OrbitControls.js";
// import GUI from "https://cdn.jsdelivr.net/npm/lil-gui@0.15/+esm";

// //UIデバッグ
// const gui = new GUI();

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
//   100
// );
// camera.position.set(1, 1, 15);

// //レンダラー
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(sizes.width, sizes.height);
// renderer.setPixelRatio(window.devicePixelRatio);
// document.body.appendChild(renderer.domElement);

// /************************************************************
// テクスチャ設定...画像などを設定する
// ***************************************************************/
// const textureLoader = new THREE.TextureLoader();
// const particlesTexture = textureLoader.load('./textures/particles/1.png');

// /****************************************************************
// パーティクルを作ってみよう
// ******************************************************************/
// // ジオメトリ
// // BufferGeometry...メモリの効率化に良い
// const particlesGeometry = new THREE.BufferGeometry(1, 100, 100);

// // パーティクルの数
// const count = 100;

// // 3...座標の数がZ、Y、Zの3つのため。
// const positionArray = new Float32Array(count * 3);

// // 色の座標
// const colorArray = new Float32Array(count * 3);

// for(let i = 0; i < count * 3; i++){
//   positionArray[i] = (Math.random() -0.5) * 10;
//   colorArray[i] = Math.random();
// };

// // BufferGeometryに関連づけられた属性のデータを格納する。ここではパーティクルの数、頂点の数
// const bufferAttribute = new THREE.BufferAttribute(positionArray, 3);
// // console.log(bufferAttribute);

// // BufferGeometryに位置の属性を付与
// particlesGeometry.setAttribute(
//   'position',
//   bufferAttribute,
// );

// // BufferGeometryに色の属性を付与
// particlesGeometry.setAttribute(
//   'color',
//   new THREE.BufferAttribute(colorArray, 3),
// );

// // 球
// const cube = new THREE.Mesh(
//   new THREE.SphereGeometry(0.5, 16, 32),
//   new THREE.MeshNormalMaterial(),
// );

// // マテリアル
// const pointsMaterial = new THREE.PointsMaterial({
//   size: 0.15,
//   sizeAttenuation: true, // デフォルトでtrue。
//   alphaMap: particlesTexture, // transparentもtrueにする必要がある。
//   transparent: true,
//   // alphaTest: 0.001, // パーティクルの画像のエッジを見えなくする。
//   // depthTest: false, // 深度のテストが行われなくなる。深さを関係なくする。
//   depthWrite: false, // 奥行きをなくす。
//   // color: "green",
//   vertexColors: true, // 頂点座標の色を設定。カラフルに設置する。
//   blending: THREE.AdditiveBlending, // 物体やパーティクル同士とが重なったら光る。
// });
// // pointsMaterial.map = particlesTexture;


// // メッシュ化
// // Points...パーティクル専用のメッシュ。
// const particles = new THREE.Points(particlesGeometry, pointsMaterial);

// scene.add(particles);


// // マウス操作
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true; // 慣性

// window.addEventListener("resize", onWindowResize);

// // console.log(particleGeometry)

// const clock = new THREE.Clock();

// function animate() {
//   const elapsedTime = clock.getElapsedTime();

//   controls.update();

//   // パーティクルにアニメーションをつける
//   for(let i = 0; i < count; i++){
//     const i3 = i * 3;

//     // すべての頂点のY座標を0にする。
//     // particlesGeometry.attributes.position.array[i3 + 1] = 0; 

//     // X座標
//     const x = particlesGeometry.attributes.position.array[i3 + 0];

//     // sin()...波のように表現できる。
//     particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x); 
//   };

//   // 注意...particlesGeometryの位置座標をアニメーションで動かしたい場合、needsUpdateをtrueにする。
//   particlesGeometry.attributes.position.needsUpdate = true;

//   //レンダリング
//   renderer.render(scene, camera);
//   requestAnimationFrame(animate);
// };

// //ブラウザのリサイズに対応
// function onWindowResize() {
//   renderer.setSize(sizes.width, sizes.height);
//   camera.aspect = sizes.width / sizes.height;
//   camera.updateProjectionMatrix();
// };

// animate();
