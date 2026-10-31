/* ================== ÁREA DO DESENVOLVEDOR ==================
   Abre pelo link "Desenvolvedor" no rodapé (ou arbogame.web.app/#dev).
   Login sem senha: a pessoa recebe um link no e-mail (Firebase Auth, REST).
   Só e-mails cadastrados em /devs (pelo scripts/ligar-dev.sh) passam pelas regras do Firestore. */
const DEV = (()=>{
  const c = window.ARBO_CONFIG || {};
  if(!c.firebaseProjectId || !c.firebaseApiKey) return null;
  const tira = u=>u.replace(/\/$/,"");
  const fs = tira(c.firestoreHost || "https://firestore.googleapis.com");
  const au = tira(c.authHost || "https://identitytoolkit.googleapis.com");
  const st = tira(c.tokenHost || "https://securetoken.googleapis.com");
  const key = "key="+encodeURIComponent(c.firebaseApiKey);
  const raiz = `projects/${c.firebaseProjectId}/databases/(default)/documents`;
  const KD = "arbogame-dev";
  const ler = ()=>{ try{ return JSON.parse(localStorage.getItem(KD))||{}; }catch(e){ return {}; } };
  const gravar = o=>{ try{ localStorage.setItem(KD, JSON.stringify(o)); }catch(e){} };
  const req = async (url, body, token, metodo)=>{
    const h = {"Content-Type":"application/json"}; if(token) h.Authorization = "Bearer "+token;
    const r = await fetch(url, {method:metodo||"POST", headers:h, body:body==null?undefined:JSON.stringify(body)});
    const j = await r.json().catch(()=>({}));
    if(!r.ok){ const e = new Error((j.error&&(j.error.message||j.error))||r.statusText); e.status = r.status; throw e; }
    return j;
  };
  const val = f=>!f ? null : f.stringValue ?? (f.integerValue!=null ? +f.integerValue : f.timestampValue ?? null);
  const voltar = ()=>location.origin + location.pathname + "?dev=1";
  async function token(){
    const s = ler();
    if(!s.refresh) return null;
    if(s.id && s.exp > Date.now() + 60e3) return s.id;
    const r = await fetch(`${st}/v1/token?${key}`, {method:"POST", headers:{"Content-Type":"application/x-www-form-urlencoded"},
      body:`grant_type=refresh_token&refresh_token=${encodeURIComponent(s.refresh)}`});
    const j = await r.json().catch(()=>({}));
    if(!r.ok){ gravar({email:s.email}); throw new Error("A sessão expirou. Entre de novo."); }
    gravar({...s, id:j.id_token, refresh:j.refresh_token||s.refresh, exp:Date.now() + (+j.expires_in||3600)*1000});
    return j.id_token;
  }
  return {
    email: ()=>ler().email || "",
    logado: ()=>!!ler().refresh,
    sair(){ const s=ler(); gravar({email:s.email}); },
    enviarLink(email){
      gravar({...ler(), email, pedido:email});
      return req(`${au}/v1/accounts:sendOobCode?${key}`, {requestType:"EMAIL_SIGNIN", email, continueUrl:voltar(), canHandleCodeInApp:true});
    },
    // volta do link do e-mail: ?mode=signIn&oobCode=...
    temLink: ()=>{ const q = new URLSearchParams(location.search); return q.get("mode")==="signIn" && !!q.get("oobCode"); },
    async concluir(email){
      const q = new URLSearchParams(location.search);
      const j = await req(`${au}/v1/accounts:signInWithEmailLink?${key}`, {email, oobCode:q.get("oobCode")});
      gravar({email:j.email||email, id:j.idToken, refresh:j.refreshToken, exp:Date.now() + (+j.expiresIn||3600)*1000});
      history.replaceState(null, "", location.pathname + "#dev");
    },
    async autorizado(){
      const t = await token(); if(!t) return false;
      try{ await req(`${fs}/v1/${raiz}/devs/${encodeURIComponent(ler().email)}?${key}`, null, t, "GET"); return true; }
      catch(e){ if(e.status===403 || e.status===404) return false; throw e; }
    },
    async todos(){
      const t = await token();
      const rows = await req(`${fs}/v1/${raiz}:runQuery?${key}`, {structuredQuery:{from:[{collectionId:"ranking"}],
        orderBy:[{field:{fieldPath:"atualizado"},direction:"DESCENDING"}], limit:2000}}, t);
      return rows.filter(r=>r.document).map(r=>{ const d=r.document.fields;
        return {id:r.document.name.split("/").pop(), jogador:val(d.jogador), jogo:val(d.jogo), apelido:val(d.apelido),
          faixa:val(d.faixa), turma:val(d.turma), pontos:val(d.pontos), atualizado:val(d.atualizado)}; });
    },
    async apagar(ids){
      const t = await token();
      for(let i=0;i<ids.length;i+=400)
        await req(`${fs}/v1/${raiz}:commit?${key}`, {writes:ids.slice(i,i+400).map(id=>({delete:`${raiz}/ranking/${id}`}))}, t);
    },
    console: `https://console.firebase.google.com/project/${c.firebaseProjectId}/firestore/data/~2Franking`,
  };
})();

