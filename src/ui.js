/* ================== NOVA INTERFACE (protótipo 31/10/2026) ==================
   Menu lateral, barra do topo, painel, capas, fim de missão e pódio.
   As regras do jogo continuam nos outros arquivos; aqui é só apresentação. */
const ICO = {
  home:'<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  book:'<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  gota:'<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
  folha:'<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
  lixo:'<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M10 11v6M14 11v6"/>',
  escudo:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
  cartas:'<rect x="3" y="4" width="11" height="16" rx="2"/><path d="m15 5.5 4.6 1.6a2 2 0 0 1 1.2 2.5l-3.6 10.2a2 2 0 0 1-2.2 1.3"/><path d="M8.5 10.5v3M7 12h3"/>',
  inseto:'<path d="m8 2 1.88 1.88"/><path d="M14.12 3.88 16 2"/><path d="M9 7.13v-1a3 3 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/><path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M6 13H2"/><path d="M3 21c0-2.1 1.7-3.9 3.8-4"/><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"/><path d="M22 13h-4"/><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"/>',
  lupa:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  ciclo:'<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
  saude:'<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>',
  ideia:'<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
  trofeu:'<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
  estrela:'<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>',
  medalha:'<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>',
  controle:'<path d="M6 12h4M8 10v4"/><path d="M15 13h.01M18 11h.01"/><rect width="20" height="12" x="2" y="6" rx="3"/>',
  alvo:'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  seta:'<path d="m9 18 6-6-6-6"/>',
  cadeado:'<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  som:'<path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>',
  mudo:'<path d="M11 5 6 9H2v6h4l5 4z"/><path d="m22 9-6 6M16 9l6 6"/>',
  sair:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
  sol:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  mais:'<path d="M12 5v14M5 12h14"/>',
  user:'<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
};
function ic(nome, t=20, w=2){ return `<svg viewBox="0 0 24 24" width="${t}" height="${t}" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICO[nome]||""}</svg>`; }
const ICO_JOGO = {esvazia:"gota", varre:"folha", coleta:"lixo", espanta:"escudo", memoria:"cartas"};
const ICO_MISSAO = {vetores:["inseto","#F6EBD9","#9A5B1E"], quintal:["lupa","#DDF2E7","#1B8566"], ciclo:["ciclo","#DCEBF8","#2F6FB5"],
  detetive:["saude","#FBE3DC","#C2412A"], mito:["ideia","#ECE6F8","#6B4FB0"], casa:["home","#F6EED6","#8A6A12"], final:["trofeu","#FBEBD2","#B7741A"]};
const ICO_MEDALHA = {primeira:"estrela", vetores:"lupa", cacador:"alvo", ciclo:"ciclo", detetive:"saude", mito:"ideia", casa:"home", guardiao:"trofeu",
  esvazia:"gota", varre:"folha", coleta:"lixo", espanta:"escudo", memoria:"cartas", livro_listras:"book", livro_pintas:"book"};
const CORPO = {ana:"corpo-ana", pedro:"corpo-pedro", julia:"corpo-julia", guto:"corpo-guto", listras:"listras-ola", pintas:"pintas-pulando"};
const corpo = id => IMG[CORPO[id]] || IMG["corpo-ana"];

