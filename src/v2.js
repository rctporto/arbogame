/* ================== ARBOGAME 2.0 · repaginação (07/11/2026) ==================
   Segue o "Guia de repaginação" e as 8 pranchas. Carregado por último: só muda a apresentação e a navegação.
   Regras dos jogos, login, aprovação de cadastro, perfis, livros, ranking, pontos e medalhas continuam
   nos arquivos antigos e nos mesmos lugares de armazenamento (a versão 1 segue em /v1/ lendo os mesmos dados). */
document.body.classList.add("v2");
const V2_VERSAO = "2.0";

/* ---------- ícones novos ---------- */
Object.assign(ICO, {
  bandeira:'<path d="M4 22V4"/><path d="M4 4h13l-2 4 2 4H4"/>',
  broto:'<path d="M12 22v-9"/><path d="M12 13c0-4 3-7 8-7 0 4-3 7-8 7z"/><path d="M12 15c0-3-2.5-5.5-7-5.5 0 3.5 2.5 5.5 7 5.5z"/>',
  pontos:'<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
  play:'<path d="M8 5.5v13l11-6.5z"/>',
  voltar:'<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
  baixar:'<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>',
  olho: ICO.olho || '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
});
const V2_LOGO = `<svg viewBox="0 0 48 40" width="38" height="32" aria-hidden="true"><path d="M22 36C10 36 4 26 6 12c12 0 20 8 16 24z" fill="#3FAE6A"/><path d="M24 36c-2-15 7-27 20-28 2 14-6 27-20 28z" fill="#16845B"/><path d="M23 35c1-8 5-15 13-20" stroke="#E5F3EA" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`;
const marcaV2 = (sub="") => `<span class="v2marca">${V2_LOGO}<span><b>ArboGame</b>${sub?`<small>${sub}</small>`:""}</span></span>`;

/* ---------- seções e navegação ---------- */
const V2_NAV = [
  ["painel","home","Início"], ["jogar","controle","Jogar"], ["missoes","bandeira","Missões"],
  ["meuquintal","broto","Meu Quintal"], ["biblioteca","book","Biblioteca"], ["conquistas","trofeu","Conquistas"]];
const V2_BNAV = [["painel","home","Início"], ["jogar","controle","Jogar"], ["missoes","bandeira","Missões"], ["meuquintal","broto","Quintal"], ["mais","pontos","Mais"]];
const grupoNav = id => ARCADE.some(a=>a.id===id) ? "jogar" : MISSIONS.some(m=>m.id===id) ? "missoes" : id==="ranking" ? "conquistas" : id;
let V2_SECAO = "painel"; // para onde o "Voltar" leva
function irPara(id){
  fechaMenu();
  if(id==="painel") return home();
  if(id==="jogar") return telaJogar();
  if(id==="missoes") return telaMissoes();
  if(id==="meuquintal") return GAMES.meuquintal();
  if(id==="biblioteca") return telaBiblioteca();
  if(id==="conquistas") return telaConquistas();
  if(id==="ranking") return GAMES.ranking();
  if(id==="mais") return abreMais();
  if(GAMES[id]) return GAMES[id]();
}
const feitasN = () => Object.keys(S.feitas||{}).length;
const trancada = m => !!(m.lock && feitasN() < m.lock && !S.feitas[m.id]);

