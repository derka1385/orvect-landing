// V2 proposals: two-state header, mobile menu, diagnostics counter, one-shot reveals.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const header = document.querySelector('[data-header]');

if (header) {
  // Rest at the top and whenever the visitor scrolls back up; floating while reading down.
  let lastY = scrollY, frame = 0;
  const update = () => {
    frame = 0;
    const y = scrollY, delta = y - lastY;
    if (y < 60 || header.classList.contains('is-open')) { header.classList.remove('is-floating'); lastY = y; return; }
    if (Math.abs(delta) < 8) return;
    header.classList.toggle('is-floating', delta > 0);
    lastY = y;
  };
  addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(update); }, {passive:true});
  update();

  const toggle = header.querySelector('[data-menu-toggle]');
  const setOpen = open => { header.classList.toggle('is-open', open); toggle?.setAttribute('aria-expanded', String(open)); };
  toggle?.addEventListener('click', () => setOpen(!header.classList.contains('is-open')));
  header.querySelectorAll('nav a').forEach(a => a.addEventListener('click', () => setOpen(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
}

// Counter: API-tracked diagnostics + those recorded outside tracking; counts up once when it comes into view.
document.querySelectorAll('[data-count]').forEach(el => {
  const historical = Number(el.dataset.historical || 0);
  let total = historical, seen = reduced.matches, ready = false, done = false;
  el.textContent = '0';
  const format = n => new Intl.NumberFormat('fr-FR').format(n);
  const run = () => {
    if (!seen || !ready || done) return;
    done = true;
    if (reduced.matches) { el.textContent = format(total); return; }
    const start = performance.now(), duration = 1400;
    const tick = now => {
      const t = Math.min(1, (now - start) / duration);
      el.textContent = format(Math.round(total * (1 - Math.pow(2, -10 * t))));
      if (t < 1) requestAnimationFrame(tick); else el.textContent = format(total);
    };
    requestAnimationFrame(tick);
  };
  fetch(el.dataset.endpoint, {cache:'no-store', headers:{Accept:'application/json'}, signal:AbortSignal.timeout(6000)})
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(m => { if (Number.isSafeInteger(m.diagnostics_analyzed)) total = historical + m.diagnostics_analyzed; })
    .catch(() => {})
    .finally(() => { ready = true; run(); });
  new IntersectionObserver(([e], o) => { if (e.isIntersecting) { seen = true; o.disconnect(); run(); } }, {threshold:.6}).observe(el);
});

// Elements marked data-reveal settle once when they enter the viewport.
const revealer = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('is-in'); revealer.unobserve(e.target); }
}), {threshold:.25});
document.querySelectorAll('[data-reveal]').forEach(el => revealer.observe(el));
document.documentElement.classList.add('js');

