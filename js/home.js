// Главная страница (ПК): наполнение блоков из js/data.js
// Картинки блоков (PNG) подставляются полем img в data.js; без него — место под картинку с подписью.
(function () {
  const D = window.OG, U = window.OG_UI, C = window.OG_C, $ = U.$, $$ = U.$$;
  const pad = n => String(n).padStart(2, '0');
  const AR = '<svg class="fb-ar" viewBox="0 0 17 17" aria-hidden="true"><path d="M4.958 12.042 12.042 4.958M4.958 4.958h7.084v7.084"/></svg>';
  const plural = n => { const a = n % 10, b = n % 100; return a === 1 && b !== 11 ? 'проект' : a >= 2 && a <= 4 && (b < 12 || b > 14) ? 'проекта' : 'проектов'; };
  const pic = (img, label, cls) => img ? `<img class="${cls}" src="img/${img}" alt="" loading="lazy">` : `<div class="phx ${cls}" data-ph="${label}"></div>`;
  const tick = f => (window.OG_TICK = window.OG_TICK || []).push(f);

  U.bindForms($('.hero-form'));

  // ── клиенты ──
  // бегущая лента: два одинаковых ряда, сдвиг на половину — шов не виден; вторая копия скрыта от чтения с экрана
  const logos = hide => D.clients.map(l => `<div class="cl-i"${hide ? ' aria-hidden="true"' : ''}><img src="img/${l.img}.webp" alt="${hide ? '' : l.t}" style="height:${(l.h * .82).toFixed(2)}rem" loading="lazy"></div>`).join('');
  $('#clients').innerHTML = `<div class="cl-track">${logos(false)}${logos(true)}</div>`;
  // лента идёт сама и не останавливается; зажатой мышью её можно протянуть в обе стороны, после отпускания — по инерции
  {
    const box = $('#clients'), tr = $('.cl-track', box), RUN = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 78;
    let half = 0, x = 0, v = 0, drag = false, lx = 0, lt = 0, prev = 0, seen = false;
    const size = () => { half = tr.offsetWidth / 2; };
    size(); addEventListener('resize', size);
    $$('img', tr).forEach(i => { i.draggable = false; });
    const step = t => {
      requestAnimationFrame(step);
      const dt = Math.min(.05, (t - prev) / 1000 || 0); prev = t;
      if (!seen || drag || !half) return;
      x += (v - (RUN ? half / RUN : 0)) * dt; v *= Math.pow(.04, dt);
      x = ((x % half) - half) % half;
      tr.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
    };
    new IntersectionObserver(es => { seen = es[0].isIntersecting; }).observe(box);
    requestAnimationFrame(step);
    box.addEventListener('pointerdown', e => { if (e.button) return; drag = true; v = 0; lx = e.clientX; lt = e.timeStamp; box.setPointerCapture(e.pointerId); box.classList.add('is-drag'); });
    box.addEventListener('pointermove', e => {
      if (!drag) return;
      const dx = e.clientX - lx, dt = Math.max(1, e.timeStamp - lt);
      x += dx; v = dx / dt * 1000; lx = e.clientX; lt = e.timeStamp;
      x = ((x % half) - half) % half;
      tr.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
    });
    const up = () => { drag = false; box.classList.remove('is-drag'); };
    box.addEventListener('pointerup', up); box.addEventListener('pointercancel', up);
  }

  // ── о нас ──
  $('#nums').innerHTML = D.about.facts.map((f, i) =>
    `<li class="rv" style="--i:${i}"><span class="nums-k num">${pad(i + 1)}</span><b${/^\d+\+?$/.test(f.n) ? ' data-count' : ''}>${f.n}</b><p>${f.t}</p></li>`).join('');
  // преимущества — бенто-сетка по макету (Figma «home» 2038:1110…1129): фото на две строки с белой панелью,
  // у светлых плиток иконка-сцена в углу (js/pros-fx.js), последняя — красная, с линиями и тёмной кнопкой заявки;
  // ширина абзаца (поле w, px макета) держит переносы как в макете; графика оживает, только пока сетка на экране
  const PA = window.OG_PROS || {};
  $('#pros').innerHTML = D.about.pros.map(p => {
    const tx = `<h3>${p.t}</h3><p${p.w ? ` style="max-width:${p.w / 16}rem"` : ''}>${p.d}</p>`;
    if (p.k === 'team') return `<li class="prx-t prx-t--team">${pic(D.about.img, 'Фото · инженер-пожарный · PNG', 'prx-ph')}<div class="prx-b">${tx}</div></li>`;
    if (p.k === 'consult') return `<li class="prx-t prx-t--consult"><svg class="prx-ln" viewBox="0 0 359 314" preserveAspectRatio="none" aria-hidden="true"><path d="M158.4-5.3 315.4 228.7M315.5-6V228M1 228.5H359"/></svg>
      <div class="prx-b">${tx}</div><button class="prx-go" data-open="form" data-q="Бесплатная консультация"><span>Оставить заявку</span>${AR}</button></li>`;
    return `<li class="prx-t prx-t--${p.k}"><div class="prx-a">${PA[p.k] || ''}</div><div class="prx-b">${tx}</div></li>`;
  }).join('');
  const prx = $('#pros');
  new IntersectionObserver(([e]) => prx.classList.toggle('is-on', e.isIntersecting)).observe(prx);

  // ── услуги: шесть карточек 3 × 2 по макету (Figma 2031:2199…): картинка на всю карточку, белая панель снизу;
  //    при наведении на картинке проигрывается сцена услуги (js/svc-fx.js); вся карточка ведёт на страницу услуги ──
  //    порядок — как в макете: по рядам слева направо
  const S = C.order.map(D.svc);
  $('#svc').innerHTML = S.map((s, i) => C.sc(s, i, S.length)).join('');
  // белые панели карточек — одной высоты: по самой высокой (двухстрочный заголовок), иначе в ряду они «пляшут»
  C.eqSc($('#svc'));

  // ── объекты: лента едет вбок, пока блок закреплён ──
  const OX = window.OG_OBJ;
  $('#obj').innerHTML = D.objects.map((o, i) => `<article class="obx rv" style="--i:${Math.min(i, 3)}">
      <div class="obx-m"><img src="img/o-${o.id}.webp" alt="" loading="lazy"><svg class="ox-fx" viewBox="0 0 ${OX.W} ${OX.H}" aria-hidden="true">${OX[o.id] || ''}</svg></div>
      <div class="obx-b"><span class="obx-n num">${pad(i + 1)}</span><h3>${o.t}</h3>
        <button class="obx-btn" data-open="form" data-q="Объект: ${o.t}"><span>Получить предложение</span>${AR}</button></div>
    </article>`).join('');
  const ox = $('#objects'), track = $('#obj'), ok = $('#obj-k'), op = $('#obj-p'), cards = $$('.obx', track);
  const wrapW = () => $('.objx-pin .wrap2').offsetWidth;
  let dist = 0;
  const sizeObj = () => { dist = Math.max(0, track.scrollWidth - innerWidth); ox.style.height = `calc(100vh + ${dist}px)`; };
  addEventListener('resize', sizeObj); addEventListener('load', sizeObj); sizeObj();
  tick(() => {
    const r = ox.getBoundingClientRect(), total = ox.offsetHeight - innerHeight;
    const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
    track.style.transform = `translate3d(${(-p * dist).toFixed(1)}px,0,0)`;
    op.style.transform = `scaleX(${p.toFixed(4)})`;
    // номер — первая карточка, видимая у левого края колонки
    const edge = p * dist + (innerWidth - wrapW()) / 2;
    const k = Math.max(0, cards.findIndex(c => c.offsetLeft + c.offsetWidth * .5 > edge));
    ok.textContent = `${pad(k + 1)} / ${pad(cards.length)}`;
  });

  // ── работы: фильтр по услугам, 4 карточки в асимметричной сетке; порядок свой при каждой загрузке ──
  const WK = C.shuffle(D.works);
  const used = S.filter(s => D.works.some(w => w.s === s.id));
  const wf = $('#works-f'), wl = $('#works-list');
  const work = (w, i) => C.wkc(w, 'wkc--' + i);
  wf.innerHTML = [['all', 'Все проекты'], ...used.map(s => [s.id, s.short])].map(([v, t], i) => `<button class="chip2${i ? '' : ' is-on'}" data-f="${v}">${t}</button>`).join('');
  const showWorks = v => {
    const list = WK.filter(w => v === 'all' || w.s === v).slice(0, 4);
    wl.classList.add('is-swap');
    setTimeout(() => { wl.innerHTML = list.map(work).join(''); wl.classList.remove('is-swap'); }, wl.children.length ? 260 : 0);
  };
  wf.addEventListener('click', e => { const b = e.target.closest('[data-f]'); if (!b) return; $$('.chip2', wf).forEach(x => x.classList.toggle('is-on', x === b)); showWorks(b.dataset.f); });
  showWorks('all');

  // ── стоимость: калькулятор по шагам (js/calc.js); в окне «Рассчитать стоимость» — он же ──
  window.OG_CALC($('#calc'));

  // ── как мы работаем: блок закрепляется на экран (.stk-pin), в кадре одна карточка шага; по прокрутке следующая
  //    выезжает снизу и ложится поверх (--p: 0 — за нижним краем экрана, 1 — на месте), предыдущие уменьшаются, темнеют
  //    и уходят в стопку кромкой сверху (--k: сколько карточек легло сверху) ──
  const ST = D.steps;
  const stk = $('#stk'), run = $('#stk-run');
  // карточка — по Figma (Page 1, Rectangle 26…30): слева плашка срока, линия, заголовок и описание внизу; справа панель-иллюстрация с номером
  stk.innerHTML = ST.map((x, i) => `<li class="stk-c${i === ST.length - 1 ? ' stk-c--fin' : ''}" style="--i:${i}">
      <div class="stk-b"><span class="stk-chip">${x.dur}</span><h3>${x.t}</h3><p>${x.p}</p></div>
      <div class="stk-m">${pic(x.img, `Иллюстрация · шаг ${pad(i + 1)} · PNG`, 'stk-im')}<span class="stk-k num">${pad(i + 1)} из ${pad(ST.length)}</span></div>
    </li>`).join('');
  const stc = $$('.stk-c', stk);
  // прокрутка: карточка стартует сразу под нижним краем экрана (--d — путь до места, px сцены) и идёт за прокруткой почти 1:1,
  // без пустого пробега за кадром; легла карточка — следующая трогается почти сразу (пауза только в начале и в конце блока)
  const RATE = 1.15, REST = .04, HOLD0 = .2, HOLD1 = .4;
  let MV = 1, SG = 1;
  const ease = t => .6 * t + .4 * t * t * (3 - 2 * t);
  const draw = () => {
    const u = -run.getBoundingClientRect().top - HOLD0 * innerHeight;
    const p = stc.map((c, j) => j ? ease(Math.min(1, Math.max(0, (u - (j - 1) * SG) / MV))) : 1);
    let k = 0;
    for (let i = stc.length - 1; i >= 0; i--) {
      stc[i].style.setProperty('--p', p[i].toFixed(4)); stc[i].style.setProperty('--k', k.toFixed(4));
      k += i ? p[i] : 0;
    }
  };
  const fit = () => {
    // сцена увеличена zoom — путь считаем в её px, прокрутку на путь — в px экрана
    const z = parseFloat(getComputedStyle(stk).zoom) || 1;
    const top = stk.getBoundingClientRect().top - stk.closest('.stk-pin').getBoundingClientRect().top;
    const d = Math.ceil((innerHeight - top) / z - parseFloat(getComputedStyle(stc[0]).top) + 24);
    stk.style.setProperty('--d', `${d}px`);
    MV = d * z * RATE; SG = MV + REST * innerHeight;
    run.style.height = `${Math.round(innerHeight + (stc.length - 1) * SG - REST * innerHeight + (HOLD0 + HOLD1) * innerHeight)}px`;
    draw();
  };
  fit(); addEventListener('resize', fit); document.fonts && document.fonts.ready.then(fit);
  tick(draw);

  // ── статьи: лента сдвигается на карточку; последняя встаёт к правому краю колонки ──
  {
    const arx = $('#arts'), prev = $('#ar-prev'), next = $('#ar-next');
    arx.innerHTML = D.articles.slice(0, 4).map(a => C.arc(a)).join('');
    const cards = $$('.arc', arx);
    let k = 0, stops = [0];
    const measure = () => {
      const room = Math.max(0, arx.scrollWidth - arx.parentElement.offsetWidth);
      stops = [...new Set(cards.map(c => Math.min(c.offsetLeft, room)))];
      k = Math.min(k, stops.length - 1);
    };
    const go = (n, drag = 0) => {
      k = Math.max(0, Math.min(stops.length - 1, n));
      arx.style.transform = `translate3d(${drag - stops[k]}px, 0, 0)`;
      prev.disabled = k === 0; next.disabled = k === stops.length - 1;
    };
    measure(); go(0);
    addEventListener('resize', () => { measure(); go(k); });
    prev.addEventListener('click', () => go(k - 1));
    next.addEventListener('click', () => go(k + 1));
    // перетаскивание: лента идёт за курсором (у крайних карточек — туго), на отпускании — к соседней по направлению
    let sx = null, dx = 0, moved = false;
    arx.addEventListener('pointerdown', e => { if (e.button) return; sx = e.clientX; dx = 0; moved = false; });
    addEventListener('pointermove', e => {
      if (sx === null) return;
      dx = e.clientX - sx;
      if (!moved && Math.abs(dx) > 6) { moved = true; arx.classList.add('is-drag'); }
      if (moved) { const edge = (k === 0 && dx > 0) || (k === stops.length - 1 && dx < 0); go(k, edge ? dx * .25 : dx); }
    });
    addEventListener('pointerup', () => {
      if (sx === null) return;
      sx = null; arx.classList.remove('is-drag');
      if (moved) go(Math.abs(dx) > 60 ? k + (dx < 0 ? 1 : -1) : k);
    });
    // клик в конце перетаскивания не открывает статью
    arx.addEventListener('click', e => { if (moved) { e.preventDefault(); moved = false; } }, true);
    // горизонтальный жест тачпада: один жест — одна карточка
    let acc = 0, lock = 0;
    arx.addEventListener('wheel', e => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      if (performance.now() < lock) return;
      acc += e.deltaX;
      if (Math.abs(acc) > 40) { go(k + Math.sign(acc)); acc = 0; lock = performance.now() + 650; }
    }, { passive: false });
  }

  // ── панель блоков над кнопками связи: значки как у кнопок, сверху счётчик и полоска пройденного, подпись — той же плашкой, что у кнопок ──
  {
    const I = body => `<svg viewBox="0 0 24 24" aria-hidden="true">${body}</svg>`;
    const LINKS = [
      ['top', 'Главная', '<path d="M12 3l7 2.5v6c0 4.5-3 7.5-7 9.5-4-2-7-5-7-9.5v-6z"/>'],
      ['services', 'Услуги', '<rect x="4" y="4" width="6.5" height="6.5" rx="1"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1"/>'],
      ['about', 'О нас', '<circle cx="9" cy="8.5" r="3.2"/><path d="M3.5 19c.6-3.4 2.7-5 5.5-5s4.9 1.6 5.5 5"/><path d="M15.5 5.6a3.2 3.2 0 0 1 0 5.8M17 14.4c2 .6 3.1 2.2 3.5 4.6"/>'],
      ['objects', 'Объекты', '<path d="M4 20.5h16M6 20.5v-16h8v16M14 10h4.5v10.5"/><path d="M9 8h2M9 11.5h2M9 15h2"/>'],
      ['works', 'Наши работы', '<rect x="3.5" y="7.5" width="17" height="12" rx="1.5"/><path d="M9 7.5v-2a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3.5 12.5h17"/>'],
      ['price', 'Стоимость', '<path d="M9 20.5v-17h5a4.5 4.5 0 0 1 0 9H6.5M6.5 16.5H13"/>'],
      ['steps', 'Как мы работаем', '<path d="M3.5 19.5H8V15h4.5v-4.5H17V6h3.5"/>'],
      ['geo', 'География', '<path d="M12 21s-6.5-5.4-6.5-11a6.5 6.5 0 0 1 13 0c0 5.6-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>'],
      ['faq', 'FAQ', '<circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.5a2.5 2.5 0 1 1 3.7 2.2c-.8.4-1.3 1-1.3 1.9"/><path d="M12 16.6v.1"/>'],
      ['blog', 'Статьи', '<rect x="4.5" y="4" width="15" height="16" rx="1.5"/><path d="M8 8.5h8M8 12h8M8 15.5h5"/>'],
      ['library', 'Библиотека', '<path d="M12 6.5C10 5 7.5 4.5 3.5 4.8v13.7c4-.3 6.5.2 8.5 1.7 2-1.5 4.5-2 8.5-1.7V4.8C16.5 4.5 14 5 12 6.5zM12 6.5v13.7"/>'],
    ];
    const nav = document.createElement('nav');
    nav.className = 'rl'; nav.setAttribute('aria-label', 'Блоки страницы');
    nav.innerHTML = `<p class="rl-n num"><b>01</b>/${pad(LINKS.length)}</p><i class="rl-p"><i></i></i>${LINKS.map(([id, t, ic]) => `<a href="#${id}" data-off="1" aria-label="${t}">${I(ic)}<span class="d-tip">${t}</span></a>`).join('')}`;
    $('.dock').prepend(nav);
    const as = $$('a', nav), secs = LINKS.map(([id]) => document.getElementById(id)), bar = $('.rl-p i', nav), num = $('.rl-n b', nav), hero = secs[0], ftr = $('#ftr');
    let on = -1, flash = 0, wait = false;
    const paint = () => {
      wait = false;
      const vh = innerHeight, line = vh * .45, tops = secs.map(s => s.getBoundingClientRect().top);
      let i = 0; tops.forEach((y, k) => { if (y <= line) i = k; });
      const next = tops[i + 1] ?? ftr.getBoundingClientRect().top, part = Math.min(1, Math.max(0, (line - tops[i]) / (next - tops[i] || 1)));
      bar.style.transform = `scaleX(${((i + part) / LINKS.length).toFixed(4)})`;
      nav.classList.toggle('is-show', hero.getBoundingClientRect().bottom < vh * .5);
      if (i === on) return;
      as.forEach((a, k) => a.classList.toggle('is-on', k === i));
      num.textContent = pad(i + 1);
      if (on >= 0) { as[on].classList.remove('is-flash'); as[i].classList.add('is-flash'); clearTimeout(flash); flash = setTimeout(() => as[i].classList.remove('is-flash'), 1600); }
      on = i;
    };
    const ask = () => { if (!wait) { wait = true; requestAnimationFrame(paint); } };
    addEventListener('scroll', ask, { passive: true }); addEventListener('resize', ask); addEventListener('load', ask); ask();
  }

  // ── библиотека ──
  $('#lib').innerHTML = D.bookCats.map(C.bookCat).join('');

  // ── вопросы ──
  // под заголовком — «Не нашли ответа?» без подложки: строка и одна кнопка «Связаться»
  $('#faq-ask').innerHTML = `<p class="fqx-ask-t">Не нашли ответа?</p><p class="fqx-ask-s">Напишите нам — ответим в&nbsp;течение 15&nbsp;минут в&nbsp;рабочее время.</p>
    <button class="fb fb--dark fqx-ask-b" data-open="form" data-q="Вопрос"><span>Связаться</span>${AR}</button>`;
  const fq = $('#faq-list');
  fq.innerHTML = D.faq.slice(0, 6).map((f, i) => `<div class="fq-i${i ? '' : ' is-open'}"><button class="fq-q" aria-expanded="${!i}"><span class="num">${pad(i + 1)}</span><b>${f.q}</b><i></i></button><div class="fq-a"><div><p>${f.a}</p></div></div></div>`).join('');
  fq.addEventListener('click', e => {
    const q = e.target.closest('.fq-q'); if (!q) return;
    const it = q.parentElement, on = !it.classList.contains('is-open');
    $$('.fq-i.is-open', fq).forEach(x => { if (x !== it) { x.classList.remove('is-open'); $('.fq-q', x).setAttribute('aria-expanded', false); } });
    it.classList.toggle('is-open', on); q.setAttribute('aria-expanded', on);
  });

  // ── география: силуэт России по Figma (js/map-outline.js), сеть дуг из Москвы, свечение городов, редкие вспышки. Справа — карточки пяти городов с наибольшим числом проектов и красная «Всего».
  //    Наведение на карточку прочерчивает красный маршрут к городу и показывает подсказку у точки; наведение на точку — то же ──
  const map = $('#map'), tip = $('#map-tip'), C0 = D.cities;
  const pl = (n, f) => { const a = n % 10, b = n % 100; return a === 1 && b !== 11 ? f[0] : a >= 2 && a <= 4 && (b < 12 || b > 14) ? f[1] : f[2]; };
  map.insertAdjacentHTML('afterbegin', C.mapSVG());

  const top = C0.map((c, i) => [c, i]).sort((a, b) => b[0][3] - a[0][3]).slice(0, 5);
  $('#geo-cards').innerHTML = top.map(([c, i]) => `<li class="gc" data-i="${i}"><b class="gc-t">${c[0]}</b><span class="gc-s">${c[4]}</span><p class="gc-v"><strong>${c[3]}</strong><span>${plural(c[3])}</span></p></li>`).join('')
    + `<li class="gc gc--acc"><b class="gc-t">Вся Россия</b><span class="gc-s">городов в&nbsp;стране — работаем в&nbsp;любом</span><p class="gc-v"><strong>1100+</strong></p></li>`;
  const fact = D.about.facts[0];
  $('#geo-total').innerHTML = `<strong>${fact.n}</strong><span>${fact.t}</span>`;
  if (D.geoImg) $('#geo-art').innerHTML = `<img src="img/${D.geoImg}" alt="" loading="lazy">`;

  const lit = i => {
    $$('.rt-on', map).forEach(p => p.classList.toggle('is-on', p.dataset.i === i));
    $$('.city', map).forEach(g => g.classList.toggle('is-on', g.dataset.i === i));
    $$('#geo-cards .gc[data-i]').forEach(c => c.classList.toggle('is-on', c.dataset.i === i));
  };
  const show = g => {
    const c = C0[g.dataset.i], mr = map.getBoundingClientRect(), gr = g.getBoundingClientRect();
    tip.innerHTML = `<b>${c[0]}</b><p><strong>${c[3]}</strong> ${plural(c[3])}</p><small>${c[4]}</small>`;
    tip.style.left = Math.min(Math.max(gr.left + gr.width / 2 - mr.left, 110), mr.width - 110) + 'px';
    tip.style.top = gr.top - mr.top + 'px';
    tip.classList.add('is-on'); lit(g.dataset.i);
  };
  const hide = () => { tip.classList.remove('is-on'); lit(null); };
  $$('.city', map).forEach(g => {
    g.addEventListener('mouseenter', () => show(g)); g.addEventListener('focus', () => show(g));
    g.addEventListener('mouseleave', hide); g.addEventListener('blur', hide); g.addEventListener('click', () => show(g));
  });
  $$('#geo-cards .gc[data-i]').forEach(c => {
    const g = $(`.city[data-i="${c.dataset.i}"]`, map);
    c.addEventListener('mouseenter', () => show(g)); c.addEventListener('mouseleave', hide);
  });
  // свечение и вспышки идут, только пока блок на экране
  const geo = $('#geo');
  const cities = $$('.city', map), bag = cities.flatMap((g, i) => Array(1 + Math.round(Math.sqrt(C0[i][3]))).fill(g)).concat($$('.cov', map));
  let flash = 0;
  new IntersectionObserver(([e]) => {
    geo.classList.toggle('is-live', e.isIntersecting);
    clearInterval(flash);
    // живые вспышки: пока блок на экране, случайный город (чаще — где больше проектов) расходится кольцом
    if (e.isIntersecting && !matchMedia('(prefers-reduced-motion: reduce)').matches) flash = setInterval(() => {
      const g = bag[Math.floor(Math.random() * bag.length)]; if (g.classList.contains('is-ping')) return;
      g.classList.add('is-ping'); setTimeout(() => g.classList.remove('is-ping'), 1700);
    }, 1400);
  }).observe(geo);
})();
