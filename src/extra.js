/* ================== PROFESSORA CATARINA, BUGKIDS, LOGIN E LIVROS ================== */
WHO.C = {nome:"Professora Catarina", sobre:"ciências"};
POSE.C = {oi:"catarina", ok:"catarina", no:"catarina", top:"catarina", low:"catarina", wink:"catarina", wow:"catarina"};
const KIDS = {
  ana:{nome:"Ana", img:"bugkid-ana"}, pedro:{nome:"Pedro", img:"bugkid-pedro"},
  julia:{nome:"Júlia", img:"bugkid-julia"}, guto:{nome:"Guto", img:"bugkid-guto"},
  listras:{nome:"Listras", img:"listras-ola", m:"L"}, pintas:{nome:"Pintas", img:"pintas-ola", m:"P"},
};
function avatar(id, cls=""){
  const k = KIDS[id] || KIDS.ana;
  return `<span class="av ${k.m||"K"} ${cls}"><img src="${IMG[k.img]}" alt="${k.nome}"></span>`;
}
function kidsRow(txt){
  return `<div class="kidsrow">${["ana","pedro","julia","guto"].map(k=>avatar(k)).join("")}${txt?`<span>${txt}</span>`:""}</div>`;
}
/* Dica da Professora Catarina (cartão com retrato) */
function dicaCatarina(html){
  return `<div class="dicac"><img src="${IMG["catarina-dica"]}" alt="Professora Catarina"><div><b>Dica da Professora Catarina</b><p>${html}</p></div></div>`;
}

/* ---------- vários jogadores no mesmo aparelho ---------- */
const PKEY = "arbogame-perfis", SKEY = "arbogame-sessao";
function perfis(){ try{ return JSON.parse(localStorage.getItem(PKEY)) || {}; }catch(e){ return {}; } }
function gravaPerfis(p){ try{ localStorage.setItem(PKEY, JSON.stringify(p)); }catch(e){} }
const _saveSimples = save;
save = function(){ _saveSimples(); if(S.uid && S.idade){ const p=perfis(); p[S.uid]=S; gravaPerfis(p); } };
if(S.uid && S.idade && !perfis()[S.uid]) save();   // migra quem já jogava
function entrou(){ try{ return sessionStorage.getItem(SKEY)===S.uid && !!S.idade; }catch(e){ return !!S.idade; } }
function marcaEntrada(){ try{ sessionStorage.setItem(SKEY, S.uid); }catch(e){} }
function sairJogador(){ try{ sessionStorage.removeItem(SKEY); }catch(e){} telaLogin(); }

const _homeJogo = home;
home = function(){ if(!entrou()) return telaLogin(); _homeJogo(); };
onboarding = function(){ telaLogin("novo"); };

