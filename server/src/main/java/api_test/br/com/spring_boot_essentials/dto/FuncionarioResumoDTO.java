package api_test.br.com.spring_boot_essentials.dto;

public record FuncionarioResumoDTO(
        Integer id,
        String nome,
        String cargo,
        String status
) {}
