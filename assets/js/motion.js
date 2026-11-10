/* Siwnin Productions — motion layer.
   Adds entrance, scroll-reveal, marquee, hover and count-up animations.
   Everything stays visible without JavaScript, and all motion is skipped
   for visitors who ask their system for reduced motion. */
(function () {
  'use strict';
  if (!('IntersectionObserver' in window)) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  var css = [
    '@keyframes sw-up{from{opacity:0;translate:0 32px}to{opacity:1;translate:0 0}}',
    '@keyframes sw-fade{from{opacity:0}to{opacity:1}}',
    '@keyframes sw-pan{from{background-position:50% 35%}to{background-position:50% 65%}}',
    '@keyframes sw-float{from{translate:0 0}to{translate:0 -14px}}',
    '@keyframes sw-mq{from{transform:translateX(0)}to{transform:translateX(-50%)}}',
    '@keyframes sw-pop{0%{opacity:0;scale:.86;translate:0 40px}100%{opacity:1;scale:1;translate:0 0}}',
    '.sw-hero{animation:sw-pan 26s ease-in-out infinite alternate}',
    '.sw-hero-in>*{animation:sw-up .9s cubic-bezier(.2,.7,.2,1) both}',
    '.sw-stack>*{animation:sw-pop 1.1s cubic-bezier(.2,.8,.2,1) both, sw-float 6s ease-in-out 1.2s infinite alternate}',
    '.sw-stack>*:nth-child(2){animation-delay:.35s, 2s;animation-duration:1.1s, 7s}',
    '.sw-rv{opacity:0;translate:0 36px;transition:opacity .9s cubic-bezier(.2,.7,.2,1), translate .9s cubic-bezier(.2,.7,.2,1)}',
    '.sw-rv.is-in{opacity:1;translate:0 0}',
    '.sw-mq-track{display:inline-block;animation:sw-mq 38s linear infinite;will-change:transform}',
    '.sw-mq-rev .sw-mq-track{animation-direction:reverse}',
    '.sw-card img{transition:transform .9s cubic-bezier(.2,.7,.2,1), filter .9s}',
    '.sw-card:hover img{transform:scale(1.06);filter:saturate(1.15)}',
    '.sw-card{transition:translate .5s cubic-bezier(.2,.7,.2,1), box-shadow .5s}',
    '.sw-card:hover{translate:0 -6px;box-shadow:0 18px 40px rgba(0,86,143,.28)}',
    '.sw-btn{transition:translate .25s, box-shadow .25s, background-color .25s}',
    '.sw-btn:hover{translate:0 -3px;box-shadow:0 10px 24px rgba(0,86,143,.35)}',
    '.sw-svc{transition:background-color .4s}',
    '.sw-svc:hover{background-color:rgba(43,143,219,.07)}',
    '.sw-svc h3{transition:translate .4s cubic-bezier(.2,.7,.2,1), color .4s}',
    '.sw-svc:hover h3{translate:10px 0;color:#2B8FDB}'
  ].join('\n');
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  function each(list, fn) { Array.prototype.forEach.call(list, fn); }

  /* Hero: staggered entrance for the headline column */
  var hero = document.querySelector('.sw-hero');
  if (hero && hero.firstElementChild) {
    var col = hero.firstElementChild;
    col.classList.add('sw-hero-in');
    each(col.children, function (el, i) { el.style.animationDelay = (0.15 + i * 0.12) + 's'; });
  }

  /* Marquee strips: duplicate the text and scroll it */
  var strips = [];
  each(document.querySelectorAll('p[aria-hidden="true"]'), function (p) {
    if (p.style.whiteSpace === 'nowrap' && p.style.overflow === 'hidden') strips.push(p);
  });
  strips.forEach(function (p, i) {
    var text = p.innerHTML;
    p.innerHTML = '<span class="sw-mq-track">' + text + '　' + text + '　</span>';
    if (i % 2) p.classList.add('sw-mq-rev');
  });

  /* Hover affordances */
  each(document.querySelectorAll('a[style*="border-radius: 10px"]'), function (a) { a.classList.add('sw-btn'); });
  var work = document.getElementById('p-work');
  if (work) {
    each(work.querySelectorAll('div[style*="flex-direction: column; border-radius: 24px; overflow: hidden"]'), function (c) {
      c.classList.add('sw-card');
    });
  }

  /* Scroll reveal */
  var targets = [];
  function add(el, delay) {
    if (!el || el.classList.contains('sw-rv')) return;
    el.classList.add('sw-rv');
    if (delay) el.style.transitionDelay = delay + 's';
    targets.push(el);
  }
  var what = document.getElementById('p-what');
  if (what) {
    each(what.children, function (el) { if (!el.classList.contains('sw-svc')) add(el); });
    each(what.querySelectorAll('.sw-svc'), function (el) { add(el); });
  }
  if (work) {
    each(work.children, function (el) {
      if (el.matches('p[aria-hidden="true"]')) return;
      if (el.style.display === 'grid') {
        each(el.children, function (c, i) { add(c, (i % 2) * 0.12); });
      } else {
        add(el);
      }
    });
  }
  var how = document.getElementById('p-how');
  if (how) {
    each(how.querySelectorAll('[style*="grid"] > *'), function (c, i) { add(c, i * 0.12); });
  }
  var foot = document.querySelector('.sw-foot');
  if (foot) add(foot);

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
  targets.forEach(function (t) { io.observe(t); });

  /* Count-up for the big numbers */
  var nums = [];
  each(document.querySelectorAll('.sw-num, #p-work p[style*="font-family: Anton"]'), function (el) {
    var node = el.firstChild;
    if (!node || node.nodeType !== 3) return;
    var m = node.nodeValue.match(/^([\d,.]+)(.*)$/);
    if (!m) return;
    var raw = m[1], target = parseFloat(raw.replace(/,/g, ''));
    if (!isFinite(target) || target === 0) return;
    var decimals = (raw.split('.')[1] || '').length, comma = raw.indexOf(',') > -1;
    nums.push({ node: node, target: target, decimals: decimals, comma: comma, rest: m[2], el: el });
  });
  function fmt(n, d, comma) {
    var s = n.toFixed(d);
    if (comma) { var parts = s.split('.'); parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); s = parts.join('.'); }
    return s;
  }
  var cio = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      cio.unobserve(e.target);
      var item = nums.filter(function (n) { return n.el === e.target; })[0];
      if (!item) return;
      var start = null, dur = 1400;
      function step(ts) {
        if (start === null) start = ts;
        var t = Math.min(1, (ts - start) / dur), eased = 1 - Math.pow(1 - t, 3);
        item.node.nodeValue = fmt(item.target * eased, item.decimals, item.comma) + item.rest;
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.4 });
  nums.forEach(function (n) { cio.observe(n.el); });
})();
