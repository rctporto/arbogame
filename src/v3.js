/* ================== ARBOGAME 2.1 · identidade nova (08/11/2026) ==================
   Logo nova (completa e simplificada), navegação no topo, página inicial e login refeitos no estilo das
   pranchas enviadas. Carregado depois do v2.js: só muda a apresentação. Regras dos jogos, login, aprovação
   de cadastro, perfis, pontos e medalhas continuam nos arquivos anteriores e funcionam do mesmo jeito. */
document.body.classList.add("v3");

Object.assign(ICO, {
  email:'<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/>',
  ajuda:'<circle cx="12" cy="12" r="9"/><path d="M9.6 9.2a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .8-1 1.5v.6"/><path d="M12 16.8h.01"/>',
  olhox:'<path d="M3 3l18 18"/><path d="M10.6 5.1c.5-.1.9-.1 1.4-.1 6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.6 6.6C3.9 8.4 2 12 2 12s3.5 7 10 7c2 0 3.8-.6 5.4-1.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
  flecha:'<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  folha2:'<path d="M5 19c0-8 6-14 15-14 0 9-6 15-14 15"/><path d="M5 19c3-4 6-7 10-9"/>',
});

/* ---------- a marca: completa (com slogan), só o nome e o ícone redondo ---------- */
const LOGO = {
  marca: `<span class="v3logo"><img class="lt" src="${IMG["logo-wordmark"]}" alt="ArboGame"><img class="dk" src="${IMG["logo-wordmark-escura"]}" alt="ArboGame"></span>`,
  completa: `<span class="v3logo completa"><img class="lt" src="${IMG["logo-completa"]}" alt="ArboGame. Jogue. Aprenda. Proteja."><img class="dk" src="${IMG["logo-completa-escura"]}" alt="ArboGame. Jogue. Aprenda. Proteja."></span>`,
  icone: `<img class="v3icone" src="${IMG["logo-icone"]}" alt="ArboGame">`,
};
V2_NAV[1][2] = "Jogos"; V2_BNAV[1][2] = "Jogos";

/* ---------- topo: logo, seções e conta ---------- */
function montaTopo(){
  const wrap = $(".status .wrap"); if(!wrap) return;
  let nav = $("#v3top");
  if(!nav){ nav = document.createElement("nav"); nav.id = "v3top"; nav.className = "v3top"; nav.setAttribute("aria-label","Seções");
    const br = wrap.querySelector(".brand"); (br ? br : wrap.firstChild).after(nav); }
  const at = grupoNav(NAV_AT);
  nav.innerHTML = V2_NAV.map(([id,,nome])=>`<button type="button" data-top="${id}" ${at===id?'aria-current="page"':""}>${nome}</button>`).join("")
    + `<span class="v3sep" aria-hidden="true"></span><button type="button" class="v3educ" data-top="educadores">Para educadores</button>`;
  nav.querySelectorAll("[data-top]").forEach(b=>b.onclick=()=>{ const id=b.dataset.top; if(id==="educadores") return abreEducadores(); irPara(id); });
}
function abreEducadores(){
  const ir = ()=>{ const d=$("#v3educadores"); if(d){ d.open = true; d.scrollIntoView({behavior:"smooth", block:"start"}); d.querySelector("summary")?.focus(); } };
  if($("#v3educadores")) return ir();
  irPara("painel"); setTimeout(ir, 60);
}
const _montaMenuV3 = montaMenu;
montaMenu = function(){
  _montaMenuV3();
  const sb = $("#side .sbrand"); if(sb) sb.innerHTML = `${LOGO.icone}<span class="v3sbnome">${LOGO.marca}</span>`;
  const mais = $("#side .v2mais");
  if(mais && entrou() && !mais.querySelector("#v3som")){ const b = document.createElement("button"); b.type = "button"; b.id = "v3som";
    const pinta = ()=>{ b.innerHTML = `${ic(S.som!==false?"som":"mudo",18)}<span>${S.som!==false?"Som ligado":"Som desligado"}</span>`; b.setAttribute("aria-pressed", S.som!==false); };
    b.onclick = ()=>{ S.som = S.som===false; save(); pinta(); }; pinta(); mais.insertBefore(b, mais.querySelector(".temabtn")); }
  montaTopo();
};
const _renderStatsV3 = renderStats;
renderStats = function(){
  _renderStatsV3();
  const brand = $(".status .brand");
  if(brand){ brand.innerHTML = `<button type="button" class="v3marca" aria-label="ArboGame: ir para o início">${LOGO.marca}</button>`;
    brand.querySelector(".v3marca").onclick = ()=>{ if(entrou()) irPara("painel"); }; }
  const meu = $("#meu"); if(meu){ meu.title = "Minha conta"; meu.setAttribute("aria-label", `Menu da conta (${S.nome||"jogador"})`); meu.onclick = ()=>document.body.classList.contains("navaberta") ? fechaMenu() : abreMais(); }
  if(!entrou()) montaTopo();
};

