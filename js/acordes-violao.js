/* =========================================================
   ACORDES-VIOLAO.JS — ARQUIVO COMPARTILHADO
   Usado pelo index.html e pelo dicionario-acordes.html

   Ordem das cordas em cordas[]:
   0 = 6ª E (Mi grave)
   1 = 5ª A
   2 = 4ª D
   3 = 3ª G
   4 = 2ª B
   5 = 1ª E (Mi agudo)

   Valores:
   "X" = não tocar
   0 = corda solta
   número = casa pressionada
   ========================================================= */

window.AcordesViolao = window.AcordesViolao || {};

AcordesViolao.ACORDES = {


  /* =========================================================
     MAIORES — CASAS E DEDOS
     ========================================================= */

  "C":{
    cordas:["X",3,2,0,1,0],
    dedos:[null,3,2,null,1,null]
  },

  "Db":{
    cordas:[9,11,11,10,9,9],
    dedos:[1,3,4,2,1,1]
  },

  "D":{
    cordas:["X","X",0,2,3,2],
    dedos:[null,null,null,1,3,2]
  },

  "Eb":{
    cordas:[11,13,13,12,11,11],
    dedos:[1,3,4,2,1,1]
  },

  "E":{
    cordas:[0,2,2,1,0,0],
    dedos:[null,2,3,1,null,null]
  },

  "F":{
    cordas:[1,3,3,2,1,1],
    dedos:[1,3,4,2,1,1]
  },

  "Gb":{
    cordas:[2,4,4,3,2,2],
    dedos:[1,3,4,2,1,1]
  },

  "G":{
    cordas:[3,2,0,0,0,3],
    dedos:[2,1,null,null,null,3]
  },

  "Ab":{
    cordas:[4,6,6,5,4,4],
    dedos:[1,3,4,2,1,1]
  },

  "A":{
    cordas:["X",0,2,2,2,0],
    dedos:[null,null,1,2,3,null]
  },

  "Bb":{
    cordas:[6,8,8,7,6,6],
    dedos:[1,3,4,2,1,1]
  },

  "B":{
    cordas:["X",2,4,4,4,2],
    dedos:[null,1,2,3,4,1]
  },




  /* =========================================================
     MENORES — CASAS E DEDOS
     ========================================================= */

  "Cm":{
    cordas:["X",3,5,5,4,3],
    dedos:[null,1,3,4,2,1]
  },

  "Dbm":{
    cordas:[9,11,11,9,9,9],
    dedos:[1,3,4,1,1,1]
  },

  "Dm":{
    cordas:["X","X",0,2,3,1],
    dedos:[null,null,null,2,3,1]
  },

  "Ebm":{
    cordas:[11,13,13,11,11,11],
    dedos:[1,3,4,1,1,1]
  },

  "Em":{
    cordas:[0,2,2,0,0,0],
    dedos:[null,2,3,null,null,null]
  },

  "Fm":{
    cordas:[1,3,3,1,1,1],
    dedos:[1,3,4,1,1,1]
  },

  "Gbm":{
    cordas:[2,4,4,2,2,2],
    dedos:[1,3,4,1,1,1]
  },

  "Gm":{
    cordas:[3,5,5,3,3,3],
    dedos:[1,3,4,1,1,1]
  },

  "Abm":{
    cordas:[4,6,6,4,4,4],
    dedos:[1,3,4,1,1,1]
  },

  "Am":{
    cordas:["X",0,2,2,1,0],
    dedos:[null,null,2,3,1,null]
  },

  "Bbm":{
    cordas:[6,8,8,6,6,6],
    dedos:[1,3,4,1,1,1]
  },

  "Bm":{
    cordas:["X",2,4,4,3,2],
    dedos:[null,1,3,4,2,1]
  },


  /* =========================================================
     7ª DOMINANTE — CASAS E DEDOS
     ========================================================= */

  "C7":{
    cordas:["X",3,2,3,1,0],
    dedos:[null,3,2,4,1,null]
  },

  "Db7":{
    cordas:[9,11,9,10,9,9],
    dedos:[1,3,1,2,1,1]
  },

  "D7":{
    cordas:["X","X",0,2,1,2],
    dedos:[null,null,null,2,1,3]
  },

  "Eb7":{
    cordas:[11,13,11,12,11,11],
    dedos:[1,3,1,2,1,1]
  },

  "E7":{
    cordas:[0,2,0,1,0,0],
    dedos:[null,2,null,1,null,null]
  },

  "F7":{
    cordas:[1,3,1,2,1,1],
    dedos:[1,3,1,2,1,1]
  },

  "Gb7":{
    cordas:[2,4,2,3,2,2],
    dedos:[1,3,1,2,1,1]
  },

  "G7":{
    cordas:[3,2,0,0,0,1],
    dedos:[3,2,null,null,null,1]
  },

  "Ab7":{
    cordas:[4,6,4,5,4,4],
    dedos:[1,3,1,2,1,1]
  },

  "A7":{
    cordas:["X",0,2,0,2,0],
    dedos:[null,null,2,null,3,null]
  },

  "Bb7":{
    cordas:[6,8,6,7,6,6],
    dedos:[1,3,1,2,1,1]
  },

  "B7":{
    cordas:["X",2,1,2,0,2],
    dedos:[null,2,1,3,null,4]
  },



  /* =========================================================
     MENOR 7ª — CASAS E DEDOS
     ========================================================= */

  "Cm7":{
    cordas:["X",3,5,3,4,3],
    dedos:[null,1,3,1,2,1]
  },

  "Dbm7":{
    cordas:[9,11,9,9,9,9],
    dedos:[1,3,1,1,1,1]
  },

  "Dm7":{
    cordas:["X","X",0,2,1,1],
    dedos:[null,null,null,2,1,1]
  },

  "Ebm7":{
    cordas:[11,13,11,11,11,11],
    dedos:[1,3,1,1,1,1]
  },

  "Em7":{
    cordas:[0,2,0,0,0,0],
    dedos:[null,2,null,null,null,null]
  },

  "Fm7":{
    cordas:[1,3,1,1,1,1],
    dedos:[1,3,1,1,1,1]
  },

  "Gbm7":{
    cordas:[2,4,2,2,2,2],
    dedos:[1,3,1,1,1,1]
  },

  "Gm7":{
    cordas:[3,5,3,3,3,3],
    dedos:[1,3,1,1,1,1]
  },

  "Abm7":{
    cordas:[4,6,4,4,4,4],
    dedos:[1,3,1,1,1,1]
  },

  "Am7":{
    cordas:["X",0,2,0,1,0],
    dedos:[null,null,2,null,1,null]
  },

  "Bbm7":{
    cordas:[6,8,6,6,6,6],
    dedos:[1,3,1,1,1,1]
  },

  "Bm7":{
    cordas:["X",2,0,2,0,2],
    dedos:[null,1,null,2,null,3]
  },


  /* =========================================================
     SUS4 — CASAS E DEDOS
     ========================================================= */

  "C4":{
    cordas:[0,3,3,0,1],
    dedos:[null,3,4,null,1,null]
  },

  "Db4":{
    cordas:[0,2,4,4,5,2],
    dedos:[null,1,2,3,4,1]
  },

  "D4":{
    cordas:["X","X",0,2,3,3],
    dedos:[null,null,null,1,3,4]
  },

  "Eb4":{
    cordas:[0,0,1,3,4,4],
    dedos:[null,null,1,2,3,4]
  },

  "E4":{
    cordas:[0,2,2,2,0,0],
    dedos:[null,2,3,4,null,null]
  },

  "F4":{
    cordas:[1,3,3,3,1,1],
    dedos:[1,2,3,4,1,1]
  },

  "Gb4":{
    cordas:[2,4,4,4,2,2],
    dedos:[1,2,3,4,1,1]
  },

  "G4":{
    cordas:[3,2,0,0,1,3],
    dedos:[3,2,null,null,1,4]
  },

  "Ab4":{
    cordas:[4,6,6,6,4,4],
    dedos:[1,2,3,4,1,1]
  },

  "A4":{
    cordas:["X",0,2,2,3,0],
    dedos:[null,null,1,2,3,null]
  },

  "Bb4":{
    cordas:[0,1,3,3,4,1],
    dedos:[null,1,2,3,4,1]
  },

  "B4":{
    cordas:["X",2,4,4,5,2],
    dedos:[null,1,2,3,4,1]
  },

  /* =========================================================
     SUS2 — CASAS E DEDOS
     ========================================================= */

  "C2":{
    cordas:["X",3,5,5,3,3],
    dedos:[null,1,3,4,1,1]
  },

  "Db2":{
    cordas:["X",4,6,6,4,4],
    dedos:[null,1,3,4,1,1]
  },

  "D2":{
    cordas:["X",5,7,7,5,5],
    dedos:[null,1,3,4,1,1]
  },

  "Eb2":{
    cordas:["X",6,8,8,6,6],
    dedos:[null,1,3,4,1,1]
  },

  "E2":{
    cordas:["X",7,9,9,7,7],
    dedos:[null,1,3,4,1,1]
  },

  "F2":{
    cordas:["X",8,10,10,8,8],
    dedos:[null,1,3,4,1,1]
  },

  "Gb2":{
    cordas:["X",9,11,11,9,9],
    dedos:[null,1,3,4,1,1]
  },

  "G2":{
    cordas:["X",10,12,12,10,10],
    dedos:[null,1,3,4,1,1]
  },

  "Ab2":{
    cordas:["X",11,13,13,11,11],
    dedos:[null,1,3,4,1,1]
  },

  "A2":{
    cordas:["X",12,14,14,12,12],
    dedos:[null,1,3,4,1,1]
  },

  "Bb2":{
    cordas:["X",13,15,15,13,13],
    dedos:[null,1,3,4,1,1]
  },

  "B2":{
    cordas:["X",14,16,16,14,14],
    dedos:[null,1,3,4,1,1]
  },
 
  /* =====================================================
     ACORDES DIMINUTOS — QUATRO NOTAS
     Nomenclatura: dim
     cordas = casas
     dedos = dedos da mão esquerda
     ===================================================== */

  "Cdim":{
    cordas:["X",3,4,2,4,"X"],
    dedos:[null,2,3,1,4,null]
  },

  "Dbdim":{
    cordas:["X",4,5,3,5,"X"],
    dedos:[null,2,3,1,4,null]
  },

  "Ddim":{
    cordas:["X",5,6,4,6,"X"],
    dedos:[null,2,3,1,4,null]
  },

  "Ebdim":{
    cordas:["X",6,7,5,7,"X"],
    dedos:[null,2,3,1,4,null]
  },

  "Edim":{
    cordas:["X",7,8,6,8,"X"],
    dedos:[null,2,3,1,4,null]
  },

  "Fdim":{
    cordas:["X","X",3,4,3,4],
    dedos:[null,null,1,3,2,4]
  },

  "Gbdim":{
    cordas:[2,"X",1,2,1,"X"],
    dedos:[3,null,1,4,2,null]
  },

  "Gdim":{
    cordas:[3,"X",2,3,2,"X"],
    dedos:[3,null,1,4,2,null]
  },

  "Abdim":{
    cordas:[4,"X",3,4,3,"X"],
    dedos:[3,null,1,4,2,null]
  },

  "Adim":{
    cordas:[5,"X",4,5,4,"X"],
    dedos:[3,null,1,4,2,null]
  },

  "Bbdim":{
    cordas:[6,"X",5,6,5,"X"],
    dedos:[3,null,1,4,2,null]
  },

  "Bdim":{
    cordas:["X",2,3,1,3,"X"],
    dedos:[null,2,3,1,4,null]
  }


};