// Intro (V2-A home): the mark arrives stroke by stroke with the name and the slogan; on scroll its three strokes part
// and hand the screen over to the real product. Scroll sets a target, the timeline eases towards it; transforms and opacity only.
const seg = (p, a, b) => Math.min(1, Math.max(0, (p - a) / (b - a)));
const easeOut = t => 1 - Math.pow(1 - t, 3);
const easeInOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const intro = document.querySelector('[data-intro]');
if (intro && !reduced.matches) {
  intro.classList.add('intro-live');
  // The home arrival is the opening signature: don't replay the dark one on the next pages of this visit.
  try { sessionStorage.setItem('orvect-intro-seen-v1', '1'); } catch {}
  const root = document.documentElement;
  const stage = intro.querySelector('.stage');
  const lockup = intro.querySelector('.lockup'), product = intro.querySelector('.product'), cue = intro.querySelector('.cue');
  const strokes = [...intro.querySelectorAll('.layer')];
  const LOGO = [{x:8, h:52}, {x:41, h:72}, {x:74, h:52}];   // stroke bottom-left x and height, in logo units (120 × 100)
  let g, current = 0, target = 0, raf = 0;
  const measure = () => {
    const vw = innerWidth, vh = stage.clientHeight;
    const W = Math.min(300, Math.max(150, vw * .2)), u = W / 120;
    strokes.forEach((el, i) => { el.style.setProperty('--sw', `${19 * u}px`); el.style.setProperty('--h', `${LOGO[i].h * u}px`); });
    const pw = Math.min(vw - 2 * Math.min(48, Math.max(20, vw * .04)), 1040, (vh - 150) * 1.5);
    product.style.width = `${pw}px`;
    // Centre the whole arrival (mark + gap + name and slogan) optically, a touch above the middle.
    const group = 72 * u + 28 + lockup.offsetHeight;
    g = {vh, u, cx:vw / 2, top:Math.max(24, (vh - group) / 2 - vh * .04), pw, ph:pw / 1.5 + 40};
  };
  // The mark opens like a gate: the side strokes slide out to the product's edges, the middle one lifts away,
  // and the product rises through the opening. Every phase overlaps the next, so the screen is never empty.
  const render = p => {
    const {vh, u, cx, top, pw, ph} = g;
    const s = seg(p, .02, .14), a = easeInOut(seg(p, .04, .46)), m = seg(p, .08, .28), b = easeOut(seg(p, .18, .6)), o = seg(p, .5, .68);
    const logoBottom = top + 72 * u;
    lockup.style.transform = `translate3d(0,${logoBottom + 28 - s * 30}px,0)`;
    lockup.style.opacity = 1 - s;
    cue.style.opacity = Math.max(0, 1 - s * 1.6);
    const open = [-(pw / 2 + 24 + 40 * u) - (8 - 60) * u, 0, pw / 2 + 24 - (74 - 60) * u];   // extra x so each side stroke clears the product edge
    strokes.forEach((el, i) => {
      const x = cx + (LOGO[i].x - 60) * u + open[i] * a;
      const lift = i === 1 ? a * vh * .22 : a * vh * .04;
      el.style.transform = `translate3d(${x}px,${logoBottom - LOGO[i].h * u - lift}px,0)`;
      el.style.opacity = i === 1 ? 1 - m : 1 - o;
    });
    product.style.transform = `translate3d(-50%,${(vh - ph) / 2 + 36 + (1 - b) * vh * .34}px,0) scale(${.92 + .08 * b})`;
    product.style.opacity = Math.min(1, b * 1.6);
    root.classList.toggle('intro-active', p < .85);
  };
  const read = () => { const r = intro.getBoundingClientRect(); target = Math.min(1, Math.max(0, -r.top / Math.max(1, intro.offsetHeight - innerHeight))); };
  const tick = () => {
    raf = 0;
    current += (target - current) * .18;
    if (Math.abs(target - current) < .0005) current = target; else raf = requestAnimationFrame(tick);
    render(current);
  };
  addEventListener('scroll', () => { read(); if (!raf) raf = requestAnimationFrame(tick); }, {passive:true});
  // Re-measure whenever the stage or the lockup changes size (resize, zoom, late font): no stale positions.
  const ro = new ResizeObserver(() => { measure(); read(); current = target; render(current); });
  ro.observe(stage); ro.observe(lockup);
  measure(); read(); current = target; render(current);
}

// Diagnostics counter (V2-A home): 0 when the section fills the screen, the total at 70 % of its run; the mark fills a third at a time.
const proof = document.querySelector('[data-proof]');
if (proof) {
  const num = proof.querySelector('[data-proof-count]'), sr = proof.querySelector('[data-proof-sr]');
  const historical = Number(num.dataset.historical || 0);
  const format = n => new Intl.NumberFormat('fr-FR').format(n);
  let total = historical, current = 0, target = 0, raf = 0;
  const render = p => {
    const c = easeOut(seg(p, .04, .7));
    num.textContent = format(Math.round(total * c));
    [1, 2, 3].forEach(i => proof.style.setProperty(`--f${i}`, seg(c, (i - 1) / 3, i / 3).toFixed(3)));
  };
  const read = () => { const r = proof.getBoundingClientRect(); target = reduced.matches ? 1 : Math.min(1, Math.max(0, -r.top / Math.max(1, proof.offsetHeight - innerHeight))); };
  const tick = () => {
    raf = 0;
    current += (target - current) * .16;
    if (Math.abs(target - current) < .0005) current = target; else raf = requestAnimationFrame(tick);
    render(current);
  };
  fetch(num.dataset.endpoint, {cache:'no-store', headers:{Accept:'application/json'}, signal:AbortSignal.timeout(6000)})
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(m => { if (Number.isSafeInteger(m.diagnostics_analyzed)) total = historical + m.diagnostics_analyzed; })
    .catch(() => {})
    .finally(() => { sr.textContent = `${format(total)} `; render(current); });
  addEventListener('scroll', () => { read(); if (!raf) raf = requestAnimationFrame(tick); }, {passive:true});
  read(); current = target; render(current);
}

// Scrollytelling (V2 approche): the note crossing the middle of the screen lights its line in the document.
document.querySelectorAll('[data-scrolly]').forEach(root => {
  const rows = [...root.querySelectorAll('[data-row]')];
  const notes = [...root.querySelectorAll('[data-target]')];
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    notes.forEach(n => n.classList.toggle('is-active', n === e.target));
    rows.forEach(r => r.classList.toggle('is-active', r.dataset.row === e.target.dataset.target));
    root.classList.add('has-active');
  }), {rootMargin:'-45% 0px -45% 0px'});
  notes.forEach(n => io.observe(n));
});

