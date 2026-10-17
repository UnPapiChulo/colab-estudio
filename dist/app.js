(() => {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const setMotion = () => {
    root.classList.toggle('motion-paused', reduced.matches);
    root.classList.toggle('js-motion', !reduced.matches);
    document.dispatchEvent(new CustomEvent('colab-motion', {detail:{paused:reduced.matches}}));
  };
  setMotion(); reduced.addEventListener('change', setMotion);
  const reveals=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('in-view');revealObserver.unobserve(entry.target);}
    }),{threshold:.06}); reveals.forEach(el=>revealObserver.observe(el));
  } else reveals.forEach(el=>el.classList.add('in-view'));

  // One continuously fixed header: position never changes at a scroll threshold.
  const header=document.querySelector('#header'); let scrollPending=false;
  const updateHeader=()=>{header.style.setProperty('--header-progress',Math.min(scrollY/140,1));scrollPending=false;};
  addEventListener('scroll',()=>{if(!scrollPending){scrollPending=true;requestAnimationFrame(updateHeader);}},{passive:true});
  updateHeader();
  const menuToggle=document.querySelector('.menu-toggle'), menu=document.querySelector('#mobile-nav');
  function closeMenu(){menu.hidden=true;menuToggle.setAttribute('aria-expanded','false');menuToggle.setAttribute('aria-label','Abrir menú');}
  menuToggle.addEventListener('click',()=>{const open=menuToggle.getAttribute('aria-expanded')!=='true';menu.hidden=!open;menuToggle.setAttribute('aria-expanded',String(open));menuToggle.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');});
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden){closeMenu();menuToggle.focus();}});
  document.addEventListener('click',e=>{if(!menu.hidden&&!header.contains(e.target))closeMenu();});
  matchMedia('(min-width:761px)').addEventListener('change',e=>{if(e.matches)closeMenu();});

  // Load a single original website only on request. Its animation is real; poster remains a fallback.
  let activePreview=null;
  const previewState=new WeakMap();
  function stopPreview(visual){
    const state=previewState.get(visual); if(!state)return;
    clearTimeout(state.timer);state.frame.remove();previewState.delete(visual);
    visual.classList.remove('is-live','is-loading');visual.querySelector('.live-indicator').hidden=true;
    const btn=visual.querySelector('.preview-play');btn.setAttribute('aria-pressed','false');btn.setAttribute('aria-label','Reproducir vista de '+visual.dataset.preview);btn.querySelector('.play-label').textContent='Ver en movimiento';
    visual.querySelector('.preview-status').textContent='';if(activePreview===visual)activePreview=null;
  }
  document.querySelectorAll('[data-preview]').forEach(visual=>{
    const button=visual.querySelector('.preview-play'),screen=visual.querySelector('.preview-screen'),stage=visual.querySelector('.live-stage');
    const resize=()=>stage.style.setProperty('--preview-scale',screen.getBoundingClientRect().width/1280);
    // OffsetWidth ignores the decorative CSS rotation, keeping the original 16:9 viewport exact.
    const fit=()=>stage.style.setProperty('--preview-scale',screen.offsetWidth/1280);
    if('ResizeObserver' in window)new ResizeObserver(fit).observe(screen);else addEventListener('resize',resize);
    button.addEventListener('click',()=>{
      if(activePreview===visual){stopPreview(visual);return;}
      if(activePreview)stopPreview(activePreview);
      activePreview=visual;fit();
      const frame=document.createElement('iframe');frame.title='Vista animada de '+visual.dataset.preview;frame.tabIndex=-1;
      frame.setAttribute('sandbox','allow-scripts allow-same-origin');frame.setAttribute('referrerpolicy','no-referrer');frame.setAttribute('allow','autoplay');
      visual.classList.add('is-loading');button.setAttribute('aria-pressed','true');button.setAttribute('aria-label','Detener vista de '+visual.dataset.preview);button.querySelector('.play-label').textContent='Detener vista';
      visual.querySelector('.preview-status').textContent='Cargando el sitio original…';
      const state={frame,timer:0};previewState.set(visual,state);
      state.timer=setTimeout(()=>{if(activePreview===visual)visual.querySelector('.preview-status').textContent='Si no aparece, abre el sitio desde su proyecto.';},12000);
      frame.addEventListener('load',()=>{if(previewState.get(visual)!==state)return;clearTimeout(state.timer);visual.classList.remove('is-loading');visual.classList.add('is-live');visual.querySelector('.live-indicator').hidden=false;visual.querySelector('.preview-status').textContent='';});
      frame.src=button.dataset.previewUrl;stage.append(frame);
    });
    if('IntersectionObserver' in window)new IntersectionObserver(entries=>{if(!entries[0].isIntersecting&&activePreview===visual)stopPreview(visual);},{rootMargin:'150px'}).observe(visual);
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&activePreview)stopPreview(activePreview);});
  reduced.addEventListener('change',e=>{if(e.matches&&activePreview)stopPreview(activePreview);});

  // Catalog starts with a few entries and supports filtering and pagination as it grows.
  const search=document.querySelector('#project-search');
  if(search){
    const cards=[...document.querySelectorAll('.catalog-grid .project-card')],filters=[...document.querySelectorAll('[data-filter]')],pagination=document.querySelector('#pagination');
    let sector='all',page=1;const perPage=12;
    const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    function render(){
      if(activePreview)stopPreview(activePreview);
      const query=normalize(search.value.trim()),matches=cards.filter(c=>(sector==='all'||c.dataset.sector===sector)&&normalize(c.dataset.search).includes(query));
      const pages=Math.ceil(matches.length/perPage);page=Math.max(1,Math.min(page,pages||1));
      cards.forEach(c=>c.hidden=true);matches.slice((page-1)*perPage,page*perPage).forEach(c=>{c.hidden=false;c.classList.add('in-view');});
      document.querySelector('#catalog-count').textContent=matches.length+' '+(matches.length===1?'proyecto':'proyectos');document.querySelector('#catalog-empty').hidden=matches.length>0;
      pagination.replaceChildren();pagination.hidden=pages<2;
      for(let n=1;n<=pages;n++){const b=document.createElement('button');b.type='button';b.textContent=String(n);b.setAttribute('aria-label','Página '+n);if(n===page)b.setAttribute('aria-current','page');b.addEventListener('click',()=>{page=n;render();document.querySelector('.catalog-tools').scrollIntoView({block:'start'});});pagination.append(b);}
    }
    filters.forEach(b=>b.addEventListener('click',()=>{sector=b.dataset.filter;page=1;filters.forEach(f=>f.setAttribute('aria-pressed',String(f===b)));render();}));
    search.addEventListener('input',()=>{page=1;render();});render();
  }

  const form=document.querySelector('#brief-form');if(!form)return;
  document.querySelectorAll('[data-service-choice]').forEach(a=>a.addEventListener('click',()=>{
    const option=[...form.querySelectorAll('input[name=service]')].find(i=>i.value===a.dataset.serviceChoice);if(option)option.checked=true;
  }));
  const config=window.COLAB_CONTACT||{},whatsapp=String(config.whatsapp||'').replace(/\D/g,''),email=String(config.email||'').trim();
  const connected=whatsapp.length>=8||/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if(connected){document.querySelector('#submit-label').textContent='Preparar mi consulta';document.querySelector('#contact-notice').textContent=whatsapp?'Prepararemos tu mensaje para WhatsApp. Podrás revisarlo antes de enviarlo.':'Prepararemos tu consulta para tu aplicación de correo. Podrás revisarla antes de enviarla.';}
  form.addEventListener('submit',e=>{
    e.preventDefault();const d=new FormData(form),get=k=>String(d.get(k)||'').trim();
    if(!get('name')||!get('brand')||!get('message')){const id=!get('name')?'name':!get('brand')?'brand':'message';document.querySelector('#brief-'+id).focus();return;}
    const message=`¡Hola, Colab! Soy ${get('name')}, de ${get('brand')}.\n\nMe interesa: ${get('service')}.\nCorreo: ${get('email')}${get('phone')?'\nWhatsApp: '+get('phone'):''}${get('website')?'\nWeb actual: '+get('website'):''}\n\n${get('message')}`;
    document.querySelector('#brief-output').value=message;
    const link=document.querySelector('#send-brief');
    if(connected){link.hidden=false;link.href=whatsapp?'https://wa.me/'+whatsapp+'?text='+encodeURIComponent(message):'mailto:'+email+'?subject='+encodeURIComponent('Proyecto web · '+get('brand'))+'&body='+encodeURIComponent(message);link.textContent=whatsapp?'Abrir WhatsApp':'Abrir correo';}
    const result=document.querySelector('#brief-result');result.hidden=false;document.querySelector('#copy-status').textContent='';result.scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'nearest'});
  });
  // Invalidate a prepared enquiry after edits so stale contact details cannot be sent accidentally.
  form.addEventListener('input',e=>{if(e.target.closest('#brief-result'))return;document.querySelector('#brief-result').hidden=true;document.querySelector('#send-brief').removeAttribute('href');});
  document.querySelector('#copy-brief').addEventListener('click',async()=>{
    const output=document.querySelector('#brief-output');try{await navigator.clipboard.writeText(output.value);document.querySelector('#copy-status').textContent='Consulta copiada. No se ha enviado.';}catch{output.focus();output.select();document.querySelector('#copy-status').textContent='Puedes copiar el texto seleccionado con el menú de tu dispositivo.';}
  });
})();
