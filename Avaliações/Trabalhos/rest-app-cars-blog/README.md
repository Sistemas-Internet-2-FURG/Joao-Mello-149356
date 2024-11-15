# Vídeo da apresentação
Para ver o vídeo, acesse pelo [youtube](https://youtu.be/02yyWXTjewk)

# Como rodar?
- Para o client: `cd client && npm i && npm run dev`
- Para o server: `cd api && pip install -r requirements.txt && docker compose up -d && python main.py`
- Parar testar a aplicação local, acesse o [link](http://localhost:5173)

# Funcionalidades
- A página inicial da aplicação é '/dashboard'. Nela, podemos visualizar a filtrar por carros
- Se fizer o login, poderá adicionar carros à listagem, que é compartilhada com todos usuários
- Para o login, basta inserir um nome e email. Se fizermos login com o mesmo email e mudar o nome, o usuário terá seu nome editado.
- Carros podem ser editados e excluídos, desde que você seja o usuário que os cadastrou

# Sobre os arquivos
- api/*: Guarda o código fonte da api do projeto, desenvolvida com Flask
- client/*: Guarda o código fonte do client do projeto, que utiliza Vite + React

# Preview da página inicial
<img width="1437" alt="Captura de Tela 2024-08-20 às 17 00 16" src="https://github.com/user-attachments/assets/c5b3d623-097c-4520-8c02-c763e2fbbf68">
