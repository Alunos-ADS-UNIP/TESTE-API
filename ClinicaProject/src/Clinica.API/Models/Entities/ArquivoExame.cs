public class ArquivoExame
{
    public int Id { get; set; }
    public string CaminhoStorage { get; set; }
    public long? TamanhoBytes { get; set; }

    public ArquivoExame(string caminho, long? tamanho = null)
    {
        if (string.IsNullOrWhiteSpace(caminho) || caminho.Length > 500)
            throw new ArgumentException("Caminho do storage inválido ou muito longo.");

        CaminhoStorage = caminho;
        TamanhoBytes = tamanho;
    }
}