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

// The closing invitation: sticky stage driven by scroll progress, shared by every page.
document.querySelectorAll('[data-scroll-climax]').forEach(contactClimax => {
  let contactFrame = 0;
  const editorial = contactClimax.classList.contains('editorial-finale');
  const header = document.querySelector('body > .nav');
  const chapterNav = document.querySelector('.chapter-nav');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const updateContactClimax = () => {
    contactFrame = 0;
    const headerHeight = editorial ? (header?.getBoundingClientRect().height || 0) + (chapterNav?.getBoundingClientRect().height || 0) : 0;
    if (editorial) contactClimax.style.setProperty('--finale-header', `${headerHeight}px`);
    const range = Math.max(1, contactClimax.offsetHeight - (innerHeight - headerHeight));
    const progress = reducedMotion.matches ? 1 : Math.max(0, Math.min(1, (headerHeight - contactClimax.getBoundingClientRect().top) / range));
    contactClimax.style.setProperty('--climax-title-y', `${12 - progress * 22}vh`);
    contactClimax.style.setProperty('--climax-cta-y', `${96 - progress * 96}%`);
    contactClimax.style.setProperty('--climax-copy-opacity', String(.32 + progress * .68));
    contactClimax.style.setProperty('--climax-orbit-x', `${-progress * 8}vw`);
    contactClimax.style.setProperty('--climax-orbit-y', `${progress * 9}vh`);
    contactClimax.style.setProperty('--climax-progress', String(progress));
  };
  const scheduleContactClimax = () => {
    if (!contactFrame) contactFrame = requestAnimationFrame(updateContactClimax);
  };
  addEventListener('scroll', scheduleContactClimax, {passive:true});
  addEventListener('resize', scheduleContactClimax);
  reducedMotion.addEventListener('change', scheduleContactClimax);
  if (editorial && header) new ResizeObserver(scheduleContactClimax).observe(header);
  if (editorial && chapterNav) new ResizeObserver(scheduleContactClimax).observe(chapterNav);
  scheduleContactClimax();
});
