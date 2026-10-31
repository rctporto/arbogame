/* ================== ARTE: objetos e cenários desenhados em canvas ================== */
const INK = "#2A2320";
function ol(ctx,s){ ctx.lineWidth=3.2*s; ctx.strokeStyle=INK; ctx.lineJoin="round"; ctx.lineCap="round"; }
function shine(ctx,x,y,w,h,a=.45){ ctx.fillStyle=`rgba(255,255,255,${a})`; ctx.beginPath(); ctx.ellipse(x,y,w,h,-.3,0,7); ctx.fill(); }
function rr(ctx,x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }
function grad(ctx,x0,y0,x1,y1,stops){ const g=ctx.createLinearGradient(x0,y0,x1,y1); stops.forEach((c,i)=>g.addColorStop(i/(stops.length-1),c)); return g; }

/* Cada desenho tem o centro em (0,0) e cabe em ~100x100 na escala 1. */
const ART = {
  balde(ctx,s){ ol(ctx,s);
    ctx.beginPath(); ctx.moveTo(-34,-22); ctx.lineTo(34,-22); ctx.lineTo(26,38); ctx.quadraticCurveTo(0,46,-26,38); ctx.closePath();
    ctx.fillStyle=grad(ctx,-34,0,34,0,["#2E86DE","#54A0FF","#1B6FC2"]); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0,-22,34,9,0,0,7); ctx.fillStyle="#A9D3FF"; ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(0,-22,40,Math.PI*1.05,Math.PI*1.95); ctx.lineWidth=4*s; ctx.strokeStyle="#7B8794"; ctx.stroke();
    shine(ctx,-16,6,5,16,.35); },
  pneu(ctx,s){ ol(ctx,s);
    ctx.beginPath(); ctx.ellipse(0,8,46,34,0,0,7); ctx.fillStyle="#3B3B3F"; ctx.fill(); ctx.stroke();
    ctx.fillStyle="#2A2A2D"; for(let i=0;i<14;i++){ const a=i/14*Math.PI*2; ctx.beginPath(); ctx.ellipse(Math.cos(a)*40,8+Math.sin(a)*29,5,3,a,0,7); ctx.fill(); }
    ctx.beginPath(); ctx.ellipse(0,4,24,14,0,0,7); ctx.fillStyle="#1C1C1F"; ctx.fill(); ctx.stroke();
    shine(ctx,-26,-6,10,4,.18); },
  vaso(ctx,s){ ol(ctx,s);
    ctx.beginPath(); ctx.ellipse(0,40,40,9,0,0,7); ctx.fillStyle="#B5532C"; ctx.fill(); ctx.stroke();
    ctx.fillStyle="#3E9B4F"; [[-24,-46,-.5],[0,-58,0],[22,-46,.5],[-12,-40,-.25],[12,-40,.25]].forEach(([x,y,r])=>{ ctx.save(); ctx.translate(x*.8,y*.6-6); ctx.rotate(r); ctx.beginPath(); ctx.ellipse(0,0,9,24,0,0,7); ctx.fill(); ctx.stroke(); ctx.restore(); });
    ctx.beginPath(); ctx.moveTo(-28,-14); ctx.lineTo(28,-14); ctx.lineTo(20,36); ctx.lineTo(-20,36); ctx.closePath();
    ctx.fillStyle=grad(ctx,-28,0,28,0,["#D9703F","#E8875A","#B8582C"]); ctx.fill(); ctx.stroke();
    rr(ctx,-32,-22,64,12,5); ctx.fillStyle="#E38A5C"; ctx.fill(); ctx.stroke(); },
  garrafa(ctx,s){ ol(ctx,s);
    ctx.beginPath(); ctx.moveTo(-7,-48); ctx.lineTo(7,-48); ctx.lineTo(7,-28); ctx.quadraticCurveTo(20,-20,20,-6); ctx.lineTo(20,40); ctx.quadraticCurveTo(0,46,-20,40); ctx.lineTo(-20,-6); ctx.quadraticCurveTo(-20,-20,-7,-28); ctx.closePath();
    ctx.fillStyle="rgba(46,160,90,.85)"; ctx.fill(); ctx.stroke();
    rr(ctx,-9,-54,18,8,2); ctx.fillStyle="#E74C3C"; ctx.fill(); ctx.stroke();
    rr(ctx,-20,4,40,18,2); ctx.fillStyle="#FFF3D6"; ctx.fill(); ctx.stroke();
    shine(ctx,-11,-4,4,18,.5); },
  caixadagua(ctx,s){ ol(ctx,s);
    ctx.beginPath(); ctx.moveTo(-40,-26); ctx.lineTo(40,-26); ctx.lineTo(32,36); ctx.quadraticCurveTo(0,44,-32,36); ctx.closePath();
    ctx.fillStyle=grad(ctx,-40,0,40,0,["#1F6FB8","#3E9BE6","#185A96"]); ctx.fill(); ctx.stroke();
    ctx.lineWidth=2.2*s; [-6,10,26].forEach(y=>{ ctx.beginPath(); ctx.moveTo(-38+(y+26)*.12,y); ctx.quadraticCurveTo(0,y+6,38-(y+26)*.12,y); ctx.stroke(); });
    ctx.lineWidth=3.2*s; ctx.beginPath(); ctx.ellipse(0,-26,42,10,0,0,7); ctx.fillStyle="#9CCBF2"; ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0,-26,34,7,0,0,7); ctx.fillStyle="#2C5E8C"; ctx.fill();
    ctx.save(); ctx.translate(46,-34); ctx.rotate(.9); ctx.beginPath(); ctx.ellipse(0,0,26,7,0,0,7); ctx.fillStyle="#3E9BE6"; ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0,-3,8,3,0,0,7); ctx.fillStyle="#9CCBF2"; ctx.fill(); ctx.stroke(); ctx.restore();
    shine(ctx,-24,4,5,16,.35); },
  iogurte(ctx,s){ ol(ctx,s);
    ctx.beginPath(); ctx.moveTo(-22,-26); ctx.lineTo(22,-26); ctx.lineTo(16,30); ctx.quadraticCurveTo(0,34,-16,30); ctx.closePath();
    ctx.fillStyle="#FFFFFF"; ctx.fill(); ctx.stroke();
    ctx.fillStyle="#F78FB3"; ctx.beginPath(); ctx.moveTo(-20,-8); ctx.lineTo(20,-8); ctx.lineTo(18,10); ctx.lineTo(-18,10); ctx.closePath(); ctx.fill();
    ctx.fillStyle="#C0392B"; ctx.beginPath(); ctx.arc(-6,1,4,0,7); ctx.arc(7,1,4,0,7); ctx.fill();
    ctx.beginPath(); ctx.ellipse(0,-26,22,6,0,0,7); ctx.fillStyle="#DDE6EF"; ctx.fill(); ctx.stroke(); },
  lata(ctx,s){ ol(ctx,s);
    rr(ctx,-24,-34,48,70,6); ctx.fillStyle=grad(ctx,-24,0,24,0,["#B0B7BF","#E9EDF1","#9AA3AD"]); ctx.fill(); ctx.stroke();
    ctx.fillStyle="#E74C3C"; ctx.fillRect(-24,-16,48,30); ctx.strokeRect(-24,-16,48,30);
    ctx.fillStyle="#FFC23D"; ctx.beginPath(); ctx.arc(0,-1,8,0,7); ctx.fill();
    ctx.beginPath(); ctx.ellipse(0,-34,24,6,0,0,7); ctx.fillStyle="#CDD3D9"; ctx.fill(); ctx.stroke(); shine(ctx,-14,20,3,8,.5); },
  pote(ctx,s){ ol(ctx,s);
    ctx.beginPath(); ctx.moveTo(-44,-4); ctx.lineTo(44,-4); ctx.lineTo(34,26); ctx.quadraticCurveTo(0,34,-34,26); ctx.closePath();
    ctx.fillStyle=grad(ctx,-44,0,44,0,["#E84393","#FD79A8","#C2306F"]); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0,-4,44,10,0,0,7); ctx.fillStyle="#FFB8D4"; ctx.fill(); ctx.stroke();
    ctx.fillStyle="#fff"; ctx.beginPath(); ctx.arc(0,14,5,0,7); [[-7,6],[0,4],[7,6]].forEach(([x,y])=>ctx.arc(x,y,2.5,0,7)); ctx.fill(); },
  tampinha(ctx,s){ ol(ctx,s); ctx.beginPath(); ctx.ellipse(0,6,26,10,0,0,Math.PI); ctx.lineTo(-26,-4); ctx.ellipse(0,-4,26,10,0,Math.PI,0,true); ctx.closePath(); ctx.fillStyle="#E74C3C"; ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0,-4,26,10,0,0,7); ctx.fillStyle="#FF7B6B"; ctx.fill(); ctx.stroke(); },
  copo(ctx,s){ ol(ctx,s); ctx.beginPath(); ctx.moveTo(-24,-34); ctx.lineTo(24,-34); ctx.lineTo(16,38); ctx.lineTo(-16,38); ctx.closePath(); ctx.fillStyle="#F5F7FA"; ctx.fill(); ctx.stroke();
    ctx.fillStyle="#54A0FF"; ctx.beginPath(); ctx.moveTo(-21,-10); ctx.lineTo(21,-10); ctx.lineTo(19,4); ctx.lineTo(-19,4); ctx.fill();
    ctx.beginPath(); ctx.ellipse(0,-34,24,6,0,0,7); ctx.fillStyle="#DDE6EF"; ctx.fill(); ctx.stroke(); },
  folha(ctx,s,cor="#C8742B"){ ol(ctx,s); ctx.beginPath(); ctx.moveTo(0,-34); ctx.quadraticCurveTo(28,-6,0,34); ctx.quadraticCurveTo(-28,-6,0,-34); ctx.fillStyle=cor; ctx.fill(); ctx.stroke();
    ctx.lineWidth=2*s; ctx.beginPath(); ctx.moveTo(0,-30); ctx.lineTo(0,38); [-14,-2,10].forEach(y=>{ ctx.moveTo(0,y); ctx.lineTo(10,y-8); ctx.moveTo(0,y+4); ctx.lineTo(-10,y-4); }); ctx.stroke(); },
  folhaverde(ctx,s){ ART.folha(ctx,s,"#6AA84F"); },
  banana(ctx,s){ ol(ctx,s); ctx.fillStyle="#F7D354"; [-.9,0,.9].forEach(r=>{ ctx.save(); ctx.rotate(r); ctx.beginPath(); ctx.moveTo(0,-4); ctx.quadraticCurveTo(14,18,4,40); ctx.quadraticCurveTo(-2,20,-8,0); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); });
    ctx.fillStyle="#8B6B2E"; ctx.beginPath(); ctx.arc(0,-4,7,0,7); ctx.fill(); ctx.stroke(); ctx.fillStyle="rgba(120,80,20,.5)"; [[8,24],[-14,20],[0,30]].forEach(([x,y])=>{ ctx.beginPath(); ctx.arc(x,y,2.5,0,7); ctx.fill(); }); },
  coco(ctx,s){ ol(ctx,s); ctx.beginPath(); ctx.arc(0,4,30,Math.PI,0); ctx.closePath(); ctx.fillStyle="#7B4A26"; ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0,4,30,8,0,0,7); ctx.fillStyle="#FFF8EC"; ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.ellipse(0,4,20,4,0,0,7); ctx.fillStyle="#EADBC3"; ctx.fill(); },
  maca(ctx,s){ ol(ctx,s); ctx.beginPath(); ctx.arc(-9,4,22,0,7); ctx.arc(9,4,22,0,7); ctx.fillStyle="#C0392B"; ctx.fill(); ctx.stroke();
    ctx.fillStyle="#8B5A2B"; ctx.fillRect(-2,-28,4,14); ctx.fillStyle="#7A4E2D"; ctx.beginPath(); ctx.arc(10,12,9,0,7); ctx.fill(); shine(ctx,-14,-6,5,8,.45); },
  repelente(ctx,s){ ol(ctx,s); rr(ctx,-18,-20,36,60,8); ctx.fillStyle=grad(ctx,-18,0,18,0,["#2ECC71","#58D68D","#239B56"]); ctx.fill(); ctx.stroke();
    rr(ctx,-10,-38,20,18,3); ctx.fillStyle="#F5F7FA"; ctx.fill(); ctx.stroke(); rr(ctx,10,-36,14,6,2); ctx.fill(); ctx.stroke();
    ctx.fillStyle="#fff"; ctx.font=`800 13px "Baloo 2",sans-serif`; ctx.textAlign="center"; ctx.fillText("REP",0,14); shine(ctx,-9,0,3,12,.5); },
};
function art(ctx, kind, x, y, s=1, rot=0, alpha=1){
  const f=ART[kind]; if(!f) return;
  ctx.save(); ctx.globalAlpha=alpha; ctx.translate(x,y); if(rot) ctx.rotate(rot); ctx.scale(s,s); f(ctx,1); ctx.restore();
}

