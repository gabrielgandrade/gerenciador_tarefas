#importados
import psycopg2
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)



# banco de dados
DB_HOST = "localhost"
DB_NAME = "gerenciador_tarefas"
DB_USER = "postgres"
DB_PASS = "10jackCRIL" 

def get_db_connection():
    conn = psycopg2.connect(
        host=DB_HOST,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASS
    )
    return conn






# ROTA - CRIAR 
@app.route('/tarefas', methods=['POST'])
def criar_tarefa():
    try:
        dados = request.get_json() # Agora podemos usar o padrão do Flask!
        titulo_tarefa = dados['titulo']

        conn = get_db_connection()
        cur = conn.cursor()

        sql = "INSERT INTO tarefas (titulo) VALUES (%s) RETURNING id;"
        cur.execute(sql, (titulo_tarefa,))
        
        novo_id = cur.fetchone()[0]
        conn.commit()
        
        cur.close()
        conn.close()

        return jsonify({"mensagem": "Tarefa criada!", "id": novo_id}), 201
    except Exception as e:
        return jsonify({"erro": str(e)}), 500



# ROTA - LER
@app.route('/tarefas', methods=['GET'])
def listar_tarefas():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Pega todas as tarefas ordenadas pelo ID
        cur.execute("SELECT * FROM tarefas ORDER BY id ASC;")
        tarefas = cur.fetchall()
        
        lista_formatada = []
        for t in tarefas:
            lista_formatada.append({
                "id": t[0],
                "titulo": t[1],
                "concluido": t[2]
            })

        cur.close()
        conn.close()
        return jsonify(lista_formatada), 200
    except Exception as e:
        return jsonify({"erro": str(e)}), 500



# ROTA - ATUALIZAR 
@app.route('/tarefas/<int:id>', methods=['PUT'])
def atualizar_tarefa(id):
    try:
        # 1. Pegar os dados que o usuário quer mudar
        dados = request.get_json()
        novo_titulo = dados['titulo']
        novo_status = dados['concluido'] # True ou False

        # 2. Conectar
        conn = get_db_connection()
        cur = conn.cursor()

        # 3. O Comando SQL (Update)
        # "Atualize a tabela tarefas, definindo titulo = X e concluido = Y, 
        # MAS APENAS ONDE o id for igual ao ID da URL"
        sql = "UPDATE tarefas SET titulo = %s, concluido = %s WHERE id = %s"
        
        cur.execute(sql, (novo_titulo, novo_status, id))
        
        conn.commit()
        cur.close()
        conn.close()

        return jsonify({"mensagem": "Tarefa atualizada!"}), 200

    except Exception as e:
        return jsonify({"erro": str(e)}), 500

# ROTA - DELETAR 
@app.route('/tarefas/<int:id>', methods=['DELETE'])
def deletar_tarefa(id):
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # O Comando Fatal
        # "Apague da tabela tarefas ONDE o id for igual ao ID da URL"
        sql = "DELETE FROM tarefas WHERE id = %s"
        
        cur.execute(sql, (id,))
        
        conn.commit()
        cur.close()
        conn.close()

        return jsonify({"mensagem": "Tarefa deletada com sucesso!"}), 200

    except Exception as e:
        return jsonify({"erro": str(e)}), 500


if __name__ == '__main__':
    app.json.ensure_ascii = False 
    app.run(debug=True)