montaMenu = function(){
  const side = $("#side"); if(!side) return;
  const at = grupoNav(NAV_AT);
  const item = ([id, icone, nome]) => `<button type="button" data-nav="${id}" ${at===id?'aria-current="page"':""}>${ic(icone,20)}<span>${nome}</span></button>`;
  const kid = KIDS[S.avatar] || KIDS.ana;
  side.innerHTML = `
    <div class="sbrand">${marcaV2()}</div>
    <nav class="v2nav" aria-label="Seções">${V2_NAV.map(item).join("")}</nav>
    <nav class="v2mais" aria-label="Mais opções">
      <button type="button" data-nav="ranking" ${at==="conquistas"&&NAV_AT==="ranking"?'aria-current="page"':""}>${ic("estrela",18)}<span>Ranking</span></button>
      <button type="button" class="temabtn"></button>
      ${ss.get(DEV_OK)?`<button type="button" id="atalhodev">${ic("olho",18)}<span>Área do desenvolvedor</span></button>`:""}
    </nav>
    ${S.idade && entrou() ? `<div class="sjog"><img src="${IMG[kid.img]}" alt=""><span><b>${esc(S.nome||"Agente")}</b><small>${AGES[S.idade-1].nome} · ${LEVELS[level(S.pts)].nome}</small></span></div>
    <nav class="v2conta"><button type="button" data-nav="sair">${ic("users",18)}<span>Trocar jogador</span></button>${ACC.user?`<button type="button" id="v2sairconta">${ic("sair",18)}<span>Sair da conta</span></button>`:""}</nav>` : ""}`;
  side.querySelectorAll("[data-nav]").forEach(b=>b.onclick=()=>{ const id=b.dataset.nav; if(id==="sair"){ fechaMenu(); return sairJogador(); } irPara(id); });
  side.querySelector(".temabtn").onclick=trocaTema;
  const ad=side.querySelector("#atalhodev"); if(ad) ad.onclick=()=>{ fechaMenu(); ss.set(VER_USUARIO,null); pilulaDev(); location.hash="#dev"; telaDev(); };
  const sc=side.querySelector("#v2sairconta"); if(sc) sc.onclick=()=>{ fechaMenu(); sairConta(); };
  montaBnav(); aplicaTema();
};
function montaBnav(){
  let n = $("#bnav");
  if(!n){ n = document.createElement("nav"); n.id = "bnav"; n.className = "bnav"; n.setAttribute("aria-label","Navegação principal"); document.body.appendChild(n); }
  const at = document.body.classList.contains("navaberta") ? "mais" : grupoNav(NAV_AT);
  n.innerHTML = V2_BNAV.map(([id, icone, nome])=>`<button type="button" data-b="${id}" ${at===id?'aria-current="page"':""}>${ic(icone,22)}<span>${nome}</span></button>`).join("");
  n.querySelectorAll("[data-b]").forEach(b=>b.onclick=()=>{ const id=b.dataset.b; if(id==="mais"){ document.body.classList.contains("navaberta") ? (fechaMenu(), montaBnav()) : abreMais(); } else irPara(id); });
}
function abreMais(){ document.body.classList.add("navaberta"); const m=$("#menubtn"); if(m) m.setAttribute("aria-expanded","true"); montaBnav();
  const f=$("#side [data-nav='biblioteca']"); if(f) f.focus(); }
const _fechaMenuV2 = fechaMenu;
fechaMenu = function(){ _fechaMenuV2(); const n=$("#bnav"); if(n) montaBnav(); };
addEventListener("keydown", e=>{ if(e.key==="Escape" && document.body.classList.contains("navaberta")) fechaMenu(); });

/* "Voltar" leva à seção de onde a criança veio (Jogar, Missões, Início...) */
bindBack = function(){ const b=$("#voltar"); if(b){ b.innerHTML = `${ic("voltar",18)} Voltar`; b.onclick=()=>irPara(V2_SECAO); } window.scrollTo(0,0); };
function secao(id){ V2_SECAO = id; NAV_AT = id; document.body.classList.toggle("semnav", !entrou()); montaMenu(); }

