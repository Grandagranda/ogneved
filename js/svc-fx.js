// Блок «Услуги»: сцены поверх картинок карточек — проигрываются при наведении, у каждой услуги свой приём.
// Язык — как у первого экрана: красные линии-«чертёж», пульсы. Без подписей — только графика.
// Координаты — пиксели карточки из макета 459×518 (Figma, Page 1, «Карточка услуги — …», 26.10.2026); видимая часть картинки — до y ≈ 283.
(function () {
  const W = 459, H = 518;
  // плавная кривая через точки (Catmull-Rom → кубические Безье): рукава и маршруты снимались по точкам с картинки
  const spline = P => {
    let d = `M${P[0].join(',')}`;
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[i - 1] || P[i], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2] || p2;
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += `C${[c1, c2, p2].map(p => p.map(v => +v.toFixed(1)).join(',')).join(' ')}`;
    }
    return d;
  };
  // проблесковый маячок на крыше АЦ: синий и красный ореолы мигают по очереди; a — наклон балки, --bd — сдвиг по времени
  const beacon = (x, y, rx, ry, a = 0, bd = 0) => `<g class="bcn" style="--bd:${bd}s" transform="rotate(${a} ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" class="bcn-b"/><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" class="bcn-r"/></g>`;
  // световой импульс по рукаву: яркая голова и тающий хвост (три штриха с общим концом)
  const comet = (d, o = 0, t = .9) => `<g class="cm" style="--o:${o};--t:${t}s">${[[54, 't'], [28, 'm'], [10, 'h']].map(([L, k]) => `<path d="${d}" class="cm-${k}" style="--L:${L}"/>`).join('')}</g>`;

  // 01 · проезды и подъезды: выносные опоры встают на площадку, луч идёт по стреле автолестницы к люльке,
  //    кромка перекрытия, до которого она дотянулась, прочерчивается по фасаду
  const REACH = 'M66,162L262,71';
  const SLAB = 'M241.5,90L336,118.8L403,96.8';
  const opp = `<path d="${SLAB}" class="o-slab"/><path d="${SLAB}" class="o-floor" pathLength="1"/>
      <path d="${REACH}" class="o-reach" pathLength="1"/>
      <circle cx="47" cy="218.5" r="3.2" class="fx-dot" style="--d:.15s"/><circle cx="94" cy="242.5" r="3.2" class="fx-dot" style="--d:.3s"/><circle cx="118" cy="183" r="3.2" class="fx-dot" style="--d:.45s"/>
      <circle cx="272" cy="75" r="16" class="fx-ring" style="--d:1.3s"/><circle cx="262" cy="72" r="4.2" class="fx-dot" style="--d:1.25s"/>`;

  // 02 · дислокация: тревога в части — маячок на АЦ, маршрут от ворот по улице к горящему дому прорисовывается,
  //    по нему едет метка АЦ; у очага — пульс
  const ROUTE = spline([[352, 176], [338, 184], [318, 177], [284, 164], [250, 151.5], [218, 140], [192, 131]]);
  const disl = `<path d="${ROUTE}" class="o-band" pathLength="1"/><path d="${ROUTE}" class="o-route" pathLength="1"/>
      <g class="o-car" style="offset-path:path('${ROUTE}')"><rect x="-11" y="-5.5" width="22" height="11" rx="3"/><path d="M4,-3L8.5,0L4,3"/></g>
      ${beacon(356, 161, 10, 4.5, -18)}
      <circle cx="192" cy="131" r="4.2" class="fx-dot" style="--d:1.9s"/><circle cx="116" cy="118" r="20" class="fx-ring" style="--d:2s"/>`;

  // 03 · план тушения: рукавная линия ложится на план пунктиром от АЦ к стволу, стрелка — направление подачи ствола на очаг;
  //    очаг отмечен на земле, на АЦ — маячок
  const HOSE3 = spline([[60.7, 144.2], [58.2, 159.4], [40.4, 169.6], [30.7, 179.8], [35.3, 190], [53.1, 198.9], [70.9, 203.5], [88.7, 202.7], [104, 196.3], [119.3, 184.9], [126.9, 177.3], [133.3, 174.7], [144, 175.5]]);
  const ptp = `<defs><mask id="fx-ptp" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><path d="${HOSE3}" class="p-rev" pathLength="1"/></mask></defs>
      <path d="${HOSE3}" class="p-plan" mask="url(#fx-ptp)"/>
      <path d="M152,178L222,200" class="p-dir" pathLength="1"/><path d="M213.5,192.5L223,200.3L211,203.4" class="p-hd" pathLength="1"/>
      <ellipse cx="252" cy="226" rx="28" ry="9" class="fx-ring" style="--d:1.6s"/>
      <circle cx="60.7" cy="144.2" r="3.6" class="fx-dot" style="--d:.15s"/><circle cx="144" cy="175.5" r="3.6" class="fx-dot" style="--d:1.15s"/>
      ${beacon(141, 71.6, 10, 4, 18)}`;

  // 04 · расход воды: площадка вокруг колодца гидранта «просвечивает» — под дырой колодца лежит резервуар (разрез грунта штриховкой);
  //    он наполняется водой с волной, по стояку вода поднимается в гидрант и импульсами идёт по рукавам в АЦ и к стволу.
  //    Резервуар — цилиндр вдоль оси b (правая кромка площадки), торцы — в плоскости (a, вертикаль); ближний торец — левый
  const HOSE_A = spline([[182, 201], [155, 199], [124, 191], [114, 177], [121, 163], [147, 146], [175, 134], [195, 123], [210, 113], [219.5, 101], [219.5, 91], [211, 80.5], [197, 72]]);
  const HOSE_B = spline([[196, 75], [208.6, 83], [217.5, 94], [215.5, 106], [203, 117], [189.5, 128], [181.6, 142], [180.7, 153], [186.8, 161.6], [204.5, 168.4], [226, 170], [246, 170], [247.5, 180], [253.6, 189.6], [272.7, 195.7], [288, 187.5], [300, 174.5], [308, 169]]);
  const WELL = [197.6, 233], TC = [197.6, 259], R = 10, HL = 36;
  const ax = [.781, .625], bx = [.958, -.287];
  const add = (p, q, k = 1) => [p[0] + q[0] * k, p[1] + q[1] * k].map(v => +v.toFixed(1));
  const TN = add(TC, bx, -HL), TF = add(TC, bx, HL);
  const cap = c => { let d = ''; for (let i = 0; i <= 36; i++) { const t = i / 36 * Math.PI * 2, p = add(add(c, ax, R * Math.cos(t)), [0, 1], R * Math.sin(t)); d += (i ? 'L' : 'M') + p.join(','); } return d + 'Z'; };
  const o1 = [-.509 * R, -1.165 * R], o2 = [.509 * R, 1.165 * R];
  const BODY = `M${add(TN, o1)}L${add(TF, o1)}L${add(TF, o2)}L${add(TN, o2)}Z`;
  const SIDES = `M${add(TN, o1)}L${add(TF, o1)}M${add(TN, o2)}L${add(TF, o2)}`;
  const RISER = `M${WELL[0]},${(TC[1] - 1.1 * R).toFixed(1)}V${WELL[1]}`;
  let wave = 'M120,250'; for (let x = 120; x < 280; x += 20) wave += 'q5,-2 10,0t10,0';
  const voda = `<defs><pattern id="fx-earth" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0,0V5" class="v-ht"/></pattern>
        <radialGradient id="fx-pit-g" cx="${TC[0]}" cy="${TC[1] - 4}" r="62" gradientTransform="translate(${TC[0]} ${TC[1]}) scale(1.25 .7) translate(${-TC[0]} ${-TC[1]})" gradientUnits="userSpaceOnUse"><stop offset=".55" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
        <mask id="fx-pit" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="url(#fx-pit-g)"/>
          <ellipse cx="${WELL[0]}" cy="${WELL[1] - 1}" rx="25" ry="11.5" fill="#000"/><path d="M190,192H207V${WELL[1]}H190Z" fill="#000"/></mask>
        <clipPath id="fx-tank"><path d="${BODY}"/><path d="${cap(TN)}"/><path d="${cap(TF)}"/></clipPath></defs>
      <g class="v-pit" mask="url(#fx-pit)"><rect x="100" y="200" width="200" height="100" class="v-veil"/><rect x="100" y="200" width="200" height="100" class="v-soil"/></g>
      <path d="${cap(TF)}" class="v-back" pathLength="1"/>
      <g clip-path="url(#fx-tank)"><g transform="skewY(-16.7)"><g class="v-lvl"><rect x="120" y="315" width="160" height="40" class="v-fill"/><path d="${wave.replace('M120,250', 'M120,315')}" class="v-wave"/></g></g></g>
      <path d="${SIDES}" class="v-out" pathLength="1"/><path d="${cap(TN)}" class="v-out" pathLength="1" style="--d:.55s"/>
      <path d="${RISER}" class="v-pipe" pathLength="1"/>
      ${comet(RISER + 'L197.6,212L182,201', 0, 2.3)}${comet(HOSE_A, -40, 2.5)}${comet(HOSE_B, -100, 2.8)}`;

  // 05 · силы и средства: на стене — манометр, стрелка выходит на рабочее давление; на чертеже под рукой инженера —
  //    схема расстановки: контур здания, позиции АЦ, по рукавным линиям к стволам бежит поток.
  //    Точки схемы — в координатах листа (s — вдоль нижней кромки, t — вглубь)
  const A = [127.3, 191.8], U = [74.5, 36.4], V = [52.7, -27.3];
  const sh = (s, t) => [A[0] + s * U[0] + t * V[0], A[1] + s * U[1] + t * V[1]].map(v => +v.toFixed(1));
  const pl = (pts, z) => 'M' + pts.map(p => sh(...p).join(',')).join('L') + (z ? 'Z' : '');
  const BLD = pl([[.46, .1], [.88, .1], [.88, .52], [.46, .52]], 1);
  const T1 = sh(.12, .16), T2 = sh(.16, .48), N1 = sh(.46, .2), N2 = sh(.46, .44);
  const G = [338, 66];
  const ARC = `M${G[0] - 11.3},${G[1] + 11.3}A16,16 0 1,1 ${G[0] + 11.3},${G[1] + 11.3}`;
  let tk = ''; for (let k = 0; k <= 6; k++) { const t = (135 + k * 45) * Math.PI / 180; tk += `M${add(G, [Math.cos(t), Math.sin(t)], 19.5)}L${add(G, [Math.cos(t), Math.sin(t)], 22)}`; }
  const sily = `<path d="${BLD}" class="s-bld"/><path d="${BLD}" class="s-bld-o" pathLength="1"/>
      <path d="${pl([[.67, .1], [.67, .52]])}" class="s-in" pathLength="1"/><path d="${pl([[.46, .31], [.67, .31]])}" class="s-in" pathLength="1" style="--d:.75s"/>
      <path d="M${T1}L${N1}" class="s-ln" style="--d:1s"/><path d="M${T2}L${N2}" class="s-ln" style="--d:1.2s"/>
      <rect x="-5" y="-2.6" width="10" height="5.2" rx="1.2" class="s-car" transform="translate(${T1}) rotate(26)" style="--d:.8s"/><rect x="-5" y="-2.6" width="10" height="5.2" rx="1.2" class="s-car" transform="translate(${T2}) rotate(26)" style="--d:.95s"/>
      <circle cx="${N1[0]}" cy="${N1[1]}" r="2.6" class="fx-dot" style="--d:1.5s"/><circle cx="${N2[0]}" cy="${N2[1]}" r="2.6" class="fx-dot" style="--d:1.7s"/>
      <circle cx="${sh(.78, .38)[0]}" cy="${sh(.78, .38)[1]}" r="7" class="fx-ring" style="--d:1.9s"/>
      <g class="s-gauge"><circle cx="${G[0]}" cy="${G[1]}" r="27" class="g-bg"/><path d="${tk}" class="g-tk"/><path d="${ARC}" class="g-tr"/><path d="${ARC}" class="g-on" pathLength="1"/>
        <path d="M${G[0]},${G[1]}V${G[1] - 14}" class="g-nd"/><circle cx="${G[0]}" cy="${G[1]}" r="2.6" class="g-hub"/></g>`;

  // 06 · численность и оснащённость — боевой расчёт: боксы с техникой обводятся по очереди, от каждой группы бойцов
  //    к её машине протягивается линия на полу, и на машине включается маячок
  const BAYS = [[[71, 0], [161.6, 16.3], [161.6, 127], [71, 90.7]], [[185.1, 30.8], [288.5, 68.9], [288.5, 181.4], [185.1, 139.6]], [[313.9, 67.1], [419.1, 108.8], [419.1, 232.4], [313.9, 190.4]]];
  const CREW = ['M86,160C95,145 104,129 113,114', 'M244,229C240,206 236,182 232,162', 'M268,238C296,236 328,226 350,216'];
  const chisl = BAYS.map((b, i) => `<path d="M${b.join('L')}Z" class="c-bay" pathLength="1" style="--d:${(.15 + i * .55).toFixed(2)}s"/>`).join('') +
      CREW.map((d, i) => `<path d="${d}" class="c-go" style="--d:${(.55 + i * .55).toFixed(2)}s"/><circle cx="${d.split(' ').pop().split(',')[0]}" cy="${d.split(',').pop()}" r="3.4" class="fx-dot" style="--d:${(.95 + i * .55).toFixed(2)}s"/>`).join('') +
      beacon(114.7, 39.5, 12, 4.2, 17.7, .9) + beacon(247.2, 80.4, 13, 4.4, 19, 1.45);

  window.OG_FX = { opp, ptp, voda, dislokaciya: disl, chislennost: chisl, sily, W, H };
})();