function telaDev(){
  stopArcade(); clearTimer();
  if(location.hash!=="#dev") history.replaceState(null, "", location.pathname + location.search + "#dev");
  const topo = `<div class="gamehead"><div class="row"><button class="btn ghost" id="voltar">← Início</button><h2>🛠️ Área do desenvolvedor</h2></div></div>`;
  const sair = ()=>{ history.replaceState(null, "", location.pathname); };
  const liga = ()=>{ $("#voltar").onclick=()=>{ sair(); home(); }; window.scrollTo(0,0); };
  if(!DEV){ app.innerHTML = topo + `<div class="panel"><p>O ranking online está desligado (config.js vazio), então não há área do desenvolvedor.</p></div>`; liga(); return; }

  // 1) voltando do link do e-mail
  if(DEV.temLink()){
    const conclui = email=>{ app.innerHTML = topo + `<div class="panel"><p class="muted">Entrando…</p></div>`; liga();
      DEV.concluir(email).then(telaDev).catch(e=>{ app.innerHTML = topo + `<div class="panel stack"><p class="alert">O link não funcionou (${esc(e.message)}). Ele vale uma vez só e expira. Peça outro.</p><div><button class="btn" id="denovo">Pedir outro link</button></div></div>`; liga();
        $("#denovo").onclick=()=>{ history.replaceState(null,"",location.pathname+"#dev"); telaDev(); }; }); };
    if(DEV.email()) return conclui(DEV.email());
    app.innerHTML = topo + `<form class="panel stack" id="fm"><p>Confirme o e-mail para o qual o link foi enviado.</p><input type="email" id="em" required autocomplete="email"><div><button class="btn">Entrar</button></div></form>`; liga();
    $("#fm").onsubmit=ev=>{ ev.preventDefault(); conclui($("#em").value.trim().toLowerCase()); };
    return;
  }

  // 2) sem login: pede o link
  if(!DEV.logado()){
    app.innerHTML = topo + `<form class="panel stack" id="fm" style="max-width:520px">
      <p>Entre com o seu e-mail de desenvolvedor. Você vai receber um link para entrar, sem senha.</p>
      <label class="tag" for="em">E-mail</label><input type="email" id="em" required autocomplete="email" value="${esc(DEV.email())}" placeholder="voce@empresa.com.br">
      <div><button class="btn" id="env">Enviar link de acesso</button></div><div id="msg"></div></form>`; liga();
    $("#fm").onsubmit=ev=>{ ev.preventDefault(); const em=$("#em").value.trim().toLowerCase(); $("#env").disabled=true;
      DEV.enviarLink(em).then(()=>{ $("#msg").innerHTML=`<p class="alert">Link enviado para <b>${esc(em)}</b>. Abra o e-mail neste mesmo aparelho e toque no link. Confira também o spam.</p>`; })
        .catch(e=>{ $("#env").disabled=false; $("#msg").innerHTML=`<p class="alert">Não deu para enviar o link: ${esc(e.message)}</p>`; }); };
    return;
  }

  // 3) logado: confere se o e-mail está autorizado e mostra o painel
  app.innerHTML = topo + `<div class="panel"><p class="muted">Carregando…</p></div>`; liga();
  DEV.autorizado().then(ok=>{
    if(!ok){ app.innerHTML = topo + `<div class="panel stack"><p class="alert">O e-mail <b>${esc(DEV.email())}</b> entrou, mas não está autorizado como desenvolvedor.</p><div><button class="btn ghost" id="out">Sair</button></div></div>`; liga();
      $("#out").onclick=()=>{ DEV.sair(); telaDev(); }; return; }
    painelDev(topo, liga);
  }).catch(e=>{ app.innerHTML = topo + `<div class="panel stack"><p class="alert">Erro ao entrar: ${esc(e.message)}</p><div class="row"><button class="btn" id="tenta">Tentar de novo</button><button class="btn ghost" id="out">Sair</button></div></div>`; liga();
    $("#tenta").onclick=telaDev; $("#out").onclick=()=>{ DEV.sair(); telaDev(); }; });
}

