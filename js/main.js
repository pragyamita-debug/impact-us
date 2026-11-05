/* ImpactUs — interactions (shared by every page) */
(function () {
  'use strict';

  /* ---------------- CONFIG ----------------
     FORM_ENDPOINT: paste a Formspree / Google Apps Script / any POST URL here
     to receive applications. Leave empty to just show the success message. */
  var FORM_ENDPOINT = '';

  var root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var params = new URLSearchParams(location.search);

  /* ---------- theme switcher (kept across pages) ---------- */
  var themeColors = { midnight: '#0b0b0e', lavender: '#faf7ff', sage: '#fbf8f0' };
  function carryTheme(t) {
    // add ?theme=… to every internal page link, so the theme follows you even where storage is blocked
    $$('a[href$=".html"], a[href*=".html?"]').forEach(function (a) {
      var href = a.getAttribute('href');
      if (/^https?:/.test(href)) return;
      var parts = href.split('#'), base = parts[0], hash = parts[1] ? '#' + parts[1] : '';
      var q = base.indexOf('?') > -1 ? base.slice(base.indexOf('?') + 1) : '';
      var path = base.split('?')[0];
      var sp = new URLSearchParams(q); sp.set('theme', t);
      a.setAttribute('href', path + '?' + sp.toString() + hash);
    });
  }
  function setTheme(t, save) {
    root.setAttribute('data-theme', t);
    $$('[data-set-theme]').forEach(function (b) { b.setAttribute('aria-checked', String(b.dataset.setTheme === t)); });
    var m = $('meta[name="theme-color"]'); if (m) m.setAttribute('content', themeColors[t]);
    if (save) { try { localStorage.setItem('impactus-theme', t); } catch (e) {} }
    carryTheme(t);
  }
  setTheme(root.getAttribute('data-theme') || 'midnight', false);
  $$('[data-set-theme]').forEach(function (b) {
    b.addEventListener('click', function () {
      setTheme(b.dataset.setTheme, true);
      try { var u = new URL(location.href); u.searchParams.set('theme', b.dataset.setTheme); history.replaceState(null, '', u); } catch (e) {}
    });
  });

  /* ---------- nav ---------- */
  var nav = $('#nav'), burger = $('#burger'), links = $('#navLinks');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('is-scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }
  if (burger && links) {
    burger.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
    });
  }

  /* ---------- page-leave fade (feels like a new page opening) ---------- */
  if (!reduceMotion) {
    $$('a[href]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var href = a.getAttribute('href');
        if (!href || href.charAt(0) === '#' || /^(https?:|mailto:|tel:)/.test(href) || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        document.body.classList.add('is-leaving');
        setTimeout(function () { location.href = a.href; }, 220);
      });
    });
    window.addEventListener('pageshow', function () { document.body.classList.remove('is-leaving'); });
  }

  /* ---------- reveal on scroll ---------- */
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var el = e.target, sib = Array.prototype.indexOf.call(el.parentNode.children, el);
          el.style.transitionDelay = Math.min(sib, 5) * 70 + 'ms';
          el.classList.add('in'); io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- count-up numbers ---------- */
  function countUp(el, to, dur) {
    if (reduceMotion) { el.textContent = to.toLocaleString(); return; }
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1), v = Math.round(to * (1 - Math.pow(1 - p, 3)));
      el.textContent = v.toLocaleString();
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var cEl = $('[data-count]');
  if (cEl) {
    if ('IntersectionObserver' in window) {
      var cio = new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) { countUp(cEl, +cEl.dataset.count, 1800); cio.disconnect(); }
      }, { threshold: 0.5 });
      cio.observe(cEl);
    } else { cEl.textContent = cEl.dataset.count; }
  }

  /* ---------- word-by-word scroll highlight ---------- */
  $$('[data-scrub]').forEach(function (el) {
    var keys = ['none.', 'activate', 'all', '3?'];
    el.innerHTML = el.textContent.trim().split(/\s+/).map(function (w) {
      return '<span class="w' + (keys.indexOf(w) > -1 ? ' key' : '') + '">' + w + '</span>';
    }).join(' ');
    var words = $$('.w', el);
    function update() {
      var r = el.getBoundingClientRect(), vh = window.innerHeight;
      var p = (vh * 0.85 - r.top) / (vh * 0.45);
      var n = Math.round(Math.max(0, Math.min(1, p)) * words.length);
      words.forEach(function (w, i) { w.classList.toggle('on', i < n); });
    }
    if (reduceMotion) words.forEach(function (w) { w.classList.add('on'); });
    else { window.addEventListener('scroll', update, { passive: true }); update(); }
  });

  /* ---------- story modal (Success Stories page) ---------- */
  var modal = $('#storyModal');
  if (modal) {
    var stories = {
      smith: {
        tag: 'Story 01 · The applicant', title: 'Smith applied to 1,000+ jobs. Didn’t get a single response.',
        img: 'assets/img/smith.jpg',
        text: 'Smith had the degree and the skills. He sent his CV everywhere — job portals, careers pages, cold emails. But a PDF CV in a pile of thousands is invisible. No one could search for him, see his work, or trust what he could do.',
        points: ['No proof of work online', 'Not visible when recruiters search', 'No network to vouch for him']
      },
      sandra: {
        tag: 'Story 02 · The hustler', title: 'Sandra did more. She sent personal follow-ups with clients. Yet silence stayed.',
        img: 'assets/img/sandra.jpg',
        text: 'Sandra went further: personalised messages, follow-ups, freelance pitches. But when clients looked her up, there was nothing to find — no portfolio, no presence, no reason to reply.',
        points: ['Effort without visibility', 'Clients couldn’t verify her skills', 'Outreach with no system behind it']
      },
      kabir: {
        tag: 'Story 03 · The discovered', title: 'Kabir flipped the script. He stopped searching & started getting discovered.',
        img: 'assets/img/kabir.jpg',
        text: 'Kabir joined ImpactUs. His CV became a personal website, his expert ranked it on Google with SEO and digital marketing, and his LinkedIn started working for him. Instead of chasing opportunities, employers and clients started finding him — and he landed his first interview.',
        points: ['Proof: a portfolio website that ranks', 'Visibility: found on Google for his name & role', 'Network: outreach CRM + expert coaching']
      }
    };
    var lastFocus = null;
    var openStory = function (key) {
      var s = stories[key]; if (!s) return;
      $('#storyImg').src = s.img; $('#storyImg').alt = key;
      $('#storyTag').textContent = s.tag; $('#storyTitle').textContent = s.title; $('#storyText').textContent = s.text;
      $('#storyPoints').innerHTML = s.points.map(function (p) { return '<li>' + p + '</li>'; }).join('');
      lastFocus = document.activeElement;
      modal.classList.add('is-open'); modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      $('.modal__x', modal).focus();
    };
    var closeModal = function () {
      modal.classList.remove('is-open'); modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    };
    $$('[data-story]').forEach(function (b) { b.addEventListener('click', function () { openStory(b.dataset.story); }); });
    $$('[data-close]', modal).forEach(function (b) { b.addEventListener('click', closeModal); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal(); });
  }

  /* ---------- How-it-works walkthrough player ---------- */
  var player = $('#player');
  if (player) {
    var scenes = $$('.scene', player), stepEls = $$('#steps li');
    var captions = [
      'We build your personal website',
      'Optimize it with SEO & digital marketing',
      'Get it ranked on Google',
      'Drive the right traffic (employers & clients)',
      'Land your first interview. Guaranteed.'
    ];
    var SCENE = 5000, TOTAL = SCENE * scenes.length;
    var t = 0, playing = false, last = 0, cur = -1, typeTimer = null;
    var fmt = function (ms) { var s = Math.floor(ms / 1000); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); };

    var enterScene = function (i) {
      if (i === cur) return;
      cur = i;
      scenes.forEach(function (s, k) {
        s.classList.remove('on');
        if (k === i) { void s.offsetWidth; s.classList.add('on'); }
      });
      stepEls.forEach(function (li, k) { li.classList.toggle('is-active', k === i); });
      $('#caption').textContent = captions[i];
      var sc = scenes[i];
      var ring = $('[data-ring]', sc); if (ring) countUp(ring, 96, 3000);
      $$('[data-num]', sc).forEach(function (n) { countUp(n, +n.dataset.num, 2600); });
      var typer = $('[data-type]', sc);
      clearInterval(typeTimer);
      if (typer) {
        var full = typer.dataset.type, k = 0; typer.textContent = '';
        typeTimer = setInterval(function () { typer.textContent = full.slice(0, ++k); if (k >= full.length) clearInterval(typeTimer); }, 60);
      }
    };
    var render = function () {
      $('#barFill').style.width = (t / TOTAL * 100) + '%';
      $('#time').textContent = fmt(t) + ' / ' + fmt(TOTAL);
      enterScene(Math.min(scenes.length - 1, Math.floor(t / SCENE)));
    };
    var pause = function () {
      playing = false;
      player.classList.remove('is-playing');
      $('#playBtn').textContent = t >= TOTAL - 1 ? '↻' : '▶';
      $('#playBtn').setAttribute('aria-label', 'Play');
    };
    var loop = function (ts) {
      if (!playing) return;
      if (!last) last = ts;
      t += ts - last; last = ts;
      if (t >= TOTAL) { t = TOTAL - 1; render(); pause(); return; }
      render();
      requestAnimationFrame(loop);
    };
    var play = function () {
      if (t >= TOTAL - 1) { t = 0; cur = -1; }
      playing = true; last = 0;
      player.classList.add('is-playing', 'has-started');
      $('#playBtn').textContent = '❚❚'; $('#playBtn').setAttribute('aria-label', 'Pause');
      requestAnimationFrame(loop);
    };
    var seekScene = function (i) { t = i * SCENE; cur = -1; render(); if (!playing) play(); };

    $('#bigPlay').addEventListener('click', play);
    $('#playBtn').addEventListener('click', function () { playing ? pause() : play(); });
    $('#screen').addEventListener('click', function (e) { if (e.target.id !== 'bigPlay' && player.classList.contains('has-started')) { playing ? pause() : play(); } });
    $('#bar').addEventListener('click', function (e) {
      var r = this.getBoundingClientRect(), p = (e.clientX - r.left) / r.width;
      t = Math.max(0, Math.min(TOTAL - 1, p * TOTAL)); cur = -1; render(); if (!playing) play();
    });
    stepEls.forEach(function (li, i) {
      li.setAttribute('tabindex', '0');
      li.addEventListener('click', function () { seekScene(i); });
      li.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); seekScene(i); } });
    });
    render();

    if (params.get('play')) { setTimeout(play, 500); }
    else if ('IntersectionObserver' in window && !reduceMotion) {
      var pio = new IntersectionObserver(function (en) {
        if (en[0].isIntersecting && !player.classList.contains('has-started')) { play(); pio.disconnect(); }
      }, { threshold: 0.6 });
      pio.observe(player);
    }
  }

  /* ---------- application form (Apply page) ---------- */
  var form = $('#applyForm');
  if (form) {
    var msg = $('#formMsg'), planSel = $('#planSelect');
    if (planSel && params.get('plan')) planSel.value = params.get('plan');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      $$('input, select', form).forEach(function (f) {
        var bad = f.required && (!f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value)) || (f.type === 'tel' && f.value.replace(/\D/g, '').length < 7));
        f.classList.toggle('invalid', bad); if (bad) ok = false;
      });
      if (!ok) { msg.className = 'form__msg err'; msg.textContent = 'Please fill in all fields correctly.'; return; }

      var data = {}; new FormData(form).forEach(function (v, k) { data[k] = v; });
      var btn = $('button[type="submit"]', form); btn.disabled = true;
      var done = function () {
        btn.disabled = false; form.reset();
        msg.className = 'form__msg ok';
        msg.textContent = 'Thank you, ' + (data.name || '').split(' ')[0] + '! Your application is in — our team will contact you shortly.';
      };
      if (!FORM_ENDPOINT) { setTimeout(done, 500); return; }
      fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) { if (!r.ok) throw new Error(r.status); done(); })
        .catch(function () { btn.disabled = false; msg.className = 'form__msg err'; msg.textContent = 'Something went wrong. Please try again.'; });
    });
  }

  var y = $('#year'); if (y) y.textContent = new Date().getFullYear();
})();
