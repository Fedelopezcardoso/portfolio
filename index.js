/* ============================================================
   PORTFOLIO JS — Federico Lopez
   - Navbar: scroll effect + active section highlight
   - Mobile menu toggle
   - 3D Tilt effect on portfolio cards (vanilla, no deps)
   - ScrollReveal animations
   ============================================================ */

// ========================
// NAVBAR
// ========================
const navbar  = document.getElementById('navbar');
const menuBtn = document.getElementById('menu-toggle');
const navLinks = document.getElementById('navbar-links');
const sections = document.querySelectorAll('section');

// Scroll: add .scrolled class + update background
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Mobile menu toggle
if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('visible');
    const icon = menuBtn.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-times');
    }
  });

  // Close menu when a link is clicked
  navLinks.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      navLinks.classList.remove('visible');
      const icon = menuBtn.querySelector('i');
      if (icon) {
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
      }
    }
  });
}

// ========================
// ACTIVE NAV LINK (Intersection Observer)
// ========================
const observerConfig = {
  rootMargin: '-30% 0px -60% 0px',
  threshold: 0,
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      const currentActive = document.querySelector('.navbar__link.active');
      const shouldBeActive = document.querySelector(`.navbar__link[data-ref="${id}"]`);
      if (currentActive) currentActive.classList.remove('active');
      if (shouldBeActive) shouldBeActive.classList.add('active');
    }
  });
}, observerConfig);

sections.forEach((section) => sectionObserver.observe(section));

