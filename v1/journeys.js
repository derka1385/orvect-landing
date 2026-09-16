// Scroll is native. All content and links remain usable with JavaScript disabled.
(() => {
  const nav = document.querySelector('.chapter-nav');
  if (!nav) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const links = [...nav.querySelectorAll('a')];
  const chapters = links.map(link => document.querySelector(link.getAttribute('href')));
  const layer = document.querySelector('.layer-sculpture');
  const horizon = document.querySelector('.horizon-sculpture');
  let pending = false;
  function update() {
    pending = false;
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const progress = Math.min(1, Math.max(0, scrollY / max));
    const positions = chapters.map(section => section?.getBoundingClientRect().top ?? Infinity);
    const layerRect = layer?.getBoundingClientRect();
    const horizonRect = horizon?.getBoundingClientRect();
    const clamp = value => Math.max(0, Math.min(1, value));
    nav.style.setProperty('--read-progress', String(progress));
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
      horizon.style.setProperty('--orbit-turn', `${turn * 150}deg`);
      horizon.style.setProperty('--orbit-tilt', `${turn * 65}deg`);
    }
  }
  function schedule() { if (!pending) { pending = true; requestAnimationFrame(update); } }
  addEventListener('scroll', schedule, {passive: true});
  addEventListener('resize', schedule);
  addEventListener('load', schedule);
  reduced.addEventListener('change', schedule);
  document.querySelector('[data-language]')?.addEventListener('change', schedule);
  schedule();
})();
