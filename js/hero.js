// Первый экран: рендер из Figma + плашка «Схема объекта» и чертёжные пометки поверх.
// Плашка переключает разделы схемы (сама по кругу или по клику), у каждого раздела свой слой пометок;
// сигналы по трубам — постоянно.
// Координаты SVG — пиксели исходника 2000×1116 (_src/hero-figma.png в масштабе 2000).
(function () {
  const art = document.getElementById('art'), plate = document.getElementById('plate');
  if (!art || !plate) return;
  const W = 2000, H = 1116;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pct = (x, y) => `left:${(x / W * 100).toFixed(3)}%;top:${(y / H * 100).toFixed(3)}%`;
  const pt = p => p.map(v => v.toFixed(1)).join(',');
  const poly = a => 'M' + a.map(pt).join('L') + 'Z';
  const sv = p => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
  const FLAME = '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>';

  // ── трубы: оси сняты с рендера; [путь, родитель, тонкая ветка] ──
  const NET = [
    ['M1016,789C1003,797 980,813 966,808L896,781', -1],
    ['M878.3,728L878.1,432.4Q878.1,423.4 886.8,421L1038.8,377.9Q1043.7,376.5 1044.1,381.5L1045.5,398', 0],
    ['M889.4,728L888.7,457.7Q888.7,449.7 896.3,447.3L1049.7,400', 0],
    ['M1051.4,405.6L1262.8,341.6', 2],
    ['M1262.8,341.6C1287,334 1286,317 1300,310L1327.6,301.1', 3],
    ['M1327.6,301L1167.7,246.4Q1160.1,243.8 1167.7,241.4L1361.7,182.1', 4],
    ['M1327.6,301.2L1589.6,392.5Q1597.2,395.1 1597.1,403.1L1593.8,700', 4],
    ['M1591.2,389.6L1786.8,326.4', 6],
    ['M848,598L847.3,333.9Q847.2,325.9 839.7,323.1L809.2,311.7Q803.6,309.6 797.9,311.4L672.8,349.6', 0],
    ['M660.3,353.2L458.3,413.1', 8],
    ['M847,465.3L704.4,508.1', 8],
    ['M596.1,542.4L459.7,584.9', 10],
    ['M569.9,356.9L568.6,326.2Q568.3,320.2 562.6,321.9L343,386.1', 9],
    ['M522.8,328L609.7,360.9', 12],
    ['M366.3,375.6L287.8,346', 12, 1], ['M491.1,340.2L407.9,308.6', 12, 1], ['M615.1,299.7L537.4,270.8', 12, 1],
    ['M687,277.1L609.9,250.2', 8, 1], ['M801.8,255.4L707.1,221.7', 8, 1], ['M782.7,287.2L905.7,249.4', 8, 1], ['M821.6,273.2L904.9,302.3', 8, 1],
  ];
  // что заслоняет землю: линии на земле уходят под машину и резервуар
  const TRUCK = [[1160, 835], [1162, 772], [1190, 755], [1255, 725], [1315, 712], [1330, 702], [1500, 642], [1525, 652], [1572, 668], [1582, 700], [1582, 790], [1578, 818], [1535, 842], [1500, 872], [1440, 894], [1410, 882], [1355, 895], [1310, 948], [1278, 942], [1258, 926], [1205, 916], [1162, 893]];
  const TANK = [[963, 612], [985, 590], [1040, 582], [1095, 590], [1117, 612], [1117, 780], [1100, 800], [1040, 808], [980, 800], [963, 780]];

  // ── разделы плашки ──
  const S = [
    { t: 'Внутренний водопровод', sh: 'Водопровод В2' },
    { t: 'Расход воды', sh: 'Водоснабжение' },
    { t: 'План тушения пожара', sh: 'План тушения' },
    { t: 'Проезды и техника', sh: 'Проезды и силы' },
  ];

  // пометки-подписи раздела 0: [x, y — куда указывает; lx, ly — конец выноски; текст; где подпись]
  const TAGS0 = [[824, 392, 768, 392, 'ПК-1', 'r'], [825, 544, 768, 544, 'ПК-2', 'r'], [884, 620, 840, 620, 'Ст. В2-1', 'r'], [1594, 660, 1548, 660, 'Ст. В2-2', 'r']];
  // выноски с расчётами по разделам
  const CALL = [
    [],
    [{ x: 1040, y: 592, lx: 1040, ly: 470, side: 'l', k: 'Резервуар Р-1', v: '108 м³ · запас на 3 ч' }],
    [],
    [{ x: 1430, y: 700, lx: 1430, ly: 560, side: 'l', k: 'Силы и средства', v: 'АЦ 6,0-40 · 2 ствола' }],
  ];
  const TAIL = 24;

  // 0 · внутренний водопровод: выноски к шкафам ПК и стоякам, стрелки потока, срабатывание оросителей
  const FLOW = [[1, .3], [2, .55], [3, .5], [6, .62], [8, .35], [9, .5]];
  const HEADS = [[287.8, 346], [407.9, 308.6], [537.4, 270.8], [609.9, 250.2], [707.1, 221.7], [904.9, 302.3]];
  const L0 = TAGS0.map(([x, y, lx, ly], i) => `<g class="tg" style="--i:${i}"><path d="M${x},${y}L${lx},${ly}" pathLength="1"/><circle cx="${x}" cy="${y}" r="5"/></g>`).join('') +
    FLOW.map((f, i) => `<path class="fl-ar" style="--i:${i}" d="M-10,-7L4,0L-10,7"/>`).join('') +
    HEADS.map(([x, y], i) => `<circle class="ping" style="--i:${i}" cx="${x}" cy="${y + 8}" r="9"/>`).join('');

  // 1 · расход воды: уровень в резервуаре поднимается, вертикальный размер, выноска с объёмом
  const L1 = `<g clip-path="url(#hx-tank)"><g class="lvl"><rect x="955" y="0" width="170" height="240" class="lvl-fill"/>
      <path d="M964,0A76,19 0 0,1 1116,0" class="lvl-back"/><path d="M964,0A76,19 0 0,0 1116,0" class="lvl-front"/></g></g>
    <g class="dim"><path d="M1121,603H1152M1121,792H1152" class="dim-ext" pathLength="1"/><path d="M1142,603V792" class="dim-ln" pathLength="1"/>
      <path d="M1136,609L1148,597M1136,798L1148,786" class="dim-tk"/></g>`;

  // 2 · план тушения: очаг в нижнем офисе, ороситель над ним, рукавная линия от АЦ ко входу, маячок
  let drops = '';
  for (let i = 0; i < 14; i++) drops += `<path d="M560,568l0,9" class="drop" style="--dx:${(((i * 37) % 17 - 8) * 4.2).toFixed(1)}px;--dl:${((i * .61) % 1.1).toFixed(2)}s"/>`;
  const HOSE = 'M1168,912C1090,936 992,906 925,868S846,816 822,806';
  const L2 = `<g class="fire" transform="translate(585 690)"><circle r="92" class="fire-glow"/><circle r="6" class="fire-dot"/><circle r="6" class="fire-ring"/></g>
    <g class="spray">${drops}<circle cx="560" cy="562" r="7" class="ping ping--on"/></g>
    <g clip-path="url(#hx-ground)"><path d="${HOSE}" class="hose" pathLength="1"/><path d="${HOSE}" class="hose-run"/></g>
    <circle cx="1168" cy="912" r="6" class="hdot"/><circle cx="822" cy="806" r="6" class="hdot" style="--d:1.3s"/>
    <g class="beacon" transform="translate(1244 758)"><ellipse rx="46" ry="22"/></g>`;

  // 3 · проезды: полоса 4,2 м вдоль АЦ (уходит под машину), размер ширины перед машиной, выноска
  const A = [.94, -.343], B = [.963, .27], HW = 86;
  const at = (c, a, b) => [c[0] + A[0] * a + B[0] * b, c[1] + A[1] * a + B[1] * b];
  const C0 = [1200, 953];
  const nS = at(C0, -10, HW), nE = at(C0, 370, HW), fE = at(C0, 370, -HW), fS = at(C0, -10, -HW);
  const lab = at(C0, -27, 0);
  const tk = p => `M${pt([p[0] - 6, p[1] + 6])}L${pt([p[0] + 6, p[1] - 6])}`;
  const L3 = `<g clip-path="url(#hx-ground)"><path d="${poly([nS, nE, fE, fS])}" class="lane"/>
      <path d="M${pt(nS)}L${pt(nE)}M${pt(fS)}L${pt(fE)}" class="lane-edge"/></g>
    <g class="dim"><path d="M${pt(fS)}L${pt(nS)}" class="dim-ln" pathLength="1"/><path d="${tk(fS)}${tk(nS)}" class="dim-tk"/></g>
    <g class="beacon" transform="translate(1244 758)"><ellipse rx="46" ry="22"/></g>`;

  // ── сборка слоя ──
  const call = c => `<g class="call"><circle class="call-halo" cx="${c.x}" cy="${c.y}" r="34"/>
    <path class="call-ln" d="M${c.x},${c.y}L${c.lx},${c.ly}L${c.lx + (c.side === 'r' ? TAIL : -TAIL)},${c.ly}" pathLength="1"/><circle class="call-dot" cx="${c.x}" cy="${c.y}" r="6.5"/></g>`;
  art.insertAdjacentHTML('beforeend', `<svg class="art-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true"><defs>
      <clipPath id="hx-ground"><path clip-rule="evenodd" d="M0,0H${W}V${H}H0Z${poly(TRUCK)}${poly(TANK)}"/></clipPath>
      <clipPath id="hx-tank"><path d="${poly(TANK)}"/></clipPath>
      <radialGradient id="hx-cp"><stop offset="0" stop-color="#f5312a" stop-opacity=".42"/><stop offset="1" stop-color="#f5312a" stop-opacity="0"/></radialGradient>
      <radialGradient id="hx-fire"><stop offset="0" stop-color="#ff7a2e" stop-opacity=".9"/><stop offset=".35" stop-color="#f5312a" stop-opacity=".42"/><stop offset="1" stop-color="#f5312a" stop-opacity="0"/></radialGradient>
      <radialGradient id="hx-blue"><stop offset="0" stop-color="#4f8cff" stop-opacity=".85"/><stop offset=".5" stop-color="#4f8cff" stop-opacity=".25"/><stop offset="1" stop-color="#4f8cff" stop-opacity="0"/></radialGradient></defs>
    <g class="sig-g">${NET.map(([d, , thin]) => `<g class="sig${thin ? ' sig--thin' : ''}"><path d="${d}" class="sig-h"/><path d="${d}" class="sig-c"/></g>`).join('')}</g>
    ${[L0, L1, L2, L3].map((l, i) => `<g class="ly" data-s="${i}">${l}${CALL[i].map(call).join('')}</g>`).join('')}
  </svg>`);

  const tagsH = TAGS0.map(([, , lx, ly, t, a], i) => `<span class="tg-t tg-t--${a}" data-s="0" style="${pct(lx, ly)};--i:${i}">${t}</span>`).join('') +
    `<span class="tg-t tg-t--pipe" data-s="0" style="${pct(1156, 362)};--i:4">Ø 100</span>` +
    `<span class="tg-t tg-t--dim" data-s="1" style="${pct(1160, 697)};--i:1">6,0 м</span>` +
    `<span class="tg-t tg-t--fire" data-s="2" style="${pct(585, 744)};--i:0">${sv(FLAME)}Очаг пожара</span>` +
    `<span class="tg-t tg-t--c" data-s="2" style="${pct(1004, 948)};--i:2">Рукавная линия · 40 м</span>` +
    `<span class="tg-t tg-t--lane" data-s="3" style="${pct(lab[0], lab[1])};--i:1">4,2 м</span>` +
    CALL.map((list, s) => list.map((c, i) => `<span class="call-t call-t--${c.side}" data-s="${s}" style="${pct(c.lx + (c.side === 'r' ? TAIL : -TAIL), c.ly)};--i:${i}"><small>${c.k}</small><b>${c.v}</b></span>`).join('')).join('');
  art.insertAdjacentHTML('beforeend', `<div class="art-tags" aria-hidden="true">${tagsH}</div>`);

  const svg = art.querySelector('.art-svg');
  // подпись диаметра идёт вдоль трубы перехода, подпись ширины — вдоль размерной линии
  art.querySelector('.tg-t--pipe').style.setProperty('--r', (Math.atan2(341.6 - 405.6, 1262.8 - 1051.4) * 180 / Math.PI).toFixed(2) + 'deg');
  art.querySelector('.tg-t--lane').style.setProperty('--r', (Math.atan2(B[1], B[0]) * 180 / Math.PI).toFixed(2) + 'deg');

  // сигнал на ветке продолжает сигнал родителя: смещение штриха = путь воды от резервуара
  const sig = [...svg.querySelectorAll('.sig')], off = [];
  NET.forEach(([, parent], i) => {
    if (parent < 0) { off[i] = 0; } else {
      const pe = sig[parent].lastElementChild, a = sig[i].lastElementChild.getPointAtLength(0), L = pe.getTotalLength();
      let best = 0, bd = Infinity;
      for (let s = 0; s <= L; s += 3) { const p = pe.getPointAtLength(s), d = Math.hypot(p.x - a.x, p.y - a.y); if (d < bd) { bd = d; best = s; } }
      off[i] = off[parent] + best + bd;
    }
    sig[i].style.setProperty('--o', off[i].toFixed(1) + 'px');
  });
  // стрелки потока — по касательной к трубе
  svg.querySelectorAll('.fl-ar').forEach((el, k) => {
    const [i, f] = FLOW[k], p = sig[i].lastElementChild, L = p.getTotalLength();
    const a = p.getPointAtLength(L * f), b = p.getPointAtLength(Math.min(L, L * f + 4));
    el.setAttribute('transform', `translate(${a.x.toFixed(1)} ${a.y.toFixed(1)}) rotate(${(Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI).toFixed(1)})`);
  });

  // толщина линий — в пикселях экрана, а не исходника
  const fit = () => svg.style.setProperty('--u', (W / art.clientWidth).toFixed(4) + 'px');
  addEventListener('resize', fit); fit();

  // ── плашка ──
  // по макету: заголовок и четыре пункта, у выбранного — красный квадрат и линия-таймер
  plate.innerHTML = `<div class="pl-hd">Схема объекта</div>
    <ol class="pl-list">${S.map((s, i) => `<li><button type="button" class="pl-i" data-i="${i}" aria-pressed="false">
      <i class="pl-sq"></i><b>${s.t}</b><i class="pl-bar"></i></button></li>`).join('')}</ol>`;


  const root = document.querySelector('.hero'), items = [...plate.querySelectorAll('.pl-i')];
  const layers = [...svg.querySelectorAll('.ly')], tags = [...art.querySelectorAll('.art-tags [data-s]')];
  let cur = -1;
  function show(i) {
    if (i === cur) return;
    cur = i;
    items.forEach((b, k) => { b.classList.toggle('is-on', k === i); b.setAttribute('aria-pressed', k === i); });
    layers.forEach((l, k) => l.classList.toggle('is-on', k === i));
    tags.forEach(t => t.classList.toggle('is-on', +t.dataset.s === i));
    root.style.setProperty('--sec', i);
  }
  // время показа раздела задаёт полоса в плашке: закончилась — следующий раздел
  plate.addEventListener('animationend', e => { if (e.target.classList.contains('pl-bar') && !reduce) show((cur + 1) % S.length); });
  plate.addEventListener('click', e => { const b = e.target.closest('.pl-i'); if (b) show(+b.dataset.i); });

  // вне экрана сцена стоит
  new IntersectionObserver(([e]) => root.classList.toggle('is-off', !e.isIntersecting)).observe(root);

  const img = art.querySelector('.art-photo');
  const start = () => { root.classList.add('is-ready'); setTimeout(() => show(0), reduce ? 0 : 900); };
  img.complete ? start() : (img.addEventListener('load', start, { once: true }), img.addEventListener('error', start, { once: true }));
})();