/* ---------- cartões de jogo no estilo das pranchas ---------- */
const ARTE_JOGO = {esvazia:"arte/capa-esvazia.webp", coleta:"arte/capa-coleta.webp", espanta:"arte/capa-espanta.webp"};
const SUB_JOGO = {esvazia:"Cuide dos recipientes do quintal.", coleta:"Cada resíduo no lugar certo.", espanta:"Atenção e agilidade nessa missão!",
  varre:"Varra as folhas antes dos maruins.", labirinto:"Ache o caminho pela floresta.", fuga:"Fuja dos mosquitos com estratégia.",
  memoria:"Encontre os pares e aprenda.", sudoku:"Lógica com os personagens.", mahjong:"Atenção para formar os pares."};
cardJogo = function(a){
  const arte = ARTE_JOGO[a.id], feito = S.feitas[a.id], r = recorde(a.id);
  return `<button type="button" class="v3jogo" data-go="${a.id}">
    <span class="img ${arte?"cheia":""}"><img src="${arte||CAPA(a.id)}" alt="" loading="lazy" onerror="this.remove()"></span>
    <span class="corpo"><span class="t"><b>${esc(a.nome)}</b><small>${SUB_JOGO[a.id]||TAG_JOGO[a.id]||""}</small>${feito?`<span class="rec">${ic("check",14)} ${r?`Recorde ${r} pts`:"Já jogou"}</span>`:""}</span>
      <span class="v3btn mini" aria-hidden="true">Jogar ${ic("flecha",18)}</span></span></button>`;
};

/* ---------- página inicial ---------- */
homeNovo = function(){
  clearTimer(); if(typeof stopArcade==="function") stopArcade();
  secao("painel"); renderStats();
  const prox = MISSIONS.find(m=>!S.feitas[m.id] && !trancada(m));
  const li = level(S.pts), next = LEVELS[li+1];
  const pct = next ? Math.round(((S.pts-LEVELS[li].min)/(next.min-LEVELS[li].min))*100) : 100;
  const nMed = Object.keys(S.medalhas).length, tMed = Object.keys(MEDALS).length;
  const r = typeof resumoQuintal==="function" ? resumoQuintal() : null;
  const qTxt = !r ? "Você ganhou um quintal para cuidar! Ele muda em tempo real." : r.grave ? `${r.grave===1?"Um alerta urgente":r.grave+" alertas urgentes"}: larvas, mosquito ou maruins!`
    : r.al ? `${r.al} ${r.al===1?"coisa precisa":"coisas precisam"} de cuidado.` : "Tudo em ordem por enquanto. Volte mais tarde!";
  const destaque = ["esvazia","coleta","espanta"].map(id=>ARCADE.find(a=>a.id===id)).filter(Boolean);
  app.innerHTML = `
    <section class="v3hero">
      <div class="txt">
        <span class="v3tag">Aprender também é uma aventura</span>
        <h1>Jogue, descubra e ajude a proteger a sua comunidade.</h1>
        <p>Explore jogos e missões com os BugKids e aprenda sobre saúde e ambiente.</p>
        <div class="acoes"><button type="button" class="v3btn" data-go="jogar">${ic("play",20)} Vamos jogar!</button><button type="button" class="v3btn2" data-go="biblioteca">Conheça os BugKids</button></div>
        ${prox?`<button type="button" class="v3prox" data-go="${prox.id}">${ic("bandeira",16)} Próxima missão: <b>${esc(prox.nome)}</b> ${ic("flecha",16)}</button>`:""}
      </div>
      <div class="arte"><img src="arte/heroi.webp" alt="Ana, Júlia, Pedro e Guto, os BugKids, no quintal"><span class="v3selo">${ic("folha2",22)}<span>Uma descoberta<br>de cada vez</span></span></div>
    </section>
    <div class="v3sec"><h2>Qual vai ser a aventura de hoje?</h2><button type="button" class="v3link" data-go="jogar">Ver todos os jogos ${ic("flecha",18)}</button></div>
    <div class="v3jogos">${destaque.map(cardJogo).join("")}</div>
    <section class="v3faixa"><span class="ic">${ic("folha2",44)}</span><div><b>Pequenas atitudes. Grandes descobertas.</b><span>Continue aprendendo nas missões dos BugKids.</span></div>
      <button type="button" class="v3btn2" data-go="missoes">Explorar missões</button></section>
    <div class="v3sec"><h2>Sua jornada, ${esc(S.nome||"agente")}</h2><button type="button" class="v3link" data-go="conquistas">Ver conquistas ${ic("flecha",18)}</button></div>
    <div class="v3jornada">
      <button type="button" class="v2quintal ${r&&r.grave?"urgente":""}" data-go="meuquintal"><img src="jogos/capas/quintal.webp" alt="" onerror="this.remove()">
        <span><b>Meu Quintal</b><small>${qTxt}</small></span><span class="seta">${ic("seta",18)}</span></button>
      <div class="v2numeros">
        <div class="v2num"><span class="ic">${ic("estrela",22)}</span><span><b>${S.pts}</b><small>pontos</small></span></div>
        <div class="v2num"><span class="ic">${ic("medalha",22)}</span><span><b>${nMed} de ${tMed}</b><small>medalhas</small></span></div>
        <div class="v2num barra"><div class="lin"><span>Nível ${LEVELS[li].nome}</span><span>${next?pct+"%":"máximo"}</span></div><i><b style="width:${pct}%"></b></i>
          <small>${next?`Faltam ${next.min-S.pts} pontos para ${next.nome}`:"Você chegou ao nível máximo!"}</small></div>
        <button type="button" class="v2num link" data-go="ranking"><span class="ic">${ic("trofeu",22)}</span><span><b>Ranking</b><small>ver a turma</small></span></button>
      </div>
    </div>
    ${dicaProf("Dica da Professora Catarina", feitasN() ? "Pequenos cuidados, grandes resultados! Olhe o quintal com atenção e peça ajuda de um adulto sempre que encontrar um risco."
      : "Que tal começar pelo <b>Quem é quem?</b> Primeiro aprenda a diferenciar o Aedes do maruim. Depois, cuide do seu <b>Meu Quintal</b>!")}
    <details class="v2educ" id="v3educadores"><summary>Para educadores e famílias</summary>
      <p>Cada missão leva de 3 a 8 minutos. Sugestão: projete o jogo em sala e jogue em equipes, ou use a <b>Vistoria em casa</b> como tarefa semanal com a família. O progresso fica salvo neste navegador.</p>
      <ul><li>Faixa Mirim: linguagem simples e mais tempo no Caça aos criadouros.</li><li>Explorador e Cientista: perguntas sobre ciclo, sinais de alarme, sorotipos e transmissão.</li>
      <li>Segurança: crianças observam e avisam. Caixa d'água, calhas, lugares altos, vidro e produtos químicos ficam com os adultos.</li>
      <li>Fontes: <a href="https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/d/dengue" target="_blank" rel="noopener">Ministério da Saúde</a> e <a href="https://portal.fiocruz.br/" target="_blank" rel="noopener">Fiocruz</a>.</li></ul>
      <p class="alert">Febre, dor no corpo, manchas na pele? Procure uma unidade de saúde e não tome remédio por conta própria.</p></details>`;
  ligaGo(app); window.scrollTo(0,0);
};

