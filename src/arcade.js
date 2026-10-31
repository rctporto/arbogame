/* ================== FLIPERAMA: minijogos animados ================== */
const ARCADE = [
  {id:"esvazia", who:"L", nome:"Esvazia Já!", desc:"Toque nos recipientes cheios antes que as larvas virem mosquito.", cor:"var(--sky-soft)"},
  {id:"varre", who:"P", nome:"Varre-Varre", desc:"Arraste o dedo para varrer folhas e cascas antes que os maruins nasçam.", cor:"var(--sun-soft)"},
  {id:"coleta", who:"L", nome:"Coleta Certa", desc:"Mova a lixeira e pegue o lixo antes que ele vire criadouro.", cor:"var(--leaf-soft)"},
  {id:"espanta", who:"P", nome:"Espanta-Mosquito", desc:"De dia vem o Aedes, no entardecer vem o maruim. Proteja a família!", cor:"var(--coral-soft)"},
  {id:"memoria", who:"L", nome:"Jogo da Memória", desc:"Vire as cartas e encontre os pares. Cada par ensina uma dica.", cor:"var(--sky-soft)"},
];
Object.assign(MEDALS, {
  esvazia:{m:"💦", nome:"Mão rápida", desc:"150+ pts no Esvazia Já!"},
  varre:{m:"🧹", nome:"Vassoura de ouro", desc:"150+ pts no Varre-Varre"},
  coleta:{m:"♻️", nome:"Reciclador", desc:"150+ pts na Coleta Certa"},
  espanta:{m:"🛡️", nome:"Escudo da família", desc:"150+ pts no Espanta-Mosquito"},
  memoria:{m:"🧠", nome:"Memória de elefante", desc:"Completou o Jogo da Memória"},
});

/* ---------- som (Web Audio, liga no primeiro toque) ---------- */
let AC = null;
S.som = S.som !== false;
function sfx(tipo){
  if(!S.som) return;
  try{
    AC = AC || new (window.AudioContext||window.webkitAudioContext)();
    const o = AC.createOscillator(), g = AC.createGain(), t = AC.currentTime;
    const f = {pop:[520,880,.12,"triangle"], bad:[220,110,.25,"sawtooth"], win:[523,1046,.35,"square"], swoosh:[300,600,.08,"sine"], flip:[700,900,.06,"triangle"]}[tipo] || [440,440,.1,"sine"];
    o.type = f[3]; o.frequency.setValueAtTime(f[0], t); o.frequency.exponentialRampToValueAtTime(f[1], t+f[2]);
    g.gain.setValueAtTime(.12, t); g.gain.exponentialRampToValueAtTime(.001, t+f[2]+.05);
    o.connect(g).connect(AC.destination); o.start(t); o.stop(t+f[2]+.06);
  }catch(e){}
}

/* ---------- imagens dos personagens para o canvas ---------- */
const SPR = {};
function spr(nome){ if(!SPR[nome]){ SPR[nome]=new Image(); SPR[nome].src=IMG[nome]; } return SPR[nome]; }
const EMOJI = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
function emoji(ctx, e, x, y, size, rot=0, alpha=1){
  ctx.save(); ctx.globalAlpha=alpha; ctx.translate(x,y); if(rot) ctx.rotate(rot);
  ctx.fillStyle="#000"; ctx.font = `${size}px ${EMOJI}`; ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillText(e,0,0); ctx.restore();
}
function drawSpr(ctx, nome, x, y, h, flip=false, rot=0){
  const im = spr(nome); if(!im.complete || !im.naturalWidth) return;
  const w = h*im.naturalWidth/im.naturalHeight;
  ctx.save(); ctx.translate(x,y); if(rot) ctx.rotate(rot); if(flip) ctx.scale(-1,1); ctx.drawImage(im,-w/2,-h/2,w,h); ctx.restore();
}
const rnd = (a,b)=>a+Math.random()*(b-a);
const pick = a=>a[Math.floor(Math.random()*a.length)];

/* ---------- motor ---------- */
let ARC = null;
function stopArcade(){ if(ARC){ ARC.stop=true; cancelAnimationFrame(ARC.raf); window.removeEventListener("keydown",ARC.kd); window.removeEventListener("keyup",ARC.ku); ARC=null; } }

