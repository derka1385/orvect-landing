// A brief brand introduction, independent of data loading and never repeated between pages.
(() => {
  const key = 'orvect-intro-seen-v1';
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches) return;
  try {
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');
  } catch {
    // If storage is unavailable, avoid replaying on same-site navigation.
    try { if (document.referrer && new URL(document.referrer).origin === location.origin) return; } catch {}
  }
  const intro = document.createElement('div');
  intro.className = 'orvect-intro';
  intro.setAttribute('aria-hidden', 'true');
  intro.innerHTML = '<div class="orvect-intro-lockup"><svg class="orvect-intro-mark" viewBox="0 0 120 100" focusable="false"><path d="M8 76 29 24h19L27 76Z"/><path d="M41 76 70 4h19L60 76Z"/><path d="M74 76 95 24h19L93 76Z"/></svg><span class="orvect-intro-name">ORVECT</span></div>';
  document.body.prepend(intro);
  let fallback;
  const finish = () => {
    intro.remove();
    clearTimeout(fallback);
    for (const event of ['keydown', 'pointerdown', 'wheel', 'pagehide']) removeEventListener(event, finish);
    motion.removeEventListener('change', finish);
  };
  intro.addEventListener('animationend', event => {
    if (event.target === intro) finish();
  });
  // Interaction skips the signature immediately; focus and scrolling remain native.
  for (const event of ['keydown', 'pointerdown', 'wheel', 'pagehide']) addEventListener(event, finish, {passive: true});
  motion.addEventListener('change', finish);
  // Also release if CSS fails to load or its animation is disabled by a user stylesheet.
  fallback = setTimeout(finish, 3200);
})();