/* ---------- barra do topo ---------- */
renderStats = function(){
  const brand = $(".status .brand");
  if(!S.idade || !entrou()){ $("#stats").innerHTML=""; document.body.classList.add("semnav"); if(brand) brand.innerHTML = marcaV2(); return; }
  document.body.classList.remove("semnav");
  const li = level(S.pts), nMed = Object.keys(S.medalhas).length, tMed = Object.keys(MEDALS).length;
  if(brand) brand.innerHTML = `<span class="v2so-m">${marcaV2()}</span><span class="v2ola"><b>Olá, ${esc(S.nome||"agente")}!</b><small>${AGES[S.idade-1].nome} · nível ${LEVELS[li].nome}</small></span>`;
  $("#stats").innerHTML = `
    <span class="chipv pts" title="Pontos acumulados">${ic("estrela",16)} <b>${S.pts}</b><span class="v2so-d"> pontos</span></span>
    <span class="chipv med" title="Medalhas conquistadas">${ic("medalha",16)} <b>${nMed}</b><span class="v2so-d"> de ${tMed} medalhas</span></span>
    <span class="chipv lvl v2so-d">${ic("escudo",16)} ${LEVELS[li].nome}</span>
    <button class="chipv icone" id="som" type="button" aria-pressed="${S.som!==false}" aria-label="${S.som!==false?"Desligar o som":"Ligar o som"}" title="Som">${ic(S.som!==false?"som":"mudo",18)}</button>
    <button class="meu" id="meu" type="button" title="Trocar jogador" aria-label="Trocar jogador (${esc(S.nome||"")})"><img src="${IMG[(KIDS[S.avatar]||KIDS.ana).img]}" alt=""></button>`;
  $("#som").onclick=()=>{ S.som = S.som===false; save(); renderStats(); };
  $("#meu").onclick=sairJogador;
  montaMenu();
};

/* ---------- peças reutilizadas ---------- */
const v2head = (titulo, sub, icone) => `<header class="v2head"><h1>${icone?ic(icone,30):""}${titulo}</h1>${sub?`<p>${sub}</p>`:""}</header>`;
const dicaProf = (titulo, texto) => `<section class="v2dica"><img src="${IMG["catarina-busto"]}" alt="Professora Catarina"><div><b>${ic("ideia",18)} ${titulo}</b><p>${texto}</p></div></section>`;
const CAT_JOGO = {esvazia:"acao", varre:"acao", coleta:"acao", espanta:"acao", fuga:"acao", labirinto:"raciocinio", memoria:"raciocinio", sudoku:"raciocinio", mahjong:"raciocinio"};
const TAG_JOGO = {esvazia:"Eliminar criadouros", varre:"Limpeza do quintal", coleta:"Coleta e reciclagem", espanta:"Prevenção", labirinto:"Raciocínio e rota",
  fuga:"Ação e estratégia", memoria:"Memória e atenção", sudoku:"Lógica com personagens", mahjong:"Atenção e pares"};
const COR_JOGO = {acao:"var(--v2-sky)", raciocinio:"var(--v2-lilac)"};
const COR_MISSAO = {vetores:"var(--v2-sun)", quintal:"var(--v2-mint)", ciclo:"var(--v2-sky)", detetive:"var(--v2-coral)", mito:"var(--v2-lilac)", casa:"var(--v2-sun)", final:"var(--v2-sun)"};
const recorde = id => { try{ return ((Ranking.ler().j[Ranking.nome().toLowerCase()]||{best:{}}).best||{})[id]||0; }catch(e){ return 0; } };
function cardJogo(a){
  const c = CAT_JOGO[a.id]||"acao", feito = S.feitas[a.id];
  return `<button type="button" class="v2jogo" data-go="${a.id}" data-cat="${c}" style="--c:${COR_JOGO[c]}">
    <span class="capa"><img src="${CAPA(a.id)}" alt="" loading="lazy" onerror="this.parentNode.classList.add('semimg')"></span>
    <span class="txt"><b>${esc(a.nome)}</b><small>${TAG_JOGO[a.id]||""}</small>${feito?`<span class="rec">${ic("check",14)} ${recorde(a.id)?`Recorde ${recorde(a.id)} pts`:"Já jogou"}</span>`:""}</span>
    <span class="play" aria-hidden="true">${ic("play",18)}</span></button>`;
}
function cardMissao(m){
  const t = trancada(m), ok = S.feitas[m.id]; const [i] = ICO_MISSAO[m.id]||["alvo"];
  return `<button type="button" class="v2missao ${ok?"ok":""}" data-go="${m.id}" ${t?"disabled":""} style="--c:${COR_MISSAO[m.id]||"var(--v2-mint)"}">
    <span class="ic">${ic(t?"cadeado":i,26)}</span>
    <span class="txt"><b>${esc(m.nome)}</b><small>${esc(m.desc)}</small>
      <span class="estado">${t?`${ic("cadeado",14)} Bloqueada · conclua ${m.lock} atividades para liberar (${feitasN()}/${m.lock})`:ok?`${ic("check",14)} Concluída · jogar de novo`:`${ic("play",14)} Começar`}</span></span>
    <span class="seta">${ic("seta",20)}</span></button>`;
}
function ligaGo(raiz){ raiz.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>irPara(b.dataset.go)); }

