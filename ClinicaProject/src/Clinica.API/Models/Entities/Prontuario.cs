public class Prontuario
{
    public int Id { get; set; }
    public int IdPaciente { get; set; }
    public int IdTerapeuta { get; set; }
    public int Versao { get; set; } = 1;
    public string Descricao { get; set; }

    public Prontuario(int idPaciente, int idTerapeuta, string descricao)
    {
        if (string.IsNullOrWhiteSpace(descricao)) throw new ArgumentException("A descrição não pode ser vazia.");
        IdPaciente = idPaciente;
        IdTerapeuta = idTerapeuta;
        Descricao = descricao;
    }
}