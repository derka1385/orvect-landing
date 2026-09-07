// Shared page navigation and product interactions. All destinations also work without JS.
if(!document.querySelector('.blueprint-sequence')){
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('in-view',e.isIntersecting)),{threshold:.1});
 document.querySelectorAll('.principles article,.engine-list article,.vision-heading,.founder-grid').forEach(el=>{el.classList.add('reveal');observer.observe(el)});
 document.documentElement.classList.add('motion-ready');
}
const frame=document.querySelector('.product-frame');
if(frame){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let pending=false;
 const update=()=>{pending=false;const angle=reduced.matches?0:Math.max(0,Math.min(9,frame.getBoundingClientRect().top/innerHeight*9));frame.style.setProperty('--screen-tilt',`${angle}deg`)};
 const schedule=()=>{if(!pending){pending=true;requestAnimationFrame(update)}};
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);reduced.addEventListener('change',schedule);schedule();
 document.querySelectorAll('[data-preview]').forEach(button=>button.addEventListener('click',()=>{
  const collection=button.dataset.preview==='collection';
  document.querySelector('#product-preview').src=`v1/assets/${collection?'collection':'program'}-current.png`;
  document.querySelector('.product-open').href=`https://derka1385.github.io/ORVECT_Program/${collection?'collecte/':''}`;
  document.querySelectorAll('[data-preview]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 }));
}