function arcade(cfg){
  stopArcade(); clearTimer();
  const W=800, H=500;
  const dur = cfg.dur || 60;
  app.innerHTML = head(cfg.titulo, `<div class="row hud"><span class="pill" id="hs">0 pts</span><span class="pill" id="hl"></span><span class="pill" id="ht">${dur}s</span></div>`) + `
    <div class="stage">
      <canvas id="cv" width="${W}" height="${H}" aria-label="${esc(cfg.titulo)}"></canvas>
      <div class="cover" id="cover">${av(cfg.who,"oi","coverav")}<p class="q">${cfg.intro}</p><button class="btn sun big" id="play">▶ Jogar</button></div>
    </div>
    <div id="tip" style="margin-top:12px">${guide(cfg.who,"",cfg.tip)}</div>`;
  bindBack();
  const cv=$("#cv"), ctx=cv.getContext("2d");
  const G = {W,H,t:0,time:dur,score:0,lives:cfg.lives||3,parts:[],texts:[],ptr:{x:W/2,y:H/2,down:false},keys:{},over:false,combo:0,lvl:S.idade};
  ARC = {stop:false};
  const hud=()=>{ $("#hs").textContent=G.score+" pts"; $("#hl").textContent="❤️".repeat(Math.max(0,G.lives))+"🤍".repeat(Math.max(0,(cfg.lives||3)-G.lives)); $("#ht").textContent=Math.ceil(G.time)+"s"; };
  G.pop=(x,y,txt,cor)=>G.texts.push({x,y,txt,cor:cor||"#1B8566",a:1});
  G.burst=(x,y,cor,n=14,sp=260,em)=>{ for(let i=0;i<n;i++){ const a=rnd(0,Math.PI*2), v=rnd(sp*.3,sp); G.parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-80,life:rnd(.4,.9),max:.9,cor,r:rnd(3,7),em}); } };
  G.add=(n,x,y)=>{ anel(G,x,y+40,"#FFC23D"); G.combo++; const bonus = G.combo>=5?2:1; G.score+=n*bonus; G.pop(x,y,`+${n*bonus}${bonus>1?" combo!":""}`); sfx("pop"); hud(); };
  G.hurt=(x,y,txt)=>{ G.lives--; G.combo=0; G.pop(x,y,txt||"Ai!","#D9482B"); sfx("bad"); hud(); cv.classList.remove("shake"); void cv.offsetWidth; cv.classList.add("shake"); };
  G.say=(html,mood)=>{ $("#tip").innerHTML=guide(cfg.who,mood||"",html); };
  cfg.init(G);
  hud();
  const toXY=e=>{ const r=cv.getBoundingClientRect(); return {x:(e.clientX-r.left)*W/r.width, y:(e.clientY-r.top)*H/r.height}; };
  cv.addEventListener("pointerdown",e=>{ if(G.over||!G.run) return; e.preventDefault(); cv.setPointerCapture(e.pointerId); const p=toXY(e); G.ptr={...p,down:true,px:p.x,py:p.y}; cfg.down&&cfg.down(G,p.x,p.y); });
  cv.addEventListener("pointermove",e=>{ if(!G.run) return; const p=toXY(e); G.ptr.px=G.ptr.x; G.ptr.py=G.ptr.y; G.ptr.x=p.x; G.ptr.y=p.y; cfg.move&&cfg.move(G,p.x,p.y); });
  const up=()=>{ G.ptr.down=false; cfg.up&&cfg.up(G); };
  cv.addEventListener("pointerup",up); cv.addEventListener("pointercancel",up);
  ARC.kd=e=>{ G.keys[e.key]=true; }; ARC.ku=e=>{ G.keys[e.key]=false; };
  window.addEventListener("keydown",ARC.kd); window.addEventListener("keyup",ARC.ku);

  let last=0;
  function frame(ts){
    if(ARC===null||ARC.stop) return;
    const dt=Math.min(.05,(ts-(last||ts))/1000); last=ts;
    if(G.run && !G.over){
      G.t+=dt; G.time-=dt; if(Math.ceil(G.time)!==Math.ceil(G.time+dt)) hud();
      cfg.update(G,dt);
      if(G.time<=0||G.lives<=0) end();
    }
    G.parts.forEach(p=>{ p.x+=p.vx*dt; p.y+=p.vy*dt; p.vy+=500*dt; p.life-=dt; }); G.parts=G.parts.filter(p=>p.life>0);
    G.texts.forEach(t=>{ t.y-=50*dt; t.a-=dt*.9; }); G.texts=G.texts.filter(t=>t.a>0);
    ctx.clearRect(0,0,W,H);
    cfg.draw(G,ctx);
    desenhaAneis(ctx,G,dt);
    G.parts.forEach(p=>{ ctx.globalAlpha=Math.max(0,p.life/p.max); if(p.art) art(ctx,p.art,p.x,p.y,p.r/18,p.life*6); else if(p.em) emoji(ctx,p.em,p.x,p.y,p.r*4); else { ctx.fillStyle=p.cor; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,7); ctx.fill(); } }); ctx.globalAlpha=1;
    G.texts.forEach(t=>{ ctx.globalAlpha=Math.max(0,t.a); const sc=t.a>.85?1+(1-t.a)*3:1.45-.45*Math.min(1,(1-t.a)*2); ctx.font=`800 ${Math.round(30*sc)}px "Baloo 2",system-ui,sans-serif`; ctx.textAlign="center"; ctx.lineWidth=6; ctx.strokeStyle="#fff"; ctx.strokeText(t.txt,t.x,t.y); ctx.fillStyle=t.cor; ctx.fillText(t.txt,t.x,t.y); }); ctx.globalAlpha=1;
    ARC.raf=requestAnimationFrame(frame);
  }
  ARC.raf=requestAnimationFrame(frame);
  $("#play").onclick=()=>{ sfx("swoosh"); $("#cover").hidden=true; G.run=true; };
  function end(){
    G.over=true; sfx(G.score>=150?"win":"swoosh");
    const pts=Math.min(80,Math.round(G.score/3));
    addPts(pts); finish(cfg.id); Ranking.salvar(cfg.id, G.score);
    if(G.score>=150) medal(cfg.id);
    setTimeout(()=>{ stopArcade(); confetti(G.score>=150);
      const msg = G.score>=150 ? cfg.win : cfg.lose;
      endScreen(cfg.titulo, msg, G.score, null, pts, cfg.who).onclick=GAMES[cfg.id]; }, 900);
  }
}

function confetti(on){
  if(!on || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const box=document.createElement("div"); box.className="confetti"; box.setAttribute("aria-hidden","true");
  const cores=["#FFC23D","#1B8566","#2F6FB5","#D9482B","#FEC504"];
  for(let i=0;i<60;i++){ const s=document.createElement("i"); s.style.left=rnd(0,100)+"%"; s.style.background=pick(cores); s.style.animationDelay=rnd(0,.6)+"s"; s.style.animationDuration=rnd(1.6,2.8)+"s"; s.style.transform=`rotate(${rnd(0,360)}deg)`; box.appendChild(s); }
  document.body.appendChild(box); setTimeout(()=>box.remove(),3600);
}

/* ---------- cenários ---------- */
function ceu(ctx,G,c1,c2){ const g=ctx.createLinearGradient(0,0,0,G.H); g.addColorStop(0,c1); g.addColorStop(1,c2); ctx.fillStyle=g; ctx.fillRect(0,0,G.W,G.H); }
function nuvem(ctx,x,y,s,cor="#fff"){ ctx.fillStyle=cor; ctx.beginPath(); ctx.arc(x,y,22*s,0,7); ctx.arc(x+26*s,y-10*s,28*s,0,7); ctx.arc(x+56*s,y,22*s,0,7); ctx.rect(x,y,56*s,22*s); ctx.fill(); }
function grama(ctx,G,y,c1="#6CC24A",c2="#4FA336"){ ctx.fillStyle=c1; ctx.fillRect(0,y,G.W,G.H-y); ctx.fillStyle=c2; for(let x=0;x<G.W;x+=18){ ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+6,y-12-Math.sin(x+G.t*2)*3); ctx.lineTo(x+12,y); ctx.fill(); } }
function cerca(ctx,G,y){ ctx.fillStyle="#E9D3A8"; for(let x=10;x<G.W;x+=46){ ctx.fillRect(x,y-70,30,70); ctx.beginPath(); ctx.moveTo(x,y-70); ctx.lineTo(x+15,y-86); ctx.lineTo(x+30,y-70); ctx.fill(); } ctx.fillRect(0,y-52,G.W,10); ctx.fillRect(0,y-24,G.W,10); }
function larva(ctx,x,y,t,s=1){ ctx.strokeStyle="#4a3520"; ctx.lineWidth=3*s; ctx.lineCap="round"; ctx.beginPath(); for(let i=0;i<=6;i++){ const yy=y-8*s+i*3*s; const xx=x+Math.sin(t*12+i*.9)*4*s; i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy); } ctx.stroke(); }
function mosquitinho(ctx,x,y,t,s=1,cor="#3a2a1a"){ ctx.save(); ctx.translate(x,y); ctx.fillStyle="rgba(200,230,255,.8)"; const b=Math.sin(t*60)*.5; ctx.beginPath(); ctx.ellipse(-6*s,-6*s,8*s,4*s,-.6+b,0,7); ctx.ellipse(6*s,-6*s,8*s,4*s,.6-b,0,7); ctx.fill(); ctx.fillStyle=cor; ctx.beginPath(); ctx.ellipse(0,0,4*s,9*s,0,0,7); ctx.fill(); ctx.restore(); }

