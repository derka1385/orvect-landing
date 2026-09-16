// Scroll is native. All content and links remain usable with JavaScript disabled.
(() => {
  const nav = document.querySelector('.chapter-nav');
  if (!nav) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const links = [...nav.querySelectorAll('a')];
  const chapters = links.map(link => document.querySelector(link.getAttribute('href')));
  const layer = document.querySelector('.layer-sculpture');
  const horizon = document.querySelector('.horizon-sculpture');
  const header = document.querySelector('body > .nav');
  const dial = document.querySelector('.precision-dial');
  const principles = document.querySelector('#principles');
  let pending = false;
  function update() {
    pending = false;
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const progress = Math.min(1, Math.max(0, scrollY / max));
    const positions = chapters.map(section => section?.getBoundingClientRect().top ?? Infinity);
    const layerRect = layer?.getBoundingClientRect();
    const horizonRect = horizon?.getBoundingClientRect();
    const principlesRect = principles?.getBoundingClientRect();
    const headerHeight = header?.getBoundingClientRect().height || 108;
    const clamp = value => Math.max(0, Math.min(1, value));
    nav.style.setProperty('--read-progress', String(progress));
    document.body.style.setProperty('--header-height', `${headerHeight}px`);
    let active = 0;
    positions.forEach((top, index) => { if (top < innerHeight * .45) active = index; });
    links.forEach((link, index) => {
      if (index === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    if (layer) {
      // The plates converge while the sculpture is still on screen.
      const convergence = reduced.matches ? 0 : clamp((innerHeight * .65 - layerRect.top) / (innerHeight * .65));
      layer.style.setProperty('--layer-gap', `${70 - convergence * 62}px`);
    }
    if (horizon) {
      const turn = reduced.matches ? 0 : clamp((innerHeight - horizonRect.top) / (innerHeight + horizonRect.height));
      horizon.style.setProperty('--frame-shift', `${(1 - turn) * 70}px`);
    }
    if (dial && principlesRect) {
      const progress = reduced.matches ? 0 : clamp((innerHeight * .65 - principlesRect.top) / Math.max(1, principlesRect.height - innerHeight * .35));
      dial.style.setProperty('--dial-turn', `${progress * 180}deg`);
      dial.style.setProperty('--dial-inner', `${progress * -270}deg`);
    }
  }
  function schedule() { if (!pending) { pending = true; requestAnimationFrame(update); } }
  addEventListener('scroll', schedule, {passive: true});
  addEventListener('resize', schedule);
  addEventListener('load', schedule);
  reduced.addEventListener('change', schedule);
  if (header && typeof ResizeObserver !== 'undefined') new ResizeObserver(schedule).observe(header);
  document.querySelector('[data-language]')?.addEventListener('change', schedule);
  schedule();
})();