/* ---------- menu lateral ---------- */
let NAV_AT = "painel";
function montaMenu(){
  const side = $("#side"); if(!side) return;
  const feitas = Object.keys(S.feitas||{}).length;
  const item = (id, icone, nome, extra="") => `<button data-nav="${id}" ${NAV_AT===id?'aria-current="page"':""} ${extra}>${ic(icone,18)}<span>${nome}</span></button>`;
  side.innerHTML = `
    <div class="sbrand"><span class="slogo">${ic("sol",24,2.2)}</span><span><b>ArboGame</b><small>Uma missão BugKids</small></span></div>
    <nav>
      <h4>Comece aqui</h4>
      ${item("painel","home","Painel principal")}
      ${item("biblioteca","book","Biblioteca")}
      ${item("ranking","trofeu","Ranking")}
      <h4>Fliperama</h4>
      ${ARCADE.map(a=>item(a.id, ICO_JOGO[a.id]||"controle", a.nome)).join("")}
      <h4>Missões de conhecimento</h4>
      ${MISSIONS.map(m=>{ const tranca = m.lock && feitas < m.lock && !S.feitas[m.id]; return item(m.id, tranca?"cadeado":(ICO_MISSAO[m.id]||["alvo"])[0], m.nome, tranca?"disabled":""); }).join("")}
    </nav>
    ${S.idade?`<div class="sjog">${avatar(S.avatar)}<span><b>${esc(S.nome||"Agente")}</b><small>${AGES[S.idade-1].nome}</small></span></div>
    <nav>${item("sair","sair","Trocar jogador")}</nav>`:""}`;
  side.querySelectorAll("[data-nav]").forEach(b=>b.onclick=()=>{ fechaMenu(); const id=b.dataset.nav;
    if(id==="painel") home(); else if(id==="biblioteca") telaBiblioteca(); else if(id==="sair") sairJogador(); else GAMES[id](); });
}
function fechaMenu(){ document.body.classList.remove("navaberta"); const m=$("#menubtn"); if(m) m.setAttribute("aria-expanded","false"); }
$("#menubtn").onclick=()=>{ const on=document.body.classList.toggle("navaberta"); $("#menubtn").setAttribute("aria-expanded", on); };
$("#sidefundo").onclick=fechaMenu;
function marcaNav(id){ NAV_AT=id; document.body.classList.toggle("semnav", !entrou()); montaMenu(); }
Object.keys(GAMES).forEach(k=>{ const f=GAMES[k]; GAMES[k]=function(...a){ marcaNav(k); return f.apply(this,a); }; });

/* ---------- barra do topo ---------- */
const _renderStatsAntigo = renderStats;
renderStats = function(){
  if(!S.idade || !entrou()){ $("#stats").innerHTML=""; document.body.classList.add("semnav"); return; }
  document.body.classList.remove("semnav");
  const li = level(S.pts), next = LEVELS[li+1];
  $("#stats").innerHTML = `
    <span class="pill pts" title="${next?`Faltam ${next.min-S.pts} pts para ${next.nome}`:"Nível máximo"}">${ic("estrela",16)} ${S.pts} pontos</span>
    <span class="pill lvl">${LEVELS[li].nome}</span>
    <span class="pill med">${ic("medalha",16)} ${Object.keys(S.medalhas).length}/${Object.keys(MEDALS).length}</span>
    <button class="pill" id="som" aria-pressed="${S.som!==false}" title="Ligar ou desligar o som">${ic(S.som!==false?"som":"mudo",16)}<span>${S.som!==false?"Som":"Mudo"}</span></button>
    <button class="meu" id="meu" title="Trocar jogador"><img src="${IMG[(KIDS[S.avatar]||KIDS.ana).img]}" alt="${esc(S.nome||"Jogador")}"></button>`;
  $("#som").onclick=()=>{ S.som = S.som===false; save(); renderStats(); };
  $("#meu").onclick=sairJogador;
  montaMenu();
};

