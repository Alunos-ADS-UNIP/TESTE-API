document.addEventListener("DOMContentLoaded", () => {
    // 1. MAPEAMENTO DE ELEMENTOS
    const el = {
        btnAbrir: document.getElementById("btnAbrir"),
        btnConfirmar: document.getElementById("confirmarAgendamento"),
        btnFechar: document.getElementById("btnFechar"),
        
        modalAgenda: document.getElementById("modalAgenda"),
        modalSucesso: document.getElementById("modalSucesso"),
        
        selectPrincipal: document.getElementById('selectTerapeutaPrincipal'),
        selectModal: document.getElementById('selectTerapeuta'),
        inputData: document.getElementById('dataAgendamento'),
        containerHorarios: document.getElementById('containerHorarios'),
        
        toast: document.getElementById("toastErro"),
        msgErro: document.getElementById("mensagemErro"), 
        
        dadosConfirmados: document.getElementById("dadosConfirmados")
    };

    const API_URL = "http://localhost:3000/agendaFisioData";
    let horaSelecionada = "";

    // Grade de 30 em 30 minutos sincronizada com o Terapeuta
    const gradeHorarios = [
        "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", 
        "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", 
        "17:00", "17:30", "18:00"
    ];

    /* ============================================================
       FUNÇÕES DE COMUNICAÇÃO COM API (FETCH)
    ============================================================ */

    // Busca a situação dos horários no db.json
    const buscarDisponibilidade = async (data) => {
        try {
            const response = await fetch(API_URL);
            const agendaGlobal = await response.json();
            // Retorna os bloqueios daquela data específica ou um objeto vazio
            return agendaGlobal[data] || {};
        } catch (error) {
            console.error("Erro ao conectar com a API:", error);
            return {};
        }
    };

    // Salva o agendamento no db.json (Agenda Global)
    const salvarAgendamentoAPI = async (data, hora, medico, paciente) => {
        try {
            // 1. Pega o estado atual da agenda
            const response = await fetch(API_URL);
            const agendaGlobal = await response.json();

            // 2. Prepara a nova estrutura
            if (!agendaGlobal[data]) agendaGlobal[data] = {};
            agendaGlobal[data][hora] = {
                status: "bloqueado",
                paciente: paciente,
                medico: medico
            };

            // 3. Sobrescreve no db.json via PUT
            await fetch(API_URL, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(agendaGlobal)
            });
            return true;
        } catch (error) {
            mostrarErro("Erro ao salvar no servidor.");
            return false;
        }
    };

    /* ============================================================
       FUNÇÕES DE APOIO AO USUÁRIO
    ============================================================ */

    const mostrarErro = (mensagem) => {
        el.msgErro.innerText = mensagem;
        el.toast.classList.add('toast-visible');
        setTimeout(() => el.toast.classList.remove('toast-visible'), 3500);
    };

    const atualizarHorarios = async () => {
        const medico = el.selectModal.value;
        const data = el.inputData.value;

        if (!medico || !data) {
            el.containerHorarios.innerHTML = `<p style="grid-column: 1/-1; text-align:center; font-size:0.85rem; color:gray; padding:20px;">Escolha o fisioterapeuta e a data.</p>`;
            return;
        }

        el.containerHorarios.innerHTML = "<p style='grid-column:1/-1; text-align:center;'>Carregando horários...</p>";
        
        // Consulta API para ver o que está bloqueado
        const bloqueiosDoDia = await buscarDisponibilidade(data);

        el.containerHorarios.innerHTML = "";
        gradeHorarios.forEach(h => {
            const isOcupado = bloqueiosDoDia[h] && bloqueiosDoDia[h].status === "bloqueado";
            const btn = document.createElement("button");
            
            btn.className = isOcupado ? "btn-hora ocupado" : "btn-hora";
            btn.innerText = h;
            btn.type = "button";
            btn.disabled = isOcupado;

            if (!isOcupado) {
                btn.onclick = () => {
                    document.querySelectorAll('.btn-hora').forEach(b => b.classList.remove('selecionado'));
                    btn.classList.add('selecionado');
                    horaSelecionada = h;
                };
            }
            el.containerHorarios.appendChild(btn);
        });
    };

    /* ============================================================
       EVENTOS PRINCIPAIS
    ============================================================ */

    el.btnAbrir.onclick = () => {
        if (!el.selectPrincipal.value) {
            mostrarErro("Selecione um especialista para agendar a sessão.");
            return;
        }
        el.selectModal.value = el.selectPrincipal.value;
        el.inputData.value = ""; 
        el.containerHorarios.innerHTML = "";
        el.modalAgenda.showModal();
    };

    el.btnFechar.onclick = () => el.modalAgenda.close();

    el.selectModal.onchange = atualizarHorarios;
    el.inputData.onchange = atualizarHorarios;

    el.btnConfirmar.onclick = async () => {
        const medico = el.selectModal.value;
        const data = el.inputData.value;
        const nomePaciente = document.getElementById('nomePaciente')?.innerText || "Davi Gusmão";

        if (!medico || !data || !horaSelecionada) {
            mostrarErro("Preencha todos os campos e selecione um horário.");
            return;
        }

        // SALVAMENTO NA API
        const sucesso = await salvarAgendamentoAPI(data, horaSelecionada, medico, nomePaciente);

        if (sucesso) {
            const dataFormatada = data.split('-').reverse().join('/');
            
            // Monta o resumo visual no modal de sucesso
            el.dadosConfirmados.innerHTML = `
                <div class="resumo-item" style="display:flex; gap:10px; margin-bottom:15px; text-align:left;">
                    <span class="icon">👤</span>
                    <div><strong>Paciente</strong><p>${nomePaciente}</p></div>
                </div>
                <div class="resumo-item" style="display:flex; gap:10px; margin-bottom:15px; text-align:left;">
                    <span class="icon">🩺</span>
                    <div><strong>Fisioterapeuta</strong><p>${medico}</p></div>
                </div>
                <div class="resumo-item" style="display:flex; gap:10px; text-align:left;">
                    <span class="icon">📅</span>
                    <div><strong>Data e Horário</strong><p>${dataFormatada} às ${horaSelecionada}</p></div>
                </div>
            `;

            el.modalAgenda.close();
            el.modalSucesso.showModal();
        }
    };
});
