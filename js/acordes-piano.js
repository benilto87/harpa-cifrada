/* =========================================================
   ACORDES-PIANO.JS
   Sistema de tecladinhos para os acordes
   ========================================================= */

const chordPopupState = {
  el: null,
  anchor: null
};


/* =========================================================
   NOMES DAS NOTAS
   ========================================================= */

const popupPcNames = [
  'C','Db','D','Eb','E','F',
  'Gb','G','Ab','A','Bb','B'
];

const solfegeByPc = [
  'Dó','Ré♭','Ré','Mi♭','Mi','Fá',
  'Sol♭','Sol','Lá♭','Lá','Si♭','Si'
];


/* =========================================================
   DESENHOS MANUAIS DOS ACORDES
   =========================================================

   Cada nota é:

   { nota:"C", oitava:1 }

   Oitava 1 = C1 até B1
   Oitava 2 = C2 até B2

   A posição é exata.
   Portanto, se você colocar 3 notas,
   aparecem 3 marcações.
*/


const ACORDES = {

  "C":[
    {nota:"C",oitava:1},
    {nota:"E",oitava:1},
    {nota:"G",oitava:1}
  ],

  "D":[
    {nota:"D",oitava:1},
    {nota:"F#",oitava:1},
    {nota:"A",oitava:1}
  ],

  "E":[
    {nota:"E",oitava:1},
    {nota:"G#",oitava:1},
    {nota:"B",oitava:1}
  ],

  "F":[
    {nota:"F",oitava:1},
    {nota:"A",oitava:1},
    {nota:"C",oitava:2}
  ],

  "G":[
    {nota:"G",oitava:1},
    {nota:"B",oitava:1},
    {nota:"D",oitava:2}
  ],

  "A":[
    {nota:"A",oitava:1},
    {nota:"C#",oitava:2},
    {nota:"E",oitava:2}
  ],

  "B":[
    {nota:"B",oitava:1},
    {nota:"D#",oitava:2},
    {nota:"F#",oitava:2}
  ],


  /* =====================================================
     MENORES
     ===================================================== */

  "Cm":[
    {nota:"C",oitava:1},
    {nota:"Eb",oitava:1},
    {nota:"G",oitava:1}
  ],

  "Dm":[
    {nota:"D",oitava:1},
    {nota:"F",oitava:1},
    {nota:"A",oitava:1}
  ],

  "Em":[
    {nota:"E",oitava:1},
    {nota:"G",oitava:1},
    {nota:"B",oitava:1}
  ],

  "Fm":[
    {nota:"F",oitava:1},
    {nota:"Ab",oitava:1},
    {nota:"C",oitava:2}
  ],

  "Gm":[
    {nota:"G",oitava:1},
    {nota:"Bb",oitava:1},
    {nota:"D",oitava:2}
  ],

  "Am":[
    {nota:"A",oitava:1},
    {nota:"C",oitava:2},
    {nota:"E",oitava:2}
  ],

  "Bm":[
    {nota:"B",oitava:1},
    {nota:"D",oitava:2},
    {nota:"F#",oitava:2}
  ],


  /* =====================================================
     7ª
     ===================================================== */

  "C7":[
    {nota:"C",oitava:1},
    {nota:"E",oitava:1},
    {nota:"G",oitava:1},
    {nota:"Bb",oitava:1}
  ],

  "D7":[
    {nota:"D",oitava:1},
    {nota:"F#",oitava:1},
    {nota:"A",oitava:1},
    {nota:"C",oitava:2}
  ],

  "E7":[
    {nota:"E",oitava:1},
    {nota:"G#",oitava:1},
    {nota:"B",oitava:1},
    {nota:"D",oitava:2}
  ],

  "F7":[
    {nota:"F",oitava:1},
    {nota:"A",oitava:1},
    {nota:"C",oitava:2},
    {nota:"Eb",oitava:2}
  ],

  "G7":[
    {nota:"G",oitava:1},
    {nota:"B",oitava:1},
    {nota:"D",oitava:2},
    {nota:"F",oitava:2}
  ],

  "A7":[
    {nota:"A",oitava:1},
    {nota:"C#",oitava:2},
    {nota:"E",oitava:2},
    {nota:"G",oitava:2}
  ],

  "B7":[
    {nota:"B",oitava:1},
    {nota:"D#",oitava:2},
    {nota:"F#",oitava:2},
    {nota:"A",oitava:2}
  ],


  /* =====================================================
     MENOR 7ª
     ===================================================== */

  "Cm7":[
    {nota:"C",oitava:1},
    {nota:"Eb",oitava:1},
    {nota:"G",oitava:1},
    {nota:"Bb",oitava:1}
  ],

  "Dm7":[
    {nota:"D",oitava:1},
    {nota:"F",oitava:1},
    {nota:"A",oitava:1},
    {nota:"C",oitava:2}
  ],

  "Em7":[
    {nota:"E",oitava:1},
    {nota:"G",oitava:1},
    {nota:"B",oitava:1},
    {nota:"D",oitava:2}
  ],

  "Fm7":[
    {nota:"F",oitava:1},
    {nota:"Ab",oitava:1},
    {nota:"C",oitava:2},
    {nota:"Eb",oitava:2}
  ],

  "Gm7":[
    {nota:"G",oitava:1},
    {nota:"Bb",oitava:1},
    {nota:"D",oitava:2},
    {nota:"F",oitava:2}
  ],

  "Am7":[
    {nota:"A",oitava:1},
    {nota:"C",oitava:2},
    {nota:"E",oitava:2},
    {nota:"G",oitava:2}
  ],

  "Bm7":[
    {nota:"B",oitava:1},
    {nota:"D",oitava:2},
    {nota:"F#",oitava:2},
    {nota:"A",oitava:2}
  ],


  /* =====================================================
     SUS4
     ===================================================== */

  "Csus4":[
    {nota:"C",oitava:1},
    {nota:"F",oitava:1},
    {nota:"G",oitava:1},
    {nota:"C",oitava:2}
  ],

  "Dsus4":[
    {nota:"D",oitava:1},
    {nota:"G",oitava:1},
    {nota:"A",oitava:1},
    {nota:"D",oitava:2}
  ],

  "Esus4":[
    {nota:"E",oitava:1},
    {nota:"A",oitava:1},
    {nota:"B",oitava:1},
    {nota:"E",oitava:2}
  ],

  "Fsus4":[
    {nota:"F",oitava:1},
    {nota:"Bb",oitava:1},
    {nota:"C",oitava:2},
    {nota:"F",oitava:2}
  ],

  "Gsus4":[
    {nota:"G",oitava:1},
    {nota:"C",oitava:2},
    {nota:"D",oitava:2},
    {nota:"G",oitava:2}
  ],

  "Asus4":[
    {nota:"A",oitava:1},
    {nota:"D",oitava:2},
    {nota:"E",oitava:2},
    {nota:"A",oitava:2}
  ],

  "Bsus4":[
    {nota:"B",oitava:1},
    {nota:"E",oitava:2},
    {nota:"F#",oitava:2},
    {nota:"B",oitava:2}
  ],


  /* =====================================================
     ACORDES COM BEMÓIS
     ===================================================== */

  "Db":[
    {nota:"Db",oitava:1},
    {nota:"F",oitava:1},
    {nota:"Ab",oitava:1}
  ],

  "Dbm":[
    {nota:"Db",oitava:1},
    {nota:"E",oitava:1},
    {nota:"Ab",oitava:1}
  ],

  "Db7":[
    {nota:"Db",oitava:1},
    {nota:"F",oitava:1},
    {nota:"Ab",oitava:1},
    {nota:"Cb",oitava:2}
  ],

  "Dbm7":[
    {nota:"Db",oitava:1},
    {nota:"E",oitava:1},
    {nota:"Ab",oitava:1},
    {nota:"Cb",oitava:2}
  ],

  "Dbsus4":[
    {nota:"Db",oitava:1},
    {nota:"Gb",oitava:1},
    {nota:"Ab",oitava:1}
  ],

  "Eb":[
    {nota:"Eb",oitava:1},
    {nota:"G",oitava:1},
    {nota:"Bb",oitava:1}
  ],

  "Ebm":[
    {nota:"Eb",oitava:1},
    {nota:"Gb",oitava:1},
    {nota:"Bb",oitava:1}
  ],

  "Eb7":[
    {nota:"Eb",oitava:1},
    {nota:"G",oitava:1},
    {nota:"Bb",oitava:1},
    {nota:"Db",oitava:2}
  ],

  "Ebm7":[
    {nota:"Eb",oitava:1},
    {nota:"Gb",oitava:1},
    {nota:"Bb",oitava:1},
    {nota:"Db",oitava:2}
  ],

  "Ebsus4":[
    {nota:"Eb",oitava:1},
    {nota:"Ab",oitava:1},
    {nota:"Bb",oitava:1}
  ],

  "Gb":[
    {nota:"Gb",oitava:1},
    {nota:"Bb",oitava:1},
    {nota:"Db",oitava:2}
  ],

  "Gbm":[
    {nota:"Gb",oitava:1},
    {nota:"A",oitava:1},
    {nota:"Db",oitava:2}
  ],

  "Gb7":[
    {nota:"Gb",oitava:1},
    {nota:"Bb",oitava:1},
    {nota:"Db",oitava:2},
    {nota:"E",oitava:2}
  ],

  "Gbm7":[
    {nota:"Gb",oitava:1},
    {nota:"A",oitava:1},
    {nota:"Db",oitava:2},
    {nota:"E",oitava:2}
  ],

  "Gbsus4":[
    {nota:"Gb",oitava:1},
    {nota:"Cb",oitava:2},
    {nota:"Db",oitava:2}
  ],

  "Ab":[
    {nota:"Ab",oitava:1},
    {nota:"C",oitava:2},
    {nota:"Eb",oitava:2}
  ],

  "Abm":[
    {nota:"Ab",oitava:1},
    {nota:"Cb",oitava:1},
    {nota:"Eb",oitava:2}
  ],

  "Ab7":[
    {nota:"Ab",oitava:1},
    {nota:"C",oitava:2},
    {nota:"Eb",oitava:2},
    {nota:"Gb",oitava:2}
  ],

  "Abm7":[
    {nota:"Ab",oitava:1},
    {nota:"Cb",oitava:2},
    {nota:"Eb",oitava:2},
    {nota:"Gb",oitava:2}
  ],

  "Absus4":[
    {nota:"Ab",oitava:1},
    {nota:"Db",oitava:2},
    {nota:"Eb",oitava:2}
  ],

  "Bb":[
    {nota:"Bb",oitava:1},
    {nota:"D",oitava:2},
    {nota:"F",oitava:2}
  ],

  "Bbm":[
    {nota:"Bb",oitava:1},
    {nota:"Db",oitava:2},
    {nota:"F",oitava:2}
  ],

  "Bb7":[
    {nota:"Bb",oitava:1},
    {nota:"D",oitava:2},
    {nota:"F",oitava:2},
    {nota:"Ab",oitava:2}
  ],

  "Bbm7":[
    {nota:"Bb",oitava:1},
    {nota:"Db",oitava:2},
    {nota:"F",oitava:2},
    {nota:"Ab",oitava:2}
  ],

  "Bbsus4":[
    {nota:"Bb",oitava:1},
    {nota:"Eb",oitava:2},
    {nota:"F",oitava:2}
  ]
};