/* ---------- painel principal ---------- */
function paginaHead(eyebrow, titulo, sub){ return `<div class="gamehead"><div><span class="eyebrow">${eyebrow}</span><h2>${titulo}</h2>${sub?`<p class="muted">${sub}</p>`:""}</div></div>`; }
function homeNovo(){
  clearTimer(); if(typeof stopArcade==="function") stopArcade();
  NAV_AT="painel"; renderStats();
  const feitas = Object.keys(S.feitas).length, li = level(S.pts), next = LEVELS[li+1];
  const pct = next ? Math.round(((S.pts-LEVELS[li].min)/(next.min-LEVELS[li].min))*100) : 100;
  const nMed = Object.keys(S.medalhas).length, tMed = Object.keys(MEDALS).length;
  const dica = feitas ? ["Pequenos cuidados. Grandes resultados!","Olhe o quintal com atenção e peça ajuda de um adulto sempre que encontrar um risco."]
                      : ["Comece pelo Quem é quem?","Primeiro aprenda a diferenciar o Aedes do maruim. Depois é só escolher a próxima missão!"];
  app.innerHTML = `
    <div class="topo">
      <section class="herocard">
        <div><span class="chip">Agente ${AGES[S.idade-1].nome} · ${S.pts} pontos</span>
          <h1>Sem água parada, sem mosquito!</h1>
          <p>Complete missões, jogue e ganhe medalhas. O Listras e o Pintas vão ajudar você nessa aventura pela ciência.</p>
          <button class="btn sun" id="escolher">Escolher missão</button></div>
        <div class="mascotes"><img src="${IMG["listras-ola"]}" alt="Listras"><img src="${IMG["pintas-pulando"]}" alt="Pintas"></div>
      </section>
      <section class="dicacard"><span class="chip claro">Dica da professora</span><h3>${dica[0]}</h3><p>${dica[1]}</p><img src="${IMG["catarina-busto"]}" alt="Professora Catarina"></section>
    </div>
    <div class="numeros">
      <div class="numero"><span class="ic">${ic("estrela",22)}</span><span><b>${S.pts}</b><small>Pontos acumulados</small></span></div>
      <div class="numero"><span class="ic">${ic("medalha",22)}</span><span><b>${nMed} de ${tMed}</b><small>Medalhas da jornada</small></span></div>
      <div class="numero barra"><div class="lin"><span>Nível ${LEVELS[li].nome}</span><span>${next?pct+"%":"máximo"}</span></div><i><b style="width:${pct}%"></b></i>
        <small style="display:block;margin-top:8px">${next?`Faltam ${next.min-S.pts} pts para ${next.nome}`:"Você chegou ao nível máximo!"}</small></div>
    </div>
    <h2 class="secao">${ic("book",26)} Biblioteca de aventuras</h2>
    <div class="livros">${LIVROS.map(l=>{ const r=(S.leitura||{})[l.id]; const lido=S.medalhas["livro_"+l.id];
      return `<button class="livro" data-livro="${l.id}"><img src="livros/${l.id}/t01.webp" alt="" loading="lazy"><span><span class="tipo">Livro ilustrado</span><b>${l.titulo}</b><small>${l.sub}</small>
        <span class="ler">${lido?"✓ Lido · ler de novo":r&&r.pag?`Continuar na página ${r.pag+1}`:"Ler história"}</span></span></button>`; }).join("")}</div>
    <h2 class="secao">${ic("controle",26)} Fliperama educativo</h2>
    <div class="fliper">${ARCADE.map(a=>`<button class="fcard" data-go="${a.id}" style="--c:${a.cor}">
        <span class="fimg"><img src="${IMG[POSE[a.who][a.who==="L"?"oi":"ok"]]}" alt=""></span>
        <h3>${a.nome}</h3><p>${a.desc}</p>${S.feitas[a.id]?`<span class="feito">✓ Já jogou · recorde ${((Ranking.ler().j[Ranking.nome().toLowerCase()]||{best:{}}).best||{})[a.id]||0} pts</span>`:""}
        <span class="fpe"><span>${ic(ICO_JOGO[a.id],16)} até +80 pts</span><i>Jogar</i></span></button>`).join("")}</div>
    <h2 class="secao" id="missoes">${ic("alvo",26)} Missões de conhecimento</h2>
    <div class="missoes">${MISSIONS.map(m=>{ const tranca = m.lock && feitas < m.lock && !S.feitas[m.id]; const [i,c,k]=ICO_MISSAO[m.id]||["alvo","#eee","#333"];
      return `<button class="mscard" data-go="${m.id}" ${tranca?"disabled":""} style="--c:${c};--k:${k}"><span class="ic">${ic(tranca?"cadeado":i,26)}</span>
        <span><b>${m.nome}</b><small>${m.desc}</small>${S.feitas[m.id]?'<span class="ok">✓ Concluída · jogar de novo</span>':""}</span><span class="seta">${ic("seta",20)}</span></button>`; }).join("")}</div>
    <h2 class="secao">${ic("medalha",26)} Sua coleção de medalhas</h2>
    <div class="moedas">${Object.entries(MEDALS).map(([k,v])=>`<div class="moeda ${S.medalhas[k]?"on":""}" title="${esc(v.desc)}"><span class="c">${ic(ICO_MEDALHA[k]||"estrela",24)}</span><b>${v.nome}</b><small>${S.medalhas[k]?"Conquistada":"A desbloquear"}</small></div>`).join("")}</div>
    <div class="acoes"><button class="btn" data-go="ranking">${ic("trofeu",18)} Ver ranking</button><button class="btn ghost" id="trocar">Trocar jogador</button></div>
    <section class="panel teacher" style="margin-top:30px">
      <h2>Para educadores</h2>
      <p style="margin-top:8px">Cada missão leva de 3 a 8 minutos. Sugestão: projete o jogo em sala e jogue em equipes, ou use a <b>Vistoria em casa</b> como tarefa semanal com a família. O progresso fica salvo neste navegador.</p>
      <ul>
        <li>Faixa Mirim: linguagem simples e mais tempo no Caça aos criadouros.</li>
        <li>Explorador e Cientista: perguntas sobre ciclo, sinais de alarme, sorotipos e transmissão.</li>
        <li>Segurança: crianças observam e avisam. Caixa d'água, calhas, lugares altos, vidro e produtos químicos ficam com os adultos.</li>
        <li>Fontes: <a href="https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/d/dengue" target="_blank" rel="noopener">Ministério da Saúde</a> e <a href="https://portal.fiocruz.br/" target="_blank" rel="noopener">Fiocruz</a>.</li>
      </ul>
      <p class="alert" style="margin-top:12px">Febre, dor no corpo, manchas na pele? Procure uma unidade de saúde e não tome remédio por conta própria.</p>
    </section>`;
  app.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>GAMES[b.dataset.go]());
  app.querySelectorAll("[data-livro]").forEach(b=>b.onclick=()=>telaLeitor(b.dataset.livro));
  $("#trocar").onclick=sairJogador;
  $("#escolher").onclick=()=>$("#missoes").scrollIntoView({behavior:"smooth"});
  window.scrollTo(0,0);
}
home = function(){ if(!entrou()) return telaLogin(); homeNovo(); };

