/* ================== ESTÚDIO: personagens que atuam nos jogos ==================
   Carregado por último. O motor dos minijogos (arcade.js) avisa os eventos
   (acerto, erro, tempo, fala, fim) e aqui o mascote do jogo reage com pose,
   movimento e fala. Também cuida da contagem 3-2-1 e das estrelas no fim. */
const SEMMOV = matchMedia("(prefers-reduced-motion: reduce)").matches;
const ATPOSE = {
  L:{oi:"listras-ola", ok:"listras-feliz", top:"listras-voando", no:"listras-lado", wow:"listras-lado", low:"listras-lado"},
  P:{oi:"pintas-ola", ok:"pintas-rindo", top:"pintas-pulando", no:"pintas-preocupado", wow:"pintas-surpreso", low:"pintas-cansado", no2:"pintas-triste", pisca:"pintas-piscando"},
};
const FALAS = {
  esvazia:["Esvaziou! Sem água, sem larva.","Isso! Depois é só esfregar a borda, onde ficam os ovos.","Mais um recipiente seguro!","Rapidinho! As larvas nem viram."],
  varre:["Que vassourada!","Folhas recolhidas, maruim sem casa.","Isso vira adubo na compostagem!","Chão limpo e seco, perfeito!"],
  coleta:["Pegou! Lixo no lugar certo.","Lixo tampado não junta água.","Boa! Reciclar também protege."],
  espanta:["Xô! Família protegida.","Tela na janela ajuda muito!","Ninguém picado por aqui!"],
  erroL:["Ops! Esse escapou.","Calma, respira e tenta de novo.","Quase! Olhe com atenção."],
  erroP:["Eita! Essa passou.","Tudo bem, bora de novo!","Opa! Mais atenção agora."],
  combo:["Sequência incrível!","Ninguém segura você!","Isso é trabalho de equipe!","Que reflexo!"],
  tempo:["Faltam 10 segundos! Acelera!","Reta final! Capricha!"],
  venceu:["Você é demais! Missão cumprida.","Bairro protegido! Que orgulho."],
  perdeu:["Foi por pouco! Vamos treinar mais.","Faz parte. Na próxima você consegue!"],
};
const ATOR = {
  st:null,
  img(who,p){ return IMG[(ATPOSE[who]||ATPOSE.L)[p]] || IMG[ATPOSE[who].oi]; },
  montar(cfg){
    const stg=$("#stg"); if(!stg || $("#arena")) return;
    const who = cfg.who==="P"?"P":"L";
    const ar=document.createElement("div"); ar.className="arena"; ar.id="arena";
    stg.before(ar); ar.appendChild(stg);
    ar.insertAdjacentHTML("beforeend", `<aside class="ator ${who}" id="ator" hidden aria-live="polite">
      <div class="fala" id="atfala"><b>${WHO[who].nome}</b><span>Preparado? Eu vou torcer por você!</span></div>
      <div class="palco"><img id="atimg" src="${this.img(who,"oi")}" alt="${WHO[who].nome}"><i class="chao"></i></div>
      <div class="seq" aria-label="Sequência de acertos"><span>Sequência</span><div>${"<i></i>".repeat(5)}</div></div>
    </aside>`);
    stg.insertAdjacentHTML("beforeend",`<div class="largada" id="largada" hidden></div><div class="carimbo" id="carimbo"></div>`);
    this.st={who,cfg,ultFala:0,volta:0};
  },
  largada(G,cfg,go){
    const at=$("#ator"); if(at) at.hidden=false;
    $("#tip") && ($("#tip").hidden=true);
    const box=$("#largada"); if(!box||SEMMOV){ go(); return; }
    const passos=["3","2","1","Valendo!"]; let k=0; box.hidden=false;
    this.pose("oi","pula"); this.diz("Preparado? Valendo!");
    const tick=()=>{ if(!ARC||ARC.stop) return;
      if(k>=passos.length){ box.hidden=true; go(); return; }
      box.innerHTML=`<b class="${k===3?"vai":""}">${passos[k]}</b>`; sfx(k===3?"win":"flip"); k++; setTimeout(tick, k===4?650:600); };
    tick();
  },
  pose(p,anim){
    const im=$("#atimg"); if(!im||!this.st) return;
    im.src=this.img(this.st.who,p);
    if(anim && !SEMMOV){ im.classList.remove("pula","treme","gira","alerta","festa"); void im.offsetWidth; im.classList.add(anim); }
    clearTimeout(this.st.volta);
    if(p!=="oi") this.st.volta=setTimeout(()=>{ if($("#atimg")) $("#atimg").src=this.img(this.st.who,"oi"); },1700);
  },
  diz(txt,tom){
    const f=$("#atfala"); if(!f) return;
    f.className="fala "+(tom||""); f.querySelector("span").innerHTML=txt;
    if(!SEMMOV){ f.classList.remove("nova"); void f.offsetWidth; f.classList.add("nova"); }
    this.st.ultFala=performance.now();
  },
  seq(n){ document.querySelectorAll("#ator .seq i").forEach((i,k)=>i.classList.toggle("on",k<Math.min(5,n))); },
  carimbo(txt){ const c=$("#carimbo"); if(!c||SEMMOV) return; c.textContent=txt; c.classList.remove("on"); void c.offsetWidth; c.classList.add("on"); },
  ev(ev,d,G,cfg){
    if(!this.st) return;
    const who=this.st.who, agora=performance.now(), livre=agora-this.st.ultFala>2600;
    if(ev==="acerto"){
      this.seq(G.combo);
      if([3,5,10,15,20].includes(G.combo)){ this.pose("top","gira"); this.diz(pick(FALAS.combo),"ok"); this.carimbo(`Sequência x${G.combo}!`); }
      else { this.pose("ok","pula"); if(livre && FALAS[cfg.id]) this.diz(pick(FALAS[cfg.id]),"ok"); }
    } else if(ev==="erro"){
      this.seq(0); this.pose(who==="P"&&Math.random()<.5?"no2":"no","treme");
      if(agora-this.st.ultFala>1200) this.diz(pick(FALAS["erro"+who]),"no");
    } else if(ev==="tempo"){
      this.pose("wow","alerta"); this.diz(pick(FALAS.tempo),"alerta");
      $("#ht")&&$("#ht").classList.add("urgente"); $("#stg")&&$("#stg").classList.add("urgente");
    } else if(ev==="fala"){
      this.pose(d.mood==="no"?"wow":d.mood==="ok"?"ok":(ATPOSE[who].pisca?"pisca":"oi"),"pula"); this.diz(d.html,d.mood);
    } else if(ev==="fim"){
      $("#stg")&&$("#stg").classList.remove("urgente");
      this.pose(d.venceu?"top":"low",d.venceu?"festa":"treme"); this.diz(pick(d.venceu?FALAS.venceu:FALAS.perdeu),d.venceu?"ok":"no");
    }
  },
  pulso(sel,anim){ if(SEMMOV) return; const el=document.querySelector(sel+" .av"); if(el){ el.classList.remove(anim); void el.offsetWidth; el.classList.add(anim); } },
};
window.ATOR = ATOR;