/* ---------- 05 · painel inicial ---------- */
homeNovo = function(){
  clearTimer(); if(typeof stopArcade==="function") stopArcade();
  secao("painel"); renderStats();
  const prox = MISSIONS.find(m=>!S.feitas[m.id] && !trancada(m));
  const li = level(S.pts), next = LEVELS[li+1];
  const pct = next ? Math.round(((S.pts-LEVELS[li].min)/(next.min-LEVELS[li].min))*100) : 100;
  const nMed = Object.keys(S.medalhas).length, tMed = Object.keys(MEDALS).length;
  const par = S.avatar==="pintas" ? "listras-ola" : "pintas-pulando";
  const r = typeof resumoQuintal==="function" ? resumoQuintal() : null;
  const qTxt = !r ? "Você ganhou um quintal para cuidar! Ele muda em tempo real." : r.grave ? `${r.grave===1?"Um alerta urgente":r.grave+" alertas urgentes"}: larvas, mosquito ou maruins!`
    : r.al ? `${r.al} ${r.al===1?"coisa precisa":"coisas precisam"} de cuidado.` : "Tudo em ordem por enquanto. Volte mais tarde!";
  app.innerHTML = `
    <section class="v2hero">
      <div class="txt"><h1>Sua próxima aventura começa aqui!</h1>
        <p>Explore, jogue, aprenda e descubra os segredos do nosso quintal com os BugKids.</p>
        ${prox ? `<button type="button" class="v2btn" data-go="${prox.id}">${ic("play",18)} Próxima missão: ${esc(prox.nome)}</button>`
               : `<button type="button" class="v2btn" data-go="missoes">${ic("bandeira",18)} Escolher missão</button>`}</div>
      <div class="arte"><img class="kid" src="${corpo(S.avatar)}" alt=""><img class="mas" src="${IMG[par]}" alt=""></div>
    </section>
    <div class="v2atalhos">
      <button type="button" class="v2quintal ${r&&r.grave?"urgente":""}" data-go="meuquintal"><img src="jogos/capas/quintal.webp" alt="" onerror="this.remove()">
        <span><b>Meu Quintal</b><small>${qTxt}</small></span><span class="seta">${ic("seta",18)}</span></button>
      <button type="button" class="v2atalho" data-go="jogar" style="--c:var(--v2-lilac)"><span class="ic">${ic("controle",28)}</span><b>Jogar</b><small>9 jogos para aprender se divertindo</small></button>
      <button type="button" class="v2atalho" data-go="missoes" style="--c:var(--v2-mint)"><span class="ic">${ic("broto",28)}</span><b>Aprender</b><small>Missões sobre insetos e saúde</small></button>
      <button type="button" class="v2atalho" data-go="biblioteca" style="--c:var(--v2-sky)"><span class="ic">${ic("book",28)}</span><b>Ler</b><small>Histórias dos BugKids</small></button>
    </div>
    ${dicaProf("Dica da Professora Catarina", feitasN() ? "Pequenos cuidados, grandes resultados! Olhe o quintal com atenção e peça ajuda de um adulto sempre que encontrar um risco."
      : "Que tal começar pelo <b>Quem é quem?</b> Primeiro aprenda a diferenciar o Aedes do maruim. Depois, cuide do seu <b>Meu Quintal</b>!")}
    <div class="v2numeros">
      <div class="v2num"><span class="ic">${ic("estrela",22)}</span><span><b>${S.pts}</b><small>pontos</small></span></div>
      <div class="v2num"><span class="ic">${ic("medalha",22)}</span><span><b>${nMed} de ${tMed}</b><small>medalhas</small></span></div>
      <div class="v2num barra"><div class="lin"><span>Nível ${LEVELS[li].nome}</span><span>${next?pct+"%":"máximo"}</span></div><i><b style="width:${pct}%"></b></i>
        <small>${next?`Faltam ${next.min-S.pts} pontos para ${next.nome}`:"Você chegou ao nível máximo!"}</small></div>
      <button type="button" class="v2num link" data-go="ranking"><span class="ic">${ic("trofeu",22)}</span><span><b>Ranking</b><small>ver a turma</small></span></button>
    </div>
    <details class="v2educ"><summary>Para educadores e famílias</summary>
      <p>Cada missão leva de 3 a 8 minutos. Sugestão: projete o jogo em sala e jogue em equipes, ou use a <b>Vistoria em casa</b> como tarefa semanal com a família. O progresso fica salvo neste navegador.</p>
      <ul><li>Faixa Mirim: linguagem simples e mais tempo no Caça aos criadouros.</li><li>Explorador e Cientista: perguntas sobre ciclo, sinais de alarme, sorotipos e transmissão.</li>
      <li>Segurança: crianças observam e avisam. Caixa d'água, calhas, lugares altos, vidro e produtos químicos ficam com os adultos.</li>
      <li>Fontes: <a href="https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/d/dengue" target="_blank" rel="noopener">Ministério da Saúde</a> e <a href="https://portal.fiocruz.br/" target="_blank" rel="noopener">Fiocruz</a>.</li></ul>
      <p class="alert">Febre, dor no corpo, manchas na pele? Procure uma unidade de saúde e não tome remédio por conta própria.</p></details>`;
  ligaGo(app); window.scrollTo(0,0);
};

