/* ============================================================
   BIRTHDAY GREETING — one day only
   ------------------------------------------------------------
   SETTINGS: change these two lines and nothing else.

     BIRTHDAY  the date it should appear, as YYYY-MM-DD
     AUDIENCE  'private' -> only shows on drhiralhalani.com/?hbd
               'everyone' -> shows to every visitor that day

   It disables itself automatically after the date. To remove it
   for good, delete the <script> line from index.html.
   ============================================================ */
(function () {
  'use strict';

  var BIRTHDAY = '2026-08-28';
  var AUDIENCE = 'private';        // 'private' or 'everyone'

  // ---- should it run? -------------------------------------------------
  var now = new Date();
  var today = now.getFullYear() + '-' +
              String(now.getMonth() + 1).padStart(2, '0') + '-' +
              String(now.getDate()).padStart(2, '0');
  if (today !== BIRTHDAY) return;

  var asked = /[?&]hbd\b/.test(window.location.search);
  if (AUDIENCE === 'private' && !asked) return;

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- styles ---------------------------------------------------------
  var css = document.createElement('style');
  css.textContent = [
    '#hbd{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;',
    'background:radial-gradient(120% 90% at 50% 10%,#123449 0%,#0B1F2E 55%,#07131D 100%);',
    'opacity:0;animation:hbdIn .7s ease forwards;padding:1.5rem;overflow:hidden}',
    '@keyframes hbdIn{to{opacity:1}}',
    '@keyframes hbdOut{to{opacity:0;visibility:hidden}}',
    '#hbd.closing{animation:hbdOut .45s ease forwards}',
    '#hbd canvas{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}',
    '#hbd .card{position:relative;text-align:center;max-width:760px;z-index:2}',
    '#hbd .garland{width:min(88vw,620px);margin:0 auto 2rem;display:block;overflow:visible}',
    '#hbd .garland path{fill:none;stroke:#6FD0CB;stroke-width:2.4;stroke-linecap:round}',
    '#hbd .garland .beat{stroke:#F0B429;stroke-width:3.2}',
    '#hbd h1{font-family:"Fraunces",Georgia,serif;font-weight:600;color:#fff;',
    'font-size:clamp(2.1rem,7vw,4.6rem);line-height:1.08;letter-spacing:-.02em;margin:0 0 1.1rem}',
    '#hbd h1 span{display:inline-block;opacity:0;transform:translateY(26px) rotate(-4deg);',
    'animation:hbdWord .85s cubic-bezier(.2,.9,.3,1.3) forwards}',
    '@keyframes hbdWord{to{opacity:1;transform:none}}',
    '#hbd .gold{background:linear-gradient(100deg,#F0B429,#FFE9A8 45%,#F0B429);',
    '-webkit-background-clip:text;background-clip:text;color:transparent}',
    '#hbd p.sub{font-family:"Public Sans",system-ui,sans-serif;color:#A9C2CC;',
    'font-size:clamp(1rem,2.4vw,1.3rem);line-height:1.5;max-width:30ch;margin:0 auto 2.2rem;opacity:0;',
    'animation:hbdWord .8s ease 1.15s forwards}',
    '#hbd .cake{font-size:clamp(2.4rem,8vw,4rem);display:block;margin-bottom:1.2rem;',
    'animation:hbdBob 2.6s ease-in-out infinite}',
    '@keyframes hbdBob{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-12px) rotate(2deg)}}',
    '#hbd button{font-family:"Public Sans",system-ui,sans-serif;font-size:.95rem;font-weight:600;',
    'background:#fff;color:#0B1F2E;border:0;border-radius:100px;padding:.85rem 2rem;cursor:pointer;',
    'opacity:0;animation:hbdWord .8s ease 1.5s forwards}',
    '#hbd button:hover{background:#6FD0CB}',
    '#hbd .timer{position:absolute;left:0;right:0;bottom:0;height:3px;background:rgba(255,255,255,.12)}',
    '#hbd .timer i{display:block;height:100%;background:#F0B429;width:100%;transform-origin:left;',
    'animation:hbdTick 10s linear forwards}',
    '@keyframes hbdTick{from{transform:scaleX(1)}to{transform:scaleX(0)}}',
    '#hbd .skip{position:absolute;top:1.2rem;right:1.4rem;background:none;color:#7F9AA6;',
    'font-size:.8rem;padding:.5rem;border-radius:4px;animation-delay:2s}',
    '#hbd .skip:hover{background:none;color:#fff}',
    '@media(prefers-reduced-motion:reduce){#hbd *{animation-duration:.01ms!important;opacity:1!important;transform:none!important}}'
  ].join('');
  document.head.appendChild(css);

  // ---- markup ---------------------------------------------------------
  var words = ['Happy', 'Birthday'];
  var gold = ['Dr.', 'Hiral!'];
  var html = '';
  words.forEach(function (w, i) {
    html += '<span style="animation-delay:' + (0.15 + i * 0.13) + 's">' + w + '</span> ';
  });
  html += '<br>';
  gold.forEach(function (w, i) {
    html += '<span class="gold" style="animation-delay:' + (0.45 + i * 0.13) + 's">' + w + '</span> ';
  });

  var wrap = document.createElement('div');
  wrap.id = 'hbd';
  wrap.setAttribute('role', 'dialog');
  wrap.setAttribute('aria-label', 'Birthday greeting');
  wrap.innerHTML =
    '<canvas></canvas>' +
    '<div class="card">' +
      '<span class="cake" aria-hidden="true">🎂</span>' +
      '<svg class="garland" viewBox="0 0 600 60" aria-hidden="true">' +
        '<path d="M0,40 H150"/>' +
        '<path class="beat" d="M150,40 l16,0 l10,-26 l14,46 l12,-34 l10,14 l16,0"/>' +
        '<path d="M228,40 H300"/>' +
        '<path class="beat" d="M300,40 l16,0 l10,-26 l14,46 l12,-34 l10,14 l16,0"/>' +
        '<path d="M378,40 H600"/>' +
      '</svg>' +
      '<h1>' + html + '</h1>' +
      '<p class="sub">We are thankful for your service to the community. Thank you.</p>' +
      '<button type="button" class="go">Continue to the website →</button>' +
    '</div>' +
    '<button type="button" class="skip" aria-label="Close">Skip</button>' +
    '<div class="timer" aria-hidden="true"><i></i></div>';
  document.body.appendChild(wrap);
  document.body.style.overflow = 'hidden';

  // ---- confetti -------------------------------------------------------
  if (!REDUCED) {
    var cv = wrap.querySelector('canvas');
    var ctx = cv.getContext('2d');
    var W, H, bits = [];
    var COLORS = ['#F0B429', '#6FD0CB', '#FFFFFF', '#E86A5B', '#FFE9A8'];

    function size() { W = cv.width = wrap.clientWidth; H = cv.height = wrap.clientHeight; }
    size();
    window.addEventListener('resize', size);

    for (var i = 0; i < 130; i++) {
      bits.push({
        x: Math.random() * W,
        y: Math.random() * -H,
        w: 6 + Math.random() * 7,
        h: 9 + Math.random() * 10,
        c: COLORS[(Math.random() * COLORS.length) | 0],
        vy: 1.1 + Math.random() * 2.4,
        vx: -0.7 + Math.random() * 1.4,
        rot: Math.random() * Math.PI,
        vr: -0.06 + Math.random() * 0.12
      });
    }

    var running = true;
    (function tick() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < bits.length; i++) {
        var b = bits[i];
        b.y += b.vy; b.x += b.vx; b.rot += b.vr;
        if (b.y > H + 20) { b.y = -20; b.x = Math.random() * W; }
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.rot);
        ctx.fillStyle = b.c;
        ctx.globalAlpha = 0.9;
        ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h * (0.5 + Math.abs(Math.cos(b.rot)) * 0.5));
        ctx.restore();
      }
      requestAnimationFrame(tick);
    })();
    wrap.addEventListener('hbdclose', function () { running = false; });
  }

  // ---- dismiss --------------------------------------------------------
  function close() {
    wrap.classList.add('closing');
    wrap.dispatchEvent(new CustomEvent('hbdclose'));
    document.body.style.overflow = '';
    setTimeout(function () { wrap.remove(); }, 500);
  }
  var auto = setTimeout(close, 10000);
  function closeNow() { clearTimeout(auto); close(); }

  wrap.querySelector('.go').addEventListener('click', closeNow);
  wrap.querySelector('.skip').addEventListener('click', closeNow);
  document.addEventListener('keydown', function esc(e) {
    if (e.key === 'Escape') { closeNow(); document.removeEventListener('keydown', esc); }
  });
})();
