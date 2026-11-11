/* HackLancs pixel art.
 * Everything is drawn in "art pixels" on small canvases and scaled up by a whole
 * number (N, mirrored to the CSS variable --px) so every asset shares one pixel size.
 * The hero is composed from the viewport width, so narrow screens get their own
 * arrangement instead of a crop of the desktop one.
 */
(() => {
  'use strict';

  const root = document.documentElement;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

  const CASTLE = { light: '#7a6ba6', mid: '#56497f', dark: '#3b3162' };
  const PALE   = { light: '#e3d9ee', mid: '#bcaed6', dark: '#8c7cb3' };
  const AQ     = { light: '#a497c2', mid: '#7c6fa3', dark: '#574b80', deep: '#3f3566' };
  const COPPER = { light: '#86c4ad', mid: '#5c9c8c', dark: '#3d7167' };
  const LIT = '#ffd36b', DIM = '#9c7350', ROSE = '#ff6b81', INK = '#150f2e';

  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const px = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };

  function pickScale() {
    if (innerWidth < 600) return 3;
    return Math.max(3, Math.min(6, Math.round(innerHeight / 230)));
  }

  /* ── Building blocks ─────────────────────────────────────────── */

  // A stone block standing on yBase. Widths of 4k+2 give symmetric battlements.
  function block(g, x, yBase, w, h, pal, crenel = true) {
    const y = yBase - h;
    px(g, x, y, w, h, pal.mid);
    px(g, x, y, 1, h, pal.light);
    px(g, x + w - 2, y, 2, h, pal.dark);
    px(g, x, y, w, 1, pal.light);
    if (crenel) {
      for (let i = 0; i < w; i += 4) {
        px(g, x + i, y - 2, 2, 2, pal.mid);
        px(g, x + i, y - 2, 2, 1, pal.light);
      }
    }
  }

  function flag(g, x, yTop) {
    px(g, x, yTop - 8, 1, 8, PALE.light);
    px(g, x + 1, yTop - 8, 5, 3, ROSE);
    px(g, x + 1, yTop - 5, 3, 1, ROSE);
  }

  // Lancaster Castle: keep, curtain wall and the twin-towered gatehouse. 66 wide.
  function drawCastle(g, x, by, wins) {
    block(g, x + 10, by, 22, 34, CASTLE);                 // keep
    flag(g, x + 20, by - 36);
    block(g, x, by, 10, 20, CASTLE);                      // west tower
    block(g, x, by, 66, 12, CASTLE);                      // curtain wall
    block(g, x + 40, by - 26, 6, 5, CASTLE);              // gatehouse turrets
    block(g, x + 58, by - 26, 6, 5, CASTLE);
    block(g, x + 38, by, 10, 26, CASTLE);                 // gatehouse towers
    block(g, x + 56, by, 10, 26, CASTLE);
    block(g, x + 48, by, 8, 21, CASTLE);                  // gate passage
    px(g, x + 50, by - 7, 4, 7, INK);
    px(g, x + 51, by - 8, 2, 1, INK);
    px(g, x + 51, by - 5, 2, 5, '#f6a65a');

    const w = (dx, dy, ww, hh) => wins.push({ x: x + dx, y: by - dy, w: ww, h: hh });
    w(14, 28, 2, 3); w(20, 28, 2, 3); w(26, 28, 2, 3);
    w(17, 19, 2, 3); w(23, 19, 2, 3);
    w(4, 15, 1, 3);
    w(42, 20, 2, 3); w(60, 20, 2, 3);
    w(42, 12, 1, 2); w(61, 12, 1, 2);
    w(51, 16, 2, 2);
  }

  // Ashton Memorial: stepped base, colonnaded storeys, copper dome and lantern.
  // cx is the centre line; about 44 wide and 58 tall.
  function drawMemorial(g, cx, by, wins) {
    const cr = (w, up, h, c) => px(g, cx - w / 2, by - up - h, w, h, c);
    const w = (dx, up, ww, hh) => wins.push({ x: cx + dx, y: by - up - hh, w: ww, h: hh });
    const colonnade = (wd, up, h) => {
      cr(wd, up, h, PALE.mid);
      for (let i = 1; i < wd - 3; i += 3) px(g, cx - wd / 2 + i, by - up - h, 1, h, PALE.light);
      px(g, cx + wd / 2 - 3, by - up - h, 3, h, PALE.dark);
    };

    cr(44, 0, 2, PALE.dark); cr(44, 1, 1, PALE.mid);       // steps
    cr(38, 2, 2, PALE.mid);  cr(38, 3, 1, PALE.light);
    cr(32, 4, 2, PALE.dark); cr(32, 5, 1, PALE.mid);

    colonnade(30, 6, 12);                                  // lower storey
    px(g, cx - 2, by - 14, 4, 8, '#2a2050');
    w(-1, 6, 2, 5); w(-10, 9, 2, 5); w(8, 9, 2, 5);
    cr(34, 18, 1, PALE.dark); cr(34, 19, 1, PALE.light);

    for (const dx of [-15, 9]) {                           // corner cupolas
      px(g, cx + dx + 1, by - 23, 4, 3, PALE.mid);
      px(g, cx + dx, by - 24, 6, 1, COPPER.mid);
      px(g, cx + dx + 1, by - 25, 4, 1, COPPER.mid);
      px(g, cx + dx + 2, by - 26, 2, 1, COPPER.light);
    }

    colonnade(20, 20, 10);                                 // upper storey
    w(-6, 22, 2, 5); w(-1, 22, 2, 6); w(4, 22, 2, 5);
    cr(24, 30, 1, PALE.dark); cr(24, 31, 1, PALE.light);

    cr(16, 32, 5, PALE.mid);                               // drum
    px(g, cx + 6, by - 37, 2, 5, PALE.dark);
    w(-5, 33, 1, 3); w(-1, 33, 2, 3); w(4, 33, 1, 3);
    cr(18, 37, 1, PALE.light);

    for (let i = 0; i < 10; i++) {                         // dome
      const hw = Math.round(9 * Math.sqrt(1 - (i / 10) ** 2));
      const y = by - 39 - i;
      px(g, cx - hw, y, hw * 2, 1, COPPER.mid);
      px(g, cx - hw, y, Math.min(2, hw), 1, COPPER.light);
      px(g, cx + hw - Math.min(3, hw), y, Math.min(3, hw), 1, COPPER.dark);
    }

    cr(4, 48, 4, PALE.mid);                                // lantern
    w(-1, 49, 2, 2);
    cr(6, 52, 1, PALE.light);
    cr(4, 53, 1, COPPER.mid); cr(2, 54, 1, COPPER.light);
    cr(2, 55, 3, PALE.light);
  }

  function drawTree(g, x, y, big) {
    const rows = big ? [3, 5, 7, 7, 5] : [3, 5, 5, 3];
    px(g, x, y - 2, 1, 2, '#150f2e');
    rows.forEach((w, i) => px(g, x - (w >> 1), y - 2 - rows.length + i, w, 1, '#1b3145'));
    px(g, x - 1, y - 1 - rows.length, 2, 1, '#2b4d5c');
    px(g, x - 2, y - rows.length, 1, 1, '#2b4d5c');
  }

  // Lune Aqueduct: parapet, deck and a run of semicircular arches on piers.
  function drawAqueduct(g, W, top, bottom, rand) {
    const UNIT = 42, PIER = 10, R = 16;
    const spring = top + 26;
    const n = Math.ceil(W / UNIT) + 2;
    const x0 = Math.round((W - (n * UNIT + PIER)) / 2);

    const speckle = (x, y, w, h) => {
      for (let i = 0; i < (w * h) / 14; i++) {
        px(g, x + (rand() * w | 0), y + (rand() * h | 0), 1 + (rand() * 2 | 0), 1, rand() < 0.5 ? AQ.dark : AQ.light);
      }
    };

    for (let k = 0; k < n; k++) {                          // spandrels above each arch
      const ax = x0 + k * UNIT + PIER, cx = ax + R;
      for (let i = 0; i < R * 2; i++) {
        const d = i + 0.5 - R;
        const ay = Math.round(spring - Math.sqrt(R * R - d * d));
        px(g, ax + i, top + 9, 1, ay - (top + 9), AQ.mid);
        px(g, ax + i, ay - 1, 1, 1, AQ.light);             // arch ring
        if (i > R * 2 - 4) px(g, ax + i, ay, 1, 1, AQ.deep);
      }
      px(g, cx - 1, top + 8, 2, 3, AQ.light);              // keystone
      speckle(ax, top + 9, R * 2, 5);
    }
    for (let k = 0; k <= n; k++) {                         // piers
      const x = x0 + k * UNIT;
      px(g, x, top + 9, PIER, bottom - top - 9, AQ.mid);
      px(g, x, top + 9, 1, bottom - top - 9, AQ.light);
      px(g, x + PIER - 3, top + 9, 3, bottom - top - 9, AQ.dark);
      px(g, x - 1, spring, PIER + 2, 1, AQ.light);         // impost
      px(g, x - 1, spring + 1, PIER + 2, 1, AQ.deep);
      speckle(x + 1, top + 10, PIER - 4, bottom - top - 12);
    }
    drawDeck(g, W, top, rand);
  }

  function drawDeck(g, W, top, rand) {
    px(g, 0, top, W, 3, AQ.mid);                           // parapet
    px(g, 0, top, W, 1, AQ.light);
    px(g, 0, top + 3, W, 1, AQ.deep);                      // cornice shadow
    px(g, 0, top + 4, W, 4, AQ.mid);
    px(g, 0, top + 8, W, 1, AQ.light);                     // string course
    for (let i = 0; i < W / 3; i++) {
      px(g, rand() * W | 0, top + 4 + (rand() * 4 | 0), 2, 1, rand() < 0.5 ? AQ.dark : AQ.light);
    }
    for (let x = 6; x < W; x += 14) px(g, x, top + 1, 1, 2, AQ.dark);   // parapet joints
  }

  /* ── Hero scene ──────────────────────────────────────────────── */

  function heroScene(canvas, hero) {
    const ctx = canvas.getContext('2d');
    let N, W, H, back, front, wins, stars, clouds, ripples;
    let t = 0, timer = null, onScreen = true;

    function build() {
      N = pickScale();
      root.style.setProperty('--px', N + 'px');
      W = Math.ceil(hero.clientWidth / N);
      H = Math.ceil(hero.clientHeight / N);
      canvas.width = W; canvas.height = H;
      canvas.style.width = W * N + 'px';
      canvas.style.height = H * N + 'px';

      const rand = rng(1351);            // fixed seed: the same Lancaster every visit
      const narrow = W < 150;
      const horizon = H - 44;
      wins = [];

      // Composition. On narrow screens the castle's west tower runs off the left
      // edge so the gatehouse and the Memorial both stay fully in frame.
      const memX = narrow ? W - 27 : Math.round(W * 0.78);
      const castleX = narrow ? Math.min(-8, W - 49 - 4 - 66) : Math.round(W * 0.24) - 33;
      const castleC = castleX + 33;
      const sigma = narrow ? 12 : 22;
      const ground = (x) => {
        const dm = Math.max(0, Math.abs(x - memX) - 23);
        const dc = Math.max(0, Math.abs(x - castleC) - 35);
        return Math.round(horizon - 18 * Math.exp(-(dm * dm) / (2 * sigma * sigma)) - 5 * Math.exp(-(dc * dc) / 200));
      };

      /* back layer: sky and moon */
      back = document.createElement('canvas');
      back.width = W; back.height = H;
      let g = back.getContext('2d');
      const upper = ['#0d0b26', '#121030', '#18153d', '#1f1a4b'];
      const lower = [['#281f58', 14], ['#35256a', 12], ['#4a2f78', 10], ['#663b82', 8], ['#8a4c88', 6], ['#b3618a', 5], ['#d97f86', 4], ['#f2a27e', 3]];
      const upperH = Math.max(0, horizon - 62);
      const bands = [];
      let y = 0;
      upper.forEach((c, i) => {
        const h = Math.round(upperH * (i + 1) / 4) - Math.round(upperH * i / 4);
        bands.push([c, y, h]); y += h;
      });
      lower.forEach(([c, h]) => { bands.push([c, y, h]); y += h; });
      bands.forEach(([c, y0, h], i) => {
        px(g, 0, y0, W, i === bands.length - 1 ? H - y0 : h, c);
        if (i && h) {                    // dithered edge between bands
          for (let x = 0; x < W; x += 2) px(g, x, y0 - 1, 1, 1, c);
          for (let x = 1; x < W; x += 4) px(g, x, y0 - 2, 1, 1, c);
        }
      });
      const mr = narrow ? 5 : 8;
      const mx = W - mr - (narrow ? 10 : 22), my = Math.round(56 / N) + mr + 8;
      for (let dy = -mr; dy <= mr; dy++) {
        const hw = Math.round(Math.sqrt(mr * mr - dy * dy));
        px(g, mx - hw, my + dy, hw * 2, 1, '#f4ecd8');
      }
      px(g, mx - 2, my - 2, 2, 2, '#d6cbe0'); px(g, mx + 2, my + 1, 2, 1, '#d6cbe0');
      if (!narrow) px(g, mx - 4, my + 3, 2, 2, '#d6cbe0');

      /* front layer: terrain, landmarks, aqueduct */
      front = document.createElement('canvas');
      front.width = W; front.height = H;
      g = front.getContext('2d');
      const ridge = (base, amp, f, ph, c) => {
        for (let x = 0; x < W; x++) {
          const yy = Math.round(base - amp * (0.5 * Math.sin(x / f + ph) + 0.3 * Math.sin(x / (f * 0.37) + ph * 2.1) + 0.2 * Math.sin(x / (f * 0.13) + ph * 3.7)));
          px(g, x, yy, 1, H - yy, c);
        }
      };
      ridge(horizon - 14, 7, 38, 1.3, '#5b3f7e');
      ridge(horizon - 7, 4, 23, 4.1, '#40306b');
      for (let x = 0; x < W; x++) {
        const gy = ground(x);
        px(g, x, gy, 1, H - gy, '#261c4b');
        px(g, x, gy, 1, 1, '#3d2e6b');
      }

      // the town between the two landmarks
      const townL = castleX + 72, townR = memX - 23 - sigma * 2;
      if (townR - townL > 14) {
        const spireAt = townR - townL > 60 ? townL + Math.round((townR - townL) * 0.45) : -1;
        for (let x = townL; x < townR - 6;) {
          const w = 5 + (rand() * 5 | 0), h = 4 + (rand() * 4 | 0);
          const yb = ground(x + (w >> 1)) + 1;
          if (spireAt >= x && spireAt < x + w + 3) {
            px(g, x, yb - 15, 4, 15, '#3a2d66');
            px(g, x, yb - 15, 1, 15, '#4d3e80');
            px(g, x + 1, yb - 19, 2, 4, '#221946'); px(g, x + 1, yb - 22, 1, 3, '#221946');
            wins.push({ x: x + 1, y: yb - 11, w: 1, h: 2 });
            x += 6;
            continue;
          }
          px(g, x, yb - h, w, h, '#3a2d66');
          for (let k = 0; k < 3 && w + 2 - 2 * k > 0; k++) px(g, x - 1 + k, yb - h - 1 - k, w + 2 - 2 * k, 1, '#221946');
          wins.push({ x: x + 1 + (rand() * (w - 2) | 0), y: yb - h + 1, w: 1, h: 2 });
          x += w + 1 + (rand() * 3 | 0);
        }
      }

      // Williamson Park trees on the hill, behind the Memorial's base
      for (let x = memX - 23 - sigma * 2; x < memX + 23 + sigma * 2; x += 5 + (rand() * 5 | 0)) {
        if (Math.abs(x - memX) < 25 || x < castleX + 68) continue;
        drawTree(g, x, ground(x) + 1, rand() < 0.4);
      }

      drawCastle(g, castleX, ground(castleC) + 1, wins);
      drawMemorial(g, memX, ground(memX) + 1, wins);
      if (!narrow) { drawTree(g, castleX - 6, ground(castleX - 6) + 1, true); drawTree(g, castleX + 71, ground(castleX + 71) + 1, false); }

      drawAqueduct(g, W, H - 40, H - 6, rand);

      /* animated bits */
      wins.forEach((w) => { w.ph = rand() * 200 | 0; w.per = 50 + (rand() * 90 | 0); });
      const starRows = Math.max(10, horizon - 52);
      stars = Array.from({ length: Math.round(W * starRows / 420) }, () => ({
        x: rand() * W | 0, y: rand() * starRows | 0, ph: rand() * 60 | 0, per: 24 + (rand() * 40 | 0), big: rand() < 0.12,
      }));
      clouds = Array.from({ length: Math.max(2, Math.round(W / 80)) }, () => ({
        x: rand() * W, y: horizon - 58 + (rand() * 26 | 0), w: 16 + (rand() * 14 | 0), sp: 0.12 + rand() * 0.14,
      }));
      ripples = Array.from({ length: Math.round(W / 3) }, () => ({
        x: rand() * W, row: 1 + (rand() * 9 | 0), len: 2 + (rand() * 6 | 0),
        sp: (rand() < 0.5 ? -1 : 1) * (0.2 + rand() * 0.4), warm: rand() < 0.18,
      }));
    }

    function frame() {
      ctx.drawImage(back, 0, 0);

      for (const s of stars) {
        const k = (t + s.ph) % s.per;
        if (k < 2) continue;
        px(ctx, s.x, s.y, 1, 1, k < 5 ? '#8f86b5' : '#f4ecd8');
        if (s.big && k > s.per - 6) { px(ctx, s.x - 1, s.y, 3, 1, '#f4ecd8'); px(ctx, s.x, s.y - 1, 1, 3, '#f4ecd8'); }
      }

      for (const c of clouds) {
        const x = Math.floor(c.x);
        px(ctx, x + 5, c.y, c.w - 11, 1, '#7a5f9f');
        px(ctx, x + 2, c.y + 1, c.w - 5, 1, '#7a5f9f');
        px(ctx, x, c.y + 2, c.w, 1, '#8c6aa3');
        px(ctx, x + 3, c.y + 3, c.w - 8, 1, '#b07a9f');
      }

      ctx.drawImage(front, 0, 0);

      for (const w of wins) px(ctx, w.x, w.y, w.w, w.h, (t + w.ph) % w.per < 3 ? DIM : LIT);

      const ry = H - 10;                                   // the Lune
      px(ctx, 0, ry, W, 10, '#1a2356');
      px(ctx, 0, ry, W, 1, '#3a4a8c');
      for (const r of ripples) {
        const x = Math.floor(((r.x + r.sp * t) % W + W) % W);
        const c = r.warm && r.row < 5 ? '#b56f95' : (r.row < 4 ? '#3f55a0' : '#2c3a7c');
        px(ctx, x, ry + r.row, r.len, 1, c);
        if (x + r.len > W) px(ctx, 0, ry + r.row, x + r.len - W, 1, c);
      }
    }

    function tick() {
      t++;
      for (const c of clouds) { c.x += c.sp; if (c.x > W + 4) c.x = -c.w - 4; }
      frame();
    }

    function sync() {
      clearInterval(timer); timer = null;
      if (!reduceMotion.matches && onScreen && !document.hidden) timer = setInterval(tick, 220);
    }

    function rebuild() { build(); frame(); sync(); }

    new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; sync(); }).observe(hero);
    document.addEventListener('visibilitychange', sync);
    reduceMotion.addEventListener('change', sync);

    rebuild();
    return { rebuild, scale: () => N };
  }

  /* ── Small sprites used further down the page ────────────────── */

  const SPRITES = {
    chest: { w: 18, h: 16, draw(g) {
      const wood = '#8a5a6e', woodDark = '#6b4460', gold = LIT, goldDark = '#c9973f';
      px(g, 2, 1, 14, 1, INK); px(g, 1, 2, 16, 1, INK);
      px(g, 0, 3, 18, 12, INK); px(g, 1, 15, 16, 1, INK);
      px(g, 2, 2, 14, 1, wood); px(g, 1, 3, 16, 4, wood);
      px(g, 2, 3, 13, 1, '#a8748a');
      px(g, 1, 7, 16, 1, goldDark);
      px(g, 1, 8, 16, 7, woodDark);
      for (const x of [3, 13]) { px(g, x, 2, 2, 13, gold); px(g, x + 1, 2, 1, 13, goldDark); }
      px(g, 7, 6, 4, 5, gold); px(g, 7, 10, 4, 1, goldDark);
      px(g, 8, 8, 2, 2, INK);
    } },
  };

  function drawSprites(N) {
    document.querySelectorAll('canvas[data-sprite]').forEach((c) => {
      const s = SPRITES[c.dataset.sprite];
      if (!s) return;
      c.width = s.w; c.height = s.h;
      c.style.width = s.w * N + 'px'; c.style.height = s.h * N + 'px';
      s.draw(c.getContext('2d'));
    });
    document.querySelectorAll('canvas[data-strip="deck"]').forEach((c) => {
      const W = Math.ceil(c.parentElement.clientWidth / N);
      c.width = W; c.height = 10;
      c.style.width = W * N + 'px'; c.style.height = 10 * N + 'px';
      const g = c.getContext('2d');
      drawDeck(g, W, 0, rng(77));
      px(g, 0, 9, W, 1, AQ.deep);
    });

    // brick texture for the castle-wall section
    const b = document.createElement('canvas');
    b.width = 16 * N; b.height = 8 * N;
    const g = b.getContext('2d');
    px(g, 0, 0, 16 * N, 8 * N, '#2a2152');
    g.fillStyle = '#231b47';
    g.fillRect(0, 0, 16 * N, N); g.fillRect(0, 4 * N, 16 * N, N);
    g.fillRect(0, N, N, 3 * N); g.fillRect(8 * N, 5 * N, N, 3 * N);
    root.style.setProperty('--brick', `url(${b.toDataURL()})`);

    // canal water tiles: one flowing across, one flowing down (see .canal in style.css)
    const water = (w, h, across) => {
      const c = document.createElement('canvas');
      c.width = w * N; c.height = h * N;
      const cg = c.getContext('2d'), rand = rng(across ? 31 : 47);
      for (let i = 0; i < 26; i++) {
        const along = rand() * 64 | 0, cross = 1 + (rand() * 8 | 0), len = 2 + (rand() * 6 | 0);
        cg.fillStyle = rand() < 0.15 ? '#b56f95' : (rand() < 0.5 ? '#3f55a0' : '#2c3a7c');
        for (const o of [0, -64]) {                        // wrap so the tile repeats cleanly
          if (across) cg.fillRect((along + o) * N, cross * N, len * N, N);
          else cg.fillRect(cross * N, (along + o) * N, N, len * N);
        }
      }
      return `url(${c.toDataURL()})`;
    };
    root.style.setProperty('--water-h', water(64, 10, true));
    root.style.setProperty('--water-v', water(10, 64, false));
  }

  /* ── Boot ─────────────────────────────────────────────────────── */

  const hero = document.querySelector('.hero');
  const scene = heroScene(document.getElementById('scene'), hero);
  drawSprites(scene.scale());

  let lastW = innerWidth, lastH = innerHeight, pending;
  addEventListener('resize', () => {
    // ignore the small height changes mobile browsers make when the URL bar hides
    if (innerWidth === lastW && Math.abs(innerHeight - lastH) < 120) return;
    clearTimeout(pending);
    pending = setTimeout(() => {
      lastW = innerWidth; lastH = innerHeight;
      scene.rebuild();
      drawSprites(scene.scale());
    }, 120);
  });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => { scene.rebuild(); drawSprites(scene.scale()); });   // hero height settles once fonts load
  }
})();
