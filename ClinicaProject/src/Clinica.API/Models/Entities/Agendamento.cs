public class Agendamento
{
    public int Id { get; set; }
    public int IdPaciente { get; private set; }
    public int IdTerapeuta { get; private set; }
    public string Status { get; private set; }

    public Agendamento(int idPaciente, int idTerapeuta, string status = "PENDENTE")
    {
        string[] statusPermitidos = { "PENDENTE", "CONFIRMADO", "CANCELADO", "REALIZADO", "NO_SHOW" };
        
        if (Array.IndexOf(statusPermitidos, status.ToUpper()) == -1)
            throw new ArgumentException("Status de agendamento inválido.");

        IdPaciente = idPaciente;
        IdTerapeuta = idTerapeuta;
        Status = status.ToUpper();
    }
}