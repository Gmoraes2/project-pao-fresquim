package api_test.br.com.spring_boot_essentials.service;

import api_test.br.com.spring_boot_essentials.dto.FuncionarioResumoDTO;
import api_test.br.com.spring_boot_essentials.exception.RecursoNaoEncontradoException;
import api_test.br.com.spring_boot_essentials.exception.RegraNegocioException;
import api_test.br.com.spring_boot_essentials.model.FuncionarioModel;
import api_test.br.com.spring_boot_essentials.repository.FuncionarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class FuncionarioService {

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    @Transactional(readOnly = true)
    public List<FuncionarioModel> listarTodos() {
        return funcionarioRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<FuncionarioResumoDTO> listarResumo() {
        return funcionarioRepository.listarResumo();
    }

    public FuncionarioModel cadastrarFuncionario(FuncionarioModel funcionario) {
        validarFerias(funcionario);
        vincularLicencas(funcionario);
        return funcionarioRepository.save(funcionario);
    }

    public FuncionarioModel listarFuncionario(FuncionarioModel funcionario) {
        return funcionarioRepository.findById(funcionario.getId()).orElseThrow(() ->
                new RecursoNaoEncontradoException("Funcionário não encontrado com ID: " + funcionario.getId()));
    }

    public FuncionarioModel atualizarFuncionario(FuncionarioModel funcionario) {
        funcionarioRepository.findById(funcionario.getId()).orElseThrow(() ->
                new RecursoNaoEncontradoException("Funcionário não encontrado com ID: " + funcionario.getId()));

        validarFerias(funcionario);
        vincularLicencas(funcionario);
        return funcionarioRepository.save(funcionario);
    }

    public void deletarFuncionario(Integer id) {
        funcionarioRepository.findById(id).orElseThrow(() ->
                new RecursoNaoEncontradoException("Funcionário não encontrado com ID: " + id));

        funcionarioRepository.deleteById(id);
    }
    private void vincularLicencas(FuncionarioModel funcionario) {
        if (funcionario.getLicencas() == null) {
            return;
        }

        funcionario.getLicencas().forEach(licenca -> licenca.setFuncionario(funcionario));
    }

    private void validarFerias(FuncionarioModel funcionario) {
        boolean statusFerias = "Férias".equalsIgnoreCase(funcionario.getStatus());
        boolean possuiLicencaFerias = funcionario.getLicencas() != null &&
                funcionario.getLicencas().stream()
                        .anyMatch(licenca -> "Férias".equalsIgnoreCase(licenca.getTipoLicenca()));

        if (!statusFerias && !possuiLicencaFerias) {
            return;
        }

        LocalDate dataAdmissao = funcionario.getDataAdmissao();
        if (dataAdmissao == null || LocalDate.now().isBefore(dataAdmissao.plusYears(1))) {
            throw new RegraNegocioException(
                    "Funcionario so pode acessar ferias apos 1 ano da data de admissao."
            );
        }
    }
}
