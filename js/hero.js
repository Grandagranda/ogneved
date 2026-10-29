// Первый экран: ролик тушения (img/hero.mp4, петля из _tools/hero-video.cjs) + карточка услуг и пометки к ним в кадре.
// Карточка перебирает шесть направлений работы (сама по кругу или по клику), у каждого — свой слой пометок.
// Камера в ролике неподвижна, поэтому пометки привязаны к пикселям кадра 1676×1236.
(function () {
  const art = document.getElementById('art'), plate = document.getElementById('plate');
  if (!art || !plate) return;
  const W = 1676, H = 1236;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pct = (x, y) => `left:${(x / W * 100).toFixed(3)}%;top:${(y / H * 100).toFixed(3)}%`;
  const pt = p => p.map(v => v.toFixed(1)).join(',');
  const poly = a => 'M' + a.map(pt).join('L') + 'Z';
  const sv = p => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
  const FLAME = '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>';
  // сглаженный путь через точки (Catmull-Rom → кубические Безье)
  const spline = p => p.reduce((d, c, i) => {
    if (!i) return `M${pt(c)}`;
    const a = p[i - 2] || p[i - 1], b = p[i - 1], e = p[i + 1] || c;
    return d + `C${pt([b[0] + (c[0] - a[0]) / 6, b[1] + (c[1] - a[1]) / 6])} ${pt([c[0] - (e[0] - b[0]) / 6, c[1] - (e[1] - b[1]) / 6])} ${pt(c)}`;
  }, '');

  // ── земля: оси сняты с цоколя здания. U — вдоль правого фасада (по нему стоят машины), V — от фасада к зрителю ──
  const F = [616, 881], U = [.918, -.397], V = [.878, .478];
  const at = (s, t) => [F[0] + U[0] * s + V[0] * t, F[1] + U[1] * s + V[1] * t];
  const ANG = Math.atan2(V[1], V[0]) * 180 / Math.PI;
  // проезд: от фасада 150, ширина 120 (передок АЦ — s = −49, борта — t 161…252); дальше к зрителю уходит под форму
  const S0 = -560, S1 = -49, T1 = 150, T2 = 270, SD = -135;
  const tick = (p, k = 7) => `M${pt([p[0] - k, p[1] + k])}L${pt([p[0] + k, p[1] - k])}`;

  // ── точки сцены ──
  const FIRE = [895, 365], NOZ = [1074, 321], HYD = [1102, 966];
  // рукав: от разветвления у гидранта до насоса автолестницы; линия на лестнице — от поворотного основания к люльке
  const HOSE = [[1052, 1011], [1074, 1013], [1136, 1025], [1186, 1036], [1230, 1041], [1274, 1037], [1330, 1021], [1386, 996], [1442, 974], [1492, 960], [1517, 949], [1530, 933], [1524, 914], [1511, 899], [1499, 883]];
  const LADDER = [[1419, 685], [1132, 348]];
  // бойцы: рамки [x0, y0, x1, y1]
  const CREW = [[950, 935, 996, 1030], [1076, 860, 1124, 952], [1503, 836, 1542, 930], [1396, 752, 1434, 800], [1088, 288, 1128, 362]];

  // ── шесть направлений работы (порядок — как в услугах) ──
  const S = ['Проезды и подъезды', 'План тушения пожара', 'Расход воды', 'Дислокация подразделений', 'Численность охраны', 'Расчёт сил и средств'];

  // 01 · проезды: полоса перед АЦ, кромки прорисовываются от машины, цепочка размеров «до фасада — ширина»
  const d0 = at(SD, 0), d1 = at(SD, T1), d2 = at(SD, T2);
  const L0 = `<path d="${poly([at(S0, T1), at(S1, T1), at(S1, T2), at(S0, T2)])}" class="lane"/>
    <path d="M${pt(at(S1, T1))}L${pt(at(S0, T1))}" class="lane-edge" pathLength="1"/><path d="M${pt(at(S1, T2))}L${pt(at(S0, T2))}" class="lane-edge" pathLength="1" style="--i:1"/>
    <path d="M${pt(F)}L${pt(at(SD - 18, 0))}" class="dim-ext"/>
    <path d="M${pt(d0)}L${pt(d2)}" class="dim-ln" pathLength="1" style="--i:2"/><path d="${tick(d0)}${tick(d1)}${tick(d2)}" class="dim-tk"/>`;

  // 02 · план тушения: очаг пульсирует, позиция ствола
  const L1 = `<circle cx="${FIRE[0]}" cy="${FIRE[1]}" r="26" class="ping"/><circle cx="${FIRE[0]}" cy="${FIRE[1]}" r="26" class="ping" style="--i:3"/>
    <circle cx="${FIRE[0]}" cy="${FIRE[1]}" r="6.5" class="hx-dot"/>
    <path d="M${pt(NOZ)}L${NOZ[0]},262" class="hx-ln" pathLength="1" style="--i:1"/><circle cx="${NOZ[0]}" cy="${NOZ[1]}" r="6" class="hx-dot" style="--i:1"/>`;

  // 03 · вода: гидрант, сигналы по рукаву и вверх по лестнице к стволу
  const hoseD = spline(HOSE), ladD = `M${pt(LADDER[0])}L${pt(LADDER[1])}`;
  const L2 = `<ellipse cx="${HYD[0]}" cy="${HYD[1]}" rx="30" ry="13" class="hyd" pathLength="1"/><ellipse cx="${HYD[0]}" cy="${HYD[1]}" rx="30" ry="13" class="ping"/>
    <path d="M${HYD[0]},${HYD[1] + 13}L${HYD[0]},1040" class="hx-ln" pathLength="1" style="--i:1"/>
    <g class="sig"><path d="${hoseD}" class="sig-h"/><path d="${hoseD}" class="sig-c"/></g>
    <g class="sig"><path d="${ladD}" class="sig-h"/><path d="${ladD}" class="sig-c"/></g>`;

  // 04 · дислокация: маршрут прибытия по оси проезда к передку АЦ
  const r0 = at(S0 - 40, (T1 + T2) / 2), r1 = at(S1 - 16, (T1 + T2) / 2);
  const L3 = `<path d="M${pt(r0)}L${pt(r1)}" class="route"/>
    <path d="M0,0L-16,-8L-16,8Z" class="route-ar" transform="translate(${pt(at(S1 - 6, (T1 + T2) / 2)).replace(',', ' ')}) rotate(${(Math.atan2(U[1], U[0]) * 180 / Math.PI).toFixed(1)})"/>`;

  // 05 · численность: уголки вокруг каждого бойца
  const brk = ([x0, y0, x1, y1], i) => { const k = Math.min(12, (x1 - x0) / 3);
    return `<path class="brk" style="--i:${i}" d="M${x0},${y0 + k}V${y0}H${x0 + k}M${x1 - k},${y0}H${x1}V${y0 + k}M${x1},${y1 - k}V${y1}H${x1 - k}M${x0 + k},${y1}H${x0}V${y1 - k}"/>`; };
  const L4 = CREW.map(brk).join('');

  // 06 · силы и средства: техника и ствол с выносками
  const AC = [930, 800], AL = [1430, 758];
  const L5 = `<path d="M${pt(AC)}L${AC[0]},708" class="hx-ln" pathLength="1"/><circle cx="${AC[0]}" cy="${AC[1]}" r="6" class="hx-dot"/>
    <path d="M${pt(AL)}L1500,706L1556,706" class="hx-ln" pathLength="1" style="--i:1"/><circle cx="${AL[0]}" cy="${AL[1]}" r="6" class="hx-dot" style="--i:1"/>
    <path d="M${pt(NOZ)}L${NOZ[0]},262" class="hx-ln" pathLength="1" style="--i:2"/><circle cx="${NOZ[0]}" cy="${NOZ[1]}" r="6" class="hx-dot" style="--i:2"/>`;

  art.insertAdjacentHTML('beforeend', `<svg class="art-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">
    ${[L0, L1, L2, L3, L4, L5].map((l, i) => `<g class="ly" data-s="${i}">${l}</g>`).join('')}</svg>`);

  // подписи: [раздел, x, y, текст, сторона, задержка]
  const mid = (a, b, n = 16) => [(a[0] + b[0]) / 2 + U[0] * n, (a[1] + b[1]) / 2 + U[1] * n];
  const TAGS = [
    [0, ...mid(d0, d1), '5,2 м', 'dim', 0], [0, ...mid(d1, d2), '4,2 м', 'dim', 1],
    [1, FIRE[0] - 40, FIRE[1], `${sv(FLAME)}Очаг · 4 этаж`, 'r red', 0], [1, NOZ[0], 248, 'Позиция ствола', 'c', 1],
    [2, HYD[0], 1052, 'ПГ-1 · 40 л/с', 'c', 1], [2, 1330, 1048, 'Рукав Ø 77 · 60 м', 'c', 2],
    [3, ...at(-170, 100), 'ПЧ-12 · 2,4 км · 7 мин', 'c', 0],
    [4, 975, 1050, 'Боевой расчёт · 5 чел.', 'c', 2],
    [5, AC[0], 694, 'АЦ-6,0-40', 'c', 0], [5, 1556, 706, 'АЛ-30', 'l', 1], [5, NOZ[0], 248, 'Ствол «Л» · 7,4 л/с', 'c', 2],
  ];
  art.insertAdjacentHTML('beforeend', `<div class="art-tags" aria-hidden="true">${TAGS.map(([s, x, y, t, a, i]) =>
    `<span class="tg-t ${a.split(' ').map(k => 'tg-t--' + k).join(' ')}" data-s="${s}" style="${pct(x, y)};--i:${i}${a === 'dim' ? `;--r:${ANG.toFixed(2)}deg` : ''}">${t}</span>`).join('')}</div>`);

  const svg = art.querySelector('.art-svg');
  // сигнал на лестнице продолжает сигнал рукава: смещение штриха = путь воды от гидранта (+ насос в машине)
  const sigs = [...svg.querySelectorAll('.sig')];
  sigs[0].style.setProperty('--o', '0px');
  sigs[1].style.setProperty('--o', (sigs[0].lastElementChild.getTotalLength() + 90).toFixed(1) + 'px');

  // толщина линий — в пикселях экрана, а не ролика
  const fit = () => svg.style.setProperty('--u', (W / art.clientWidth).toFixed(4) + 'px');
  addEventListener('resize', fit); fit();

  // ── карточка ──
  plate.innerHTML = `<div class="pl-hd">Что мы рассчитываем</div>
    <ol class="pl-list">${S.map((s, i) => `<li><button type="button" class="pl-i" data-i="${i}" aria-pressed="false">
      <i class="pl-n">0${i + 1}</i><b>${s}</b><i class="pl-sq"></i><i class="pl-bar"></i></button></li>`).join('')}</ol>`;

  const root = document.querySelector('.hero'), items = [...plate.querySelectorAll('.pl-i')];
  const layers = [...svg.querySelectorAll('.ly')], tags = [...art.querySelectorAll('.art-tags [data-s]')];
  let cur = -1;
  function show(i) {
    if (i === cur) return;
    cur = i;
    items.forEach((b, k) => { b.classList.toggle('is-on', k === i); b.setAttribute('aria-pressed', k === i); });
    layers.forEach((l, k) => l.classList.toggle('is-on', k === i));
    tags.forEach(t => t.classList.toggle('is-on', +t.dataset.s === i));
  }
  // время показа услуги задаёт линия в карточке: закончилась — следующая
  plate.addEventListener('animationend', e => { if (e.target.classList.contains('pl-bar') && !reduce) show((cur + 1) % S.length); });
  plate.addEventListener('click', e => { const b = e.target.closest('.pl-i'); if (b) show(+b.dataset.i); });

  // вне экрана ролик и сцена стоят
  const video = art.querySelector('.art-video');
  if (reduce) { video.removeAttribute('autoplay'); video.pause(); }
  new IntersectionObserver(([e]) => {
    root.classList.toggle('is-off', !e.isIntersecting);
    if (reduce) return;
    if (e.isIntersecting) video.play().catch(() => {}); else video.pause();
  }).observe(root);

  let started = false;
  const start = () => { if (started) return; started = true; root.classList.add('is-ready'); setTimeout(() => show(0), reduce ? 0 : 900); };
  video.readyState >= 2 ? start() : (video.addEventListener('loadeddata', start, { once: true }), video.addEventListener('error', start, { once: true }), setTimeout(start, 2500));
})();
