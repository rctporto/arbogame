/* ================== ACESSO À PLATAFORMA (02/11/2026) ==================
   Página 1: login com Google ou cadastro com e-mail e senha (Firebase Authentication).
   Cada cadastro vira um pedido em /acessos/{uid} (status "pendente"); um desenvolvedor aprova na área #dev.
   Aprovado: segue para a página 2 (escolha de jogador, a tela de antes, com visual novo).
   O e-mail de desenvolvedor (DEV_EMAILS) entra sem precisar de aprovação. */
const ACC = {pronto:false, user:null, status:null, erro:null};
const FBOK = !!(window.firebase && window.ARBO_CONFIG && ARBO_CONFIG.firebaseApiKey);
let FBAUTH = null;
if(FBOK){
  try{
    const c = ARBO_CONFIG;
    firebase.initializeApp({apiKey:c.firebaseApiKey, authDomain:c.authDomain || (c.firebaseProjectId+".firebaseapp.com"), projectId:c.firebaseProjectId});
    FBAUTH = firebase.auth(); FBAUTH.languageCode = "pt";
  }catch(e){ ACC.erro = e.message; }
}
const ehDevEmail = e => DEV_EMAILS.includes(String(e||"").toLowerCase());
function acessoOk(){ return !!FBAUTH && !!(ACC.user && (ACC.status==="aprovado" || ehDevEmail(ACC.user.email))); }

/* Firestore (REST) com o token de quem entrou */
const ACCDB = (()=>{
  const c = window.ARBO_CONFIG || {}, base = `https://firestore.googleapis.com/v1/projects/${c.firebaseProjectId}/databases/(default)/documents`, key = "key="+encodeURIComponent(c.firebaseApiKey||"");
  const req = async (url, metodo, body)=>{ const t = await ACC.user.getIdToken();
    const r = await fetch(url, {method:metodo, headers:{"Content-Type":"application/json", Authorization:"Bearer "+t}, body:body?JSON.stringify(body):undefined});
    const j = await r.json().catch(()=>({})); if(!r.ok){ const e=new Error((j.error&&j.error.message)||r.statusText); e.status=r.status; throw e; } return j; };
  return {
    async ler(uid){ try{ const d = await req(`${base}/acessos/${uid}?${key}`, "GET"); return d.fields ? (d.fields.status||{}).stringValue : null; }
      catch(e){ if(e.status===404) return null; if(e.status===403) return null; throw e; } },
    async pedir(uid, nome, email, provedor){
      await req(`${base}:commit?${key}`, "POST", {writes:[{
        update:{name:`${base.split("/v1/")[1]}/acessos/${uid}`, fields:{nome:{stringValue:nome}, email:{stringValue:email}, status:{stringValue:"pendente"}, provedor:{stringValue:provedor}}},
        updateTransforms:[{fieldPath:"criado", setToServerValue:"REQUEST_TIME"}], currentDocument:{exists:false}}]});
    },
  };
})();
async function confereAcesso(){
  const u = ACC.user; if(!u){ ACC.status=null; return; }
  if(ehDevEmail(u.email)){ ACC.status="aprovado"; return; }
  let st = await ACCDB.ler(u.uid);
  if(!st){
    const prov = (u.providerData||[]).some(p=>p.providerId==="google.com") ? "google" : "email";
    const nome = (u.displayName || (u.email||"").split("@")[0] || "Agente").slice(0,40).padEnd(2,"·");
    try{ await ACCDB.pedir(u.uid, nome, u.email, prov); }catch(e){ if(e.status!==409) throw e; }
    st = "pendente";
  }
  ACC.status = st;
}

/* ---------- logo da Nório no topo de todas as páginas ---------- */
(function norioNoTopo(){
  const st=$("#stats"), l=$(".foot .logo-l"), d=$(".foot .logo-d"); if(!st || !l) return;
  const s=document.createElement("span"); s.className="norio-topo"; s.title="ArboGame é um produto da Nório";
  s.innerHTML=`<small>um produto da</small><img class="logo-l" src="${l.src}" alt="Nório"><img class="logo-d" src="${d?d.src:l.src}" alt="Nório">`;
  st.parentNode.insertBefore(s, st);
})();

