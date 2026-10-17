import {SHAPES_2D,SHAPES_3D,validHex,clampSize,polygonPoints,studioFileName} from './shape-utils.js';
const el=id=>document.getElementById(id), stage=el('stage'), canvas=el('canvas-2d'), ctx=canvas.getContext('2d'), canvas3d=el('canvas-3d');
const shape=el('shape'),color=el('color'),size=el('size'),status=el('status'),rotating=el('rotate');
let mode='2d', three=null, sketching=false, currentStroke=null, strokes=[];
const DARK='#1a2534';
function drawPolygon(points){ctx.beginPath();points.forEach(({x,y},i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fill();ctx.stroke();}
function drawHeart(x,y,r){ctx.beginPath();ctx.moveTo(x,y+r*.8);ctx.bezierCurveTo(x-r*2,y-r*.4,x-r*.8,y-r*1.5,x,y-r*.5);ctx.bezierCurveTo(x+r*.8,y-r*1.5,x+r*2,y-r*.4,x,y+r*.8);ctx.fill();ctx.stroke();}
function render2D(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle=color.value;ctx.strokeStyle=DARK;ctx.lineWidth=3;ctx.lineJoin='round';
  const x=canvas.width/2,y=canvas.height/2,r=clampSize(size.value)*1.7;
  if(mode==='sketch'){for(const stroke of strokes){if(!stroke.points.length)continue;ctx.strokeStyle=stroke.color;ctx.lineWidth=stroke.width;ctx.lineCap='round';ctx.beginPath();stroke.points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));if(stroke.points.length===1){const p=stroke.points[0];ctx.lineTo(p.x+.01,p.y+.01)}ctx.stroke()}return;}
  switch(shape.value){
    case 'circle':ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.stroke();break;
    case 'square':ctx.fillRect(x-r,y-r,r*2,r*2);ctx.strokeRect(x-r,y-r,r*2,r*2);break;
    case 'rectangle':ctx.fillRect(x-r*1.25,y-r*.7,r*2.5,r*1.4);ctx.strokeRect(x-r*1.25,y-r*.7,r*2.5,r*1.4);break;
    case 'triangle':drawPolygon(polygonPoints(3,r,x,y));break;
    case 'pentagon':drawPolygon(polygonPoints(5,r,x,y));break;
    case 'hexagon':drawPolygon(polygonPoints(6,r,x,y));break;
    case 'star':{const pts=[];for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2, rr=i%2?r*.45:r;pts.push({x:x+Math.cos(a)*rr,y:y+Math.sin(a)*rr});}drawPolygon(pts);break;}
    case 'heart':drawHeart(x,y,r);break;
  }
}
function setShapes(){
  const items=mode==='3d'?SHAPES_3D:SHAPES_2D;
  shape.replaceChildren(...items.map(name=>{const opt=document.createElement('option');opt.value=name;opt.textContent=name[0].toUpperCase()+name.slice(1);return opt}));
}
function pointFromEvent(e){const box=canvas.getBoundingClientRect();return{x:(e.clientX-box.left)*canvas.width/box.width,y:(e.clientY-box.top)*canvas.height/box.height};}
canvas.addEventListener('pointerdown',e=>{if(mode!=='sketch')return;sketching=true;currentStroke={color:color.value,width:clampSize(size.value)/9+2,points:[pointFromEvent(e)]};strokes.push(currentStroke);canvas.setPointerCapture(e.pointerId);render2D()});
canvas.addEventListener('pointermove',e=>{if(!sketching||mode!=='sketch')return;currentStroke.points.push(pointFromEvent(e));render2D()});
function stopSketch(){sketching=false;currentStroke=null}canvas.addEventListener('pointerup',stopSketch);canvas.addEventListener('pointercancel',stopSketch);
async function ensure3D(){
 if(three)return true;
 try{
  const THREE=await import('three');
  const renderer=new THREE.WebGLRenderer({canvas:canvas3d,antialias:true,preserveDrawingBuffer:true,alpha:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));renderer.setSize(900,630,false);
  const scene=new THREE.Scene();scene.background=new THREE.Color('#f9f9fc');
  const camera=new THREE.PerspectiveCamera(42,900/630,.1,1000);camera.position.set(0,0,8);
  scene.add(new THREE.AmbientLight(0xffffff,1.5));const light=new THREE.DirectionalLight(0xffffff,2.6);light.position.set(3,5,6);scene.add(light);
  three={THREE,renderer,scene,camera,mesh:null};draw3D();let last=0;
  function frame(time){if(!three)return;const t=three;if(mode==='3d'&&t.mesh&&rotating.checked&&time-last<1000){t.mesh.rotation.y+=.008;t.mesh.rotation.x+=.002;}last=time;t.renderer.render(t.scene,t.camera);requestAnimationFrame(frame)}
  requestAnimationFrame(frame);return true;
 }catch(error){el('stage-error').textContent='3D preview is unavailable. Check your browser WebGL support and internet connection (Three.js loads from a CDN).';el('stage-error').classList.remove('hidden');status.textContent='Unable to load 3D preview.';console.error('3D initialization:',error);return false}
}
function draw3D(){if(!three)return;const{THREE,scene}=three;if(three.mesh){scene.remove(three.mesh);three.mesh.geometry.dispose();three.mesh.material.dispose();three.mesh=null}
 const d=clampSize(size.value)/53;
 const geo={
 sphere:()=>new THREE.SphereGeometry(d,40,26),cube:()=>new THREE.BoxGeometry(d*1.8,d*1.8,d*1.8),cone:()=>new THREE.ConeGeometry(d,d*2.4,42),cylinder:()=>new THREE.CylinderGeometry(d,d,d*2,42),torus:()=>new THREE.TorusGeometry(d*.85,d*.32,22,70),icosahedron:()=>new THREE.IcosahedronGeometry(d,0)
 }[shape.value];
 if(!geo)return;
 const mesh=new THREE.Mesh(geo(),new THREE.MeshStandardMaterial({color:new THREE.Color(color.value),metalness:.1,roughness:.33,side:THREE.DoubleSide}));scene.add(mesh);three.mesh=mesh;
}
async function setMode(next){mode=next;document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));el('mode-label').textContent=mode==='3d'?'3D WebGL':mode==='sketch'?'Freehand Canvas':'2D Canvas';canvas.classList.toggle('hidden',mode==='3d');canvas3d.classList.toggle('hidden',mode!=='3d');shape.parentElement.classList.toggle('hidden',mode==='sketch');rotating.closest('label').classList.toggle('hidden',mode!=='3d');el('size-label').textContent=mode==='sketch'?'Brush size':'Shape size';setShapes();el('stage-error').classList.add('hidden');status.textContent=mode==='sketch'?'Draw with your mouse, touch, or stylus.':mode==='3d'?'Drag rotation is automatic; customize shape and color.':'Customize your 2D shape.';if(mode==='3d')await ensure3D();else render2D()}
document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode)));
function update(){el('size-value').value=size.value;el('color-label').value=color.value.toUpperCase();if(!validHex(color.value))return;if(mode==='3d')draw3D();else render2D()}
for(const input of [shape,color,size])input.addEventListener('input',update);
el('reset').addEventListener('click',()=>{strokes=[];color.value='#7357ef';size.value='75';setShapes();update();status.textContent='Canvas reset.'});
el('save').addEventListener('click',()=>{try{if(mode==='3d'&&!three?.renderer){status.textContent='3D preview is not ready.';return}const src=mode==='3d'?canvas3d:canvas;src.toBlob(blob=>{if(!blob){status.textContent='Could not export PNG.';return}const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=studioFileName(mode);a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent='PNG download prepared.'},'image/png')}catch(error){status.textContent='PNG export failed.';console.error(error)}});
setMode('2d');update();