/* ---------- 09 / 30 · catálogo de jogos ---------- */
function telaJogar(filtro){
  clearTimer(); if(typeof stopArcade==="function") stopArcade(); secao("jogar"); renderStats();
  const f = filtro || "todos";
  app.innerHTML = `${v2head("Qual é a aventura de hoje?","Jogos divertidos para aprender, cuidar do ambiente e combater o mosquito.","controle")}
    <div class="v2filtro" role="group" aria-label="Filtrar jogos">${[["todos","Todos"],["acao","Ação"],["raciocinio","Raciocínio"]].map(([k,n])=>`<button type="button" data-f="${k}" aria-pressed="${f===k}">${n}</button>`).join("")}</div>
    <div class="v2jogos">${ARCADE.filter(a=>f==="todos"||CAT_JOGO[a.id]===f).map(cardJogo).join("")}</div>`;
  ligaGo(app); app.querySelectorAll("[data-f]").forEach(b=>b.onclick=()=>telaJogar(b.dataset.f));
  window.scrollTo(0,0);
}
/* ---------- missões ---------- */
function telaMissoes(){
  clearTimer(); if(typeof stopArcade==="function") stopArcade(); secao("missoes"); renderStats();
  const ok = MISSIONS.filter(m=>S.feitas[m.id]).length;
  app.innerHTML = `${v2head("Missões de conhecimento","Aprenda sobre o Aedes, o maruim e a prevenção. Cada missão leva de 3 a 8 minutos.","bandeira")}
    <div class="v2prog"><div class="lin"><span>${ok} de ${MISSIONS.length} missões concluídas</span><span>${Math.round(ok/MISSIONS.length*100)}%</span></div><i><b style="width:${Math.round(ok/MISSIONS.length*100)}%"></b></i></div>
    <div class="v2missoes">${MISSIONS.map(cardMissao).join("")}</div>
    <button type="button" class="v2quintal largo" data-go="meuquintal"><img src="jogos/capas/quintal.webp" alt="" onerror="this.remove()">
      <span><b>Missão de todo dia: Meu Quintal</b><small>Um quintal que muda em tempo real. Cumpra as missões do dia e mantenha tudo sem criadouros.</small></span><span class="seta">${ic("seta",18)}</span></button>`;
  ligaGo(app); window.scrollTo(0,0);
}
/* ---------- 24 · conquistas ---------- */
function telaConquistas(){
  clearTimer(); if(typeof stopArcade==="function") stopArcade(); secao("conquistas"); renderStats();
  const nMed = Object.keys(S.medalhas).length, tMed = Object.keys(MEDALS).length;
  const fin = MISSIONS.find(m=>m.id==="final"), tf = fin && trancada(fin);
  app.innerHTML = `${v2head("Conquistas","Colecione medalhas e acompanhe sua jornada de prevenção.","trofeu")}
    <div class="v2conq">
      <div class="v2numeros dois">
        <div class="v2num"><span class="ic">${ic("medalha",22)}</span><span><b>${nMed} de ${tMed}</b><small>medalhas</small></span></div>
        <div class="v2num"><span class="ic">${ic("estrela",22)}</span><span><b>${S.pts}</b><small>pontos · ${LEVELS[level(S.pts)].nome}</small></span></div></div>
      ${fin?`<button type="button" class="v2final ${tf?"tranca":""}" data-go="final" ${tf?"disabled":""}>${ic(tf?"cadeado":"trofeu",34)}<b>Desafio final</b>
        <small>${S.feitas.final?"Concluído! Jogue de novo quando quiser.":tf?`Conclua ${fin.lock} atividades para liberar (${feitasN()}/${fin.lock}).`:"Pronto para o desafio?"}</small></button>`:""}
    </div>
    <h2 class="v2sec">Medalhas</h2>
    <ul class="v2medalhas">${Object.entries(MEDALS).map(([k,v],i)=>{ const on=!!S.medalhas[k];
      return `<li class="${on?"on":""}"><span class="moeda">${ic(on?(ICO_MEDALHA[k]||"estrela"):"cadeado",24)}</span><b>${esc(v.nome)}</b><small>${esc(v.desc)}</small><span class="st">${on?"Conquistada":"A desbloquear"}</span></li>`; }).join("")}</ul>
    <div class="row" style="margin-top:22px"><button type="button" class="v2btn" data-go="ranking">${ic("trofeu",18)} Ver ranking</button></div>`;
  ligaGo(app); window.scrollTo(0,0);
}
GAMES.jogar = ()=>telaJogar(); GAMES.missoes = telaMissoes; GAMES.conquistas = telaConquistas;

