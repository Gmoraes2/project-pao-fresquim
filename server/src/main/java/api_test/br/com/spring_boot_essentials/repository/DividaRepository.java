package api_test.br.com.spring_boot_essentials.repository;

import api_test.br.com.spring_boot_essentials.model.DividaModel;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DividaRepository  extends JpaRepository<DividaModel, Integer> {

    @Override
    @EntityGraph(attributePaths = {"cliente", "notificacoes"})
    List<DividaModel> findAll();

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("delete from NotificacaoModel notificacao where notificacao.divida.cliente.id = :clienteId")
    int deletarNotificacoesPorCliente(@Param("clienteId") Integer clienteId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("delete from DividaModel divida where divida.cliente.id = :clienteId")
    int deletarPorCliente(@Param("clienteId") Integer clienteId);
}
