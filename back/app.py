# importados
import psycopg2
import os
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)




# BANCO DE DADOS

# Ela decide sozinha se usa a senha do seu PC ou da Nuvem
def get_db_connection():
    # 1. Tenta pegar o endereço do banco da Nuvem
    url_nuvem = os.getenv("DATABASE_URL")

    if url_nuvem:
        # --- ESTAMOS NA NUVEM (RENDER) ---
        if url_nuvem.startswith("postgres://"):
            url_nuvem = url_nuvem.replace("postgres://", "postgresql://", 1)
        
        conn = psycopg2.connect(url_nuvem)
    
    else:
        # --- ESTAMOS NO SEU PC (LOCAL) ---
        conn = psycopg2.connect(
            host="localhost",
            database="gerenciador_tarefas",
            user="postgres",
            password="10jackCRIL"
        )
    
    return conn



# --- ROTAS ---

# ROTA - CRIAR 
@app.route('/tarefas', methods=['POST'])
def criar_tarefa():
    try:
        dados = request.get_json()
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
        dados = request.get_json()
        novo_titulo = dados['titulo']
        novo_status = dados['concluido']

        conn = get_db_connection()
        cur = conn.cursor()

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