function telaLogin(modo){
  clearTimer(); if(typeof stopArcade==="function") stopArcade();
  const lista = Object.values(perfis()).filter(p=>p.idade).sort((a,b)=>(b.ultimo||0)-(a.ultimo||0));
  if(!lista.length) modo = "novo";
  $("#stats").innerHTML = "";
  const livros = LIVROS.map(l=>`<button class="livro" data-livro="${l.id}"><img src="livros/${l.id}/t01.webp" alt="" loading="lazy"><span><b>${l.titulo}</b><small>${l.sub}</small></span></button>`).join("");
  app.innerHTML = `
    <div class="login">
      <div class="loginart">
        <img src="${IMG["bugkids-turma"]}" alt="Professora Catarina, os BugKids e o Listras">
        <div><span class="tag">Bem-vindo ao ArboGame</span><h1>Entre e jogue com os BugKids!</h1>
        <p class="lead">Ana, Pedro, Júlia, Guto e a Professora Catarina vão com você nas missões contra o Aedes e o maruim.</p></div>
      </div>
      <div class="panel stack" id="lp"></div>
    </div>
    <section><h2>📚 Ler os livros</h2><div class="livros">${livros}</div></section>`;
  app.querySelectorAll("[data-livro]").forEach(b=>b.onclick=()=>telaLeitor(b.dataset.livro, 0, true));
  const lp = $("#lp");
  const escolher = ()=>{
    lp.innerHTML = `<h2>Quem vai jogar?</h2>
      <div class="perfis">${lista.map(p=>`<div class="perfil"><button class="pbtn" data-u="${esc(p.uid)}">${avatar(p.avatar)}<span><b>${esc(p.nome||"Agente")}</b><small>${AGES[(p.idade||1)-1].nome} · ${p.pts} pts</small></span></button><button class="pdel" data-del="${esc(p.uid)}" aria-label="Remover ${esc(p.nome||"jogador")}" title="Remover jogador">✕</button></div>`).join("")}</div>
      <div><button class="btn" id="novo">+ Novo jogador</button></div><div id="pc"></div>
      <p class="muted" style="margin:0;font-size:.9rem">Sem senha: cada jogador fica salvo neste aparelho.</p>`;
    lp.querySelectorAll("[data-u]").forEach(b=>b.onclick=()=>{ S = Object.assign(fresh(), perfis()[b.dataset.u]); S.ultimo=Date.now(); save(); marcaEntrada(); renderStats(); home(); });
    lp.querySelectorAll("[data-del]").forEach(b=>b.onclick=()=>{ const p=perfis()[b.dataset.del];
      $("#pc").innerHTML=`<div class="alert">Remover <b>${esc(p.nome||"Agente")}</b> deste aparelho? Os pontos e medalhas dele somem. <div class="row" style="margin-top:8px"><button class="btn" id="sim" style="background:var(--coral)">Remover</button><button class="btn ghost" id="nao">Cancelar</button></div></div>`;
      $("#nao").onclick=()=>{ $("#pc").innerHTML=""; };
      $("#sim").onclick=()=>{ const all=perfis(); delete all[b.dataset.del]; gravaPerfis(all); if(S.uid===b.dataset.del){ S=fresh(); _saveSimples(); } telaLogin(); }; });
    $("#novo").onclick=novo;
  };
  const novo = ()=>{
    let idade=0, av_="ana";
    lp.innerHTML = `<form class="stack" id="f">
      <h2>Novo jogador</h2>
      <div class="stack" style="gap:6px"><span class="tag">Escolha seu personagem</span>
        <div class="avpick">${Object.keys(KIDS).map(k=>`<button type="button" class="avopt" data-av="${k}" aria-pressed="${k===av_}">${avatar(k)}<small>${KIDS[k].nome}</small></button>`).join("")}</div></div>
      <label class="stack" style="gap:6px"><span class="tag">Seu nome ou apelido</span><input type="text" id="nome" maxlength="20" placeholder="Ex.: Ana, Equipe Azul" autocomplete="off"><small class="muted">Use só o primeiro nome ou um apelido. Ele aparece no ranking.</small></label>
      <div class="stack" style="gap:6px"><span class="tag">Sua idade</span>
        <div class="ages">${AGES.map(a=>`<button type="button" class="age" data-a="${a.id}" aria-pressed="false"><b>${a.nome}</b><small>${a.faixa}</small></button>`).join("")}</div></div>
      <label class="stack" style="gap:6px"><span class="tag">Código da turma (opcional)</span><input type="text" id="turma" maxlength="12" placeholder="Ex.: 5A-ESCOLA" style="text-transform:uppercase" autocomplete="off"><small class="muted">O professor passa o código para a turma aparecer junta no ranking.</small></label>
      <div class="row"><button class="btn" id="go" disabled>Entrar</button>${lista.length?`<button type="button" class="btn ghost" id="volta">Voltar</button>`:""}</div>
    </form>`;
    lp.querySelectorAll(".avopt").forEach(b=>b.onclick=()=>{ av_=b.dataset.av; lp.querySelectorAll(".avopt").forEach(x=>x.setAttribute("aria-pressed", x===b)); });
    lp.querySelectorAll(".age").forEach(b=>b.onclick=()=>{ idade=+b.dataset.a; lp.querySelectorAll(".age").forEach(x=>x.setAttribute("aria-pressed", x===b)); $("#go").disabled=false; });
    if($("#volta")) $("#volta").onclick=escolher;
    $("#f").onsubmit=e=>{ e.preventDefault(); if(!idade) return;
      S = fresh(); S.uid = uuid(); S.nome = $("#nome").value.trim().replace(/\s+/g," "); S.idade = idade; S.avatar = av_; S.ultimo = Date.now();
      S.turma = $("#turma").value.toUpperCase().replace(/[^A-Z0-9-]/g,"").slice(0,12);
      save(); marcaEntrada(); renderStats(); home(); toast(`Olá, ${S.nome||"agente"}! A Professora Catarina deseja boa missão.`); };
    $("#nome").focus();
  };
  modo==="novo" ? novo() : escolher();
  window.scrollTo(0,0);
}

