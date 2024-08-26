# Como rodar?
- Instalar flask
- Instalar Docker
- Instalar Psycopg 2: `pip install psycopg2-binary`
- Rodar 'docker compose up -d' para inicializar o banco Postgres
- Rodar 'python setup_db.py' para criar as tabelas e configurar o banco com dados iniciais
- Rodar 'python main.py' para iniciar o server na porta 8080, em localhost

# Funcionalidades
- A página inicial da aplicação é '/dashboard'. Nela, podemos visualizar a filtrar por carros
- Se fizer o login, poderá adicionar carros à listagem, que é compartilhada com todos usuários
- Para o login, basta inserir um nome e email. Se fizermos login com o mesmo email e mudar o nome, o usuário terá seu nome editado.
- Carros podem ser editados e excluídos, desde que você seja o usuário que os cadastrou

# Sobre os arquivos
- templates/*: Guarda os templates .html usados na aplicação
- setup_db.py: Configurações do banco
- mapper.py: Funções de mapeamento, utilizadas para transformar e formatar dados. Por exemplo, o banco retorna os dados em tupla ('<id>', '<nome>', '<email>') e a função de mapeamento transforma a tupla em um objeto ({ "id": <id>, "nome": <id>, "email": <email> }). Além disso formatamos dados como o valor do carro por exemplo, que vem do banco em float e formatamos para moeda (100 -> R$ 100,00)
- main.py: Lanca o servidor, que utiliza os templates e funções de mapeamento

# Preview da página inicial
<img width="1437" alt="Captura de Tela 2024-08-20 às 17 00 16" src="https://github.com/user-attachments/assets/c5b3d623-097c-4520-8c02-c763e2fbbf68">
