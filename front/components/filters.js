export function Filters() {
    return `
        <div class="filtros-container">
            <button class="btn-filter" onclick="filtrar('todas')">Todas</button>
            <button class="btn-filter" onclick="filtrar('pendentes')">Pendentes</button>
            <button class="btn-filter" onclick="filtrar('concluidas')">Concluídas</button>
        </div>
    `;
}