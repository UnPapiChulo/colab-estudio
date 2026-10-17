(() => {
  const canvas = document.querySelector('#sculpture');
  const gl = canvas.getContext('webgl', { alpha:true, antialias:false, powerPreference:'low-power', premultipliedAlpha:false });
  if (!gl) return;
  const vertex = `attribute vec2 position;void main(){gl_Position=vec4(position,0.,1.);}`;
  const fragment = `precision highp float;
    uniform vec2 resolution;uniform float time;uniform vec2 pointer;
    mat2 rot(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);}
    float ring(vec3 p){return length(vec2(length(p.xy)-.88,p.z))-.32;}
    vec3 objectPoint(vec3 p){p.yz=rot(.28+pointer.y*.3)*p.yz;p.xz=rot(.4+sin(time*.18)*.2+pointer.x*.35)*p.xz;p.xy=rot(-.55+sin(time*.12)*.08)*p.xy;return p;}
    vec2 scene(vec3 p){p=objectPoint(p);vec3 a=p-vec3(-.47,0.,0.);a.yz=rot(.45)*a.yz;float d1=ring(a);vec3 b=p-vec3(.47,0.,.04);b.yz=rot(1.65)*b.yz;float d2=ring(b);return d1<d2?vec2(d1,0.):vec2(d2,1.);}
    vec3 normal(vec3 p){vec2 e=vec2(.002,0.);return normalize(vec3(scene(p+e.xyy).x-scene(p-e.xyy).x,scene(p+e.yxy).x-scene(p-e.yxy).x,scene(p+e.yyx).x-scene(p-e.yyx).x));}
    vec3 env(vec3 r){float sky=smoothstep(-.5,.7,r.y);vec3 col=mix(vec3(.13,.07,.19),vec3(.95,.91,.99),sky);col=mix(col,vec3(.63,.39,.92),smoothstep(.1,.8,r.x)*.8);col=mix(col,vec3(.82,.96,.51),smoothstep(-.1,-.8,r.x)*smoothstep(-.4,.6,r.z)*.8);float strip=pow(max(0.,1.-abs(r.y-.4)*3.5),6.);col+=vec3(.65,.62,.7)*strip;col+=vec3(.5)*pow(max(0.,dot(r,normalize(vec3(-1.,2.,2.)))),50.);return col;}
    void main(){vec2 uv=(gl_FragCoord.xy-.5*resolution)/resolution.y;vec3 ro=vec3(0.,0.,5.4);vec3 rd=normalize(vec3(uv*3.5,-4.7));float t=0.;vec2 hit=vec2(1.);for(int i=0;i<72;i++){hit=scene(ro+rd*t);if(hit.x<.0015||t>9.)break;t+=hit.x*.82;}if(t>9.||hit.x>.008){gl_FragColor=vec4(0.);return;}vec3 p=ro+rd*t,n=normal(p),refl=reflect(rd,n);float fres=pow(1.-max(0.,dot(n,-rd)),3.);float diffuse=max(0.,dot(n,normalize(vec3(-3.,4.,5.))));vec3 base=mix(vec3(.55,.31,.82),vec3(.72,.80,.42),hit.y);vec3 col=env(refl)*(.70+fres*.35)+base*(.14+diffuse*.2);float spec=pow(max(0.,dot(reflect(normalize(vec3(3.,-4.,-5.)),n),-rd)),60.);col+=spec*.5;float ao=clamp(scene(p+n*.15).x/.15,.55,1.);col*=ao;col=pow(col,vec3(.88));gl_FragColor=vec4(col,1.);}`;
  function shader(type, source) { const s=gl.createShader(type); gl.shaderSource(s,source); gl.compileShader(s); if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)) { gl.deleteShader(s); return null; } return s; }
  const vs=shader(gl.VERTEX_SHADER,vertex),fs=shader(gl.FRAGMENT_SHADER,fragment);if(!vs||!fs)return;
  const program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))return;
  gl.useProgram(program);const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const pos=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
  const loc={resolution:gl.getUniformLocation(program,'resolution'),time:gl.getUniformLocation(program,'time'),pointer:gl.getUniformLocation(program,'pointer')};
  let paused=document.documentElement.classList.contains('motion-paused'),visible=true,frame=0,elapsed=0,last=0;const target={x:0,y:0},mouse={x:0,y:0};
  function resize(){const r=canvas.getBoundingClientRect(),scale=Math.min(devicePixelRatio,1.25,800/r.width);canvas.width=Math.max(1,Math.round(r.width*scale));canvas.height=Math.max(1,Math.round(r.height*scale));gl.viewport(0,0,canvas.width,canvas.height);draw();}
  function draw(){gl.uniform2f(loc.resolution,canvas.width,canvas.height);gl.uniform1f(loc.time,elapsed);gl.uniform2f(loc.pointer,mouse.x,mouse.y);gl.drawArrays(gl.TRIANGLES,0,6);}
  function tick(now){frame=0;if(!visible||document.hidden||paused)return;if(now-last>32){elapsed+=Math.min((now-last)/1000,.05);last=now;mouse.x+=(target.x-mouse.x)*.045;mouse.y+=(target.y-mouse.y)*.045;draw();}frame=requestAnimationFrame(tick);}
  function sync(){if(frame){cancelAnimationFrame(frame);frame=0;}last=performance.now();if(!paused&&visible&&!document.hidden)frame=requestAnimationFrame(tick);else draw();}
  document.querySelector('.hero').addEventListener('pointermove',e=>{if(paused||e.pointerType==='touch')return;const r=canvas.getBoundingClientRect();target.x=Math.max(-1,Math.min(1,(e.clientX-r.left)/r.width*2-1));target.y=Math.max(-1,Math.min(1,(e.clientY-r.top)/r.height*2-1));},{passive:true});
  document.querySelector('.hero').addEventListener('pointerleave',()=>{target.x=target.y=0;});
  document.addEventListener('colab-motion',e=>{paused=e.detail.paused;sync();});document.addEventListener('visibilitychange',sync);
  if('IntersectionObserver'in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();}).observe(canvas);
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(frame);document.documentElement.classList.remove('webgl-ready');});
  if('ResizeObserver'in window)new ResizeObserver(resize).observe(canvas);else addEventListener('resize',resize);
  resize();document.documentElement.classList.add('webgl-ready');sync();
})();
