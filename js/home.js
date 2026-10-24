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

  // ── о нас ──
  $('#nums').innerHTML = D.about.facts.map((f, i) =>
    `<li class="rv" style="--i:${i}"><span class="nums-k mono">${pad(i + 1)}</span><b${/^\d+\+?$/.test(f.n) ? ' data-count' : ''}>${f.n}</b><p>${f.t}</p></li>`).join('');
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
  const S = D.services, FX = window.OG_FX || {};
  const GO = '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M16 23 23 16M16 16h7v7"/></svg>';
  $('#svc').innerHTML = S.map((s, i) => { const fx = FX[s.id]; return `<article class="sc" data-fx="${s.id}">
      <div class="sc-art"><img class="sc-im" src="img/s-${s.id}.webp" alt="" loading="lazy">
        ${fx ? `<svg class="sc-fx" viewBox="0 0 ${FX.W} ${FX.H}" aria-hidden="true">${fx.svg}</svg><div class="sc-tags" aria-hidden="true">${fx.html}</div>` : ''}</div>
      <span class="sc-n">${pad(i + 1)} / ${pad(S.length)}</span><span class="sc-d">${s.days} раб. дней</span>
      <div class="sc-b">
        <h3><a class="cover-link" href="usluga.html?id=${s.id}">${s.short}</a></h3>
        <p>${s.lead}</p>
        <div class="sc-f"><p class="sc-p"><small>Стоимость</small><b>от ${D.rub(s.price)}</b></p><span class="sc-go">${GO}</span></div>
      </div>
    </article>`; }).join('');

  // белые панели карточек — одной высоты: по самой высокой (двухстрочный заголовок), иначе в ряду они «пляшут»
  const scB = $$('.sc-b', $('#svc'));
  const eqSc = () => { scB.forEach(b => (b.style.minHeight = '')); const h = Math.max(...scB.map(b => b.offsetHeight)); scB.forEach(b => (b.style.minHeight = h + 'px')); };
  eqSc(); addEventListener('resize', eqSc); addEventListener('load', eqSc); document.fonts && document.fonts.ready.then(eqSc);

  // ── объекты: лента едет вбок, пока блок закреплён ──
  const OX = window.OG_OBJ;
  $('#obj').innerHTML = D.objects.map((o, i) => `<article class="obx rv" style="--i:${Math.min(i, 3)}">
      <div class="obx-m"><img src="img/o-${o.id}.webp" alt="" loading="lazy"><svg class="ox-fx" viewBox="0 0 ${OX.W} ${OX.H}" aria-hidden="true">${OX[o.id] || ''}</svg></div>
      <div class="obx-b"><span class="obx-n mono">${pad(i + 1)}</span><h3>${o.t}</h3>
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

  // ── работы: фильтр по услугам, 4 карточки в асимметричной сетке ──
  const used = S.filter(s => D.works.some(w => w.s === s.id));
  const wf = $('#works-f'), wl = $('#works-list'), more = $('#works-more');
  const work = (w, i) => `<article class="wkc wkc--${i}">
      <a class="wkc-img" href="rabota.html?id=${w.id}" tabindex="-1"><img src="img/${w.img}.webp" alt="${w.obj}" loading="lazy" data-par></a>
      <div class="wkc-b">
        <p class="wkc-m"><span>${w.type}</span><span>${w.city}</span></p>
        <h3><a class="cover-link" href="rabota.html?id=${w.id}">${w.obj}</a></h3>
        <dl class="wkc-dl"><div><dt>Стоимость</dt><dd>${w.cost} тыс. ₽</dd></div><div><dt>Срок</dt><dd>${w.days} ${C.dn(w.days)}</dd></div></dl>
        ${w.extra ? `<p class="wkc-x"><b>+</b>${w.extra}</p>` : ''}
      </div>
    </article>`;
  wf.innerHTML = [['all', 'Все проекты'], ...used.map(s => [s.id, s.short])].map(([v, t], i) => `<button class="chip2${i ? '' : ' is-on'}" data-f="${v}">${t}</button>`).join('');
  const showWorks = v => {
    const list = D.works.filter(w => v === 'all' || w.s === v).slice(0, 4);
    wl.classList.add('is-swap');
    setTimeout(() => { wl.innerHTML = list.map(work).join(''); wl.classList.remove('is-swap'); }, wl.children.length ? 260 : 0);
  };
  more.querySelector('span').textContent = `Все проекты · ${D.works.length}`;
  wf.addEventListener('click', e => { const b = e.target.closest('[data-f]'); if (!b) return; $$('.chip2', wf).forEach(x => x.classList.toggle('is-on', x === b)); showWorks(b.dataset.f); });
  showWorks('all');

  // ── стоимость: калькулятор по шагам (js/calc.js); в окне «Рассчитать стоимость» — он же ──
  window.OG_CALC($('#calc'));
  const mc = $('#m-calc [data-calc]');
  if (mc) { const fresh = document.createElement('div'); fresh.dataset.calc = ''; mc.replaceWith(fresh); window.OG_CALC(fresh); }

  // ── как мы работаем: блок закрепляется на экран (.stk-pin), в кадре одна карточка шага; по прокрутке следующая
  //    выезжает снизу и ложится поверх (--p: 0 — за нижним краем экрана, 1 — на месте), предыдущие уменьшаются, темнеют
  //    и уходят в стопку кромкой сверху (--k: сколько карточек легло сверху) ──
  const ST = D.steps;
  const stk = $('#stk'), run = $('#stk-run');
  // карточка — по Figma (Page 1, Rectangle 26…30): слева плашка срока, линия, заголовок и описание внизу; справа панель-иллюстрация с номером
  stk.innerHTML = ST.map((x, i) => `<li class="stk-c${i === ST.length - 1 ? ' stk-c--fin' : ''}" style="--i:${i}">
      <div class="stk-b"><span class="stk-chip">${x.dur}</span><h3>${x.t}</h3><p>${x.p}</p></div>
      <div class="stk-m">${pic(x.img, `Иллюстрация · шаг ${pad(i + 1)} · PNG`, 'stk-im')}<span class="stk-k mono">${pad(i + 1)} из ${pad(ST.length)}</span></div>
    </li>`).join('');
  const stc = $$('.stk-c', stk);
  // прокрутка: на смену карточки — 80 % высоты экрана; в начале и в конце короткая пауза, чтобы первая и последняя успели постоять
  const SEG = .8, HOLD0 = .15, HOLD1 = .35, MOVE = .75;
  run.style.height = `${(100 + (stc.length - 1 + HOLD0 + HOLD1) * SEG * 100).toFixed(1)}vh`;
  const ease = t => t * t * (3 - 2 * t);
  tick(() => {
    const u = -run.getBoundingClientRect().top / (innerHeight * SEG) - HOLD0;
    const p = stc.map((c, j) => j ? ease(Math.min(1, Math.max(0, (u - (j - 1)) / MOVE))) : 1);
    let k = 0;
    for (let i = stc.length - 1; i >= 0; i--) {
      stc[i].style.setProperty('--p', p[i].toFixed(4)); stc[i].style.setProperty('--k', k.toFixed(4));
      k += i ? p[i] : 0;
    }
  });

  // ── статьи: лента сдвигается на карточку; последняя встаёт к правому краю колонки ──
  {
    const arx = $('#arts'), prev = $('#ar-prev'), next = $('#ar-next');
    arx.innerHTML = D.articles.slice(0, 4).map((a, i) => `<article class="arc" style="--i:${i}">
        <a class="arc-img" href="statya.html?id=${a.id}" tabindex="-1" draggable="false"><img src="img/${a.img}.webp" alt="" loading="lazy" draggable="false"></a>
        <span class="arc-tag">${a.tag}</span>
        <div class="arc-b">
          <h3><a class="cover-link" href="statya.html?id=${a.id}" draggable="false">${a.t}</a></h3>
          <p class="arc-d">${a.d}</p>
          <div class="arc-f"><p><span>Дата публикации</span><time>${a.date}</time></p><span class="fb fb--sm arc-btn"><span>Читать</span>${AR}</span></div>
        </div>
      </article>`).join('');
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

  // ── библиотека ──
  $('#lib').innerHTML = D.books.slice(0, 5).map(C.book).join('');

  // ── вопросы ──
  // под заголовком — «Не нашли ответа?» без подложки: строка и одна кнопка «Связаться»
  $('#faq-ask').innerHTML = `<p class="fqx-ask-t">Не нашли ответа?</p><p class="fqx-ask-s">Напишите нам — ответим в&nbsp;течение 15&nbsp;минут в&nbsp;рабочее время.</p>
    <button class="fb fb--dark fqx-ask-b" data-open="form" data-q="Вопрос"><span>Связаться</span>${AR}</button>`;
  const fq = $('#faq-list');
  fq.innerHTML = D.faq.slice(0, 6).map((f, i) => `<div class="fq-i${i ? '' : ' is-open'}"><button class="fq-q" aria-expanded="${!i}"><span class="mono">${pad(i + 1)}</span><b>${f.q}</b><i></i></button><div class="fq-a"><div><p>${f.a}</p></div></div></div>`).join('');
  fq.addEventListener('click', e => {
    const q = e.target.closest('.fq-q'); if (!q) return;
    const it = q.parentElement, on = !it.classList.contains('is-open');
    $$('.fq-i.is-open', fq).forEach(x => { if (x !== it) { x.classList.remove('is-open'); $('.fq-q', x).setAttribute('aria-expanded', false); } });
    it.classList.toggle('is-open', on); q.setAttribute('aria-expanded', on);
  });

  // ── география: силуэт России по Figma (js/map-outline.js), сеть дуг из Москвы, свечение городов, редкие вспышки. Справа — карточки пяти городов с наибольшим числом проектов и красная «Всего».
  //    Наведение на карточку прочерчивает красный маршрут к городу и показывает подсказку у точки; наведение на точку — то же ──
  const M = window.OG_MAP, map = $('#map'), tip = $('#map-tip'), C0 = D.cities;
  const pl = (n, f) => { const a = n % 10, b = n % 100; return a === 1 && b !== 11 ? f[0] : a >= 2 && a <= 4 && (b < 12 || b > 14) ? f[1] : f[2]; };
  const max = Math.max(...C0.map(c => c[3]));
  const P = C0.map(c => M.xy(c[1], c[2])), HUB = P[0];
  const f1 = v => v.toFixed(1);
  // дуга из Москвы: середина приподнята на четверть расстояния
  const route = ([x, y]) => { const [hx, hy] = HUB, d = Math.hypot(x - hx, y - hy); return `M${f1(hx)},${f1(hy)}Q${f1((hx + x) / 2)},${f1((hy + y) / 2 - d * .25)} ${f1(x)},${f1(y)}`; };
  // волна: всё зажигается из Москвы наружу — задержка по расстоянию
  const FAR = Math.max(...P.map(([x, y]) => Math.hypot(x - HUB[0], y - HUB[1])));
  const wave = (x, y) => (.2 + Math.hypot(x - HUB[0], y - HUB[1]) / FAR * 1.8).toFixed(2);
  // карта по Figma («09 · География» → «Контур России»): сплошной светлый силуэт без точек и обводки
  let svg = `<svg viewBox="-12 -12 ${M.w + 24} ${M.h + 24}" class="map-svg" role="img" aria-label="Карта выполненных проектов">`;
  svg += `<defs><radialGradient id="og-glow"><stop offset="0" stop-color="#f5312a" stop-opacity=".55"/><stop offset=".4" stop-color="#f5312a" stop-opacity=".16"/><stop offset="1" stop-color="#f5312a" stop-opacity="0"/></radialGradient></defs>`;
  svg += `<path class="map-land" d="${M.outline}"/>`;
  // сеть: от Москвы к каждому городу с проектами тонкая дуга — при появлении блока прорисовываются по очереди и остаются неподвижными
  svg += `<g class="map-rt">${P.map((p, i) => {
    if (!i) return '';
    let s = `<path class="rt-n" d="${route(p)}" pathLength="1" style="--w:${wave(...p)}s"/>`;
    return s + `<path class="rt-on" data-i="${i}" d="${route(p)}" pathLength="1"/>`;
  }).join('')}</g>`;
  // города покрытия — мелкие серые точки; время от времени одна из них вспыхивает красным (работаем и там)
  svg += `<g class="map-cov">${(D.coverage || []).map(([t, lo, la]) => { const [x, y] = M.xy(lo, la); return `<g class="cov" style="--w:${wave(x, y)}s" transform="translate(${f1(x)},${f1(y)})"><title>${t}</title><circle class="c-rip" r="7"/><circle class="cv-dot" r="1.6"/></g>`; }).join('')}</g>`;
  // города с проектами: мягкое свечение (дышит), ядро с белым ободком, кольцо-вспышка; Москва — тёмное ядро с красным центром и двойным пульсом
  svg += C0.map(([t, , , n], i) => {
    const [x, y] = P[i], r = i ? 2 + Math.sqrt(n / max) * 3 : 4.6;
    const mark = i ? `<circle class="c-glow" r="${f1(r * 3.4)}" fill="url(#og-glow)"/><circle class="c-rip" r="${f1(r + 8)}"/><circle class="c-dot" r="${f1(r)}"/>`
      : `<circle class="c-glow" r="${f1(r * 4.2)}" fill="url(#og-glow)"/><circle class="c-ping" r="${f1(r + 11)}"/><circle class="c-ping c-ping--2" r="${f1(r + 11)}"/><circle class="c-rip" r="${f1(r + 11)}"/><circle class="c-hub" r="${f1(r)}"/><circle class="c-core" r="1.9"/>`;
    const dst = `" style="--k:${i};--w:${wave(x, y)}s;--b:${(i % 7 * .45).toFixed(2)}s`;
    return `<g class="city${i ? '' : ' city--hub'}${dst}" data-i="${i}" transform="translate(${f1(x)},${f1(y)})" tabindex="0" aria-label="${t}: ${n}">${mark}<circle class="c-hit" r="${f1(Math.max(r + 6, 12))}"/></g>`;
  }).join('');
  map.insertAdjacentHTML('afterbegin', svg + '</svg>');

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
