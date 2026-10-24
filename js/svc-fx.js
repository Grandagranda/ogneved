// Блок «Услуги»: сцены поверх картинок карточек — проигрываются при наведении, у каждой услуги свой приём.
// Язык — как у первого экрана: красные линии-«чертёж», пульсы. Без подписей — только графика.
// Координаты — пиксели карточки из макета 459×518 (Figma 2031:1164, «Карточка услуги»); видимая часть картинки — до y ≈ 283.
(function () {
  const W = 459, H = 518;
  const at = (x, y) => `left:${(x / W * 100).toFixed(3)}%;top:${(y / H * 100).toFixed(3)}%`;
  const poly = a => 'M' + a.map(p => p.join(',')).join('L') + 'Z';
  // проблесковый маячок на крыше АЦ: синий и красный ореолы мигают по очереди
  const beacon = (x, y, rx, ry) => `<g class="bcn"><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" class="bcn-b"/><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" class="bcn-r"/></g>`;
  // световой импульс по рукаву: яркая голова и тающий хвост (три штриха с общим концом)
  const comet = (d, o = 0) => `<g class="cm" style="--o:${o}">${[[54, 't'], [28, 'm'], [10, 'h']].map(([L, k]) => `<path d="${d}" class="cm-${k}" style="--L:${L}"/>`).join('')}</g>`;

  // 01 · проезды: путь машины от въезда прорисовывается полосой, по нему едет метка АЦ; у манёвра — радиус разворота
  const ROUTE = 'M108,300C160,276 260,228 315,202C345,188 362,170 361,150';
  const TURN = 'M108,300C160,278 213,245 213,218C213,195 180,172 139,161';
  const opp = {
    svg: `<path d="${ROUTE}" class="o-band" pathLength="1"/><path d="${ROUTE}" class="o-route" pathLength="1"/>
      <path d="${TURN}" class="o-turn" pathLength="1"/>
      <path d="M213,218L171,226" class="o-rad" pathLength="1"/><circle cx="171" cy="226" r="2.6" class="o-c"/><circle cx="213" cy="218" r="4.5" class="fx-dot" style="--d:1.5s"/>
      <g class="o-car" style="offset-path:path('${ROUTE}')"><rect x="-13" y="-6.5" width="26" height="13" rx="3"/><path d="M5,-3.5L10,0L5,3.5"/></g>
      <ellipse cx="338" cy="162" rx="40" ry="20" class="fx-ring" style="--d:2.6s"/>`,
    html: '',
  };

  // 02 · план тушения: рукава прочерчиваются схемой, по ним идут сигналы — от гидранта к АЦ и от АЦ в здание
  const H1 = 'M66,236C90,239 125,231 165,231S228,229 250,212S270,186 275,179';
  const H2 = 'M293,142C270,142 250,138 249,129C249,121 278,115 290,104S299,94 302,90';
  const ptp = {
    svg: `<path d="${H1}" class="p-plan" pathLength="1"/><path d="${H2}" class="p-plan" pathLength="1" style="--d:.55s"/>
      ${comet(H1)}${comet(H2, -210)}
      <ellipse cx="62" cy="249" rx="16" ry="8" class="fx-ring" style="--d:.2s"/><circle cx="62" cy="236" r="4.5" class="fx-dot" style="--d:.15s"/>
      ${beacon(318, 140, 16, 7)}`,
    html: '',
  };

  // 03 · расход воды: резервуар обведён по силуэту (прямые образующие + днища), уровень поднимается ровной плоскостью, отметка идёт по шкале
  const TANK = 'M139,91L281,37C319,24 340,106 311,138L158,203C112,220 92,108 139,91Z';
  let wave = 'M20,106'; for (let x = 20; x < 440; x += 30) wave += 'q7.5,-3 15,0t15,0';
  let ticks = ''; for (let k = 0; k <= 10; k++) { const y = 205 - k * 11.3; ticks += `M${k % 5 ? 82 : 78},${y.toFixed(1)}H88`; }
  const voda = {
    svg: `<defs><clipPath id="fx-tank"><path d="${TANK}"/></clipPath></defs>
      <path d="${TANK}" class="v-out" pathLength="1"/>
      <g clip-path="url(#fx-tank)"><g class="v-lvl"><g transform="rotate(-21.3 220 120)">
        <rect x="20" y="106" width="420" height="240" class="v-fill"/><path d="${wave}" class="v-wave"/></g></g></g>
      <path d="M88,205V92" class="v-sc" pathLength="1"/><path d="${ticks}" class="v-tk"/>
      <path d="M90,205l7,-4.5v9z" class="v-mk"/>`,
    html: '',
  };

  // 04 · дислокация: тревога в депо — мигает маячок на крыше АЦ
  const disl = {
    svg: beacon(88, 178, 20, 9),
    html: '',
  };

  // 05 · численность: под каждым бойцом по очереди загорается отметка на земле, их связывает строй к АЦ, отсеки с оборудованием подсвечиваются
  const FEET = [[291, 243], [333, 214], [377, 220], [403, 247]];
  const BAYS = [[[222, 112], [262, 97], [262, 133], [222, 148]], [[317, 61], [349, 49], [349, 110], [317, 123]]];
  const LINK = 'M252,214C268,224 280,240 291,243S320,218 333,214S364,216 377,220S396,240 403,247';
  const chisl = {
    svg: `<path d="${LINK}" class="c-link" pathLength="1"/>` +
      FEET.map(([x, y], i) => `<g class="c-pt" style="--i:${i}"><ellipse cx="${x}" cy="${y}" rx="15" ry="6" class="c-ring"/><ellipse cx="${x}" cy="${y}" rx="15" ry="6" class="c-fill"/></g>`).join('') +
      BAYS.map((b, i) => `<path d="${poly(b)}" class="c-bay" style="--i:${i}"/>`).join(''),
    html: '',
  };

  // 06 · силы и средства: схема расстановки — узлы у насоса АЦ, у ствольщика и у сухотруба, прямые связи пунктиром,
  //    сектор действия ствола на полу склада; стрелка манометра выходит на рабочее давление
  const SECT = 'M292,212L230,176Q242,150 268,148Z';
  const sily = {
    svg: `<path d="${SECT}" class="s-sec"/><path d="${SECT}" class="s-sec-o" pathLength="1"/>
      <path d="M255,191Q262,175 278,174" class="s-arc" pathLength="1"/>
      <path d="M232,262L292,212" class="s-ln"/><path d="M232,262L358,238" class="s-ln" style="--d:.45s"/>
      <ellipse cx="232" cy="262" rx="14" ry="6" class="fx-ring" style="--d:.1s"/>
      <circle cx="232" cy="262" r="4" class="fx-dot" style="--d:.1s"/><circle cx="292" cy="212" r="4" class="fx-dot" style="--d:.75s"/><circle cx="358" cy="238" r="4" class="fx-dot" style="--d:.95s"/>`,
    html: `<span class="s-gauge" style="${at(392, 78)}"><svg viewBox="0 0 60 60" aria-hidden="true"><circle cx="30" cy="30" r="25" class="g-bg"/>
        <path d="M12.3,47.7A25,25 0 1,1 47.7,47.7" class="g-tr"/><path d="M12.3,47.7A25,25 0 1,1 47.7,47.7" class="g-on" pathLength="1"/>
        <path d="M30,30L30,11" class="g-nd"/><circle cx="30" cy="30" r="2.6" class="g-hub"/></svg></span>`,
  };

  window.OG_FX = { opp, ptp, voda, dislokaciya: disl, chislennost: chisl, sily, W, H };
})();
