import os
import time
import secrets
from threading import Lock

from flask import Flask, jsonify, send_from_directory, request
from flask_socketio import SocketIO, emit, join_room, leave_room


# =========================================================
# CONFIGURAÇÃO
# =========================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(
    __name__,
    static_folder=".",
    static_url_path=""
)

app.config["SECRET_KEY"] = os.environ.get(
    "SECRET_KEY",
    secrets.token_hex(32)
)

socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    async_mode="threading"
)


# =========================================================
# SALAS
# =========================================================

rooms = {}
rooms_lock = Lock()

# Tempo de tolerância para F5 / reconexão
RECONNECT_GRACE_SECONDS = 30


# =========================================================
# GERAR NÚMERO DA SALA
# =========================================================

def make_room_id():

    """
    Usa sempre o primeiro número de sala disponível.

    Exemplo:

    Grupo-001 existe
    Grupo-002 existe
    Grupo-003 está livre

    próxima sala = Grupo-003
    """

    with rooms_lock:

        number = 1

        while True:

            room_id = f"Grupo-{number:03d}"

            if room_id not in rooms:
                return room_id

            number += 1


# =========================================================
# PROCURAR SALA DO CLIENTE
# =========================================================

def find_client_room(client_id):

    """
    Verifica se este navegador já pertence a alguma sala.
    """

    if not client_id:
        return None, None

    with rooms_lock:

        for room_id, room in rooms.items():

            # É o Maestro?
            if room["admin_client_id"] == client_id:

                return room_id, "maestro"

            # É participante?
            if client_id in room["participants"]:

                return room_id, "participante"

    return None, None


# =========================================================
# CONTAGEM DE PARTICIPANTES
# =========================================================

def participant_count(room):

    return len(
        room["participants"]
    )


# =========================================================
# SNAPSHOT DA SALA
# =========================================================

def snapshot(room):

    state = dict(
        room["state"]
    )

    state["roomId"] = room["roomId"]

    state["roomName"] = room.get("roomName", room["roomId"])

    state["participants"] = participant_count(
        room
    )

    return state


# =========================================================
# LIMPEZA APÓS DESCONEXÃO
# =========================================================

def cleanup_after_disconnect(room_id):

    """
    Aguarda alguns segundos antes de considerar
    que a desconexão foi definitiva.

    Isso permite:

        F5
        ↓
        desconecta
        ↓
        reconecta
        ↓
        continua na sala
    """

    socketio.sleep(
        RECONNECT_GRACE_SECONDS
    )

    with rooms_lock:

        room = rooms.get(
            room_id
        )

        if not room:
            return

        # -------------------------------------------------
        # O MAESTRO VOLTOU?
        # -------------------------------------------------

        if room["admin_sid"] is not None:

            # O Maestro voltou.
            # Não encerra a sala.
            pass

        else:

            # -------------------------------------------------
            # MAESTRO NÃO VOLTOU
            # -------------------------------------------------

            rooms.pop(
                room_id,
                None
            )

            room_closed = True

            # Como removemos a sala dentro do lock,
            # saímos daqui depois.

            socketio.emit(
                "room_closed",
                {
                    "roomId":
                        room_id,

                    "message":
                        "A sala foi encerrada porque o Maestro não reconectou."
                },
                to=room_id
            )

            return


        # -------------------------------------------------
        # REMOVER PARTICIPANTES QUE NÃO RECONECTARAM
        # -------------------------------------------------

        removed = False

        disconnected_clients = []

        for client_id, member in room["participants"].items():

            if member["sid"] is None:

                disconnected_clients.append(
                    client_id
                )

        for client_id in disconnected_clients:

            room["participants"].pop(
                client_id,
                None
            )

            removed = True


        count = participant_count(
            room
        )

        current_state = snapshot(
            room
        )


    # -----------------------------------------------------
    # ATUALIZAR PARTICIPANTES
    # -----------------------------------------------------

    if removed:

        socketio.emit(
            "room_presence",
            {
                "roomId":
                    room_id,

                "participants":
                    count
            },
            to=room_id
        )


# =========================================================
# PÁGINA PRINCIPAL
# =========================================================

@app.get("/")
def home():

    return send_from_directory(
        BASE_DIR,
        "index.html"
    )


# =========================================================
# LISTAR SALAS - HTTP
# =========================================================