/* =========================================================
   PESTANAS
   fret = casa da pestana
   fromString / toString = índices das cordas (0 a 5)
   ========================================================= */

AcordesViolao.PESTANAS = {
  "Eb":      {fret:11, fromString:0, toString:5},
  "F":       {fret:1, fromString:0, toString:5},
  "Fm":      {fret:1, fromString:0, toString:5},
  "F7":      {fret:1, fromString:0, toString:5},
  "Fm7":     {fret:1, fromString:0, toString:5},
  "Fsus4":   {fret:1, fromString:0, toString:5},

  "Gb":      {fret:2, fromString:0, toString:5},
  "Gm":      {fret:3, fromString:0, toString:5},
  "Gbm":     {fret:2, fromString:0, toString:5},
  "Gb7":     {fret:2, fromString:0, toString:5},
  "Gbm7":    {fret:2, fromString:0, toString:5},
  "Gbsus4":  {fret:2, fromString:0, toString:5},

  "Ab":      {fret:4, fromString:0, toString:5},
  "Abm":     {fret:4, fromString:0, toString:5},
  "Ab7":     {fret:4, fromString:0, toString:5},
  "Abm7":    {fret:4, fromString:0, toString:5},
  "Absus4":  {fret:4, fromString:0, toString:5},

  "Bb":      {fret:6, fromString:0, toString:5},
  "Bbm":     {fret:6, fromString:0, toString:5},
  "Bb7":     {fret:6, fromString:0, toString:5},
  "Bbm7":    {fret:6, fromString:0, toString:5},
  "Bbsus4":  {fret:6, fromString:0, toString:5},

  "B":       {fret:2, fromString:1, toString:5},
  "Bm":      {fret:2, fromString:1, toString:5},
  "B7":      {fret:2, fromString:1, toString:5},
  "Bm7":     {fret:2, fromString:1, toString:5},
  "Bsus4":   {fret:2, fromString:1, toString:5}
};