/* ---------- 1. Esvazia Já! ---------- */
GAMES.esvazia = ()=>{
  const TIPOS=[["balde","balde"],["pneu","pneu"],["vaso","vaso"],["caixadagua","caixa d'água"],["lata","lata"],["pote","pote do pet"]];
  arcade({id:"esvazia", titulo:"Esvazia Já!", who:"L", dur:60,
    intro:"A chuva enche os recipientes do quintal. Toque neles para esvaziar antes que as larvas virem mosquitos!",
    tip:"Água parada vira berçário de mosquito em cerca de 7 dias. Esvaziar e esfregar quebra o ciclo!",
    win:"Quintal sequinho! Nenhum mosquito nasceu por sua causa.", lose:"Alguns mosquitos escaparam. Tente esvaziar mais rápido!",
    init(G){
      G.pots=TIPOS.map((t,i)=>({e:t[0],n:t[1],x:150+(i%3)*250,y:i<3?300:430,w:0,age:0,on:false}));
      G.spawn=1; G.voo=[]; G.gotas=[]; G.nuv=[{x:60,y:60},{x:420,y:90},{x:700,y:50}];
    },
    update(G,dt){
      const speed=1+G.t/40+(G.lvl-1)*.15;
      G.nuv.forEach(n=>{ n.x+=20*dt; if(n.x>G.W+60) n.x=-140; });
      G.spawn-=dt*speed;
      if(G.spawn<=0){ G.spawn=rnd(1.4,2.4); const livres=G.pots.filter(p=>!p.on); if(livres.length){ const p=pick(livres); p.on=true; p.w=0; p.age=0; G.gotas.push({x:p.x,y:0,tx:p.x,ty:p.y-30}); } }
      G.gotas.forEach(g=>{ g.y+=600*dt; if(g.y>=g.ty) G.burst(g.x,g.ty,"#7FC8FF",6,120); }); G.gotas=G.gotas.filter(g=>g.y<g.ty);
      G.pots.forEach(p=>{ if(!p.on) return; p.w=Math.min(1,p.w+dt*.8); p.age+=dt*speed;
        if(p.age>2.5 && !G.avisou){ G.avisou=true; G.say("Olha as larvas se mexendo! Toque rápido antes que virem mosquitos.","no"); }
        if(p.age>7){ p.on=false; p.w=0; G.voo.push({x:p.x,y:p.y-40,vx:rnd(-80,80)}); G.hurt(p.x,p.y-60,"Escapou um mosquito!"); } });
      G.voo.forEach(v=>{ v.y-=120*dt; v.x+=v.vx*dt+Math.sin(G.t*10)*2; }); G.voo=G.voo.filter(v=>v.y>-40);
    },
    down(G,x,y){
      const p=G.pots.find(p=>Math.hypot(p.x-x,p.y-y)<70);
      if(!p) return;
      if(p.on){ const n=p.age>4.5?20:p.age>2.5?15:10; G.burst(p.x,p.y-30,"#5DADE2",18); G.add(n,p.x,p.y-70); p.on=false; p.w=0; p.age=0; p.squash=.25; }
      else { G.pop(p.x,p.y-60,"seco ✓","#58766E"); }
    },
    draw(G,ctx){
      ceuBonito(ctx,G,"#6EC6FF","#D8F1FF");
      G.nuv.forEach((n,i)=>nuvemBonita(ctx,n.x,n.y,.9+i*.15));
      morros(ctx,G,215); cercaBonita(ctx,G,262); gramado(ctx,G,250);
      G.gotas.forEach(g=>{ ctx.fillStyle="#4DA8F0"; ctx.beginPath(); ctx.moveTo(g.x,g.y-16); ctx.quadraticCurveTo(g.x+10,g.y,g.x,g.y+8); ctx.quadraticCurveTo(g.x-10,g.y,g.x,g.y-16); ctx.fill(); shine(ctx,g.x-3,g.y-2,2,4,.7); });
      G.pots.forEach(p=>{
        const sq=p.squash>0?(p.squash-=1/60,1+Math.sin(p.squash*30)*.12):1;
        ctx.fillStyle="rgba(0,0,0,.12)"; ctx.beginPath(); ctx.ellipse(p.x,p.y+40,50,12,0,0,7); ctx.fill();
        const bob=p.on&&p.age>4.5?Math.sin(G.t*30)*2:0;
        ctx.save(); ctx.translate(p.x+bob,p.y); ctx.scale(sq,2-sq); art(ctx,p.e,0,0,1.05); ctx.restore();
        if(p.on){
          const r=30*p.w;
          agua(ctx,p.x,p.y-38,r+4,r*.4+3,G.t+p.x);
          if(p.age>2.5){ for(let i=0;i<3;i++) larva(ctx,p.x-14+i*14,p.y-36,G.t+i,.8); }
          if(p.age>4.5){ ctx.fillStyle="#D9482B"; ctx.font='800 22px "Baloo 2",sans-serif'; ctx.textAlign="center"; ctx.fillText("!",p.x+44,p.y-60+Math.sin(G.t*12)*4); }
          const pct=Math.min(1,p.age/7); ctx.fillStyle="rgba(0,0,0,.15)"; ctx.fillRect(p.x-40,p.y+52,80,8); ctx.fillStyle=pct>.64?"#D9482B":pct>.35?"#FFC23D":"#1B8566"; ctx.fillRect(p.x-40,p.y+52,80*pct,8);
        }
      });
      G.voo.forEach(v=>drawSpr(ctx,"listras-voando",v.x,v.y,64,v.vx<0,Math.sin(G.t*8)*.15));
    }
  });
};

