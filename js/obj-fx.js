// Блок «Объекты»: сцены поверх иллюстраций карточек — проигрываются при наведении, у каждого объекта своя.
// Язык — как у «Услуг»: красные линии-«чертёж», огни, сигналы. Без подписей — только графика.
// Координаты — пиксели картинки из макета 404×323 (Figma, «Карточка объекта» → Group 12…19), снятые по экспорту 2x.
(function () {
  const W = 404, H = 323.2;
  // плавная кривая через точки (Catmull-Rom → кубические Безье)
  const spline = (p, closed) => {
    const n = p.length, at = i => closed ? p[(i + n) % n] : p[Math.max(0, Math.min(n - 1, i))];
    let d = `M${p[0].join(',')}`;
    for (let i = 0; i < (closed ? n : n - 1); i++) {
      const [a, b, c, e] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
      d += `C${(b[0] + (c[0] - a[0]) / 6).toFixed(1)},${(b[1] + (c[1] - a[1]) / 6).toFixed(1)} ${(c[0] - (e[0] - b[0]) / 6).toFixed(1)},${(c[1] - (e[1] - b[1]) / 6).toFixed(1)} ${c.join(',')}`;
    }
    return d + (closed ? 'Z' : '');
  };
  // сигнал: яркая голова и тающий хвост (три штриха с общим концом); длина пути нормирована в 100
  const sig = (d, o = 0, T = 1.6, on = .2) => `<g class="ox-sg" style="--o:${o}s;--T:${T}s;--on:${on}s">${[[26, 't'], [13, 'm'], [4, 'h']].map(([L, k]) => `<path d="${d}" pathLength="100" class="ox-sg-${k}" style="--L:${L}"/>`).join('')}</g>`;

  // 01 · логистика: у каждого дока загорается сигнальный огонь — волной вдоль фасада
  const DOCKS = [[151.5, 228.8], [194.3, 219.3], [239.5, 202.5], [277, 192.5], [314.3, 184.3], [346.5, 175.5], [378.3, 168]];
  const logistic = DOCKS.map(([x, y], i) => `<g class="l-lamp" style="--i:${i}"><ellipse cx="${x}" cy="${y}" rx="6" ry="8" class="l-glow"/><rect x="${x - 1.2}" y="${y - 2.6}" width="2.4" height="5.2" rx="1.2" class="l-core"/></g>`).join('');

  // 02 · производство: пролёты-отсеки по очереди обводятся — фронтон, затем конёк
  const SPANS = [
    [[41.7, 126.7], [70.8, 104.2], [85, 132.5], [264, 70.7]],
    [[87.5, 134.2], [118.3, 112.5], [135, 143.3], [310.7, 75.4]],
    [[138.3, 144.2], [171.9, 122.5], [188.8, 152.5], [360.7, 81.7]],
  ];
  const production = SPANS.map(([l, a, r, e], i) => `<g style="--i:${i}">
      <path d="M${l}L${a}L${r}Z" class="p-tri"/>
      <path d="M${l}L${a}L${r}" class="ox-ln" pathLength="1" style="--d:${(.1 + i * .4).toFixed(2)}s"/>
      <path d="M${a}L${e}" class="ox-ln ox-ln--t" pathLength="1" style="--d:${(.45 + i * .4).toFixed(2)}s"/></g>`).join('');

  // 03 · административное: путь эвакуации — из дверей по крыльцу и дорожке наружу
  const EXIT = 'M275,234L291,240.5L334,257.7';
  const admin = `<path d="${EXIT}" class="a-way" pathLength="1"/><path d="${EXIT}" class="a-run"/>
    <path d="M330.5,252.6L337,258.9L328.2,261.5" class="a-ar" pathLength="1"/>
    <circle cx="275" cy="234" r="3.6" class="fx-dot" style="--d:.1s"/>`;

  // 04 · жилое: высотная отметка — размерная линия поднимается от земли до парапета, на ней засечки этажей
  const LV = [241, 205, 167.5, 131, 90.5], X = 17;
  const living = `<path d="M30,${LV[0]}H11M30,${LV[4]}H11" class="v-ext" pathLength="1"/>
    <path d="M${X},${LV[0]}V${LV[4]}" class="v-dim" pathLength="1"/>
    ${LV.slice(1, 4).map((y, i) => `<path d="M${X - 3.5},${y}H${X + 3.5}" class="v-tk" style="--d:${(.25 + (LV[0] - y) / (LV[0] - LV[4]) * 1.1).toFixed(2)}s"/>`).join('')}
    <path d="M${X - 3.5},${LV[0] + 3.5}l7,-7M${X - 3.5},${LV[4] + 3.5}l7,-7" class="v-sl"/>`;

  // 05 · торговое: у входа на тротуаре расходятся круги — точка выхода
  const trade = `<g transform="rotate(-18 292 212.5)">${[0, 1, 2].map(i => `<ellipse cx="292" cy="212.5" rx="24" ry="7.5" class="t-ring" style="--i:${i}"/>`).join('')}</g>
    <circle cx="292" cy="212" r="3.4" class="fx-dot" style="--d:.1s"/>`;

  // 06 · нефтегаз: по красным трубам бегут сигналы
  const PIPE = 'M131.5,116.5Q133.5,112.6 135.6,116.5L135.6,177Q135.8,179.8 139,179.2L158,175.5';
  const RACK = 'M262,183.3L330,166.2';
  const oil = sig(PIPE, 0, 1.7) + sig(RACK, -.8, 1.5);

  // 07 · социальное: маршрут для маломобильных — вверх по пандусу, через площадку к дверям
  const RAMP = 'M184,242L221,232.6Q238,228.4 246,221.5L253.5,214.5';
  const social = `<path d="${RAMP}" class="ox-ln s-way" pathLength="1"/>
    <ellipse cx="254" cy="215" rx="13" ry="5" class="fx-ring" style="--d:1.2s"/><circle cx="254" cy="214.5" r="3.6" class="fx-dot" style="--d:1.1s"/>`;

  // 08 · другие: кровля ангара обводится по силуэту — передняя арка, карниз, задняя арка; по контуру идёт сигнал
  const ARCH = [[103.6, 109.3], [125, 104.6], [150, 103.2], [175, 105.5], [200, 111.3], [225, 120], [250, 135.8], [266.7, 145]];
  const BACK = [[371.6, 110.5], [323.6, 82.9], [295, 74.6], [260.7, 72], [217.9, 78], [180.7, 88.6], [149.3, 96.6], [123.6, 103.6], [103.6, 109.3]];
  const ROOF = spline(ARCH) + `L${BACK[0]}` + spline(BACK).replace(/^M[^C]+/, '') + 'Z';
  const other = `<path d="${ROOF}" class="ox-ln o-roof" pathLength="1"/>` + sig(ROOF, 0, 3.2, 1.3);

  window.OG_OBJ = { logistic, production, admin, living, trade, oil, social, other, W, H };
})();