const _arcadeOrig = arcade;
arcade = function(cfg){ ATOR.st=null; _arcadeOrig(cfg); ATOR.montar(cfg); };

/* ---------- fim de jogo: estrelas e o personagem comemorando ---------- */
const _endOrig = endScreen;
endScreen = function(titulo, msg, acertos, total, pts, who){
  const btn=_endOrig(titulo, msg, acertos, total, pts, who);
  const r = total==null ? Math.min(1,acertos/170) : total ? acertos/total : 1;
  const n = r>=.85?3:r>=.5?2:acertos>0?1:0;
  const card=$(".fimcard"); if(!card) return btn;
  const estrela=`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"/></svg>`;
  card.querySelector("h2").insertAdjacentHTML("afterend",
    `<div class="estrelas" role="img" aria-label="${n} de 3 estrelas">${[0,1,2].map(k=>`<span class="${k<n?"on":""}" style="animation-delay:${.25+k*.28}s">${estrela}</span>`).join("")}</div>`);
  const w = who==="P"?"P":who==="C"?null:"L";
  if(w){ card.insertAdjacentHTML("beforeend",`<img class="fimator ${r>=.5?"festa":"triste"}" src="${ATOR.img(w,r>=.5?"top":"low")}" alt="${WHO[w].nome}">`); card.classList.add("comator"); }
  if(n>=3) sfx("win");
  return btn;
};

/* ---------- quiz: o personagem pula no acerto e se assusta no erro ---------- */
new MutationObserver(()=>{
  const g=document.querySelector("#fb .guide.ok:not(.atuou), #fb .guide.no:not(.atuou)");
  if(!g || SEMMOV) return; g.classList.add("atuou");
  const a=g.querySelector(".av"); if(a) a.classList.add(g.classList.contains("ok")?"pula":"treme");
  const q=document.querySelector(".qcard"); if(q){ q.classList.remove("certo","errado"); void q.offsetWidth; q.classList.add(g.classList.contains("ok")?"certo":"errado"); }
}).observe(app,{childList:true,subtree:true});
