using System;
using System.Text.RegularExpressions;

public class Usuario
{
    public int Id { get; set; }
    public string Nome { get; private set; }
    public string Email { get; private set; }
    public string Cpf { get; private set; }
    public string Senha { get; private set; }
    public string TipoPerfil { get; private set; }
    public bool AceiteLgpd { get; private set; }

    public Usuario(string nome, string email, string cpf, string senha, string tipoPerfil, bool aceiteLgpd)
    {
        // Validação de LGPD (Obrigatório ser true)
        if (!aceiteLgpd) 
            throw new ArgumentException("É obrigatório aceitar os termos da LGPD para criar um usuário.");

        // Validação de Nome (Máximo 100)
        if (string.IsNullOrWhiteSpace(nome) || nome.Length > 100)
            throw new ArgumentException("Nome é obrigatório e deve ter no máximo 100 caracteres.");

        // Validação de Email (Regex básico)
        if (!Regex.IsMatch(email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
            throw new ArgumentException("O formato do e-mail é inválido.");

        // Validação de CPF (Garante que não esteja vazio, ideal seria uma função de cálculo de dígitos)
        if (string.IsNullOrWhiteSpace(cpf) || cpf.Length < 11)
            throw new ArgumentException("CPF inválido.");

        // Validação de Perfil
        if (tipoPerfil != "PACIENTE" && tipoPerfil != "TERAPEUTA")
            throw new ArgumentException("O perfil deve ser PACIENTE ou TERAPEUTA.");

        if (senha.Length < 8)
            throw new ArgumentException("A senha deve ter no mínimo 8 caracteres.");

        Nome = nome;
        Email = email;
        Cpf = cpf;
        Senha = senha;
        TipoPerfil = tipoPerfil;
        AceiteLgpd = aceiteLgpd;
    }
}