function painelDev(topo, liga){
  const nomeJogo = id=>id==="geral" ? "Geral" : ((ARCADE.find(a=>a.id===id)||{}).nome || id);
  const data = t=>t ? new Date(t).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}) : "";
  app.innerHTML = topo + `
    <div class="row" style="justify-content:space-between;margin-bottom:12px"><p class="muted" style="margin:0">Entrou como <b>${esc(DEV.email())}</b></p>
      <div class="row"><button class="btn ghost" id="att">↻ Atualizar</button><button class="btn ghost" id="out">Sair</button></div></div>
    <div id="dv"><div class="panel"><p class="muted">Carregando dados do ranking online…</p></div></div>
    <h3 style="margin:28px 0 10px">Este aparelho</h3>
    <div class="panel stack">
      <p class="muted" style="margin:0">Progresso salvo neste navegador (jogador <b>${esc(S.nome||"—")}</b>, ${S.pts} pts, código ${esc((S.uid||"").slice(0,8))}).</p>
      <details><summary>Ver dados brutos</summary><pre class="devpre">${esc(JSON.stringify(S,null,2))}</pre></details>
      <div class="row"><button class="btn ghost" id="zera">Zerar progresso deste aparelho</button></div><div id="zc"></div>
    </div>
    <h3 style="margin:28px 0 10px">Links</h3>
    <div class="row"><a class="btn ghost" href="${DEV.console}" target="_blank" rel="noopener">Banco no Firebase</a>
      <a class="btn ghost" href="https://github.com/rctporto/arbogame" target="_blank" rel="noopener">Código no GitHub</a>
      <a class="btn ghost" href="https://github.com/rctporto/arbogame/actions" target="_blank" rel="noopener">Publicações</a></div>`;
  liga();
  $("#out").onclick=()=>{ DEV.sair(); telaDev(); };
  $("#att").onclick=()=>painelDev(topo, liga);
  $("#zera").onclick=()=>{ $("#zc").innerHTML=`<div class="alert">Zerar pontos, missões e medalhas deste aparelho? O ranking online não muda. <div class="row" style="margin-top:8px"><button class="btn" id="sim" style="background:var(--coral)">Zerar</button><button class="btn ghost" id="nao">Cancelar</button></div></div>`;
    $("#nao").onclick=()=>{ $("#zc").innerHTML=""; }; $("#sim").onclick=()=>{ const uid=S.uid; S=fresh(); S.uid=uid; save(); renderStats(); toast("Progresso zerado"); painelDev(topo, liga); }; };

  let filtro = "";
  DEV.todos().then(regs=>{
    const desenha = ()=>{
      const jogadores = new Set(regs.map(r=>r.jogador));
      const turmas = {}; regs.forEach(r=>{ if(r.turma) (turmas[r.turma]=turmas[r.turma]||new Set()).add(r.jogador); });
      const faixas = [0,0,0]; const vistos = new Set();
      regs.forEach(r=>{ if(!vistos.has(r.jogador)){ vistos.add(r.jogador); if(r.faixa>=1&&r.faixa<=3) faixas[r.faixa-1]++; } });
      const porJogo = {}; regs.forEach(r=>{ const p=porJogo[r.jogo]=porJogo[r.jogo]||{n:0,max:0,soma:0}; p.n++; p.max=Math.max(p.max,r.pontos); p.soma+=r.pontos; });
      const hoje = regs.filter(r=>r.atualizado && Date.now()-new Date(r.atualizado) < 864e5).map(r=>r.jogador);
      const f = filtro.toLowerCase();
      const vis = regs.filter(r=>!f || (r.apelido||"").toLowerCase().includes(f) || (r.turma||"").toLowerCase().includes(f) || (r.jogo||"").includes(f));
      $("#dv").innerHTML = `
        <div class="devnums">
          <div class="panel"><b>${jogadores.size}</b><span>jogadores</span></div>
          <div class="panel"><b>${new Set(hoje).size}</b><span>ativos nas últimas 24h</span></div>
          <div class="panel"><b>${Object.keys(turmas).length}</b><span>turmas</span></div>
          <div class="panel"><b>${regs.length}</b><span>registros</span></div>
        </div>
        <div class="devcols">
          <div class="panel"><p class="tag">Por jogo</p><table class="devt"><tr><th>Jogo</th><th>Jogadores</th><th>Recorde</th><th>Média</th></tr>
            ${Object.entries(porJogo).sort((a,b)=>b[1].n-a[1].n).map(([j,p])=>`<tr><td>${esc(nomeJogo(j))}</td><td>${p.n}</td><td>${p.max}</td><td>${Math.round(p.soma/p.n)}</td></tr>`).join("") || `<tr><td colspan="4" class="muted">Sem dados</td></tr>`}</table></div>
          <div class="panel"><p class="tag">Por faixa etária</p><table class="devt">${AGES.map((a,i)=>`<tr><td>${esc(a.nome)}</td><td>${faixas[i]}</td></tr>`).join("")}</table>
            <p class="tag" style="margin-top:14px">Turmas</p><table class="devt">${Object.entries(turmas).sort((a,b)=>b[1].size-a[1].size).slice(0,12).map(([t,s])=>`<tr><td>${esc(t)}</td><td>${s.size}</td></tr>`).join("") || `<tr><td class="muted">Nenhuma turma ainda</td></tr>`}</table></div>
        </div>
        <div class="panel" style="margin-top:14px">
          <div class="row" style="justify-content:space-between"><p class="tag" style="margin:0">Moderação · todos os registros</p>
            <input type="text" id="busca" placeholder="Buscar apelido, turma ou jogo" value="${esc(filtro)}" style="max-width:280px"></div>
          <div class="devscroll"><table class="devt"><tr><th>Apelido</th><th>Jogo</th><th>Pontos</th><th>Turma</th><th>Faixa</th><th>Quando</th><th></th></tr>
            ${vis.slice(0,300).map(r=>`<tr><td>${esc(r.apelido)}</td><td>${esc(nomeJogo(r.jogo))}</td><td>${r.pontos}</td><td>${esc(r.turma||"")}</td><td>${r.faixa||""}</td><td>${data(r.atualizado)}</td>
              <td><button class="btn ghost mini" data-del="${esc(r.id)}" title="Apagar este registro">Apagar</button> <button class="btn ghost mini" data-delj="${esc(r.jogador)}" title="Apagar todos os registros deste jogador">Jogador</button></td></tr>`).join("") || `<tr><td colspan="7" class="muted">Nada encontrado</td></tr>`}</table></div>
          ${vis.length>300?`<p class="muted">Mostrando 300 de ${vis.length}. Use a busca para filtrar.</p>`:""}
          <div id="dc"></div>
        </div>`;
      const busca = $("#busca"); busca.oninput=()=>{ filtro=busca.value; clearTimeout(desenha.t); desenha.t=setTimeout(()=>{ desenha(); const b=$("#busca"); b.focus(); b.setSelectionRange(b.value.length,b.value.length); }, 250); };
      const confirma = (ids, txt)=>{ $("#dc").innerHTML=`<div class="alert" style="margin-top:12px">${txt} Não dá para desfazer. <div class="row" style="margin-top:8px"><button class="btn" id="sim" style="background:var(--coral)">Apagar</button><button class="btn ghost" id="nao">Cancelar</button></div></div>`;
        $("#dc").scrollIntoView({block:"nearest"});
        $("#nao").onclick=()=>{ $("#dc").innerHTML=""; };
        $("#sim").onclick=()=>{ $("#sim").disabled=true; DEV.apagar(ids).then(()=>{ regs=regs.filter(r=>!ids.includes(r.id)); toast("Apagado"); desenha(); })
          .catch(e=>{ $("#dc").innerHTML=`<p class="alert">Não deu para apagar: ${esc(e.message)}</p>`; }); }; };
      app.querySelectorAll("[data-del]").forEach(b=>b.onclick=()=>{ const r=regs.find(x=>x.id===b.dataset.del); confirma([r.id], `Apagar <b>${esc(r.apelido)}</b> em ${esc(nomeJogo(r.jogo))} (${r.pontos} pts)?`); });
      app.querySelectorAll("[data-delj]").forEach(b=>b.onclick=()=>{ const l=regs.filter(x=>x.jogador===b.dataset.delj); confirma(l.map(x=>x.id), `Apagar os ${l.length} registros de <b>${esc(l[0].apelido)}</b> em todos os jogos?`); });
    };
    desenha();
  }).catch(e=>{ $("#dv").innerHTML=`<p class="alert">Não deu para carregar o ranking: ${esc(e.message)}</p>`; });
}

GAMES.dev = telaDev;
(function rotaDev(){
  const abre = ()=>{ if(location.hash==="#dev" || new URLSearchParams(location.search).get("dev")==="1" || (DEV && DEV.temLink())) telaDev(); };
  window.addEventListener("hashchange", abre);
  abre();
})();
