// Content and contact links work without JavaScript; 3D is progressive enhancement.
const container = document.querySelector('#core-scene');
if (container && !navigator.connection?.saveData) {
  import('./core-scene.js').then(({ mountCore }) => mountCore(container)).catch(() => {
    container.classList.remove('is-ready');
    document.querySelector('#scene-controls').hidden = true;
    document.querySelector('#scene-caption').textContent = 'STATIC EDITION · CONCEPT SCULPTURE';
  });
}

const proof = document.querySelector('[data-diagnostic-proof]');
const diagnosticCounter = proof?.querySelector('[data-diagnostic-counter]');
if (proof && diagnosticCounter) {
  const reading = diagnosticCounter.closest('.proof-counter-reading');
  let diagnosticsCount = null;
  let displayedCount = 0;
  let counterHasEntered = false;
  let counterHasAnimated = false;
  let countAnimationFrame = 0;
  const renderCount = (value = displayedCount) => {
    if (diagnosticsCount === null) return;
    const locale = {en:'en-GB',fr:'fr-FR',sv:'sv-SE',de:'de-DE'}[document.documentElement.lang] || 'en-GB';
    diagnosticCounter.textContent = new Intl.NumberFormat(locale).format(value);
  };
  const finishCount = () => {
    displayedCount = diagnosticsCount;
    renderCount();
    reading?.setAttribute('aria-busy','false');
  };
  const animateCount = () => {
    if (counterHasAnimated || diagnosticsCount === null || !counterHasEntered) return;
    counterHasAnimated = true;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return finishCount();
    const startedAt = performance.now();
    const duration = Math.min(2200, Math.max(1100, 800 + Math.log10(diagnosticsCount + 1) * 520));
    const tick = now => {
      const progress = Math.min(1, (now - startedAt) / duration);
      // A soft ease-out keeps the last digits legible rather than racing past them.
      displayedCount = Math.round(diagnosticsCount * (1 - Math.pow(1 - progress, 4)));
      renderCount();
      if (progress < 1) countAnimationFrame = requestAnimationFrame(tick);
      else finishCount();
    };
    countAnimationFrame = requestAnimationFrame(tick);
  };
  document.querySelector('[data-language]')?.addEventListener('change', () => queueMicrotask(() => renderCount()));
  new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    counterHasEntered = true;
    animateCount();
  }, {threshold:.35}).observe(proof);
  fetch(diagnosticCounter.dataset.endpoint, {cache:'no-store',headers:{Accept:'application/json'}})
    .then(response => {
      if (!response.ok) throw new Error(`Metrics request failed: ${response.status}`);
      return response.json();
    })
    .then(metrics => {
      const count = metrics.diagnostics_analyzed;
      if (!Number.isSafeInteger(count) || count < 0) throw new Error('Invalid diagnostics count');
      // Pre-counter workshop diagnostics confirmed by the founder, not API events.
      const historical = Number(diagnosticCounter.dataset.historicalCount);
      diagnosticsCount = count + historical;
      if (!Number.isSafeInteger(diagnosticsCount)) throw new Error('Invalid total');
      animateCount();
      proof.dataset.state = 'ready';
    })
    .catch(() => {
      diagnosticsCount = Number(diagnosticCounter.dataset.historicalCount);
      finishCount();
      reading?.setAttribute('aria-busy','false');
      proof.dataset.state = 'historical';
      const copy = proof.querySelector('.proof-counter-copy');
      if (copy) copy.replaceChildren(document.createTextNode('12 historical workshop diagnostics. Live tracking temporarily unavailable.'));
    });

  let proofFrame = 0;
  const updateProofProgress = () => {
    proofFrame = 0;
    const range = Math.max(1, proof.offsetHeight - innerHeight);
    const progress = Math.max(0, Math.min(1, -proof.getBoundingClientRect().top / range));
    proof.style.setProperty('--proof-glow-position', `${72 - progress * 28}%`);
    proof.style.setProperty('--proof-orbit-rotation', `${-18 + progress * 40}deg`);
    proof.style.setProperty('--proof-ring-one', String(.46 + progress * .34));
    proof.style.setProperty('--proof-ring-two', String(.66 + progress * .2));
    proof.style.setProperty('--proof-ring-three', String(.84 + progress * .08));
    proof.style.setProperty('--proof-core-scale', String(1 + progress * 1.5));
    proof.style.setProperty('--proof-dot-rotation', `${progress}turn`);
    proof.style.setProperty('--proof-dot-opposition', `${-progress}turn`);
    proof.dataset.stage = String(progress < .34 ? 0 : progress < .68 ? 1 : 2);
  };
  const scheduleProofProgress = () => {
    if (!proofFrame) proofFrame = requestAnimationFrame(updateProofProgress);
  };
  addEventListener('scroll', scheduleProofProgress, {passive:true});
  addEventListener('resize', scheduleProofProgress);
  scheduleProofProgress();
}

const contactClimax = document.querySelector('[data-contact-climax]');
if (contactClimax) {
  let contactFrame = 0;
  const updateContactClimax = () => {
    contactFrame = 0;
    const range = Math.max(1, contactClimax.offsetHeight - innerHeight);
    const progress = Math.max(0, Math.min(1, -contactClimax.getBoundingClientRect().top / range));
    contactClimax.style.setProperty('--contact-title-y', `${12 - progress * 22}vh`);
    contactClimax.style.setProperty('--contact-cta-y', `${96 - progress * 96}%`);
    contactClimax.style.setProperty('--contact-copy-opacity', String(.32 + progress * .68));
    contactClimax.style.setProperty('--contact-orbit-x', `${-progress * 8}vw`);
    contactClimax.style.setProperty('--contact-orbit-y', `${progress * 9}vh`);
    contactClimax.style.setProperty('--contact-progress', String(progress));
  };
  const scheduleContactClimax = () => {
    if (!contactFrame) contactFrame = requestAnimationFrame(updateContactClimax);
  };
  addEventListener('scroll', scheduleContactClimax, {passive:true});
  addEventListener('resize', scheduleContactClimax);
  scheduleContactClimax();
}
