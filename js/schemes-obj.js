// Схемы объектов для страницы проекта: язык и знаки — из schemes.js, две половины панели — два листа из комплекта.
// С листа берём только работу: технику, рукава, зоны, значения. Здание здесь всегда условное: ровный блок, выдуманная мозаика,
// выдуманный маршрут. Адрес, улицы, название заказчика, номера частей и корпусов, оси, абсолютные отметки, марки машин — не переносим.
(function () {
  const { W, H, SPLIT, list, kit } = window.OG_SCH;
  const { at, tx, halo, G, fade, pop, ln, sig, len, wrap, arrive, out, hydrant, STEP, LOOP } = kit;

  // ── знаки объектов ──
  const pt = (x, y, R, a) => [+(x + R * Math.cos(a * Math.PI / 180)).toFixed(1), +(y - R * Math.sin(a * Math.PI / 180)).toFixed(1)];
  // сектор рабочей зоны: углы против часовой стрелки от оси x
  const fan = (x, y, R, a0, a1) => { const [x0, y0] = pt(x, y, R, a0), [x1, y1] = pt(x, y, R, a1); return `M${x} ${y}L${x0} ${y0}A${R} ${R} 0 ${a1 - a0 > 180 ? 1 : 0} 0 ${x1} ${y1}Z`; };
  const arc = (x, y, R, a0, a1) => { const [x0, y0] = pt(x, y, R, a0), [x1, y1] = pt(x, y, R, a1); return `M${x0} ${y0}A${R} ${R} 0 ${a1 - a0 > 180 ? 1 : 0} 0 ${x1} ${y1}`; };
  const tick = (x, y, h = 6) => `M${x} ${y - h}v${h * 2}`;
  // риска на линии и подпись отметки; s — в какую сторону от опорной точки
  const mark = (x, y, t, s = 1, w = 58) => `<path d="M${x} ${y}h${s * w}M${x + s * 7} ${y}l-3.6-6.5h7.2z" class="sx-mk"/>` + tx(x + s * 16, y - 5, t, 'sx-t', s < 0 ? 'text-anchor="end"' : '');
  // на тёмной половине цвета знаков другие: всё в обёртке .sx-w
  const dark = s => `<g class="sx-w">${s}</g>`;
  // кольцо срабатывания
  const ring = (x, y, a, r = 26, cls = '') => `<circle cx="${x}" cy="${y}" r="${r}" class="sx-ring ${cls}" style="--a:${a}s"/>`;

  Object.assign(G, {
    // автолестница сбоку: опора стрелы над точкой (0, 0), d — куда смотрит кабина
    al: (d = 1) => `<g transform="scale(${d} 1)"><path d="M-30 0H-20M-25 0V-12M-24-12H52M-24-12V-19H28V-12M30-12V-31H44L54-21V-12M-8-19V-25H8V-19"/><circle cx="-14" cy="-6" r="6"/><circle cx="2" cy="-6" r="6"/><circle cx="41" cy="-6" r="6"/></g>`,
    // пенный ствол: как ствол, но на конце два насадка с крестом
    fm: L => `<path d="M0 0H${L - 34}M9-5V5"/><path d="M${L - 44}-7L${L - 22} 0 ${L - 44} 7Z" class="sx-f"/><circle cx="${L - 17}" r="5"/><circle cx="${L - 6}" r="5"/><path d="M${L - 20.5}-3.5l7 7m0-7l-7 7M${L - 9.5}-3.5l7 7m0-7l-7 7"/>`,
    // узел на линии: кружок на подставке с крестом
    tw: () => '<path d="M-5 7L-12 34H12L5 7"/><circle r="7"/><circle cy="22" r="6"/><path d="M-4.2 17.8l8.4 8.4m0-8.4l-8.4 8.4"/>',
    // водоисточник с крестом
    xc: () => '<circle r="19"/><path d="M-16-16l32 32m0-32l-32 32"/>',
  });

  // стрела на шарнире: от угла ra поднимается к rb и ходит на d градусов внутри рабочей зоны
  const boom = (x, y, L, ra, rb, t, d = 0, T = 7) => at(x, y, `<g class="sx-rise" style="--r0:${ra}deg;--r1:${rb}deg;--a:${t}s"><g${d ? ` class="sx-swp" style="--d:${d}deg;--t:${T}s;--a:${t + 1.2}s"` : ''}><path d="M0-3H${L}M0 3H${L}" class="sx-lr"/><path d="M5 0H${L}" class="sx-lrr"/><path d="M${L}-7h10v14h-10z" class="sx-cg"/></g></g>`);
  // ручная лестница: две тетивы с перекладинами, снизу вверх
  const stair = (x0, y0, x1, y1, a) => `<path d="M${x0} ${y0}L${x1} ${y1}" pathLength="1" class="sx-dw sx-sl" style="--a:${a}s;--z:.7s"/><path d="M${x0} ${y0}L${x1} ${y1}" class="sx-sr sx-fade" style="--a:${a + .45}s"/><path d="M${x0} ${y0}L${x1} ${y1}" class="sx-sg2 sx-fade" style="--a:${a + .5}s"/>`;

  // иконки карточек
  Object.assign(window.OG_SCH.ICON, {
    al: `<svg viewBox="-34 -48 92 50" class="sx-al">${G.al()}<path d="M0-25L46-46M3-22L49-43" class="sx-ic-l"/></svg>`,
    zn: `<svg viewBox="-23 -23 46 46" class="sx-ic-z"><circle r="21" fill="url(#sx-hb)"/><circle r="8"/></svg>`,
    rz: `<svg viewBox="-23 -23 46 46" class="sx-ic-z sx-ic-z--m"><circle r="21"/><circle r="8"/></svg>`,
    ld: `<svg viewBox="-9 -22 18 44" class="sx-ic-s"><path d="M-6-21V21M6-21V21M-6-15H6M-6-7H6M-6 1H6M-6 9H6M-6 17H6"/></svg>`,
    lv: `<svg viewBox="-2 -22 60 44" class="sx-ic-h"><path d="M0 18H58M0-6H58M14 18l-5-9h10zM14-6l-5-9h10z"/></svg>`,
    pl: `<svg viewBox="0 0 66 34" class="sx-ic-p"><rect x="1" y="1" width="64" height="32" fill="url(#sx-st)"/></svg>`,
    dm: `<svg viewBox="0 -10 70 20" class="sx-ic-h"><path d="M1-9V9M69-9V9M1 0H69M1 0l9-4v8zM69 0l-9-4v8z"/></svg>`,
    rt: `<svg viewBox="0 0 74 38" class="sx-ic-h"><path d="M1 34H26A16 16 0 0 0 42 18A16 16 0 0 1 58 2H73"/></svg>`,
    rv: `<svg viewBox="0 -14 74 28" class="sx-ic-h"><path d="M73 0H10M10 0l10-7M10 0l10 7" stroke-dasharray="7 5"/></svg>`,
    fo: `<svg viewBox="-6 -14 96 28" class="sx-st sx-fm"><path d="M-6 0H0"/>${G.fm(90)}</svg>`,
    sn: `<svg viewBox="-7 -14 88 28" class="sx-st"><path d="M-7 0H0"/>${G.st(81)}</svg>`,
    bu: `<svg viewBox="0 -21 62 42" class="sx-ic-h"><path d="M0 0H30M30-14V14M30-14H62M30 14H62M46-18v8M46 10v8"/></svg>`,
    tk: `<svg viewBox="-23 -23 46 46" class="sx-ic-h"><rect x="-22" y="-22" width="44" height="44" rx="4"/><rect x="-15" y="-15" width="30" height="30" rx="8"/></svg>`,
    fr: `<svg viewBox="-23 -23 46 46" class="sx-ic-f"><circle r="16"/><path d="M0-17V-22M17 0H22M0 17V22M-17 0H-22M12-12l4-4M12 12l4 4M-12 12l-4 4M-12-12l-4-4"/></svg>`,
    fa: `<svg viewBox="0 0 66 44" class="sx-ic-h"><path d="M1 43V7H65V43M1 19H65M1 31H65"/></svg>`,
  });

  // ── Мост: цепочка автоцистерн по проезду, рукава заходят внутрь и расходятся к стволам ──
  list.most = () => {
    const RT = 170, RB = 610, A1 = 520, A2 = 300, A3 = 450, CX = 800;
    const hose1 = `${out(132, A1 - 20, A2)}H470`;
    const hose2 = `M483 ${A2 + 20}C483 ${A2 + 46} 510 ${A2 + 50} 540 ${A2 + 38}C600 ${A2 + 12} 626 214 700 214H${CX}`;
    const hose3 = `${out(613, A3 + 20, 540)}H${CX}`;
    // внутри объекта: две линии над помещением к РСКУ-50А, одна под ним к пенному стволу
    const R = { x: 1060, y: 260, w: 230, h: 260 };
    const e2 = `H1345V430`, e3 = `H1320V330`, e1 = `H1140`;
    const r2 = `${hose2}V202H1345V440`, r3 = `${hose2}V226H1320V340`, r1 = `${hose3}H1150`;
    const art = `
      <rect y="${RT}" width="${SPLIT}" height="${RB - RT}" class="sx-road"/>
      ${fade(.1, tx(36, RB - 16, 'Проезд', 'sx-t sx-t--g'))}
      <g data-l="wa ho">${hydrant(62, A1, -1, 'ПГ', 'К-225', .1)}</g>
      <g data-l="ac">
        ${[[87, A1, 'АЦ-1'], [470, A2, 'АЦ-2'], [600, A3, 'АЦ-3']].map(([x, y, n], i) => pop(x, y, 'ac', .25 + i * .1) + fade(.3 + i * .1, tx(x + 27, y - 26, n, 'sx-t sx-c'))).join('')}
        ${fade(.7, tx(87, A1 + 36, 'Нн 89 м вод. ст.', 'sx-t') + tx(462, A2 - 8, 'Нн 77 м вод. ст.', 'sx-t', 'text-anchor="end"') + tx(592, A3 + 4, 'Нн 79 м вод. ст.', 'sx-t', 'text-anchor="end"'))}
        ${pop(200, 396, 'ac', .6)}
        ${fade(.7, tx(227, 370, 'Резерв', 'sx-t sx-c') + tx(278, 402, '3', 'sx-res'))}
      </g>
      <g data-l="zone">
        ${pop(250, 500, 'kp', .5)}${pop(322, 500, 'sh', .55)}${pop(372, 500, 'vh', .6, 'Ш')}
      </g>
      <g data-l="ho">
        ${ln(hose1, 'sx-h', .6, .5)}${ln(hose2, 'sx-h', .9, .6)}${ln(hose3, 'sx-h', .95, .5)}
        <path d="${tick(200, A2)}${tick(420, A2)}${tick(750, 214)}${tick(750, 540)}" class="sx-h sx-pop" style="--a:1.1s"/>
        ${fade(1, tx(146, A2 - 8, 'DN 80 · n 18 · Q 16 л/с', 'sx-t') + tx(628, 206, 'DN 80 · n 2 · Q 16 л/с', 'sx-t') + tx(662, 532, 'DN 80 · n 1 · Q 5 л/с', 'sx-t'))}
      </g>
      <g data-l="bu ho">
        ${ln(`M${CX} 202V226`, 'sx-h', 1.3, .1)}${ln(`M${CX} 202H${SPLIT}`, 'sx-h', 1.35, .2)}${ln(`M${CX} 226H${SPLIT}`, 'sx-h', 1.35, .2)}${ln(`M${CX} 540H${SPLIT}`, 'sx-h', 1.35, .2)}
        <path d="${tick(868, 202)}${tick(868, 226)}${tick(868, 540)}" class="sx-h sx-pop" style="--a:1.5s"/>
      </g>
      <g data-l="bu">
        ${fade(1.4, tx(CX + 8, 190, 'БУ-2', 'sx-t sx-t--r') + tx(CX + 8, 528, 'БУ-1', 'sx-t sx-t--r'))}
        ${pop(770, 270, 'pb', 1.4, '2')}${pop(770, 490, 'pb', 1.45, '')}
      </g>
      ${dark(`
        <g data-l="zone">
          <rect x="${R.x}" y="${R.y}" width="${R.w}" height="${R.h}" fill="url(#sx-hatch)"/>
          <path d="M${R.x} ${R.y}H${R.x + R.w}V${R.y + R.h}H${R.x}Z" class="sx-wall"/>
          ${fade(1.8, tx(R.x + 16, R.y + 26, 'Хранение масла', 'sx-t sx-t--r'))}
          ${pop(R.x + 60, 430, 'fl', 1.9)}
        </g>
        <g data-l="bu ho">
          ${ln(`M${SPLIT} 202${e2}`, 'sx-h', 1.55, .6)}${ln(`M${SPLIT} 226${e3}`, 'sx-h', 1.55, .6)}${ln(`M${SPLIT} 540${e1}`, 'sx-h', 1.55, .35)}
        </g>
        <g data-l="st">
          ${pop(1345, 440, 'rs', 2.1)}${pop(1320, 340, 'rs', 2.15)}${pop(1150, 540, 'rs', 1.95)}
          <g transform="translate(1335 440) scale(-1 1)"><g class="sx-st sx-pop" style="--a:2.2s">${G.st(82)}</g></g>
          <g transform="translate(1310 340) scale(-1 1)"><g class="sx-st sx-pop" style="--a:2.25s">${G.st(82)}</g></g>
          <g transform="translate(1150 530) rotate(-90)"><g class="sx-fm sx-st sx-pop" style="--a:2.05s">${G.fm(82)}</g></g>
          ${fade(2.35, tx(1272, 430, 'РСКУ-50А', 'sx-t sx-c') + tx(1272, 457, '8', 'sx-t sx-c') + tx(1248, 330, 'РСКУ-50А', 'sx-t sx-c') + tx(1248, 357, '8', 'sx-t sx-c') + tx(1136, 492, 'Пурга-5', 'sx-t', 'text-anchor="end"') + tx(1164, 492, '5', 'sx-t'))}
        </g>
        <g data-l="zone">${at(1224, 636, `<g transform="rotate(-90) scale(.8)"><g class="sx-arw sx-pop" style="--a:2.4s">${G.arw()}</g></g>`)}</g>
      `)}`;
    const a3 = arrive(`${r3}H1240`), a2 = arrive(`${r2}H1265`), a1 = arrive(r1 + 'V470');
    const run = `
      <g class="sx-sg sx-sg--r" data-l="ho">${sig(hose1)}${sig(r2 + 'H1265')}${sig(r3 + 'H1240')}${sig(r1 + 'V470')}</g>
      <g class="sx-sg" data-l="st">${ring(1232, 440, a2, 24)}${ring(1208, 340, a3, 24)}${ring(1150, 452, a1, 24)}</g>`;
    return {
      note: 'Показали расстановку и&nbsp;развёртывание без привязки к&nbsp;месту: технику, рукавные линии, напоры и&nbsp;подачу на&nbsp;стволы. Адрес, номера подразделений и&nbsp;расположение объекта закрыли.',
      sheets: [
        { t: 'Расстановка сил и&nbsp;средств', s: 'Помещение хранения масла, момент локализации', l: 'Лист 59' },
        { t: 'Схема развёртывания', s: 'Рукавные линии к&nbsp;стволам', l: 'Лист 60' },
      ],
      veil: { seed: 11, w: SPLIT, h: H, cut: [[0, RT, SPLIT, RB - RT]] },
      art, run,
      keys: [
        { k: 'wa', i: 'wa', b: '1', t: 'пожарный гидрант на&nbsp;сети К-225' },
        { k: 'ac', i: 'ac', b: '3 + 3', t: 'автоцистерны в&nbsp;работе и&nbsp;в&nbsp;резерве' },
        { k: 'ho', i: 'ho', b: '21', t: 'рукав DN&nbsp;80 в&nbsp;трёх линиях подачи' },
        { k: 'st', i: 'sn', b: '21', u: 'л/с', t: 'на&nbsp;стволы: два РСКУ-50А и&nbsp;Пурга-5' },
        { k: 'bu', i: 'bu', b: '2', t: 'боевых участка с&nbsp;постами безопасности' },
      ],
    };
  };

  // ── Склад ГСМ: типовая группа резервуаров, тушение пеной и стадии развития пожара ──
  list.gsm = () => {
    const TX = 390, TY = 268, TS = 150, TG = 8, TV = 58;                         // резервуары 2×2
    const FX = TX + 72, FY = TY + 76, FR = 66;                                   // очаг
    const tank = (x, y) => `<rect x="${x}" y="${y}" width="${TS}" height="${TS}" rx="5" class="sx-tk"/><rect x="${x + 11}" y="${y + 11}" width="${TS - 22}" height="${TS - 22}" rx="16" class="sx-tk sx-tk--i"/><circle cx="${x + TS / 2}" cy="${y + TS / 2}" r="2.4" class="sx-f"/>`;
    const tanks = [[TX, TY], [TX + TS + TG, TY], [TX, TY + TS + TV], [TX + TS + TG, TY + TS + TV]];
    const P1 = TX + TS / 2, P2 = TX + TS + TG + TS / 2, MY = TY + TS + TV / 2;
    // зона вокруг очага: пунктир с зубцами
    const teeth = () => { const r = 190, n = 30; let d = ''; for (let i = 0; i < n; i++) { const a = i / n * 360, [x0, y0] = pt(FX, FY, r, a), [x1, y1] = pt(FX, FY, r, a + 7), [x2, y2] = pt(FX, FY, r - 10, a + 9), [x3, y3] = pt(FX, FY, r, a + 11); d += i % 3 === 0 ? `M${x0} ${y0}L${x1} ${y1}L${x2} ${y2}L${x3} ${y3}` : `M${x0} ${y0}L${x1} ${y1}`; } return d; };
    const rays = Array.from({ length: 10 }, (_, i) => { const a = i * 36 + 18, [x0, y0] = pt(FX, FY, FR + 3, a), [x1, y1] = pt(FX, FY, FR + 22, a), [x2, y2] = pt(FX, FY, FR + 15, a + 3.4), [x3, y3] = pt(FX, FY, FR + 15, a - 3.4); return `M${x0} ${y0}L${x1} ${y1}M${x2} ${y2}L${x1} ${y1}L${x3} ${y3}`; }).join('');
    const hoseA = 'M786 566C752 646 640 682 430 682C240 682 104 566 88 380C82 300 108 240 150 236C178 234 206 248 232 262';
    const hoseB = 'M822 576C780 636 640 656 440 656C290 656 146 546 118 390C112 320 130 268 156 262C178 258 206 262 232 268';
    // пять стадий на тёмной половине: план в изометрии
    const SC = 58, isoP = (ox, oy) => (x, y) => [+(ox + (x - y) * .64).toFixed(1), +(oy + (x + y) * .32).toFixed(1)];
    const poly = (f, q) => 'M' + q.map(([x, y]) => f(x, y).join(' ')).join('L') + 'Z';
    const disc = (f, cx, cy, r) => 'M' + Array.from({ length: 28 }, (_, i) => { const a = i / 28 * Math.PI * 2; return f(cx + r * Math.cos(a), cy + r * Math.sin(a)).join(' '); }).join('L') + 'Z';
    const cell = (i, j) => [[i * SC + 5, j * SC + 5], [(i + 1) * SC - 5, j * SC + 5], [(i + 1) * SC - 5, (j + 1) * SC - 5], [i * SC + 5, (j + 1) * SC - 5]];
    const FIRE = [
      f => disc(f, 44, 44, 7),
      f => disc(f, 32, 30, 8) + disc(f, 42, 46, 12) + disc(f, 22, 44, 7),
      f => poly(f, cell(0, 0)),
      f => poly(f, cell(0, 0)) + disc(f, 72, 30, 13) + disc(f, 30, 72, 13),
      f => [0, 1].map(i => [0, 1].map(j => poly(f, cell(i, j))).join('')).join(''),
    ];
    const TXT = [
      ['Отдельный очаг возгорания', 'на поверхности резервуара'], ['Растекание', 'горящей жидкости'], ['Загорание резервуара', 'по всей площади'],
      ['Распространение горения', 'на соседние резервуары'], ['Охват группы, возможен выход', 'топлива за её пределы'],
    ];
    const SY = [150, 258, 366, 474, 582], OX = 1052;
    const stage = (i) => { const f = isoP(OX, SY[i] - 2), m = SC * 2;
      return `<g data-l="fr">
        <path d="${poly(f, [[0, 0], [m, 0], [m, m], [0, m]])}" class="sx-iso"/>
        ${[0, 1].map(a => [0, 1].map(b => `<path d="${poly(f, cell(a, b))}" class="sx-iso sx-iso--t"/>`).join('')).join('')}
        <path d="${FIRE[i](f)}" class="sx-burn sx-stg" style="--d:${i * 1.6}s"/>
        ${i === 4 ? `<path d="${poly(f, [[-12, -12], [m + 12, -12], [m + 12, m + 12], [-12, m + 12]])}" class="sx-iso sx-iso--o"/>` : ''}
        <g class="sx-fade" style="--a:${1 + i * .15}s">
          ${tx(1154, SY[i] + 30, i + 1, 'sx-t sx-t--r sx-num')}
          ${tx(1176, SY[i] + 24, TXT[i][0], 'sx-t')}${tx(1176, SY[i] + 41, TXT[i][1], 'sx-t')}
          ${i < 2 ? tx(1176, SY[i] + 7, 'Сценарий № ' + (i + 1), 'sx-t sx-t--g') : ''}
        </g>
      </g>`; };
    const art = `
      <g data-l="tk">
        ${tanks.map(([x, y]) => tank(x, y)).join('')}
        <path d="M${P1 - 3} ${TY + TS - 30}V${TY + TS + TV + 30}M${P1 + 3} ${TY + TS - 30}V${TY + TS + TV + 30}M${P2 - 3} ${TY + TS - 30}V${TY + TS + TV + 30}M${P2 + 3} ${TY + TS - 30}V${TY + TS + TV + 30}M${P1} ${MY - 3}H${P2 + 96}M${P1} ${MY + 3}H${P2 + 96}" class="sx-tp"/>
        <path d="M${P1 - 6} ${MY - 6}l12 12m0-12l-12 12M${P2 - 6} ${MY - 6}l12 12m0-12l-12 12" class="sx-tp sx-tp--x"/>
      </g>
      <g data-l="fr">
        <path d="${teeth()}" class="sx-zr sx-fade" style="--a:1.6s"/>
        <circle cx="${FX}" cy="${FY}" r="${FR}" fill="#fff"/>
        <circle cx="${FX}" cy="${FY}" r="${FR}" fill="url(#sx-hatch)" class="sx-fc"/>
        <path d="${rays}" class="sx-fr sx-fade" style="--a:1.7s"/>
        ${pop(FX + 8, FY + 20, 'fl', 1.8)}
      </g>
      <g data-l="ac">
        ${pop(754, 462, 'ac', .3)}
        ${fade(.5, tx(826, 432, 'Нн 87 м вод. ст.', 'sx-t'))}
        <path d="M824 462H868" class="sx-rib2 sx-pop" style="--a:.6s"/>
        <rect x="868" y="448" width="44" height="28" class="sx-bx sx-pop" style="--a:.5s"/>
      </g>
      <g data-l="ho">
        ${pop(786, 532, 'tw', .7)}${pop(822, 542, 'tw', .75)}${pop(884, 540, 'xc', .6)}
        <path d="M793 534L815 540" class="sx-h sx-pop" style="--a:.8s"/>
        <path d="M829 542L866 538M829 546L866 548" class="sx-rib2 sx-pop" style="--a:.85s"/>
        ${ln('M767 442C760 400 730 400 722 430C712 470 770 480 786 525', 'sx-h', .75, .35)}
        ${ln('M822 482V534', 'sx-h', .75, .2)}
        ${ln(hoseA, 'sx-h', .95, 1)}${ln(hoseB, 'sx-h', 1, 1)}
        ${fade(1.7, `<g transform="translate(250 636) rotate(32)">${halo(0, 0, 'n 8 · d 70 · q 5 л/с', 'sx-t sx-c')}</g><g transform="translate(285 610) rotate(32)">${halo(0, 0, 'n 8 · d 70 · q 5 л/с', 'sx-t sx-c')}</g>`)}
      </g>
      <g data-l="fo">
        <g transform="translate(232 265) rotate(26)"><g class="sx-fm sx-st sx-pop" style="--a:1.9s">${G.fm(60)}</g></g>
        ${fade(2, `<g transform="translate(232 244) rotate(26)">${tx(0, 0, 'ПУРГА-10', 'sx-t')}</g><g transform="translate(232 292) rotate(26)">${tx(0, 0, '10', 'sx-t')}</g>`)}
      </g>
      <g data-l="zone"><path d="M218 176L264 206m-13-2l13 2-5-12" class="sx-h sx-fade" style="--a:.4s"/></g>
      ${dark(FIRE.map((_, i) => stage(i)).join(''))}`;
    const run = `
      <g class="sx-sg sx-sg--r" data-l="ho">${sig(hoseA)}${sig(hoseB, 24)}</g>
      <g class="sx-sg" data-l="fr">
        ${ring(FX, FY, '0', 74)}${ring(FX, FY, '1.4', 74)}
      </g>`;
    return {
      note: 'Собрали два результата расчёта: как развивается пожар на&nbsp;группе резервуаров и&nbsp;какими силами его локализуют. Схема типовая, привязки к&nbsp;площадке и&nbsp;адреса нет.',
      sheets: [
        { t: 'Расстановка сил и&nbsp;средств', s: 'Сценарий № 1, момент локализации', l: 'Рис. 5' },
        { t: 'Развитие пожара', s: 'Пять стадий на&nbsp;группе резервуаров', l: 'Рис. 1' },
      ],
      veil: { seed: 23, w: SPLIT, h: H, cut: [[TX - 12, TY - 12, TS * 2 + TG + 24, TS * 2 + TV + 24]] },
      art, run,
      keys: [
        { k: 'fr', i: 'fr', b: '5', t: 'стадий развития пожара и&nbsp;2&nbsp;сценария расчёта' },
        { k: 'tk', i: 'tk', b: '4', t: 'мягких резервуара в&nbsp;группе' },
        { k: 'ho', i: 'ho', b: '2 × 8', t: 'рукавов d&nbsp;70 в&nbsp;двух линиях, q&nbsp;5&nbsp;л/с' },
        { k: 'fo', i: 'fo', b: '10', u: 'л/с', t: 'пенный ствол ПУРГА-10 на&nbsp;тушение' },
        { k: 'ac', i: 'ac', b: '87', u: 'м вод. ст.', t: 'напор на&nbsp;насосе' },
      ],
    };
  };

  // ── Административное здание: три отметки, зоны подъёмника на плане и на фасаде меняются вместе ──
  list.admin = () => {
    const B = { x: 430, y: 270, w: 300, h: 300, r: 26 }, P = 7;                 // условный контур и масштаб, пикс/м
    const ST = [[385, 450], [690, 220], [780, 520]];
    const LV = [{ n: '1 этаж', m: '+0,0 м', R: 23, y: 620 }, { n: '13 этаж', m: '+51,9 м', R: 26, y: 290 }, { n: '15 этаж', m: '+60,3 м', R: 25, y: 237 }];
    // периметр по точкам: всё, что не накрыто ни одной зоной, — необслуженная часть фасада
    const edge = () => { const q = [], s = 5, { x, y, w, h } = B; for (let i = 0; i <= w; i += s) q.push([x + i, y]); for (let i = s; i <= h; i += s) q.push([x + w, y + i]); for (let i = s; i <= w; i += s) q.push([x + w - i, y + h]); for (let i = s; i < h; i += s) q.push([x, y + h - i]); return q; };
    const missed = R => { const r = R * P, r0 = 5 * P, Q = edge(); let d = '', on = false; Q.concat([Q[0]]).forEach(([x, y]) => { const ok = ST.some(([a, b]) => { const t = Math.hypot(x - a, y - b); return t <= r && t >= r0; }); if (!ok) { d += (on ? 'L' : 'M') + x + ' ' + y; on = true; } else on = false; }); return d; };
    const phase = (k, s, l = '') => `<g class="sx-ph" style="--d:${k * 3}s"${l ? ` data-l="${l}"` : ''}>${s}</g>`;
    const zones = LV.map(({ R }, k) => { const r = R * P; return phase(k, `
      <g clip-path="url(#sx-bld)">${ST.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#sx-hr)"/>`).join('')}</g>
      ${ST.map(([x, y], i) => { const a = [205, 25, 218][i], [lx, ly] = pt(x, y, r + (i === 0 ? 6 : 0), a); return `<circle cx="${x}" cy="${y}" r="${r}" class="sx-zc"/>` + halo(lx, ly, 'R ' + R + ',0', 'sx-t sx-t--b sx-c'); }).join('')}
      <path d="${missed(R)}" class="sx-un"/>`); }).join('');
    const tabs = `<rect x="36" y="186" width="190" height="282" rx="6" class="sx-lg"/>` + LV.map(({ n, m }, k) => { const y = 216 + k * 54; return tx(64, y, n, 'sx-t sx-t--g2') + tx(64, y + 18, m, 'sx-t sx-t--g2') + phase(k, `<path d="M52 ${y - 12}v34" class="sx-tab"/>${tx(64, y, n, 'sx-t')}${tx(64, y + 18, m, 'sx-t')}`); }).join('') +
      `<path d="M54 392h20" class="sx-un"/>` + tx(84, 396, 'Часть фасада', 'sx-t') + tx(84, 412, 'без обслуживания', 'sx-t') + `<rect x="52" y="430" width="22" height="16" fill="url(#sx-hr)"/>` + tx(84, 443, 'Зона работы', 'sx-t');
    // тёмная половина: условный блок на 17 этажей, стрела встаёт на ту же отметку, что и план
    const F = { x: 1004, w: 330, t: 150, b: 620 }, fy = i => F.b - (F.b - F.t) / 17 * i;
    const poses = [
      'M1136 598L1188 540L1282 604',
      'M1136 598L1112 300L1296 290',
      'M1136 598L1106 250L1262 237',
    ];
    const boomTip = [[1282, 604], [1296, 290], [1262, 237]];
    const art = `
      <defs><clipPath id="sx-bld"><rect x="${B.x}" y="${B.y}" width="${B.w}" height="${B.h}" rx="${B.r}"/></clipPath><clipPath id="sx-half"><rect width="${SPLIT}" height="${H}"/></clipPath></defs>
      <rect x="262" y="132" width="${SPLIT - 262 - 24}" height="536" rx="26" class="sx-road"/>
      <g data-l="zone">
        <rect x="${B.x}" y="${B.y}" width="${B.w}" height="${B.h}" rx="${B.r}" class="sx-room"/>
        <rect x="${B.x}" y="${B.y}" width="${B.w}" height="${B.h}" rx="${B.r}" class="sx-wall"/>
      </g>
      <g data-l="zn" clip-path="url(#sx-half)"><g class="sx-fade" style="--a:1.2s">${zones}</g></g>
      <g data-l="rm">${ST.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${5 * P}" class="sx-zm sx-fade" style="--a:${.9 + i * .1}s"/>`).join('')}</g>
      <g data-l="st">${ST.map(([x, y], i) => pop(x - 27, y, 'vh', .6 + i * .1, 'Т9')).join('')}</g>
      <g class="sx-fade" style="--a:.9s">${tabs}</g>
      ${dark(`
        <g data-l="fa">
          <path d="M${F.x} ${F.b}V${F.t}H${F.x + F.w}V${F.b}" class="sx-wall"/>
          <path d="M${F.x - 26} ${F.b}H${F.x + F.w + 26}" class="sx-wall"/>
          <path d="${Array.from({ length: 16 }, (_, i) => `M${F.x} ${fy(i + 1)}h${F.w}`).join('')}" class="sx-fln sx-fade" style="--a:.4s"/>
          ${fade(.5, [1, 5, 9, 13, 15, 17].map(n => tx(F.x - 10, fy(n) + 15, n, 'sx-t', 'text-anchor="end"')).join(''))}
          ${fade(.6, tx(F.x - 10, F.t - 10, 'этаж', 'sx-t sx-t--g', 'text-anchor="end"'))}
        </g>
        <g data-l="zn">
          <rect x="${F.x + 18}" y="196" width="${F.w - 36}" height="${F.b - 196}" fill="url(#sx-hw)" class="sx-fade" style="--a:1s"/>
          <rect x="${F.x + 18}" y="196" width="${F.w - 36}" height="${F.b - 196}" class="sx-zw sx-fade" style="--a:1s"/>
        </g>
        <g data-l="st">
          <g class="sx-on-d">${pop(1128, F.b, 'al', .5)}</g>
          ${LV.map(({ y, m }, k) => phase(k, `<path d="M${F.x} ${y}h${F.w}" class="sx-lvl"/>${tx(F.x + F.w + 8, y + 4, m.replace(' м', ''), 'sx-t sx-lvt')}<path d="${poses[k]}" class="sx-bm"/><path d="M${boomTip[k][0] - 7} ${boomTip[k][1] - 8}h14v16h-14z" class="sx-cg"/>`)).join('')}
        </g>
      `)}`;
    const run = `<g class="sx-sg sx-sg--w" data-l="st">${LV.map((_, k) => phase(k, sig(poses[k]))).join('')}</g>`;
    return {
      note: 'Проверили, где подъёмник работает и&nbsp;какие участки фасада остаются без него. Форму здания и&nbsp;участок заменили условными, адрес закрыли.',
      sheets: [
        { t: 'Зоны обслуживания ПППМ', s: 'Подъёмник группы Т9, три отметки', l: 'Схема 1' },
        { t: 'Проекция на&nbsp;фасад', s: 'Зона работы подъёмника по&nbsp;этажам', l: 'Схема 2' },
      ],
      veil: { seed: 31, w: SPLIT, h: H, cut: [[262, 132, SPLIT - 286, 536]] },
      art, run,
      keys: [
        { k: 'st', i: 'al', b: '3', t: 'стоянки подъёмника группы Т9' },
        { k: 'zn', i: 'zn', b: 'R 26', u: 'м', t: 'наибольшая зона работы, отметка +51,9&nbsp;м' },
        { k: 'rm', i: 'rz', b: 'R 5', u: 'м', t: 'мёртвая зона у&nbsp;машины' },
        { k: 'fa', i: 'fa', b: '17', t: 'этажей в&nbsp;проекции на&nbsp;фасад' },
      ],
    };
  };

  // ── Жилой дом: площадка под автолестницу и её рабочая зона на фасаде ──
  list.zhk = () => {
    const WX = 640, M = 15, PW = 6 * M, PL = 12 * M, PX = WX - 12 * M, PY = 250;  // стена, масштаб, площадка
    const TX = PX + PW / 2, TY = PY + PL / 2, DX = PX - 26;
    const G0 = 610, PV = [1302, 586], RZ = 340;
    const LV = [['±0,000', 0], ['+3,900', 3.9], ['+7,650', 7.65], ['+11,400', 11.4], ['+16,100', 16.1]], SC = 11.9;
    const fy = h => +(G0 - h * SC).toFixed(1);
    const art = `
      <defs><pattern id="sx-st" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(-32)"><rect width="26" height="26" fill="#fff"/><rect width="26" height="13" fill="#f5312a"/></pattern></defs>
      <rect x="${DX}" y="190" width="${PW + 52}" height="${H - 190}" class="sx-road"/>
      ${fade(.1, tx(DX + 12, 676, 'Проезд', 'sx-t sx-t--g'))}
      <g data-l="zone">
        <rect x="${WX}" y="141" width="${SPLIT - WX}" height="503" class="sx-room"/>
        <rect x="${WX}" y="141" width="${SPLIT - WX}" height="503" fill="url(#sx-hatch)"/>
        <path d="M${SPLIT} 141H${WX}V644H${SPLIT}" class="sx-wall"/>
        ${fade(.8, tx(WX + 20, 169, 'Объект защиты', 'sx-t sx-t--r'))}
      </g>
      <g data-l="pl">
        <rect x="${PX}" y="${PY}" width="${PW}" height="${PL}" fill="url(#sx-st)" class="sx-fade" style="--a:.5s"/>
        <rect x="${PX}" y="${PY}" width="${PW}" height="${PL}" class="sx-pt sx-fade" style="--a:.5s"/>
      </g>
      <g data-l="al"><g class="sx-drv"><g transform="translate(${TX} ${TY}) rotate(-90)"><g class="sx-vh"><g transform="translate(-35 0)">${G.vh('АЛ')}</g></g></g></g></g>
      <g data-l="dm">
        ${ln(`M${PX} ${PY - 24}H${PX + PW}`, 'sx-dm', 1.3, .3)}${ln(`M${PX - 12} ${PY}V${PY + PL}`, 'sx-dm', 1.4, .4)}${ln(`M${PX + PW} ${TY}H${WX}`, 'sx-dm', 1.5, .3)}
        <path d="${tick(PX, PY - 24, 7)}${tick(PX + PW, PY - 24, 7)}M${PX - 19} ${PY}h14M${PX - 19} ${PY + PL}h14${tick(PX + PW, TY, 7)}${tick(WX, TY, 7)}" class="sx-dm sx-pop" style="--a:1.7s"/>
        ${fade(1.8, halo(PX + PW / 2, PY - 32, '6 м', 'sx-t sx-c') + `<g transform="translate(${PX - 20} ${TY}) rotate(-90)">${tx(0, 0, '12 м', 'sx-t sx-c')}</g>` + halo(PX + PW + 45, TY - 8, '6 м', 'sx-t sx-c'))}
      </g>
      ${dark(`
        <g data-l="zn">
          <path d="${fan(PV[0], PV[1], RZ, 80, 180)}" fill="url(#sx-hr)" class="sx-fade" style="--a:1s"/>
          <path d="${fan(PV[0], PV[1], RZ, 80, 180)}" class="sx-zw sx-zw--r sx-fade" style="--a:1s"/>
        </g>
        <g data-l="fa">
          <path d="M968 ${G0}H1374" class="sx-wall"/>
          <path d="M980 ${G0}V${fy(16.8)}H1124V${G0}" class="sx-wall"/>
          ${fade(.6, LV.map(([t, h]) => `<path d="M980 ${fy(h)}h144" class="sx-fln"/>` + mark(980, fy(h), t, 1, 62)).join(''))}
        </g>
        <g data-l="al">
          <g class="sx-on-d">${pop(PV[0], G0, 'al', .4, 1)}</g>
          ${boom(PV[0], PV[1], 268, 182, 204, 1.3, 42, 8)}
          ${fade(.8, tx(PV[0] + 12, G0 + 22, 'АЛ-32', 'sx-t sx-c'))}
        </g>
      `)}`;
    const run = `<g class="sx-sg sx-sg--r" data-l="dm">${sig(`M${TX} ${TY}H${WX}`)}</g>`;
    return {
      note: 'Определили, где встаёт автолестница и&nbsp;до каких отметок она достаёт. Участок и&nbsp;фасад заменили условными, адрес закрыли.',
      sheets: [
        { t: 'Площадка для техники', s: 'Привязка к&nbsp;объекту защиты', l: 'Раздел 2.5' },
        { t: 'Автолестница на&nbsp;фасаде', s: 'Рабочая зона по&nbsp;отметкам', l: 'Раздел 2.1.5' },
      ],
      veil: { seed: 41, w: SPLIT, h: H, cut: [[DX, 190, PW + 52, H], [WX, 141, SPLIT - WX, 503]] },
      art, run,
      keys: [
        { k: 'pl', i: 'pl', b: '12 × 6', u: 'м', t: 'площадка под пожарную автолестницу' },
        { k: 'dm', i: 'dm', b: '6', u: 'м', t: 'от площадки до&nbsp;стены здания' },
        { k: 'al', i: 'al', b: '32', u: 'м', t: 'высота подъёма автолестницы' },
        { k: 'fa', i: 'lv', b: '+16,8', u: 'м', t: 'верхняя отметка фасада в&nbsp;рабочей зоне' },
      ],
    };
  };

  // ── Склад с АБК: 25 стоянок автолестницы вокруг здания и проекция зон на четыре фасада ──
  list.sklad = () => {
    const B = { x: 294, y: 241, w: 540, h: 360 }, OF = 34, R0 = 44, R1 = 17;     // периметр кратен шагу сигнала
    const side = (n, f) => Array.from({ length: n }, (_, i) => f((i + .5) / n));
    const ST = [
      ...side(8, t => [B.x + B.w * t, B.y - OF, 0]),
      ...side(5, t => [B.x + B.w + OF, B.y + B.h * t, 90]),
      ...side(8, t => [B.x + B.w * (1 - t), B.y + B.h + OF, 0]),
      ...side(4, t => [B.x - OF, B.y + B.h * (1 - t), 90]),
    ];
    const per = `M${B.x} ${B.y}H${B.x + B.w}V${B.y + B.h}H${B.x}Z`;
    const prog = ([x, y]) => { const { x: X, y: Y, w, h } = B; if (y < Y) return x - X; if (x > X + w) return w + y - Y; if (y > Y + h) return w + h + X + w - x; return 2 * w + h + Y + h - y; };
    const RW = [{ n: 3, y: 170 }, { n: 2, y: 296 }, { n: 3, y: 422 }, { n: 6, y: 548 }], FW = 392, FX = 972, FH = 62;
    const row = ({ n, y }, r) => { const b = y + FH + 18;
      return `<g class="sx-fade" style="--a:${.5 + r * .15}s">${tx(FX, y - 6, 'Фасад ' + (r + 1), 'sx-t sx-t--g')}</g>
      <g data-l="fa"><path d="M${FX + 16} ${b}V${y + 16}H${FX + FW - 16}V${b}" class="sx-wall"/><path d="M${FX} ${b}H${FX + FW}" class="sx-wall"/></g>
      <g data-l="zn"><rect x="${FX}" y="${y + 2}" width="${FW}" height="${FH + 16}" fill="url(#sx-hw)" class="sx-fade" style="--a:${1 + r * .2}s"/></g>
      <g data-l="st">${Array.from({ length: n }, (_, i) => { const x = FX + 34 + (FW - 90) * (i + .5) / n; return `<path d="M${x} ${b - 6}L${x - 15} ${y + 2}" class="sx-ll" pathLength="1" style="--a:${1.2 + r * .2 + i * .06}s"/><rect x="${x - 6}" y="${b - 7}" width="24" height="7" class="sx-tr sx-fade" style="--a:${1 + r * .2 + i * .06}s"/>`; }).join('')}</g>`; };
    const art = `
      <rect x="${B.x - 82}" y="${B.y - 82}" width="${B.w + 164}" height="${B.h + 164}" rx="20" class="sx-road"/>
      <g data-l="zone">
        <rect x="${B.x}" y="${B.y}" width="${B.w}" height="${B.h}" class="sx-room"/>
        <rect x="${B.x}" y="${B.y}" width="${B.w}" height="${B.h}" fill="url(#sx-hatch)" opacity=".5"/>
        <path d="${per}" class="sx-wall"/>
      </g>
      <g data-l="zn">${ST.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${R0}" fill="url(#sx-hb)" class="sx-zb sx-fade" style="--a:${1 + i * .05}s"/>`).join('')}</g>
      <g data-l="rm">${ST.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${R1}" class="sx-zm sx-fade" style="--a:${1 + i * .05}s"/>`).join('')}</g>
      <g data-l="st">${ST.map(([x, y, a], i) => at(x, y, `<g transform="rotate(${a})"><g class="sx-tt sx-pop" style="--a:${.5 + i * .05}s"><rect x="-13" y="-6" width="26" height="12"/></g></g>`)).join('')}</g>
      ${fade(2, tx(36, 300, 'R 16', 'sx-t sx-t--b') + tx(78, 300, 'рабочая зона', 'sx-t') + tx(36, 322, 'R 6', 'sx-t sx-t--b') + tx(78, 322, 'мёртвая зона', 'sx-t'))}
      ${dark(RW.map(row).join(''))}`;
    const run = `
      <g class="sx-sg sx-sg--r" data-l="st">${sig(per)}</g>
      <g class="sx-sg" data-l="zn">${ST.map(p => { const a = wrap(prog(p) - 44) / STEP * LOOP; return ring(p[0], p[1], a.toFixed(2), R0, 'sx-ring--b'); }).join('')}</g>`;
    return {
      note: 'Подобрали места установки автолестницы вокруг здания и&nbsp;проверили покрытие фасадов. Контур здания условный, план участка и&nbsp;адрес закрыли.',
      sheets: [
        { t: 'Места установки автолестницы', s: 'Позиции для работы по&nbsp;фасадам', l: 'Лист 55' },
        { t: 'Рабочие зоны на&nbsp;фасадах', s: 'Проекция полей автолестницы', l: 'Лист 57' },
      ],
      veil: { seed: 53, w: SPLIT, h: H, cut: [[B.x - 82, B.y - 82, B.w + 164, B.h + 164]] },
      art, run,
      keys: [
        { k: 'st', i: 'al', b: '25', t: 'мест установки автолестницы вокруг здания' },
        { k: 'zn', i: 'zn', b: 'R 16', u: 'м', t: 'рабочая зона подъёмной установки' },
        { k: 'rm', i: 'rz', b: 'R 6', u: 'м', t: 'мёртвая зона у&nbsp;машины' },
        { k: 'fa', i: 'fa', b: '4', t: 'фасада с&nbsp;проекцией рабочих зон' },
      ],
    };
  };

  // ── Азотный комплекс: маршрут ПППМ по условной территории и рабочие зоны АЛ-30 на фасадах ──
  list.azot = () => {
    // условная трасса: радиус 46 пикс = 9,7 м, ширина полосы 26 пикс = 5,5 м
    const way = 'M980 560H686A46 46 0 0 0 640 606A46 46 0 0 1 594 652H196A46 46 0 0 1 150 606V266A46 46 0 0 1 196 220H424A46 46 0 0 1 470 266V334A46 46 0 0 0 516 380H858';
    const stub = 'M858 380V296';
    const BD = [[653, 573, 668, 600, 'start'], [627, 639, 620, 620, 'end'], [163, 639, 128, 672, 'middle'], [163, 233, 128, 204, 'middle'], [457, 233, 490, 208, 'middle'], [483, 367, 470, 402, 'middle']];
    const CELL = [[972, 124], [1176, 124], [972, 398], [1176, 398]], CW = 188, CH = 214, RZ = 176;
    // четыре условных фасада: блок, стоянки с углом лестницы, красным — участки без обслуживания
    const VIEW = [
      { v: [28, 92, 132, 122], l: [[2, 64], [94, 98], [186, 116]], un: [28, 186, 132, 28] },
      { v: [34, 84, 120, 130], l: [[8, 66], [180, 114]], un: [64, 84, 90, 44] },
      { v: [14, 100, 130, 114], l: [[172, 112]], un: [14, 100, 84, 114] },
      { v: [52, 90, 126, 124], l: [[14, 62], [36, 70]], un: [128, 150, 50, 64] },
    ];
    const view = ({ v: [bx, by, bw, bh], l, un }, n) => { const [cx, cy] = CELL[n];
      return `<g transform="translate(${cx} ${cy})">
        <g data-l="zn">${l.map(([x, a], i) => { const q = a - 32, r = a + 32; return `<path d="${fan(x, CH, RZ, q, r)}" fill="url(#sx-hw)" class="sx-fade" style="--a:${1 + n * .2 + i * .1}s"/><path d="${arc(x, CH, RZ, q, r)}" class="sx-zw sx-fade" style="--a:${1 + n * .2 + i * .1}s"/>`; }).join('')}</g>
        <g data-l="fa"><path d="M${bx} ${CH}V${by}H${bx + bw}V${CH}" class="sx-wall"/><path d="M-6 ${CH}H${CW + 6}" class="sx-wall"/></g>
        <g data-l="zn"><rect x="${un[0]}" y="${un[1]}" width="${un[2]}" height="${un[3]}" fill="url(#sx-hr)" class="sx-fade" style="--a:${1.6 + n * .2}s"/></g>
        <g data-l="st">${l.map(([x, a], i) => { const [tx1, ty1] = pt(x, CH - 6, RZ - 14, a); return `<path d="M${x} ${CH - 6}L${tx1} ${ty1}" class="sx-ll" pathLength="1" style="--a:${1.2 + n * .2 + i * .1}s"/><rect x="${x - 11}" y="${CH - 7}" width="22" height="7" class="sx-tr sx-fade" style="--a:${1 + n * .2}s"/>`; }).join('')}</g>
        ${fade(.6 + n * .15, tx(0, CH + 20, 'Фасад ' + (n + 1), 'sx-t sx-t--g'))}
      </g>`; };
    const art = `
      <defs><clipPath id="sx-way"><rect width="${SPLIT}" height="${H}"/></clipPath></defs>
      <g clip-path="url(#sx-way)">
        <path d="${way}${stub}" class="sx-wy"/>
        <path d="${way}${stub}" class="sx-wc"/>
      </g>
      <g data-l="rv">
        <g transform="translate(858 318) rotate(90)"><g class="sx-tb sx-pop" style="--a:1.1s"><rect x="-22" y="-9" width="44" height="18" rx="3"/></g></g>
        ${fade(1.2, tx(838, 310, 'Задний ход', 'sx-t', 'text-anchor="end"') + tx(838, 326, 'для разворота', 'sx-t sx-t--g2', 'text-anchor="end"'))}
      </g>
      <g data-l="rt">
        ${BD.map(([x, y, lx, ly, an], i) => `<circle cx="${x}" cy="${y}" r="4" class="sx-bd sx-pop" style="--a:${.6 + i * .1}s"/>` + fade(.8 + i * .1, halo(lx, ly, 'R 9,7', 'sx-t sx-t--b', `text-anchor="${an}"`))).join('')}
      </g>
      <g data-l="wd">
        <path d="M320 639V665M314 639h12M314 665h12" class="sx-dm sx-pop" style="--a:1.3s"/>
        ${fade(1.4, halo(320, 686, '5,5 м', 'sx-t sx-c'))}
      </g>
      <g data-l="rt" clip-path="url(#sx-way)"><g class="sx-trk" style="offset-path:path('${way}')"><path d="M-23-8H13L24 0 13 8H-23Z"/><path d="M-20 0H8"/></g></g>
      ${dark(VIEW.map(view).join(''))}`;
    return {
      note: 'Проверили проезд пожарной техники по&nbsp;территории и&nbsp;доступ автолестницы к&nbsp;фасадам. Застройка условная, название и&nbsp;адрес закрыли.',
      sheets: [
        { t: 'Транспортная схема', s: 'Движение ПППМ группы Л3', l: 'Лист 50' },
        { t: 'Рабочие зоны АЛ-30', s: 'Проекция на&nbsp;фасады здания', l: 'Лист 49' },
      ],
      veil: { seed: 67, w: SPLIT, h: H },
      art, run: '',
      keys: [
        { k: 'rt', i: 'rt', b: 'R 9,7', u: 'м', t: 'минимальный радиус поворота ПППМ' },
        { k: 'wd', i: 'dm', b: '5,5', u: 'м', t: 'ширина проезда на&nbsp;узком участке' },
        { k: 'st', i: 'al', b: '8', t: 'стоянок автолестницы АЛ-30' },
        { k: 'zn', i: 'fa', b: '4', t: 'фасада: рабочие зоны и&nbsp;участки без обслуживания, красным' },
        { k: 'rv', i: 'rv', b: '1', t: 'участок разворота задним ходом' },
      ],
    };
  };

  // ── Депозитарный центр: зоны АЛ-32 на фасаде и ручные трёхколенные лестницы ──
  list.depo = () => {
    const GR = 610, FX = 270, FW = 440, HM = 17.6, RZ = 410;
    const fy = h => +(GR - (h + 1.05) * HM).toFixed(1);
    const LV = [['-1,050', -1.05], ['+3,300', 3.3], ['+7,200', 7.2], ['+11,100', 11.1], ['+16,000', 16]];
    const TR = [[166, 1, 8, 104], [490, 1, 34, 146], [814, -1, 76, 172]];
    const DF = { x: 996, w: 330, t: 214, b: 610 }, dy = h => +(DF.b - (h + 1.05) * (DF.b - DF.t) / 17.05).toFixed(1);
    const LD = [[1062, 7.2], [1108, 6.6], [1154, 7.2], [1200, 6.6], [1246, 7.2], [1292, 6.6]];
    const art = `
      <rect y="${GR}" width="${SPLIT}" height="${H - GR}" class="sx-road"/>
      ${fade(.1, tx(36, 676, 'Проезд', 'sx-t sx-t--g'))}
      <g data-l="zn">
        ${TR.map(([x, , a0, a1], i) => `<path d="${fan(x, GR - 25, RZ, a0, a1)}" fill="url(#sx-hb)" class="sx-zb sx-fade" style="--a:${1 + i * .2}s"/>`).join('')}
      </g>
      <g data-l="fa">
        <rect x="${FX}" y="${fy(16)}" width="${FW}" height="${GR - fy(16)}" class="sx-room sx-o"/>
        <path d="M${FX} ${GR}V${fy(16)}H${FX + FW}V${GR}M0 ${GR}H${SPLIT}" class="sx-wall"/>
        ${fade(.6, LV.slice(1, 4).map(([, h]) => `<path d="M${FX} ${fy(h)}h${FW}" class="sx-fln2"/>`).join(''))}
        ${fade(.7, LV.slice(1).map(([t, h]) => mark(FX + FW, fy(h), t, 1, 66)).join(''))}
      </g>
      <g data-l="al">
        ${TR.map(([x, d], i) => pop(x, GR, 'al', .3 + i * .1, d) + boom(x, GR - 25, 330, d > 0 ? -4 : 184, [-92, -112, 240][i], .9 + i * .2, [34, 40, -34][i], 8 + i) + fade(.5 + i * .1, tx(x + 12 * d, GR + 22, 'АЛ-32', 'sx-t sx-c'))).join('')}
      </g>
      ${dark(`
        <g data-l="fa">
          <path d="M${DF.x} ${DF.b}V${dy(16)}H${DF.x + DF.w}V${DF.b}" class="sx-wall"/><path d="M956 ${DF.b}H1374" class="sx-wall"/>
          ${fade(.6, LV.slice(1).map(([t, h]) => `<path d="M${DF.x} ${dy(h)}h${DF.w}" class="sx-fln"/>` + tx(DF.x + 10, dy(h) - 6, t, 'sx-t')).join(''))}
        </g>
        <g data-l="ld">
          ${LD.map(([x, h], i) => stair(x, DF.b, x, dy(h), 1 + i * .12)).join('')}
          ${stair(966, DF.b + 22, DF.x + 6, dy(3.3), 1.8)}${stair(1356, DF.b + 22, DF.x + DF.w - 6, dy(3.3), 1.9)}
        </g>
      `)}`;
    const run = `<g class="sx-sg sx-sg--w" data-l="ld">${LD.map(([x, h]) => sig(`M${x} ${DF.b}V${dy(h)}`)).join('')}</g>
      <g class="sx-sg" data-l="ld">${LD.map(([x, h]) => ring(x, dy(h), arrive(`M${x} ${DF.b}V${dy(h)}`), 20, 'sx-ring--w')).join('')}</g>`;
    return {
      note: 'Проверили доступ к&nbsp;фасадам с&nbsp;автолестницы и&nbsp;с&nbsp;ручных лестниц. Фасады заменили условными блоками, оси и&nbsp;адрес закрыли.',
      sheets: [
        { t: 'Рабочие зоны АЛ-32', s: 'Проекция на&nbsp;фасады', l: 'Схема 15' },
        { t: 'Ручные лестницы', s: 'Трёхколенная лестница на&nbsp;фасадах', l: 'Схема 8' },
      ],
      veil: { seed: 73, w: SPLIT, h: H, cut: [[0, GR, SPLIT, H - GR]] },
      art, run,
      keys: [
        { k: 'al', i: 'al', b: '3', t: 'позиции автолестницы АЛ-32' },
        { k: 'zn', i: 'zn', b: '+16,0', u: 'м', t: 'верх фасада в&nbsp;проекции рабочих зон' },
        { k: 'ld', i: 'ld', b: '8', t: 'ручных трёхколенных лестниц' },
        { k: 'fa', i: 'lv', b: '+7,2', u: 'м', t: 'предельная отметка ручной лестницы' },
      ],
    };
  };
})();