// Guided demo (V2 prototype): scrolling walks through the steps while the window stays put;
// tabs, previous / next and arrow keys scroll to their step. Without motion it falls back to plain tabs.
document.querySelectorAll('[data-demo]').forEach(demo => {
  const tabs = [...demo.querySelectorAll('[role=tab]')];
  const panels = [...demo.querySelectorAll('[role=tabpanel]')];
  const prev = demo.querySelector('[data-prev]'), next = demo.querySelector('[data-next]'), counter = demo.querySelector('[data-counter]');
  const scroller = reduced.matches ? null : demo.closest('[data-demo-scroll]');
  let i = -1;
  const show = n => {
    n = Math.max(0, Math.min(tabs.length - 1, n));
    if (n === i) return;
    i = n;
    tabs.forEach((t, k) => { t.setAttribute('aria-selected', String(k === i)); t.tabIndex = k === i ? 0 : -1; t.classList.toggle('is-done', k < i); });
    panels.forEach((p, k) => { p.hidden = k !== i; });
    demo.style.setProperty('--step', i);
    prev.disabled = i === 0; next.disabled = i === tabs.length - 1;
    counter.textContent = `0${i + 1} / 0${tabs.length}`;
  };
  let go = show;
  if (scroller) {
    scroller.classList.add('demo-live');
    const range = () => Math.max(1, scroller.offsetHeight - innerHeight);
    const stepAt = () => Math.min(tabs.length - 1, Math.floor(Math.min(.999, Math.max(0, -scroller.getBoundingClientRect().top / range())) * tabs.length));
    addEventListener('scroll', () => show(stepAt()), {passive:true});
    go = n => {
      n = Math.max(0, Math.min(tabs.length - 1, n));
      const top = scroller.getBoundingClientRect().top + scrollY;
      scrollTo({top:top + (n + .5) / tabs.length * range(), behavior:'smooth'});
      show(n);
    };
  }
  tabs.forEach((t, k) => t.addEventListener('click', () => go(k)));
  demo.querySelector('[role=tablist]').addEventListener('keydown', e => {
    const d = {ArrowDown:1, ArrowRight:1, ArrowUp:-1, ArrowLeft:-1}[e.key];
    if (!d) return;
    e.preventDefault(); go(i + d); tabs[i].focus();
  });
  prev.addEventListener('click', () => go(i - 1));
  next.addEventListener('click', () => go(i + 1));
  show(0);
});

// Focus zoom (V2 vision): the rings close in on the Volkswagen group, then on diagnostic depth. Eased towards the scroll.
const focus = document.querySelector('[data-focus]');
if (focus && !reduced.matches) {
  focus.classList.add('focus-live');
  const ease = easeOut;
  let target = 0, current = 0, raf = 0;
  const render = p => {
    const set = (n, v) => focus.style.setProperty(n, v.toFixed(4));
    set('--k', 1 + .65 * ease(seg(p, .04, .32)) + 2.45 * ease(seg(p, .5, .8)));
    set('--o1', seg(p, .16, .28)); set('--i2', seg(p, .26, .38));
    set('--o2', seg(p, .5, .6)); set('--f', seg(p, .6, .8)); set('--i3', seg(p, .72, .86));
  };
  const read = () => { const r = focus.getBoundingClientRect(); target = Math.min(1, Math.max(0, -r.top / Math.max(1, focus.offsetHeight - innerHeight))); };
  const tick = () => {
    raf = 0;
    current += (target - current) * .16;
    if (Math.abs(target - current) < .0005) current = target; else raf = requestAnimationFrame(tick);
    render(current);
  };
  addEventListener('scroll', () => { read(); if (!raf) raf = requestAnimationFrame(tick); }, {passive:true});
  read(); current = target; render(current);
}