AcordesViolao.NOMES_CORDAS = ["E","A","D","G","B","E"];

AcordesViolao.EQUIVALENTES = {
  "A#":"Bb", "Bb":"Bb",
  "C#":"Db", "Db":"Db",
  "D#":"Eb", "Eb":"Eb",
  "F#":"Gb", "Gb":"Gb",
  "G#":"Ab", "Ab":"Ab"
};


AcordesViolao.normalizar = function(chord){

  // Considera somente o acorde antes da barra
  const value=String(chord||'')
    .split('/')[0]
    .trim();

  if(this.ACORDES[value]) return value;

  const m=value.match(/^([A-G](?:#|b)?)(.*)$/);

  if(!m) return null;

  const root=m[1];
  const suffix=m[2]||'';

  const eq=this.EQUIVALENTES[root];

  if(!eq) return null;

  const name=eq+suffix;

  return this.ACORDES[name] ? name : null;
};


AcordesViolao.getShape = function(chord){
  const name=this.normalizar(chord);
  return name ? this.ACORDES[name] : null;
};

AcordesViolao.getBarre = function(chord){
  const value=String(chord||'').trim();
  if(this.PESTANAS[value]) return this.PESTANAS[value];
  const name=this.normalizar(value);
  return name ? (this.PESTANAS[name]||null) : null;
};

AcordesViolao.ensureStyle = function(){
  if(document.getElementById('acordes-violao-style-shared')) return;
  const style=document.createElement('style');
  style.id='acordes-violao-style-shared';
  style.textContent=`
    .chord-mini-guitar{
      position:relative;width:100%;height:170px;margin-top:4px;
      user-select:none;font-family:Arial,Helvetica,sans-serif;
    }
    .guitar-fretboard{
      position:absolute;left:34px;right:34px;top:30px;bottom:30px;
      border:1px solid #a99f93;border-radius:6px;
      background:linear-gradient(to bottom,#6a4b32,#4c3323);
      overflow:visible;box-shadow:inset 0 0 0 1px rgba(255,255,255,.08);
    }
    .guitar-fret{
      position:absolute;top:0;bottom:0;width:2px;background:#c5beb6;
      box-shadow:1px 0 1px rgba(0,0,0,.25);
    }
    .guitar-string{
      position:absolute;left:0;right:0;height:1px;background:#d7d0c7;
      box-shadow:0 1px 1px rgba(0,0,0,.25);
    }
	
.guitar-dot{
  position:absolute;
  width:19px;
  height:19px;
  border-radius:50%;

  display:flex;
  align-items:center;
  justify-content:center;

  font:800 12px/1 Arial,sans-serif;
  color:#38332e;

  background:#f5f3ef;
  border:1px solid #aaa39a;

  box-shadow:
    0 1px 2px rgba(0,0,0,.20),
    inset 0 1px 1px rgba(255,255,255,.70);

  transform:translate(-50%,-50%);
  z-index:5;
}
    
.guitar-status-row{
  position:absolute;
  left:0;
  right:auto;
  top:30px;
  width:28px;
  height:110px;

  display:grid;
  grid-template-columns:1fr;
  grid-template-rows:repeat(6,1fr);

  align-items:center;
  justify-items:center;

  text-align:center;
  font:800 17px/1 Arial,sans-serif;
  color:#4d4943;
  z-index:6;
}

    .guitar-string-labels{
      position:absolute;right:0;top:30px;height:110px;width:28px;
      display:grid;grid-template-rows:repeat(6,1fr);align-items:center;
      justify-items:center;font:800 12px/1 Arial,sans-serif;color:#5f5a53;z-index:6;
    }
    .guitar-fret-number-row{
      position:absolute;left:34px;right:34px;bottom:0;
      display:grid;grid-template-columns:repeat(5,1fr);
      text-align:center;font:700 12px/1 Arial,sans-serif;color:#5f5a53;
    }
    .guitar-position-label{
      position:absolute;top:0;left:0;color:#746e64;font:700 10px/1 Arial,sans-serif;
    }
    .guitar-barre{
      position:absolute;width:8px;border-radius:999px;background:#28231e;
      box-shadow:0 1px 2px rgba(0,0,0,.35);transform:translate(-50%,-50%);
      z-index:4;pointer-events:none;
    }
  `;
  document.head.appendChild(style);
};

AcordesViolao.buildMiniGuitar = function(chord){
  this.ensureStyle();
  const shape=this.getShape(chord);
  if(!shape) return null;

  const cordas=shape.cordas;
  const dedos=shape.dedos||[];
  const barre=this.getBarre(chord);
  const fretted=cordas.map(v=>Number(v)).filter(n=>Number.isFinite(n)&&n>0);
  const hasOpen=cordas.some(v=>Number(v)===0);
  const firstFret=fretted.length ? Math.min(...fretted) : 1;
  const startFret=hasOpen ? 1 : Math.max(1,firstFret);
  const total=5;

  const wrap=document.createElement('div');
  wrap.className='chord-mini-guitar';
  const board=document.createElement('div');
  board.className='guitar-fretboard';
  wrap.appendChild(board);

  for(let i=1;i<total;i++){
    const fret=document.createElement('div');
    fret.className='guitar-fret';
    fret.style.left=(i*100/total)+'%';
    board.appendChild(fret);
  }

  for(let i=0;i<6;i++){
    const st=document.createElement('div');
    st.className='guitar-string';
    st.style.top=(i/5*100)+'%';
    board.appendChild(st);
  }

  /* X / O */
  const status=document.createElement('div');
  status.className='guitar-status-row';
  cordas.forEach(v=>{
    const mark=document.createElement('div');
    mark.textContent=v==='X'?'X':Number(v)===0?'O':'';
    status.appendChild(mark);
  });
  wrap.appendChild(status);

  /* Nomes das cordas à direita */
  const labels=document.createElement('div');
  labels.className='guitar-string-labels';
  this.NOMES_CORDAS.forEach(n=>{
    const label=document.createElement('div');
    label.textContent=n;
    labels.appendChild(label);
  });
  wrap.appendChild(labels);

  /* Pestana */
  if(barre){
    const local=barre.fret-startFret+1;
    if(local>=1 && local<=total){
      const b=document.createElement('div');
      b.className='guitar-barre';
      const x=((total-local+0.5)/total)*100;
      const y1=(barre.fromString/5)*100;
      const y2=(barre.toString/5)*100;
      b.style.left=x+'%';
      b.style.top=((y1+y2)/2)+'%';
      b.style.height=Math.max(12,(y2-y1)*1.2)+'%';
      board.appendChild(b);
    }
  }

  /* Bolinhas com números dos dedos */
cordas.forEach((v,stringIndex)=>{

  if(v==='X'||Number(v)===0)return;

  const fret=Number(v);

  if(!Number.isFinite(fret))return;

  const local=fret-startFret+1;

  if(local<1||local>total)return;

  const dot=document.createElement('div');
  dot.className='guitar-dot';

  // Número do dedo correspondente à corda
  const dedo=dedos[stringIndex];

  dot.textContent=dedo ? String(dedo) : '';

  const x=((total-local+0.5)/total)*100;
  const y=(stringIndex/5)*100;

  dot.style.left=x+'%';
  dot.style.top=y+'%';

  board.appendChild(dot);
});

  /* Números das casas: 5 4 3 2 1 */
  const nums=document.createElement('div');
  nums.className='guitar-fret-number-row';
  for(let i=0;i<total;i++){
    const label=document.createElement('div');
    label.textContent=String(startFret+total-1-i);
    nums.appendChild(label);
  }
  wrap.appendChild(nums);

  if(startFret>1){
    const pos=document.createElement('div');
    pos.className='guitar-position-label';
    pos.textContent=`${startFret}ª posição`;
    wrap.appendChild(pos);
  }

  return wrap;
};

/* Compatibilidade com os dois projetos atuais. */
window.ACORDES_VIOLAO = AcordesViolao.ACORDES;
window.PESTANAS = AcordesViolao.PESTANAS;
window.NOMES_CORDAS_VIOLAO = AcordesViolao.NOMES_CORDAS;
window.buildMiniGuitar = AcordesViolao.buildMiniGuitar.bind(AcordesViolao);
window.getBarre = AcordesViolao.getBarre.bind(AcordesViolao);