/* ---------- 2. Varre-Varre ---------- */
GAMES.varre = ()=>{
  const FOLHAS=["folha","folhaverde","folha"], FRUTAS=["banana","coco","maca"];
  arcade({id:"varre", titulo:"Varre-Varre", who:"P", dur:60,
    intro:"Montes de folhas e montes de frutas apodrecendo no chão úmido viram berçário de maruim. Arraste o dedo por cima para varrer tudo para a compostagem!",
    tip:"Eu, o Pintas, nasço em lugares úmidos com folhas e frutas apodrecendo. Quintal limpo, nada de maruim!",
    win:"Que vassoura! O quintal ficou limpinho e nenhum maruim nasceu.", lose:"Alguns maruins nasceram. Varra os montinhos mais cedo!",
    init(G){ G.piles=[]; G.spawn=.5; G.trail=[]; G.swarms=[]; },
    update(G,dt){
      const speed=1+G.t/45+(G.lvl-1)*.15;
      G.spawn-=dt*speed;
      if(G.spawn<=0 && G.piles.length<7){ G.spawn=rnd(1,1.8); const fr=Math.random()<.5, tipos=fr?FRUTAS:FOLHAS; G.piles.push({x:rnd(80,G.W-160),y:rnd(220,G.H-60),hp:100,age:0,fruta:fr,items:Array.from({length:fr?3:5},()=>({e:pick(tipos),dx:rnd(-26,26),dy:rnd(-14,14),r:rnd(-.6,.6)}))}); }
      G.piles.forEach(p=>{ p.age+=dt*speed; if(p.age>8){ p.dead=true; G.swarms.push({x:p.x,y:p.y,t:0}); G.hurt(p.x,p.y-40,"Nasceram maruins!"); } });
      G.piles=G.piles.filter(p=>!p.dead);
      G.swarms.forEach(s=>s.t+=dt); G.swarms=G.swarms.filter(s=>s.t<2.5);
      G.trail.forEach(t=>t.a-=dt*3); G.trail=G.trail.filter(t=>t.a>0);
    },
    move(G,x,y){
      if(!G.ptr.down) return;
      G.trail.push({x,y,a:1});
      const d=Math.hypot(x-G.ptr.px,y-G.ptr.py);
      G.piles.forEach(p=>{ if(Math.hypot(p.x-x,p.y-y)<60){ p.hp-=d*1.1; p.shake=.15; if(Math.random()<.3) G.burst(p.x,p.y,"#8B5A2B",3,150); if(p.hp<=0 && !p.dead){ p.dead=true; G.add(p.age>5?15:10,p.x,p.y-40); sfx("swoosh"); anel(G,p.x,p.y,"#FFD93D"); for(let i=0;i<6;i++) G.parts.push({x:p.x,y:p.y,vx:(G.W-70-p.x)*rnd(.9,1.3),vy:(G.H-70-p.y)*1.2-250,life:1,max:1,r:9,art:pick(p.fruta?FRUTAS:FOLHAS)}); } } });
      G.piles=G.piles.filter(p=>!p.dead);
    },
    draw(G,ctx){
      ceuBonito(ctx,G,"#FFD98A","#FFF3D1");
      nuvemBonita(ctx,(G.t*12)%(G.W+200)-150,60,.8);
      morros(ctx,G,200,"#A8C97F","#8DB866");
      bananeira(ctx,70,215,1,G.t); arvore(ctx,G.W-200,212,1.1,G.t);
      ctx.fillStyle=grad(ctx,0,200,0,G.H,["#8E6236","#6E4826"]); ctx.fillRect(0,200,G.W,G.H-200);
      for(let i=0;i<46;i++){ ctx.fillStyle=i%3?"rgba(60,35,15,.25)":"rgba(255,230,180,.12)"; ctx.beginPath(); ctx.ellipse((i*97)%G.W,214+(i*53)%(G.H-214),18+(i%4)*8,5,0,0,7); ctx.fill(); }
      ctx.fillStyle="rgba(90,160,220,.45)"; ctx.beginPath(); ctx.ellipse(200,G.H-40,70,14,0,0,7); ctx.fill();
      ctx.fillStyle="#2F8F4E"; rr(ctx,G.W-124,G.H-116,108,96,10); ctx.fill(); ctx.fillStyle="#256F3D"; rr(ctx,G.W-130,G.H-124,120,16,6); ctx.fill();
      ctx.fillStyle="#fff"; ctx.font='800 15px "Baloo 2",sans-serif'; ctx.textAlign="center"; ctx.fillText("COMPOSTAGEM",G.W-70,G.H-32); art(ctx,"folhaverde",G.W-70,G.H-74,.7,.4);
      G.piles.forEach(p=>{ const sh=p.shake>0?(p.shake-=1/60,rnd(-4,4)):0; const sc=Math.max(.4,p.hp/100);
        ctx.fillStyle="rgba(40,20,5,.3)"; ctx.beginPath(); ctx.ellipse(p.x,p.y+18,50*sc+10,14*sc+4,0,0,7); ctx.fill();
        p.items.forEach(it=>art(ctx,it.e,p.x+it.dx*sc+sh,p.y+it.dy*sc,.55*sc+.15,it.r));
        if(p.fruta){ // frutas apodrecendo: manchas escuras e cheirinho
          ctx.fillStyle="rgba(70,45,10,.55)"; p.items.forEach((it,k)=>{ ctx.beginPath(); ctx.arc(p.x+it.dx*sc+sh+5-k*4,p.y+it.dy*sc+4,4+k,0,7); ctx.fill(); });
          ctx.strokeStyle="rgba(120,160,60,.7)"; ctx.lineWidth=3; for(let k=0;k<3;k++){ const xx=p.x-14+k*14, yy=p.y-26; ctx.beginPath(); ctx.moveTo(xx,yy); for(let j=1;j<=4;j++) ctx.lineTo(xx+Math.sin(G.t*4+j+k)*4,yy-j*6); ctx.stroke(); } }
        { const rot=p.fruta?"frutas podres":"folhas"; ctx.font='800 13px "Baloo 2",sans-serif'; const lw=ctx.measureText(rot).width+18;
          ctx.fillStyle="rgba(255,255,255,.88)"; rr(ctx,p.x-lw/2,p.y+24,lw,19,9.5); ctx.fill(); ctx.fillStyle=p.fruta?"#8E4B1F":"#3B6B22"; ctx.textAlign="center"; ctx.fillText(rot,p.x,p.y+38); }
        if(p.age>4){ for(let i=0;i<3;i++) ctx.fillStyle="#333", ctx.beginPath(), ctx.arc(p.x+Math.sin(G.t*8+i*2)*30,p.y-30+Math.cos(G.t*7+i)*12,2.5,0,7), ctx.fill(); }
        const pct=Math.min(1,p.age/8); ctx.fillStyle=pct>.6?"#D9482B":"#FFC23D"; ctx.beginPath(); ctx.arc(p.x+40,p.y-34,8,-Math.PI/2,-Math.PI/2+pct*Math.PI*2); ctx.lineTo(p.x+40,p.y-34); ctx.fill(); });
      G.swarms.forEach(s=>{ for(let i=0;i<14;i++){ const a=i+s.t*4; ctx.fillStyle="#222"; ctx.beginPath(); ctx.arc(s.x+Math.cos(a)*(20+s.t*60),s.y-s.t*80+Math.sin(a*1.3)*20,2.5,0,7); ctx.fill(); } drawSpr(ctx,"pintas-bravo",s.x,s.y-s.t*60-30,54); });
      if(G.trail.length>1){ ctx.lineCap="round"; for(let i=1;i<G.trail.length;i++){ const a=G.trail[i-1], b=G.trail[i]; ctx.strokeStyle=`rgba(255,220,120,${b.a})`; ctx.lineWidth=26*b.a; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); } }
      if(G.ptr.down){ ctx.save(); ctx.translate(G.ptr.x+18,G.ptr.y-18); ctx.rotate(-.6+Math.sin(G.t*20)*.15); ctx.fillStyle="#A0522D"; ctx.fillRect(-3,-60,6,60); ctx.fillStyle="#F4C542"; ctx.beginPath(); ctx.moveTo(-16,0); ctx.lineTo(16,0); ctx.lineTo(22,28); ctx.lineTo(-22,28); ctx.fill(); ctx.strokeStyle=INK; ctx.lineWidth=2.5; ctx.stroke(); ctx.restore(); }
    }
  });
};

