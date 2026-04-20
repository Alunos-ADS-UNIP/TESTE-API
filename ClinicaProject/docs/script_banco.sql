CREATE TABLE usuario(
    id INTEGER PRIMARY KEY,

    nome TEXT NOT NULL CHECK (length(nome) <= 100),
    email TEXT NOT NULL UNIQUE CHECK (length(email) <= 255),
    cpf TEXT NOT NULL UNIQUE CHECK (length(cpf) <= 14),
    senha TEXT NOT NULL CHECK (length(senha) >= 8 AND length(senha) <= 20),
    
    tipo_perfil TEXT NOT NULL CHECK (tipo_perfil IN ('PACIENTE', 'TERAPEUTA')),
    
    aceite_lgpd INTEGER NOT NULL DEFAULT 0 CHECK (aceite_lgpd IN (0, 1))
);

CREATE TABLE agendamento (
    id INTEGER PRIMARY KEY,
    
    id_paciente INTEGER NOT NULL,
    id_terapeuta INTEGER NOT NULL,
    
    status TEXT NOT NULL DEFAULT 'PENDENTE' 
        CHECK (status IN ('PENDENTE', 'CONFIRMADO', 'CANCELADO', 'REALIZADO', 'NO_SHOW')),
    
    FOREIGN KEY (id_paciente) REFERENCES usuario (id),
    FOREIGN KEY (id_terapeuta) REFERENCES usuario (id)
);

CREATE TABLE prontuario (
    id INTEGER PRIMARY KEY,
    
    id_paciente INTEGER NOT NULL,
    id_terapeuta INTEGER NOT NULL,
    
    versao INTEGER NOT NULL DEFAULT 1,
    
    descricao TEXT CHECK (length(descricao) <= 5000),
    
    FOREIGN KEY (id_paciente) REFERENCES usuario (id),
    FOREIGN KEY (id_terapeuta) REFERENCES usuario (id)
);

CREATE TABLE nota_evolucao (
    id INTEGER PRIMARY KEY,
    
    id_prontuario INTEGER NOT NULL,
    id_terapeuta INTEGER NOT NULL,
    
    id_agendamento INTEGER,
    
    texto_evolucao TEXT NOT NULL CHECK (length(texto_evolucao) <= 5000),
    data_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_prontuario) REFERENCES prontuario (id),
    FOREIGN KEY (id_terapeuta) REFERENCES usuario (id),
    FOREIGN KEY (id_agendamento) REFERENCES agendamento (id)
);

CREATE TABLE arquivo_exame (
    id INTEGER PRIMARY KEY,
    
    caminho_storage VARCHAR(500) NOT NULL CHECK (length(caminho_storage) <= 500),
    
    tamanho_bytes INTEGER,
    
    nome_arquivo TEXT CHECK (length(nome_arquivo) <= 255),
    tipo_mime TEXT,
    data_upload DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    id_prontuario INTEGER,
    FOREIGN KEY (id_prontuario) REFERENCES prontuario (id)
);