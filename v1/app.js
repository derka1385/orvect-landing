// The opening mark connects the three reasoning layers without a 3D dependency.
const identity = document.querySelector('.identity-art');
if (identity) {
  const buttons = [...identity.querySelectorAll('[data-identity-step]')];
  buttons.forEach(button => button.addEventListener('click', () => {
    identity.dataset.identityStage = button.dataset.identityStep;
    buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    identity.querySelectorAll('[data-identity-copy]').forEach(copy => {
      copy.hidden = copy.dataset.identityCopy !== button.dataset.identityStep;
    });
  }));
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