/* ---------- cenários ---------- */
function ceuBonito(ctx,G,c1,c2,sol=true){
  ctx.fillStyle=grad(ctx,0,0,0,G.H,[c1,c2]); ctx.fillRect(0,0,G.W,G.H);
  if(sol){ ctx.save(); ctx.translate(G.W-90,80); ctx.rotate(G.t*.15);
    ctx.fillStyle="rgba(255,236,150,.35)"; for(let i=0;i<12;i++){ ctx.rotate(Math.PI/6); ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(-14,-110); ctx.lineTo(14,-110); ctx.fill(); }
    ctx.restore(); const g=ctx.createRadialGradient(G.W-90,80,10,G.W-90,80,46); g.addColorStop(0,"#FFF6B0"); g.addColorStop(1,"#FFC93C");
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(G.W-90,80,42,0,7); ctx.fill(); }
}
function nuvemBonita(ctx,x,y,s){
  ctx.save(); ctx.translate(x,y); ctx.scale(s,s);
  ctx.fillStyle="rgba(120,150,190,.25)"; ctx.beginPath(); ctx.ellipse(30,26,62,12,0,0,7); ctx.fill();
  ctx.fillStyle="#fff"; ctx.beginPath(); ctx.arc(0,10,22,0,7); ctx.arc(26,-4,30,0,7); ctx.arc(58,8,24,0,7); ctx.arc(30,16,26,0,7); ctx.fill();
  ctx.fillStyle="#E3EEFA"; ctx.beginPath(); ctx.ellipse(30,22,50,9,0,0,Math.PI); ctx.fill(); ctx.restore();
}
function morros(ctx,G,y,cA="#8ED16F",cB="#6DBB52"){
  ctx.fillStyle=cA; ctx.beginPath(); ctx.moveTo(0,y); for(let x=0;x<=G.W;x+=20) ctx.lineTo(x,y-40-Math.sin(x/130)*28); ctx.lineTo(G.W,y+40); ctx.lineTo(0,y+40); ctx.fill();
  ctx.fillStyle=cB; ctx.beginPath(); ctx.moveTo(0,y); for(let x=0;x<=G.W;x+=20) ctx.lineTo(x,y-14-Math.sin(x/90+2)*16); ctx.lineTo(G.W,y+40); ctx.lineTo(0,y+40); ctx.fill();
}
function gramado(ctx,G,y,c1="#6CC24A",c2="#58AE3A"){
  ctx.fillStyle=grad(ctx,0,y,0,G.H,[c1,c2]); ctx.fillRect(0,y,G.W,G.H-y);
  ctx.fillStyle="rgba(255,255,255,.08)"; for(let i=0;i<6;i++){ ctx.beginPath(); ctx.ellipse((i*173+40)%G.W,y+40+(i*67)%(G.H-y-40),70,14,0,0,7); ctx.fill(); }
  ctx.fillStyle=c2; for(let x=0;x<G.W;x+=14){ const h=10+((x*37)%9); ctx.beginPath(); ctx.moveTo(x,y+2); ctx.lineTo(x+5,y-h+Math.sin(x+G.t*2)*2); ctx.lineTo(x+10,y+2); ctx.fill(); }
  [["#FF6B81",120],["#FFD93D",340],["#FFFFFF",520],["#FF6B81",700],["#FFD93D",60]].forEach(([c,x],i)=>{ const yy=y+22+(i*41)%60; ctx.fillStyle=c; for(let k=0;k<5;k++){ const a=k/5*Math.PI*2; ctx.beginPath(); ctx.arc(x+Math.cos(a)*5,yy+Math.sin(a)*5,4,0,7); ctx.fill(); } ctx.fillStyle="#F39C12"; ctx.beginPath(); ctx.arc(x,yy,3,0,7); ctx.fill(); });
}
function cercaBonita(ctx,G,y){
  for(let x=6;x<G.W;x+=44){ ctx.fillStyle=grad(ctx,x,0,x+30,0,["#F3E1B8","#E5CB95"]); ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x,y-66); ctx.lineTo(x+15,y-82); ctx.lineTo(x+30,y-66); ctx.lineTo(x+30,y); ctx.fill(); ctx.strokeStyle="rgba(120,90,40,.35)"; ctx.lineWidth=2; ctx.stroke(); }
  ctx.fillStyle="#D9BC84"; ctx.fillRect(0,y-54,G.W,9); ctx.fillRect(0,y-26,G.W,9);
}
function arvore(ctx,x,y,s=1,t=0){
  ctx.save(); ctx.translate(x,y); ctx.scale(s,s);
  ctx.fillStyle="#7A5230"; ctx.beginPath(); ctx.moveTo(-10,0); ctx.lineTo(-6,-80); ctx.lineTo(6,-80); ctx.lineTo(10,0); ctx.fill();
  const sw=Math.sin(t*1.2)*3; [["#3E8E41",0,-110,48],["#4CAF50",-34,-90,36],["#4CAF50",34,-92,38],["#66BB6A",-6,-130,34]].forEach(([c,dx,dy,r])=>{ ctx.fillStyle=c; ctx.beginPath(); ctx.arc(dx+sw,dy,r,0,7); ctx.fill(); });
  ctx.fillStyle="rgba(255,255,255,.18)"; ctx.beginPath(); ctx.arc(-14+sw,-128,14,0,7); ctx.fill(); ctx.restore();
}
function bananeira(ctx,x,y,s=1,t=0){
  ctx.save(); ctx.translate(x,y); ctx.scale(s,s);
  ctx.fillStyle="#8D6E3F"; ctx.fillRect(-8,-120,16,120);
  const sw=Math.sin(t*1.4)*.08;
  [-1.1,-.5,.2,.8,1.3].forEach((r,i)=>{ ctx.save(); ctx.translate(0,-118); ctx.rotate(r+sw); ctx.fillStyle=i%2?"#5DAE3E":"#4C9A31"; ctx.beginPath(); ctx.ellipse(0,-46,16,52,0,0,7); ctx.fill(); ctx.strokeStyle="rgba(0,0,0,.2)"; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,-94); ctx.stroke(); ctx.restore(); });
  ctx.restore();
}
function casaBonita(ctx,cx,top,w,h,tarde){
  const x=cx-w/2;
  ctx.fillStyle="rgba(0,0,0,.12)"; ctx.beginPath(); ctx.ellipse(cx,top+h+6,w*.6,14,0,0,7); ctx.fill();
  ctx.fillStyle=grad(ctx,x,0,x+w,0,tarde?["#E8C9A0","#D9B386"]:["#FFF1D6","#F2DDB5"]); ctx.fillRect(x,top,w,h);
  ctx.strokeStyle="rgba(120,90,40,.12)"; ctx.lineWidth=2; for(let yy=top+16;yy<top+h;yy+=16){ ctx.beginPath(); ctx.moveTo(x,yy); ctx.lineTo(x+w,yy); ctx.stroke(); }
  ctx.fillStyle="#C0392B"; ctx.beginPath(); ctx.moveTo(x-26,top+6); ctx.lineTo(cx,top-110); ctx.lineTo(x+w+26,top+6); ctx.fill();
  ctx.fillStyle="rgba(0,0,0,.14)"; for(let r=0;r<5;r++){ for(let c=-r;c<=r;c++){ ctx.beginPath(); ctx.arc(cx+c*36,top-90+r*22,10,0,Math.PI); ctx.fill(); } }
  ctx.fillStyle="#8B5A2B"; rr(ctx,cx-26,top+h-104,52,104,6); ctx.fill(); ctx.fillStyle="#FFC23D"; ctx.beginPath(); ctx.arc(cx+14,top+h-52,4,0,7); ctx.fill();
}
function janela(ctx,x,y,tarde,quem,ai=0){
  ctx.fillStyle=tarde?"#FFE29A":"#C9ECFF"; rr(ctx,x-44,y-38,88,76,6); ctx.fill();
  ctx.fillStyle="rgba(255,255,255,.45)"; ctx.beginPath(); ctx.moveTo(x-40,y+30); ctx.lineTo(x-10,y-34); ctx.lineTo(x+4,y-34); ctx.lineTo(x-26,y+30); ctx.fill();
  if(quem){ ctx.save(); rr(ctx,x-44,y-38,88,76,6); ctx.clip(); pessoa(ctx,quem,x,y+4,G_t(),ai); ctx.restore(); }
  ctx.fillStyle="#E74C3C"; ctx.beginPath(); ctx.moveTo(x-44,y-38); ctx.quadraticCurveTo(x-30,y,x-44,y+20); ctx.fill(); ctx.beginPath(); ctx.moveTo(x+44,y-38); ctx.quadraticCurveTo(x+30,y,x+44,y+20); ctx.fill();
  ctx.strokeStyle="#6D4C2F"; ctx.lineWidth=6; rr(ctx,x-44,y-38,88,76,6); ctx.stroke();
  ctx.fillStyle="#6D4C2F"; ctx.fillRect(x-52,y+38,104,8);
}
/* pessoa em desenho (cabeça e ombros), para as janelas. tipo: menina, menino, avo, pai, mae. ai>0 = levou picada */
let _gt=0; function G_t(){ return _gt; }
const PELE={menina:"#F1C27D",menino:"#8D5524",avo:"#FFDBAC",pai:"#C68642",mae:"#E0AC69"};
function pessoa(ctx,tipo,x,y,t,ai){
  const pele=PELE[tipo]||"#F1C27D", bob=Math.sin(t*2+x*.05)*1.5;
  const roupa={menina:"#E84393",menino:"#2E86DE",avo:"#8E44AD",pai:"#27AE60",mae:"#F39C12"}[tipo]||"#2E86DE";
  const cab={menina:"#4A2C17",menino:"#1E130C",avo:"#D5D8DC",pai:"#2C1A0E",mae:"#6B3A1E"}[tipo]||"#333";
  ctx.save(); ctx.translate(x,y+bob); ctx.lineWidth=2.6; ctx.strokeStyle=INK; ctx.lineJoin="round";
  // tronco
  ctx.beginPath(); ctx.moveTo(-26,40); ctx.quadraticCurveTo(-26,14,0,12); ctx.quadraticCurveTo(26,14,26,40); ctx.closePath(); ctx.fillStyle=roupa; ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-6,13); ctx.lineTo(0,20); ctx.lineTo(6,13); ctx.strokeStyle="rgba(0,0,0,.25)"; ctx.stroke(); ctx.strokeStyle=INK;
  // cabelo de trás
  ctx.fillStyle=cab;
  if(tipo==="mae"){ ctx.beginPath(); ctx.ellipse(0,0,19,22,0,0,7); ctx.fill(); ctx.stroke(); }
  if(tipo==="menina"){ [-18,18].forEach(dx=>{ ctx.beginPath(); ctx.ellipse(dx,-2,6,9,dx<0?.4:-.4,0,7); ctx.fill(); ctx.stroke(); }); }
  if(tipo==="avo"){ ctx.beginPath(); ctx.arc(0,-20,8,0,7); ctx.fill(); ctx.stroke(); }
  // cabeça
  ctx.beginPath(); ctx.arc(0,-4,15,0,7); ctx.fillStyle=pele; ctx.fill(); ctx.stroke();
  // franja / cabelo da frente
  ctx.fillStyle=cab; ctx.beginPath(); ctx.arc(0,-4,15,Math.PI*1.05,Math.PI*1.95);
  if(tipo==="menino"||tipo==="pai"){ ctx.quadraticCurveTo(6,-14,-14,-8); } else { ctx.quadraticCurveTo(0,-10,-14,-8); }
  ctx.closePath(); ctx.fill(); ctx.stroke();
  if(tipo==="pai"){ ctx.beginPath(); ctx.arc(0,2,13,Math.PI*.1,Math.PI*.9); ctx.lineTo(-8,4); ctx.quadraticCurveTo(0,8,8,4); ctx.closePath(); ctx.fill(); }
  // rosto
  const pisca = (Math.sin(t*1.3+x)>.97);
  ctx.fillStyle=INK;
  if(pisca){ ctx.lineWidth=2; [-5,5].forEach(dx=>{ ctx.beginPath(); ctx.moveTo(dx-2.5,-4); ctx.lineTo(dx+2.5,-4); ctx.stroke(); }); }
  else [-5,5].forEach(dx=>{ ctx.beginPath(); ctx.arc(dx,-4,2.2,0,7); ctx.fill(); });
  if(tipo==="avo"){ ctx.lineWidth=1.6; [-5,5].forEach(dx=>{ ctx.beginPath(); ctx.arc(dx,-4,4.5,0,7); ctx.stroke(); }); ctx.beginPath(); ctx.moveTo(-.5,-4); ctx.lineTo(.5,-4); ctx.stroke(); }
  ctx.fillStyle="rgba(255,110,110,.35)"; [-9,9].forEach(dx=>{ ctx.beginPath(); ctx.arc(dx,2,3,0,7); ctx.fill(); });
  ctx.lineWidth=2; ctx.strokeStyle=INK; ctx.beginPath();
  if(ai>0){ ctx.arc(0,7,4,Math.PI*1.15,Math.PI*1.85); } else { ctx.arc(0,2,5,Math.PI*.15,Math.PI*.85); }
  ctx.stroke();
  if(ai>0){ ctx.fillStyle="#E74C3C"; ctx.beginPath(); ctx.arc(11,-12,3.5,0,7); ctx.fill(); }
  ctx.restore();
}
function anel(G,x,y,cor){ G.rings=G.rings||[]; G.rings.push({x,y,r:10,a:1,cor}); }
function desenhaAneis(ctx,G,dt){ (G.rings||[]).forEach(r=>{ r.r+=dt*260; r.a-=dt*2.2; ctx.globalAlpha=Math.max(0,r.a); ctx.strokeStyle=r.cor; ctx.lineWidth=5; ctx.beginPath(); ctx.arc(r.x,r.y,r.r,0,7); ctx.stroke(); }); ctx.globalAlpha=1; G.rings=(G.rings||[]).filter(r=>r.a>0); }
function agua(ctx,x,y,rx,ry,t){
  const g=ctx.createRadialGradient(x-rx*.3,y-ry*.3,2,x,y,rx); g.addColorStop(0,"#9ED8FF"); g.addColorStop(1,"#2E86DE");
  ctx.fillStyle=g; ctx.beginPath(); ctx.ellipse(x,y,rx,ry,0,0,7); ctx.fill();
  ctx.strokeStyle="rgba(255,255,255,.7)"; ctx.lineWidth=2; const k=(t*1.5)%1;
  ctx.globalAlpha=1-k; ctx.beginPath(); ctx.ellipse(x,y,rx*k,ry*k,0,0,7); ctx.stroke(); ctx.globalAlpha=1;
}
