# Backend — Harpa Cifrada / Salas Maestro

Base de tempo real para o modo 🌐 Salas / Maestro.

## Funcionalidades
- Cria Grupo-001, Grupo-002...
- Quem cria é o Maestro.
- Participantes podem entrar.
- O estado da sala é compartilhado em tempo real.
- O Maestro controla música, tom, play/pause, posição, fonte e velocidade.
- Participantes não podem alterar o estado.
- Ao sair o Maestro, a sala é encerrada.

## Instalação
```bash
pip install -r requirements.txt
python app.py
```

Depois abra:
`http://localhost:5000`

## Eventos principais

Criar:
```js
socket.emit("create_room");
```

Listar:
```js
socket.emit("list_rooms");
```

Entrar:
```js
socket.emit("join_room_request", {roomId:"Grupo-001"});
```

Alterar pelo Maestro:
```js
socket.emit("maestro_update", {
  roomId:"Grupo-001",
  songId:"200",
  key:"F",
  playing:true,
  position:42.5,
  fontSize:20,
  speed:1.2
});
```

Eventos recebidos:
`room_created`, `rooms_list`, `room_joined`, `maestro_state`,
`room_presence`, `room_error`, `room_closed`.

A próxima etapa é conectar este backend ao `index.html`.