/* ---------- 06 · biblioteca ---------- */
telaBiblioteca = function(){
  clearTimer(); if(typeof stopArcade==="function") stopArcade(); secao("biblioteca"); renderStats();
  app.innerHTML = v2head("Biblioteca de aventuras","Leia as histórias dos BugKids com a turma ou com a família. Quem lê até o fim ganha medalha.","book") +
    `<div class="v2livros">${LIVROS.map(l=>{ const r=(S.leitura||{})[l.id], lido=S.medalhas["livro_"+l.id];
      const pct = lido ? 100 : r&&r.pag ? Math.round((r.pag+1)/l.n*100) : 0;
      return `<article class="v2livro"><div class="capa"><img src="livros/${l.id}/t01.webp" alt="Capa de ${esc(l.titulo)}" loading="lazy"><span class="pg">${l.n} páginas</span></div>
        <div class="txt"><b>${esc(l.titulo)}</b><small>${esc(l.sub)}</small>
        <div class="v2prog mini"><div class="lin"><span>Progresso de leitura</span><span>${pct}%</span></div><i><b style="width:${pct}%"></b></i></div>
        <button type="button" class="v2btn" data-livro="${l.id}">${ic("book",18)} ${lido?"Ler de novo":r&&r.pag?`Continuar na página ${r.pag+1}`:"Ler história"}</button></div></article>`; }).join("")}</div>`;
  app.querySelectorAll("[data-livro]").forEach(b=>b.onclick=()=>telaLeitor(b.dataset.livro));
  window.scrollTo(0,0);
};
const _leitorV2 = telaLeitor;
telaLeitor = function(id, pg, doLogin){ const r = _leitorV2(id, pg, doLogin); if(entrou()){ V2_SECAO="biblioteca"; } return r; };