@app.get("/api/rooms")
def list_rooms_http():

    with rooms_lock:

        data = []

        for room in rooms.values():

            data.append(
                {
                    "roomId":
                        room["roomId"],

                    "roomName":
                        room.get("roomName", room["roomId"]),

                    "participants":
                        participant_count(room),

                    "songId":
                        room["state"]["songId"],

                    "key":
                        room["state"]["key"],

                    "playing":
                        room["state"]["playing"]
                }
            )

    return jsonify(
        data
    )


# =========================================================
# CONSULTAR SALA - HTTP
# =========================================================

@app.get("/api/rooms/<room_id>")
def get_room_http(room_id):

    with rooms_lock:

        room = rooms.get(
            room_id
        )

    if not room:

        return jsonify(
            {
                "error":
                    "Sala não encontrada."
            }
        ), 404

    return jsonify(
        snapshot(room)
    )


# =========================================================
# CRIAR SALA
# =========================================================

@socketio.on("create_room")
def create_room(data=None):

    data = data or {}

    client_id = str(
        data.get(
            "clientId",
            ""
        )
    ).strip()

    room_name = str(
        data.get(
            "roomName",
            ""
        )
    ).strip()

    if len(room_name) > 50:
        room_name = room_name[:50].rstrip()

    # -----------------------------------------------------
    # CLIENTE PRECISA TER IDENTIDADE
    # -----------------------------------------------------

    if not client_id:

        emit(
            "room_error",
            {
                "message":
                    "Identidade do navegador não encontrada."
            }
        )

        return


    # -----------------------------------------------------
    # VERIFICAR SE JÁ ESTÁ EM UMA SALA
    # -----------------------------------------------------

    existing_room, existing_role = find_client_room(
        client_id
    )

    if existing_room:

        emit(
            "room_error",
            {
                "message":
                    f"Você já está na sala {existing_room}. "
                    f"Saia dela antes de criar outra."
            }
        )

        return


    # -----------------------------------------------------
    # GERAR SALA
    # -----------------------------------------------------

    room_id = make_room_id()

    if not room_name:
        room_name = room_id

    admin_token = secrets.token_urlsafe(
        24
    )


    # -----------------------------------------------------
    # CRIAR OBJETO DA SALA
    # -----------------------------------------------------

    room = {

        "roomId":
            room_id,

        "roomName":
            room_name,

        "admin_sid":
            request.sid,

        "admin_client_id":
            client_id,

        "admin_token":
            admin_token,

        "participants":
            {},

        "state":
            {

                "songId":
                    "001",

                "key":
                    None,

                "playing":
                    False,

                "position":
                    0,

                "fontSize":
                    18,

                "speed":
                    0,

                "sectionsHidden":
                    True,

                "progressionMode":
                    False,

                "inlineMode":
                    False,

                "splitMode":
                    False,

                "autoScrollMode":
                    False,

                "notesHidden":
                    False,

                "updatedAt":
                    time.time()
            }
    }


    with rooms_lock:

        rooms[room_id] = room


    join_room(
        room_id
    )


    emit(
        "room_created",
        {
            "roomId":
                room_id,

            "roomName":
                room_name,

            "role":
                "maestro",

            "adminToken":
                admin_token,

            "state":
                snapshot(room)
        }
    )


# =========================================================
# LISTAR SALAS - SOCKET
# =========================================================

@socketio.on("list_rooms")
def list_rooms():

    with rooms_lock:

        data = []

        for room in rooms.values():

            data.append(
                {
                    "roomId":
                        room["roomId"],

                    "roomName":
                        room.get("roomName", room["roomId"]),

                    "participants":
                        participant_count(room),

                    "songId":
                        room["state"]["songId"],

                    "key":
                        room["state"]["key"],

                    "playing":
                        room["state"]["playing"]
                }
            )


    emit(
        "rooms_list",
        data
    )


# =========================================================
# ENTRAR EM UMA SALA
# =========================================================

