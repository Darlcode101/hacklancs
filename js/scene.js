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
    const rand = rng(1351);
    const COURSE = ['#62548f', '#4b3f72'];
    // a stone block with coursing, a corbel band under the battlements and a shaded foot
    const tower = (dx, w, h, up = 0) => {
      const X = x + dx, yb = by - up, y = yb - h;
      block(g, X, yb, w, h, CASTLE);
      for (let i = 0; i < w * h / 12; i++) {
        const sx = X + 1 + (rand() * (w - 4) | 0), sy = y + 4 + (rand() * Math.max(1, h - 6) | 0);
        px(g, sx, sy, 2, 1, COURSE[rand() < 0.5 ? 0 : 1]);
      }
      if (h > 8) {
        px(g, X + 1, y + 2, w - 1, 1, CASTLE.dark);
        for (let i = 1; i < w - 1; i += 2) px(g, X + i, y + 3, 1, 1, CASTLE.dark);
      }
      if (!up) px(g, X, yb - 1, w, 1, CASTLE.dark);
    };
    const slit = (dx, up) => px(g, x + dx, by - up - 3, 1, 3, '#221a45');

    tower(10, 22, 34);                                     // keep
    tower(24, 6, 6, 34);                                   // its corner turret
    flag(g, x + 26, by - 42);
    tower(0, 10, 20);                                      // west tower
    tower(0, 66, 12);                                      // curtain wall
    for (const dx of [13, 31]) {                           // buttresses
      px(g, x + dx, by - 9, 1, 9, CASTLE.light);
      px(g, x + dx + 1, by - 9, 1, 9, CASTLE.dark);
    }
    slit(18, 4); slit(24, 4); slit(35, 4); slit(7, 4);
    tower(40, 6, 5, 26);                                   // gatehouse turrets
    tower(58, 6, 5, 26);
    tower(38, 10, 26);                                     // gatehouse towers
    tower(56, 10, 26);
    tower(48, 8, 21);                                      // gate passage
    px(g, x + 38, by - 14, 28, 1, CASTLE.dark);            // string course
    px(g, x + 38, by - 15, 28, 1, '#62548f');

    px(g, x + 49, by - 9, 1, 9, CASTLE.light);             // pointed gate arch
    px(g, x + 54, by - 9, 1, 9, CASTLE.dark);
    px(g, x + 50, by - 10, 4, 1, CASTLE.light);
    px(g, x + 51, by - 11, 2, 1, CASTLE.light);
    px(g, x + 50, by - 9, 4, 9, INK);
    px(g, x + 51, by - 10, 2, 1, INK);
    px(g, x + 51, by - 6, 2, 6, '#f6a65a');                // torchlight inside
    px(g, x + 51, by - 8, 2, 2, '#b86f4a');
    px(g, x + 50, by - 9, 1, 2, '#3b3162'); px(g, x + 53, by - 9, 1, 2, '#3b3162');   // portcullis teeth
    px(g, x + 47, by - 7, 1, 1, '#f6a65a'); px(g, x + 56, by - 7, 1, 1, '#f6a65a');   // lamps by the gate

    const w = (dx, dy, ww, hh) => wins.push({ x: x + dx, y: by - dy, w: ww, h: hh });
    w(14, 27, 2, 3); w(20, 27, 2, 3); w(26, 27, 2, 3);
    w(17, 19, 2, 3); w(23, 19, 2, 3);
    w(4, 14, 1, 3);
    w(42, 21, 2, 3); w(60, 21, 2, 3);
    w(42, 11, 1, 2); w(61, 11, 1, 2);
    w(51, 18, 2, 2);
    slit(3, 6); slit(44, 4); slit(62, 4);
  }

  // Ashton Memorial: stair and terrace, porticoed lower storey with corner cupolas,
  // colonnaded upper storey, drum, ribbed copper dome and lantern.
  // cx is the centre line; about 46 wide and 61 tall.
  function drawMemorial(g, cx, by, wins) {
    const cr = (w, up, h, c) => px(g, cx - w / 2, by - up - h, w, h, c);
    const at = (dx, up, w, h, c) => px(g, cx + dx, by - up - h, w, h, c);
    const w = (dx, up, ww, hh) => wins.push({ x: cx + dx, y: by - up - hh, w: ww, h: hh });
    const SHADE = '#a394c6', DEEP = '#6f609b', DOOR = '#2a2050';

    cr(46, 0, 2, PALE.dark); cr(46, 1, 1, PALE.mid);        // terrace steps
    cr(40, 2, 2, PALE.mid);  cr(40, 3, 1, PALE.light);
    cr(34, 4, 2, PALE.dark); cr(34, 5, 1, PALE.mid);
    cr(10, 0, 6, PALE.light);                              // the stair up the middle
    for (const up of [1, 3, 5]) cr(10, up, 1, SHADE);
    at(-6, 0, 1, 6, PALE.dark); at(5, 0, 1, 6, PALE.dark);

    cr(30, 6, 12, PALE.mid);                               // lower storey
    at(-15, 6, 3, 12, PALE.light); at(12, 6, 3, 12, SHADE); // corner piers
    at(13, 6, 2, 12, PALE.dark);
    cr(24, 10, 1, SHADE);                                  // rustication
    for (const dx of [-11, 9]) {                           // arched side windows
      at(dx - 1, 8, 4, 6, PALE.dark); at(dx, 14, 2, 1, PALE.dark);
      w(dx, 8, 2, 5);
    }
    cr(12, 6, 12, PALE.light);                             // portico
    for (const dx of [-6, -4, 3, 5]) at(dx, 6, 1, 12, '#f3ecfa');
    at(-5, 6, 1, 12, SHADE); at(4, 6, 1, 12, SHADE);
    at(-2, 6, 4, 8, DOOR); at(-1, 14, 2, 1, DOOR);
    w(-1, 6, 2, 6);
    cr(34, 18, 1, PALE.dark);                              // entablature and cornice
    cr(36, 19, 1, PALE.light);
    for (let dx = -17; dx < 17; dx += 2) at(dx, 18, 1, 1, SHADE);

    for (let dx = -15; dx < 15; dx += 2) at(dx, 20, 1, 2, PALE.mid);   // balustrade
    cr(30, 22, 1, PALE.light);
    for (const dx of [-17, 11]) {                          // corner cupolas
      at(dx + 1, 20, 4, 4, PALE.mid); at(dx + 1, 20, 1, 4, PALE.light); at(dx + 4, 20, 1, 4, PALE.dark);
      at(dx + 2, 21, 2, 2, DOOR);
      at(dx, 24, 6, 1, COPPER.dark);
      at(dx + 1, 25, 4, 1, COPPER.mid); at(dx + 1, 25, 1, 1, COPPER.light);
      at(dx + 2, 26, 2, 1, COPPER.mid);
      at(dx + 2, 27, 1, 2, PALE.light);
    }

    cr(20, 20, 10, DEEP);                                  // upper storey: columns before shadow
    for (const dx of [-10, -7, -4, 3, 6, 9]) at(dx, 20, 1, 10, dx > 4 ? SHADE : PALE.light);
    at(-3, 20, 6, 10, PALE.mid);                           // centre bay
    at(-2, 21, 4, 7, DOOR); at(-1, 28, 2, 1, DOOR);
    w(-6, 22, 2, 5); w(-1, 21, 2, 6); w(4, 22, 2, 5);
    cr(22, 20, 1, PALE.light);
    cr(24, 30, 1, PALE.dark); cr(26, 31, 1, PALE.light);
    for (let dx = -12; dx < 12; dx += 2) at(dx, 30, 1, 1, SHADE);
    for (const [wd, up] of [[10, 20], [6, 21], [2, 22]]) cr(wd, up, 1, PALE.light);   // pediment over the portico
    cr(12, 19, 1, '#f3ecfa');

    cr(16, 32, 5, PALE.mid);                               // drum
    for (const dx of [-8, -4, 3]) at(dx, 32, 1, 5, PALE.light);
    at(6, 32, 2, 5, PALE.dark);
    w(-6, 33, 1, 3); w(-1, 33, 2, 3); w(4, 33, 1, 3);
    cr(18, 37, 1, PALE.light);
    cr(20, 38, 1, COPPER.dark);

    const RIB = '#4a8478';
    for (let i = 0; i < 11; i++) {                         // dome
      const hw = Math.round(10 * Math.sqrt(1 - (i / 11) ** 2));
      const up = 39 + i;
      at(-hw, up, hw * 2, 1, COPPER.mid);
      at(-hw, up, Math.max(1, Math.round(hw / 3)), 1, COPPER.light);
      at(hw - Math.round(hw * 0.45), up, Math.round(hw * 0.45), 1, COPPER.dark);
      for (const k of [-0.45, 0.05, 0.5]) at(Math.round(k * hw), up, 1, 1, RIB);
    }
    at(-5, 45, 2, 1, '#b8e6d0'); at(-4, 46, 1, 1, '#b8e6d0');   // where the last light catches it

    cr(6, 50, 1, PALE.light);                              // lantern
    cr(4, 51, 4, PALE.mid); at(1, 51, 1, 4, PALE.dark);
    w(-1, 52, 2, 2);
    cr(6, 55, 1, PALE.light);
    cr(4, 56, 1, COPPER.mid); cr(2, 57, 1, COPPER.light);
    cr(2, 58, 3, PALE.light);
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

    drawCanals(N);
  }

  /* ── Canal ────────────────────────────────────────────────────────
   * One canvas per section, in art pixels. The course is a list of points; every
   * pixel within 5 of it is water, the next two are bank. Water is split into
   * stretches that run down and stretches that run across so each can flow its
   * own way. Bridges sit on top. */

  const CANAL = { water: '#1a2356', bank: '#574b80', edge: '#7c6fa3' };
  const still = matchMedia('(prefers-reduced-motion: reduce)');
  const canals = new Map();          // .canal element -> state
  const scratch = document.createElement('canvas');
  let canalStep = 0, canalScale = 0, tileDown, tileAcross;

  function waterTile(across) {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d'), rand = rng(across ? 31 : 47);
    px(g, 0, 0, 64, 64, CANAL.water);
    for (let i = 0; i < 95; i++) {
      const along = rand() * 64 | 0, cross = rand() * 64 | 0, len = 3 + (rand() * 5 | 0);
      g.fillStyle = rand() < 0.07 ? '#b56f95' : (rand() < 0.4 ? '#3f55a0' : '#2c3a7c');
      for (const o of [0, -64]) {                          // wrap so the tile repeats cleanly
        if (across) g.fillRect(along + o, cross, len, 1);
        else g.fillRect(cross, along + o, 1, len);
      }
    }
    return c;
  }

  // A small stone footbridge centred on (cx, cy). `ns` = it runs north-south, over water flowing across.
  function drawBridge(g, cx, cy, ns) {
    const L = 22, Wd = 11;
    const r = (a, b, la, lb, col) => {                     // a = along the bridge, b = across it
      if (ns) px(g, cx - 5 + b, cy - 11 + a, lb, la, col);
      else px(g, cx - 11 + a, cy - 5 + b, la, lb, col);
    };
    r(4, Wd, L - 8, 2, 'rgba(6, 8, 30, 0.5)');             // shadow on the water
    r(0, 0, L, Wd, '#2a2152');                             // outline
    r(0, 2, L, Wd - 4, '#8f83b8');                         // deck
    r(6, 2, L - 12, Wd - 4, '#a79bd0');                    // the hump catches the light
    for (let a = 3; a < L - 3; a += 4) r(a, 2, 1, Wd - 4, '#7f73aa');   // paving joints
    r(1, 0, L - 2, 2, '#6a5e99'); r(1, 0, L - 2, 1, '#c9bfe6');         // lit parapet
    r(1, Wd - 2, L - 2, 2, '#574b80'); r(1, Wd - 1, L - 2, 1, '#3d3270'); // shaded parapet
    for (const a of [0, L - 3]) for (const b of [-1, Wd - 2]) {         // end posts with lamps
      r(a, b, 3, 3, '#2a2152'); r(a, b, 2, 2, '#d7cff0'); r(a, b, 1, 1, '#ffd36b');
    }
  }

  function buildCanal(el, N) {
    const sec = el.parentElement;
    const w = Math.ceil(sec.clientWidth / N), h = Math.ceil(sec.clientHeight / N);
    if (w < 8 || h < 30) return;
    let st = canals.get(el);
    if (!st) {
      const c = document.createElement('canvas');
      el.appendChild(c);
      st = { c, g: c.getContext('2d'), visible: true };
      canals.set(el, st);
      if (canalWatch) canalWatch.observe(el);
      if (canalSize) canalSize.observe(sec);
    }
    st.c.width = w; st.c.height = h;
    st.c.style.width = w * N + 'px'; st.c.style.height = h * N + 'px';
    st.w = w; st.h = h;

    const left = el.classList.contains('canal--left');
    const s = left ? 1 : -1;                               // which way the water crosses
    const next = sec.nextElementSibling;
    const last = !(next && next.querySelector(':scope > .canal'));
    const prev = sec.previousElementSibling;
    const first = !(prev && prev.querySelector(':scope > .canal'));   // nothing upstream: enter from the page edge
    const margin = (sec.clientWidth - 1080) / 2 / N;       // gutter beside the text column
    const wide = sec.clientWidth >= 1320;
    const pts = [], bridges = [];
    const TAU = Math.PI * 2;

    if (wide) {
      const R = 12, yb = h - R;
      const xin = Math.round(left ? margin / 2 : w - margin / 2);
      const xout = w - xin;
      const sway = Math.max(0, Math.min(4, Math.floor(margin / 2 - 9)));
      const run = yb - R, bends = Math.max(1, Math.round(run / 38));
      const xv = (y) => xin + s * sway * Math.sin(Math.PI * bends * y / run);
      if (!first) {
        for (let y = -4; y < run; y += 0.5) pts.push([xv(y), y]);
        for (let t = 0; t <= 1; t += 0.03) {               // sweep round into the crossing
          const a = t * Math.PI / 2;
          pts.push([xin + s * R - s * R * Math.cos(a), run + R * Math.sin(a)]);
        }
      }
      const x0 = first ? (s > 0 ? -12 : w + 12) : xin + s * R, x1 = last ? (s > 0 ? w + 12 : -12) : xout - s * R;
      const len = Math.abs(x1 - x0), waves = Math.max(2, Math.round(len / 44));
      const yh = (u) => yb + 2 * Math.sin(Math.PI * waves * u);
      for (let d = 0; d <= len; d += 0.5) pts.push([x0 + s * d, yh(d / len)]);
      if (!last) {
        for (let t = 0; t <= 1; t += 0.03) {               // and round again to head down the far side
          const a = t * Math.PI / 2;
          pts.push([xout - s * R + s * R * Math.sin(a), yb + R - R * Math.cos(a)]);
        }
        for (let y = yb + R; y < h + 4; y += 0.5) pts.push([xout, y]);
      }
      const by = Math.round(run * 0.45);
      if (run > 70 && !first) bridges.push([Math.round(xv(by)), by, false]);
      bridges.push([Math.round(x0 + s * len * (last ? 0.4 : 0.5)), Math.round(yh(last ? 0.4 : 0.5)), true]);
    } else {
      const yb = h - 11, phase = left ? 0 : Math.PI;
      const yh = (x) => yb + 3 * Math.sin(TAU * x / 56 + phase);
      for (let d = -12; d <= w + 12; d += 0.5) { const x = s > 0 ? d : w - d; pts.push([x, yh(x)]); }
      const bx = Math.round(w * (left ? 0.72 : 0.28));
      bridges.push([bx, Math.round(yh(bx)), true]);
    }

    // nearest-point distance for every pixel near the course
    const dist = new Float32Array(w * h).fill(99), down = new Uint8Array(w * h);
    for (let i = 0; i < pts.length; i++) {
      const [x, y] = pts[i], q = pts[Math.min(i + 1, pts.length - 1)], p = pts[Math.max(i - 1, 0)];
      const isDown = Math.abs(q[1] - p[1]) >= Math.abs(q[0] - p[0]) ? 1 : 0;
      const xa = Math.max(0, Math.floor(x - 9)), xb = Math.min(w - 1, Math.ceil(x + 9));
      const ya = Math.max(0, Math.floor(y - 9)), yc = Math.min(h - 1, Math.ceil(y + 9));
      for (let yy = ya; yy <= yc; yy++) for (let xx = xa; xx <= xb; xx++) {
        const d = Math.hypot(xx + 0.5 - x, yy + 0.5 - y), k = yy * w + xx;
        if (d < dist[k]) { dist[k] = d; down[k] = isDown; }
      }
    }
    const layer = () => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
    st.maskDown = layer(); st.maskAcross = layer(); st.over = layer();
    const gd = st.maskDown.getContext('2d'), ga = st.maskAcross.getContext('2d'), go = st.over.getContext('2d');
    for (let k = 0; k < dist.length; k++) {
      const d = dist[k];
      if (d > 8) continue;
      const x = k % w, y = (k - x) / w;
      if (d <= 5) {
        px(down[k] ? gd : ga, x, y, 1, 1, '#000');
        if (d > 4) px(go, x, y, 1, 1, 'rgba(6, 8, 30, 0.4)');          // deeper shade under the bank
      } else if (d <= 7) px(go, x, y, 1, 1, d <= 6 ? CANAL.bank : CANAL.edge);
      else px(go, x, y, 1, 1, 'rgba(0, 0, 0, 0.22)');                   // seats the bank on the ground
    }
    // lily pads at the water's edge and reeds on the bank, away from the bridges
    const rand = rng(w * 7 + h);
    for (let i = 30 + (rand() * 40 | 0); i < pts.length - 30; i += 50 + (rand() * 90 | 0)) {
      const [x, y] = pts[i], q = pts[i + 1];
      const tx = q[0] - x, ty = q[1] - y, tl = Math.hypot(tx, ty) || 1, side = rand() < 0.5 ? 1 : -1;
      const nx = -ty / tl * side, ny = tx / tl * side;
      if (bridges.some(([bx, by]) => Math.hypot(bx - x, by - y) < 18)) continue;
      if (rand() < 0.55) {
        const lx = Math.round(x + nx * 3), ly = Math.round(y + ny * 3);
        px(go, lx, ly, 2, 1, '#4f8f72'); px(go, lx, ly, 1, 1, '#86c9a1');
      } else {
        const rx = Math.round(x + nx * 6.5), ry = Math.round(y + ny * 6.5);
        px(go, rx, ry - 2, 1, 3, '#5fa07f'); px(go, rx + 1, ry - 1, 1, 2, '#4f8f72'); px(go, rx, ry - 3, 1, 1, '#c98f6b');
      }
    }
    bridges.forEach(([x, y, ns]) => drawBridge(go, x, y, ns));
    st.dir = s;
    paintCanal(st);
  }

  function paintCanal(st) {
    const { g, w, h } = st;
    if (scratch.width !== w || scratch.height !== h) { scratch.width = w; scratch.height = h; }
    const t = scratch.getContext('2d');
    g.clearRect(0, 0, w, h);
    const flow = (mask, tile, ox, oy) => {
      t.globalCompositeOperation = 'source-over';
      t.clearRect(0, 0, w, h);
      t.drawImage(mask, 0, 0);
      t.globalCompositeOperation = 'source-in';
      t.fillStyle = t.createPattern(tile, 'repeat');
      t.save(); t.translate(ox, oy); t.fillRect(-ox, -oy, w, h); t.restore();
      g.drawImage(scratch, 0, 0);
    };
    const k = canalStep % 64;
    flow(st.maskDown, tileDown, 0, k);
    flow(st.maskAcross, tileAcross, st.dir > 0 ? k : 64 - k, 0);
    g.drawImage(st.over, 0, 0);
  }

  const canalWatch = 'IntersectionObserver' in window
    ? new IntersectionObserver((es) => es.forEach((e) => { const st = canals.get(e.target); if (st) st.visible = e.isIntersecting; }), { rootMargin: '100px' })
    : null;
  let canalPending;
  const canalSize = 'ResizeObserver' in window
    ? new ResizeObserver(() => {                           // e.g. an FAQ opening makes its section taller
        clearTimeout(canalPending);
        canalPending = setTimeout(() => {
          canals.forEach((st, el) => {
            const sec = el.parentElement;
            if (Math.ceil(sec.clientHeight / canalScale) !== st.h || Math.ceil(sec.clientWidth / canalScale) !== st.w) buildCanal(el, canalScale);
          });
        }, 60);
      })
    : null;

  function drawCanals(N) {
    canalScale = N;
    if (!tileDown) { tileDown = waterTile(false); tileAcross = waterTile(true); }
    document.querySelectorAll('.section > .canal').forEach((el) => buildCanal(el, N));
  }

  setInterval(() => {
    if (document.hidden || still.matches) return;
    canalStep++;
    canals.forEach((st) => { if (st.visible) paintCanal(st); });
  }, 250);

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
