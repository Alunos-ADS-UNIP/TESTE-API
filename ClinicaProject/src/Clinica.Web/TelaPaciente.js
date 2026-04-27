document.addEventListener("DOMContentLoaded", () => {
    // 1. MAPEAMENTO DE ELEMENTOS
    const el = {
        btnAbrir: document.getElementById("btnAbrir"),
        modalAgenda: document.getElementById("modalAgenda"),
        modalSucesso: document.getElementById("modalSucesso"),
        modalCancel: document.getElementById("modalAvisoCancel"),
        confirmar: document.getElementById("confirmar"),
        btnEntendido: document.getElementById("btnEntendido"),
        statusBox: document.getElementById("statusConsulta"),
        containerHoras: document.getElementById("containerHorarios"),
        inputData: document.getElementById("dataAgendamento"),
        selectTerapeuta: document.getElementById("selectTerapeuta")
    };

    const API_URL = "http://localhost:3000/agendaFisioData";
    const NOME_PACIENTE = "Davi Gusmão";
    let consultaAtiva = null;
    let horaSelecionada = "";

    const gradeHorarios = [
        "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", 
        "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", 
        "16:00", "16:30", "17:00", "17:30", "18:00"
    ];

    /* ============================================================
       FUNÇÕES DE COMUNICAÇÃO COM A API
    ============================================================ */

    const buscarAgendaAPI = async () => {
        try {
            const response = await fetch(API_URL);
            return await response.json();
        } catch (error) {
            console.error("Erro ao buscar agenda:", error);
            return {};
        }
    };

    const salvarAgendaAPI = async (novaAgenda) => {
        try {
            await fetch(API_URL, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novaAgenda)
            });
        } catch (error) {
            alert("Erro ao salvar no servidor.");
        }
    };

    /* ============================================================
       LÓGICA DE INTERFACE
    ============================================================ */

    // Verifica se já existe uma consulta marcada para o paciente ao carregar a tela
    const checarConsultaExistente = async () => {
        const agenda = await buscarAgendaAPI();
        
        Object.keys(agenda).forEach(data => {
            Object.keys(agenda[data]).forEach(hora => {
                if (agenda[data][hora].paciente === NOME_PACIENTE) {
                    consultaAtiva = {
                        medico: agenda[data][hora].medico || "Fisioterapeuta",
                        dataOriginal: data,
                        dataExibicao: data.split('-').reverse().join('/'),
                        hora: hora
                    };
                    renderizarCardAtivo();
                }
            });
        });
    };

    const renderizarCardAtivo = () => {
        if (!consultaAtiva) return;

        el.statusBox.innerHTML = `
            <div class="card-agendado" style="background:#f0fdf4; padding:20px; border-radius:15px; border:1px solid #bbf7d0; text-align:left;">
                <p><strong>Sessão com ${consultaAtiva.medico}</strong></p>
                <p>Dia ${consultaAtiva.dataExibicao} às ${consultaAtiva.hora}</p>
                <button id="btnCancelar" class="btn-cancelar" style="width:100%; margin-top:15px; cursor:pointer;">Desmarcar Consulta</button>
            </div>
        `;
        el.btnAbrir.style.display = "none";
        document.getElementById("btnCancelar").onclick = () => el.modalCancel.showModal();
    };

    const atualizarGridPaciente = async () => {
        const dataSel = el.inputData.value;
        if (!dataSel) {
            el.containerHoras.innerHTML = "<p style='font-size:0.8rem; color:gray; grid-column:1/-1;'>Selecione a data...</p>";
            return;
        }

        const agendaGlobal = await buscarAgendaAPI();
        const agendaDia = agendaGlobal[dataSel] || {};

        el.containerHoras.innerHTML = "";
        horaSelecionada = "";

        gradeHorarios.forEach(h => {
            const info = agendaDia[h] || { status: "disponivel" };
            const isOcupado = info.status === "bloqueado";

            const btn = document.createElement("button");
            btn.innerText = h;
            btn.type = "button";
            btn.className = `btn-hora ${isOcupado ? 'bloqueado' : 'disponivel'}`;
            
            if (isOcupado) {
                btn.disabled = true;
            } else {
                btn.onclick = () => {
                    document.querySelectorAll('.btn-hora').forEach(b => b.classList.remove('selecionado'));
                    btn.classList.add('selecionado');
                    horaSelecionada = h;
                };
            }
            el.containerHoras.appendChild(btn);
        });
    };

    /* ============================================================
       EVENTOS
    ============================================================ */

    el.inputData.onchange = atualizarGridPaciente;

    el.btnAbrir.onclick = () => {
        el.inputData.value = "";
        el.containerHoras.innerHTML = "<p style='color:gray;'>Aguardando data...</p>";
        el.modalAgenda.showModal();
    };

    el.confirmar.onclick = async () => {
        const medico = el.selectTerapeuta.value;
        const dataOriginal = el.inputData.value;
        
        if(!medico || !dataOriginal || !horaSelecionada) {
            return alert("Por favor, preencha todos os campos!");
        }

        const agendaGlobal = await buscarAgendaAPI();
        if (!agendaGlobal[dataOriginal]) agendaGlobal[dataOriginal] = {};

        // Salva na estrutura da API
        agendaGlobal[dataOriginal][horaSelecionada] = {
            status: "bloqueado",
            paciente: NOME_PACIENTE,
            medico: medico
        };

        await salvarAgendaAPI(agendaGlobal);

        consultaAtiva = { 
            medico, 
            dataOriginal,
            dataExibicao: dataOriginal.split('-').reverse().join('/'), 
            hora: horaSelecionada 
        };

        document.getElementById("dadosConfirmados").innerHTML = `
            <div class="resumo-sucesso" style="text-align:left;">
                <p><strong>Especialista:</strong> ${consultaAtiva.medico}</p>
                <p><strong>Data:</strong> ${consultaAtiva.dataExibicao}</p>
                <p><strong>Horário:</strong> ${consultaAtiva.hora}</p>
            </div>
        `;

        el.modalAgenda.close();
        el.modalSucesso.showModal();
    };

    el.btnEntendido.onclick = () => {
        el.modalSucesso.close();
        renderizarCardAtivo();
    };

    document.getElementById("confirmarCancelamento").onclick = async () => {
        const agendaGlobal = await buscarAgendaAPI();
        
        if (agendaGlobal[consultaAtiva.dataOriginal]) {
            // Libera o horário na API
            agendaGlobal[consultaAtiva.dataOriginal][consultaAtiva.hora] = { 
                status: "disponivel", 
                paciente: null 
            };
        }

        await salvarAgendaAPI(agendaGlobal);

        consultaAtiva = null;
        el.modalCancel.close();
        el.statusBox.innerHTML = '<p style="color: gray;">Nenhuma sessão agendada.</p>';
        el.btnAbrir.style.display = "block";
    };

    // Inicialização
    checarConsultaExistente();
});
