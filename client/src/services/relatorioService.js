import api from "./api";

export async function buscarRelatorio(params) {
  const response = await api.get("/relatorios", { params });
  return response.data;
}

export async function marcarDividaComoPaga(dividaId) {
  const response = await api.patch(`/dividas/${dividaId}/pagar`);
  return response.data;
}