/* ---------- biblioteca ---------- */
function telaBiblioteca(){
  clearTimer(); if(typeof stopArcade==="function") stopArcade(); marcaNav("biblioteca");
  app.innerHTML = paginaHead("Histórias que ensinam","Biblioteca BugKids","Leia com a turma ou com a família. Quem lê até o fim ganha medalha.") +
    `<div class="livros">${LIVROS.map(l=>{ const r=(S.leitura||{})[l.id]; return `<button class="livro" data-livro="${l.id}"><img src="livros/${l.id}/t01.webp" alt=""><span><span class="tipo">${l.n} páginas</span><b>${l.titulo}</b><small>${l.sub}</small><span class="ler">${S.medalhas["livro_"+l.id]?"✓ Lido · ler de novo":r&&r.pag?`Continuar na página ${r.pag+1}`:"Ler história"}</span></span></button>`; }).join("")}</div>`;
  app.querySelectorAll("[data-livro]").forEach(b=>b.onclick=()=>telaLeitor(b.dataset.livro));
  window.scrollTo(0,0);
}
const _leitor = telaLeitor;
telaLeitor = function(id, pg, doLogin){ if(entrou()) marcaNav("biblioteca"); return _leitor(id, pg, doLogin); };

/* ---------- entrada ---------- */
const _login = telaLogin;
telaLogin = function(modo){ document.body.classList.add("semnav"); fechaMenu(); _login(modo); };