/* ---------- livros ---------- */
const LIVROS = [
  {id:"listras", titulo:"Listras e os BugKids", sub:"Uma missão no quintal", n:20, who:"L"},
  {id:"pintas", titulo:"Pintas e os BugKids", sub:"Em busca do verdadeiro lar", n:14, who:"P"},
];
Object.assign(MEDALS, {
  livro_listras:{m:"📘", nome:"Leitor do Listras", desc:"Leu o livro do Listras até o fim"},
  livro_pintas:{m:"📗", nome:"Leitor do Pintas", desc:"Leu o livro do Pintas até o fim"},
});
let leitorTecla = null;
function telaLeitor(id, pg=0, doLogin=false){
  clearTimer(); if(typeof stopArcade==="function") stopArcade();
  const L = LIVROS.find(l=>l.id===id); if(!L) return home();
  S.leitura = S.leitura || {};
  if(pg===0 && S.leitura[id] && S.leitura[id].pag>0 && S.leitura[id].pag<L.n-1) pg = S.leitura[id].pag;
  const src = i=>`livros/${id}/${String(i+1).padStart(2,"0")}.webp`;
  app.innerHTML = `<div class="gamehead"><div class="row"><button class="btn ghost" id="voltar">← ${doLogin?"Voltar":"Início"}</button><h2>${L.titulo}</h2></div>
      <div class="row hud"><span class="pill" id="pc"></span><button class="btn ghost mini" id="tela" title="Tela cheia">⛶ Tela cheia</button></div></div>
    <div class="leitor" id="lt">
      <button class="pag ant" id="ant" aria-label="Página anterior">‹</button>
      <div class="folha" id="fl"><img id="pimg" alt=""></div>
      <button class="pag prox" id="prox" aria-label="Próxima página">›</button>
    </div>
    <p class="muted" style="text-align:center;margin:8px 0">Toque na página para ampliar. Use as setas ou deslize para virar.</p>
    <div class="miniaturas" id="mn">${Array.from({length:L.n},(_,i)=>`<button data-p="${i}" aria-label="Página ${i+1}"><img src="livros/${id}/t${String(i+1).padStart(2,"0")}.webp" alt="" loading="lazy"><small>${i===0?"Capa":i+1}</small></button>`).join("")}</div>`;
  const sair = ()=>{ window.removeEventListener("keydown", leitorTecla); doLogin && !entrou() ? telaLogin() : home(); };
  $("#voltar").onclick = sair; window.scrollTo(0,0);
  const img = $("#pimg"), fl = $("#fl");
  const mostra = i=>{
    pg = Math.max(0, Math.min(L.n-1, i));
    fl.classList.remove("zoom"); img.src = src(pg); img.alt = `${L.titulo}, página ${pg+1}`;
    if(pg+1<L.n){ const pre=new Image(); pre.src=src(pg+1); }
    $("#pc").textContent = pg===0 ? "Capa" : `Página ${pg+1} de ${L.n}`;
    $("#ant").disabled = pg===0; $("#prox").disabled = pg===L.n-1;
    app.querySelectorAll("#mn button").forEach(b=>b.setAttribute("aria-current", +b.dataset.p===pg));
    const at = app.querySelector(`#mn [data-p="${pg}"]`); if(at) at.scrollIntoView({block:"nearest", inline:"center", behavior:"smooth"});
    if(S.idade){ const r = S.leitura[id] = S.leitura[id] || {pag:0, max:0}; r.pag = pg; r.max = Math.max(r.max, pg);
      if(pg===L.n-1 && !S.medalhas["livro_"+id]){ addPts(30); medal("livro_"+id); toast("Livro lido até o fim! +30 pts"); }
      save(); }
  };
  $("#ant").onclick = ()=>mostra(pg-1); $("#prox").onclick = ()=>mostra(pg+1);
  app.querySelectorAll("#mn button").forEach(b=>b.onclick=()=>mostra(+b.dataset.p));
  fl.onclick = e=>{ if(fl.dataset.swipe==="1") return; fl.classList.toggle("zoom"); };
  let x0 = null;
  fl.addEventListener("pointerdown", e=>{ x0 = e.clientX; fl.dataset.swipe = "0"; });
  fl.addEventListener("pointerup", e=>{ if(x0==null || fl.classList.contains("zoom")) return; const dx = e.clientX - x0; x0 = null;
    if(Math.abs(dx) > 50){ fl.dataset.swipe = "1"; mostra(pg + (dx<0?1:-1)); } });
  $("#tela").onclick = ()=>{ const el = $("#lt"); if(document.fullscreenElement) document.exitFullscreen(); else if(el.requestFullscreen) el.requestFullscreen().catch(()=>{}); };
  window.removeEventListener("keydown", leitorTecla);
  leitorTecla = e=>{ if(!document.body.contains(img)) return window.removeEventListener("keydown", leitorTecla);
    if(e.key==="ArrowRight") mostra(pg+1); else if(e.key==="ArrowLeft") mostra(pg-1); };
  window.addEventListener("keydown", leitorTecla);
  mostra(pg);
}
GAMES.livros = ()=>telaLeitor("listras");
