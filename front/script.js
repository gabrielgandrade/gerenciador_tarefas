const API_URL = 'http://127.0.0.1:5000/tarefas';

// --- 1. READ (Ler as tarefas ao abrir) ---
async function carregarTarefas() {
    const resposta = await fetch(API_URL);
    const tarefas = await resposta.json();

    const lista = document.getElementById('lista-tarefas');
    lista.innerHTML = ''; // Limpa a lista antes de renderizar

    tarefas.forEach(tarefa => {
        // Cria o HTML de cada item da lista
        const item = document.createElement('li');
        
        // Se a tarefa estiver concluída, adiciona a classe visual
        if (tarefa.concluido) {
            item.classList.add('concluido');
        }

        item.innerHTML = `
            <span class="texto-tarefa">${tarefa.titulo}</span>
            <div class="acoes">
                <button class="btn-check" onclick="alterarStatus(${tarefa.id}, '${tarefa.titulo}', ${tarefa.concluido})">
                    <i class="fas fa-check"></i> ${tarefa.concluido ? 'Desfazer' : 'Concluir'}
                </button>
                
                <button class="btn-edit" style="background-color: #17a2b8; color: white;" onclick="editarTexto(${tarefa.id}, '${tarefa.titulo}', ${tarefa.concluido})">
                    Editar
                </button>

                <button class="btn-delete" onclick="deletarTarefa(${tarefa.id})">
                    Excluir
                </button>
            </div>
        `;

        lista.appendChild(item);
    });
}

// --- 2. CREATE (Criar nova tarefa) ---
async function adicionarTarefa() {
    const input = document.getElementById('nova-tarefa');
    const titulo = input.value;

    if (!titulo) return alert("Digite uma tarefa!");

    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo: titulo })
    });

    input.value = ''; // Limpa o campo
    carregarTarefas(); // Recarrega a lista
}

// --- 3. DELETE (Apagar tarefa) ---
async function deletarTarefa(id) {
    if (confirm("Tem certeza que deseja excluir?")) {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        carregarTarefas(); // Recarrega a lista sem o item apagado
    }
}

// --- 4. UPDATE (Marcar como concluído/pendente) ---
async function alterarStatus(id, tituloAtual, statusAtual) {
    // Inverte o status: se era true vira false, e vice-versa
    const novoStatus = !statusAtual;

    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            titulo: tituloAtual,
            concluido: novoStatus 
        })
    });

    carregarTarefas(); // Recarrega a lista com o novo visual
}

// --- 5. EDITAR TEXTO (Update Real) ---
async function editarTexto(id, tituloAtual, statusAtual) {
    // Abre uma janelinha perguntando o novo nome
    const novoTitulo = prompt("Qual o novo nome da tarefa?", tituloAtual);

    // Se o usuário cancelou ou deixou vazio, não faz nada
    if (!novoTitulo || novoTitulo === tituloAtual) return;

    // Envia para o Backend
    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            titulo: novoTitulo,     // Manda o NOVO título
            concluido: statusAtual  // Mantém o status que já estava
        })
    });

    carregarTarefas(); // Atualiza a tela
}

// Carrega tudo assim que o script roda
carregarTarefas();