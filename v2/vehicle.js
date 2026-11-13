// V2 home: the wireframe vehicle from v1, rebuilt from cross-sections. On scroll it turns and its layers separate:
// the body lifts, the mechanical parts float between, the chassis stays grounded. Eased towards the scroll, paused off-screen.
const section = document.querySelector('[data-vehicle]');
if (section) {
  const canvas = section.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = n => Math.max(0, Math.min(1, n));
  let width = 0, height = 0, target = 0, current = 0, raf = 0, visible = false;

  const paths = [];
  const add = (points, color = 'body', layer = 0) => paths.push({points, color, layer});
  const slices = [[-3.2,.64,.36],[-2.9,.94,.65],[-1.7,1,.72],[-.85,.88,1.52],[.75,.87,1.53],[1.75,1,.77],[2.8,.94,.65],[3.15,.72,.39]];
  const rings = slices.map(([x, w, h]) => [[x,.18,-w*.8],[x,.4,-w],[x,h,-w*.87],[x,h,w*.87],[x,.4,w],[x,.18,w*.8]]);
  for (const ring of rings) add([...ring, ring[0]]);
  for (let j = 0; j < 6; j++) add(rings.map(r => r[j]));
  for (const side of [-1, 1]) {
    add([[-1.6,.78,side*.95],[-.72,1.39,side*.8],[.65,1.4,side*.8],[1.5,.83,side*.95],[-1.6,.78,side*.95]]);
    add([[0,.2,side],[0,1.45,side*.85]]);
    for (const x of [-2.82, 2.75]) add([[x,.56,side*.55],[x,.56,side*.88]], 'accent');
  }
  add([[-2.7,.05,-.75],[2.7,.05,-.75],[2.7,.05,.75],[-2.7,.05,.75],[-2.7,.05,-.75]], 'muted', 1);
  for (const x of [-2.05, 2.02]) {
    add([[x,.07,-1.08],[x,.07,1.08]], 'accent', 1);
    for (const side of [-1, 1]) {
      for (const z of [side*.88, side*1.15]) add(Array.from({length:41}, (_, i) => { const a = i / 40 * Math.PI * 2; return [x + Math.cos(a)*.48, .13 + Math.sin(a)*.48, z]; }), 'body', 1);
      for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; add([[x,.13,side*1.16],[x + Math.cos(a)*.34, .13 + Math.sin(a)*.34, side*1.16]], 'muted', 1); }
    }
  }
  const cube = (x, y, z, w, h, d) => {
    const p = [[-w,-h,-d],[w,-h,-d],[w,-h,d],[-w,-h,d],[-w,h,-d],[w,h,-d],[w,h,d],[-w,h,d]].map(([a,b,c]) => [a+x, b+y, c+z]);
    for (const [a, b] of [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]]) add([p[a], p[b]], 'accent', 2);
  };
  cube(-1.8,.4,0,.45,.25,.5); cube(.65,.1,0,.75,.06,.55);
  add([[-1.8,.4,0],[-.5,.4,0],[-.5,.4,.5],[1.5,.4,.5]], 'accent', 2);
  const COLORS = {accent:'#ff5c28', muted:'#707a8270', body:'#bec6ca9c'};

  const render = progress => {
    const mobile = width < 761, angle = -.43 + progress * 1.15, pitch = .37 + progress * .12;
    const scale = Math.min(width * (mobile ? .125 : .085), height * .16), cx = width * (mobile ? .5 : .64), cy = height * (mobile ? .66 : .56);
    const project = ([x, y, z], layer = 1) => {
      y += layer === 0 ? progress * .85 : layer === 2 ? progress * .3 : 0;
      const a = x * Math.cos(angle) + z * Math.sin(angle), b = -x * Math.sin(angle) + z * Math.cos(angle);
      const yy = y * Math.cos(pitch) - b * Math.sin(pitch), zz = y * Math.sin(pitch) + b * Math.cos(pitch);
      const k = 10 / (10 + zz);
      return [cx + a * scale * k, cy - yy * scale * k];
    };
    const draw = (points, color, layer = 1) => { ctx.beginPath(); points.forEach((p, i) => { const [x, y] = project(p, layer); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.strokeStyle = color; ctx.stroke(); };
    ctx.clearRect(0, 0, width, height); ctx.lineWidth = 1;
    for (let x = -5; x <= 5; x++) draw([[x,-.46,-3],[x,-.46,3]], '#ffffff0c');
    for (let z = -3; z <= 3; z++) draw([[-5,-.46,z],[5,-.46,z]], '#ffffff0c');
    for (const p of paths) draw(p.points, COLORS[p.color], p.layer);
    const scan = -3.2 + 6.4 * progress;   // a scan plane tracks the scroll through the body
    draw([[scan,-.35,-1.45],[scan,2.2,-1.45],[scan,2.2,1.45],[scan,-.35,1.45],[scan,-.35,-1.45]], '#ff5c2866');
    for (const p of [[-1.8,.4,0],[.65,.1,0],[2,.13,1.15]]) { const [x, y] = project(p, 2); ctx.fillStyle = '#ff5c28'; ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill(); }
    section.style.setProperty('--vp', progress.toFixed(4));
  };
  const resize = () => {
    const r = canvas.getBoundingClientRect(); width = r.width; height = r.height;
    const dpr = Math.min(devicePixelRatio, 2); canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); render(current);
  };
  const read = () => { const r = section.getBoundingClientRect(); target = reduced.matches ? .3 : clamp(-r.top / Math.max(1, section.offsetHeight - innerHeight)); };
  const tick = () => {
    raf = 0;
    current += (target - current) * .14;
    if (Math.abs(target - current) < .0005) current = target; else raf = requestAnimationFrame(tick);
    if (visible) render(current);
  };
  addEventListener('scroll', () => { read(); if (!raf && visible) raf = requestAnimationFrame(tick); }, {passive:true});
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) { read(); if (!raf) raf = requestAnimationFrame(tick); } }).observe(section);
  read(); current = target; resize();
}