@socketio.on("join_room_request")
def join_room_request(data):

    data = data or {}

    room_id = str(
        data.get(
            "roomId",
            ""
        )
    ).strip()

    client_id = str(
        data.get(
            "clientId",
            ""
        )
    ).strip()


    # -----------------------------------------------------
    # VALIDAR CLIENTE
    # -----------------------------------------------------

    if not client_id:

        emit(
            "room_error",
            {
                "message":
                    "Identidade do navegador não encontrada."
            }
        )

        return


    # -----------------------------------------------------
    # VERIFICAR SE JÁ ESTÁ EM UMA SALA
    # -----------------------------------------------------

    existing_room, existing_role = find_client_room(
        client_id
    )

    if existing_room:

        emit(
            "room_error",
            {
                "message":
                    f"Você já está na sala {existing_room}. "
                    f"Saia dela antes de entrar em outra."
            }
        )

        return


    # -----------------------------------------------------
    # PROCURAR SALA
    # -----------------------------------------------------

    with rooms_lock:

        room = rooms.get(
            room_id
        )


    if not room:

        emit(
            "room_error",
            {
                "message":
                    "Essa sala não existe ou foi encerrada."
            }
        )

        return


    # -----------------------------------------------------
    # GERAR TOKEN DO PARTICIPANTE
    # -----------------------------------------------------

    participant_token = secrets.token_urlsafe(
        24
    )


    # -----------------------------------------------------
    # REGISTRAR PARTICIPANTE
    # -----------------------------------------------------

    with rooms_lock:

        room["participants"][client_id] = {

            "sid":
                request.sid,

            "token":
                participant_token,

            "connected_at":
                time.time()
        }

        state = snapshot(
            room
        )


    join_room(
        room_id
    )


    emit(
        "room_joined",
        {

            "roomId":
                room_id,

            "roomName":
                room.get("roomName", room_id),

            "role":
                "participante",

            "roomToken":
                participant_token,

            "clientId":
                client_id,

            "state":
                state
        }
    )


    socketio.emit(
        "room_presence",
        {

            "roomId":
                room_id,

            "participants":
                state["participants"]

        },
        to=room_id
    )


# =========================================================
# RECUPERAR SALA DEPOIS DO F5
# =========================================================

@socketio.on("resume_room")
def resume_room(data):

    data = data or {}

    room_id = str(
        data.get(
            "roomId",
            ""
        )
    ).strip()

    client_id = str(
        data.get(
            "clientId",
            ""
        )
    ).strip()

    role = str(
        data.get(
            "role",
            ""
        )
    ).strip()

    token = str(
        data.get(
            "token",
            ""
        )
    ).strip()


    # -----------------------------------------------------
    # VALIDAR DADOS
    # -----------------------------------------------------

    if not room_id or not client_id or not token:

        emit(
            "resume_error",
            {
                "message":
                    "Sessão da sala inválida."
            }
        )

        return


    # -----------------------------------------------------
    # PROCURAR SALA
    # -----------------------------------------------------

    with rooms_lock:

        room = rooms.get(
            room_id
        )


    if not room:

        emit(
            "resume_error",
            {
                "message":
                    "A sala não existe mais."
            }
        )

        return


    # =====================================================
    # RECUPERAR COMO MAESTRO
    # =====================================================

    if role == "maestro":

        valid = (

            room["admin_client_id"]
            == client_id

            and

            room["admin_token"]
            == token

        )


        if not valid:

            emit(
                "resume_error",
                {
                    "message":
                        "A sessão do Maestro não pôde ser recuperada."
                }
            )

            return


        with rooms_lock:

            room["admin_sid"] = request.sid

            state = snapshot(
                room
            )


        join_room(
            room_id
        )


        emit(
            "room_resumed",
            {

                "roomId":
                    room_id,

                "roomName":
                    room_name,

                "role":
                    "maestro",

                "state":
                    state

            }
        )

        return


    # =====================================================
    # RECUPERAR COMO PARTICIPANTE
    # =====================================================

    if role == "participante":

        with rooms_lock:

            member = room["participants"].get(
                client_id
            )


        if not member:

            emit(
                "resume_error",
                {
                    "message":
                        "Sua participação nessa sala expirou."
                }
            )

            return


        valid = (
            member["token"]
            == token
        )


        if not valid:

            emit(
                "resume_error",
                {
                    "message":
                        "A sessão do participante não pôde ser recuperada."
                }
            )

            return


        with rooms_lock:

            member["sid"] = request.sid

            member["connected_at"] = time.time()

            state = snapshot(
                room
            )


        join_room(
            room_id
        )


        emit(
            "room_resumed",
            {

                "roomId":
                    room_id,

                "roomName":
                    room.get("roomName", room_id),

                "role":
                    "participante",

                "state":
                    state

            }
        )


        socketio.emit(
            "room_presence",
            {

                "roomId":
                    room_id,

                "participants":
                    state["participants"]

            },
            to=room_id
        )

        return


    # -----------------------------------------------------
    # PAPEL INVÁLIDO
    # -----------------------------------------------------

    emit(
        "resume_error",
        {
            "message":
                "Tipo de sessão inválido."
        }
    )


# =========================================================
# ATUALIZAÇÃO DO MAESTRO
# =========================================================

