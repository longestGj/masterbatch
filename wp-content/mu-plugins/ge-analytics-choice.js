(() => {
  const root = document.querySelector('.ge-analytics-choice');
  if (!root) return;
  const id = root.dataset.measurementId;
  const previewOnly = root.dataset.previewOnly === '1';
  if (!/^G-[A-Z0-9]+$/.test(id)) return;
  const key = 'ge_analytics_choice_v1';
  const panel = root.querySelector('.ge-analytics-panel');
  const settings = root.querySelector('.ge-analytics-settings');
  let loaded = false;
  let choice = null;
  try { choice = localStorage.getItem(key); } catch (_) { /* Leave analytics off. */ }

  function loadAnalytics() {
    if (loaded) return;
    loaded = true;
    if (previewOnly) {
      root.dataset.previewAccepted = '1';
      return;
    }
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      analytics_storage: 'granted', ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied',
    });
    window.gtag('js', new Date());
    window.gtag('config', id);
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.append(script);
  }

  function clearAnalyticsCookies() {
    const domains = ['', location.hostname, '.' + location.hostname];
    const parts = location.hostname.split('.');
    if (parts.length > 2) domains.push('.' + parts.slice(-2).join('.'));
    document.cookie.split(';').forEach((part) => {
      const name = part.split('=')[0].trim();
      if (!/^_ga(?:_|$)/.test(name)) return;
      domains.forEach((domain) => {
        document.cookie = name + '=; Max-Age=0; Path=/' + (domain ? '; Domain=' + domain : '');
      });
    });
  }

  function display() {
    const decided = choice === 'accepted' || choice === 'declined';
    panel.hidden = decided;
    settings.hidden = !decided;
  }
  if (choice === 'accepted') loadAnalytics();
  display();

  root.querySelectorAll('[data-choice]').forEach((button) => {
    button.addEventListener('click', () => {
      const next = button.dataset.choice;
      if (next !== 'accepted' && next !== 'declined') return;
      try { localStorage.setItem(key, next); } catch (_) {
        if (next === 'accepted') return;
      }
      const wasLoaded = loaded;
      choice = next;
      display();
      if (next === 'accepted') loadAnalytics();
      if (next === 'declined') {
        clearAnalyticsCookies();
        if (wasLoaded) location.reload();
      }
    });
  });
  settings.addEventListener('click', () => { panel.hidden = false; settings.hidden = true; });
})();
