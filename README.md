Gerenciador de Tarefas (CRUD Fullstack)

Este é um projeto de estudo desenvolvido para aplicar os conceitos fundamentais de desenvolvimento Web Fullstack. O sistema é uma lista de tarefas interativa que permite Criar, Ler, Atualizar e Deletar tarefas persistindo os dados em um banco relacional.

Tecnologias Utilizadas

Backend
- Python: Linguagem principal.
- Flask: Microframework para criação da API REST.
- Psycopg2: Driver para conexão com o banco de dados.
- Flask-CORS: Para permitir a comunicação entre Frontend e Backend.

Frontend
- HTML & CSS: Estrutura e estilização da interface.
- JavaScript: Lógica do cliente e consumo da API via `fetch`.

Banco de Dados
- PostgreSQL: Banco de dados relacional para armazenar as tarefas.

---

Funcionalidades

- ✅ Adicionar Tarefa: Cria um novo registro no banco.
- 📋 Listar Tarefas: Busca e exibe todas as tarefas salvas.
- ✏️ Concluir/Desfazer: Atualiza o status da tarefa (riscado/normal) em tempo real.
- 🗑️ Excluir: Remove a tarefa permanentemente do banco de dados.

---

Como Rodar o Projeto Localmente

Pré-requisitos
- Python instalado.
- PostgreSQL instalado e rodando.

Clone o repositório
```bash
git clone [https://github.com/gabrielgandrade/gerenciador_tarefas.git]