/* ---------- página 1: entrar ou criar conta ---------- */
function telaAcesso(modo){
  clearTimer(); if(typeof stopArcade==="function") stopArcade();
  document.body.classList.add("semnav"); fechaMenu(); $("#stats").innerHTML="";
  const u = ACC.user;
  const lado = `<div class="acarte"><img src="${IMG["bugkids-turma"]}" alt="Ana, Pedro, Júlia, Guto, Listras e Pintas">
      <div class="actexto"><span class="eyebrow">Observar · aprender · cuidar</span><h1>Bem-vindo ao ArboGame!</h1>
      <p>Jogos e missões sobre dengue, zika, chikungunya, Oropouche, o Aedes e o maruim, com a Professora Catarina e os BugKids.</p>
      <p class="norio-linha">Um produto da <img class="logo-l" src="${($(".foot .logo-l")||{}).src||""}" alt="Nório"><img class="logo-d" src="${($(".foot .logo-d")||{}).src||""}" alt="Nório"></p></div></div>`;
  let painel;
  if(!FBAUTH){
    painel = `<div class="stack"><span class="eyebrow">Login</span><h2>Não deu para carregar o login</h2><p>Confira a internet e recarregue a página.${ACC.erro?` <small class="muted">(${esc(ACC.erro)})</small>`:""}</p><div><button class="btn" onclick="location.reload()">Recarregar</button></div></div>`;
  } else if(!ACC.pronto){
    painel = `<div class="stack"><span class="eyebrow">Login</span><h2>Carregando…</h2></div>`;
  } else if(u && ACC.status!=="aprovado" && !ehDevEmail(u.email)){
    const neg = ACC.status==="negado";
    painel = `<div class="stack"><span class="passo">Passo 1 de 2</span><span class="eyebrow">${neg?"Acesso não liberado":"Cadastro recebido"}</span>
      <h2>${neg?"Seu acesso não foi liberado":"Aguardando liberação"}</h2>
      <p>${neg?"Fale com a pessoa responsável pela sua escola ou turma.":`Olá, <b>${esc(u.displayName||u.email)}</b>! Seu cadastro chegou. Assim que um desenvolvedor da Nório liberar o acesso, você já pode jogar.`}</p>
      <div class="dicac"><img src="${IMG["catarina-dica"]}" alt="Professora Catarina"><div><b>Dica da Professora Catarina</b><p>Enquanto espera, que tal dar uma volta no quintal com um adulto procurando água parada?</p></div></div>
      <div class="row"><button class="btn sun" id="acver">${ic("ciclo",18)} Ver se já foi liberado</button><button class="btn ghost" id="acsair">Sair da conta</button></div>
      <p class="muted" style="margin:0;font-size:.85rem">Conta: ${esc(u.email||"")}</p></div>`;
  } else {
    const criar = modo==="criar";
    painel = `<div class="stack"><span class="passo">Passo 1 de 2</span><span class="eyebrow">${criar?"Cadastro":"Login"}</span><h2>${criar?"Criar uma conta":"Entrar na plataforma"}</h2>
      <button class="btn google" id="acgoogle" type="button"><svg viewBox="0 0 48 48" width="22" height="22" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3A12 12 0 1 1 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 1 0 44 24c0-1.2-.1-2.3-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8A12 12 0 0 1 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 0 0 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A12 12 0 0 1 12.7 28l-6.5 5A20 20 0 0 0 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C41.8 35.3 44 30 44 24c0-1.2-.1-2.3-.4-3.5z"/></svg> ${criar?"Criar conta com o Google":"Entrar com o Google"}</button>
      <div class="ou"><span>ou com e-mail</span></div>
      <form class="stack" id="acform" style="gap:10px">
        ${criar?`<label class="campo"><span>Nome</span><input id="acnome" required minlength="2" maxlength="40" autocomplete="name" placeholder="Seu nome ou o da escola"></label>`:""}
        <label class="campo"><span>E-mail</span><input id="acemail" type="email" required autocomplete="email" placeholder="voce@email.com"></label>
        <label class="campo"><span>Senha</span><input id="acsenha" type="password" required minlength="6" autocomplete="${criar?"new-password":"current-password"}" placeholder="${criar?"Pelo menos 6 caracteres":"Sua senha"}"></label>
        <button class="btn sun" type="submit" id="acenviar">${criar?"Criar conta":"Entrar"}</button>
      </form>
      <div id="acmsg" aria-live="polite"></div>
      <div class="row acrodape">${criar?`<span>Já tem conta?</span><button class="linkbtn" id="acmodo" type="button">Entrar</button>`:`<span>Primeira vez?</span><button class="linkbtn" id="acmodo" type="button">Criar uma conta</button><span class="sep">·</span><button class="linkbtn" id="acesqueci" type="button">Esqueci a senha</button>`}</div>
      <p class="nota">Novos cadastros são liberados por um desenvolvedor da Nório. Crianças: peçam ajuda a um adulto para criar a conta.</p></div>`;
  }
  app.innerHTML = `<div class="acesso">${lado}<div class="panel acpainel">${painel}</div></div>`;
  const msg = t=>{ const m=$("#acmsg"); if(m) m.innerHTML = t ? `<p class="alert">${t}</p>` : ""; };
  const traduz = e=>({"auth/invalid-credential":"E-mail ou senha incorretos.","auth/wrong-password":"E-mail ou senha incorretos.","auth/user-not-found":"Não achamos uma conta com esse e-mail. Crie uma conta.",
    "auth/email-already-in-use":"Já existe uma conta com esse e-mail. Toque em Entrar.","auth/weak-password":"A senha precisa ter pelo menos 6 caracteres.","auth/invalid-email":"Esse e-mail não parece certo.",
    "auth/popup-closed-by-user":"A janela do Google foi fechada antes de terminar.","auth/operation-not-allowed":"Esse jeito de entrar ainda não foi ligado no Firebase.","auth/too-many-requests":"Muitas tentativas. Espere um pouco e tente de novo.",
    "auth/network-request-failed":"Sem conexão. Confira a internet."}[e.code] || e.message);
  const g=$("#acgoogle"); if(g) g.onclick=async()=>{ msg(""); const p=new firebase.auth.GoogleAuthProvider(); p.setCustomParameters({prompt:"select_account"});
    try{ await FBAUTH.signInWithPopup(p); }catch(e){ if(e.code==="auth/popup-blocked"||e.code==="auth/operation-not-supported-in-this-environment") return FBAUTH.signInWithRedirect(p); if(e.code!=="auth/cancelled-popup-request") msg(traduz(e)); } };
  const f=$("#acform"); if(f) f.onsubmit=async ev=>{ ev.preventDefault(); msg(""); const b=$("#acenviar"); b.disabled=true;
    const email=$("#acemail").value.trim(), senha=$("#acsenha").value;
    try{ if(modo==="criar"){ const r=await FBAUTH.createUserWithEmailAndPassword(email, senha); await r.user.updateProfile({displayName:$("#acnome").value.trim()}); ACC.user=FBAUTH.currentUser; await aoEntrar(); }
         else await FBAUTH.signInWithEmailAndPassword(email, senha); }
    catch(e){ msg(traduz(e)); b.disabled=false; } };
  const md=$("#acmodo"); if(md) md.onclick=()=>telaAcesso(modo==="criar"?"entrar":"criar");
  const es=$("#acesqueci"); if(es) es.onclick=async()=>{ const email=($("#acemail").value||"").trim(); if(!email) return msg("Digite seu e-mail acima e toque de novo em Esqueci a senha.");
    try{ await FBAUTH.sendPasswordResetEmail(email); $("#acmsg").innerHTML=`<p class="nota">Enviamos um link para criar uma nova senha em <b>${esc(email)}</b>. Confira também o spam.</p>`; }catch(e){ msg(traduz(e)); } };
  const v=$("#acver"); if(v) v.onclick=async()=>{ v.disabled=true; try{ await confereAcesso(); }catch(e){} aposAcesso(); };
  const sa=$("#acsair"); if(sa) sa.onclick=sairConta;
  window.scrollTo(0,0);
}
async function sairConta(){ try{ sessionStorage.removeItem(SKEY); }catch(e){} if(FBAUTH) await FBAUTH.signOut(); ACC.user=null; ACC.status=null; telaAcesso(); }
function aposAcesso(){
  if(location.hash==="#dev") return;
  if(acessoOk()) home(); else telaAcesso();
}
async function aoEntrar(){ try{ await confereAcesso(); }catch(e){ ACC.status=null; } ACC.pronto=true; aposAcesso(); montaMenu(); }