// ========================
// 3D CARD TILT EFFECT
// ========================
function initCardTilt() {
  const cards = document.querySelectorAll('.card-3d');

  cards.forEach((card) => {
    const inner = card.querySelector('.card-3d__inner');
    const shine = card.querySelector('.card-3d__shine');

    if (!inner) return;

    let rafId = null;
    let isHovered = false;

    card.addEventListener('mouseenter', () => {
      isHovered = true;
      // Fast response on enter
      inner.style.transition = 'transform 0.1s ease, border-color 0.3s ease, box-shadow 0.3s ease';
    });

    card.addEventListener('mousemove', (e) => {
      if (!isHovered) return;

      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const halfW = rect.width  / 2;
        const halfH = rect.height / 2;

        // Tilt angles (max ±14 degrees)
        const tiltY =  ((x - halfW) / halfW) * 14;
        const tiltX = -((y - halfH) / halfH) * 14;

        inner.style.transform = `
          perspective(1200px)
          rotateX(${tiltX}deg)
          rotateY(${tiltY}deg)
          scale3d(1.025, 1.025, 1.025)
        `;

        // Shine position (CSS custom properties)
        if (shine) {
          const mx = ((x / rect.width)  * 100).toFixed(1);
          const my = ((y / rect.height) * 100).toFixed(1);
          shine.style.setProperty('--mx', `${mx}%`);
          shine.style.setProperty('--my', `${my}%`);
        }
      });
    });

    card.addEventListener('mouseleave', () => {
      isHovered = false;
      if (rafId) cancelAnimationFrame(rafId);

      // Smooth return to flat
      inner.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), border-color 0.3s ease, box-shadow 0.3s ease';
      inner.style.transform  = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

// ========================
// SCROLL REVEAL
// ========================
function initScrollReveal() {
  if (typeof ScrollReveal === 'undefined') return;

  const sr = ScrollReveal({
    origin: 'bottom',
    distance: '30px',
    duration: 700,
    delay: 0,
    easing: 'cubic-bezier(0.5, 0, 0, 1)',
    reset: false,
  });

  sr.reveal('.home__description', { delay: 200, origin: 'bottom' });
  sr.reveal('.section__title',    { delay: 100 });
  sr.reveal('.section__subtitle', { delay: 180 });
  sr.reveal('.about__description',{ delay: 150 });
  sr.reveal('.button--cta',       { delay: 250 });
  sr.reveal('.skill__title',      { delay: 100 });
  sr.reveal('.skill__item',       { delay: 100, interval: 60 });
  sr.reveal('.services__item',    { delay: 80,  interval: 80 });
  sr.reveal('.card-3d',           { delay: 80,  interval: 80 });
  sr.reveal('.contact__item',     { delay: 80,  interval: 80 });
}

// ========================
// INIT
// ========================
document.addEventListener('DOMContentLoaded', () => {
  initCardTilt();
  initScrollReveal();
  initNetworkDemo();
});

// ============================================================
//  NETWORK DEMO
//  Accordion toggle → fetch ipapi.co → typewriter command
//  → progress bar → row-by-row reveal → disclaimer
// ============================================================

function initNetworkDemo() {
  const trigger  = document.getElementById('demo-trigger');
  const panel    = document.getElementById('demo-panel');
  const btnLabel = trigger ? trigger.querySelector('.demo-btn-label') : null;

  if (!trigger || !panel) return;

  let hasRun = false;

  trigger.addEventListener('click', () => {
    const isOpen = panel.classList.contains('open');

    if (isOpen) {
      panel.classList.remove('open');
      trigger.classList.remove('active');
      if (btnLabel) btnLabel.textContent = 'Iniciar análisis';
    } else {
      panel.classList.add('open');
      trigger.classList.add('active');
      if (btnLabel) btnLabel.textContent = 'Cerrar';
      if (!hasRun) {
        hasRun = true;
        runNetworkScan();
      }
    }
  });
}

// ── Utilidades ──────────────────────────────────────────────

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function typeText(el, text, speed) {
  speed = speed || 38;
  return new Promise(function(resolve) {
    var i = 0;
    var tick = setInterval(function() {
      el.textContent += text[i];
      i++;
      if (i >= text.length) { clearInterval(tick); resolve(); }
    }, speed);
  });
}

function animateProgress(bar, label) {
  var steps = [
    'Localizando IP de origen...',
    'Consultando registro ASN...',
    'Obteniendo geolocalización del nodo...',
    'Analizando cabeceras HTTP...',
    'Recolectando datos del cliente...',
    'Completado ✓'
  ];
  var pct = 0;
  var stepIdx = 0;

  return new Promise(function(resolve) {
    var tick = setInterval(function() {
      pct += Math.random() * 14 + 6;
      if (pct >= 100) {
        pct = 100;
        bar.style.width = '100%';
        label.textContent = steps[steps.length - 1];
        clearInterval(tick);
        setTimeout(resolve, 350);
        return;
      }
      bar.style.width = pct + '%';
      var idx = Math.min(
        Math.floor((pct / 100) * (steps.length - 1)),
        steps.length - 2
      );
      if (idx !== stepIdx) { stepIdx = idx; label.textContent = steps[idx]; }
    }, 160);
  });
}

function addRow(container, label, value, hlClass) {
  hlClass = hlClass || '';
  var row = document.createElement('div');
  row.className = 'demo-row';
  row.innerHTML =
    '<span class="demo-row__label">' + label + '</span>' +
    '<span class="demo-row__value ' + hlClass + '">' + value + '</span>';
  container.appendChild(row);
}

function addSeparator(container) {
  var sep = document.createElement('div');
  sep.className = 'demo-row demo-row--separator';
  container.appendChild(sep);
}

// ── Detección browser / OS ──────────────────────────────────

function detectBrowser(ua) {
  if (/Edg\//.test(ua))          return 'Microsoft Edge';
  if (/OPR\/|Opera/.test(ua))    return 'Opera';
  if (/Firefox\//.test(ua))      return 'Firefox';
  if (/Chrome\//.test(ua))       return 'Chrome';
  if (/Safari\//.test(ua))       return 'Safari';
  return 'Desconocido';
}

function detectOS(ua) {
  if (/Windows NT 10\.0/.test(ua)) return 'Windows 10 / 11';
  if (/Windows NT/.test(ua))       return 'Windows';
  if (/Mac OS X/.test(ua))         return 'macOS';
  if (/Android/.test(ua))          return 'Android';
  if (/iPhone|iPad/.test(ua))      return 'iOS';
  if (/Linux/.test(ua))            return 'Linux';
  return 'Desconocido';
}

// ── Scan principal ───────────────────────────────────────────

async function runNetworkScan() {
  var cmdEl        = document.getElementById('demo-cmd-text');
  var cursor       = document.getElementById('demo-cursor');
  var progressWrap = document.getElementById('demo-progress-wrap');
  var progressBar  = document.getElementById('demo-progress-bar');
  var progressLbl  = document.getElementById('demo-progress-label');
  var resultsEl    = document.getElementById('demo-results');
  var disclaimer   = document.getElementById('demo-disclaimer');
  var statusBadge  = document.getElementById('demo-status');

  // 1. Animar comando
  statusBadge.textContent = 'RUNNING';
  statusBadge.classList.add('running');

  await sleep(300);
  await typeText(cmdEl, './scan_visitor.sh --full --asn --geo --client', 34);
  cursor.classList.add('hidden');

  // 2. Progress bar + fetch en paralelo
  await sleep(200);
  progressWrap.style.display = 'block';

  var ipData = {};
  try {
    var results = await Promise.all([
      fetch('https://ipapi.co/json/').then(function(r) { return r.json(); }),
      animateProgress(progressBar, progressLbl)
    ]);
    ipData = results[0];
  } catch(e) {
    await animateProgress(progressBar, progressLbl);
    ipData = { _error: true };
  }

  progressWrap.style.display = 'none';

  // 3. Datos del cliente
  var ua         = navigator.userAgent;
  var browser    = detectBrowser(ua);
  var os         = detectOS(ua);
  var lang       = navigator.language || 'N/A';
  var resolution = window.screen.width + ' × ' + window.screen.height;
  var tzLocal    = Intl.DateTimeFormat().resolvedOptions().timeZone;
  var colorDepth = window.screen.colorDepth + '-bit';
  var dnt        = navigator.doNotTrack === '1' ? 'Activado' : 'Desactivado';

  // 4. Renderizar filas una por una
  await sleep(80);

  addRow(resultsEl, '> IP PÚBLICA',
    ipData._error ? 'Error al obtener' : (ipData.ip || 'N/A'),
    'hl-cyan');

  if (!ipData._error) {
    await sleep(80);
    addRow(resultsEl, '> ASN',       ipData.asn || 'N/A', 'hl-violet');
    await sleep(70);
    addRow(resultsEl, '> ISP / ORG', ipData.org || 'N/A');
    await sleep(60);
    addSeparator(resultsEl);

    await sleep(70);
    addRow(resultsEl, '> PAÍS',
      (ipData.country_name || 'N/A') + ' (' + (ipData.country_code || '') + ')',
      'hl-yellow');
    await sleep(70);
    addRow(resultsEl, '> REGIÓN',      ipData.region || 'N/A');
    await sleep(60);
    addRow(resultsEl, '> CIUDAD',      ipData.city   || 'N/A');
    await sleep(60);
    addRow(resultsEl, '> COORDS',
      ipData.latitude
        ? ipData.latitude + '°,  ' + ipData.longitude + '°  ← nodo ISP aprox.'
        : 'N/A');
    await sleep(60);
    addRow(resultsEl, '> ZONA HORARIA', ipData.timezone || tzLocal);
    await sleep(60);
    addSeparator(resultsEl);
  }

  await sleep(70);
  addRow(resultsEl, '> NAVEGADOR',    browser,    'hl-cyan');
  await sleep(60);
  addRow(resultsEl, '> SISTEMA OP.',  os);
  await sleep(60);
  addRow(resultsEl, '> RESOLUCIÓN',   resolution, 'hl-violet');
  await sleep(60);
  addRow(resultsEl, '> COLOR DEPTH',  colorDepth);
  await sleep(60);
  addRow(resultsEl, '> IDIOMA',       lang,       'hl-yellow');
  await sleep(60);
  addRow(resultsEl, '> DO NOT TRACK', dnt);
  await sleep(60);
  addSeparator(resultsEl);

  await sleep(80);
  addRow(resultsEl, '> ESTADO', 'Análisis completo. Sin datos almacenados.', 'hl-cyan');

  // 5. Actualizar badge
  statusBadge.classList.remove('running');
  statusBadge.classList.add('done');
  statusBadge.textContent = 'DONE';

  // 6. Mostrar disclaimer
  await sleep(400);
  disclaimer.classList.add('visible');

  // 7. Mostrar los 4 features extra
  await sleep(300);
  showScore(ipData, ua);
  await sleep(200);
  showNetGraph(ipData);
  await sleep(200);
  showPrivacyTips(ipData, browser, dnt);
  await sleep(200);
  var howtoSection = document.getElementById('demo-howto-section');
  if (howtoSection) { howtoSection.classList.add('visible'); initHowTo(); }
}

// ============================================================
//  FEATURE 1 — SCORE DE EXPOSICIÓN DIGITAL
// ============================================================
function calculateScore(ipData, ua) {
  var score = 30;
  var factors = [];

  // DNT
  if (navigator.doNotTrack === '1') {
    score += 15;
    factors.push({ label: 'Do Not Track activado', pts: '+15', type: 'good' });
  } else {
    factors.push({ label: 'Do Not Track desactivado', pts: '-10', type: 'bad' });
    score -= 10;
  }

  // Navegador
  var browser = detectBrowser(ua);
  if (browser === 'Firefox') {
    score += 12; factors.push({ label: 'Firefox (orientado a privacidad)', pts: '+12', type: 'good' });
  } else if (browser === 'Microsoft Edge') {
    score += 5; factors.push({ label: 'Edge (privacidad moderada)', pts: '+5', type: 'neutral' });
  } else if (browser === 'Chrome') {
    factors.push({ label: 'Chrome (telemetría habilitada)', pts: '0', type: 'neutral' });
  } else if (browser === 'Safari') {
    score += 8; factors.push({ label: 'Safari (ITP activado)', pts: '+8', type: 'good' });
  }

  // VPN heurística: timezone local ≠ timezone del ISP
  var tzLocal = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (!ipData._error && ipData.timezone && tzLocal !== ipData.timezone) {
    score += 20; factors.push({ label: 'Posible VPN / proxy detectado', pts: '+20', type: 'good' });
  } else if (!ipData._error) {
    factors.push({ label: 'Sin VPN/proxy detectado', pts: '0', type: 'neutral' });
  }

  // IP de datacenter (señal de VPN/proxy)
  if (!ipData._error && ipData.org && /digitalocean|amazon|google|azure|cloudflare|vultr|linode|hetzner|vpn|proxy/i.test(ipData.org)) {
    score += 10; factors.push({ label: 'IP de datacenter/nube', pts: '+10', type: 'good' });
  }

  // Resolución
  var commonRes = ['1920x1080','1366x768','1440x900','1280x800','1280x720','2560x1440'];
  var res = window.screen.width + 'x' + window.screen.height;
  if (commonRes.indexOf(res) !== -1) {
    score += 5; factors.push({ label: 'Resolución estándar (menos única)', pts: '+5', type: 'good' });
  } else {
    score -= 5; factors.push({ label: 'Resolución poco común (más identificable)', pts: '-5', type: 'bad' });
  }

  score = Math.max(0, Math.min(100, Math.round(score)));
  var level = score >= 65 ? 'PROTEGIDO' : score >= 40 ? 'MODERADO' : 'EXPUESTO';
  var cls   = score >= 65 ? 'score-high' : score >= 40 ? 'score-mid' : 'score-low';
  return { score: score, level: level, cls: cls, factors: factors };
}

async function showScore(ipData, ua) {
  var section = document.getElementById('demo-score-section');
  if (!section) return;
  section.classList.add('visible');

  var result = calculateScore(ipData, ua);

  // Animar número del gauge
  var gaugeFill = document.getElementById('gauge-fill');
  var gaugeNum  = document.getElementById('gauge-num');
  var gaugeLevel= document.getElementById('gauge-level');

  if (gaugeFill) {
    gaugeFill.classList.add(result.cls);
    var circumference = 339.3;
    var offset = circumference - (result.score / 100) * circumference;
    setTimeout(function() { gaugeFill.style.strokeDashoffset = offset; }, 50);
  }

  // Animar número
  if (gaugeNum) {
    var current = 0;
    var target  = result.score;
    var step    = Math.ceil(target / 30);
    var tick = setInterval(function() {
      current = Math.min(current + step, target);
      gaugeNum.textContent = current;
      if (current >= target) clearInterval(tick);
    }, 40);
  }

  if (gaugeLevel) {
    await sleep(400);
    gaugeLevel.textContent = result.level;
    gaugeLevel.classList.add(result.cls);
  }

  // Factores
  var factorsEl = document.getElementById('demo-score-factors');
  if (factorsEl) {
    for (var i = 0; i < result.factors.length; i++) {
      await sleep(100);
      var f = result.factors[i];
      var el = document.createElement('div');
      el.className = 'score-factor';
      el.style.animationDelay = '0ms';
      el.innerHTML =
        '<span class="score-factor__badge ' + f.type + '">' + f.pts + '</span>' +
        '<span>' + f.label + '</span>';
      factorsEl.appendChild(el);
    }
  }
}

// ============================================================
//  FEATURE 2 — NETWORK GRAPH ANIMADO
// ============================================================
function showNetGraph(ipData) {
  var section = document.getElementById('demo-netgraph-section');
  if (!section) return;
  section.classList.add('visible');

  // Actualizar labels con datos reales
  var yourIpEl  = document.getElementById('ng-your-ip');
  var ispNameEl = document.getElementById('ng-isp-name');
  var asnEl     = document.getElementById('ng-asn');

  if (yourIpEl && !ipData._error)  yourIpEl.textContent  = ipData.ip || '—';
  if (ispNameEl && !ipData._error) {
    var isp = (ipData.org || '').replace(/^AS\d+\s*/,'').substring(0, 18);
    ispNameEl.textContent = isp || '—';
  }
  if (asnEl && !ipData._error) asnEl.textContent = ipData.asn || '—';

  // Animar paquetes con requestAnimationFrame
  var pkt1 = document.getElementById('pkt-1');
  var pkt2 = document.getElementById('pkt-2');
  var pkt3 = document.getElementById('pkt-3');
  if (!pkt1) return;

  var START = 116, END = 504, RANGE = END - START;
  var offsets = [0, RANGE * 0.33, RANGE * 0.66];
  var speed   = 1.4;

  function animPackets() {
    offsets[0] = (offsets[0] + speed) % RANGE;
    offsets[1] = (offsets[1] + speed) % RANGE;
    offsets[2] = (offsets[2] + speed) % RANGE;
    if (pkt1) pkt1.setAttribute('cx', START + offsets[0]);
    if (pkt2) pkt2.setAttribute('cx', START + offsets[1]);
    if (pkt3) pkt3.setAttribute('cx', START + offsets[2]);
    requestAnimationFrame(animPackets);
  }
  requestAnimationFrame(animPackets);
}

// ============================================================
//  FEATURE 3 — CONSEJOS DE PRIVACIDAD DINÁMICOS
// ============================================================
async function showPrivacyTips(ipData, browser, dnt) {
  var section = document.getElementById('demo-tips-section');
  var grid    = document.getElementById('demo-tips-grid');
  if (!section || !grid) return;
  section.classList.add('visible');

  var tips = [];

  // DNT
  if (dnt === 'Desactivado') {
    tips.push({ icon:'🚫', title:'Activá Do Not Track', text:'En Chrome/Firefox: Configuración → Privacidad → "Enviar solicitud Do Not Track".', type:'warn' });
  } else {
    tips.push({ icon:'✅', title:'Do Not Track está activo', text:'Bien! Aunque no todos los sitios lo respetan, es un paso en la dirección correcta.', type:'ok' });
  }

  // Navegador
  if (browser === 'Chrome') {
    tips.push({ icon:'🔄', title:'Considerá Firefox o Brave', text:'Firefox con uBlock Origin o Brave tienen mayor protección de privacidad por defecto que Chrome.', type:'warn' });
  } else if (browser === 'Firefox') {
    tips.push({ icon:'🦊', title:'Firefox: buena elección', text:'Suma uBlock Origin y Privacy Badger para bloquear rastreadores de terceros.', type:'ok' });
  } else {
    tips.push({ icon:'🌐', title:'Revisá tu navegador', text:'Verificá que tenés bloqueadores de anuncios/rastreadores instalados.', type:'info' });
  }

  // VPN
  if (!ipData._error) {
    var tzLocal = Intl.DateTimeFormat().resolvedOptions().timeZone;
    var hasVpn = ipData.timezone && tzLocal !== ipData.timezone;
    if (!hasVpn) {
      tips.push({ icon:'🔒', title:'Usá una VPN', text:'Una VPN oculta tu IP real y ASN al sitio que visitás. Recomendadas: Mullvad, ProtonVPN (código abierto).', type:'warn' });
    } else {
      tips.push({ icon:'🛡️', title:'VPN o proxy detectado', text:'Tu tráfico pasa por un intermediario, lo que añade una capa de anonimato. Bien!', type:'ok' });
    }
  }

  // Huella digital
  tips.push({ icon:'👣', title:'Reducí tu huella digital', text:'Evitá extensiones innecesarias, usá una resolución estándar y revisá permisos del navegador (cámara, ubicación, micro).', type:'info' });

  // HTTPS
  tips.push({ icon:'🔐', title:'Siempre HTTPS', text:'Este sitio lo usa. Verificá el candado en la barra del navegador antes de ingresar datos en cualquier sitio.', type:'ok' });

  // EFF
  tips.push({ icon:'🧪', title:'Probá tu huella', text:'Visitá coveryourtracks.eff.org para ver qué tan único es tu perfil de navegación.', type:'info' });

  // Renderizar con delay
  for (var i = 0; i < tips.length; i++) {
    await sleep(90);
    var t = tips[i];
    var card = document.createElement('div');
    card.className = 'tip-card tip-card--' + t.type;
    card.style.animationDelay = '0ms';
    card.innerHTML =
      '<div class="tip-card__icon">' + t.icon + '</div>' +
      '<div><div class="tip-card__title">' + t.title + '</div>' +
      '<div class="tip-card__text">' + t.text + '</div></div>';
    grid.appendChild(card);
  }
}

// ============================================================
//  FEATURE 4 — ¿CÓMO FUNCIONA? (accordion)
// ============================================================
function initHowTo() {
  var btn  = document.getElementById('demo-howto-btn');
  var body = document.getElementById('demo-howto-body');
  var chev = document.getElementById('demo-howto-chev');
  if (!btn || !body) return;

  btn.addEventListener('click', function() {
    var isOpen = body.classList.contains('open');
    body.classList.toggle('open');
    btn.classList.toggle('open');
    if (chev) chev.classList.toggle('open');
  });
}

