import api from "./api";

export async function listarFuncionarios(params) {
  const response = await api.get("/funcionarios/listar", { params });
  return response.data;
}

export async function listarFuncionariosResumo(params) {
  const response = await api.get("/funcionarios/resumo", { params });
  return response.data;
}

export async function cadastrarFuncionario(funcionario) {
  const response = await api.post("/funcionarios/cadastrar", funcionario);
  return response.data;
}

export async function atualizarFuncionario(id, funcionario) {
  const response = await api.put(`/funcionarios/${id}`, funcionario);
  return response.data;
}

export async function removerFuncionario(id) {
  const response = await api.delete(`/funcionarios/${id}`);
  return response.data;
}