/* ---------- 3. Coleta Certa ---------- */
GAMES.coleta = ()=>{
  const LIXO=[["lata","Lata"],["tampinha","Tampinha"],["iogurte","Potinho"],["pneu","Pneu"],["copo","Copo"],["balde","Balde velho"]];
  arcade({id:"coleta", titulo:"Coleta Certa", who:"L", dur:60,
    intro:"Lixo jogado no chão junta água da chuva. Mova a lixeira (dedo, mouse ou setas) e pegue tudo que cair!",
    tip:"Latas, tampinhas e potinhos jogados no quintal viram criadouros. Lugar de lixo é na lixeira!",
    win:"Coleta perfeita! Nada de lixo virando criadouro.", lose:"Muito lixo caiu no chão. Tente de novo!",
    init(G){ G.bin={x:G.W/2,w:120}; G.items=[]; G.spawn=.6; G.poças=[]; },
    update(G,dt){
      const speed=1+G.t/35+(G.lvl-1)*.2;
      if(G.keys.ArrowLeft) G.bin.x-=520*dt; if(G.keys.ArrowRight) G.bin.x+=520*dt;
      if(G.ptr.down||matchMedia("(pointer:fine)").matches) G.bin.x+= (G.ptr.x-G.bin.x)*Math.min(1,dt*14);
      G.bin.x=Math.max(60,Math.min(G.W-60,G.bin.x));
      G.spawn-=dt*speed;
      if(G.spawn<=0){ G.spawn=rnd(.7,1.2); const it=pick(LIXO); const vida=Math.random()<.08 && G.lives<3; G.items.push({e:vida?"repelente":it[0],n:vida?"Repelente: +1 vida":it[1],x:rnd(40,G.W-40),y:-30,vy:rnd(120,170)*speed,r:0,vr:rnd(-3,3),vida}); }
      G.items.forEach(it=>{ it.y+=it.vy*dt; it.r+=it.vr*dt;
        if(it.y>G.H-80 && it.y<G.H-40 && Math.abs(it.x-G.bin.x)<G.bin.w/2+10){ it.done=true; if(it.vida){ G.lives=Math.min(3,G.lives+1); G.pop(it.x,it.y-30,"+1 ❤️","#D9482B"); sfx("win"); } else { G.add(10,it.x,it.y-40); G.burst(it.x,G.H-80,"#1B8566",10,200); } G.bin.bump=.2; }
        if(it.y>G.H-20 && !it.done){ it.done=true; if(!it.vida){ G.poças.push({x:it.x,e:it.e,t:0}); G.hurt(it.x,G.H-60,`${it.n} no chão!`); } } });
      G.items=G.items.filter(i=>!i.done);
      G.poças.forEach(p=>p.t+=dt); G.poças=G.poças.filter(p=>p.t<3);
    },
    draw(G,ctx){
      ceuBonito(ctx,G,"#7CCBFF","#E3F5FF");
      nuvemBonita(ctx,(G.t*18)%(G.W+200)-160,70,.9); nuvemBonita(ctx,(G.t*10+400)%(G.W+200)-160,120,.7);
      morros(ctx,G,G.H-60); arvore(ctx,60,G.H-40,.8,G.t); arvore(ctx,G.W-60,G.H-40,.9,G.t+1);
      ctx.fillStyle=grad(ctx,0,G.H-44,0,G.H,["#D8C7A6","#BFA982"]); ctx.fillRect(0,G.H-44,G.W,44);
      ctx.fillStyle="rgba(255,255,255,.5)"; for(let x=20;x<G.W;x+=80) ctx.fillRect(x,G.H-24,40,5);
      G.poças.forEach(p=>{ agua(ctx,p.x,G.H-22,42,10,G.t); art(ctx,p.e,p.x,G.H-34,.45,.5); mosquitinho(ctx,p.x+Math.sin(G.t*6)*20,G.H-60-p.t*40,G.t,1.4); });
      G.items.forEach(it=>{ ctx.fillStyle="rgba(0,0,0,.08)"; ctx.beginPath(); ctx.ellipse(it.x,G.H-30,Math.max(1,18*(it.y/G.H)),5,0,0,7); ctx.fill(); art(ctx,it.e,it.x,it.y,.62,it.r); if(it.vida){ ctx.strokeStyle="#FFC23D"; ctx.lineWidth=3; ctx.beginPath(); ctx.arc(it.x,it.y,34+Math.sin(G.t*10)*3,0,7); ctx.stroke(); } });
      const b=G.bin, by=G.H-60, bump=b.bump>0?(b.bump-=1/60, Math.sin(b.bump*40)*5):0;
      ctx.fillStyle="rgba(0,0,0,.18)"; ctx.beginPath(); ctx.ellipse(b.x,by+32,b.w/2+6,8,0,0,7); ctx.fill();
      ctx.beginPath(); ctx.moveTo(b.x-b.w/2,by-30+bump); ctx.lineTo(b.x+b.w/2,by-30+bump); ctx.lineTo(b.x+b.w/2-12,by+30); ctx.lineTo(b.x-b.w/2+12,by+30); ctx.closePath();
      ctx.fillStyle=grad(ctx,b.x-b.w/2,0,b.x+b.w/2,0,["#1B8566","#27AE60","#157A5A"]); ctx.fill(); ol(ctx,1); ctx.stroke();
      ctx.strokeStyle="rgba(255,255,255,.25)"; ctx.lineWidth=3; for(let i=-2;i<=2;i++){ ctx.beginPath(); ctx.moveTo(b.x+i*20,by-20+bump); ctx.lineTo(b.x+i*17,by+22); ctx.stroke(); }
      rr(ctx,b.x-b.w/2-8,by-42+bump,b.w+16,14,6); ctx.fillStyle="#156B52"; ctx.fill(); ol(ctx,1); ctx.stroke();
      ctx.fillStyle="#fff"; ctx.font='800 26px "Baloo 2",sans-serif'; ctx.textAlign="center"; ctx.fillText("♻",b.x,by+12);
    }
  });
};