/* portas de entrada: sem acesso liberado, sempre a página 1 */
const _telaLoginAcc = telaLogin;
telaLogin = function(modo){ if(!acessoOk()) return telaAcesso(); _telaLoginAcc(modo); paginaJogadores(); };
const _homeAcc = home;
home = function(){ if(!acessoOk()) return telaAcesso(); _homeAcc(); };

/* ---------- página 2: escolha do jogador (visual novo, sem animação) ---------- */
function paginaJogadores(){
  const lg = app.querySelector(".login"); if(!lg) return;
  lg.classList.add("login2");
  const cena = lg.querySelector(".cena"); if(cena) cena.outerHTML = `<img class="turmaimg" src="${IMG["bugkids-turma"]}" alt="Ana, Pedro, Júlia, Guto, Listras e Pintas">`;
  const lp = $("#lp"); if(lp && ACC.user){ const bar=document.createElement("div"); bar.className="contabar";
    bar.innerHTML=`<span class="passo">Passo 2 de 2 · Quem vai jogar?</span><span class="conta">${esc(ACC.user.email||"")} <button class="linkbtn" id="sairconta" type="button">Sair da conta</button></span>`;
    lg.prepend(bar); bar.querySelector("#sairconta").onclick=sairConta; }
}

/* ---------- menu: sair da conta ---------- */
const _montaMenuAcc = montaMenu;
montaMenu = function(){ _montaMenuAcc(); const side=$("#side"); if(!side || !ACC.user) return;
  const nv=side.querySelector("nav.snovo"); if(!nv) return; const b=document.createElement("button"); b.type="button"; b.innerHTML=`${ic("sair",18)}<span>Sair da conta</span>`; b.onclick=()=>{ fechaMenu(); sairConta(); }; nv.appendChild(b); };

