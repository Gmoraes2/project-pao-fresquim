import api from "./api";

export async function listarVendas() {
  const response = await api.get("/vendas");
  return response.data;
}

export async function calcularTotalVenda(venda) {
  const response = await api.post("/vendas/calcular-total", venda);
  return response.data;
}

export async function gerarNotaFiscal(venda) {
  const response = await api.post("/vendas/nota-fiscal", venda);
  return response.data;
}