/* ---------- 4. Espanta-Mosquito ---------- */
GAMES.espanta = ()=>{
  arcade({id:"espanta", titulo:"Espanta-Mosquito", who:"P", dur:60,
    intro:"Toque nos insetos para borrifar repelente antes que cheguem às janelas. Fique de olho no céu: a hora do dia muda quem aparece!",
    tip:"O Listras (Aedes) pica mais de dia. Eu, o Pintas (maruim), apareço mais no amanhecer e no entardecer.",
    win:"Família protegida! Você sabe quando cada inseto aparece.", lose:"Muitas picadas! Repelente, roupa comprida e tela ajudam.",
    init(G){ G.bugs=[]; G.spawn=1; G.fase=0; G.wins=[{x:250,y:250},{x:400,y:250},{x:550,y:250},{x:250,y:370},{x:550,y:370}]; G.rost=["menina","menino","avo","pai","mae"]; G.wins.forEach(w=>w.ai=0); },
    update(G,dt){
      const f=Math.floor(G.t/15)%2; if(f!==G.fase){ G.fase=f; G.say(f?"Entardeceu! Agora é a hora do maruim. Eles são pequenos e vêm em grupo!":"Amanheceu o dia! É a hora do Aedes. Ele é maior e tem listras.", ""); }
      const speed=1+G.t/50+(G.lvl-1)*.15;
      G.wins.forEach(w=>{ if(w.ai>0) w.ai-=dt; });
      G.spawn-=dt*speed;
      if(G.spawn<=0){ G.spawn=G.fase?rnd(1.2,1.8):rnd(.9,1.4);
        const n=G.fase?3:1;
        for(let i=0;i<n;i++){ const w=pick(G.wins), lado=Math.random()<.5?-40:G.W+40;
          G.bugs.push({x:lado,y:rnd(60,G.H-60),w,tipo:G.fase?"m":"a",sp:(G.fase?95:75)*speed*rnd(.9,1.2),ph:rnd(0,6)}); } }
      G.bugs.forEach(b=>{ const dx=b.w.x-b.x, dy=b.w.y-b.y, d=Math.hypot(dx,dy);
        if(b.fug){ b.y-=260*dt; b.x+=b.vx*dt; return; }
        b.x+=dx/d*b.sp*dt; b.y+=dy/d*b.sp*dt+Math.sin(G.t*6+b.ph)*1.5;
        if(d<20){ b.done=true; b.w.ai=1.5; G.hurt(b.w.x,b.w.y-40,b.tipo==="m"?"Picada de maruim!":"Picada de Aedes!"); } });
      G.bugs=G.bugs.filter(b=>!b.done && b.y>-60);
    },
    down(G,x,y){
      G.burst(x,y,"#7DDC9F",14,160); anel(G,x,y,"rgba(46,204,113,.9)");
      const b=G.bugs.find(b=>!b.fug && Math.hypot(b.x-x,b.y-y)<(b.tipo==="m"?40:50));
      if(b){ b.fug=true; b.vx=rnd(-100,100); G.add(10,b.x,b.y-30); G.bugs.filter(o=>!o.fug && o.tipo==="m" && Math.hypot(o.x-x,o.y-y)<70).forEach(o=>{ o.fug=true; o.vx=rnd(-100,100); G.score+=5; }); }
    },
    draw(G,ctx){
      const tarde=G.fase===1;
      ceuBonito(ctx,G,tarde?"#FF8A65":"#6EC6FF",tarde?"#4A2C6B":"#E3F5FF",!tarde);
      if(tarde){ const g=ctx.createRadialGradient(690,G.H-80,10,690,G.H-80,90); g.addColorStop(0,"#FFE08A"); g.addColorStop(1,"rgba(255,180,90,0)"); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(690,G.H-80,90,0,7); ctx.fill();
        ctx.fillStyle="#fff"; for(let i=0;i<20;i++){ ctx.globalAlpha=.4+.4*Math.sin(G.t*3+i); ctx.beginPath(); ctx.arc((i*137)%G.W,(i*53)%140+10,1.8,0,7); ctx.fill(); } ctx.globalAlpha=1; }
      else { nuvemBonita(ctx,(G.t*15)%(G.W+200)-160,60,.8); }
      morros(ctx,G,G.H-40,tarde?"#6D5A7A":"#8ED16F",tarde?"#55456A":"#6DBB52");
      arvore(ctx,80,G.H-40,1,G.t); arvore(ctx,G.W-70,G.H-40,.9,G.t+2);
      ctx.fillStyle=tarde?"#4E6B3E":"#6CC24A"; ctx.fillRect(0,G.H-44,G.W,44);
      casaBonita(ctx,400,170,460,286,tarde);
      _gt=G.t; G.wins.forEach((w,i)=>janela(ctx,w.x,w.y,tarde,G.rost[i],w.ai));
      G.bugs.forEach(b=>{ const flip=b.x>b.w.x;
        if(b.tipo==="a") drawSpr(ctx,"listras-voando",b.x,b.y,70,flip); else drawSpr(ctx,"pintas-ola",b.x,b.y,42,flip); });
      ctx.fillStyle="rgba(0,0,0,.35)"; rr(ctx,10,10,250,36,18); ctx.fill(); ctx.fillStyle="#fff"; ctx.font='800 20px "Baloo 2",sans-serif'; ctx.textAlign="left"; ctx.fillText(tarde?"🌇 Entardecer: maruins":"🌞 Dia: Aedes",22,35);
    }
  });
};

/* ---------- 5. Jogo da Memória ---------- */
const PARES = [
  {k:"listras", img:"listras-ola", n:"Listras", d:"O Listras é um Aedes aegypti: escuro, com listras brancas, e pica mais de dia."},
  {k:"pintas", img:"pintas-piscando", n:"Pintas", d:"O Pintas é um maruim: minúsculo, nasce em folhas e frutas úmidas."},
  {k:"pneu", a:"pneu", n:"Pneu", d:"Pneu velho junta água da chuva. Guarde seco e coberto."},
  {k:"caixadagua", a:"caixadagua", n:"Caixa d'água", d:"Caixa d'água destampada é um dos maiores criadouros. Sempre bem tampada!"},
  {k:"vaso", a:"vaso", n:"Pratinho", d:"Coloque areia no pratinho do vaso."},
  {k:"repelente", a:"repelente", n:"Repelente", d:"Repelente protege contra o Aedes e o maruim."},
  {k:"tela", e:"🪟", n:"Tela", d:"Tela nas janelas ajuda. Para o maruim, precisa ser de malha fina."},
  {k:"tampinha", a:"tampinha", n:"Tampinha", d:"Até uma tampinha com água vira criadouro. Lixo no lixo!"},
];
GAMES.memoria = ()=>{
  stopArcade(); clearTimer();
  const n = S.idade===1?6:8;
  const cards = shuffle([...PARES.slice(0,n), ...PARES.slice(0,n)]).map((p,i)=>({...p,i}));
  let open=[], found=0, moves=0, lock=false;
  app.innerHTML = head("Jogo da Memória", `<div class="row hud"><span class="pill" id="mv">0 jogadas</span><span class="pill" id="pr">0/${n} pares</span></div>`) + `
    <div class="memo" style="--cols:${n===6?4:4}">${cards.map(c=>`<button class="mcard" data-i="${c.i}" aria-label="Carta virada"><span class="mback"><span>?</span></span><span class="mface">${c.img?`<img src="${IMG[c.img]}" alt="">`:c.a?`<canvas class="mart" width="120" height="120" data-a="${c.a}"></canvas>`:`<span class="me">${c.e}</span>`}<b>${c.n}</b></span></button>`).join("")}</div>
    <div id="fb" style="margin-top:12px">${guide("L","","Vire duas cartas por vez e encontre os pares. Cada par traz uma dica!")}</div>`;
  bindBack();
  app.querySelectorAll(".mart").forEach(c=>art(c.getContext("2d"),c.dataset.a,60,64,1));
  app.querySelectorAll(".mcard").forEach(b=>b.onclick=()=>{
    if(lock||b.classList.contains("up")) return;
    sfx("flip"); b.classList.add("up"); b.setAttribute("aria-label",cards[+b.dataset.i].n); open.push(b);
    if(open.length<2) return;
    moves++; $("#mv").textContent=moves+(moves===1?" jogada":" jogadas");
    const [a,c]=open.map(x=>cards[+x.dataset.i]);
    if(a.k===c.k){ found++; open.forEach(x=>x.classList.add("ok")); open=[]; sfx("pop"); $("#pr").textContent=`${found}/${n} pares`;
      $("#fb").innerHTML=guide(a.k==="pintas"?"P":"L","ok",a.d);
      if(found===n){ const sc=Math.max(40,200-(moves-n)*10); const pts=Math.min(80,Math.round(sc/3)); addPts(pts); finish("memoria"); medal("memoria"); confetti(true); sfx("win");
        setTimeout(()=>{ endScreen("Jogo da Memória", `Todos os pares em ${moves} jogadas!`, sc, null, pts, "L").onclick=GAMES.memoria; }, 1600); }
    } else { lock=true; setTimeout(()=>{ open.forEach(x=>{ x.classList.remove("up"); x.setAttribute("aria-label","Carta virada"); }); open=[]; lock=false; }, 900); }
  });
};

