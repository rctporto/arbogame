/* ================== PLATAFORMA (02/11/2026) ==================
   Carregado por último. Não altera a lógica antiga: só acrescenta.
   1) Modo claro (fundo branco, menu verde) e escuro, com botão e memória da escolha.
   2) Jogos novos (páginas em jogos/*.html) abertos dentro do site, ligados a pontos, medalhas e ranking.
   3) Pergunta da Professora Catarina entre uma fase/partida e a próxima (tenta até acertar).
   4) Área do desenvolvedor: só renato@norionano.com.br, com "Ver como usuário".
   5) Jogos "em breve" no fliperama. */

/* ---------- 1. tema claro / escuro ---------- */
const TEMA_KEY = "arbogame-tema";
function temaSalvo(){ try{ return localStorage.getItem(TEMA_KEY); }catch(e){ return null; } }
function temaAtual(){ const t=temaSalvo(); if(t==="light"||t==="dark") return t; return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"; }
function aplicaTema(){ const t=temaAtual(); document.documentElement.dataset.theme=t;
  document.querySelectorAll("iframe.jogoframe").forEach(f=>{ try{ f.contentWindow.postMessage({arbo:"tema", tema:t}, location.origin); }catch(e){} });
  document.querySelectorAll(".temabtn").forEach(b=>{ b.innerHTML = t==="dark" ? `${ic("sol",18)}<span>Modo claro</span>` : `${ic("lua",18)}<span>Modo escuro</span>`; b.setAttribute("aria-label", t==="dark"?"Mudar para o modo claro":"Mudar para o modo escuro"); }); }
function trocaTema(){ const t = temaAtual()==="dark" ? "light" : "dark"; try{ localStorage.setItem(TEMA_KEY, t); }catch(e){} aplicaTema(); }
ICO.lua = ICO.lua || '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>';
matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", ()=>{ if(!temaSalvo()) aplicaTema(); });
(function botaoTemaTopo(){ const st=$("#stats"); if(!st) return; const b=document.createElement("button"); b.type="button"; b.className="temabtn topo"; b.onclick=trocaTema; st.after(b); })();
aplicaTema();

/* ---------- 2. jogos novos ---------- */
const NOVOS = [
  {id:"esvazia", arquivo:"missao-chuva",   nome:"Esvazia Já!",     who:"L", cor:"var(--sky-soft)",   desc:"A chuva enche os recipientes do quintal. Esvazie cada um a tempo, em 5 fases!", icone:"gota"},
  {id:"varre",   arquivo:"limpeza-ninja",  nome:"Varre-Varre",    who:"P", cor:"var(--sun-soft)",   desc:"Varra frutas estragadas e folhas com a vassoura. Não encoste no inseticida nem no repelente!", icone:"folha"},
  {id:"sudoku",  arquivo:"sudoku-bugkids", nome:"SudoKids",   who:"P", cor:"var(--leaf-soft)",  desc:"Cada BugKid aparece uma vez em cada linha, coluna e bloco. Três níveis.", icone:"alvo"},
  {id:"mahjong", arquivo:"mahjong-bugkids",nome:"Mahjong BugKids",  who:"L", cor:"var(--coral-soft)", desc:"Ache os pares de peças livres e limpe a mesa inteira.", icone:"cartas"},
  {id:"labirinto", arquivo:"labirinto-floresta", nome:"Labirinto da Floresta", who:"P", cor:"var(--leaf-soft)", desc:"Leve o Pintas da cidade até a floresta em 5 bairros. Tem desafio do dia para a turma!", icone:"alvo"},
  {id:"fuga",    arquivo:"fuga-bugkids",   nome:"Fuga dos BugKids", who:"L", cor:"var(--coral-soft)", desc:"Recolha as tampinhas e fuja do Zé Listrão e da Gangue Pintada. O repelente vira o jogo!", icone:"escudo"},
];
// Coleta Certa, Espanta-Mosquito e Memória ganham a versão nova (mesmo id: recordes, medalhas e ranking continuam)
const TROCADOS = {coleta:"coleta-certa", espanta:"espanta-mosquito", memoria:"memoria-bugkids"};
const EMBREVE = [];
NOVOS.forEach(n=>{ const novo={id:n.id, who:n.who, nome:n.nome, desc:n.desc, cor:n.cor}, a=ARCADE.find(x=>x.id===n.id); if(a) Object.assign(a, novo); else ARCADE.push(novo); ICO_JOGO[n.id]=n.icone; });
// Esvazia Já! e Varre-Varre agora são os jogos novos (antes chamados Missão Chuva e Limpeza Ninja). Ordem: jogos novos primeiro.
(function ordena(){ const ordem=["esvazia","varre","coleta","espanta","labirinto","fuga","memoria","sudoku","mahjong"];
  ARCADE.sort((x,y)=>(ordem.indexOf(x.id)+1||99)-(ordem.indexOf(y.id)+1||99)); })();
const CAPA = id => `jogos/capas/${id}.webp`;
Object.assign(MEDALS, {
  esvazia:{m:"💦", nome:"Mão rápida", desc:"Venceu as 5 fases do Esvazia Já!"},
  varre:{m:"🧹", nome:"Vassoura de ouro", desc:"Completou o tempo no Varre-Varre"},
  sudoku:{m:"🧩", nome:"Mestre do Sudoku", desc:"Completou um SudoKids"},
  mahjong:{m:"🀄", nome:"Mesa limpa", desc:"Limpou a mesa do Mahjong BugKids"},
  labirinto:{m:"🌳", nome:"Pintas em casa", desc:"Levou o Pintas até a floresta nos 5 bairros"},
  fuga:{m:"🏃", nome:"Fuga perfeita", desc:"Recolheu todo o lixo nas 4 fases da Fuga dos BugKids"},
});
Object.assign(ICO_MEDALHA, {labirinto:"alvo", fuga:"escudo", esvazia:"gota", varre:"folha", sudoku:"alvo", mahjong:"cartas"});
const ARQ = id => id==="meuquintal" ? "meu-quintal" : (NOVOS.find(n=>n.id===id)||{}).arquivo || TROCADOS[id];
const NOME = id => id==="meuquintal" ? "Meu Quintal" : (ARCADE.find(a=>a.id===id)||{}).nome || id;

let JOGO_AT = null;
function telaJogoNovo(id){
  if(typeof stopArcade==="function") stopArcade(); clearTimer();
  JOGO_AT = id;
  // modo jogo: o jogo ocupa a tela inteira e a página não rola enquanto a criança joga
  app.innerHTML = `<div class="modojogo" id="modojogo"><div class="mjbar"><button class="btn ghost" id="voltar" type="button">← Painel</button><b>${esc(NOME(id))}</b><button class="temabtn mjtema" type="button"></button></div>
    <iframe class="jogoframe" id="jogoframe" title="${esc(NOME(id))}" src="jogos/${ARQ(id)}.html?embed=1&tema=${temaAtual()}&faixa=${S.idade||1}&uid=${encodeURIComponent(S.uid||"local")}" allow="autoplay; fullscreen"></iframe></div>`;
  bindBack(); fechaMenu();
  const fr=$("#jogoframe"); fr.addEventListener("load", ()=>{ try{ fr.focus(); fr.contentWindow.focus(); }catch(e){} });
  app.querySelector(".mjtema").onclick=trocaTema; aplicaTema();
}
Object.keys(TROCADOS).forEach(id=>{ GAMES[id]=function(){ marcaNav(id); telaJogoNovo(id); }; });
NOVOS.forEach(n=>{ GAMES[n.id]=function(){ marcaNav(n.id); telaJogoNovo(n.id); }; });

// recados que os jogos mandam para o site
addEventListener("message", e=>{
  if(e.origin!==location.origin || !e.data || !e.data.arbo) return;
  const d=e.data, fr=$("#jogoframe"); if(!fr || e.source!==fr.contentWindow) return;
  if(d.arbo==="altura"){ fr.style.height = Math.max(420, Math.ceil(d.h)) + "px"; }
  else if(d.arbo==="pontos"){ // Meu Quintal: pontos pequenos por cuidado, no máximo 40 por dia
    const hj=new Date().toDateString(); S.quintalPts = S.quintalPts && S.quintalPts.dia===hj ? S.quintalPts : {dia:hj, n:0};
    const n=Math.max(0, Math.min(+d.n||0, 40-S.quintalPts.n)); if(n>0){ S.quintalPts.n+=n; addPts(n); finish("meuquintal"); toast(`+${n} ${n===1?"ponto":"pontos"} · ${d.motivo||"Meu Quintal"}`); } else save(); }
  else if(d.arbo==="medalha"){ if(MEDALS[d.id]) medal(d.id); }
  else if(d.arbo==="fim"){ const id=JOGO_AT; if(!id) return;
    const placar=Math.max(0, Math.round(+d.placar||0)), pts=Math.min(80, Math.round(placar/3));
    if(pts>0) addPts(pts); finish(id); Ranking.salvar(id, placar);
    if(d.venceu || (id==="coleta"||id==="espanta") && placar>=150 || id==="memoria") medal(id);
    toast(`+${pts} pontos no ${NOME(id)}`); }
  else if(d.arbo==="antes"){ perguntaEntreFases(()=>{ try{ fr.focus(); fr.contentWindow.focus(); fr.contentWindow.postMessage({arbo:"continuar", id:d.id}, location.origin); }catch(err){} }); }
});

/* ---------- 3. pergunta entre fases ---------- */
const PQ_KEY = "arbogame-perguntas-vistas";
function proximaPergunta(){
  const f = Math.min(3, Math.max(1, S.idade||1)), banco = PERGUNTAS[f];
  let vistas=[]; try{ vistas=JSON.parse(sessionStorage.getItem(PQ_KEY))||[]; }catch(e){}
  let livres = banco.map((_,i)=>i).filter(i=>!vistas.includes(f+":"+i));
  if(!livres.length){ vistas=vistas.filter(v=>!v.startsWith(f+":")); livres=banco.map((_,i)=>i); }
  const i = livres[Math.floor(Math.random()*livres.length)];
  vistas.push(f+":"+i); try{ sessionStorage.setItem(PQ_KEY, JSON.stringify(vistas.slice(-40))); }catch(e){}
  return banco[i];
}
let PQ_ABERTA = false;
function perguntaEntreFases(depois){
  if(PQ_ABERTA) return; PQ_ABERTA = true;
  const p = proximaPergunta(), certa = p.ops[0], ops = shuffle(p.ops);
  const box = document.createElement("div"); box.className="pqfundo"; box.setAttribute("role","dialog"); box.setAttribute("aria-modal","true"); box.setAttribute("aria-labelledby","pqq");
  box.innerHTML = `<div class="pqcard">
      <div class="pqtopo"><img src="${IMG["catarina-busto"]}" alt="Professora Catarina"><div><span class="eyebrow">Antes de continuar</span><b>Pergunta da Professora Catarina</b></div></div>
      <p class="pqq" id="pqq">${esc(p.q)}</p>
      <div class="opts pqops">${ops.map(o=>`<button type="button" class="opt" data-v="${esc(o)}">${esc(o)}</button>`).join("")}</div>
      <div class="pqfb" id="pqfb" aria-live="polite"></div>
    </div>`;
  document.body.appendChild(box); sfx && sfx("swoosh");
  const fb = box.querySelector("#pqfb"); let erros=0;
  box.querySelectorAll(".opt").forEach(b=>b.onclick=()=>{
    if(b.dataset.v===certa){
      box.querySelectorAll(".opt").forEach(x=>x.disabled=true); b.classList.add("right"); sfx && sfx("win");
      fb.innerHTML = `<div class="pqok"><b>${erros?"Agora sim!":"Acertou!"}</b> ${esc(p.ex)}</div><button type="button" class="btn sun" id="pqgo">Continuar jogando →</button>`;
      const go=fb.querySelector("#pqgo"); go.focus();
      go.onclick=()=>{ box.remove(); PQ_ABERTA=false; depois(); };
    } else {
      erros++; b.disabled=true; b.classList.add("wrong","elim"); sfx && sfx("bad");
      fb.innerHTML = `<div class="pqdica"><b>Quase!</b> ${esc(p.dica)} Tente de novo.</div>`;
    }
  });
  box.querySelector(".opt").focus();
}
// "Jogar de novo" dos minijogos e missões antigos também passa pela pergunta
const _endScreen = endScreen;
endScreen = function(...a){
  const btn = _endScreen.apply(this, a);
  let fn = null;
  Object.defineProperty(btn, "onclick", {configurable:true, get(){ return fn; }, set(f){ fn=f; }});
  btn.addEventListener("click", ()=>{ if(fn) perguntaEntreFases(()=>fn()); });
  return btn;
};

/* ---------- 4. área do desenvolvedor ---------- */
const DEV_EMAILS = ["renato@norionano.com.br"];
const VER_USUARIO = "arbogame-dev-usuario", DEV_OK = "arbogame-dev-ok";
const ss = {get:k=>{ try{ return sessionStorage.getItem(k); }catch(e){ return null; } }, set:(k,v)=>{ try{ v==null?sessionStorage.removeItem(k):sessionStorage.setItem(k,v); }catch(e){} }};
if(DEV){
  const _aut = DEV.autorizado;
  DEV.autorizado = async function(){ const ok = await _aut.apply(this, arguments);
    const email = String(DEV.email()||"").toLowerCase(), vale = ok && DEV_EMAILS.includes(email);
    ss.set(DEV_OK, vale ? email : null); return vale; };
}
const _painelDev = painelDev;
painelDev = function(topo, liga){
  _painelDev(topo, liga);
  const bar = document.createElement("section"); bar.className="panel devbar";
  const n = Object.values(PERGUNTAS).reduce((s,l)=>s+l.length,0);
  bar.innerHTML = `<div class="row" style="justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap">
      <div><span class="eyebrow">Você está no modo desenvolvedor</span><p class="muted" style="margin:2px 0 0">Veja o site como um jogador vê e volte quando quiser.</p></div>
      <div class="row"><button class="btn sun" id="verusuario">${ic("olho",18)} Ver como usuário</button><button class="btn ghost temabtn"></button></div></div>
    <details class="devperg"><summary>Perguntas entre fases (${n})</summary>
      ${[1,2,3].map(f=>`<h4>${AGES[f-1].nome} · ${AGES[f-1].faixa}</h4><ol>${PERGUNTAS[f].map(p=>`<li><b>${esc(p.q)}</b><br><span class="ok">✓ ${esc(p.ops[0])}</span> · <span class="muted">${p.ops.slice(1).map(esc).join(" · ")}</span></li>`).join("")}</ol>`).join("")}
      <p class="nota">As perguntas ficam em <code>src/perguntas.js</code>. Para mudar, edite o arquivo e publique.</p></details>`;
  const head0 = app.querySelector(".gamehead"); if(head0) head0.after(bar); else app.prepend(bar);
  bar.querySelector(".temabtn").onclick=trocaTema; aplicaTema();
  bar.querySelector("#verusuario").onclick=()=>{ ss.set(VER_USUARIO,"1"); history.replaceState(null,"",location.pathname); home(); pilulaDev(); };
};
ICO.olho = ICO.olho || '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>';
function pilulaDev(){
  let p=$("#pilduladev"); const on = ss.get(VER_USUARIO)==="1" && !!ss.get(DEV_OK);
  if(!on){ if(p) p.remove(); return; }
  if(p) return;
  p=document.createElement("div"); p.id="pilduladev"; p.className="pildev";
  p.innerHTML=`<span>${ic("olho",16)} Vendo como usuário</span><button type="button" class="btn sun" id="voltadev">Voltar ao desenvolvedor</button>`;
  document.body.appendChild(p);
  p.querySelector("#voltadev").onclick=()=>{ ss.set(VER_USUARIO,null); p.remove(); location.hash="#dev"; telaDev(); };
}
pilulaDev();

/* ---------- menu lateral: botão de tema, atalho do desenvolvedor e "em breve" ---------- */
const _montaMenu = montaMenu;
montaMenu = function(){
  _montaMenu();
  const side=$("#side"); if(!side) return;
  const nav=document.createElement("nav"); nav.className="snovo";
  nav.innerHTML = `${EMBREVE.length?`<h4>Em breve</h4>${EMBREVE.map(e=>`<button disabled>${ic("cadeado",18)}<span>${e.nome}</span></button>`).join("")}`:""}
    <h4>Preferências</h4><button class="temabtn" type="button"></button>
    ${ss.get(DEV_OK)?`<button type="button" id="atalhodev">${ic("olho",18)}<span>Área do desenvolvedor</span></button>`:""}`;
  side.appendChild(nav);
  nav.querySelector(".temabtn").onclick=trocaTema;
  const ad=nav.querySelector("#atalhodev"); if(ad) ad.onclick=()=>{ fechaMenu(); ss.set(VER_USUARIO,null); pilulaDev(); location.hash="#dev"; telaDev(); };
  aplicaTema();
};
montaMenu();

/* ---------- painel: cartões "em breve" ---------- */
const _homeNovo = homeNovo;
homeNovo = function(){
  _homeNovo();
  const fl = app.querySelector(".fliper"); if(!fl) return;
  fl.querySelectorAll(".fcard[data-go]").forEach(c=>{ const im=c.querySelector(".fimg img"); if(im && ARQ(c.dataset.go)){ im.src=CAPA(c.dataset.go); im.classList.add("capa"); } });
  fl.insertAdjacentHTML("beforeend", EMBREVE.map(e=>`<div class="fcard embreve" style="--c:var(--card)" aria-disabled="true">
      <span class="fimg"><img src="${IMG[e.img]}" alt=""></span><h3>${e.nome}</h3><p>${e.desc}</p><span class="fpe"><span>${ic("cadeado",16)} Em breve</span></span></div>`).join(""));
  pilulaDev();
};

/* ---------- Meu Quintal (bichinho virtual: um quintal que muda em tempo real) ---------- */
Object.assign(MEDALS, {quintal:{m:"🏡", nome:"Quintal sem criadouro", desc:"Deixou o Meu Quintal 100% seguro"}, quintal3:{m:"📅", nome:"Cuidador fiel", desc:"Cuidou do Meu Quintal 3 dias seguidos"}});
Object.assign(ICO_MEDALHA, {quintal:"home", quintal3:"estrela"});
// Meu Quintal tem id próprio (antes ocupava "quintal" e escondia a missão Caça aos criadouros)
GAMES.meuquintal = function(){ marcaNav("meuquintal"); telaJogoNovo("meuquintal"); };
function resumoQuintal(){ // lê o estado salvo pelo jogo para mostrar o aviso no painel
  try{ const q=JSON.parse(localStorage.getItem("arbogame-quintal-"+(S.uid||"local"))); if(!q) return null;
    const turno=3*3600e3, agora=Date.now(); let al=0, grave=0;
    const passou=Math.floor((agora-q.ult)/turno);
    (q.itens||[]).forEach(i=>{ if(i.fora) return; if(i.agua){ al++; if((agora-i.desde)/turno>=8) grave++; } else if(i.ovos) al++; });
    (q.folhas||[]).forEach(f=>{ al++; if((agora-f.desde)/turno>=16) grave++; }); al+=(q.lixo||[]).length;
    return {al, grave, passou, dias:(q.dias||{}).seq||0}; }catch(e){ return null; } }
const _montaMenuQ = montaMenu;
montaMenu = function(){ _montaMenuQ(); const side=$("#side"); if(!side) return;
  const ref=side.querySelector('[data-nav="painel"]'); if(!ref || side.querySelector('[data-nav="meuquintal"]')) return;
  const b=document.createElement("button"); b.setAttribute("data-nav","meuquintal"); if(NAV_AT==="meuquintal") b.setAttribute("aria-current","page");
  b.innerHTML=`${ic("home",18)}<span>Meu Quintal</span>`; b.onclick=()=>{ fechaMenu(); GAMES.meuquintal(); }; ref.after(b); };
montaMenu();
const _homeNovoQ = homeNovo;
homeNovo = function(){ _homeNovoQ();
  const alvo=app.querySelector(".numeros"); if(!alvo) return; const r=resumoQuintal();
  const msg = !r ? ["Você ganhou um quintal para cuidar!","Ele muda em tempo real: chove, caem folhas, aparece lixo. Cuide dele todo dia!"]
    : r.grave ? [`${r.grave===1?"Um alerta urgente":r.grave+" alertas urgentes"} no seu quintal!`,"Tem larvas, mosquito ou maruins. Corra para cuidar!"]
    : r.al ? [`${r.al} ${r.al===1?"coisa precisa":"coisas precisam"} de cuidado no seu quintal`,"Choveu ou caíram folhas desde a sua última visita."]
    : ["Seu quintal está em ordem!",`Volte mais tarde para ver como ele está.${r.dias>1?` Você cuida dele há ${r.dias} dias seguidos.`:""}`];
  const sec=document.createElement("section"); sec.className="quintalcard"+(r&&r.grave?" urgente":"");
  sec.innerHTML=`<img src="jogos/capas/quintal.webp" alt=""><div><span class="chip claro">Meu Quintal</span><h3>${msg[0]}</h3><p>${msg[1]}</p></div><button class="btn sun" id="irquintal">${ic("home",18)} Cuidar do quintal</button>`;
  alvo.after(sec); sec.querySelector("#irquintal").onclick=()=>GAMES.meuquintal(); };

/* teclas apertadas fora do jogo (depois de um clique no site ou da pergunta) seguem para o jogo aberto */
["keydown","keyup"].forEach(tp=>addEventListener(tp, e=>{
  const fr=$("#jogoframe"); if(!fr || document.querySelector(".pqfundo")) return;
  if(/^(INPUT|TEXTAREA|SELECT)$/.test((e.target&&e.target.tagName)||"")) return;
  if(!/^(Arrow(Up|Down|Left|Right)|Key[WASD]|Digit[0-6])$/.test(e.code)) return;
  if(e.code.startsWith("Arrow")) e.preventDefault();
  try{ fr.contentWindow.postMessage({arbo:"tecla", tipo:tp, key:e.key, code:e.code}, location.origin); }catch(x){}
}));
