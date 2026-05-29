package api_test.br.com.spring_boot_essentials.repository;

import api_test.br.com.spring_boot_essentials.dto.VendaResumoDTO;
import api_test.br.com.spring_boot_essentials.model.VendaModel;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface VendaRepository extends JpaRepository<VendaModel, Integer> {

    @Override
    @EntityGraph(attributePaths = {"itens", "itens.produto", "pagamento", "funcionario"})
    List<VendaModel> findAll();

    List<VendaModel> findByDataVendaBetween(LocalDate inicio, LocalDate fim);

    @EntityGraph(attributePaths = {"itens", "itens.produto", "pagamento", "funcionario"})
    List<VendaModel> findDistinctByDataVendaBetween(LocalDate inicio, LocalDate fim);

    @Query("""
            select new api_test.br.com.spring_boot_essentials.dto.VendaResumoDTO(
                venda.id,
                venda.dataVenda,
                venda.valorTotal,
                coalesce(sum(item.quantidade), 0),
                pagamento.tipo,
                funcionario.nome
            )
            from VendaModel venda
            left join venda.itens item
            left join venda.pagamento pagamento
            left join venda.funcionario funcionario
            group by venda.id, venda.dataVenda, venda.valorTotal, pagamento.tipo, funcionario.nome
            order by venda.id
            """)
    List<VendaResumoDTO> listarResumo();

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("update VendaModel venda set venda.cliente = null where venda.cliente.id = :clienteId")
    int desvincularCliente(@Param("clienteId") Integer clienteId);
}