/* ================== RANKING (neste aparelho) ================== */
const RKEY = "arbogame-ranking-v1";
const Ranking = {
  ler(){ try{ const r=JSON.parse(localStorage.getItem(RKEY)); if(r && r.j) return r; }catch(e){} return {j:{}}; },
  gravar(r){ try{ localStorage.setItem(RKEY, JSON.stringify(r)); }catch(e){} },
  nome(){ return (S.nome||"").trim() || "Agente sem nome"; },
  /* chamado sempre que o jogador ganha pontos ou termina um minijogo */
  salvar(jogo, placar){
    if(!S.idade) return;
    const r=Ranking.ler(), n=Ranking.nome(), k=n.toLowerCase();
    const p=r.j[k]||{nome:n,pts:0,best:{},idade:S.idade};
    p.nome=n; p.pts=Math.max(p.pts,S.pts); p.idade=S.idade; p.quando=Date.now();
    if(jogo && placar>(p.best[jogo]||0)) p.best[jogo]=placar;
    r.j[k]=p; Ranking.gravar(r);
  },
  lista(jogo){
    const arr=Object.values(Ranking.ler().j).map(p=>({nome:p.nome,idade:p.idade,v:jogo?(p.best[jogo]||0):p.pts})).filter(p=>p.v>0);
    return arr.sort((a,b)=>b.v-a.v).slice(0,10);
  },
};
const _addPts = addPts;
addPts = function(n){ _addPts(n); Ranking.salvar(); };

function telaRanking(aba){
  stopArcade(); clearTimer();
  aba = aba || "geral";
  const abas=[["geral","Geral"],...ARCADE.filter(a=>a.id!=="memoria").map(a=>[a.id,a.nome])];
  const lista=Ranking.lista(aba==="geral"?null:aba), eu=Ranking.nome().toLowerCase();
  const pod=["🥇","🥈","🥉"];
  app.innerHTML = head("Ranking") + `
    <div class="tabs" role="tablist">${abas.map(([id,n])=>`<button class="tab" role="tab" aria-selected="${id===aba}" data-aba="${id}">${n}</button>`).join("")}</div>
    <div class="rank panel">
      ${lista.length ? `<ol class="rlist">${lista.map((p,i)=>`<li class="${p.nome.toLowerCase()===eu?"me":""}${i<3?" top":""}">
        <span class="pos">${i<3?pod[i]:i+1}</span><span class="rn">${esc(p.nome)}<small>${AGES[(p.idade||1)-1].nome}</small></span><span class="rv">${p.v} pts</span></li>`).join("")}</ol>`
      : `<div class="empty">${av("P","wow","coverav")}<p class="q">Ainda ninguém pontuou aqui.</p><p class="muted">Jogue uma partida para aparecer no ranking!</p></div>`}
    </div>
    <p class="muted" style="margin-top:12px">${aba==="geral"?"Pontos totais de cada jogador":"Melhor partida de cada jogador"} neste aparelho. Ótimo para disputas na sala de aula!</p>
    <div class="row" style="margin-top:12px"><button class="btn ghost" id="limpar">Apagar ranking deste aparelho</button></div>
    <div id="conf"></div>`;
  bindBack();
  app.querySelectorAll(".tab").forEach(b=>b.onclick=()=>telaRanking(b.dataset.aba));
  $("#limpar").onclick=()=>{ $("#conf").innerHTML=`<div class="alert" style="margin-top:12px">Apagar todos os jogadores do ranking deste aparelho? Não dá para desfazer. <div class="row" style="margin-top:8px"><button class="btn" id="sim" style="background:var(--coral)">Apagar</button><button class="btn ghost" id="nao">Cancelar</button></div></div>`;
    $("#nao").onclick=()=>{ $("#conf").innerHTML=""; }; $("#sim").onclick=()=>{ Ranking.gravar({j:{}}); toast("Ranking apagado"); telaRanking(aba); }; };
}
GAMES.ranking = telaRanking;

