(() => {
  'use strict';
  const lab=document.querySelector('#project-lab');
  if(!lab)return;
  const canvas=lab.querySelector('#project-scene'),ctx=canvas.getContext('2d');
  if(!ctx)return;
  const tabs=[...lab.querySelectorAll('.lab-tab')],panels=[...lab.querySelectorAll('.lab-panel')];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const colors={orange:'#ff6b00',olive:'#4a412a',black:'#282c22',ivory:'#f5f1e8',sand:'#c9c6b2',sage:'#9ca580'};
  const definitions={ghas:['THE DAILY MATRIX','GHAS 알리미'], 'suffice-patch':['THE CONTEXT ENGINE','SufficePatch'],ktspace:['THE EXPERIMENT RIG','KTspace'],gcpt:['THE CONVERSATION','GCPT'],lhlinux:['THE OPEN STACK','lhLinux']};
  let active='ghas',width=0,height=0,frame=0,visible=true,drag=null;
  let yaw=-.55,pitch=.45,targetYaw=yaw,targetPitch=pitch,entrance=1,lastTime=0;
  let primitives=[],textureCache=new Map();
  const add=(a,b)=>a.map((v,i)=>v+b[i]);
  const sub=(a,b)=>a.map((v,i)=>v-b[i]);
  const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
  const unit=a=>{const d=Math.hypot(...a)||1;return a.map(v=>v/d);};
  function rotate(v,y=0,z=0){const cy=Math.cos(y),sy=Math.sin(y),cz=Math.cos(z),sz=Math.sin(z);const a=[v[0]*cy+v[2]*sy,v[1],-v[0]*sy+v[2]*cy];return[a[0]*cz-a[1]*sz,a[0]*sz+a[1]*cz,a[2]];}
  function camera(v){const a=rotate(v,yaw);const cp=Math.cos(pitch),sp=Math.sin(pitch);return[a[0],a[1]*cp-a[2]*sp,a[1]*sp+a[2]*cp];}
  function project(v){const p=camera(v);const s=Math.min(width*.22,height*.28)*(7.5/(7.5-p[2]));return{x:width*.5+p[0]*s,y:height*.53-p[1]*s,z:p[2]};}
  function tint(hex,normal){const light=unit([-.4,.9,.7]);const factor=.58+Math.max(0,dot(normal,light))*.42;const rgb=hex.match(/[a-f\d]{2}/gi).map(c=>Math.min(255,Math.round(parseInt(c,16)*factor)));return`rgb(${rgb.join(',')})`;}
  function texture(title,subline='',color=colors.black){
    const key=[title,subline,color].join('|');if(textureCache.has(key))return textureCache.get(key);
    const c=document.createElement('canvas');c.width=768;c.height=384;const t=c.getContext('2d');t.fillStyle=color;t.textAlign='center';t.textBaseline='middle';t.font='900 98px Nacelle, Pretendard, Arial';t.fillText(title,384,subline?155:195,660);
    if(subline){t.font='28px SFMono-Regular, Consolas, monospace';t.globalAlpha=.7;t.fillText(subline,384,260,650);}
    textureCache.set(key,c);return c;
  }
  function box(center,size,color,opts={}){
    const [a,b,c]=size.map(n=>n/2);
    const verts=[[-a,-b,-c],[a,-b,-c],[a,b,-c],[-a,b,-c],[-a,-b,c],[a,-b,c],[a,b,c],[-a,b,c]].map(v=>add(rotate(v,opts.ry||0,opts.rz||0),center));
    const faces=[{i:[4,5,6,7],tex:opts.front,uv:[7,6,5,4]},{i:[1,0,3,2]},{i:[3,7,6,2],tex:opts.top,uv:[3,2,6,7]},{i:[0,1,5,4]},{i:[0,4,7,3]},{i:[5,1,2,6]}];
    for(const f of faces){const vs=f.i.map(i=>verts[i]);primitives.push({type:'face',v:vs,n:unit(cross(sub(vs[1],vs[0]),sub(vs[2],vs[0]))),color,texture:f.tex,uv:f.uv?.map(i=>verts[i])});}
  }
  function line(points,color=colors.olive,lineWidth=1.4,dash=false){primitives.push({type:'line',v:points,color,lineWidth,dash});}
  function cylinder(center,r,h,color){
    const n=24,top=[],bottom=[];
    for(let i=0;i<n;i++){const a=i/n*Math.PI*2;top.push(add(center,[Math.cos(a)*r,h/2,Math.sin(a)*r]));bottom.push(add(center,[Math.cos(a)*r,-h/2,Math.sin(a)*r]));}
    primitives.push({type:'face',v:top,n:[0,1,0],color});
    for(let i=0;i<n;i++){const j=(i+1)%n,v=[bottom[j],bottom[i],top[i],top[j]];primitives.push({type:'face',v,n:unit(cross(sub(v[1],v[0]),sub(v[2],v[0]))),color});}
  }
  function octa(center,r,color){const v=[[r,0,0],[-r,0,0],[0,r,0],[0,-r,0],[0,0,r],[0,0,-r]].map(p=>add(p,center));for(const ids of [[2,4,0],[2,0,5],[2,5,1],[2,1,4],[3,0,4],[3,5,0],[3,1,5],[3,4,1]]){const p=ids.map(i=>v[i]);primitives.push({type:'face',v:p,n:unit(cross(sub(p[1],p[0]),sub(p[2],p[0]))),color});}}
  function build(id){
    primitives=[];
    // Each model represents its program's structure with a different silhouette.
    if(id==='ghas'){
      box([0,-.74,0],[3,.16,2.45],colors.olive);
      const labels=['MON','TUE','WED','MEAL','THU','FRI','01','02','03'];
      for(let i=0;i<9;i++){const x=(i%3-1)*.87,z=(Math.floor(i/3)-1)*.72,h=i===3?.74:.2+(i%3)*.09;box([x,-.53+h/2,z],[.72,h,.57],i===3?colors.orange:colors.ivory,{top:texture(labels[i],'',colors.olive)});}
      box([.05,1.05,-.6],[2.9,.82,.12],colors.ivory,{front:texture('GHAS','MEALS + TIMETABLE')});
      line([[-1.15,-.6,-.95],[-1.15,.55,-.95],[-.7,.55,-.95]],colors.olive,1.5,true);
      line([[1.15,-.6,-.95],[1.15,.55,-.95],[.7,.55,-.95]],colors.olive,1.5,true);
    }else if(id==='suffice-patch'){
      box([0,-.85,0],[3.5,.12,2.55],colors.sand);
      const labels=['SOURCE','RULES','TESTS','DIFF'];
      for(let i=0;i<4;i++){const x=-1.13+i*.76,y=-.57+i*.29;box([x,y,0],[.69,.12,1.76],i===3?colors.orange:colors.ivory,{top:texture(labels[i],'',colors.olive)});box([x,y+.04,-.78],[.3,.14,.19],i===3?colors.orange:colors.ivory);}
      box([0,1.1,-.18],[2.1,.72,.12],colors.black,{front:texture('CONTEXT','BEFORE YOU CODE',colors.ivory)});
      line([[-1.13,-.43,.8],[-1.13,.93,.8],[.1,.93,.8],[.1,.74,.8]],colors.orange,2);
      octa([1.68,.49,.5],.28,colors.orange);
    }else if(id==='ktspace'){
      box([0,-.75,0],[3.3,.16,2.55],colors.ivory);
      box([0,-.55,0],[2.78,.23,2.05],colors.olive,{top:texture('EXPERIMENT','MASS / DISTANCE / LIGHT',colors.ivory)});
      line([[-1.2,-.38,-.8],[-1.2,1.1,-.8],[1.2,1.1,-.8],[1.2,-.38,-.8]],colors.olive,2.5);
      line([[0,1.1,-.8],[0,.7,-.15]],colors.olive,1.3,true);
      octa([0,.45,0],.58,colors.orange);
      for(let i=0;i<3;i++){cylinder([-1+i,-.34,1.05],.22,.13,i===1?colors.orange:colors.sage);line([[-1+i,-.23,1.05],[-.86+i,-.23,1.05]],colors.black,2);}
      box([0,1.44,-.8],[2.55,.45,.1],colors.ivory,{front:texture('KTspace','')});
    }else if(id==='gcpt'){
      box([0,-.8,0],[3.3,.13,2.7],colors.sand);
      const cols=[[-1,-.04,.4,colors.olive,'GPT'],[.05,.3,-.7,colors.orange,'CLAUDE'],[1.08,-.04,.45,colors.sage,'GEMINI']];
      for(const [x,y,z,c,label] of cols){box([x,y,z],[.88,1.25,.18],c,{front:texture(label,'',c===colors.olive?colors.ivory:colors.black),ry:x*.14});box([x,-.63,z],[1.02,.12,.72],c);}
      line([[-1,-.55,.4],[0,-.55,.9],[1.08,-.55,.45]],colors.olive,2);
      line([[0,-.55,.9],[.05,-.55,-.7]],colors.olive,2);
      octa([.05,.18,.65],.23,colors.ivory);
      box([0,1.2,0],[1.65,.42,.1],colors.ivory,{front:texture('GCPT','')});
    }else{
      const levels=[[-.73,colors.olive,'UBUNTU'],[-.33,colors.ivory,'WSL2'],[.07,colors.sage,'OPEN SOURCE']];
      for(const [y,c,label]of levels)box([0,y,0],[2.85,.2,1.95],c,{front:texture(label,'',c===colors.olive?colors.ivory:colors.black)});
      box([-.58,1.02,.05],[.82,.19,.35],colors.orange,{rz:-.68});
      box([-.58,.52,.05],[.82,.19,.35],colors.orange,{rz:.68});
      box([.49,.35,.05],[.88,.16,.35],colors.orange);
      box([0,1.77,-.3],[2.1,.48,.1],colors.ivory,{front:texture('lhLinux','')});
      line([[-1.18,-.73,-.8],[-1.18,.15,-.8]],colors.olive,1.2,true);
      line([[1.18,-.73,-.8],[1.18,.15,-.8]],colors.olive,1.2,true);
    }
  }
  function path(points){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();}
  function paintTexture(texture,quad){const [a,b,,d]=quad;ctx.save();path(quad);ctx.clip();ctx.transform((b.x-a.x)/texture.width,(b.y-a.y)/texture.width,(d.x-a.x)/texture.height,(d.y-a.y)/texture.height,a.x,a.y);ctx.drawImage(texture,0,0);ctx.restore();}
  function render(){
    if(!width||!height)return;
    ctx.clearRect(0,0,width,height);
    const shadow=ctx.createRadialGradient(width*.51,height*.67,3,width*.51,height*.67,width*.35);shadow.addColorStop(0,'rgba(50,45,27,.16)');shadow.addColorStop(1,'rgba(50,45,27,0)');ctx.save();ctx.translate(0,height*.4);ctx.scale(1,.45);ctx.fillStyle=shadow;ctx.fillRect(0,0,width,height*2);ctx.restore();
    ctx.lineWidth=.65;ctx.strokeStyle='rgba(74,65,42,.11)';
    for(let i=-5;i<=5;i++){const a=project([i*.6,-.96,-3]),b=project([i*.6,-.96,3]),c=project([-3,-.96,i*.6]),d=project([3,-.96,i*.6]);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.moveTo(c.x,c.y);ctx.lineTo(d.x,d.y);ctx.stroke();}
    const faces=primitives.map(p=>({...p,points:p.v.map(project),depth:p.v.reduce((sum,v)=>sum+camera(v)[2],0)/p.v.length})).filter(p=>p.type!=='face'||camera(p.n)[2]>.005).sort((a,b)=>a.depth-b.depth);
    ctx.globalAlpha=entrance;
    for(const f of faces){
      if(f.type==='line'){ctx.beginPath();f.points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.strokeStyle=f.color;ctx.lineWidth=f.lineWidth;ctx.setLineDash(f.dash?[4,5]:[]);ctx.stroke();ctx.setLineDash([]);continue;}
      path(f.points);ctx.fillStyle=tint(f.color,f.n);ctx.fill();ctx.strokeStyle='rgba(55,51,32,.16)';ctx.lineWidth=.65;ctx.stroke();
      if(f.texture&&f.uv)paintTexture(f.texture,f.uv.map(project));
    }
    ctx.globalAlpha=1;
  }
  function tick(time){
    frame=0;if(!visible||document.hidden)return;
    const dt=Math.min(50,time-lastTime||16);lastTime=time;
    const easing=reduced.matches?1:1-Math.pow(.84,dt/16);
    yaw+=(targetYaw-yaw)*easing;pitch+=(targetPitch-pitch)*easing;entrance=Math.min(1,entrance+dt/450);render();
    if(Math.abs(targetYaw-yaw)>.001||Math.abs(targetPitch-pitch)>.001||entrance<1)frame=requestAnimationFrame(tick);
  }
  function requestRender(){if(!frame&&visible)frame=requestAnimationFrame(tick);}
  function resize(){const r=canvas.getBoundingClientRect();width=r.width;height=r.height;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);render();}
  function select(id,focus=false){
    if(!definitions[id])return;active=id;
    tabs.forEach(tab=>{const on=tab.dataset.labProject===id;tab.setAttribute('aria-selected',String(on));tab.tabIndex=on?0:-1;if(on&&focus)tab.focus();});
    panels.forEach(panel=>{panel.hidden=panel.id!=='panel-'+id;});
    const index=tabs.findIndex(t=>t.dataset.labProject===id);lab.querySelector('#lab-stage-name').textContent=`0${index+1} / ${definitions[id][0]}`;
    canvas.setAttribute('aria-label',definitions[id][1]+' 3D 조형. 드래그하거나 방향키로 회전할 수 있습니다.');
    lab.querySelector('#lab-status').textContent=definitions[id][1]+' 입체 구조와 프로젝트 소개를 표시합니다.';
    targetYaw=-.55;targetPitch=.45;entrance=reduced.matches?1:.25;build(id);requestRender();
  }
  tabs.forEach((tab,i)=>{
    tab.addEventListener('click',()=>select(tab.dataset.labProject));
    tab.addEventListener('keydown',event=>{let next=i;if(['ArrowDown','ArrowRight'].includes(event.key))next=(i+1)%tabs.length;else if(['ArrowUp','ArrowLeft'].includes(event.key))next=(i-1+tabs.length)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;event.preventDefault();select(tabs[next].dataset.labProject,true);});
  });
  canvas.addEventListener('pointerdown',event=>{drag={x:event.clientX,y:event.clientY,yaw:targetYaw,pitch:targetPitch};if(event.pointerType==='mouse')canvas.setPointerCapture(event.pointerId);});
  canvas.addEventListener('pointermove',event=>{if(!drag)return;const dx=event.clientX-drag.x,dy=event.clientY-drag.y;if(event.pointerType!=='mouse'&&Math.abs(dy)>Math.abs(dx)+10){drag=null;return;}targetYaw=drag.yaw+dx*.009;targetPitch=Math.max(.12,Math.min(1.05,drag.pitch+dy*.005));requestRender();});
  const release=()=>{drag=null;};canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);canvas.addEventListener('lostpointercapture',release);
  canvas.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(event.key))return;event.preventDefault();if(event.key==='Home'){targetYaw=-.55;targetPitch=.45;}else if(event.key==='ArrowLeft')targetYaw-=.16;else if(event.key==='ArrowRight')targetYaw+=.16;else targetPitch=Math.max(.12,Math.min(1.05,targetPitch+(event.key==='ArrowDown'?.08:-.08)));requestRender();});
  lab.querySelector('#lab-reset').addEventListener('click',()=>{targetYaw=-.55;targetPitch=.45;requestRender();});
  reduced.addEventListener('change',()=>{yaw=targetYaw;pitch=targetPitch;entrance=1;requestRender();});
  lab.classList.add('is-ready');select('ghas');
  if('ResizeObserver'in window)new ResizeObserver(resize).observe(canvas);else window.addEventListener('resize',resize);
  if('IntersectionObserver'in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)requestRender();else{cancelAnimationFrame(frame);frame=0;}},{rootMargin:'100px'}).observe(canvas);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else requestRender();});
  document.fonts?.ready.then(()=>{textureCache.clear();build(active);requestRender();});resize();
})();
