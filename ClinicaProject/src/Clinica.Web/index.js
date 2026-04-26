window.onload = function() {
    const el = {
        btnAbrir: document.getElementById("btnAbrir"),
        btnConfirmar: document.getElementById("confirmarAgendamento"),
        modal: document.getElementById("modalAgenda"),
        selectPrincipal: document.getElementById('selectTerapeutaPrincipal'),
        selectModal: document.getElementById('selectTerapeuta'),
        inputData: document.getElementById('dataAgendamento'),
        containerHorarios: document.getElementById('containerHorarios'),
        toast: document.getElementById("toastErro"),
        msgErro: document.getElementById("mensagemErro")
    };

    let agendamento = { hora: '' };

    // Função única para mostrar erro
    const mostrarErro = (texto) => {
        el.msgErro.innerText = texto;
        el.toast.classList.add("show");
        setTimeout(() => el.toast.classList.remove("show"), 3500);
    };

    // 1. VALIDAÇÃO AO CLICAR NO PRIMEIRO BOTÃO (FORA DO MODAL)
    el.btnAbrir.onclick = () => {
        if (!el.selectPrincipal.value) {
            mostrarErro("Por favor, selecione um profissional primeiro.");
            return;
        }
        // Se estiver OK, sincroniza e abre
        el.selectModal.value = el.selectPrincipal.value;
        el.modal.showModal();
    };

    // 2. BUSCA DE HORÁRIOS
    const atualizarHorarios = () => {
        const t = el.selectModal.value;
        const d = el.inputData.value;
        if (!t || !d) {
            el.containerHorarios.innerHTML = "<p>Aguardando médico e data...</p>";
            return;
        }
        
        el.containerHorarios.innerHTML = "";
        ["09:00", "10:30", "14:00", "16:00"].forEach(h => {
            const btn = document.createElement("button");
            btn.className = "btn-hora";
            btn.innerText = h;
            btn.onclick = () => {
                document.querySelectorAll('.btn-hora').forEach(b => b.classList.remove('selecionado'));
                btn.classList.add('selecionado');
                agendamento.hora = h;
            };
            el.containerHorarios.appendChild(btn);
        });
    };

    el.selectModal.onchange = atualizarHorarios;
    el.inputData.onchange = atualizarHorarios;

    // 3. VALIDAÇÃO AO CONFIRMAR (DENTRO DO MODAL)
    el.btnConfirmar.onclick = () => {
        if (!el.selectModal.value || !el.inputData.value || !agendamento.hora) {
            mostrarErro("Preencha a data e escolha um horário.");
            return;
        }
        
        // Se passar na validação, mostra sucesso
        el.modal.close();
        document.getElementById("modalSucesso").showModal();
    };

    document.getElementById("btnFechar").onclick = () => el.modal.close();
};