/* ================== RANKING ONLINE (Firestore, opcional) ================== */
const ONLINE = (()=>{
  const c = window.ARBO_CONFIG || {};
  if(!c.firebaseProjectId || !c.firebaseApiKey) return null;
  const host = (c.firestoreHost || "https://firestore.googleapis.com").replace(/\/$/,"");
  const raiz = `projects/${c.firebaseProjectId}/databases/(default)/documents`;
  const call = async (op, body)=>{
    const r = await fetch(`${host}/v1/${raiz}:${op}?key=${encodeURIComponent(c.firebaseApiKey)}`, {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body)});
    if(!r.ok) throw new Error((await r.text().catch(()=>""))||r.statusText);
    return r.json();
  };
  const val = f=>f ? (f.stringValue ?? (f.integerValue!=null ? +f.integerValue : null)) : null;
  return {
    enviar(jogo, pontos){
      const id = `${S.uid}_${jogo}`;
      return call("commit", {writes:[{
        update:{name:`${raiz}/ranking/${id}`, fields:{
          jogador:{stringValue:S.uid}, jogo:{stringValue:jogo}, apelido:{stringValue:apelidoOnline()},
          faixa:{integerValue:String(S.idade||1)}, turma:{stringValue:S.turma||""}, pontos:{integerValue:String(Math.round(pontos))}}},
        updateTransforms:[{fieldPath:"atualizado", setToServerValue:"REQUEST_TIME"}]}]});
    },
    async top(jogo, turma){
      const f = [{fieldFilter:{field:{fieldPath:"jogo"},op:"EQUAL",value:{stringValue:jogo}}}];
      if(turma) f.push({fieldFilter:{field:{fieldPath:"turma"},op:"EQUAL",value:{stringValue:turma}}});
      const rows = await call("runQuery", {structuredQuery:{from:[{collectionId:"ranking"}],
        where: f.length>1 ? {compositeFilter:{op:"AND",filters:f}} : f[0],
        orderBy:[{field:{fieldPath:"pontos"},direction:"DESCENDING"}], limit:10}});
      return rows.filter(r=>r.document).map(r=>{ const d=r.document.fields; return {apelido:val(d.apelido), faixa:val(d.faixa), turma:val(d.turma), pontos:val(d.pontos)}; }).filter(p=>p.pontos>0);
    },
  };
})();
function uuid(){ try{ return crypto.randomUUID(); }catch(e){ return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,c=>{ const r=Math.random()*16|0; return (c==="x"?r:(r&3|8)).toString(16); }); } }
const BLOQ = ["merda","porra","caralho","buceta","puta","puto","viado","fdp","pqp","vsf","foda","bosta","idiota","burro","otario","arrombado","corno","vagabund","piroca","xoxota","cacete","desgraca","imbecil","retardado","macaco","nazi","sexo","porn"];
function apelidoValido(t){
  t=(t||"").trim().replace(/\s+/g," ");
  if(!/^[A-Za-zÀ-ÿ0-9 ]{2,20}$/.test(t)) return false;
  const n=(t.toLowerCase()+" ").normalize("NFD").replace(/[̀-ͯ]/g,"");
  return !BLOQ.some(w=>n.includes(w)) && !/(^|\s)cu\s/.test(" "+n);
}
function apelidoOnline(){ const n=Ranking.nome(); return apelidoValido(n) ? n.trim().replace(/\s+/g," ") : "Agente "+(S.uid||"").slice(0,4).toUpperCase(); }
if(!S.uid){ S.uid=uuid(); save(); }
let filaOnline={};
function enviarOnline(jogo,pontos){
  if(!ONLINE||!S.idade||!(pontos>0)) return;
  filaOnline[jogo]=Math.max(filaOnline[jogo]||0,pontos);
  clearTimeout(enviarOnline.t);
  enviarOnline.t=setTimeout(()=>{ const f=filaOnline; filaOnline={}; Object.entries(f).forEach(([j,p])=>ONLINE.enviar(j,p).catch(()=>{})); }, 1500);
}
const _salvarLocal = Ranking.salvar;
Ranking.salvar = function(jogo, placar){ _salvarLocal(jogo, placar);
  const eu = Ranking.ler().j[Ranking.nome().toLowerCase()] || {pts:0,best:{}};
  enviarOnline("geral", Math.max(S.pts, eu.pts||0));
  if(jogo && jogo!=="memoria") enviarOnline(jogo, Math.max(placar||0, eu.best[jogo]||0)); };

/* tela do ranking com abas "Este aparelho" e "Online" */
const _telaLocal = telaRanking;
let rankModo = "local";
telaRanking = function(aba){
  if(!ONLINE || rankModo==="local"){ _telaLocal(aba); if(ONLINE) modoBar(aba); return; }
  stopArcade(); clearTimer();
  aba = aba || "geral";
  const abas=[["geral","Geral"],...ARCADE.filter(a=>a.id!=="memoria").map(a=>[a.id,a.nome])];
  app.innerHTML = head("Ranking") + `
    <div class="tabs" role="tablist">${abas.map(([id,n])=>`<button class="tab" role="tab" aria-selected="${id===aba}" data-aba="${id}">${n}</button>`).join("")}</div>
    <div class="row" style="margin-bottom:12px"><label for="turma" class="tag">Código da turma</label><input type="text" id="turma" maxlength="12" placeholder="Ex.: 5A-ESCOLA" value="${esc(S.turma||"")}" style="max-width:200px;text-transform:uppercase"><button class="btn ghost" id="filtra">Ver só a turma</button><button class="btn ghost" id="todas">Todas as escolas</button></div>
    <div class="rank panel" id="rk"><p class="muted">Carregando…</p></div>
    <p class="muted" style="margin-top:12px">Ranking online: aparecem só apelidos. Seu apelido online é <b>${esc(apelidoOnline())}</b>.</p>`;
  bindBack(); modoBar(aba);
  app.querySelectorAll(".tab").forEach(b=>b.onclick=()=>telaRanking(b.dataset.aba));
  const salvaTurma=()=>{ const v=$("#turma").value.toUpperCase().replace(/[^A-Z0-9-]/g,"").slice(0,12); S.turma=v; save(); return v; };
  const carregar=(turma)=>{ $("#rk").innerHTML='<p class="muted">Carregando…</p>';
    ONLINE.top(aba,turma).then(l=>{ const eu=apelidoOnline().toLowerCase(); const pod=["🥇","🥈","🥉"];
      $("#rk").innerHTML = l && l.length ? `<ol class="rlist">${l.map((p,i)=>`<li class="${p.apelido.toLowerCase()===eu?"me":""}${i<3?" top":""}"><span class="pos">${i<3?pod[i]:i+1}</span><span class="rn">${esc(p.apelido)}<small>${AGES[(p.faixa||1)-1].nome}${p.turma?" · "+esc(p.turma):""}</small></span><span class="rv">${p.pontos} pts</span></li>`).join("")}</ol>`
        : `<div class="empty">${av("L","oi","coverav")}<p class="q">Ninguém pontuou aqui ainda.</p><p class="muted">Seja o primeiro!</p></div>`;
    }).catch(()=>{ $("#rk").innerHTML='<p class="alert">Não foi possível carregar o ranking online. Confira a internet e tente de novo.</p>'; }); };
  $("#filtra").onclick=()=>carregar(salvaTurma());
  $("#todas").onclick=()=>{ salvaTurma(); carregar(null); };
  carregar(null);
};
function modoBar(aba){
  const h=app.querySelector(".gamehead"); if(!h) return;
  const d=document.createElement("div"); d.className="tabs"; d.setAttribute("role","tablist");
  d.innerHTML=`<button class="tab" role="tab" aria-selected="${rankModo==="local"}" data-m="local">📱 Este aparelho</button><button class="tab" role="tab" aria-selected="${rankModo==="online"}" data-m="online">🌎 Online</button>`;
  h.after(d); d.querySelectorAll("[data-m]").forEach(b=>b.onclick=()=>{ rankModo=b.dataset.m; telaRanking(aba); });
}
GAMES.ranking = (aba)=>telaRanking(aba);
