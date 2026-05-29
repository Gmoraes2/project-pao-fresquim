import api from "./api";

export async function listarClientes(params) {
  const response = await api.get("/clientes/listar", { params });
  return response.data;
}

export async function criarCliente(cliente) {
  const response = await api.post("/clientes/salvar", cliente);
  return response.data;
}

export async function atualizarCliente(id, cliente) {
  const response = await api.put(`/clientes/${id}`, cliente);
  return response.data;
}

export async function removerCliente(id) {
  const response = await api.delete(`/clientes/deletar/${id}`);
  return response.data;
}
