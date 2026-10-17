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

  // The visible portfolio is animated automatically; offscreen websites are unloaded.
  const previewState=new Map(),previewVisuals=[...document.querySelectorAll('[data-preview]')];
  let previewFrame=0;
  const saveData=!!navigator.connection?.saveData;
  function stopPreview(visual){
    const state=previewState.get(visual);if(!state)return;
    state.frame.remove();previewState.delete(visual);visual.classList.remove('is-live');visual.querySelector('.live-indicator').hidden=true;
  }
  function startPreview(visual){
    if(previewState.has(visual))return;
    const stage=visual.querySelector('.live-stage'),screen=visual.querySelector('.preview-screen');
    stage.style.setProperty('--preview-scale',screen.clientWidth/1280);
    const frame=document.createElement('iframe');frame.title='Vista animada de '+visual.dataset.preview;frame.tabIndex=-1;
    frame.setAttribute('sandbox','allow-scripts allow-same-origin');frame.setAttribute('referrerpolicy','no-referrer');frame.setAttribute('allow','autoplay');
    const state={frame};previewState.set(visual,state);
    frame.addEventListener('load',()=>{if(previewState.get(visual)!==state)return;visual.classList.add('is-live');visual.querySelector('.live-indicator').hidden=false;});
    frame.src=visual.dataset.previewUrl;stage.append(frame);
  }
  function syncPreviews(){
    previewFrame=0;
    if(reduced.matches||saveData||document.hidden){[...previewState.keys()].forEach(stopPreview);return;}
    const height=innerHeight;
    const candidates=previewVisuals.map(visual=>{const rect=visual.getBoundingClientRect();const overlap=Math.max(0,Math.min(rect.bottom,height)-Math.max(rect.top,80));return {visual,rect,overlap};}).filter(({visual,rect,overlap})=>!visual.closest('[hidden]')&&rect.width>0&&overlap>Math.min(120,rect.height*.25)).sort((a,b)=>b.overlap-a.overlap);
    const limit=matchMedia('(max-width:760px)').matches?1:3;
    const desired=new Set(candidates.slice(0,limit).map(c=>c.visual));
    [...previewState.keys()].forEach(v=>{if(!desired.has(v))stopPreview(v);});desired.forEach(startPreview);
  }
  function schedulePreviews(){if(!previewFrame)previewFrame=requestAnimationFrame(syncPreviews);}
  previewVisuals.forEach(visual=>{const screen=visual.querySelector('.preview-screen'),stage=visual.querySelector('.live-stage');if('ResizeObserver'in window)new ResizeObserver(()=>{stage.style.setProperty('--preview-scale',screen.clientWidth/1280);schedulePreviews();}).observe(screen);});
  addEventListener('scroll',schedulePreviews,{passive:true});addEventListener('resize',schedulePreviews);document.addEventListener('visibilitychange',schedulePreviews);reduced.addEventListener('change',schedulePreviews);schedulePreviews();

  // A scroll-linked line connects the actual three project stages.
  const process=document.querySelector('.process');
  const updateProcess=()=>{if(!process)return;const r=process.getBoundingClientRect();const progress=Math.min(1,Math.max(0,(innerHeight*.82-r.top)/Math.max(r.height*.75,1)));process.style.setProperty('--process-progress',progress);};
  let processFrame=0;addEventListener('scroll',()=>{if(!processFrame)processFrame=requestAnimationFrame(()=>{updateProcess();processFrame=0;});},{passive:true});updateProcess();
  // Freeze decorative loops outside the viewport.
  if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('motion-in-view',e.isIntersecting)));document.querySelectorAll('.idea-scene,.conversation-art,.marquee').forEach(el=>observer.observe(el));}

  // Catalog starts with a few entries and supports filtering and pagination as it grows.
  const search=document.querySelector('#project-search');
  if(search){
    const cards=[...document.querySelectorAll('.catalog-grid .project-card')],filters=[...document.querySelectorAll('[data-filter]')],pagination=document.querySelector('#pagination');
    let sector='all',page=1;const perPage=12;
    const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    function render(){
      [...previewState.keys()].forEach(stopPreview);
      const query=normalize(search.value.trim()),matches=cards.filter(c=>(sector==='all'||c.dataset.sector===sector)&&normalize(c.dataset.search).includes(query));
      const pages=Math.ceil(matches.length/perPage);page=Math.max(1,Math.min(page,pages||1));
      cards.forEach(c=>c.hidden=true);matches.slice((page-1)*perPage,page*perPage).forEach(c=>{c.hidden=false;c.classList.add('in-view');});
      document.querySelector('#catalog-count').textContent=matches.length+' '+(matches.length===1?'proyecto':'proyectos');document.querySelector('#catalog-empty').hidden=matches.length>0;
      pagination.replaceChildren();pagination.hidden=pages<2;schedulePreviews();
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