/* ---------- fim de missão ---------- */
endScreen = function(titulo, msg, acertos, total, pts, who){
  clearTimer();
  const r = total==null ? Math.min(1,acertos/170) : total ? acertos/total : 1;
  const li = level(S.pts);
  app.innerHTML = head(titulo) + `
    <section class="fimcard ${r<.5?"baixo":""}">
      <span class="chip">${ic(r>=.5?"trofeu":"ciclo",14)} ${r>=.85?"Conquista desbloqueada":r>=.5?"Missão concluída":"Quase lá"}</span>
      <h2>${r>=.5?"Parabéns, agente!":"Vamos tentar de novo?"}</h2>
      <p>${msg}</p>
      <div class="placar">${total==null?`${acertos}`:`${acertos}/${total}`}<small>${total==null?"pontos no jogo":"acertos"}</small></div>
      <span class="ganho">+${pts} pontos para você</span>
      ${r>=.5?`<div class="turma">${["ana","pedro","julia","guto"].map(k=>`<img src="${IMG[CORPO[k]]}" alt="${KIDS[k].nome}">`).join("")}</div>`
             :dicaCatarina("Errar faz parte de investigar. Leia as explicações com calma e tente mais uma vez!")}
    </section>
    <div class="numeros">
      <div class="numero"><span class="ic">${ic("estrela",22)}</span><span><b>${S.pts}</b><small>Pontuação total</small></span></div>
      <div class="numero"><span class="ic">${ic("medalha",22)}</span><span><b>${Object.keys(S.medalhas).length}/${Object.keys(MEDALS).length}</b><small>Medalhas</small></span></div>
      <div class="numero"><span class="ic">${ic("alvo",22)}</span><span><b>${LEVELS[li].nome}</b><small>Seu nível</small></span></div>
    </div>
    <div class="row centro" style="margin-top:20px"><button class="btn sun" id="again">Jogar de novo</button><button class="btn" id="rk">${ic("trofeu",16)} Ver ranking</button><button class="btn ghost" id="mapa">Voltar ao painel</button></div>`;
  bindBack(); $("#mapa").onclick=home; $("#rk").onclick=()=>GAMES.ranking();
  return $("#again");
};
head = function(titulo, extra=""){
  return `<div class="gamehead"><div class="row"><button class="btn ghost" id="voltar">← Painel</button><div><span class="eyebrow">${MISSIONS.some(m=>m.nome===titulo)?"Missão de conhecimento":ARCADE.some(a=>a.nome===titulo||a.titulo===titulo)?"Fliperama":"ArboGame"}</span><h2>${titulo}</h2></div></div>${extra}</div>`;
};
prog = function(i,n){ return `<div class="qprog" aria-label="Pergunta ${i+1} de ${n}"><div class="lin"><span>Progresso da missão</span><span>${i+1} / ${n}</span></div><i><b style="width:${Math.round(i/n*100)}%"></b></i></div>`; };

/* ---------- pódio no ranking ---------- */
function montaPodio(){
  const lista = app.querySelector(".rlist"); if(!lista || lista.dataset.podio) return;
  lista.dataset.podio = "1";
  const itens = [...lista.children].slice(0,3); if(itens.length<1) return;
  const perfisPorNome = {}; Object.values(perfis()).forEach(p=>{ if(p.nome) perfisPorNome[p.nome.toLowerCase()] = p.avatar; });
  const pod = document.createElement("div"); pod.className = "podio";
  pod.innerHTML = itens.map((li,i)=>{ const nome = li.querySelector(".rn").childNodes[0].textContent.trim(); const pts = li.querySelector(".rv").textContent;
    const avk = perfisPorNome[nome.toLowerCase()] || ["ana","pedro","julia","guto","listras","pintas"][[...nome].reduce((s,c)=>s+c.charCodeAt(0),0)%6];
    return `<div class="lugar p${i+1}">${avatar(avk)}<b>${esc(nome)}</b><small>${pts}</small><div class="base">${i+1}º</div></div>`; }).join("");
  lista.before(pod);
}
new MutationObserver(()=>{ if(NAV_AT==="ranking") montaPodio(); }).observe(app, {childList:true, subtree:true});
