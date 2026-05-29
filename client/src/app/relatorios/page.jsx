"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Loader2,
  Package,
  Search,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import toast from "react-hot-toast";
import { listarProdutos } from "@/services/produtoService";
import { getApiErrorMessage } from "@/services/api";
import {
  buscarRelatorio,
  marcarDividaComoPaga as marcarDividaComoPagaService,
} from "@/services/relatorioService";

const hoje = new Date();
const seteDiasAtras = new Date(hoje);
seteDiasAtras.setDate(hoje.getDate() - 6);

const formatarDataInput = (data) => data.toISOString().slice(0, 10);

const formatarMoeda = (valor) =>
  Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const formatarNumero = (valor) =>
  Number(valor || 0).toLocaleString("pt-BR", { maximumFractionDigits: 0 });

export default function RelatoriosPage() {
  const [inicio, setInicio] = useState(formatarDataInput(seteDiasAtras));
  const [fim, setFim] = useState(formatarDataInput(hoje));
  const [produtoId, setProdutoId] = useState("");
  const [produtos, setProdutos] = useState([]);
  const [relatorio, setRelatorio] = useState(null);
  const [tempoResposta, setTempoResposta] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  async function carregarProdutos() {
    try {
      const produtos = await listarProdutos();
      setProdutos(produtos);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Erro ao carregar produtos."));
    }
  }

  async function carregarRelatorio() {
    setIsLoading(true);
    const inicioTempo = performance.now();

    try {
      const params = { inicio, fim };
      if (produtoId) params.produtoId = produtoId;

      const relatorio = await buscarRelatorio(params);

      setRelatorio(relatorio);
      setTempoResposta(performance.now() - inicioTempo);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Erro ao carregar relatorio."));
    } finally {
      setIsLoading(false);
    }
  }

  async function marcarDividaComoPaga(dividaId) {
    try {
      await marcarDividaComoPagaService(dividaId);
      toast.success("Venda fiada marcada como paga.");
      await carregarRelatorio();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Erro ao baixar venda fiada."));
    }
  }

  useEffect(() => {
    carregarProdutos();
    carregarRelatorio();
    // Carregamento inicial; os filtros mudam pela acao do botao Filtrar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalDividas = useMemo(
    () =>
      relatorio?.dividas?.reduce(
        (total, divida) =>
          divida.paga ? total : total + Number(divida.valor || 0),
        0,
      ) || 0,
    [relatorio],
  );

  const dividasPendentes = useMemo(
    () => (relatorio?.dividas || []).filter((divida) => !divida.paga),
    [relatorio],
  );

  const cards = [
    {
      titulo: "Total vendido",
      valor: formatarMoeda(relatorio?.totalVendido),
      icon: DollarSign,
      cor: "text-emerald-600 bg-emerald-50",
    },
    {
      titulo: "Vendas",
      valor: formatarNumero(relatorio?.quantidadeVendas),
      icon: ShoppingBag,
      cor: "text-blue-600 bg-blue-50",
    },
    {
      titulo: "Itens vendidos",
      valor: formatarNumero(relatorio?.quantidadeItens),
      icon: Package,
      cor: "text-orange-600 bg-orange-50",
    },
    {
      titulo: "Ticket medio",
      valor: formatarMoeda(relatorio?.ticketMedio),
      icon: TrendingUp,
      cor: "text-purple-600 bg-purple-50",
    },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-start gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Relatorios</h1>
          <p className="text-gray-500">Resumo de vendas, produtos e fiado.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white border border-gray-100 px-4 py-2 rounded-xl shadow-sm">
          <Clock size={16} className="text-orange-600" />
          {tempoResposta == null
            ? "Carregando..."
            : `${(tempoResposta / 1000).toFixed(2)}s`}
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 mb-6">
        <div className="grid grid-cols-[1fr_1fr_1.3fr_auto] gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
              Inicio
            </label>
            <div className="relative">
              <Calendar
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="date"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-orange-500"
                value={inicio}
                onChange={(event) => setInicio(event.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
              Fim
            </label>
            <div className="relative">
              <Calendar
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="date"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-orange-500"
                value={fim}
                onChange={(event) => setFim(event.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
              Produto
            </label>
            <select
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-orange-500"
              value={produtoId}
              onChange={(event) => setProdutoId(event.target.value)}
            >
              <option value="">Todos os produtos</option>
              {produtos.map((produto) => (
                <option key={produto.id} value={produto.id}>
                  {produto.nome}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={carregarRelatorio}
            className="inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-3 rounded-xl"
          >
            <Search size={18} />
            Filtrar
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-16 flex flex-col items-center text-orange-600">
          <Loader2 size={36} className="animate-spin mb-3" />
          <p className="font-bold text-gray-600">Gerando relatorio...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {cards.map(({ titulo, valor, icon: Icon, cor }) => (
              <div
                key={titulo}
                className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-gray-500">
                    {titulo}
                  </span>
                  <span className={`p-2 rounded-xl ${cor}`}>
                    <Icon size={20} />
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-800">{valor}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_1fr] gap-6">
            <section className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-800 px-6 pt-6">
                  Vendas por dia
                </h2>
                <p className="text-sm text-gray-500 px-6">
                  Faturamento diario no periodo selecionado.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-[11px] uppercase text-gray-400 font-bold">
                    <tr>
                      <th className="px-6 py-4">Data</th>
                      <th className="px-6 py-4 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {(relatorio?.vendasPorDia || []).length === 0 ? (
                      <tr>
                        <td
                          colSpan="2"
                          className="px-6 py-10 text-center text-gray-500"
                        >
                          Nenhuma venda encontrada para o filtro.
                        </td>
                      </tr>
                    ) : (
                      relatorio.vendasPorDia.map((item) => (
                        <tr key={item.data}>
                          <td className="px-6 py-4 font-medium text-gray-700">
                            {item.data}
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-gray-800">
                            {formatarMoeda(item.total)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Produtos vendidos
                </h2>
                <p className="text-sm text-gray-500">
                  Ranking por faturamento, sem grafico.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b border-gray-100 text-[11px] font-bold uppercase text-gray-400">
                    <tr>
                      <th className="py-3 pr-4">Produto</th>
                      <th className="py-3 pr-4 text-right">Qtd.</th>
                      <th className="py-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-sm">
                    {(relatorio?.produtosMaisVendidos || []).length === 0 ? (
                      <tr>
                        <td
                          colSpan="3"
                          className="py-10 text-center text-gray-500"
                        >
                          Nenhum produto vendido no periodo.
                        </td>
                      </tr>
                    ) : (
                      relatorio.produtosMaisVendidos.map((item) => (
                        <tr key={item.produtoId}>
                          <td className="py-3 pr-4 font-bold text-gray-700">
                            {item.nome}
                          </td>
                          <td className="py-3 pr-4 text-right text-gray-500">
                            {formatarNumero(item.quantidade)}
                          </td>
                          <td className="py-3 text-right font-bold text-gray-800">
                            {formatarMoeda(item.total)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <section className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Clientes com compra fiada
                </h2>
                <p className="text-sm text-gray-500">
                  Total em aberto: {formatarMoeda(totalDividas)}
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 text-red-600 font-bold text-sm">
                <AlertCircle size={18} />
                {dividasPendentes.length} pendencia(s)
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-[11px] uppercase text-gray-400 font-bold">
                  <tr>
                    <th className="px-6 py-4">Cliente</th>
                    <th className="px-6 py-4">Data da compra</th>
                    <th className="px-6 py-4">Produtos</th>
                    <th className="px-6 py-4">Notificacoes</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Valor</th>
                    <th className="px-6 py-4 text-right">Baixa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(relatorio?.dividas || []).length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-10 text-center text-gray-500"
                      >
                        Nenhuma divida registrada.
                      </td>
                    </tr>
                  ) : (
                    relatorio.dividas.map((divida) => (
                      <tr key={divida.id}>
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-700">
                            {divida.cliente}
                          </p>
                          <p className="text-xs text-gray-400">
                            {divida.email || "Sem email"}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {divida.dataCompra}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {divida.produtos?.length
                            ? divida.produtos.join(", ")
                            : "Nao informado"}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {divida.datasNotificacoes?.length
                            ? divida.datasNotificacoes.join(", ")
                            : "Nenhuma"}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase ${
                              divida.paga
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-red-50 text-red-600"
                            }`}
                          >
                            {divida.paga ? "Pago" : "Em aberto"}
                          </span>
                          {divida.paga && divida.dataPagamento && (
                            <p className="mt-1 text-xs text-gray-400">
                              {divida.dataPagamento}
                            </p>
                          )}
                        </td>
                        <td
                          className={`px-6 py-4 text-right font-bold ${
                            divida.paga ? "text-gray-500" : "text-red-600"
                          }`}
                        >
                          {formatarMoeda(divida.valor)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {divida.paga ? (
                            <span className="text-xs font-bold text-gray-400">
                              Baixada
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => marcarDividaComoPaga(divida.id)}
                              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100"
                            >
                              <CheckCircle size={16} />
                              Marcar paga
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
