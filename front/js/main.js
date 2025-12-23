// 1. Importa os componentes
import { Header } from '../components/header.js';
import { Footer } from '../components/footer.js';
import { Filters } from '../components/filters.js'; // <--- Importamos o novo componente

// 2. Renderiza a estrutura visual
document.getElementById('app-header').innerHTML = Header();
document.getElementById('app-footer').innerHTML = Footer();

// Injeta os filtros LOGO ANTES da lista de tarefas
const lista = document.getElementById('lista-tarefas');
lista.insertAdjacentHTML('beforebegin', Filters());

// ---------------------------------------------------------
// 3. Lógica do Sistema (O Motor V8)
// ---------------------------------------------------------

const API_URL = 'http://127.0.0.1:5000/tarefas';
let filtroAtual = 'todas'; // Memória do filtro

// --- FUNÇÃO: CARREGAR (READ) ---
window.carregarTarefas = async function() {
    const resposta = await fetch(API_URL);
    const tarefas = await resposta.json();
    const lista = document.getElementById('lista-tarefas');
    lista.innerHTML = '';

    tarefas.forEach(tarefa => {
        // 1. Aplica o Filtro
        if (filtroAtual === 'pendentes' && tarefa.concluido) return;
        if (filtroAtual === 'concluidas' && !tarefa.concluido) return;

        // 2. Cria o Elemento HTML
        const item = document.createElement('li');
        
        // Estilo visual se estiver concluído
        if (tarefa.concluido) item.classList.add('concluido-visual');

        item.innerHTML = `
            <span class="${tarefa.concluido ? 'texto-concluido' : ''}">
                ${tarefa.titulo}
            </span>
            
            <div class="acoes">
                <button class="btn-acao btn-check" onclick="alterarStatus(${tarefa.id}, '${tarefa.titulo}', ${tarefa.concluido})">
                    ${tarefa.concluido ? '↩️' : '✅'}
                </button>
                
                <button class="btn-acao btn-edit" onclick="editarTexto(${tarefa.id}, '${tarefa.titulo}', ${tarefa.concluido})">
                    ✏️
                </button>

                <button class="btn-acao btn-del" onclick="deletarTarefa(${tarefa.id})">
                    🗑️
                </button>
            </div>
        `;
        lista.appendChild(item);
    });
}

// --- FUNÇÃO: ADICIONAR (CREATE) ---
window.adicionarTarefa = async function() {
    const input = document.getElementById('nova-tarefa');
    const titulo = input.value;
    if (!titulo) return alert("Digite algo!");

    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo })
    });

    input.value = '';
    carregarTarefas();
}

// --- FUNÇÃO: DELETAR (DELETE) ---
window.deletarTarefa = async function(id) {
    if(confirm("Tem certeza?")) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        carregarTarefas();
    }
}

// --- FUNÇÃO: FILTRAR ---
window.filtrar = function(tipo) {
    filtroAtual = tipo;
    carregarTarefas();
}

// --- FUNÇÃO: ALTERAR STATUS (UPDATE PARCIAL) ---
window.alterarStatus = async function(id, titulo, statusAtual) {
    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            titulo: titulo, 
            concluido: !statusAtual // Inverte o status
        })
    });
    carregarTarefas();
}

// --- FUNÇÃO: EDITAR TEXTO (UPDATE TOTAL) ---
window.editarTexto = async function(id, tituloAtual, statusAtual) {
    const novoTitulo = prompt("Editar tarefa:", tituloAtual);
    
    if (!novoTitulo || novoTitulo === tituloAtual) return;

    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            titulo: novoTitulo, 
            concluido: statusAtual
        })
    });
    carregarTarefas();
}

// Inicializa tudo
carregarTarefas();