/* ---------- ranking e jogos: lembram a seção ---------- */
const _rankV2 = GAMES.ranking;
GAMES.ranking = function(...a){ V2_SECAO = "conquistas"; NAV_AT = "ranking"; const r = _rankV2.apply(this, a); montaMenu(); const v=$("#voltar"); if(v) bindBack(); return r; };
Object.keys(GAMES).forEach(k=>{
  if(["jogar","missoes","conquistas","ranking","dev"].includes(k)) return;
  const f = GAMES[k]; GAMES[k] = function(...a){ const g = grupoNav(k); if(g==="jogar"||g==="missoes") V2_SECAO = g; else if(k==="meuquintal") V2_SECAO = V2_SECAO==="meuquintal"?"painel":V2_SECAO; return f.apply(this, a); };
});

/* ---------- 01–04 · acesso ---------- */
const _telaAcessoV2 = telaAcesso;
telaAcesso = function(modo){
  if(modo==="recuperar") return telaRecuperar();
  _telaAcessoV2(modo);
  const ac = app.querySelector(".acesso"); if(!ac) return;
  ac.classList.add("v2acesso");
  const pn = ac.querySelector(".acpainel"); if(pn) pn.insertAdjacentHTML("afterbegin", `<div class="v2topoac">${marcaV2()}</div>`);
  const h = ac.querySelector(".actexto h1"); if(h) h.textContent = "Bem-vindo ao ArboGame!";
  const es = $("#acesqueci"); if(es){ es.textContent = "Esqueci minha senha"; es.onclick = ()=>telaAcesso("recuperar"); }
  const nota = ac.querySelector(".acpainel .nota"); if(nota) nota.innerHTML = `${ic("users",18)} <span>Conta de estudante com apoio de um adulto (responsável ou educador). Novos cadastros são liberados pela Nório.</span>`;
};
function telaRecuperar(){
  clearTimer(); document.body.classList.add("semnav"); fechaMenu(); $("#stats").innerHTML=""; renderStats();
  app.innerHTML = `<div class="acesso v2acesso">
    <div class="acarte"><img src="${IMG["catarina-busto"]}" alt="Professora Catarina" class="v2prof"><div class="actexto"><h1>Recuperar acesso</h1><p>Enviaremos um link para você criar uma nova senha.</p></div></div>
    <div class="panel acpainel"><div class="stack">
      <div class="v2topoac"><button type="button" class="linkbtn" id="rcvolta">${ic("voltar",16)} Voltar ao login</button>${marcaV2()}</div>
      <h2>Recuperar acesso</h2><p>Digite o e-mail da conta. Enviaremos um link para criar uma nova senha.</p>
      <form class="stack" id="rcform" style="gap:12px"><label class="campo"><span>E-mail</span><input id="rcemail" type="email" required autocomplete="email" placeholder="seu@email.com"></label>
        <button class="btn sun" type="submit" id="rcenviar">Enviar link</button></form>
      <div id="rcmsg" aria-live="polite"></div>
      <p class="nota simples">Entrou com o Google? Então use o botão <b>Entrar com o Google</b>: a senha é a da sua conta Google.</p></div></div></div>`;
  $("#rcvolta").onclick=()=>telaAcesso();
  $("#rcform").onsubmit=async e=>{ e.preventDefault(); const b=$("#rcenviar"), m=$("#rcmsg"), email=$("#rcemail").value.trim(); b.disabled=true; b.textContent="Enviando…";
    try{ if(!FBAUTH) throw {message:"O login não carregou. Confira a internet."}; await FBAUTH.sendPasswordResetEmail(email);
      m.innerHTML=`<p class="nota ok">Pronto! Se existir uma conta com <b>${esc(email)}</b>, o link chega em alguns minutos. Confira também o spam.</p>`; b.textContent="Enviar de novo"; }
    catch(err){ m.innerHTML=`<p class="alert">${esc(err.code==="auth/invalid-email"?"Esse e-mail não parece certo.":err.code==="auth/too-many-requests"?"Muitas tentativas. Espere um pouco e tente de novo.":err.code==="auth/network-request-failed"?"Sem conexão. Confira a internet.":(err.message||"Não deu certo. Tente de novo."))}</p>`; b.textContent="Enviar link"; }
    b.disabled=false; };
  window.scrollTo(0,0);
}

