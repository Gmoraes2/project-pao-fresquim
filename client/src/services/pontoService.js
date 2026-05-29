import api from "./api";

export async function listarPontosPorFuncionario(funcionarioId) {
  const response = await api.get(`/pontos/funcionario/${funcionarioId}`);
  return response.data;
}

export async function registrarPonto(funcionarioId, tipo) {
  const response = await api.post(
    `/pontos/funcionario/${funcionarioId}/registrar/${tipo}`,
  );
  return response.data;
}
