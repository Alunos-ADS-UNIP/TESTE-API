window.onload = function() {
    const btn = document.getElementById("btnCadastrar");
    const inputCPF = document.getElementById("cpf");
    const checkLGPD = document.getElementById("checkLGPD");

    // 1. MÁSCARA DE CPF
    inputCPF.addEventListener("input", (e) => {
        let v = e.target.value.replace(/\D/g, "");
        v = v.replace(/(\d{3})(\d)/, "$1.$2");
        v = v.replace(/(\d{3})(\d)/, "$1.$2");
        v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        e.target.value = v;
    });

    // 2. ATIVAÇÃO DO BOTÃO PELO CHECKBOX LGPD
    checkLGPD.addEventListener("change", function() {
        btn.disabled = !this.checked; // Habilita se marcado, desabilita se desmarcado
    });

    // 3. ENVIO DOS DADOS
    btn.onclick = async function() {
        const dados = {
            nome: document.getElementById("nome").value,
            cpf: inputCPF.value.replace(/\D/g, ""),
            email: document.getElementById("email").value,
            senha: document.getElementById("senha").value,
            // Captura especialidade apenas se o campo existir (tela do terapeuta)
            especialidade: document.getElementById("especialidade")?.value || null
        };

        if (dados.cpf.length < 11) {
            alert("Preencha o CPF corretamente.");
            return;
        }

        console.log("Enviando para API:", dados);
        // Aqui você insere o fetch() para sua API...
        alert("Cadastro realizado com sucesso!");
        window.location.href = "./login.html";
    };
};
window.onload = function() {
    const btn = document.getElementById("btnCadastrar");
    const inputCPF = document.getElementById("cpf");
    const checkLGPD = document.getElementById("checkLGPD");
    const URL_API = "http://localhost:8000/register"; // Altere para sua URL real

    // 1. MÁSCARA DE CPF
    if (inputCPF) {
        inputCPF.addEventListener("input", function(e) {
            let v = e.target.value.replace(/\D/g, ""); // Remove não numéricos
            v = v.replace(/(\d{3})(\d)/, "$1.$2");
            v = v.replace(/(\d{3})(\d)/, "$1.$2");
            v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
            e.target.value = v;
        });
    }

    // 2. ATIVAÇÃO DO BOTÃO PELO CHECKBOX LGPD
    if (checkLGPD) {
        checkLGPD.addEventListener("change", function() {
            // O botão só habilita se o checkbox estiver marcado
            btn.disabled = !this.checked;
            
            // Estilo visual opcional para o botão desabilitado
            if (this.checked) {
                btn.style.opacity = "1";
                btn.style.cursor = "pointer";
            } else {
                btn.style.opacity = "0.6";
                btn.style.cursor = "not-allowed";
            }
        });
    }

    // 3. ENVIO DOS DADOS PARA API
    if (btn) {
        btn.onclick = async function() {
            const dados = {
                nome: document.getElementById("nome").value,
                cpf: inputCPF.value.replace(/\D/g, ""),
                especialidade: document.getElementById("especialidade").value,
                email: document.getElementById("email").value,
                senha: document.getElementById("senha").value
            };

            // Validação básica
            if (!dados.nome || dados.cpf.length < 11 || !dados.email.includes("@")) {
                alert("Por favor, preencha todos os campos corretamente.");
                return;
            }

            try {
                const response = await fetch(URL_API, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dados)
                });

                if (response.ok) {
                    alert("✅ Cadastro de Terapeuta realizado com sucesso!");
                    window.location.href = "./login.html";
                } else {
                    const error = await response.json();
                    alert(error.detail || "Erro ao realizar cadastro profissional.");
                }
            } catch (err) {
                alert("Erro ao conectar com o servidor.");
            }
        };
    }
};