// Beta form (V2 bêta): validation, live progress in the side column, prefilled email. Nothing is sent from the site.
const betaForm = document.querySelector('[data-beta-form]');
if (betaForm) {
  const fields = betaForm.querySelector('[data-company-fields]');
  const individual = betaForm.querySelector('[data-individual-message]');
  const status = betaForm.querySelector('[data-form-status]');
  const inputs = [...fields.querySelectorAll('input, textarea, select')];
  const steps = [...document.querySelectorAll('[data-step]')];
  const msg = {
    field:'Veuillez renseigner ce champ.', email:'Saisissez une adresse e-mail valide.',
    siret:'Le SIRET doit contenir 14 chiffres, ou être laissé vide.',
    incomplete:'Veuillez renseigner les champs obligatoires avant de préparer votre candidature.',
    sent:'Votre messagerie devrait maintenant être ouverte avec votre candidature prête à envoyer.'
  };
  const el = name => betaForm.elements[name];
  const val = name => el(name).value.trim();
  const siretOk = () => { const d = val('siret').replace(/\s/g, ''); return !d || /^\d{14}$/.test(d); };
  const isCompany = () => el('profile').value === 'company';
  const progress = () => {
    const done = {
      profil: Boolean(el('profile').value),
      coord: isCompany() && Boolean(val('name') && val('email') && !el('email').validity.typeMismatch && val('company')) && siretOk(),
      besoin: isCompany() && Boolean(val('reason') && val('source'))
    };
    steps.forEach(s => s.classList.toggle('is-done', done[s.dataset.step]));
  };
  const updateProfile = () => {
    fields.hidden = !isCompany();
    individual.hidden = isCompany();
    inputs.forEach(i => { i.disabled = !isCompany(); });
    status.textContent = '';
    progress();
  };
  betaForm.querySelectorAll('input[name="profile"]').forEach(r => r.addEventListener('change', updateProfile));
  inputs.forEach(i => i.addEventListener('input', () => { i.setCustomValidity(''); status.textContent = ''; progress(); }));
  betaForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!isCompany()) return;
    const t = window.t || (s => s);   // i18n.js; the status line itself is translated as it appears
    ['name', 'company', 'reason', 'source'].forEach(n => el(n).setCustomValidity(val(n) ? '' : t(msg.field)));
    el('email').setCustomValidity(!val('email') ? t(msg.field) : el('email').validity.typeMismatch ? t(msg.email) : '');
    el('siret').setCustomValidity(siretOk() ? '' : t(msg.siret));
    if (!betaForm.checkValidity()) { betaForm.reportValidity(); status.textContent = msg.incomplete; return; }
    const lines = [
      t('Candidature au programme bêta ORVECT'), '',
      `${t('Nom :')} ${val('name')}`, `${t('E-mail :')} ${val('email')}`, `${t('Entreprise :')} ${val('company')}`,
      `${t('SIRET :')} ${val('siret').replace(/\s/g, '') || t('Non renseigné')}`,
      `${t('A connu ORVECT par :')} ${val('source')}`, '',
      t('Pourquoi rejoindre la bêta :'), val('reason')
    ];
    location.href = `mailto:nolann.orvect@gmail.com?subject=${encodeURIComponent(t('ORVECT — Candidature au programme bêta'))}&body=${encodeURIComponent(lines.join('\n'))}`;
    status.textContent = msg.sent;
  });
  updateProfile();
}

// Cookie choice (all pages). Refusing is as easy as accepting; the choice is kept 6 months, then asked again.
// ponytail: only records the choice today (no tracker exists); gate any future analytics on html[data-consent="accepted"].
{
  const KEY = 'orvect-consent', MAX_AGE = 182 * 864e5;
  const root = document.documentElement;
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(KEY)); } catch {}
  if (saved && Date.now() - saved.t < MAX_AGE) root.dataset.consent = saved.v; else saved = null;
  let banner = null, opener = null;
  const close = () => { banner?.remove(); banner = null; opener?.focus(); opener = null; };
  const choose = v => {
    root.dataset.consent = v;
    try { localStorage.setItem(KEY, JSON.stringify({v, t:Date.now()})); } catch {}
    close();
  };
  const open = () => {
    if (banner) return banner.querySelector('button').focus();
    banner = document.createElement('div');
    banner.className = 'consent';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-labelledby', 'consent-title');
    banner.innerHTML = `<p class="consent-title" id="consent-title">Cookies</p>
      <p>ORVECT ne dépose aujourd’hui aucun cookie de mesure d’audience ni de publicité. Votre choix s’appliquera si nous en ajoutons un jour. <a href="legal.html#cookies">En savoir plus</a></p>
      <div class="consent-actions"><button type="button" class="btn btn-small" data-choice="refused">Refuser</button><button type="button" class="btn btn-small" data-choice="accepted">Accepter</button></div>`;
    banner.addEventListener('click', e => { const b = e.target.closest('[data-choice]'); if (b) choose(b.dataset.choice); });
    banner.addEventListener('keydown', e => { if (e.key === 'Escape' && opener) close(); });
    (document.querySelector('.skip') || document.body.firstChild).after(banner);
    if (opener) banner.querySelector('button').focus();
  };
  document.addEventListener('click', e => { const b = e.target.closest('[data-consent-open]'); if (b) { opener = b; open(); } });
  if (!saved) open();
}
