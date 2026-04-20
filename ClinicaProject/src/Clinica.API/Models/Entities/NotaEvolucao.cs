public class NotaEvolucao
{
    public int Id { get; set; }
    public int IdProntuario { get; set; }
    public int IdTerapeuta { get; set; }
    public int? IdAgendamento { get; set; } // Opcional
    public string TextoEvolucao { get; set; }

    public NotaEvolucao(int idProntuario, int idTerapeuta, string texto, int? idAgendamento = null)
    {
        if (string.IsNullOrWhiteSpace(texto) || texto.Length > 5000)
            throw new ArgumentException("O texto da evolução é obrigatório e limita-se a 5000 caracteres.");

        IdProntuario = idProntuario;
        IdTerapeuta = idTerapeuta;
        TextoEvolucao = texto;
        IdAgendamento = idAgendamento;
    }
}