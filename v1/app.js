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
  const renderCount = () => {
    if (diagnosticsCount === null) return;
    const locale = {en:'en-GB',fr:'fr-FR',sv:'sv-SE',de:'de-DE'}[document.documentElement.lang] || 'en-GB';
    diagnosticCounter.textContent = new Intl.NumberFormat(locale).format(diagnosticsCount);
  };
  document.querySelector('[data-language]')?.addEventListener('change', () => queueMicrotask(renderCount));
  fetch(diagnosticCounter.dataset.endpoint, {cache:'no-store',headers:{Accept:'application/json'}})
    .then(response => {
      if (!response.ok) throw new Error(`Metrics request failed: ${response.status}`);
      return response.json();
    })
    .then(metrics => {
      const count = Number(metrics.diagnostics_analyzed);
      if (!Number.isSafeInteger(count) || count < 0) throw new Error('Invalid diagnostics count');
      diagnosticsCount = count;
      renderCount();
      reading?.setAttribute('aria-busy','false');
      proof.dataset.state = 'ready';
    })
    .catch(() => {
      diagnosticCounter.textContent = '—';
      reading?.setAttribute('aria-busy','false');
      proof.dataset.state = 'unavailable';
      const copy = proof.querySelector('.proof-counter-copy');
      if (copy) copy.textContent = 'Live diagnostic count temporarily unavailable.';
    });
}
