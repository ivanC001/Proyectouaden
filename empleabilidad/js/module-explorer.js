/** Pure pagination logic shared with the regression tests. End is exclusive. */
export function moduleRange(page, total, pageSize = 3) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.max(0, Math.min(pageCount - 1, Number.isFinite(page) ? Math.trunc(page) : 0));
  return { page: current, pageCount, start: current * pageSize, end: Math.min((current + 1) * pageSize, total) };
}

/** Progressive enhancement: the original twelve articles remain the source of truth. */
export function initModuleExplorer(root) {
  if (!root) return;
  const modules = Array.from(root.querySelectorAll('.module'));
  const navigation = root.querySelector('[data-module-navigation]');
  const stages = Array.from(root.querySelectorAll('[data-module-page]'));
  const all = root.querySelector('[data-module-all]');
  const previous = root.querySelector('[data-module-prev]');
  const next = root.querySelector('[data-module-next]');
  const status = root.querySelector('[data-module-status]');
  if (!modules.length || !navigation || !stages.length || !all || !previous || !next || !status) return;

  let page = 0;
  let showAll = false;
  const pad = (value) => String(value).padStart(2, '0');

  function render() {
    const range = moduleRange(page, modules.length);
    page = range.page;
    modules.forEach((module, index) => {
      module.hidden = !showAll && (index < range.start || index >= range.end);
      // A filtered article must not wait for a second scroll to reveal itself.
      if (!module.hidden) module.classList.add('is-revealed');
    });
    stages.forEach((stage, index) => stage.setAttribute('aria-pressed', String(!showAll && index === page)));
    all.setAttribute('aria-pressed', String(showAll));
    all.textContent = showAll ? 'Volver a los bloques' : 'Ver los 12 módulos';
    previous.disabled = showAll || page === 0;
    next.disabled = showAll || page === range.pageCount - 1;
    status.textContent = showAll
      ? `Los ${modules.length} módulos · Abre una tarjeta para ver su contenido`
      : `Módulos ${pad(range.start + 1)}–${pad(range.end)} de ${modules.length} · Abre una tarjeta`;
  }

  function selectPage(value) {
    page = value;
    showAll = false;
    render();
  }

  stages.forEach((stage, index) => {
    stage.addEventListener('click', () => selectPage(index));
    stage.addEventListener('keydown', (event) => {
      const targets = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: stages.length - 1 };
      if (!(event.key in targets)) return;
      event.preventDefault();
      const target = moduleRange(targets[event.key], modules.length).page;
      selectPage(target);
      stages[target].focus();
    });
  });
  previous.addEventListener('click', () => selectPage(page - 1));
  next.addEventListener('click', () => selectPage(page + 1));
  all.addEventListener('click', () => { showAll = !showAll; render(); });

  function followHash() {
    const match = /^#mod(\d+)-(?:panel|trigger)$/.exec(window.location.hash);
    const index = match ? Number(match[1]) - 1 : -1;
    if (index >= 0 && index < modules.length) {
      selectPage(Math.floor(index / 3));
      // Unhide the card before the browser resolves the deep-link position.
      modules[index].scrollIntoView({ block: 'start', behavior: 'instant' });
    }
  }
  navigation.hidden = false;
  root.classList.add('modules--ready');
  render();
  followHash();
  window.addEventListener('hashchange', followHash);
}
