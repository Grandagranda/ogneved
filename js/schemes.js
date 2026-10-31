// Графическая часть проектов (страница rabota.html): две схемы из комплекта на одной панели.
// На сайт идёт только рабочий слой: техника, рукавные линии, трубы, расчётные значения. Расположение — условное.
// Планировку, адрес, название объекта, штамп и номера помещений с листов не переносим; мозаика под схемой
// выдуманная (veil), из чертежа в неё ничего не попадает — контур реального здания по ней не восстановить.
//
// Новый объект — запись в OG_SCH с ключом = id работы из data.js:
//   note — пояснение в шапке блока; sheets — подписи двух половин панели; spec — строки на тёмной половине;
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
  const G = {
    // пожарная автоцистерна: пятиугольник острием по ходу, овал — цистерна
    ac: (n = '') => `<path d="M0-20H52L70 0 52 20H0Z"/><ellipse cx="27" rx="17" ry="10"/>${n ? `<text x="27" y="3.6" class="sx-ac-t">${n}</text>` : ''}`,
    pg: () => '<circle r="9"/><path d="M0-9A9 9 0 0 1 0 9Z"/>',       // пожарный гидрант
    rs: () => '<circle r="10"/><path d="M-3.5 3.5L3.5-3.5"/>',         // сухотрубный стояк
    dr: () => '<path d="M0-20L12 0 0 20-12 0Z"/><circle r="5"/>',      // дренчерный ороситель
    st: L => `<path d="M0 0H${L - 34}"/><path d="M${L - 44}-7L${L - 22} 0 ${L - 44} 7Z" class="sx-f"/><circle cx="${L - 17}" r="5" class="sx-f"/><circle cx="${L - 6}" r="5" class="sx-f"/>`, // ствол на рабочей линии
    arw: () => '<path d="M0-8H86L80-22 122 0 80 22 86 8H0L11 0Z" class="sx-f"/>',                                   // решающее направление
    fl: () => '<path d="M0 0V-46"/><path d="M0-46H30V-27H0Z" class="sx-r"/><circle r="3.5" class="sx-r"/>',          // место возникновения пожара
    pb: n => `<circle r="19"/><text y="4.6" class="sx-pb-t">ПБ</text><text x="24" y="-13" class="sx-pb-n">${n}</text>`, // пост безопасности ГДЗС
    sh: () => '<path d="M0 18V-20H26V-2H0"/><path d="M-9 18H9L0 3Z"/><text x="13" y="-6.6" class="sx-pb-t">Ш</text>',   // оперативный штаб
  };
  const fade = (a, s) => `<g class="sx-fade" style="--a:${a}s">${s}</g>`;
  const pop = (x, y, kind, a, ...args) => at(x, y, `<g class="sx-${kind} sx-pop" style="--a:${a}s">${G[kind](...args)}</g>`);
  // подпись дробью: номер над линией, сеть под линией
  const frac = (x, y, a, b) => tx(x, y - 34, a, 'sx-t sx-c') + `<path d="M${x - 19} ${y - 29.5}h38" class="sx-tl"/>` + tx(x, y - 17, b, 'sx-t sx-c');
  const STEP = 300, LOOP = 2.8, TAIL = 44;   // шаг сигналов, время круга и длина хвоста — те же числа в .sx-sg path
  // рисуемая линия: длина нормирована; a — когда начать, z — сколько рисовать
  const ln = (d, cls, a, z = .6) => `<path d="${d}" pathLength="1" class="sx-dw ${cls}" style="--a:${a}s;--z:${z}s"/>`;
  // сигнал: голова и хвост с общим концом. Штрихи считаются от начала маршрута,
  // поэтому на общем участке совпадают и расходятся на развилке
  const sig = d => `<path d="${d}" class="sx-sg-t"/><path d="${d}" class="sx-sg-h"/>`;

  // знаки для карточек под схемой
  const ICON = {
    wa: `<svg viewBox="-12 -12 24 24" class="sx-pg">${G.pg()}</svg>`,
    ac: `<svg viewBox="-2 -22 74 44" class="sx-ac">${G.ac()}</svg>`,
    ho: `<svg viewBox="0 0 64 32" class="sx-ic-h"><path d="M0 26H32M32 26V10M12 10H52M12 10V2M32 10V2M52 10V2"/></svg>`,
    st: `<svg viewBox="0 -14 64 28" class="sx-st">${G.st(64)}</svg>`,
    dr: `<svg viewBox="-14 -22 28 44" class="sx-dr">${G.dr()}</svg>`,
  };

  // ── ДГУ ──
  // Сухотруб снят с листа координатами чертежа (ox, oy) и отзеркален, чтобы головки смотрели на технику; стояк укорочен: схема без масштаба.
  const K = .9, AX = ox => +(1417.5 - K * ox).toFixed(1), AY = oy => +(120 + K * (oy - 108.3)).toFixed(1);
  const Y1 = 600, Y2 = 636;                                       // уровни соединительных головок = уровни рукавов
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
  // подпись вдоль трубы: посередине отрезка, со сдвигом по нормали
  const along = ([x0, y0], [x1, y1], dx, dy, deg, t) => tx(0, 0, t, 'sx-t', `transform="translate(${(x0 + x1) / 2 + dx} ${(y0 + y1) / 2 + dy}) rotate(${deg})" text-anchor="middle"`);

  // рукава от автоцистерн
  const main = 'M162 636H226Q246 636 246 616V592';                // АЦ-4 → разветвление
  const LINES = [[216, 248], [246, 316], [276, 384]].map(([x, y]) => [`V${y + 20}Q${x} ${y} ${x + 20} ${y}H420`, x, y]);  // три линии к стоякам
  const hose3 = `M876 ${Y2}H${riser}`, hose2 = `M725 616V612Q725 ${Y1} 737 ${Y1}H${link}V${Y2}`;

  const art = `
    <rect x="0" y="548" width="${SPLIT}" height="${H - 548}" class="sx-road"/>
    ${fade(.1, tx(36, 576, 'Проезд', 'sx-t sx-t--g'))}
    <g data-l="zone">
      <rect x="640" y="186" width="${SPLIT - 640}" height="362" class="sx-room"/>
      <rect x="640" y="186" width="${SPLIT - 640}" height="362" fill="url(#sx-hatch)"/>
      <path d="M640 548V186H${SPLIT}M640 548H${SPLIT}" class="sx-wall"/>
      ${fade(1.8, tx(660, 214, 'Помещение ДГУ', 'sx-t sx-t--r'))}
      ${pop(806, 400, 'fl', 1.9)}
      ${fade(2, tx(844, 374, 'Очаг', 'sx-t sx-t--r'))}
    </g>
    <path d="M0 548H640" class="sx-curb"/>
    <g data-l="dr">${[700, 788, 876].map((x, i) => pop(x, 280, 'dr', 2 + i * .1)).join('')}</g>
    <g data-l="wa">
      ${pop(60, 636, 'pg', .1)}${pop(540, 636, 'pg', .2)}
      ${fade(.2, frac(60, 636, 'ПГ-2', 'К-400') + frac(540, 636, 'ПГ-1', 'К-400') + '<path d="M69 636H92M549 636H572" class="sx-h"/>')}
    </g>
    <g data-l="ac">${[[92, 'АЦ-4'], [572, 'АЦ-1'], [690, 'АЦ-2'], [806, 'АЦ-3']].map(([x, n], i) => pop(x, 636, 'ac', .25 + i * .08, n)).join('')}</g>
    <g data-l="ho">
      ${ln(main, 'sx-h', .6, .35)}
      <path d="M216 592H276" class="sx-h sx-comb sx-pop" style="--a:.9s"/>
      ${LINES.map(([d, x], i) => ln(`M${x} 592${d}`, 'sx-h', .95 + i * .1, .7)).join('')}
      <path d="M642 636H690" class="sx-h sx-dash sx-pop" style="--a:.7s"/>
      ${fade(1, tx(292, 592, 'DN 80 · N 3', 'sx-t') + tx(292, 609, 'Q 12 л/с', 'sx-t'))}
      ${fade(1, tx(772, 590, 'DN 80 · N 1 · Q 15 л/с', 'sx-t'))}
      ${ln(`M725 616V612Q725 ${Y1} 737 ${Y1}H${SPLIT}`, 'sx-h', .7, .4)}
      ${ln(`M876 ${Y2}H${SPLIT}`, 'sx-h', .75, .25)}
      ${ln(`M${SPLIT} ${Y1}H${head}`, 'sx-hd', 1.1, .15)}${ln(`M${SPLIT} ${Y2}H${head}`, 'sx-hd', 1, .15)}
    </g>
    <g data-l="st">
      ${LINES.map(([, , y], i) => pop(430, y, 'rs', 1.6 + i * .1) + pop(440, y, 'st', 1.7 + i * .1, 200) + fade(1.8 + i * .1, halo(460, y - 12, 'РСКУ-50А · Q 4 л/с', 'sx-t'))).join('')}
    </g>
    <g data-l="zone">
      ${pop(494, 470, 'arw', 2.1)}
      ${fade(2.2, halo(494, 436, 'Решающее направление', 'sx-t'))}
    </g>
    <g data-l="zone">${pop(372, 636, 'pb', .4, '3')}${pop(452, 636, 'sh', .45)}
      ${fade(.6, tx(372, 674, 'Посты ГДЗС', 'sx-t sx-c') + tx(458, 674, 'Штаб', 'sx-t sx-c'))}
    </g>
    <g data-l="dr">
      ${ln(`M${vEnd} ${Y2}H${riser}V${top}`, 'sx-p', 1.2, .5)}
      ${ln(`M${vEnd} ${Y1}H${link}V${Y2}`, 'sx-p', 1.2, .25)}
      ${ln(`M${riser} ${top}L${far[0]} ${far[1]}`, 'sx-p', 1.7, .55)}
      ${ln(`M${far[0]} ${far[1]}L${b1[0]} ${b1[1]}V${b1[1] + drop}`, 'sx-p sx-p--t', 2.25, .65)}
      ${ln(`M${j2[0]} ${j2[1]}L${b2[0]} ${b2[1]}V${b2[1] + drop}`, 'sx-p sx-p--t', 2.05, .55)}
      ${ln(`M${j3[0]} ${j3[1]}L${b3[0]} ${b3[1]}V${b3[1] + drop}`, 'sx-p sx-p--t', 1.85, .55)}
      <g class="sx-hang sx-pop" style="--a:2.7s">${HANG.map(hang).join('')}<path d="${clamp(top + 14)}${clamp((top + Y2) / 2)}${clamp(Y2 - 14)}"/></g>
      <g class="sx-valve sx-pop" style="--a:1s">
        ${[Y1, Y2].map(y => `<path d="M${valve} ${y - 13}v26M${valve + 4} ${y - 13}v26M${valve + 4} ${y}l14-12v24z"/><path d="M${valve + 32} ${y - 12}v24l-14-12z" class="sx-fw"/><path d="M${head + 6} ${y - 10}h-6v20h6M${head + 6} ${y}H${valve}"/>`).join('')}
      </g>
      ${[b1, b2, b3].map(([x, y], i) => pop(x, y + drop + DRY, 'dr', 2.7 + i * .1)).join('')}
      <g class="sx-w sx-fade" style="--a:2.8s">
        ${along(b1, far, -17, 17, 45, 'Ду 50 · L 6000')}${along(b2, j2, -17, 17, 45, 'Ду 50 · L 4500')}${along(b3, j3, -17, 17, 45, 'Ду 50 · L 4500')}
        ${along(far, j2, 17, 17, -45, 'Ду 80 · L 6000')}${along(j2, j3, 17, 17, -45, 'Ду 80 · L 5000')}
        ${along([riser, top], [riser, Y2], 24, 0, -90, 'Ду 80 · H 6200')}
        ${tx(972, 668, 'Соединительные головки Ду 80', 'sx-t')}
      </g>
    </g>`;

  // маршруты от АЦ-3 к оросителям; длина нужна, чтобы кольцо срабатывания попало в момент прихода сигнала
  const LEAF = [[far, b1], [j2, b2], [j3, b3]].map(([j, b]) => [[876, Y2], [riser, Y2], [riser, top], j, b, [b[0], b[1] + drop]]);
  const walk = p => `M${p[0]}${p.slice(1).map(q => 'L' + q).join('')}`;
  const dist = p => p.slice(1).reduce((t, q, i) => t + Math.hypot(q[0] - p[i][0], q[1] - p[i][1]), 0);
  const arrive = p => ((dist(p) - TAIL) % STEP) / STEP * LOOP;
  // порядок: ближняя ветвь срабатывает первой; у каждого оросителя на трубе — пара в помещении
  const rings = [2, 1, 0].map((n, i) => { const b = [b1, b2, b3][n], a = arrive(LEAF[n]).toFixed(2);
    return `<circle cx="${b[0]}" cy="${b[1] + drop + DRY}" r="30" class="sx-ring sx-ring--w" style="--a:${a}s"/><circle cx="${[700, 788, 876][i]}" cy="280" r="30" class="sx-ring" style="--a:${a}s"/>`; }).join('');

  // красные сигналы — на рукавах, белые — на трубе: обе группы обрезаны по соединительным головкам
  const run = `<defs>
      <clipPath id="sx-hose"><rect x="0" y="560" width="${head}" height="140"/><rect x="0" y="0" width="${SPLIT}" height="560"/></clipPath>
      <clipPath id="sx-pipe"><rect x="${head}" y="0" width="${W - head}" height="${H}"/><rect x="${SPLIT}" y="0" width="${head - SPLIT}" height="560"/></clipPath>
    </defs>
    <g class="sx-sg sx-sg--r" data-l="ho" clip-path="url(#sx-hose)">
      ${LINES.map(([d, x]) => sig(`${main}H${x}${d.replace('H420', 'H606')}`)).join('')}
      ${sig(hose2)}${sig(hose3)}${sig('M642 636H690')}
    </g>
    <g class="sx-sg sx-sg--w" data-l="dr" clip-path="url(#sx-pipe)">
      ${LEAF.map(p => sig(walk(p))).join('')}${sig(hose2)}
    </g>
    <g class="sx-sg" data-l="dr">${rings}</g>`;

  window.OG_SCH = {
    W, H, SPLIT, veil, ICON,
    dgu: {
      note: 'Оставили рабочий слой: технику, рукавные линии, трубопровод и&nbsp;расчётные значения. Планировку и&nbsp;адрес закрыли, полный комплект листов получает только заказчик.',
      sheets: [
        { t: 'Расстановка сил и&nbsp;средств', s: 'Тушение в&nbsp;помещении ДГУ, первая пенная атака', l: 'Лист 04' },
        { t: 'Сухотруб к&nbsp;оросителям', s: 'Аксонометрическая схема', l: 'Лист 07' },
      ],
      veil: { seed: 7, w: SPLIT, h: 548, cut: [[640, 186, SPLIT - 640, 362]] },
      art, run,
      spec: [['Труба Ду 80', '17,2 м'], ['Труба Ду 50', '15 м'], ['Обратные клапаны', '2'], ['Подвесы и крепления', '17']],
      keys: [
        { k: 'wa', i: 'wa', b: '2', t: 'пожарных гидранта на&nbsp;кольцевой сети К-400' },
        { k: 'ac', i: 'ac', b: '4', t: 'автоцистерны в&nbsp;расстановке на&nbsp;проезде' },
        { k: 'ho', i: 'ho', b: '12 + 15', u: 'л/с', t: 'подача по&nbsp;магистральным линиям DN&nbsp;80' },
        { k: 'st', i: 'st', b: '3', t: 'ствола РСКУ-50А через сухотрубные стояки' },
        { k: 'dr', i: 'dr', b: '3', t: 'дренчерных оросителя с&nbsp;водопенными насадками' },
      ],
    },
  };
})();