/* ---------- login, cadastro, recuperação e espera: mesmo formulário, visual das pranchas ---------- */
const _telaAcessoV3 = telaAcesso;
telaAcesso = function(modo){ const r = _telaAcessoV3(modo); v3Acesso(modo); return r; };
const _telaRecuperarV3 = telaRecuperar;
function v3Acesso(modo){
  const ac = app.querySelector(".acesso"); if(!ac) return;
  const pn = ac.querySelector(".acpainel"); if(!pn) return;
  renderStats();
  const rec = !!pn.querySelector("#rcform"), form = pn.querySelector("#acform"), criar = modo==="criar";
  const espera = !!pn.querySelector("#acver");
  const [t1, t2] = rec ? ["Vamos recuperar seu acesso.", "Enviamos um link para você criar uma nova senha."]
    : espera ? ["Quase lá!", "Seu cadastro chegou e logo será liberado."]
    : criar ? ["Vamos começar a aventura!", "Crie sua conta e jogue com os BugKids."]
    : ["Sua próxima aventura começa aqui!", "Os BugKids estão esperando por você."];
  const novo = document.createElement("div"); novo.className = "v3login";
  novo.innerHTML = `<section class="v3l-arte"><h1>${t1}</h1><p>${t2}</p><div class="img"><img src="arte/heroi.webp" alt="Ana, Júlia, Pedro e Guto, os BugKids, no quintal"></div><b class="slogan">Jogue. Aprenda. Proteja.</b></section>`;
  pn.classList.add("v3l-painel"); novo.appendChild(pn); ac.replaceWith(novo);
  const topo = pn.querySelector(".v2topoac");
  if(topo){ const volta = topo.querySelector("#rcvolta"); if(volta){ volta.innerHTML = `${ic("voltar",18)} Voltar ao login`; volta.classList.add("v3volta"); pn.querySelector(".stack")?.prepend(volta); } topo.remove(); }
  pn.querySelectorAll(".passo, .stack > .eyebrow").forEach(e=>e.remove());
  const h2 = pn.querySelector("h2");
  if(form && h2){
    h2.textContent = criar ? "Crie sua conta" : "Que bom ter você aqui!";
    h2.insertAdjacentHTML("afterend", `<p class="v3sub">${criar ? "Leva só um minuto. Peça ajuda a um adulto." : "Entre na sua conta para continuar."}</p>`);
    campoIcone(pn.querySelector("#acnome"), "user", "Digite seu nome");
    campoIcone(pn.querySelector("#acemail"), "email", "Digite seu e-mail");
    const senha = pn.querySelector("#acsenha"); campoIcone(senha, "cadeado", criar ? "Mínimo de 6 caracteres" : "Digite sua senha");
    if(senha){ const olho = document.createElement("button"); olho.type = "button"; olho.className = "v3olho"; olho.setAttribute("aria-label","Mostrar a senha"); olho.innerHTML = ic("olho",22);
      olho.onclick = ()=>{ const ver = senha.type==="password"; senha.type = ver ? "text" : "password"; olho.innerHTML = ic(ver?"olhox":"olho",22); olho.setAttribute("aria-label", ver?"Esconder a senha":"Mostrar a senha"); };
      senha.after(olho); }
    const esq = pn.querySelector("#acesqueci");
    if(esq && senha){ esq.textContent = "Esqueci minha senha"; const d = document.createElement("div"); d.className = "v3esq"; d.appendChild(esq); senha.closest("label").after(d); }
    const env = pn.querySelector("#acenviar"); if(env){ env.classList.add("v3entrar"); env.innerHTML = `${criar?"Criar conta":"Entrar"} ${ic("flecha",22)}`; }
    const ou = pn.querySelector(".ou"), g = pn.querySelector("#acgoogle"), msg = pn.querySelector("#acmsg"), rod = pn.querySelector(".acrodape");
    if(msg) form.after(msg);
    if(ou){ ou.innerHTML = "<span>ou</span>"; (msg||form).after(ou); }
    if(g){ const svg = g.querySelector("svg"); g.innerHTML = ""; if(svg) g.appendChild(svg); g.insertAdjacentText("beforeend", criar ? " Criar conta com Google" : " Continuar com Google"); (ou||form).after(g); }
    if(rod){ rod.querySelector(".sep")?.remove(); const sp = rod.querySelector("span"); const md = rod.querySelector("#acmodo");
      if(sp) sp.textContent = criar ? "Já tem conta?" : "Ainda não tem conta?"; if(md) md.textContent = criar ? "Entrar" : "Criar conta"; (g||form).after(rod); }
    const nota = pn.querySelector(".nota");
    if(nota){ nota.classList.add("v3ajuda"); nota.innerHTML = `${ic("ajuda",22)}<span>Precisa de ajuda? Fale com um responsável ou professor.<small>Novos cadastros são liberados pela equipe da Nório.</small></span>`; pn.querySelector(".stack")?.appendChild(nota); }
  }
  if(rec){ campoIcone(pn.querySelector("#rcemail"), "email", "Digite o e-mail da conta"); const b = pn.querySelector("#rcenviar"); if(b){ b.classList.add("v3entrar"); b.innerHTML = `Enviar link ${ic("flecha",22)}`; } }
}
function campoIcone(input, icone, ph){
  if(!input || input.parentElement.classList.contains("v3in")) return;
  const w = document.createElement("span"); w.className = "v3in"; w.innerHTML = `<span class="ic" aria-hidden="true">${ic(icone,22)}</span>`;
  input.before(w); w.appendChild(input); if(ph) input.placeholder = ph;
}
telaRecuperar = function(...a){ const r = _telaRecuperarV3.apply(this, a); v3Acesso("recuperar"); return r; };

/* ---------- jogo em tela cheia: ícone da marca na barra ---------- */
const _telaJogoNovoV3 = telaJogoNovo;
telaJogoNovo = function(id){ _telaJogoNovoV3(id); const n = app.querySelector(".mjbar .mjnome"); if(n) n.innerHTML = LOGO.icone; };

/* ---------- rodapé: ícone, slogan e a Nório ---------- */
(function rodapeV3(){
  const by = $(".foot .by"); if(!by || by.querySelector(".v3icone")) return;
  const imgs = [...by.querySelectorAll("img")].map(i=>i.outerHTML).join("");
  by.innerHTML = `${LOGO.icone}<span class="v3fnome"><b>ArboGame</b><span class="v3dot">•</span><span>Jogue. Aprenda. Proteja.</span></span><span class="v3norio">Um produto da ${imgs}</span>`;
})();

montaMenu(); renderStats();
if(document.body.classList.contains("semnav") && app.querySelector(".acesso")) v3Acesso();
