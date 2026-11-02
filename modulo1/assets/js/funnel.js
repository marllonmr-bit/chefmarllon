/* =====================================================================
   FUNIL — rastreamento por etapa, UTMs, consentimento (LGPD),
   envio de leads e links de checkout. Não precisa editar este arquivo.
   Cada página declara sua etapa em <body data-stage="captura|confirmacao|venda">.
   ===================================================================== */
(function () {
  var C = window.CONFIG || {};
  var F = (window.FUNNEL = {});
  var store = {
    get: function (k, s) { try { return (s ? sessionStorage : localStorage).getItem(k); } catch (e) { return null; } },
    set: function (k, v, s) { try { (s ? sessionStorage : localStorage).setItem(k, v); } catch (e) {} }
  };

  F.stage = (document.body && document.body.getAttribute('data-stage')) || 'venda';

  /* ---------- UTMs: guardadas na sessão e repassadas ao checkout e ao lead ---------- */
  var keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid'];
  var utm = {};
  try {
    var qs = new URLSearchParams(location.search);
    keys.forEach(function (k) { if (qs.get(k)) utm[k] = qs.get(k); });
    if (Object.keys(utm).length) store.set('mr_utm', JSON.stringify(utm), true);
    else utm = JSON.parse(store.get('mr_utm', true) || '{}');
  } catch (e) {}
  F.utm = utm;
  F.withUtm = function (url) {
    if (!url || !Object.keys(utm).length) return url;
    var hash = '', i = url.indexOf('#');
    if (i > -1) { hash = url.slice(i); url = url.slice(0, i); }
    var sep = url.indexOf('?') > -1 ? '&' : '?';
    return url + sep + keys.filter(function (k) { return utm[k]; })
      .map(function (k) { return k + '=' + encodeURIComponent(utm[k]); }).join('&') + hash;
  };

  /* ---------- Consentimento + rastreadores ---------- */
  var hasTrackers = !!(C.metaPixelId || C.gaMeasurementId);
  var loaded = false, queue = [];
  function loadTrackers() {
    if (loaded || !hasTrackers) return; loaded = true;
    if (C.metaPixelId) {
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', C.metaPixelId); fbq('track', 'PageView');
    }
    if (C.gaMeasurementId) {
      var g = document.createElement('script'); g.async = true;
      g.src = 'https://www.googletagmanager.com/gtag/js?id=' + C.gaMeasurementId; document.head.appendChild(g);
      window.dataLayer = window.dataLayer || []; window.gtag = function () { dataLayer.push(arguments); };
      gtag('js', new Date()); gtag('config', C.gaMeasurementId, { funnel_stage: F.stage });
    }
    queue.forEach(send); queue = [];
  }
  function send(ev) {
    var p = Object.assign({ funnel_stage: F.stage }, ev.params || {});
    try { if (window.gtag) gtag('event', ev.ga, p); } catch (e) {}
    try {
      if (window.fbq) {
        if (ev.fb) fbq('track', ev.fb, p); else fbq('trackCustom', ev.ga, p);
      }
    } catch (e) {}
  }
  /* F.event(nomeGA, parametros, eventoPadraoMeta?) */
  F.event = function (ga, params, fb) {
    var ev = { ga: ga, params: params, fb: fb };
    if (window.console && C.debug) console.log('[funil]', F.stage, ga, params || {});
    if (loaded) send(ev); else if (hasTrackers) queue.push(ev);
  };

  function consentBar() {
    var d = store.get('mr_consent');
    if (d === 'yes') return loadTrackers();
    if (d === 'no' || !hasTrackers) return;
    var bar = document.createElement('div');
    bar.className = 'consent';
    bar.setAttribute('role', 'region'); bar.setAttribute('aria-label', 'Preferências de cookies');
    bar.innerHTML = '<p>Usamos cookies de medição (Meta e Google) para entender como a página é usada e melhorar nossos anúncios. Você escolhe.' +
      (C.privacyUrl ? ' <a href="' + C.privacyUrl + '" target="_blank" rel="noopener">Política de privacidade</a>.' : '') +
      '</p><div><button class="btn btn-ghost" data-c="no">Recusar</button><button class="btn btn-primary" data-c="yes">Aceitar</button></div>';
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('[data-c]'); if (!b) return;
      store.set('mr_consent', b.getAttribute('data-c'));
      if (b.getAttribute('data-c') === 'yes') loadTrackers();
      bar.remove();
    });
    document.body.appendChild(bar);
  }

  /* ---------- Cliques em CTAs ---------- */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-cta]');
    if (el) F.event('cta_click', { cta: el.getAttribute('data-cta') });
  });

  /* ---------- Checkout ---------- */
  F.checkout = function () { return F.withUtm(C.checkoutUrl); };
  F.trackCheckout = function (label) {
    F.event('begin_checkout', { cta: label, value_label: C.price || '' }, 'InitiateCheckout');
  };

  /* ---------- Lead ---------- */
  F.submitLead = function (data) {
    var L = C.lead || {};
    if (!L.endpoint) return Promise.reject(new Error('not_configured'));
    var payload = {};
    payload[(L.fields && L.fields.name) || 'nome'] = data.name;
    payload[(L.fields && L.fields.email) || 'email'] = data.email;
    Object.assign(payload, L.extra || {}, utm, {
      consentimento_lgpd: 'sim',
      consentimento_data: new Date().toISOString(),
      pagina: location.href.split('?')[0]
    });
    var opts = { method: 'POST', mode: L.mode || 'no-cors' };
    if (L.format === 'form') {
      opts.headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
      opts.body = new URLSearchParams(payload).toString();
    } else {
      opts.headers = { 'Content-Type': L.mode === 'cors' ? 'application/json' : 'text/plain' };
      opts.body = JSON.stringify(payload);
    }
    return fetch(L.endpoint, opts).then(function (r) {
      if (L.mode === 'cors' && !r.ok) throw new Error('http_' + r.status);
      return true;
    });
  };
  F.rememberLead = function (name) { store.set('mr_lead_name', name || '', true); };
  F.leadName = function () { return store.get('mr_lead_name', true) || ''; };

  /* ---------- Vídeo ---------- */
  F.embedUrl = function (u) {
    var y = u.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
    if (y) return 'https://www.youtube-nocookie.com/embed/' + y[1] + '?autoplay=1&rel=0&modestbranding=1&playsinline=1';
    var v = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (v) return 'https://player.vimeo.com/video/' + v[1] + '?autoplay=1';
    return null;
  };
  F.media = function (u, poster, label) {
    var e = F.embedUrl(u), el;
    if (e) { el = document.createElement('iframe'); el.src = e; el.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen'; el.allowFullscreen = true; el.title = label || 'Vídeo'; }
    else { el = document.createElement('video'); el.src = u; el.controls = true; el.autoplay = true; el.playsInline = true; if (poster) el.poster = poster; }
    F.event('video_play', { video: label || u });
    return el;
  };

  /* ---------- Reveal ---------- */
  F.reveal = function () {
    if (!('IntersectionObserver' in window)) { document.querySelectorAll('.rv').forEach(function (el) { el.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.rv:not(.in)').forEach(function (el) { io.observe(el); });
  };

  /* ---------- Fotos do CONFIG ---------- */
  F.photos = function () {
    document.querySelectorAll('img[data-src]').forEach(function (img) {
      var src = (C.photos || {})[img.getAttribute('data-src')];
      if (src) { img.src = src; img.decoding = 'async'; }
      else (img.closest('.photo') || img).style.display = 'none';
    });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', consentBar); else consentBar();
})();
