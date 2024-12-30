import {
  Scene,
  TextureLoader,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  TorusGeometry,
  MeshBasicMaterial,
  MeshNormalMaterial,
  Mesh,
  AxesHelper,

} from "./build/three.module.js";

import { lerp } from "./utils.js";

const canvas = document.getElementById('js-canvas');

const scene = new Scene();

// 背景用のテクスチャ
scene.background = loadTex('./bg/bg.avif');

// テクスチャを返す関数
function loadTex(_url){
  const textureLoader = new TextureLoader();
  const bgText = textureLoader.load(_url);

  return bgText;
}

// ウインドウサイズ
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// カメラ
const camera = new PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);

// レンダラー
const renderer = new WebGLRenderer({
  canvas: canvas, // HTMLのcanvasタグに挿入
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);

// 矩形
const boxGeometry = new BoxGeometry(5, 5, 5, 10);

// MeshNormalMaterial
// → ノーマルのカラーをRGBで可視化するマテリアル
const boxMaterial = new MeshNormalMaterial();
const box = new Mesh(boxGeometry, boxMaterial);

// 光源を必要としないmaterial
// → MeshBasicMaterial、SpriteMaterial、RawShaderMaterial、ShaderMaterial

// デフォルトではカメラの位置とオブジェクトの位置が同じなのでZ軸方向に
box.position.set(0, 0.5, -15);
box.rotation.set(1, 1, 0);

scene.add(box);

// ドーナッツ
const torusGeometry = new TorusGeometry(8, 2, 16, 100);
const torusMaterial = new MeshNormalMaterial();
const torus = new Mesh(torusGeometry, torusMaterial);

torus.position.set(0, 1, 10);
scene.add(torus);

// へルパー
const axes = new AxesHelper(20);
scene.add(axes);


// アニメーションの配列
const animationScripts = [];

// ブラウザのスクロール率を取得
// (スクロール量 / (スクロールできる全体の高さ - ブラウザの高さ)) * 100
let scrollPercent = 0;
window.addEventListener("scroll", () => {
  scrollPercent = 
    (document.documentElement.scrollTop / 
    (document.documentElement.scrollHeight - document.documentElement.clientHeight)) * 100;
  
  scrollPercent = Math.min(scrollPercent, 100); // スクロール率が100を超えないようにする

  // console.log(scrollPercent);
  // console.log(document.documentElement.scrollTop);
  // console.log(document.documentElement.scrollHeight);
  // console.log(document.documentElement.clientHeight);
  // document → html、ルート要素を表している
});

// スクロール率に応じて、startからendまでのどの位置にいるか、0〜1の少数を返す
function getScrollRatio(start, end){
  return (scrollPercent - start) / (end - start);
};

// 0〜40%でのスクロールアニメーション
animationScripts.push({
  start: 0,
  end: 40,
  function(){
    camera.lookAt(box.position);
    camera.position.set(0, 1, 10);
    box.position.z = lerp(-15, 2, getScrollRatio(this.start, this.end)); // 0, 40
    // console.log(box.position.z)
    torus.position.z = lerp(10, -20, getScrollRatio(this.start, this.end)); // 0, 40
    // console.log(torus.position.z);
  }
});

// 40%〜60%までのアニメーション
animationScripts.push({
  start: 40,
  end: 60,
  function(){
    camera.lookAt(box.position);
    camera.position.set(0, 1, 10);
    // Math.PI...π。ラジアン単位でπは180°。
    box.rotation.z = lerp(1, Math.PI, getScrollRatio(this.start, this.end));
  }
});

// 60〜80までのアニメーション
animationScripts.push({
  start: 60,
  end: 80,
  function(){
    // console.log("60 〜 80")
    camera.lookAt(box.position);
    camera.position.x = lerp(0, -15, getScrollRatio(this.start, this.end));
    camera.position.y = lerp(1, 15, getScrollRatio(this.start, this.end));
    camera.position.z = lerp(10, 25, getScrollRatio(this.start, this.end));
  }
});

// 80%〜100%までのアニメーション
animationScripts.push({
  start: 80,
  end: 100,
  function(){
    camera.lookAt(box.position);
    box.rotation.x += 0.02;
    box.rotation.y += 0.02;
  }
})

// アニメーションを開始するための関数
function playScrollAnimation(){
  animationScripts.forEach((animation) => {

    // スクロール率が各オブジェクトで指定したstartとendの範囲でないと発火しないようにする
    if(scrollPercent >= animation.start && scrollPercent <= animation.end){
      animation.function(); // ここでアニメーションさせる
    }
  });
};


// EventListeners
window.addEventListener("DOMContentLoaded", init);

// リサイズ
let timerId = null;
window.addEventListener('resize', () => {
  clearTimeout(timerId);

  timerId = setTimeout(() => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix(); // 変更を加えたらかならず呼び出す必要がある。

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(window.devicePixelRatio);
  }, 500);
});


// Functions
function init(){
  render();
}

const render = () => {
  // アニメーションを実行。
  playScrollAnimation();

  renderer.render(scene, camera);
  
  // フレームの更新のたびにrender関数を呼ぶ
  requestAnimationFrame(render);
};


/**************************************************************
元のコード
***************************************************************/
// import {
//   Scene,
//   TextureLoader,
//   PerspectiveCamera,
//   WebGLRenderer,
//   BoxGeometry,
//   TorusGeometry,
//   MeshNormalMaterial,
//   Mesh,

// } from "./build/three.module.js";

// const canvas = document.getElementById('js-canvas');

