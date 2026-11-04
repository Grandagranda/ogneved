// Первый экран: ролик тушения (img/hero.mp4, петля из _tools/hero-video.cjs) + карточка работ и пометки к ним в кадре.
// Карточка перебирает шесть услуг (сама по кругу или по клику), у каждой — свой слой пометок на том, что есть в ролике.
// Камера в ролике неподвижна, поэтому пометки привязаны к пикселям кадра 1756×1176.
(function () {
  const art = document.getElementById('art'), plate = document.getElementById('plate');
  if (!art || !plate) return;
  const W = 1756, H = 1176, D = window.OG;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pct = (x, y) => `left:${(x / W * 100).toFixed(3)}%;top:${(y / H * 100).toFixed(3)}%`;
  const pt = p => p.map(v => v.toFixed(1)).join(',');
  const sv = p => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
  const FLAME = '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>';
  // сглаженный путь через точки (Catmull-Rom → кубические Безье)
  const spline = p => p.reduce((d, c, i) => {
    if (!i) return `M${pt(c)}`;
    const a = p[i - 2] || p[i - 1], b = p[i - 1], e = p[i + 1] || c;
    return d + `C${pt([b[0] + (c[0] - a[0]) / 6, b[1] + (c[1] - a[1]) / 6])} ${pt([c[0] - (e[0] - b[0]) / 6, c[1] - (e[1] - b[1]) / 6])} ${pt(c)}`;
  }, '');
  const dot = (p, i = 0) => `<circle cx="${p[0]}" cy="${p[1]}" r="6" class="hx-dot" style="--i:${i}"/>`;
  const leader = (pts, i = 0) => `<path d="M${pts.map(pt).join('L')}" class="hx-ln" pathLength="1" style="--i:${i}"/>`;
  const arrow = (p, deg) => `<path d="M0,0L-17,-8.5L-17,8.5Z" class="route-ar" transform="translate(${pt(p).replace(',', ' ')}) rotate(${deg.toFixed(1)})"/>`;

  // ── земля: оси сняты с цоколя здания. A — вдоль длинного фасада (по этой оси стоит АЦ), B — от фасада к зрителю ──
  const F = [823, 737], A = [.936, .353], B = [-.889, .458];
  const at = (s, t) => [F[0] + A[0] * s + B[0] * t, F[1] + A[1] * s + B[1] * t];
  const DIM = Math.atan2(-B[1], -B[0]) * 180 / Math.PI;
  // проезд: от кормы АЦ (s = −133) до автолестницы; внутренняя кромка идёт по дальнему борту АЦ, ширина — 4,2 м в масштабе машины
  const S0 = -133, S1 = 610, T1 = 252, T2 = 443, SD = 235, TC = 348;
  const tick = (p, k = 9) => `M${pt([p[0] - A[0] * k, p[1] - A[1] * k])}L${pt([p[0] + A[0] * k, p[1] + A[1] * k])}`;

  // ── точки сцены ──
  const FIRE = [1150, 395], NOZ_IN = [1042, 381], NOZ_AL = [1228, 436], SPLIT = [790, 823], HATCH = [497, 907], AL_TAG = [1188, 512];
  // рукава (оси сняты с кадра): труба в резервуаре, всасывающая линия до насоса АЦ, напорная — из-под заднего отбойника АЦ
  // (со стенки она стёрта в ролике, идёт от патрубка с дальнего борта) до разветвления, от него — во вход и на автолестницу
  const IN_TANK = [[480, 1030], [486, 1000], [493, 970], [494, 945], [490, 925], [488, 913]];
  const SUCTION = [[488, 913], [481, 893], [474, 871], [467, 849], [455, 830], [440, 813], [425, 798], [407, 788]];
  const PRESS = [[467, 811], [471, 820], [477, 828.5], [484, 836], [494, 842], [506, 845], [529, 850], [551, 853], [573, 859], [594, 868], [615, 878], [635, 890], [655, 901], [676, 908], [698, 913], [721, 913], [743, 911], [763, 903], [774, 889], [773, 868], [770, 848], [775, 832], [790, 823]];
  const TO_DOOR = [[790, 823], [763, 817], [740, 813], [717, 810], [695, 808], [673, 804], [651, 796], [636, 784], [636, 768], [651, 755], [670, 743], [687, 728], [704, 712], [723, 698], [738, 690], [743, 688]];
  const TO_AL = [[790, 823], [811, 827], [833, 835], [855, 842], [878, 849], [900, 854], [924, 858], [947, 862], [970, 865], [993, 869], [1016, 872], [1039, 874], [1061, 876], [1084, 878], [1107, 878], [1130, 877], [1152, 872], [1171, 863], [1188, 848], [1200, 829], [1208, 808], [1214, 786], [1218, 764], [1221, 742], [1224, 719], [1227, 696], [1229, 673], [1231, 649], [1233, 626], [1235, 603], [1237, 581], [1239, 557], [1244, 535], [1253, 515], [1265, 502], [1276, 497]];
  const TANK = [[332, 1078], [338, 1056], [352, 1044], [372, 1032], [400, 1018], [440, 998], [478, 977], [498, 960], [515, 960], [533, 975], [547, 998], [551, 1022], [546, 1045], [530, 1056], [500, 1072], [465, 1090], [430, 1110], [405, 1125], [385, 1137], [362, 1138], [343, 1125], [333, 1100], [332, 1078]];
  // люди: рамки [x0, y0, x1, y1]
  const CREW = [[944, 338, 994, 434], [996, 340, 1048, 434], [1233, 418, 1279, 478], [518, 662, 574, 782], [692, 804, 760, 898], [955, 884, 1028, 1040], [1535, 803, 1592, 880]];
  const CARS = [[42, 548, 478, 866], [1164, 800, 1706, 1108]];

  // ── слои: по услуге на то, что она значит в этом кадре ──
  const LAYERS = {};

  // проезды: полоса от кормы АЦ вдоль фасада тает к автолестнице, кромки прорисовываются от машины, цепочка размеров «до фасада — ширина»
  const d0 = at(SD, 0), d1 = at(SD, T1), d2 = at(SD, T2), e0 = at(S0, T1), e1 = at(S1, T1), g0 = at(S0, T2), g1 = at(S1, T2);
  const grad = (id, a, b, c) => `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}"><stop offset="0" stop-color="#f5312a" stop-opacity="${c}"/><stop offset=".62" stop-color="#f5312a" stop-opacity="${c}"/><stop offset="1" stop-color="#f5312a" stop-opacity="0"/></linearGradient>`;
  LAYERS.opp = `<defs>${grad('hl-f', at(S0, TC), at(S1, TC), .13)}${grad('hl-e', at(S0, TC), at(S1, TC), 1)}</defs>
    <path d="M${[e0, e1, g1, g0].map(pt).join('L')}Z" class="lane" fill="url(#hl-f)"/>
    <path d="M${pt(e0)}L${pt(e1)}" class="lane-edge" stroke="url(#hl-e)" pathLength="1"/><path d="M${pt(g0)}L${pt(g1)}" class="lane-edge" stroke="url(#hl-e)" pathLength="1" style="--i:1"/>
    <path d="M${pt(d0)}L${pt(d2)}" class="dim-ln" pathLength="1" style="--i:2"/><path d="${tick(d0)}${tick(d1)}${tick(d2)}" class="dim-tk"/>
    ${leader([[1252, 508], AL_TAG], 3)}${dot([1252, 508], 3)}`;

  // дислокация: маршруты прибытия обеих машин, у каждой — путь и время от части
  const r0 = at(900, TC), r1 = at(-104, TC), l0 = [1800, 798], l1 = [1662, 869];
  LAYERS.dislokaciya = `<path d="M${pt(r0)}L${pt(r1)}" class="route"/>${arrow(at(-96, TC), Math.atan2(-A[1], -A[0]) * 180 / Math.PI)}
    <path d="M${pt(l0)}L${pt(l1)}" class="route"/>${arrow([1654, 873], Math.atan2(l1[1] - l0[1], l1[0] - l0[0]) * 180 / Math.PI)}`;

  // план тушения: очаг, ввод сил от входа по лестнице к звену на этаже, ствол с автолестницы, штаб
  const ENTRY = [[738, 690], [712, 650], [712, 322], [934, 406]];
  LAYERS.ptp = `<circle cx="${FIRE[0]}" cy="${FIRE[1]}" r="30" class="ping"/><circle cx="${FIRE[0]}" cy="${FIRE[1]}" r="30" class="ping" style="--i:3"/>
    ${dot(FIRE)}${leader([FIRE, [FIRE[0], 306]], 1)}
    <path d="M${ENTRY.map(pt).join('L')}" class="route"/>${arrow([942, 409], 20.7)}
    ${leader([NOZ_AL, AL_TAG], 2)}${dot(NOZ_AL, 2)}
    ${leader([[988, 1036], [988, 1058]], 3)}`;

  // вода: резервуар, забор через люк, сигналы по всасывающей и напорной линиям до разветвления и дальше — во вход и на автолестницу
  const line = (p, c = '') => `<g class="sig ${c}"><path d="${spline(p)}" class="sig-h"/><path d="${spline(p)}" class="sig-c"/></g>`;
  LAYERS.voda = `<path d="${spline(TANK)}Z" class="hyd" pathLength="1"/>
    <ellipse cx="${HATCH[0]}" cy="${HATCH[1]}" rx="54" ry="29" class="ping"/>
    ${line(IN_TANK, 'sig--in')}${line(SUCTION)}${line(PRESS)}${line(TO_DOOR)}${line(TO_AL)}
    ${leader([[772, 858], [826, 906]], 2)}${dot([772, 858], 2)}`;

  // силы и средства: техника и стволы с выносками
  LAYERS.sily = `${leader([[300, 612], [300, 524]])}${dot([300, 612])}
    ${leader([[1474, 660], [1560, 620], [1600, 620]], 1)}${dot([1474, 660], 1)}
    ${leader([NOZ_IN, [NOZ_IN[0], 298]], 2)}${dot(NOZ_IN, 2)}
    ${leader([NOZ_AL, AL_TAG], 3)}${dot(NOZ_AL, 3)}`;

  // численность и оснащённость: уголки вокруг каждого бойца и каждой машины
  const brk = ([x0, y0, x1, y1], i, k = Math.min(12, (x1 - x0) / 3)) =>
    `<path class="brk" style="--i:${i}" d="M${x0},${y0 + k}V${y0}H${x0 + k}M${x1 - k},${y0}H${x1}V${y0 + k}M${x1},${y1 - k}V${y1}H${x1 - k}M${x0 + k},${y1}H${x0}V${y1 - k}"/>`;
  LAYERS.chislennost = CREW.map((c, i) => brk(c, i)).join('') + CARS.map((c, i) => brk(c, i + 7, 26)).join('');

  const ids = D.svcOrder;
  art.insertAdjacentHTML('beforeend', `<svg class="art-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">
    ${ids.map((id, i) => `<g class="ly" data-s="${i}">${LAYERS[id]}</g>`).join('')}</svg>`);

  // подписи: [услуга, x, y, текст, сторона, задержка, pc — только на ПК: на телефоне кадр в четыре раза меньше,
  // и второстепенная подпись наехала бы на соседнюю]
  const mid = (a, b, n = 20) => [(a[0] + b[0]) / 2 + A[0] * n, (a[1] + b[1]) / 2 + A[1] * n];
  const TAGS = [
    ['opp', ...mid(d0, d1), '5,2 м', 'dim', 0], ['opp', ...mid(d1, d2), '4,2 м', 'dim', 1], ['opp', ...AL_TAG, 'Доступ на 4 этаж', 'r', 2],
    ['dislokaciya', ...at(560, TC), 'ПЧ-12 · 2,4 км · 7 мин', 'c', 0], ['dislokaciya', 1668, 908, 'ПЧ-7 · 3,1 км · 9 мин', 'l', 1],
    ['ptp', FIRE[0], 292, `${sv(FLAME)}Очаг · 4 этаж`, 'c red', 0], ['ptp', 712, 486, 'Ввод сил по лестнице', 'c pc', 1], ['ptp', ...AL_TAG, 'Ствол с автолестницы', 'r', 2], ['ptp', 988, 1072, 'РТП · штаб', 'c', 3],
    ['voda', 566, 1086, 'Резервуар · 80 м³', 'l', 0], ['voda', 566, 950, 'Забор воды · 16 л/с', 'l pc', 1], ['voda', 826, 906, 'Рукав DN 80', 'l', 2],
    ['sily', 300, 510, 'АЦ-3,2-40', 'c', 0], ['sily', 1604, 620, 'АЛ-30', 'l', 1], ['sily', NOZ_IN[0], 284, 'Ствол РСКУ-50А · 8 л/с', 'c', 2], ['sily', ...AL_TAG, 'Ствол РСКУ-50А · 8 л/с', 'r pc', 3],
    ['chislennost', 991, 1072, 'Личный состав · 7 чел.', 'c', 2], ['chislennost', 260, 526, 'Техника · 2 ед.', 'c', 3],
  ];
  art.insertAdjacentHTML('beforeend', `<div class="art-tags" aria-hidden="true">${TAGS.map(([id, x, y, t, a, i]) =>
    `<span class="tg-t ${a.split(' ').map(k => 'tg-t--' + k).join(' ')}" data-s="${ids.indexOf(id)}" style="${pct(x, y)};--i:${i}${a.startsWith('dim') ? `;--r:${DIM.toFixed(2)}deg` : ''}">${t}</span>`).join('')}</div>`);

  const svg = art.querySelector('.art-svg');
  // сигнал продолжается с рукава на рукав: смещение штриха = путь воды от резервуара (+ насос в машине)
  const sigs = [...svg.querySelectorAll('.sig')], len = g => g.lastElementChild.getTotalLength();
  const hose = len(sigs[0]), pump = hose + len(sigs[1]) + 90, split = pump + len(sigs[2]);
  [0, hose, pump, split, split].forEach((o, i) => sigs[i].style.setProperty('--o', o.toFixed(1) + 'px'));

  // толщина линий — в пикселях экрана, а не ролика
  const fit = () => svg.style.setProperty('--u', (W / art.clientWidth).toFixed(4) + 'px');
  addEventListener('resize', fit); fit();

  // ── карточка ──
  plate.innerHTML = `<div class="pl-hd">Наши работы на объекте</div>
    <ol class="pl-list">${ids.map((id, i) => `<li><button type="button" class="pl-i" data-i="${i}" aria-pressed="false">
      <i class="pl-n">0${i + 1}</i><b>${D.svc(id).cardT}</b><i class="pl-sq"></i><i class="pl-bar"></i></button></li>`).join('')}</ol>`;

  const root = document.querySelector('.hero'), items = [...plate.querySelectorAll('.pl-i')];
  const layers = [...svg.querySelectorAll('.ly')], tags = [...art.querySelectorAll('.art-tags [data-s]')];
  // телефон: карточка под роликом — лента услуг; выбранная сама подъезжает к левому краю, пока ленту не трогают пальцем
  const MOB = window.OG_MQ || matchMedia('not all'), list = plate.querySelector('.pl-list');
  let touched = 0;
  list.addEventListener('pointerdown', () => { touched = performance.now(); }, { passive: true });
  list.addEventListener('scroll', () => { touched = Math.max(touched, performance.now() - 2500); }, { passive: true });
  let cur = -1;
  function show(i) {
    if (i === cur) return;
    cur = i;
    items.forEach((b, k) => { b.classList.toggle('is-on', k === i); b.setAttribute('aria-pressed', k === i); });
    layers.forEach((l, k) => l.classList.toggle('is-on', k === i));
    tags.forEach(t => t.classList.toggle('is-on', +t.dataset.s === i));
    // телефон: кадр во всю ширину экрана — подпись у края сдвигаем внутрь, чтобы не обрезалась
    const a = art.getBoundingClientRect();
    tags.forEach(t => {
      t.style.marginLeft = ''; if (!MOB.matches || +t.dataset.s !== i) return;
      const r = t.getBoundingClientRect(), over = r.right - (a.right - 8), under = a.left + 8 - r.left;
      if (over > 0) t.style.marginLeft = -over + 'px'; else if (under > 0) t.style.marginLeft = under + 'px';
    });
    if (MOB.matches && performance.now() - touched > 4000 && list.scrollWidth > list.clientWidth) {
      const li = items[i].parentElement, pl = parseFloat(getComputedStyle(list).paddingLeft) || 0;
      list.scrollTo({ left: li.offsetLeft - pl, behavior: 'smooth' });
    }
  }
  // время показа услуги задаёт линия в карточке: закончилась — следующая
  plate.addEventListener('animationend', e => { if (e.target.classList.contains('pl-bar') && !reduce) show((cur + 1) % ids.length); });
  plate.addEventListener('click', e => { const b = e.target.closest('.pl-i'); if (b) show(+b.dataset.i); });

  // вне экрана ролик и сцена стоят
  const video = art.querySelector('.art-video');
  // экономия трафика (Save-Data, медленная сеть) — ролик не грузим, стоит постер
  const net = navigator.connection || {}, lean = net.saveData || /(^|-)2g$/.test(net.effectiveType || '');
  if (lean && !reduce) { video.removeAttribute('autoplay'); video.querySelectorAll('source').forEach(s => s.remove()); video.load(); }
  if (reduce) { video.removeAttribute('autoplay'); video.pause(); }
  // источники ролика снял встроенный скрипт в index.html — подключаем их, когда страница загрузилась
  if (video.ogSrc && !lean && !reduce) {
    // если к этому времени первый экран уже ушёл из кадра — ролик ждёт возвращения наверх и не отнимает канал у картинок ниже
    const attach = () => { if (!video.ogSrc) return; if (root.classList.contains('is-off')) return void (video.ogWait = true); video.ogSrc.forEach(s => video.append(s)); video.ogSrc = null; video.ogWait = false; video.setAttribute('autoplay', ''); video.load(); video.play().catch(() => {}); };
    video.ogAttach = attach;
    document.readyState === 'complete' ? setTimeout(attach, 300) : addEventListener('load', () => setTimeout(attach, 300), { once: true });
  }
  new IntersectionObserver(([e]) => {
    root.classList.toggle('is-off', !e.isIntersecting);
    if (reduce || lean) return;
    if (e.isIntersecting && video.ogWait) video.ogAttach();
    if (e.isIntersecting) video.play().catch(() => {}); else video.pause();
  }).observe(root);

  let started = false;
  const start = () => { if (started) return; started = true; root.classList.add('is-ready'); setTimeout(() => show(0), reduce ? 0 : 900); };
  // кадр уже стоит постером — пометки не ждут ролика
  if ('ogSrc' in video) setTimeout(start, 600);
  video.readyState >= 2 ? start() : (video.addEventListener('loadeddata', start, { once: true }), video.addEventListener('error', start, { once: true }), setTimeout(start, 2500));
})();