/* ---------- área do desenvolvedor: liberar cadastros ---------- */
const _painelDevAcc = painelDev;
painelDev = function(topo, liga){
  _painelDevAcc(topo, liga);
  const bar = app.querySelector(".devbar"); if(!bar) return;
  const sec = document.createElement("section"); sec.className="panel devacessos";
  sec.innerHTML = `<div class="row" style="justify-content:space-between;align-items:center"><h3 style="margin:0">Pedidos de acesso</h3><button class="btn ghost" id="acrel">↻ Atualizar</button></div><div id="aclist"><p class="muted">Carregando…</p></div>`;
  bar.after(sec);
  const data = t=>t ? new Date(t).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",year:"2-digit",hour:"2-digit",minute:"2-digit"}) : "";
  const carrega = ()=>DEV.acessos().then(l=>{
    const pend=l.filter(x=>x.status==="pendente"), outros=l.filter(x=>x.status!=="pendente");
    const linha = x=>`<tr><td><b>${esc(x.nome||"")}</b><br><small class="muted">${esc(x.email||"")} · ${x.provedor==="google"?"Google":"e-mail"} · ${data(x.criado)}</small></td>
      <td><span class="stt ${x.status}">${x.status==="aprovado"?"Liberado":x.status==="negado"?"Recusado":"Aguardando"}</span></td>
      <td class="acoesac">${x.status!=="aprovado"?`<button class="btn sun" data-ok="${esc(x.uid)}">Liberar</button>`:""}${x.status!=="negado"?`<button class="btn ghost" data-no="${esc(x.uid)}">${x.status==="aprovado"?"Bloquear":"Recusar"}</button>`:""}</td></tr>`;
    $("#aclist").innerHTML = !l.length ? `<p class="muted">Ainda não há cadastros.</p>` :
      `<p class="muted" style="margin:6px 0 10px">${pend.length} aguardando · ${outros.filter(x=>x.status==="aprovado").length} liberados</p><div class="tabela"><table><tbody>${[...pend,...outros].map(linha).join("")}</tbody></table></div>`;
    $("#aclist").querySelectorAll("[data-ok],[data-no]").forEach(b=>b.onclick=()=>{ b.disabled=true;
      DEV.decidir(b.dataset.ok||b.dataset.no, b.dataset.ok?"aprovado":"negado").then(()=>{ toast(b.dataset.ok?"Acesso liberado":"Acesso recusado"); carrega(); })
        .catch(e=>{ b.disabled=false; toast("Não deu: "+e.message); }); });
  }).catch(e=>{ $("#aclist").innerHTML = `<p class="alert">Não deu para carregar os pedidos: ${esc(e.message)}. Confira se as regras novas do banco foram publicadas.</p>`; });
  $("#acrel").onclick=carrega; carrega();
};

/* ---------- partida ---------- */
if(FBAUTH){
  if(location.hash!=="#dev") telaAcesso();
  FBAUTH.getRedirectResult().catch(()=>{});
  FBAUTH.onAuthStateChanged(u=>{ ACC.user=u; aoEntrar(); });
} else { ACC.pronto=true; telaAcesso(); }
