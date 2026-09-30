/* =========================================================
   REDE / MAESTRO — HARPA CIFRADA
   Sincronização completa entre Maestro e Participantes.
   ========================================================= */

(function(){

  /* =========================================================
     ELEMENTOS DA INTERFACE
     ========================================================= */

  const btn = document.getElementById('openRooms');
  const overlay = document.getElementById('roomOverlay');
  const close = document.getElementById('closeRooms');
  const create = document.getElementById('createRoom');
  const refresh = document.getElementById('refreshRooms');
  const status = document.getElementById('roomStatus');
  const list = document.getElementById('roomList');

  if(!btn || !overlay){
    console.error('REDE MAESTRO: elementos da sala não encontrados.');
    return;
  }

  /* =========================================================
     ESTADO DA REDE
     ========================================================= */

  let socket = null;
  let currentRoom = null;
  let currentRoomName = null;
  let roomRole = null;

  let applyingRemote = false;

  let remoteScrollTarget = 0;
  let remoteScrollRAF = 0;

  let lastSentSignature = null;
  let stateWatcher = null;
  let currentRoomState = null;

  /* =========================================================
     IDENTIDADE PERSISTENTE DO NAVEGADOR / SESSÃO DA SALA
     ========================================================= */

  const CLIENT_ID_KEY = 'harpa_cliente_id';
  const ROOM_SESSION_KEY = 'harpa_sala_sessao';

  function gerarClientId(){

    if(window.crypto && crypto.randomUUID){
      return crypto.randomUUID();
    }

    return (
      Date.now().toString(36) +
      Math.random().toString(36).slice(2)
    );
  }

  let clientId =
    localStorage.getItem(CLIENT_ID_KEY);

  if(!clientId){
    clientId = gerarClientId();
    localStorage.setItem(CLIENT_ID_KEY, clientId);
  }

  function salvarSessaoSala(roomId, role, token){

    localStorage.setItem(
      ROOM_SESSION_KEY,
      JSON.stringify({
        roomId,
        role,
        token,
        clientId
      })
    );
  }

  function lerSessaoSala(){

    try{

      const raw =
        localStorage.getItem(ROOM_SESSION_KEY);

      if(!raw) return null;

      const sessao = JSON.parse(raw);

      if(
        !sessao ||
        !sessao.roomId ||
        !sessao.role ||
        !sessao.token
      ){
        return null;
      }

      return sessao;

    }catch(error){

      console.error(
        'REDE MAESTRO: erro ao ler sessão:',
        error
      );

      return null;
    }
  }

  function apagarSessaoSala(){

    localStorage.removeItem(
      ROOM_SESSION_KEY
    );
  }

  function escaparHtml(valor){

    return String(valor ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function nomeSalaAtual(){
    return currentRoomName || currentRoom || 'Sala';
  }


  /* =========================================================
     ABRIR / FECHAR SALAS
     ========================================================= */

  function mostrarSalaAtual(){

    if(!currentRoom) return;

    overlay.classList.add('open');
    definirBotoesSala(true);

    const state =
      currentRoomState || getRoomState();

    let tom = '—';

    if(
      state &&
      state.key !== null &&
      state.key !== undefined &&
      typeof chromatic !== 'undefined' &&
      chromatic[Number(state.key) % 12]
    ){

      tom =
        typeof spellNote === 'function'
          ? spellNote(
              chromatic[
                Number(state.key) % 12
              ].name
            )
          : chromatic[
              Number(state.key) % 12
            ].name;
    }

    const papel =
      roomRole === 'maestro'
        ? '👑 Maestro'
        : '🎸 Músico';

    const participantes =
      state && state.participants !== undefined
        ? state.participants
        : 0;

    status.innerHTML = `
      <div style="font-size:20px;font-weight:700;margin-bottom:10px;">
        🌐 ${escaparHtml(nomeSalaAtual())}
      </div>
      <div style="font-size:16px;margin-bottom:6px;">
        ${papel}
        &nbsp;&nbsp;
        🎵 Tom ${tom}
      </div>
      <div style="font-size:15px;margin-bottom:14px;">
        👥 Participantes: ${participantes}
      </div>
    `;

    list.innerHTML = `
      <div style="display:flex;justify-content:center;margin-top:10px;">
        <button
          id="sairDaSala"
          type="button"
          style="
            background:#b3261e;
            color:white;
            border:0;
            border-radius:8px;
            padding:10px 22px;
            font-weight:700;
            cursor:pointer;
          "
        >
          SAIR
        </button>
      </div>
    `;

    const sair =
      document.getElementById('sairDaSala');

    if(sair){
      sair.onclick = mostrarConfirmacaoSaida;
    }
  }

  function mostrarConfirmacaoSaida(){

    status.innerHTML = `
      <div style="font-size:18px;font-weight:700;margin-bottom:10px;">
        Tem certeza que deseja sair da sala?
      </div>
      <div style="font-size:14px;opacity:.8;">
        Sala: ${escaparHtml(nomeSalaAtual())}
      </div>
    `;

    list.innerHTML = `
      <div style="display:flex;justify-content:center;gap:10px;margin-top:15px;">

        <button
          id="confirmarSaida"
          type="button"
          style="
            background:#b3261e;
            color:white;
            border:0;
            border-radius:8px;
            padding:10px 18px;
            font-weight:700;
            cursor:pointer;
          "
        >
          SIM
        </button>

        <button
          id="cancelarSaida"
          type="button"
          style="
            background:#777;
            color:white;
            border:0;
            border-radius:8px;
            padding:10px 18px;
            font-weight:700;
            cursor:pointer;
          "
        >
          CANCELAR
        </button>

      </div>
    `;

    document.getElementById('confirmarSaida')?.addEventListener(
      'click',
      () => {

        if(!currentRoom) return;

        status.textContent =
          'Saindo da sala...';

        socket.emit(
          'leave_room_request',
          {
            roomId: currentRoom
          }
        );
      }
    );

    document.getElementById('cancelarSaida')?.addEventListener(
      'click',
      mostrarSalaAtual
    );
  }

  function definirBotoesSala(naSala){

    if(create){
      create.style.display = naSala ? 'none' : '';
    }

    if(refresh){
      refresh.style.display = naSala ? 'none' : '';
    }

  }


  function openRooms(){

    overlay.classList.add('open');

    definirBotoesSala(!!currentRoom);

    if(currentRoom){
      mostrarSalaAtual();
      return;
    }

    if(socket){
      socket.emit('list_rooms');
    }else{
      status.textContent = 'Servidor não conectado.';
    }
  }

  btn.onclick = openRooms;

  if(close){
    close.onclick = () => {
      overlay.classList.remove('open');
    };
  }

  overlay.onclick = e => {

    if(e.target === overlay){
      overlay.classList.remove('open');
    }

  };


  /* =========================================================
     SOCKET.IO
     ========================================================= */

  if(typeof io !== 'function'){

    console.error(
      'REDE MAESTRO: Socket.IO não foi encontrado.'
    );

    status.textContent =
      'Socket.IO não foi carregado.';

    return;
  }

  socket = io();


  /* =========================================================
     FUNÇÕES BÁSICAS
     ========================================================= */

  function isMaestro(){

    return (
      roomRole === 'maestro' &&
      !!currentRoom
    );

  }


  /* =========================================================
     CAPTURA O ESTADO ATUAL DA HARPA
     ========================================================= */

  function getRoomState(){

    return {

      roomId: currentRoom,

      roomName: currentRoomName || currentRoom,

      songId:
        typeof currentSongId !== 'undefined'
          ? currentSongId
          : null,

      key:
        typeof currentIndex !== 'undefined'
          ? currentIndex
          : 0,

      playing:
        typeof autoScrollRunning !== 'undefined'
          ? !!autoScrollRunning
          : false,

      position:
        window.scrollY || 0,

      fontSize:
        typeof fontScale !== 'undefined'
          ? fontScale
          : 18,

      speed:
        typeof autoScrollSpeedLevel !== 'undefined'
          ? autoScrollSpeedLevel
          : 0,

      sectionsHidden:
        typeof sectionsHidden !== 'undefined'
          ? !!sectionsHidden
          : false,

      progressionMode:
        typeof progressionMode !== 'undefined'
          ? !!progressionMode
          : false,

      inlineMode:
        typeof inlineMode !== 'undefined'
          ? !!inlineMode
          : false,

      splitMode:
	          typeof splitMode !== 'undefined'
          ? !!splitMode
          : false,

      autoScrollMode:
        typeof autoScrollMode !== 'undefined'
          ? !!autoScrollMode
          : false,

      notesHidden:
        !!document
          .getElementById('tonePanel')
          ?.classList.contains('hidden')

    };
  }


  /* =========================================================
     ASSINATURA DO ESTADO
     ========================================================= */

  function getStateSignature(){

    const state = getRoomState();

    return JSON.stringify(state);
  }


  /* =========================================================
     ENVIA ESTADO PARA O SERVIDOR
     ========================================================= */

  function sendRoomState(force = false){

    if(!isMaestro()) return;

    if(applyingRemote) return;

    const state = getRoomState();

    const signature =
      JSON.stringify(state);

    if(
      !force &&
      signature === lastSentSignature
    ){
      return;
    }

    lastSentSignature =
      signature;

    socket.emit(
      'maestro_update',
      state
    );
  }


  /* =========================================================
     OBSERVADOR AUTOMÁTICO DO MAESTRO
     ========================================================= */

  function iniciarObservadorMaestro(){

    if(stateWatcher){

      clearInterval(
        stateWatcher
      );

      stateWatcher = null;
    }

    stateWatcher =
      setInterval(() => {

        if(!isMaestro()) return;

        sendRoomState(false);

      }, 80);

  }


  /* =========================================================
     TOPO DA SALA
     ========================================================= */

  function updateRoomTop(state){

    if(!state) return;

    const topKey =
      document.getElementById('roomTopKey');

    const topCount =
      document.getElementById('roomTopCount');

    if(topKey){

      topKey.textContent =
        Number.isInteger(
          Number(state.key)
        )
          ? spellNote(
              chromatic[
                Number(state.key) % 12
              ].name
            )
          : (
              state.key || '—'
            );

    }

    if(
      topCount &&
      state.participants !== undefined
    ){

      topCount.textContent =
        state.participants;

    }

  }


  /* =========================================================
     ROLAGEM SUAVE DO PARTICIPANTE
     ========================================================= */

  function iniciarSincronizacaoSuave(){

    if(
      roomRole !== 'participante'
    ){
      return;
    }

    if(remoteScrollRAF){
      return;
    }


    function frame(){

      remoteScrollRAF = 0;

      if(
        roomRole !== 'participante' ||
        !currentRoom
      ){

        return;
      }


      const atual =
        window.scrollY || 0;

      const diferenca =
        remoteScrollTarget -
        atual;


      if(
        Math.abs(diferenca) < 0.5
      ){

        window.scrollTo(
          0,
          remoteScrollTarget
        );

        return;
      }


      /*
        Aproximação suave da posição do Maestro.
      */

      const passo =
        diferenca * 0.35;


      window.scrollTo(
        0,
        atual + passo
      );


      remoteScrollRAF =
        requestAnimationFrame(
          frame
        );

    }


    remoteScrollRAF =
      requestAnimationFrame(
        frame
      );

  }


  /* =========================================================
     APLICA ESTADO RECEBIDO DO MAESTRO
     ========================================================= */

  let lastRemoteStructural = null;


  function aplicarNotesHidden(hidden){

    const tonePanel =
      document.getElementById('tonePanel');

    if(!tonePanel) return;

    const desejado =
      !!hidden;

    const atual =
      tonePanel.classList.contains(
        'hidden'
      );

    if(atual === desejado) return;

    const ids = [
      'down',
      'up',
      'reset',
      'fontDown',
      'fontUp',
      'tonePanel'
    ];

    ids.forEach(id => {

      const el =
        document.getElementById(id);

      if(el){

        el.classList.toggle(
          'ocultado',
          desejado
        );

      }

    });

    tonePanel.classList.toggle(
      'hidden',
      desejado
    );

    const notesButton =
      document.getElementById(
        'toggleNotes'
      );

    if(notesButton){

      notesButton.textContent =
        desejado
          ? '🔻'
          : '🔺';

    }

  }


  function applyRemoteState(state){

    if(!state) return;

    if(
      state.roomId !== currentRoom
    ){
      return;
    }


    currentRoomState =
      state;


    const nextSongId =
      String(
        state.songId ||
        currentSongId
      );


    const nextKey =
      Number(state.key);


    const nextFont =
      Number(state.fontSize);


    const nextSpeed =
      Number.isFinite(
        Number(state.speed)
      )
        ? Math.max(
            -5,
            Math.min(
              5,
              Number(state.speed)
            )
          )
        : autoScrollSpeedLevel;


    /* =====================================================
       ESTADO ESTRUTURAL
       ===================================================== */

    const structural =
      JSON.stringify({

        songId:
          nextSongId,

        key:
          Number.isFinite(nextKey)
            ? nextKey
            : null,

        font:
          nextFont,

        sectionsHidden:
          !!state.sectionsHidden,

        progressionMode:
          !!state.progressionMode,

        inlineMode:
          !!state.inlineMode,

        splitMode:
          !!state.splitMode,

        speed:
          nextSpeed,

        autoScrollMode:
          !!state.autoScrollMode,

        notesHidden:
          !!state.notesHidden

      });


    const structuralChanged =
      structural !==
      lastRemoteStructural;


    const playing =
      !!state.playing;


    applyingRemote = true;


    try{

      /* =====================================================
         ALTERAÇÕES VISUAIS / ESTRUTURAIS
         ===================================================== */

      if(structuralChanged){

        const songChanged =
          nextSongId !==
          currentSongId;


        /* TROCA DE HINO */

        if(songChanged){

          if(
            typeof resetAutoScrollForNewSong ===
            'function'
          ){

            resetAutoScrollForNewSong();

          }


          currentSongId =
            nextSongId;


          currentIndex =
            getSongStartIndex(
              currentSongId
            );


          localStorage.setItem(
            'harpa_current_song',
            currentSongId
          );

        }


        /* TOM */

        if(
          Number.isFinite(nextKey) &&
          nextKey >= 0 &&
          nextKey < 12
        ){

          currentIndex =
            nextKey;

        }


        /* TAMANHO DA FONTE */

        if(
          Number.isFinite(nextFont)
        ){

          fontScale =
            Math.max(
              MIN_FONT_SCALE,
              Math.min(
                MAX_FONT_SCALE,
                nextFont
              )
            );

        }


        /* MODOS */

        sectionsHidden =
          !!state.sectionsHidden;


        progressionMode =
          !!state.progressionMode;


        inlineMode =
          !!state.inlineMode;


        splitMode =
          !!state.splitMode;


        autoScrollSpeedLevel =
          nextSpeed;


        autoScrollMode =
          !!state.autoScrollMode;


        aplicarNotesHidden(
          state.notesHidden
        );


        /* APLICA TUDO */

        if(
          typeof applyFontScale ===
          'function'
        ){

          applyFontScale();

        }


        if(
          typeof render ===
          'function'
        ){

          render();

        }


        if(
          typeof updateAutoScrollPanel ===
          'function'
        ){

          updateAutoScrollPanel();

        }


        if(
          typeof renderLibrary ===
          'function'
        ){

          renderLibrary();

        }


        lastRemoteStructural =
          structural;

      }


      /* =====================================================
         POSIÇÃO / PLAY / PAUSA
         ===================================================== */

      const targetY =
        Math.max(
          0,
          Number(state.position) || 0
        );


      remoteScrollTarget =
        targetY;


      /*
        O participante NÃO cria uma rolagem independente.

        Ele simplesmente acompanha o Maestro.
      */

      if(playing){

        /*
          Se estava em uma rolagem local,
          paramos para não haver dois motores
          brigando pela posição.
        */

        if(
          typeof autoScrollRunning !==
          'undefined' &&
          autoScrollRunning
        ){

          if(
            typeof stopAutoScroll ===
            'function'
          ){

            stopAutoScroll();

          }

        }


        /*
          O Maestro está em PLAY.
          O participante acompanha.
        */

        iniciarSincronizacaoSuave();

      }else{

        /* PAUSA */

        if(
          typeof autoScrollRunning !==
          'undefined' &&
          autoScrollRunning
        ){

          if(
            typeof stopAutoScroll ===
            'function'
          ){

            stopAutoScroll();

          }

        }


        if(
          typeof autoScrollMode !==
          'undefined'
        ){

          autoScrollMode =
            !!state.autoScrollMode;

        }


        if(
          typeof autoScrollResumeY !==
          'undefined'
        ){

          autoScrollResumeY =
            targetY;

        }


        if(
          typeof updateAutoScrollPanel ===
          'function'
        ){

          updateAutoScrollPanel();

        }


        /*
          Leva suavemente para a posição
          exata onde o Maestro parou.
        */

        iniciarSincronizacaoSuave();

      }


      updateRoomTop(
        state
      );


    }catch(error){

      console.error(
        'REDE MAESTRO: erro ao aplicar estado remoto:',
        error
      );

    }finally{

      setTimeout(() => {

        applyingRemote = false;

      }, 0);

    }

  }


  /* =========================================================
     BLOQUEIO DOS CONTROLES DO PARTICIPANTE
     ========================================================= */

  function aplicarBloqueioParticipante(){

    const participante =
      roomRole === 'participante' &&
      !!currentRoom;


    const permitidos = new Set([
      'openRooms',
      'closeRooms',
      'refreshRooms',
      'createRoom'
    ]);


    document
      .querySelectorAll(
        'button, input, select, textarea'
      )
      .forEach(el => {

        if(
          permitidos.has(el.id) ||
          el.closest('#roomOverlay')
        ){

          el.disabled = false;
          return;

        }


        el.disabled =
          participante;


        if(participante){

          el.dataset.bloqueadoPelaSala =
            '1';

        }else{

          delete el.dataset.bloqueadoPelaSala;

        }

      });


    document.body.classList.toggle(
      'participante-bloqueado',
      participante
    );

  }


  /* =========================================================
     OBSERVA ELEMENTOS CRIADOS DINAMICAMENTE
     ========================================================= */

  const observer =
    new MutationObserver(() => {

      if(
        roomRole === 'participante'
      ){

        aplicarBloqueioParticipante();

      }

    });


  observer.observe(
    document.body,
    {
      childList: true,
      subtree: true
    }
  );


  /* =========================================================
     BLOQUEIO ABSOLUTO DE CLIQUES
     ========================================================= */

  document.addEventListener(
    'click',
    e => {

      if(
        roomRole !== 'participante' ||
        !currentRoom
      ){

        return;
      }


      const el =
        e.target.closest?.(
          'button, input, select, textarea, .song-open'
        );


      if(!el) return;


      if(
        el.id === 'openRooms' ||
        el.closest('#roomOverlay')
      ){

        return;

      }


      e.preventDefault();
      e.stopPropagation();

    },
    true
  );
    /* =========================================================
     BLOQUEIO DE INPUT / CHANGE
     ========================================================= */

  document.addEventListener(
    'input',
    e => {

      if(
        roomRole !== 'participante' ||
        !currentRoom
      ){

        return;
      }


      if(
        e.target.closest?.(
          '#roomOverlay'
        )
      ){

        return;

      }


      e.preventDefault();
      e.stopPropagation();

    },
    true
  );


  document.addEventListener(
    'change',
    e => {

      if(
        roomRole !== 'participante' ||
        !currentRoom
      ){

        return;
      }


      if(
        e.target.closest?.(
          '#roomOverlay'
        )
      ){

        return;

      }


      e.preventDefault();
      e.stopPropagation();

    },
    true
  );


  /* =========================================================
     SOCKET — CONECTADO
     ========================================================= */

  socket.on(
    'connect',
    () => {

      const sessao =
        lerSessaoSala();

      /*
        Se existe uma sessão salva,
        tenta recuperar a sala.
      */

      if(sessao){

        status.textContent =
          'Reconectando à sala ' +
          sessao.roomId +
          '...';


        socket.emit(
          'resume_room',
          {
            roomId:
              sessao.roomId,

            role:
              sessao.role,

            token:
              sessao.token,

            clientId:
              clientId
          }
        );

        return;
      }


      status.textContent =
        'Servidor conectado. Crie uma sala ou entre em uma sala aberta.';

    }
  );


  /* =========================================================
     ERRO DE CONEXÃO
     ========================================================= */

  socket.on(
    'connect_error',
    () => {

      status.textContent =
        'Não foi possível conectar ao servidor.';

    }
  );


  /* =========================================================
     CRIAR SALA
     ========================================================= */

  if(create){

    create.onclick = () => {

      /*
        Segurança extra:
        se já estiver em uma sala,
        não cria outra.
      */

      if(currentRoom){

        mostrarSalaAtual();
        return;

      }


      const nomeDigitado = window.prompt(
        'Nome da sala\n\nDeixe vazio para usar o nome automático (Grupo-00X):'
      );

      if(nomeDigitado === null){
        return;
      }

      const roomName = nomeDigitado.trim();

      status.textContent =
        'Criando sala...';

      socket.emit(
        'create_room',
        {
          clientId:
            clientId,
          roomName:
            roomName
        }
      );

    };

  }


  /* =========================================================
     ATUALIZAR LISTA
     ========================================================= */

  if(refresh){

    refresh.onclick = () => {

      if(currentRoom){

        mostrarSalaAtual();
        return;

      }


      socket.emit(
        'list_rooms'
      );


      status.textContent =
        'Atualizando salas...';

    };

  }


  /* =========================================================
     SALA CRIADA
     ========================================================= */

  socket.on(
    'room_created',
    data => {

      currentRoom =
        data.roomId;

      currentRoomName =
        (data.state && data.state.roomName) ||
        data.roomName ||
        data.roomId;


      roomRole =
        'maestro';


      currentRoomState =
        data.state;


      salvarSessaoSala(
        data.roomId,
        'maestro',
        data.adminToken
      );


      document.getElementById(
        'roomTopId'
      ).textContent =
        currentRoomName;


      document.getElementById(
        'roomTopRole'
      ).textContent =
        '👑 Maestro';


      document.getElementById(
        'roomTopbar'
      ).classList.add(
        'active'
      );


      status.textContent =
        'Sala ' +
        data.roomId +
        ' criada. Você é o Maestro.';


      definirBotoesSala(true);


      overlay.classList.remove(
        'open'
      );


      aplicarBloqueioParticipante();


      /*
        Envia o estado atual da Harpa
        imediatamente.
      */

      sendRoomState(true);


      /*
        Começa a observar automaticamente
        as alterações do Maestro.
      */

      iniciarObservadorMaestro();

    }
  );


  /* =========================================================
     LISTA DE SALAS
     ========================================================= */

  socket.on(
    'rooms_list',
    rooms => {

      /*
        Se já está em uma sala,
        nunca mostra a lista.
      */

      if(currentRoom){

        mostrarSalaAtual();
        return;

      }


      definirBotoesSala(false);


      if(!rooms.length){

        list.innerHTML =
          '<div class="room-status">Nenhuma sala aberta.</div>';

        return;

      }


      list.innerHTML =
        rooms.map(r => `

          <div class="room-item">

            <div>

              <b>🌐 ${escaparHtml(r.roomName || r.roomId)}</b>

              <small>
                👥 ${r.participants}
                · 🎵 Tom:
                ${
                  r.key === null ||
                  r.key === undefined
                    ? '—'
                    : r.key
                }
              </small>

            </div>

            <button
              data-room="${r.roomId}"
            >
              ENTRAR
            </button>

          </div>

        `).join('');


      list
        .querySelectorAll(
          '[data-room]'
        )
        .forEach(b => {

          b.onclick = () => {

            /*
              Se já entrou em alguma sala,
              não pode entrar em outra.
            */

            if(currentRoom){

              mostrarSalaAtual();
              return;

            }


            socket.emit(
              'join_room_request',
              {
                roomId:
                  b.dataset.room,

                clientId:
                  clientId
              }
            );


            status.textContent =
              'Entrando...';

          };

        });

    }
  );


  /* =========================================================
     PARTICIPANTE ENTROU
     ========================================================= */

  socket.on(
    'room_joined',
    data => {

      currentRoom =
        data.roomId;

      currentRoomName =
        (data.state && data.state.roomName) ||
        data.roomName ||
        data.roomId;


      roomRole =
        'participante';


      currentRoomState =
        data.state;


      salvarSessaoSala(
        data.roomId,
        'participante',
        data.roomToken
      );


      document.getElementById(
        'roomTopId'
      ).textContent =
        currentRoomName;


      document.getElementById(
        'roomTopRole'
      ).textContent =
        '🎸 Músico';


      document.getElementById(
        'roomTopbar'
      ).classList.add(
        'active'
      );


      definirBotoesSala(true);


      overlay.classList.remove(
        'open'
      );


      /*
        Primeiro bloqueia os controles.
      */

      aplicarBloqueioParticipante();


      /*
        Depois aplica o estado do Maestro.
      */

      applyRemoteState(
        data.state
      );

    }
  );


  /* =========================================================
     PRESENÇA
     ========================================================= */

  socket.on(
    'room_presence',
    data => {

      if(
        data.roomId === currentRoom
      ){

        const topCount =
          document.getElementById(
            'roomTopCount'
          );

        if(topCount){

          topCount.textContent =
            data.participants;

        }


        if(currentRoomState){

          currentRoomState.participants =
            data.participants;

        }


        if(
          overlay.classList.contains('open') &&
          currentRoom
        ){

          mostrarSalaAtual();

        }

      }

    }
  );


  /* =========================================================
     ESTADO DO MAESTRO
     ========================================================= */

  socket.on(
    'maestro_state',
    state => {

      if(
        state.roomId !== currentRoom
      ){

        return;

      }


      currentRoomState =
        state;


      if(
        roomRole === 'participante'
      ){

        applyRemoteState(
          state
        );

      }


      updateRoomTop(
        state
      );

    }
  );


  /* =========================================================
     SALA RECUPERADA APÓS F5
     ========================================================= */

  socket.on(
    'room_resumed',
    data => {

      currentRoom =
        data.roomId;

      currentRoomName =
        (data.state && data.state.roomName) ||
        data.roomName ||
        data.roomId;


      roomRole =
        data.role;


      currentRoomState =
        data.state;


      document.getElementById(
        'roomTopId'
      ).textContent =
        currentRoomName;


      document.getElementById(
        'roomTopRole'
      ).textContent =
        data.role === 'maestro'
          ? '👑 Maestro'
          : '🎸 Músico';


      document.getElementById(
        'roomTopbar'
      ).classList.add(
        'active'
      );


      definirBotoesSala(true);


      aplicarBloqueioParticipante();


      if(
        data.role === 'participante'
      ){

        applyRemoteState(
          data.state
        );

      }else{

        /*
          O Maestro recuperou a sala.
          Continua sendo Maestro.
        */

        sendRoomState(true);

        iniciarObservadorMaestro();

      }


      status.textContent =
        'Sala ' +
        data.roomId +
        ' recuperada.';

    }
  );
    /* =========================================================
     FALHA AO RECUPERAR SALA
     ========================================================= */

  socket.on(
    'resume_error',
    data => {

      apagarSessaoSala();


      currentRoom =
        null;


      roomRole =
        null;


      currentRoomState =
        null;


      lastSentSignature =
        null;


      lastRemoteStructural =
        null;


      if(stateWatcher){

        clearInterval(
          stateWatcher
        );

        stateWatcher =
          null;

      }


      document.getElementById(
        'roomTopbar'
      ).classList.remove(
        'active'
      );


      aplicarBloqueioParticipante();
      definirBotoesSala(false);


      status.textContent =
        data.message ||
        'A sala não está mais disponível.';

    }
  );


  /* =========================================================
     ERRO DA SALA
     ========================================================= */

  socket.on(
    'room_error',
    data => {

      status.textContent =
        data.message ||
        'Erro na sala.';

    }
  );


  /* =========================================================
     SAÍDA CONFIRMADA
     ========================================================= */

  socket.on(
    'room_left',
    data => {

      apagarSessaoSala();


      const mensagem =
        data?.message ||
        'Você saiu da sala.';


      currentRoom =
        null;


      roomRole =
        null;


      currentRoomState =
        null;


      lastSentSignature =
        null;


      lastRemoteStructural =
        null;


      if(stateWatcher){

        clearInterval(
          stateWatcher
        );

        stateWatcher =
          null;

      }


      document.getElementById(
        'roomTopbar'
      ).classList.remove(
        'active'
      );


      aplicarBloqueioParticipante();
      definirBotoesSala(false);


      overlay.classList.remove(
        'open'
      );


      status.textContent =
        mensagem;

    }
  );


  /* =========================================================
     SALA ENCERRADA
     ========================================================= */

  socket.on(
    'room_closed',
    data => {

      apagarSessaoSala();


      document.getElementById(
        'roomTopbar'
      ).classList.remove(
        'active'
      );


      currentRoom =
        null;


      roomRole =
        null;


      currentRoomState =
        null;


      lastSentSignature =
        null;


      lastRemoteStructural =
        null;


      if(stateWatcher){

        clearInterval(
          stateWatcher
        );

        stateWatcher =
          null;

      }


      aplicarBloqueioParticipante();
      definirBotoesSala(false);


      overlay.classList.remove(
        'open'
      );


      status.textContent =
        data.message ||
        'Sala encerrada.';

    }
  );


})();
