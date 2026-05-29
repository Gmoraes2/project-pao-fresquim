package api_test.br.com.spring_boot_essentials.repository;

import api_test.br.com.spring_boot_essentials.dto.FuncionarioResumoDTO;
import api_test.br.com.spring_boot_essentials.model.FuncionarioModel;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FuncionarioRepository extends JpaRepository<FuncionarioModel, Integer> {

    @Override
    @EntityGraph(attributePaths = {"licencas"})
    List<FuncionarioModel> findAll();

    @Query("""
            select new api_test.br.com.spring_boot_essentials.dto.FuncionarioResumoDTO(
                funcionario.id,
                funcionario.nome,
                funcionario.cargo,
                funcionario.status
            )
            from FuncionarioModel funcionario
            order by funcionario.nome
            """)
    List<FuncionarioResumoDTO> listarResumo();
}
