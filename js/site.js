(() => {
  'use strict';
  const toggle = document.querySelector('.nav__toggle');
  const links = document.getElementById('nav-links');

  const setOpen = (open) => {
    links.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  toggle.addEventListener('click', () => setOpen(!links.classList.contains('is-open')));
  links.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });

  /* ── Sign-up through Tito ──
   * Set this to your event's path on Tito: the part after https://ti.to/,
   * e.g. 'hacklancs/2027'. While it is empty the page shows "Applications open soon". */
  const TITO_EVENT = '';

  if (TITO_EVENT) {
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://css.tito.io/v1.1';
    document.head.appendChild(css);
    const js = document.createElement('script');
    js.src = 'https://js.tito.io/v2';
    js.async = true;
    document.head.appendChild(js);

    const widget = document.createElement('tito-widget');
    widget.setAttribute('event', TITO_EVENT);
    document.getElementById('tito-mount').appendChild(widget);
    document.getElementById('tito-link').href = 'https://ti.to/' + TITO_EVENT;
    document.getElementById('apply-soon').hidden = true;
    document.getElementById('apply-tito').hidden = false;
    document.querySelectorAll('a[href="#apply"]').forEach((a) => { a.textContent = 'Sign up'; });
  }

  document.getElementById('year').textContent = new Date().getFullYear();
})();