@socketio.on("maestro_update")
def maestro_update(data):

    data = data or {}

    room_id = str(
        data.get(
            "roomId",
            ""
        )
    ).strip()


    with rooms_lock:

        room = rooms.get(
            room_id
        )


    if not room:

        emit(
            "room_error",
            {
                "message":
                    "Sala não encontrada."
            }
        )

        return


    # -----------------------------------------------------
    # SOMENTE O MAESTRO
    # -----------------------------------------------------

    if room["admin_sid"] != request.sid:

        emit(
            "room_error",
            {
                "message":
                    "Somente o Maestro pode alterar a sala."
            }
        )

        return


    allowed = {

        "songId",
        "key",
        "playing",
        "position",
        "fontSize",
        "speed",
        "sectionsHidden",
        "progressionMode",
        "inlineMode",
        "splitMode",
        "autoScrollMode",
        "notesHidden"

    }


    with rooms_lock:

        for key in allowed:

            if key in data:

                room["state"][key] = data[key]


        room["state"]["updatedAt"] = time.time()

        state = snapshot(
            room
        )


    socketio.emit(
        "maestro_state",
        state,
        to=room_id
    )


# =========================================================
# SOLICITAR ESTADO DA SALA
# =========================================================

@socketio.on("request_room_state")
def request_room_state(data):

    data = data or {}

    room_id = str(
        data.get(
            "roomId",
            ""
        )
    ).strip()


    with rooms_lock:

        room = rooms.get(
            room_id
        )


    if not room:

        emit(
            "room_error",
            {
                "message":
                    "Sala não encontrada."
            }
        )

        return


    emit(
        "maestro_state",
        snapshot(room)
    )


# =========================================================
# SAIR DA SALA
# =========================================================

@socketio.on("leave_room_request")
def leave_room_request(data):

    data = data or {}

    room_id = str(
        data.get(
            "roomId",
            ""
        )
    ).strip()


    with rooms_lock:

        room = rooms.get(
            room_id
        )


    if not room:

        emit(
            "room_error",
            {
                "message":
                    "Sala não encontrada."
            }
        )

        return


    # =====================================================
    # MAESTRO SAINDO
    # =====================================================

    if room["admin_sid"] == request.sid:

        with rooms_lock:

            rooms.pop(
                room_id,
                None
            )


        socketio.emit(
            "room_closed",
            {

                "roomId":
                    room_id,

                "message":
                    "O Maestro encerrou a sala."

            },
            to=room_id
        )


        emit(
            "room_left",
            {

                "roomId":
                    room_id,

                "message":
                    "Você encerrou a sala."

            }
        )


        leave_room(
            room_id
        )

        return


    # =====================================================
    # PARTICIPANTE SAINDO
    # =====================================================

    with rooms_lock:

        client_to_remove = None

        for client_id, member in room["participants"].items():

            if member["sid"] == request.sid:

                client_to_remove = client_id

                break


        if client_to_remove:

            room["participants"].pop(
                client_to_remove,
                None
            )


        count = participant_count(
            room
        )


    leave_room(
        room_id
    )


    emit(
        "room_left",
        {

            "roomId":
                room_id,

            "message":
                "Você saiu da sala."

        }
    )


    socketio.emit(
        "room_presence",
        {

            "roomId":
                room_id,

            "participants":
                count

        },
        to=room_id
    )


# =========================================================
# DESCONEXÃO
# =========================================================

@socketio.on("disconnect")
def disconnect():

    affected_room = None


    with rooms_lock:

        for room_id, room in rooms.items():

            # ---------------------------------------------
            # MAESTRO DESCONECTOU
            # ---------------------------------------------

            if room["admin_sid"] == request.sid:

                room["admin_sid"] = None

                affected_room = room_id

                break


            # ---------------------------------------------
            # PARTICIPANTE DESCONECTOU
            # ---------------------------------------------

            for client_id, member in room["participants"].items():

                if member["sid"] == request.sid:

                    member["sid"] = None

                    affected_room = room_id

                    break


            if affected_room:

                break


    # -----------------------------------------------------
    # NÃO ENCERRAR IMEDIATAMENTE
    # -----------------------------------------------------

    if affected_room:

        socketio.start_background_task(
            cleanup_after_disconnect,
            affected_room
        )


# =========================================================
# INICIAR SERVIDOR
# =========================================================

if __name__ == "__main__":

    port = int(
        os.environ.get(
            "PORT",
            5000
        )
    )

    socketio.run(
        app,
        host="0.0.0.0",
        port=port,
        debug=True
    )