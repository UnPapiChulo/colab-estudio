(() => {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let savedPause = false;
  try { savedPause = localStorage.getItem('colab-motion-paused') === 'true'; } catch {}
  let motionPaused = savedPause || reduced.matches;
  const motionButton = document.querySelector('#motion-toggle');
  function updateMotion() {
    root.classList.toggle('motion-paused', motionPaused);
    root.classList.toggle('js-motion', !motionPaused);
    motionButton.setAttribute('aria-pressed', String(motionPaused));
    motionButton.querySelector('.motion-label').textContent = motionPaused ? 'Activar animaciones' : 'Pausar animaciones';
    motionButton.querySelector('.motion-icon').textContent = motionPaused ? '▷' : 'Ⅱ';
    document.dispatchEvent(new CustomEvent('colab-motion', { detail: { paused: motionPaused } }));
  }
  updateMotion();
  motionButton.addEventListener('click', () => {
    motionPaused = !motionPaused;
    try { localStorage.setItem('colab-motion-paused', String(motionPaused)); } catch {}
    updateMotion();
  });
  reduced.addEventListener('change', event => { motionPaused = event.matches; updateMotion(); });
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); }
    }), { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
    reveals.forEach(el => observer.observe(el));
  } else reveals.forEach(el => el.classList.add('in-view'));

  const header = document.querySelector('#header');
  let scrollPending = false;
  addEventListener('scroll', () => {
    if (!scrollPending) requestAnimationFrame(() => { header.classList.toggle('scrolled', scrollY > 75); scrollPending = false; });
    scrollPending = true;
  }, { passive: true });
  header.classList.toggle('scrolled', scrollY > 75);
  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#mobile-nav');
  function closeMenu() { menu.hidden = true; menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.setAttribute('aria-label', 'Abrir menú'); }
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menu.hidden = !open; menuToggle.setAttribute('aria-expanded', String(open)); menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { closeMenu(); menuToggle.focus(); } });
  matchMedia('(min-width:761px)').addEventListener('change', e => { if (e.matches) closeMenu(); });

  const projects = {
    ajitate: { title:'Ajitate', category:'GASTRONOMÍA · CUENCA', image:'assets/ajitate-live-desktop.png', description:'El carácter de un restaurante Tex-Mex, llevado a la pantalla. Una experiencia para explorar el menú, descubrir especialidades y preparar un pedido.', features:['Menú organizado por categorías y buscador.','Selección de productos y pedidos preparados para WhatsApp.','Historia, ubicación y contacto en un mismo lugar.'], url:'https://colab-websites.github.io/Ajitate/' },
    lockpoint: { title:'Lockpoint', category:'SERVICIOS · CUENCA', image:'assets/lockpoint-live-desktop.png', description:'Una presencia digital clara para una cerrajería residencial y automotriz. El sitio organiza los servicios y acerca al visitante a la consulta que necesita.', features:['Servicios para hogares y vehículos.','Selector de motivo de contacto.','Consultas por WhatsApp y preguntas frecuentes.'], url:'https://lockpoint-cuenca.andymaruri.chatgpt.site/' },
    cenia: { title:'CENIA', category:'EDUCACIÓN & BIENESTAR · CUENCA', image:'assets/cenia-live-desktop.png', description:'Un espacio digital cercano para el Centro de Innovación y Apoyo Académico. Una navegación que ayuda a las familias a conocer los servicios y encontrar orientación.', features:['Presentación de servicios y modalidades.','Guía para elegir el apoyo adecuado.','Consulta preparada para WhatsApp, ubicación y preguntas frecuentes.'], url:'https://cenia-crecer.andymaruri.chatgpt.site/' }
  };
  const dialog = document.querySelector('#project-dialog');
  let opener;
  document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
    const p = projects[button.dataset.project]; opener = button;
    document.querySelector('#dialog-title').textContent = p.title;
    document.querySelector('#dialog-category').textContent = p.category;
    document.querySelector('#dialog-description').textContent = p.description;
    const img = document.querySelector('#dialog-img'); img.src = p.image; img.alt = 'Vista del sitio web de ' + p.title;
    const list = document.querySelector('#dialog-features'); list.replaceChildren(...p.features.map(text => { const li = document.createElement('li'); li.textContent = text; return li; }));
    document.querySelector('#dialog-link').href = p.url;
    dialog.showModal(); dialog.scrollTop = 0;
  }));
  document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
  dialog.addEventListener('close', () => opener?.focus({ preventScroll:true }));

  document.querySelectorAll('[data-service-choice]').forEach(a => a.addEventListener('click', () => {
    const option = [...document.querySelectorAll('input[name=service]')].find(input => input.value === a.dataset.serviceChoice);
    if (option) option.checked = true;
  }));
  document.querySelector('#brief-form').addEventListener('submit', e => {
    e.preventDefault(); const data = new FormData(e.currentTarget);
    const name = String(data.get('name')).trim(), message = String(data.get('message')).trim();
    if (!name || !message) { (name ? document.querySelector('#brief-message') : document.querySelector('#brief-name')).focus(); return; }
    document.querySelector('#brief-output').value = `¡Hola, Colab! Soy ${name}.\n\nMe interesa: ${data.get('service')}.\n\n${message}`;
    const result = document.querySelector('#brief-result'); result.hidden = false;
    result.scrollIntoView({ behavior:motionPaused ? 'instant' : 'smooth', block:'nearest' });
    document.querySelector('#copy-status').textContent = '';
  });
  document.querySelector('#copy-brief').addEventListener('click', async () => {
    const output = document.querySelector('#brief-output');
    try { await navigator.clipboard.writeText(output.value); document.querySelector('#copy-status').textContent = 'Consulta copiada. No se ha enviado.'; }
    catch { output.focus(); output.select(); document.querySelector('#copy-status').textContent = 'Seleccionamos tu consulta. Puedes copiarla con el menú de tu dispositivo.'; }
  });
})();