/* =========================================================
   EQUIVALÊNCIA ENTRE # E b
   ========================================================= */

const ACORDES_EQUIVALENTES = {
  "A#":"Bb",
  "Bb":"A#",

  "C#":"Db",
  "Db":"C#",

  "D#":"Eb",
  "Eb":"D#",

  "F#":"Gb",
  "Gb":"F#",

  "G#":"Ab",
  "Ab":"G#"
};


/* =========================================================
   BUSCAR DESENHO DO ACORDE
   ========================================================= */

function chordNotes(chord){

  if(ACORDES[chord]){
    return ACORDES[chord];
  }

  const match=String(chord||'').match(/^([A-G](?:#|b)?)(.*)$/);

  if(!match){
    return [];
  }

  const root=match[1];
  const suffix=match[2]||'';

  const equivalente=ACORDES_EQUIVALENTES[root];

  if(!equivalente){
    return [];
  }

  const acordeEquivalente=equivalente+suffix;

  return ACORDES[acordeEquivalente] || [];
}


/* =========================================================
   NÚMERO DA NOTA
   ========================================================= */

function noteClass(note){
  return aliases[note]===undefined
    ? null
    : aliases[note];
}


/* =========================================================
   NOME DA FUNDAMENTAL
   ========================================================= */

function chordRootName(chord){
  const m=String(chord||'').match(/^([A-G](?:#|b)?)/);
  return m?m[1]:'';
}


/* =========================================================
   FECHAR POPUP
   ========================================================= */

function closeChordPopup(){

  if(chordPopupState.el){
    chordPopupState.el.remove();
  }

  chordPopupState.el=null;
  chordPopupState.anchor=null;
}


/* =========================================================
   TECLADINHO
   ========================================================= */

function buildMiniKeyboard(notes){

  const wrap=document.createElement('div');

  wrap.className='chord-mini-piano';

  const whiteNotes=[
    ['C',1],['D',1],['E',1],['F',1],
    ['G',1],['A',1],['B',1],

    ['C',2],['D',2],['E',2],['F',2],
    ['G',2],['A',2],['B',2]
  ];

  const isMarked=(note,octave)=>{

    return notes.some(n=>
      noteClass(n.nota)===noteClass(note) &&
      Number(n.oitava)===octave
    );

  };

  whiteNotes.forEach(([note,octave],i)=>{

    const k=document.createElement('button');

    k.type='button';
    k.className='mini-white';

    k.style.left=(i*(100/14))+'%';

    if(isMarked(note,octave)){
      k.classList.add('marked');
    }

    wrap.appendChild(k);

  });


  const blacks=[
    ['C#',1,5.0],
    ['D#',1,12.15],
    ['F#',1,26.43],
    ['G#',1,33.57],
    ['A#',1,40.72],

    ['C#',2,55.0],
    ['D#',2,62.15],
    ['F#',2,76.43],
    ['G#',2,83.57],
    ['A#',2,90.72]
  ];

  blacks.forEach(([note,octave,left])=>{

    const k=document.createElement('button');

    k.type='button';
    k.className='mini-black';

    k.style.left=left+'%';

    if(isMarked(note,octave)){
      k.classList.add('marked');
    }

    wrap.appendChild(k);

  });

  return wrap;
}