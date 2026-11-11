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

  document.getElementById('year').textContent = new Date().getFullYear();
})();
