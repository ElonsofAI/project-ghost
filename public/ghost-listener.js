(function () {
  'use strict';

  var API_KEY  = window.__GHOST_API_KEY || '';
  var BASE_URL = (window.__GHOST_TELEMETRY_URL || 'https://your-ghost-domain.com');
  var ENDPOINT = BASE_URL + '/api/telemetry';

  // --- Session ID (persisted for the browser session) ---
  var SESSION_ID = sessionStorage.getItem('_ghost_sid');
  if (!SESSION_ID) {
    SESSION_ID = 'gs_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem('_ghost_sid', SESSION_ID);
  }

  function send(event, data) {
    try {
      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: event,
          clientApiKey: API_KEY,
          sessionId: SESSION_ID,
          data: data || {},
          ts: Date.now(),
          url: window.location.href,
          shopDomain: window.Shopify ? window.Shopify.shop : window.location.hostname,
        }),
        keepalive: true,
      });
    } catch (_) {}
  }

  // --- New Session ---
  send('session_init', {
    referrer: document.referrer,
    path: window.location.pathname,
  });

  // --- Product View ---
  if (window.location.pathname.indexOf('/products/') !== -1) {
    send('product_view', { path: window.location.pathname });
  }

  // --- Cart Addition (Shopify theme event) ---
  document.addEventListener('cart:add', function (e) {
    send('cart_add', { item: e.detail && e.detail.product_title ? e.detail.product_title : 'unknown' });
  });

  // --- Cart Addition (fetch intercept) ---
  var origFetch = window.fetch;
  window.fetch = function (input, init) {
    var url = typeof input === 'string' ? input : (input && input.url) || '';
    if (url.indexOf('/cart/add') !== -1) send('cart_add', { method: 'fetch' });
    return origFetch.apply(this, arguments);
  };

  // --- Cart Addition (XHR intercept) ---
  var origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url) {
    if (typeof url === 'string' && url.indexOf('/cart/add') !== -1) send('cart_add', { method: 'xhr' });
    return origOpen.apply(this, arguments);
  };

  // --- Checkout Initiation (click) ---
  document.addEventListener('click', function (e) {
    var target = e.target;
    while (target && target !== document.body) {
      var name = (target.name || '').toLowerCase();
      var cls  = (target.className || '').toLowerCase();
      var href = (target.href || '').toLowerCase();
      var id   = (target.id || '').toLowerCase();
      if (name === 'checkout' || id === 'checkout' || cls.indexOf('checkout') !== -1 || href.indexOf('/checkout') !== -1) {
        send('checkout_init', { element: target.tagName, text: (target.innerText || '').trim().slice(0, 60) });
        break;
      }
      target = target.parentElement;
    }
  }, true);

  // --- Checkout page direct load ---
  if (window.location.pathname.indexOf('/checkout') === 0) {
    send('checkout_init', { source: 'direct_page_load' });
  }

  // --- Purchase (Shopify thank_you / order-status page) ---
  if (window.location.pathname.indexOf('/thank_you') !== -1 || window.location.pathname.indexOf('order-status') !== -1) {
    var orderId = window.Shopify && window.Shopify.checkout ? window.Shopify.checkout.order_id : null;
    var total   = window.Shopify && window.Shopify.checkout ? window.Shopify.checkout.total_price : null;
    send('purchase', { orderId: orderId, total: total });
  }
})();
