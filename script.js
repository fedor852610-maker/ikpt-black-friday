/* Институт КПТ · Чёрная пятница */
(() => {
  // Куда ведут кнопки «Записаться» и «Оставить заявку» (форма с текущего сайта)
  const APPLY_URL = 'https://institutcbt.ru/anketa13';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const I = p => (window.IMG && window.IMG[p]) || p;
  const fmt = n => Math.round(n).toLocaleString('ru-RU').replace(/,/g, ' ');

  $$('[data-apply]').forEach(a => { a.href = APPLY_URL; a.target = '_blank'; a.rel = 'noopener'; });

  /* ---------- видеоотзывы ---------- */
  const VIDEOS = [
    ['Юргита Котенкова', '1045059954'], ['Анжелика Размахнина', '1045054872'], ['Анжелика Акуленок', '1045056142'],
    ['Дмитрий Анастасюк', '1045056241'], ['Елена Вилинчук', '1045056266'], ['Лариса Иванова', '1045057479'],
    ['Малика Гагиева', '1045057525'], ['Марина Краева', '1045057551'], ['Наталья Елистратова', '1045059171'],
    ['Наталья Зарифуллина', '1045059204'], ['Станислав Кузьмин', '1045059226'], ['Эльвира Муллаянова', '1045059998'],
    ['Алла Буглаева', '1045054815'], ['Алевтина Маликова', '1045054706'], ['Татьяна Кокарева', '1045060012']
  ];
  const noEmbed = document.documentElement.dataset.noembed === '1';
  const vt = $('#videoTrack');
  if (vt) vt.innerHTML = VIDEOS.map(([n], i) => `
    <div class="slide">${noEmbed ? `<a class="card vcard" href="https://vimeo.com/${VIDEOS[i][1]}" target="_blank" rel="noopener">` : `<button class="card vcard" data-video="${i}">`}
      <span class="vcard__ph"><img src="${I(`img/video-${i + 1}.webp?v=202611181525`)}" alt="${n}" loading="lazy"><span class="play"></span></span>
      <span class="vcard__t"><b>${n}</b><span>${noEmbed ? 'Смотреть на Vimeo' : 'Отзыв об обучении'}</span></span>
    ${noEmbed ? '</a>' : '</button>'}</div>`).join('');

  /* ---------- галереи документов ---------- */
  const range = (p, n, cap) => Array.from({ length: n }, (_, i) => ({ src: I(`img/${p}-${i + 1}.webp?v=202611181525`), cap: `${cap}, стр. ${i + 1} из ${n}` }));
  const GALLERIES = {
    diploma: [
      { src: I('img/diploma-sample.webp?v=8fa4e74c'), cap: 'Образец диплома о профессиональной переподготовке' },
      { src: I('img/diploma-cover.webp?v=439d836b'), cap: 'Обложка диплома' },
      { src: I('img/certificate.webp?v=3650d52e'), cap: 'Образец сертификата о прохождении программы' }
    ],
    certificate: [
      { src: I('img/certificate.webp?v=3650d52e'), cap: 'Образец сертификата о прохождении программы' },
      { src: I('img/diploma-sample.webp?v=8fa4e74c'), cap: 'Образец диплома о профессиональной переподготовке' }
    ],
    license: range('license', 2, 'Выписка из реестра лицензий'),
    calendar: range('calendar', 2, 'Календарный учебный график'),
    plan: range('plan', 3, 'Учебный план'),
    ethics: range('ethics', 8, 'Этический кодекс'),
    grads: $$('.slide.photo img').map(i => ({ src: i.getAttribute('src'), cap: i.alt })),
    video: VIDEOS.map(([n, id]) => ({ video: id, cap: `${n} · отзыв об обучении` }))
  };

  const lb = $('.lb'), stage = $('.lb__stage'), cap = $('.lb__cap');
  let cur = [], idx = 0, lastFocus = null;
  const show = () => {
    const it = cur[idx];
    if (it.html) stage.innerHTML = it.html;
    else if (it.video) stage.innerHTML = `<iframe src="https://player.vimeo.com/video/${it.video}?autoplay=1&title=0&byline=0&portrait=0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="${it.cap}"></iframe>`;
    else stage.innerHTML = `<img src="${it.src}" alt="${it.cap}">`;
    stage.classList.remove('is-zoom'); stage.scrollTo(0, 0);
    hint.hidden = !!(it.html || it.video);
    cap.textContent = it.cap + (cur.length > 1 && !/стр\. \d/.test(it.cap) ? `  ·  ${idx + 1} / ${cur.length}` : '');
  };
  const hint = document.createElement('div'); hint.className = 'lb__hint'; hint.textContent = 'Нажмите на документ, чтобы увеличить'; lb.appendChild(hint);
  const fitH = () => {
    const vv = window.visualViewport ? visualViewport.height : innerHeight;
    const h = Math.min(innerHeight, vv, screen.availHeight || innerHeight);
    lb.style.setProperty('--lbh', h + 'px');
  };
  addEventListener('resize', () => { if (!lb.hidden) fitH(); });
  stage.addEventListener('click', e => {
    if (e.target.tagName !== 'IMG') return;
    e.stopPropagation();
    const z = stage.classList.toggle('is-zoom');
    hint.textContent = z ? 'Прокрутите, чтобы посмотреть. Нажмите ещё раз, чтобы уменьшить' : 'Нажмите на документ, чтобы увеличить';
    if (z) { const r = e.target; stage.scrollTo({ left: (stage.scrollWidth - stage.clientWidth) / 2, top: 0 }); }
  });
  const open = (items, i = 0) => {
    fitH();
    cur = items; idx = i; lastFocus = document.activeElement;
    lb.classList.toggle('is-single', items.length < 2);
    lb.hidden = false; document.body.style.overflow = 'hidden'; show(); $('.lb__x').focus();
  };
  const close = () => { lb.hidden = true; stage.innerHTML = ''; document.body.style.overflow = ''; lastFocus && lastFocus.focus(); };
  const step = d => { idx = (idx + d + cur.length) % cur.length; show(); };
  $('.lb__x').onclick = close;
  $('.lb__prev').onclick = () => step(-1);
  $('.lb__next').onclick = () => step(1);
  lb.addEventListener('click', e => { if (e.target === lb || e.target === stage) close(); });
  addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
  let tx = 0;
  lb.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => { if (stage.classList.contains('is-zoom')) return; const d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 50) step(d < 0 ? 1 : -1); });

  document.addEventListener('click', e => {
    const g = e.target.closest('[data-gallery]');
    if (g) { e.preventDefault(); open(GALLERIES[g.dataset.gallery], +(g.dataset.index || 0)); return; }
    const v = e.target.closest('[data-video]');
    if (v) { open(GALLERIES.video, +v.dataset.video); return; }
    if (e.target.closest('[data-policy]')) {
      open([{ html: `<div class="policy">${$('#policyTpl').innerHTML}</div>`, cap: 'Политика обработки персональных данных' }]);
    }
  });

  /* ---------- шапка, меню, липкая кнопка ---------- */
  const hdr = $('.hdr'), burger = $('.burger'), mnav = $('.mnav'), sticky = $('.sticky-cta');
  burger.onclick = () => { const o = burger.getAttribute('aria-expanded') !== 'true'; burger.setAttribute('aria-expanded', o); mnav.hidden = !o; };
  mnav.addEventListener('click', e => { if (e.target.closest('a')) { burger.setAttribute('aria-expanded', false); mnav.hidden = true; } });
  const heroEl = $('.hero'), enrollEl = $('#enroll');
  const onScroll = () => {
    hdr.classList.toggle('is-scrolled', scrollY > 10);
    const past = heroEl.getBoundingClientRect().bottom < 0;
    const r = enrollEl.getBoundingClientRect();
    const atEnroll = r.top < innerHeight && r.bottom > 0;
    sticky.classList.toggle('is-on', past && !atEnroll);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  const navLinks = $$('.nav a');
  const secIO = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id || (en.target.id === 'enroll' && a.getAttribute('href') === '#price')));
  }), { rootMargin: '-45% 0px -50% 0px' });
  ['program', 'format', 'faculty', 'reviews', 'enroll'].forEach(id => { const s = document.getElementById(id); s && secIO.observe(s); });

  /* ---------- появление, счётчики ---------- */
  const count = el => {
    const to = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0), t0 = performance.now(), dur = 1600;
    const tick = t => {
      const k = Math.min(1, (t - t0) / dur), v = to * (1 - Math.pow(1 - k, 3));
      el.textContent = dec ? v.toFixed(dec).replace('.', ',') : fmt(v);
      if (k < 1) requestAnimationFrame(tick);
    };
    reduce ? (el.textContent = dec ? String(to).replace('.', ',') : fmt(to)) : requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target; el.classList.add('is-in'); io.unobserve(el);
    $$('[data-count]', el).forEach(count);
  }), { threshold: .14, rootMargin: '0px 0px -40px 0px' });
  // лёгкая «лесенка» для соседних элементов
  $$('[data-r]').forEach(el => {
    const sibs = [...el.parentElement.children].filter(c => c.hasAttribute('data-r'));
    const i = sibs.indexOf(el); if (i > 0) el.style.setProperty('--rd', Math.min(i, 6) * 0.08 + 's');
    io.observe(el);
  });
  // счётчики вне [data-r] и элементы с is-in
  $$('.donut, .ratio, .stat').forEach(el => io.observe(el));

  /* ---------- обратный отсчёт ---------- */
  $$('.countdown').forEach(cd => {
    const end = new Date(cd.dataset.deadline).getTime();
    const cells = { d: $('[data-u=d]', cd), h: $('[data-u=h]', cd), m: $('[data-u=m]', cd), s: $('[data-u=s]', cd) };
    const set = (el, v) => { const s = String(v).padStart(2, '0'); if (el.textContent !== s) { el.textContent = s; el.classList.remove('tick'); void el.offsetWidth; el.classList.add('tick'); } };
    const upd = () => {
      let t = Math.max(0, end - Date.now()) / 1000;
      if (t <= 0) { const l = $('.countdown__label', cd); if (l) l.textContent = 'Акция завершена'; }
      set(cells.d, Math.floor(t / 86400)); t %= 86400;
      set(cells.h, Math.floor(t / 3600)); t %= 3600;
      set(cells.m, Math.floor(t / 60)); set(cells.s, Math.floor(t % 60));
    };
    upd(); setInterval(upd, 1000);
  });

  /* ---------- слайдеры ---------- */
  $$('[data-slider]').forEach(sl => {
    const tr = $('.slider__track', sl), counter = $('.slider__count', sl);
    const items = () => [...tr.children];
    const cur = () => { const w = items()[0].getBoundingClientRect().width + 20; return Math.round(tr.scrollLeft / w); };
    const go = d => { const w = items()[0].getBoundingClientRect().width + 20; tr.scrollBy({ left: d * w, behavior: 'smooth' }); };
    $('[data-prev]', sl).onclick = () => go(-1);
    $('[data-next]', sl).onclick = () => go(1);
    const upd = () => { const n = items().length; counter.textContent = `${String(Math.min(cur() + 1, n)).padStart(2, '0')} / ${String(n).padStart(2, '0')}`; };
    tr.addEventListener('scroll', () => requestAnimationFrame(upd), { passive: true }); upd();
  });

  /* ---------- калькулятор дохода ---------- */
  const calc = $('.calc');
  if (calc) {
    const ins = { price: $('[data-in=price]', calc), hours: $('[data-in=hours]', calc), days: $('[data-in=days]', calc) };
    const outs = k => $(`[data-out=${k}]`, calc);
    const bars = $$('.calc__bars i', calc);
    const upd = () => {
      Object.values(ins).forEach(i => i.style.setProperty('--p', ((i.value - i.min) / (i.max - i.min) * 100) + '%'));
      const p = +ins.price.value, h = +ins.hours.value, d = +ins.days.value;
      const total = p * h * d * 4;
      outs('price').textContent = fmt(p) + ' ₽'; outs('hours').textContent = h; outs('days').textContent = d;
      outs('total').textContent = fmt(total) + ' ₽';
      const k = Math.min(1, total / 900000);
      bars.forEach((b, i) => b.style.setProperty('--h', (20 + k * 80 * (0.55 + i * 0.15)) + '%'));
    };
    Object.values(ins).forEach(i => i.addEventListener('input', upd)); upd();
  }

  /* ---------- звёзды на первом экране ---------- */
  const sc = $('.hero__stars');
  if (sc && !reduce) {
    const ctx = sc.getContext('2d'); let W, H, stars = [];
    const size = () => {
      const r = sc.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
      W = sc.width = r.width * dpr; H = sc.height = r.height * dpr;
      stars = Array.from({ length: Math.round(r.width * r.height / 5000) }, () => ({ x: Math.random() * W, y: Math.random() * H, r: (Math.random() * 1.2 + .3) * dpr, p: Math.random() * 6.28, s: Math.random() * .02 + .005, v: Math.random() * .15 * dpr }));
    };
    size(); addEventListener('resize', size);
    let vis = true; new IntersectionObserver(([e]) => vis = e.isIntersecting).observe(sc);
    const draw = () => {
      if (vis) {
        ctx.clearRect(0, 0, W, H);
        for (const s of stars) {
          s.p += s.s; s.y -= s.v; if (s.y < 0) s.y = H;
          ctx.globalAlpha = .25 + .75 * Math.abs(Math.sin(s.p));
          ctx.fillStyle = '#cfc9ff'; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.28); ctx.fill();
        }
      }
      requestAnimationFrame(draw);
    };
    draw();
  }

  /* ---------- «живой» мозг: нейроны и импульсы ---------- */
  const bc = $('.brain__net'), tilt = $('.brain__tilt');
  if (bc && !reduce) {
    const ctx = bc.getContext('2d'); let W, H, nodes = [], links = [], pulses = [], dpr = 1;
    // область мозга на картинке (доли ширины и высоты)
    const cx = .56, cy = .33, rx = .30, ry = .25;
    const build = () => {
      const r = bc.getBoundingClientRect(); dpr = Math.min(devicePixelRatio || 1, 2);
      W = bc.width = r.width * dpr; H = bc.height = r.height * dpr;
      nodes = [];
      for (let i = 0; i < 46; i++) {
        const a = Math.random() * 6.28, d = Math.sqrt(Math.random());
        nodes.push({ bx: (cx + Math.cos(a) * rx * d) * W, by: (cy + Math.sin(a) * ry * d) * H, p: Math.random() * 6.28 });
      }
      links = [];
      nodes.forEach((n, i) => nodes.forEach((m, j) => { if (j > i && Math.hypot(n.bx - m.bx, n.by - m.by) < W * .12) links.push([i, j]); }));
    };
    build(); addEventListener('resize', build);
    let vis = true; new IntersectionObserver(([e]) => vis = e.isIntersecting).observe(bc);
    let t = 0;
    const draw = () => {
      if (vis) {
        t += .016; ctx.clearRect(0, 0, W, H);
        nodes.forEach(n => { n.x = n.bx + Math.sin(t * .8 + n.p) * 3 * dpr; n.y = n.by + Math.cos(t * .7 + n.p) * 3 * dpr; });
        ctx.lineWidth = .8 * dpr;
        links.forEach(([i, j]) => {
          const a = nodes[i], b = nodes[j];
          ctx.strokeStyle = `rgba(170,160,255,${.12 + .1 * Math.sin(t + i)})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        });
        if (Math.random() < .14 && links.length) pulses.push({ l: links[Math.random() * links.length | 0], k: 0, sp: .012 + Math.random() * .02, gold: Math.random() < .25 });
        pulses = pulses.filter(p => p.k <= 1);
        pulses.forEach(p => {
          p.k += p.sp; const a = nodes[p.l[0]], b = nodes[p.l[1]];
          const x = a.x + (b.x - a.x) * p.k, y = a.y + (b.y - a.y) * p.k;
          const g = ctx.createRadialGradient(x, y, 0, x, y, 9 * dpr);
          g.addColorStop(0, p.gold ? 'rgba(255,220,130,1)' : 'rgba(225,220,255,1)'); g.addColorStop(1, 'rgba(120,100,255,0)');
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 9 * dpr, 0, 6.28); ctx.fill();
        });
        nodes.forEach(n => {
          const a = .35 + .65 * Math.abs(Math.sin(t * 1.4 + n.p));
          ctx.fillStyle = `rgba(230,226,255,${a})`; ctx.beginPath(); ctx.arc(n.x, n.y, 1.8 * dpr, 0, 6.28); ctx.fill();
        });
      }
      requestAnimationFrame(draw);
    };
    draw();
    // наклон за курсором
    const card = $('.hero__card');
    card.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      tilt.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 10}deg)`;
    });
    card.addEventListener('pointerleave', () => { tilt.style.transform = ''; });
  }
})();
