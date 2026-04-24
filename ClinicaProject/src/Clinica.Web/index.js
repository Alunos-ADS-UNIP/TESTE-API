window.onload = function() {
    // 1. DECLARAÇÃO DE VARIÁVEIS
    const btnAbrir = document.getElementById("btnAbrir");
    const btnFechar = document.getElementById("btnFechar");
    const modal = document.getElementById("modalAgenda");
    const modalSucesso = document.getElementById("modalSucesso");
    const btnConfirmar = document.getElementById("confirmarAgendamento");
    
    const selectTerapeuta = document.getElementById('selectTerapeuta');
    const inputData = document.getElementById('dataAgendamento');
    const containerHorarios = document.getElementById('containerHorarios');
    const textoResumo = document.getElementById('textoResumo');
    const dadosConfirmados = document.getElementById("dadosConfirmados");
    
    const toast = document.getElementById("toastErro");
    const progressBar = toast ? toast.querySelector('.toast-progress') : null;

    let agendamentoFinal = { terapeuta: '', data: '', hora: '' };
    let toastTimeout;

    // 2. ABRIR E FECHAR MODAL PRINCIPAL
    if (btnAbrir) btnAbrir.onclick = () => modal.showModal();
    if (btnFechar) btnFechar.onclick = () => modal.close();

    // 3. BUSCAR HORÁRIOS DINAMICAMENTE
    async function buscarHorarios(terapeuta, data) {
        if (!terapeuta || !data) return;
        containerHorarios.innerHTML = "<p>Carregando horários...</p>";
        try {
            const respostaFake = ["08:00", "09:30", "11:00", "14:00", "15:30", "17:00"];
            containerHorarios.innerHTML = "";
            
            respostaFake.forEach(horario => {
                const btn = document.createElement("button");
                btn.type = "button";
                btn.className = "btn-hora";
                btn.innerText = horario;
                
                btn.onclick = function() {
                    document.querySelectorAll('.btn-hora').forEach(b => b.classList.remove('selecionado'));
                    this.classList.add('selecionado');
                    
                    agendamentoFinal.hora = horario;
                    agendamentoFinal.terapeuta = selectTerapeuta.options[selectTerapeuta.selectedIndex].text;
                    agendamentoFinal.data = inputData.value.split('-').reverse().join('/');
                    
                    textoResumo.innerText = `Selecionado: ${horario}`;
                };
                containerHorarios.appendChild(btn);
            });
        } catch (error) {
            containerHorarios.innerHTML = "<p>Erro ao carregar horários.</p>";
        }
    }

    if (selectTerapeuta && inputData) {
        selectTerapeuta.onchange = () => buscarHorarios(selectTerapeuta.value, inputData.value);
        inputData.onchange = () => buscarHorarios(selectTerapeuta.value, inputData.value);
    }

    // 4. LÓGICA DO TOAST (AVISO FLUTUANTE)
    window.mostrarToast = function() {
        if (!toast) return;
        toast.classList.add("show");
        iniciarTimerToast();
    }

    function iniciarTimerToast() {
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            fecharToast();
        }, 3000);
        
        if (progressBar) {
            progressBar.classList.remove('pausar-animacao');
        }
    }

    window.fecharToast = function() {
        if (toast) {
            toast.classList.remove("show");
            clearTimeout(toastTimeout);
        }
    }

    // Eventos de Mouse: Pausar e Retomar
    if (toast) {
        toast.onmouseenter = () => {
            clearTimeout(toastTimeout);
            if (progressBar) {
                progressBar.classList.add('pausar-animacao');
            }
        };

        toast.onmouseleave = () => {
            iniciarTimerToast();
        };
    }

    // 5. BOTÃO CONFIRMAR
    if (btnConfirmar) {
        btnConfirmar.onclick = function() {
            const botaoHoraAtivo = document.querySelector('.btn-hora.selecionado');

            if (selectTerapeuta.value === "" || inputData.value === "" || !botaoHoraAtivo) {
                mostrarToast(); 
                return;
            }

            dadosConfirmados.innerHTML = `
                <p><strong>Terapeuta:</strong> ${agendamentoFinal.terapeuta}</p>
                <p><strong>Data:</strong> ${agendamentoFinal.data}</p>
                <p><strong>Horário:</strong> ${agendamentoFinal.hora}</p>
            `;

            modal.close();
            modalSucesso.showModal();
        };
    }
};
