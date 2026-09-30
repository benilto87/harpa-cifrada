HARPA CIFRADA — SALAS / MAESTRO — V2 MODULAR

A sincronização de Salas / Maestro foi separada do index.html.

ESTRUTURA
- index.html ........ interface principal da Harpa
- js/rede-maestro.js  toda a lógica de Socket.IO, salas e sincronização
- app.py ............ servidor Flask-SocketIO
- requirements.txt .. dependências

O index.html apenas carrega:
<script src="/js/rede-maestro.js"></script>

FUNÇÕES SINCRONIZADAS PELO MAESTRO
- hino atual
- tom
- tamanho da letra
- ocultar/mostrar marcações
- progressão numérica (#)
- cifras dentro da letra (.)
- modo dividir pelo / (*)
- velocidade da rolagem
- iniciar/pausar rolagem automática
- posição da rolagem

INSTALAÇÃO LOCAL
1. Mantenha a pasta js junto do index.html.
2. Instale:
   py -m pip install -r requirements.txt
3. Inicie:
   py app.py
4. Abra:
   http://localhost:5000

IMPORTANTE
A versão atual do index.html carrega o cliente Socket.IO pelo CDN.
O servidor Flask-SocketIO continua sendo necessário para as salas.

RENDER
Start Command:
gunicorn --worker-class gthread --threads 100 --workers 1 app:app

VANTAGEM DA VERSÃO MODULAR
A lógica de rede/maestro pode ser alterada em js/rede-maestro.js sem precisar mexer no código principal de renderização da Harpa.
