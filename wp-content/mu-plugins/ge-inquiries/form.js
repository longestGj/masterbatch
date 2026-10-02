document.querySelectorAll('.ge-rfq-widget').forEach((widget) => {
  const form = widget.querySelector('.ge-rfq-form');
  const result = widget.querySelector('.ge-rfq-result');
  if (!form || !result) return;
  form.hidden = false;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const submit = form.querySelector('[type="submit"]');
    submit.disabled = true;
    result.hidden = false;
    result.textContent = 'Saving your inquiry…';
    try {
      const response = await fetch(form.getAttribute('action'), {
        method: 'POST',
        body: new FormData(form),
        credentials: 'same-origin',
      });
      const data = await response.json();
      if (!response.ok || !data.success || data.data?.saved !== true) {
        result.textContent = data.data?.message || 'Your inquiry could not be saved. Please try again.';
        submit.disabled = false;
        return;
      }
      result.textContent = 'Your inquiry was saved for review.';
      form.hidden = true;
    } catch (_) {
      result.textContent = 'Your inquiry could not be saved. Please try again or email Jenny directly.';
      submit.disabled = false;
    }
  });
});