/* ---------- 02 · escolha do BugKid: grupos de escolha única acessíveis ---------- */
function radioGrupo(raiz, seletor, rotulo){
  const itens = [...raiz.querySelectorAll(seletor)]; if(!itens.length) return;
  const pai = itens[0].parentElement; pai.setAttribute("role","radiogroup"); pai.setAttribute("aria-label", rotulo);
  const sync = ()=>itens.forEach(b=>{ const on = b.getAttribute("aria-pressed")==="true" || b.classList.contains("on"); b.setAttribute("role","radio"); b.setAttribute("aria-checked", on); b.removeAttribute("aria-pressed"); b.tabIndex = on ? 0 : -1; });
  sync(); if(!itens.some(b=>b.tabIndex===0)) itens[0].tabIndex = 0;
  itens.forEach((b,i)=>{ b.addEventListener("click", ()=>setTimeout(()=>{ itens.forEach(x=>x.setAttribute("aria-pressed", x===b)); sync(); }, 0));
    b.addEventListener("keydown", e=>{ const d = {ArrowRight:1, ArrowDown:1, ArrowLeft:-1, ArrowUp:-1}[e.key]; if(!d) return; e.preventDefault(); const n = itens[(i+d+itens.length)%itens.length]; n.focus(); n.click(); }); });
}
const _telaLoginV2 = telaLogin;
telaLogin = function(...a){
  const r = _telaLoginV2.apply(this, a);
  const lg = app.querySelector(".login"); if(lg){ lg.classList.add("v2perfil");
    radioGrupo(lg, ".avopt", "Escolha seu BugKid"); radioGrupo(lg, "[data-age], .agebtn", "Sua faixa etária"); }
  return r;
};

/* ---------- jogo em tela cheia: sem dois cabeçalhos nem dois botões de tema ---------- */
const _telaJogoNovoV2 = telaJogoNovo;
telaJogoNovo = function(id){
  _telaJogoNovoV2(id);
  const bar = app.querySelector(".mjbar"); if(!bar) return;
  bar.querySelector(".mjtema")?.remove();
  bindBack();
  const som = document.createElement("span"); som.className = "mjnome"; som.innerHTML = `${V2_LOGO}`; bar.querySelector("b")?.before(som);
};

/* ---------- área do desenvolvedor: backup dos dados ---------- */
const _painelDevV2 = painelDev;
painelDev = function(topo, liga){
  _painelDevV2(topo, liga);
  const bar = app.querySelector(".devbar"); if(!bar || bar.querySelector("#v2backup")) return;
  const b = document.createElement("button"); b.type="button"; b.className="btn ghost"; b.id="v2backup"; b.innerHTML=`${ic("baixar",16)} Baixar backup dos dados`;
  b.title = "Cadastros (pedidos de acesso) e ranking online, num arquivo .json";
  (bar.querySelector(".row")||bar).appendChild(b);
  b.onclick = async ()=>{ b.disabled=true; const t=b.innerHTML; b.textContent="Gerando backup…";
    try{ const [ranking, acessos] = await Promise.all([DEV.todos().catch(e=>({erro:String(e.message||e)})), DEV.acessos().catch(e=>({erro:String(e.message||e)}))]);
      const pacote = {versao_site:V2_VERSAO, gerado:new Date().toISOString(), acessos, ranking, este_aparelho:{jogadores:perfis(), ranking_local:Ranking.ler()}};
      const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(pacote,null,1)],{type:"application/json"}));
      a.download = `arbogame-backup-${new Date().toISOString().slice(0,10)}.json`; document.body.appendChild(a); a.click(); a.remove(); toast("Backup baixado");
    }catch(e){ toast("Não deu para gerar o backup: "+(e.message||e)); }
    b.disabled=false; b.innerHTML=t; };
};

/* o link para a versão anterior saiu do rodapé (08/11/2026); a versão 1 continua guardada em /v1/ e na branch versao-1 */
const fecharDrawer = $("#sidefundo"); if(fecharDrawer) fecharDrawer.onclick = fechaMenu;
montaMenu(); renderStats();
