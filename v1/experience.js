const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const section = document.querySelector('.blueprint-sequence');
const canvas = document.querySelector('.vehicle-canvas');
const ctx = canvas.getContext('2d');
const toggle = document.querySelector('.experience-toggle');
let paused = false, visible = true, raf = 0, width = 0, height = 0, progress = 0;
const clamp = n => Math.max(0, Math.min(1, n));

// A projected wireframe concept, built from body cross-sections and mechanical layers.
const paths = [];
const add = (points, color = 'body', layer = 0) => paths.push({points, color, layer});
const slices = [[-3.2,.64,.36],[-2.9,.94,.65],[-1.7,1,.72],[-.85,.88,1.52],[.75,.87,1.53],[1.75,1,.77],[2.8,.94,.65],[3.15,.72,.39]];
const rings = slices.map(([x,w,h]) => [[x,.18,-w*.8],[x,.4,-w],[x,h,-w*.87],[x,h,w*.87],[x,.4,w],[x,.18,w*.8]]);
for(const ring of rings)add([...ring,ring[0]]);
for(let j=0;j<6;j++)add(rings.map(r=>r[j]));
// Glass, door seams, grille and lamps.
for(const side of [-1,1]){
 add([[-1.6,.78,side*.95],[-.72,1.39,side*.8],[.65,1.4,side*.8],[1.5,.83,side*.95],[-1.6,.78,side*.95]]);
 add([[0,.2,side],[0,1.45,side*.85]]);
 for(const x of [-2.82,2.75])add([[x,.56,side*.55],[x,.56,side*.88]],'accent');
}
// Chassis and wheels remain grounded as the body separates.
add([[-2.7,.05,-.75],[2.7,.05,-.75],[2.7,.05,.75],[-2.7,.05,.75],[-2.7,.05,-.75]],'muted',1);
for(const x of [-2.05,2.02]){
 add([[x,.07,-1.08],[x,.07,1.08]],'accent',1);
 for(const side of [-1,1]){
  for(const z of [side*.88,side*1.15]){
   const circle=Array.from({length:41},(_,i)=>{const a=i/40*Math.PI*2;return[x+Math.cos(a)*.48,.13+Math.sin(a)*.48,z]});add(circle,'body',1);
  }
  for(let i=0;i<8;i++){const a=i*Math.PI/4;add([[x,.13,side*1.16],[x+Math.cos(a)*.34,.13+Math.sin(a)*.34,side*1.16]],'muted',1);}
 }
}
const cube=(x,y,z,w,h,d)=>{
 const p=[[-w,-h,-d],[w,-h,-d],[w,-h,d],[-w,-h,d],[-w,h,-d],[w,h,-d],[w,h,d],[-w,h,d]].map(([a,b,c])=>[a+x,b+y,c+z]);
 for(const [a,b] of [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]])add([p[a],p[b]],'accent',2);
};
cube(-1.8,.4,0,.45,.25,.5);cube(.65,.1,0,.75,.06,.55);
add([[-1.8,.4,0],[-.5,.4,0],[-.5,.4,.5],[1.5,.4,.5]],'accent',2);

