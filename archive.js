(() => {
  const filters = document.querySelector('.archive-filters');
  if (!filters) return;
  const entries = [...document.querySelectorAll('.writing-entry')];
  filters.hidden = false;
  filters.addEventListener('click', event => {
    const button = event.target.closest('button[data-filter]');
    if (!button) return;
    for (const item of filters.querySelectorAll('button')) item.setAttribute('aria-pressed', String(item === button));
    for (const entry of entries) entry.hidden = button.dataset.filter !== 'all' && entry.dataset.category !== button.dataset.filter;
    const count = entries.filter(entry => !entry.hidden).length;
    document.getElementById('archive-count').textContent = `${count} selected document${count === 1 ? '' : 's'}`;
  });
})();
