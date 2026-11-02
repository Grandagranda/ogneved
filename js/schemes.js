// Графическая часть проектов (страница rabota.html): две схемы из комплекта на одной панели.
// На сайт идёт только рабочий слой: техника, рукавные линии, трубы, расчётные значения. Расположение — условное.
// Планировку, адрес, название объекта, штамп и номера помещений с листов не переносим; мозаика под схемой
// выдуманная (veil), из чертежа в неё ничего не попадает — контур реального здания по ней не восстановить.
//
// Новый объект — функция в OG_SCH.list с ключом = id работы из data.js (ДГУ здесь, остальные в schemes-obj.js):
//   note — пояснение в шапке блока; sheets — подписи двух половин панели; spec — строки на тёмной половине, если есть;
//   keys — карточки под схемой: k совпадает с data-l у слоёв (наведение оставляет яркими только их), i — знак из ICON;
//   veil — посев мозаики и вырез под помещение; art — рисунок; run — бегущие сигналы.
// Координаты — пиксели панели 1400×700 (кадр 1920). Геометрию труб снимать с PDF: _tools/pdf-paths.cjs.
(function () {
  const W = 1400, H = 700, SPLIT = 936;

  // ── мозаика-подложка ──
  const rng = s => () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  // выдуманная планировка: прямоугольник дробится на «помещения» со стенами, карта размывается и садится на плитку
  // одного размера — как пикселизация закрытого снимка. Тонов пять, сверху плитка тает под заголовком
  const veil = ({ seed, w, h, c = 12, cut = [] }) => {
    const r = rng(seed), rooms = [], nx = Math.ceil(w / c), ny = Math.ceil(h / c);
    const split = (x, y, a, b, d) => {
      if (d > 6 || Math.max(a, b) < 125 + r() * 105) { rooms.push([x, y, a, b, r()]); return; }
      const k = .34 + r() * .32;
      if (a > b * (.75 + r() * .5)) { split(x, y, a * k, b, d + 1); split(x + a * k, y, a * (1 - k), b, d + 1); }
      else { split(x, y, a, b * k, d + 1); split(x, y + b * k, a, b * (1 - k), d + 1); }
    };
    split(0, 0, w, h, 0);
    const TONE = [.03, .09, .17, .36];
    let map = new Float32Array(nx * ny);
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const x = (i + .5) * c, y = (j + .5) * c, q = rooms.find(m => x >= m[0] && x < m[0] + m[2] && y >= m[1] && y < m[1] + m[3]);
      if (q) map[j * nx + i] = Math.min(x - q[0], q[0] + q[2] - x, y - q[1], q[1] + q[3] - y) < 8 ? 1 : TONE[q[4] * TONE.length | 0];
    }
    const soft = new Float32Array(nx * ny);
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      let t = 0, n = 0;
      for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) if (j + a >= 0 && j + a < ny && i + b >= 0 && i + b < nx) { t += map[(j + a) * nx + i + b]; n++; }
      soft[j * nx + i] = t / n;
    }
    const LV = [.16, .32, .5, .72, 1], out = LV.map(() => '');
    const size = c - 1;
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const x = i * c, y = j * c, mx = x + c / 2, my = y + c / 2;
      if (cut.some(q => mx > q[0] && mx < q[0] + q[2] && my > q[1] && my < q[1] + q[3])) continue;
      const v = soft[j * nx + i] * Math.min(1, Math.max(0, (my - 110) / 120)), l = Math.min(LV.length - 1, v * 1.25 * LV.length | 0);
      if (v < .015) continue;
      out[l] += `M${x} ${y}h${size}v${size}h-${size}z`;
    }
    return out.map((d, k) => d && `<path d="${d}" fill-opacity="${LV[k]}"/>`).join('');
  };

  // ── знаки: линии в единицах панели, цвет и толщина — в css (.sx-*) ──
  // обёртка at ставит знак на место, класс .sx-pop внутри — его появление: --a задержка, с
  const at = (x, y, s) => `<g transform="translate(${x} ${y})">${s}</g>`;
  const tx = (x, y, t, cls = '', o = '') => `<text x="${x}" y="${y}"${cls ? ` class="${cls}"` : ''}${o ? ' ' + o : ''}>${t}</text>`;
  const halo = (x, y, t, cls = '') => tx(x, y, t, 'sx-halo ' + cls) + tx(x, y, t, cls);
  // рукава от гидранта охватывают его знак и сходятся у автоцистерны; нижний, всасывающий, с рёбрами
  const EYE = 'M19 2.6C15 5.9 8.8 15.2-1.2 15.2-13.2 15.2-16.9 8.7-20 5.6';
  const G = {
    // пожарная автоцистерна: пятиугольник острием по ходу, овал — цистерна
    ac: () => '<path d="M0-20H52L70 0 52 20H0Z"/><ellipse cx="27" rx="17" ry="10"/>',
    vh: n => `<path d="M0-20H52L70 0 52 20H0Z"/><text x="27" y="5.4" class="sx-vh-t">${n}</text>`,     // автомобиль с буквами вместо цистерны
    pg: () => '<circle r="10"/><path d="M-10 0A10 10 0 0 1 10 0Z"/>',   // пожарный гидрант: закрашен верх
    ey: () => `<path d="M-26 0H-10M-20-5.6L-26 0-20 5.6M19-2.6L21.4 0 19 2.6M21.4 0H25.6M19-2.6C15-5.9 8.8-15.2-1.2-15.2-13.2-15.2-16.9-8.7-20-5.6M-21.6-3.4l1.6 1.6M16.8-5.8l1.6 1.6"/><path d="${EYE}"/><path d="${EYE}" class="sx-rib"/>`,
    rs: () => '<circle r="10"/>',                                       // сухотрубный стояк
    dr: () => '<path d="M0-20L12 0 0 20-12 0Z"/><circle r="5"/>',       // пеногенератор на сухотрубе
    st: L => `<path d="M0 0H${L - 34}M9-5V5"/><path d="M${L - 44}-7L${L - 22} 0 ${L - 44} 7Z" class="sx-f"/><circle cx="${L - 17}" r="5" class="sx-f"/><circle cx="${L - 6}" r="5" class="sx-f"/>`, // ствол на рабочей линии
    arw: () => '<path d="M0-15L68-7 66-24 90 0 66 24 68 7 0 15 15 0Z" class="sx-f"/>',                                 // решающее направление
    fl: () => '<path d="M0 0V-46"/><path d="M0-46H30V-27H0Z" class="sx-r"/><circle r="3.5" class="sx-r"/>',          // место возникновения пожара
    pb: n => `<circle r="19"/><text y="4.6" class="sx-pb-t">ПБ</text><text x="24" y="-13" class="sx-pb-n">${n}</text>`, // пост безопасности ГДЗС
    kp: () => '<circle r="23"/><text y="4.6" class="sx-pb-t">КПП</text>',                                            // контрольно-пропускной пункт ГДЗС
    sh: () => '<path d="M0 18V-20H26V-2H0"/><path d="M-9 18H9L0 3Z"/><text x="13" y="-6.6" class="sx-pb-t">Ш</text>',   // оперативный штаб
  };
  const fade = (a, s) => `<g class="sx-fade" style="--a:${a}s">${s}</g>`;
  const pop = (x, y, kind, a, ...args) => at(x, y, `<g class="sx-${kind} sx-pop" style="--a:${a}s">${G[kind](...args)}</g>`);
  const STEP = 300, LOOP = 2.8, TAIL = 44;   // шаг сигналов, время круга и длина хвоста — те же числа в .sx-sg path
  // рисуемая линия: длина нормирована; a — когда начать, z — сколько рисовать
  const ln = (d, cls, a, z = .6) => `<path d="${d}" pathLength="1" class="sx-dw ${cls}" style="--a:${a}s;--z:${z}s"/>`;
  // сигнал: голова и хвост с общим концом. Штрихи считаются от начала маршрута, поэтому на общем участке совпадают
  // и расходятся на развилке; s — задержка в пикселях пути, ею сводят разные маршруты в один штрих у места слияния
  const sig = (d, s = 0) => `<path d="${d}" class="sx-sg-t" style="--s:${s}px"/><path d="${d}" class="sx-sg-h" style="--s:${s}px"/>`;
  const len = d => { const p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.setAttribute('d', d); return p.getTotalLength(); };
  const wrap = v => +(((v % STEP) + STEP) % STEP).toFixed(1);
  // когда сигнал доходит до конца маршрута — чтобы кольцо срабатывания попало в этот момент
  const arrive = (d, s = 0) => (wrap(len(d) + s - TAIL) / STEP * LOOP).toFixed(2);

  // знаки для карточек под схемой
  const ICON = {
    wa: `<svg viewBox="-31 -15 62 30" class="sx-pg"><path d="M-31 0H31" class="sx-ax"/><circle r="14.5"/><path d="M0-14.5A14.5 14.5 0 0 1 0 14.5Z"/></svg>`,
    ac: `<svg viewBox="-2 -22 74 44" class="sx-ac">${G.ac()}</svg>`,
    ho: `<svg viewBox="0 -4 87 44" class="sx-ic-h"><path d="M0 18H59M27 15v6M42.5 18V0H59M42.5 18V36H59M59-3V3M59 15v6M59 33v6M60 0H87M60 18H87M60 36H87"/></svg>`,
    st: `<svg viewBox="-7 -18 88 36" class="sx-st"><path d="M-7 0H0"/>${G.st(81)}<text x="29" y="-8" class="sx-t sx-c">РСКУ-50А</text><text x="29" y="17" class="sx-t sx-c">4</text></svg>`,
    dr: `<svg viewBox="-14 -22 28 44" class="sx-dr">${G.dr()}</svg>`,
  };

  // подпись вдоль трубы: посередине отрезка, со сдвигом по нормали
  const along = ([x0, y0], [x1, y1], dx, dy, deg, t) => tx(0, 0, t, 'sx-t', 'transform="translate(' + ((x0 + x1) / 2 + dx) + ' ' + ((y0 + y1) / 2 + dy) + ') rotate(' + deg + ')" text-anchor="middle"');
  // от автоцистерны рукав уходит вниз или вверх и плавно ложится на уровень
  const out = (x, y, l) => 'M' + x + ' ' + y + 'C' + x + ' ' + (y + (l - y) * .84) + ' ' + (x + 24) + ' ' + l + ' ' + (x + 33) + ' ' + l;
  // гидрант: ось сети и повёрнутая дробью подпись на ней, s — подпись сверху (-1) или снизу (1)
  const hydrant = (x, y, s, a, b, t) => { const py = s < 0 ? y - 79 : y + 25, m = py + 27;
    return fade(t, '<rect x="' + (x - 17) + '" y="' + py + '" width="34" height="54" rx="7" class="sx-plate"/><path d="M' + x + ' ' + (py + 6) + 'V' + (py + 48) + 'M' + x + ' ' + (y - 22) + 'V' + (y + 22) + '" class="sx-ax"/>' + tx(0, 0, a, 'sx-t sx-t--b sx-c', 'transform="translate(' + (x - 4.5) + ' ' + m + ') rotate(-90)"') + tx(0, 0, b, 'sx-t sx-t--b sx-c', 'transform="translate(' + (x + 13) + ' ' + m + ') rotate(-90)"')) + pop(x, y, 'pg', t) + pop(x, y, 'ey', t + .35); };

  // ── ДГУ ──
  // Связи и знаки — по рисунку заказчика (ДизельГенераторная.ai), размеры знаков — панельные. Проезд полосой слева;
  // рукава заканчиваются соединительными головками в стене помещения, дальше по нему идёт труба к пеногенераторам.
  // Сухотруб снят с листа координатами чертежа (ox, oy) и отзеркален; стояк укорочен: схема без масштаба.
  const dgu = () => {
  const K = .9, AX = ox => +(1417.5 - K * ox).toFixed(1), AY = oy => +(120 + K * (oy - 108.3)).toFixed(1);
  const Y1 = 608, Y2 = 636;                                       // уровни головок на тёмной половине
  const riser = AX(346.7), top = AY(521.7), link = AX(393.4), head = AX(461), valve = AX(441.3), vEnd = AX(403.8);
  const far = [AX(150.7), AY(327)];                               // дальний конец магистрали Ду 80
  const j2 = [AX(243.1), AY(418.6)], j3 = [AX(333.2), AY(508.8)]; // врезки ветвей
  const b1 = [AX(369.7), AY(108.3)], b2 = [AX(394.3), AY(267.5)], b3 = [AX(481.9), AY(360.1)]; // концы ветвей Ду 50
  const drop = K * 18.5, DRY = 27;
  // подвесы и крепления стояка — точки с листа
  const HANG = [[468.3, 371.2], [405.7, 434.7], [338.6, 502.5], [383.2, 277.4], [320.9, 340.9], [255.2, 408.6], [351.7, 125.1], [260.1, 216.4], [162.6, 314.2],
    [323, 499.6], [287, 463.8], [245.6, 422.5], [198.3, 375.2], [156.1, 331]];
  const hang = ([x, y], i) => { const a = AX(x), b = AY(y), s = 9; return `<path d="M${a - s} ${b - s}L${a + s} ${b + s}M${a - s - 4} ${b - s}h8M${a + s - 4} ${b + s}h8" transform="rotate(${i > 8 ? 0 : 90} ${a} ${b})"/>`; };
  const clamp = y => `M${riser - 9} ${y}h18m-18-5v10m18-10v10`;

  // площадка: левый край знаков, ряды техники и уровни рукавов
  const ROAD = 412, RX = 640, RT = 141, RB = 644;                 // полоса проезда, стены помещения
  const X0 = 36, AC = X0 + 51, AR = 319;                          // левая колонка и автоцистерны у помещения
  const A1 = 240, A2 = 502, A4 = 627, L1 = 284, L2 = 546, L3 = 583;
  const BR = 352, T1 = 315, T2 = 391, NX = 509, RS = 539;         // разветвление, засечки, цифра на линии, стояк
  const ROWS = [[240, 1], [L1, 1], [328, 2]];                     // три линии к стволам
  const E0 = 573, HX = RX - 13, JX = 663;                         // конец рукава, центр головки, перемычка в помещении
  const DR = [[700, 354], [805, 354], [900, 269]];                // пеногенераторы в помещении

  const hose1 = out(AC + 13, A1 + 20, L1) + 'H' + BR, hose2 = out(AC + 13, A2 + 20, L2) + 'H' + (AR + 46);
  const c3 = out(AR + 13, A2 + 20, L2), c4 = out(AR + 13, A4 - 20, L3);
  const feed3 = `${c3}H${JX}V${L3}`, leaf = ([x, y]) => `${c4}H${x}V${y + 20}`;

  // соединительная головка в стене: клапан по ходу, задвижка, головка
  const inlet = y => `<path d="M${E0} ${y}H${HX - 13}"/><path d="M${E0 + 5.4} ${y - 5.8}l5 5.8-5 5.8z" class="sx-in-t"/><path d="M${E0 + 15.5} ${y - 4.4}l17 8.8v-8.8l-17 8.8z" class="sx-in-v"/><circle cx="${HX}" cy="${y}" r="13"/><circle cx="${HX}" cy="${y}" r="8"/><path d="M${HX - 5.7} ${y - 5.7}l11.4 11.4m0-11.4l-11.4 11.4"/>`;
  // узел ввода на тёмной половине: двойная скоба головки, две риски и задвижка с закрашенной половиной
  const gate = y => `<path d="M${valve} ${y - 10.5}v21M${vEnd} ${y - 10.5}v21M${valve + 3.7} ${y - 10.5}l26.3 21v-21l-26.3 21z"/><path d="M${valve + 3.7} ${y - 10.5}v21l13.2-10.5z" class="sx-fw"/>`;
  const nut = y => `M${head + 5} ${y - 8}h-5v16h5M${head + 2.7} ${y - 5}h4v10h-4`;

  const art = `
    <rect width="${ROAD}" height="${H}" class="sx-road"/>
    ${fade(.1, tx(X0, 676, 'Проезд', 'sx-t sx-t--g'))}
    <g data-l="zone">
      <rect x="${RX}" y="${RT}" width="${SPLIT - RX}" height="${RB - RT}" class="sx-room"/>
      <rect x="${RX}" y="${RT}" width="${SPLIT - RX}" height="${RB - RT}" fill="url(#sx-hatch)"/>
      <path d="M${SPLIT} ${RT}H${RX}V${RB}H${SPLIT}" class="sx-wall"/>
      ${fade(1.8, tx(RX + 20, RT + 28, 'Помещение ДГУ', 'sx-t sx-t--r'))}
      ${pop(835, 461, 'fl', 1.9)}
      ${fade(2, tx(843, 454, 'Очаг', 'sx-t sx-t--r'))}
    </g>
    <g data-l="dr">
      ${ln(`M${RX} ${L2}H${JX}V${L3}`, 'sx-rp', 1.3, .25)}
      ${ln(`M${RX} ${L3}H${DR[2][0]}V${DR[2][1] + 20}`, 'sx-rp', 1.4, .8)}
      ${DR.slice(0, 2).map(([x, y], i) => ln(`M${x} ${L3}V${y + 20}`, 'sx-rp', 1.6 + i * .15, .4)).join('')}
      ${DR.map(([x, y], i) => pop(x, y, 'dr', 2 + i * .1)).join('')}
    </g>
    <g data-l="wa ho">${hydrant(X0 + 26, A1, -1, 'ПГ-2', 'К-400', .1)}${hydrant(X0 + 26, A2, 1, 'ПГ-1', 'К-400', .2)}</g>
    <g data-l="ac">
      ${[[AC, A1, 'АЦ-1', -1], [AC, A2, 'АЦ-2', -1], [AR, A2, 'АЦ-3', -1], [AR, A4, 'АЦ-4', 1]].map(([x, y, n, s], i) => pop(x, y, 'ac', .25 + i * .08) + fade(.3 + i * .08, tx(x + 27, y + (s < 0 ? -26 : 35), n, 'sx-t sx-c'))).join('')}
    </g>
    <g data-l="zone">
      ${pop(X0, 335, 'vh', .4, 'АБГ')}${pop(X0, 418, 'vh', .45, 'Ш')}
      ${pop(195, 335, 'kp', .5)}${pop(187, 416, 'sh', .55)}${pop(296, 196, 'pb', .6, '3')}
      ${fade(.7, tx(296, 232, 'Посты ГДЗС', 'sx-t sx-c') + tx(195, 450, 'Штаб', 'sx-t sx-c'))}
    </g>
    <g data-l="ho">
      ${ln(hose1, 'sx-h', .6, .4)}
      <path d="M${T1} ${L1 - 6}v12" class="sx-h sx-pop" style="--a:.95s"/>
      ${ln(`M${BR} ${L1}V${ROWS[0][0]}`, 'sx-h', .95, .15)}${ln(`M${BR} ${L1}V${ROWS[2][0]}`, 'sx-h', .95, .15)}
      ${ROWS.map(([y, n], i) => ln(`M${BR} ${y}H${NX - 7}`, 'sx-h', 1.05 + i * .1, .4) + `<path d="M${T2} ${y - 6}v12" class="sx-h sx-pop" style="--a:${1.1 + i * .1}s"/>` + ln(`M${NX + 7} ${y}H${RS - 10}`, 'sx-h', 1.45 + i * .1, .1) + fade(1.4 + i * .1, halo(NX, y + 4.3, n, 'sx-t sx-c'))).join('')}
      ${ln(`${c3}H${E0}`, 'sx-h', .7, .5)}${ln(`${c4}H${E0}`, 'sx-h', .75, .5)}
      <path d="${hose2}" class="sx-h sx-dash sx-pop" style="--a:.9s"/>
      ${fade(1, tx(190, L1 - 8, 'DN 80 · N 3 · Q 12 л/с', 'sx-t') + halo(428, L2 - 9, 'DN 80 · N 1 · Q 15 л/с', 'sx-t'))}
    </g>
    <g data-l="ho dr"><g class="sx-in sx-pop" style="--a:1.15s">${inlet(L2)}${inlet(L3)}</g></g>
    <g data-l="st">
      ${ROWS.map(([y], i) => pop(RS, y, 'rs', 1.6 + i * .1) + pop(RS + 10, y, 'st', 1.7 + i * .1, 85) + fade(1.8 + i * .1, halo(RS + 49, y - 9, 'РСКУ-50А', 'sx-t sx-c') + halo(RS + 49, y + 17, '4', 'sx-t sx-c'))).join('')}
    </g>
    <g data-l="zone">
      ${pop(514, 437, 'arw', 2.1)}
      ${fade(2.2, halo(559, 402, 'Решающее направление', 'sx-t sx-c'))}
    </g>
    <g data-l="dr">
      ${[Y1, Y2].map(y => ln(`M${head + 6.7} ${y}H${valve}`, 'sx-p sx-p--t', 1, .1)).join('')}
      ${ln(`M${vEnd} ${Y2}H${riser}V${top}`, 'sx-p', 1.2, .5)}
      ${ln(`M${vEnd} ${Y1}H${link}V${Y2}`, 'sx-p', 1.2, .25)}
      ${ln(`M${riser} ${top}L${far[0]} ${far[1]}`, 'sx-p', 1.7, .55)}
      ${ln(`M${far[0]} ${far[1]}L${b1[0]} ${b1[1]}V${b1[1] + drop}`, 'sx-p sx-p--t', 2.25, .65)}
      ${ln(`M${j2[0]} ${j2[1]}L${b2[0]} ${b2[1]}V${b2[1] + drop}`, 'sx-p sx-p--t', 2.05, .55)}
      ${ln(`M${j3[0]} ${j3[1]}L${b3[0]} ${b3[1]}V${b3[1] + drop}`, 'sx-p sx-p--t', 1.85, .55)}
      <g class="sx-hang sx-pop" style="--a:2.7s">${HANG.map(hang).join('')}<path d="${clamp(top + 14)}${clamp((top + Y2) / 2)}${clamp(Y2 - 14)}"/><path d="${[b1, b2, b3].map(([x, y]) => `M${x - 10} ${y + drop + .6}h20m-20 5.4h20`).join('')}" class="sx-fl2"/></g>
      <g class="sx-valve sx-pop" style="--a:1s">${gate(Y1)}${gate(Y2)}<path d="${nut(Y1)}${nut(Y2)}" class="sx-nut"/></g>
      ${[b1, b2, b3].map(([x, y], i) => pop(x, y + drop + DRY, 'dr', 2.7 + i * .1)).join('')}
      <g class="sx-w sx-fade" style="--a:2.8s">
        ${along(b1, far, 12, -12, 45, 'Ду 50 · L 6000')}${along(b2, j2, 12, -12, 45, 'Ду 50 · L 4500')}${along(b3, j3, 12, -12, 45, 'Ду 50 · L 4500')}
        ${along(far, j2, 17, 17, -45, 'Ду 80 · L 6000')}${along(j2, j3, 17, 17, -45, 'Ду 80 · L 5000')}
        ${along([riser, top], [riser, Y2], -12, 0, -90, 'Ду 80 · H 6200')}
        ${tx(972, 668, 'Соединительные головки Ду 80', 'sx-t')}
      </g>
    </g>`;

  // сигналы: на рукавах и трубе в помещении красные, на красной трубе — белые. Рукав АЦ-2 вливается в рукав АЦ-3,
  // а тот — в трубу от АЦ-4: задержки сводят их в один штрих у места слияния
  const LEAF = [[far, b1], [j2, b2], [j3, b3]].map(([j, b]) => [[head + 6.7, Y2], [riser, Y2], [riser, top], j, b, [b[0], b[1] + drop]]);
  const walk = p => `M${p[0]}${p.slice(1).map(q => 'L' + q).join('')}`;
  const s2 = wrap(len(c3) - len(hose2)), s4 = wrap(len(feed3) - len(`${c4}H${JX}`));
  // белый сигнал приходит к оросителю вместе с красным на его паре в помещении
  const sw = wrap(len(leaf(DR[0])) + s4 - len(walk(LEAF[2])));
  const sw1 = wrap(sw + (link - head - 6.7) - len(`M${head + 6.7} ${Y1}H${link}V${Y2}`));
  // порядок: ближняя ветвь срабатывает первой; у каждого оросителя на трубе — пара в помещении
  const rings = [2, 1, 0].map((n, i) => { const b = [b1, b2, b3][n];
    return `<circle cx="${b[0]}" cy="${b[1] + drop + DRY}" r="30" class="sx-ring sx-ring--w" style="--a:${arrive(walk(LEAF[n]), sw)}s"/><circle cx="${DR[i][0]}" cy="${DR[i][1]}" r="30" class="sx-ring" style="--a:${arrive(leaf(DR[i]), s4)}s"/>`; }).join('');

  const run = `<defs>
      <clipPath id="sx-hose"><rect width="${RX}" height="${H}"/></clipPath>
      <clipPath id="sx-rooms"><rect x="${RX}" width="${SPLIT - RX}" height="${H}"/></clipPath>
    </defs>
    <g class="sx-sg sx-sg--r" data-l="ho" clip-path="url(#sx-hose)">
      ${ROWS.map(([y]) => sig(`${hose1}V${y}H${RS + 72}`)).join('')}
      ${sig(hose2, s2)}${sig(feed3)}${sig(leaf(DR[0]), s4)}
    </g>
    <g class="sx-sg sx-sg--r" data-l="dr" clip-path="url(#sx-rooms)">
      ${sig(feed3)}${DR.map(q => sig(leaf(q), s4)).join('')}
    </g>
    <g class="sx-sg sx-sg--w" data-l="dr">
      ${LEAF.map(p => sig(walk(p), sw)).join('')}${sig(`M${head + 6.7} ${Y1}H${link}V${Y2}`, sw1)}
    </g>
    <g class="sx-sg" data-l="dr">${rings}</g>`;

  return {
    note: 'Оставили рабочий слой: технику, рукавные линии, трубопровод и&nbsp;расчётные значения. Планировку и&nbsp;адрес закрыли, полный комплект листов получает только заказчик.',
    sheets: [
      { t: 'Расстановка сил и&nbsp;средств', s: 'Тушение в&nbsp;помещении ДГУ, первая пенная атака', l: 'Лист 04' },
      { t: 'Сухотруб к&nbsp;оросителям', s: 'Аксонометрическая схема', l: 'Лист 07' },
    ],
    veil: { seed: 7, w: SPLIT, h: H, cut: [[0, 0, ROAD, H], [RX, RT, SPLIT - RX, RB - RT]] },
    art, run,
    spec: [['Труба Ду 80', '17,2 м'], ['Труба Ду 50', '15 м'], ['Обратные клапаны', '2'], ['Подвесы и крепления', '17']],
    keys: [
      { k: 'wa', i: 'wa', b: '2', t: 'пожарных гидранта на&nbsp;кольцевой сети К-400' },
      { k: 'ac', i: 'ac', b: '4', t: 'пожарных автоцистерны задействованы в&nbsp;схемах боевого развёртывания' },
      { k: 'ho', i: 'ho', b: '12 + 15', u: 'л/с', t: 'подача по&nbsp;магистральным линиям DN&nbsp;80' },
      { k: 'st', i: 'st', b: '3', t: 'пожарных ствола РСКУ-50А поданы на&nbsp;защиту смежных с&nbsp;горящим помещений' },
      { k: 'dr', i: 'dr', b: '3', t: 'стационарных пеногенератора задействованы в&nbsp;тушении пожара через сухотрубы' },
    ],
  };
  };

  window.OG_SCH = {
    W, H, SPLIT, veil, ICON,
    kit: { at, tx, halo, G, fade, pop, ln, sig, len, wrap, arrive, along, out, hydrant, STEP, LOOP, TAIL },
    list: { dgu },
    // схема собирается только для открытой страницы
    get(id) { const f = this.list[id]; return f ? f() : null; },
  };
})();