function resize(){
 const r=canvas.getBoundingClientRect();width=r.width;height=r.height;
 const dpr=Math.min(devicePixelRatio,1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx?.setTransform(dpr,0,0,dpr,0,0);
 render();
}
function render(){
 if(!ctx)return;
 const mobile=width<761, angle=-.43+progress*1.15, pitch=.37+progress*.12;
 const scale=Math.min(width*(mobile?.128:.085),height*.16), cx=width*(mobile?.51:.67), cy=height*(mobile?.68:.56);
 const project=([x,y,z],layer=1)=>{
  y+=(layer===0?progress*.85:layer===2?progress*.3:0);
  const a=x*Math.cos(angle)+z*Math.sin(angle),b=-x*Math.sin(angle)+z*Math.cos(angle);
  const yy=y*Math.cos(pitch)-b*Math.sin(pitch),zz=y*Math.sin(pitch)+b*Math.cos(pitch);
  const perspective=10/(10+zz);
  return[cx+a*scale*perspective,cy-yy*scale*perspective];
 };
 const draw=(points,color,layer=1)=>{ctx.beginPath();points.forEach((p,i)=>{const [x,y]=project(p,layer);i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.strokeStyle=color;ctx.stroke();};
 ctx.clearRect(0,0,width,height);ctx.lineWidth=1;
 for(let x=-5;x<=5;x++)draw([[x,-.46,-3],[x,-.46,3]],'#ffffff0c');
 for(let z=-3;z<=3;z++)draw([[-5,-.46,z],[5,-.46,z]],'#ffffff0c');
 for(const p of paths)draw(p.points,p.color==='accent'?'#ff5c28':p.color==='muted'?'#707a8270':'#bec6ca9c',p.layer);
 // A scan plane tracks the scroll position through the body.
 const scan=-3.2+6.4*progress;
 draw([[scan,-.35,-1.45],[scan,2.2,-1.45],[scan,2.2,1.45],[scan,-.35,1.45],[scan,-.35,-1.45]],'#ff5c2866');
 for(const p of [[-1.8,.4,0],[.65,.1,0],[2,.13,1.15]]){const[x,y]=project(p,2);ctx.fillStyle='#ff5c28';ctx.beginPath();ctx.arc(x,y,3,0,Math.PI*2);ctx.fill();}
}
function update(){
 raf=0;if(paused||reduced.matches)return;
 const rect=section.getBoundingClientRect();progress=clamp(-rect.top/Math.max(1,section.offsetHeight-innerHeight));
 section.style.setProperty('--sequence-progress',progress);
 section.style.setProperty('--word-turn',`${progress*-8}deg`);
 document.querySelector('.hero').style.setProperty('--hero-tilt',`${Math.min(scrollY/80,10)}deg`);
 const frame=document.querySelector('.product-frame'), fr=frame.getBoundingClientRect();
 frame.style.setProperty('--screen-tilt',`${Math.max(0,Math.min(9,(fr.top/innerHeight)*9))}deg`);
 if(visible)render();
}
const schedule=()=>{if(!raf)raf=requestAnimationFrame(update)};
window.addEventListener('scroll',schedule,{passive:true});
new ResizeObserver(resize).observe(canvas);
new IntersectionObserver(([e])=>{visible=e.isIntersecting;if(visible)schedule()}).observe(section);

const wave=document.querySelector('.voice-wave');
for(let i=0;i<105;i++){
 const bar=document.createElement('i'),envelope=Math.exp(-Math.pow((i-52)/32,2));
 bar.style.cssText=`--bar-height:${12+envelope*(55+Math.abs(Math.sin(i*.71))*100)}px;--bar-opacity:${.25+envelope*.75};--bar-duration:${.6+(i%9)*.13}s;--bar-delay:-${i*.17}s`;
 wave.append(bar);
}
const reveals=document.querySelectorAll('.signal-experience,.principles article,.engine-list article,.vision-heading,.founder-grid');
const observer=new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('in-view',e.isIntersecting)),{threshold:.1});
reveals.forEach(el=>{el.classList.add('reveal');observer.observe(el)});
document.documentElement.classList.add('motion-ready');
toggle.addEventListener('click',()=>{paused=!paused;toggle.setAttribute('aria-pressed',String(paused));document.documentElement.classList.toggle('motion-paused',paused);toggleText();if(!paused)schedule()});
function toggleText(){const l=document.documentElement.lang;toggle.textContent=({fr:['Suspendre les effets','Reprendre les effets'],en:['Pause effects','Resume effects'],sv:['Pausa effekter','Återuppta effekter']}[l]||['Pause effects','Resume effects'])[Number(paused)]}
new MutationObserver(toggleText).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});toggleText();
reduced.addEventListener('change',()=>{if(reduced.matches){progress=.3;render()}else schedule()});
if(reduced.matches)progress=.3;
document.querySelectorAll('[data-preview]').forEach(button=>button.addEventListener('click',()=>{
 const collection=button.dataset.preview==='collection';
 document.querySelector('#product-preview').src=`v1/assets/${collection?'collection':'program'}-current.png`;
 document.querySelector('.product-open').href=`https://derka1385.github.io/ORVECT_Program/${collection?'collecte/':''}`;
 document.querySelectorAll('[data-preview]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
}));
resize();schedule();