// const scene = new Scene();

// // 背景用のテクスチャ
// const textureLoader = new TextureLoader();
// const bgTexture = textureLoader.load('./bg/bg.avif');
// scene.background = bgTexture;

// // テクスチャを返す関数
// function loadTex(_url){
//   const textureLoader = new TextureLoader();
//   const bgText = textureLoader.load(_url);

//   return bgText;
// }

// // ウインドウサイズ
// const sizes = {
//   width: window.innerWidth,
//   height: window.innerHeight,
// };


// // カメラ
// const camera = new PerspectiveCamera(
//   75,
//   sizes.width / sizes.height,
//   0.1,
//   1000
// );

// // camera.position.z = 10;


// // レンダラー
// const renderer = new WebGLRenderer({
//   canvas: canvas, // HTMLのcanvasタグに挿入
// });

// renderer.setSize(sizes.width, sizes.height);
// renderer.setPixelRatio(window.devicePixelRatio);


// // オブジェクトを作成
// // ボックスジオメトリ
// const boxGeometry = new BoxGeometry(5, 5, 5, 10);
// const boxMaterial = new MeshNormalMaterial();
// const box = new Mesh(boxGeometry, boxMaterial);

// // デフォルトではカメラの位置とオブジェクトの位置が同じなのでZ軸方向に
// box.position.set(0, 0.5, -15);
// box.rotation.set(1, 1, 0);

// scene.add(box);

// // ドーナッツジオメトリ
// const torusGeometry = new TorusGeometry(8, 2, 16, 100);
// const torusMaterial = new MeshNormalMaterial();
// const torus = new Mesh(torusGeometry, torusMaterial);

// torus.position.set(0, 1, 10);
// scene.add(torus);


// // 線形補間...滑らかに移動させる公式。ここでは一次線形補間。
// // lerp(x, y, a)
// // x...スタート地点
// // y...エンド地点
// // a...滑らかに動く度合い。割合。パラパラ漫画。一時関数の直線のようなもの。

// function lerp(x, y, a){
//   return (1 - a) * x + a * y;
// };

// // スクロール率に応じて各区間のどの位置にいるかの割合を算出する。
// // startからendまでの間でいまどこにいるのかの割合を取得する関数。
// function scalePercent(start, end){
//   return (scrollPercent - start) / (end - start);
// };


// // スクロールアニメーション
// // アニメーションの配列
// const animationScripts = [];

// // 0〜40%でのスクロールアニメーション
// animationScripts.push({
//   start: 0,
//   end: 40,
//   function(){
//     camera.lookAt(box.position);
//     camera.position.set(0, 1, 10);
//     // 線形補間、lerp関数でZ軸の値を決める。
//     box.position.z = lerp(-15, 2, scalePercent(0, 40));
//     torus.position.z = lerp(10, -20, scalePercent(0, 40));
//   }
// });

// // 40%〜60%までのアニメーション
// animationScripts.push({
//   start: 40,
//   end: 60,
//   function(){
//     camera.lookAt(box.position);
//     camera.position.set(0, 1, 10);
//     // Math.PI...π。ラジアン単位でπは180°。
//     box.rotation.z = lerp(1, Math.PI, scalePercent(40, 60));
//   }
// });

// // 60〜80までのアニメーション
// animationScripts.push({
//   start: 60,
//   end: 80,
//   function(){
//     camera.lookAt(box.position);
//     camera.position.x = lerp(0, -15, scalePercent(60, 80));
//     camera.position.y = lerp(1, 15, scalePercent(60, 80));
//     camera.position.z = lerp(10, 25, scalePercent(60, 80));
//   }
// });

// // 80%〜100%までのアニメーション
// animationScripts.push({
//   start: 80,
//   end: 100,
//   function(){
//     camera.lookAt(box.position);
//     box.rotation.x += 0.02;
//     box.rotation.y += 0.02;
//   }
// })

// // ブラウザのスクロール率を取得
// // (スクロール量 / (スクロールできる全体の高さ - ブラウザの高さ)) * 100
// let scrollPercent = 0;

// document.body.onscroll = () => {
//   scrollPercent = 
//     (document.documentElement.scrollTop / 
//       (document.documentElement.scrollHeight - document.documentElement.clientHeight)) * 100;

//   // console.log(scrollPercent);
// };

// // アニメーションを開始するための関数
// function playScrollAnimation(){
//   animationScripts.forEach((animation) => {
    
//     if(scrollPercent >= animation.start && scrollPercent <= animation.end){
//       animation.function();
//     }
//     // 配列からアニメーションをひとつづつ取り出してアニメーションさせる。

//   });
// };


// // アニメーション
// // renderの中はフレームの更新ごとに実行される
// const render = () => {
//   // console.log("requestAnimationFrame running!");

//   // フレームの更新のたびにrender関数を呼ぶ
//   window.requestAnimationFrame(render);

//   // アニメーションを実行。
//   playScrollAnimation();

//   renderer.render(scene, camera);
// };

// render();

// // render関数の外でも使える
// // requestAnimationFrame(render);


// // ブラウザのリサイズ操作
// window.addEventListener('resize', () => {
//   sizes.width = window.innerWidth;
//   sizes.height = window.innerHeight;

//   camera.aspect = sizes.width / sizes.height;
//   camera.updateProjectionMatrix(); // 変更を加えたらかならず呼び出す必要がある。

//   renderer.setSize(sizes.width, sizes.height);
//   renderer.setPixelRatio(window.devicePixelRatio);
// });
