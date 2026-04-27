window.onload = function() {
    const btnEntrar = document.getElementById("btnEntrar");
    const inputCPF = document.getElementById("cpfLogin");
    const inputSenha = document.getElementById("senha");
    const URL_API = "http://localhost:8000/login"; 
    // Substitua a parte do salvamento por isso:
const confirmarNoServidor = async (dadosAgendamento) => {
    try {
        await fetch('http://localhost:3000/consultas_fisio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosAgendamento)
        });
        console.log("Salvo no db.json com sucesso!");
    } catch (erro) {
        console.error("Erro ao conectar com a API:", erro);
    }
};

    // --- MÁSCARA DE CPF ---
    if (inputCPF) {
        inputCPF.addEventListener("input", function(e) {
            let v = e.target.value.replace(/\D/g, ""); // Remove o que não é número

            // Aplica a formatação visual conforme digita
            if (v.length <= 11) {
                v = v.replace(/(\d{3})(\d)/, "$1.$2");
                v = v.replace(/(\d{3})(\d)/, "$1.$2");
                v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
            }
            e.target.value = v;
            inputCPF.classList.remove("input-erro");
        });
    }

    // --- LÓGICA DE ENTRAR ---
    if (btnEntrar) {
        btnEntrar.onclick = async function() {
            const cpfLimpio = inputCPF.value.replace(/\D/g, ""); // Apenas números para a API
            const senha = inputSenha.value.trim();
            let temErro = false;

            // Validação visual
            if (cpfLimpio.length < 11) { 
                inputCPF.classList.add("input-erro"); 
                temErro = true; 
            }
            if (senha === "") { 
                inputSenha.classList.add("input-erro"); 
                temErro = true; 
            }

            if (temErro) return;

            try {
                const response = await fetch(URL_API, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        cpf: cpfLimpio, // Enviando o CPF para a API
                        senha: senha 
                    })
                });

                const data = await response.json();
                if (response.ok) {
                    localStorage.setItem('token_acesso', data.access_token);
                    window.location.href = "./index.html";
                } else {
                    alert(data.detail || "CPF ou Senha incorretos.");
                    inputCPF.classList.add("input-erro");
                    inputSenha.classList.add("input-erro");
                }
            } catch (err) {
                alert("Erro ao conectar com o servidor da API.");
            }
        };
    }

    if (inputSenha) {
        inputSenha.oninput = () => inputSenha.classList.remove("input-erro");
    }
};
