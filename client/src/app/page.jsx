"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BadgeHelp,
  BarChart3,
  Camera,
  Clock,
  HelpCircle,
  Package,
  ShoppingCart,
  UserCog,
  Users,
  X,
} from "lucide-react";

const atalhos = [
  {
    tecla: "F1",
    acao: "Abrir ajuda",
    descricao: "Mostra a lista de atalhos disponiveis no sistema.",
  },
  {
    tecla: "ESC",
    acao: "Sair / fechar",
    descricao: "Fecha a ajuda aberta. Fora da ajuda, volta para o dashboard.",
  },
  {
    tecla: "F2",
    acao: "Vendas",
    descricao: "Abre o caixa para registrar uma nova venda.",
    href: "/vendas",
  },
  {
    tecla: "F3",
    acao: "Produtos",
    descricao: "Abre o cadastro e controle de estoque.",
    href: "/produtos",
  },
  {
    tecla: "F4",
    acao: "Clientes",
    descricao: "Abre a base de clientes e situacao de fiado.",
    href: "/clientes",
  },
  {
    tecla: "F6",
    acao: "Funcionarios",
    descricao: "Abre o cadastro da equipe.",
    href: "/funcionarios",
  },
  {
    tecla: "F7",
    acao: "Relatorios",
    descricao: "Abre os indicadores e pendencias financeiras.",
    href: "/relatorios",
  },
  {
    tecla: "F8",
    acao: "Ponto",
    descricao: "Abre o registro de ponto dos funcionarios.",
    href: "/registro-ponto",
  },
  {
    tecla: "F9",
    acao: "Cameras",
    descricao: "Abre a tela de monitoramento.",
    href: "/cameras",
  },
  {
    tecla: "F12",
    acao: "Ajuda tecnica",
    descricao:
      "Mostra este help com um aviso: no navegador, F12 tambem pode abrir as ferramentas de desenvolvedor.",
  },
];

const cards = [
  {
    titulo: "Nova venda",
    texto: "Abrir caixa, buscar produtos e finalizar pagamento.",
    href: "/vendas",
    tecla: "F2",
    icon: ShoppingCart,
  },
  {
    titulo: "Estoque",
    texto: "Cadastrar produto, conferir preco e quantidade.",
    href: "/produtos",
    tecla: "F3",
    icon: Package,
  },
  {
    titulo: "Clientes",
    texto: "Consultar contatos, CPF e status do fiado.",
    href: "/clientes",
    tecla: "F4",
    icon: Users,
  },
  {
    titulo: "Equipe",
    texto: "Gerenciar funcionarios, cargos e salarios.",
    href: "/funcionarios",
    tecla: "F6",
    icon: UserCog,
  },
  {
    titulo: "Relatorios",
    texto: "Ver resumo de vendas, produtos vendidos e dividas.",
    href: "/relatorios",
    tecla: "F7",
    icon: BarChart3,
  },
  {
    titulo: "Ponto",
    texto: "Registrar entrada, saida e horarios de almoco.",
    href: "/registro-ponto",
    tecla: "F8",
    icon: Clock,
  },
  {
    titulo: "Cameras",
    texto: "Abrir monitoramento interno da padaria.",
    href: "/cameras",
    tecla: "F9",
    icon: Camera,
  },
];

function ShortcutHelp({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
      <section className="w-full max-w-3xl border border-slate-200 bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <BadgeHelp size={22} className="text-orange-600" />
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Ajuda de atalhos
              </h2>
              <p className="text-sm text-slate-500">
                Comandos de teclado para navegar mais rapido.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="border border-slate-200 p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Fechar ajuda"
            title="Fechar ajuda"
          >
            <X size={18} />
          </button>
        </header>

        <div className="max-h-[70vh] overflow-y-auto">
          <table className="w-full text-left">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3">Tecla</th>
                <th className="px-6 py-3">Acao</th>
                <th className="px-6 py-3">O que faz</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {atalhos.map((atalho) => (
                <tr key={atalho.tecla}>
                  <td className="px-6 py-4">
                    <kbd className="border border-slate-300 bg-slate-100 px-3 py-1 font-mono text-xs font-bold text-slate-800">
                      {atalho.tecla}
                    </kbd>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-800">
                    {atalho.acao}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {atalho.descricao}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default function HomePage() {
  const [helpAberto, setHelpAberto] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-8 flex items-start justify-between gap-6">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-orange-600">
            Painel operacional
          </p>
          <h1 className="text-3xl font-black text-slate-900">Dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Acesse rapidamente as rotinas do sistema e use os atalhos de teclado
            para operar sem depender do menu lateral.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setHelpAberto(true)}
          className="inline-flex items-center gap-2 border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 hover:border-orange-300 hover:text-orange-700"
        >
          <HelpCircle size={18} />
          Ajuda F1
        </button>
      </div>

      <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="border border-slate-200 bg-white p-5">
          <span className="text-xs font-bold uppercase text-slate-400">
            Atalho principal
          </span>
          <p className="mt-3 text-2xl font-black text-slate-900">F2</p>
          <p className="mt-1 text-sm text-slate-500">Abrir vendas</p>
        </div>
        <div className="border border-slate-200 bg-white p-5">
          <span className="text-xs font-bold uppercase text-slate-400">
            Saida rapida
          </span>
          <p className="mt-3 text-2xl font-black text-slate-900">ESC</p>
          <p className="mt-1 text-sm text-slate-500">Fechar ajuda ou voltar</p>
        </div>
        <div className="border border-slate-200 bg-white p-5">
          <span className="text-xs font-bold uppercase text-slate-400">
            Help
          </span>
          <p className="mt-3 text-2xl font-black text-slate-900">F1 / F12</p>
          <p className="mt-1 text-sm text-slate-500">Mostrar comandos</p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {cards.map(({ titulo, texto, href, tecla, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group border border-slate-200 bg-white p-5 transition-colors hover:border-orange-300 hover:bg-orange-50/40"
          >
            <div className="mb-5 flex items-center justify-between">
              <span className="inline-flex h-10 w-10 items-center justify-center border border-slate-200 bg-slate-50 text-slate-700 group-hover:border-orange-300 group-hover:text-orange-700">
                <Icon size={20} />
              </span>
              <kbd className="border border-slate-300 bg-slate-100 px-2 py-1 font-mono text-xs font-bold text-slate-700">
                {tecla}
              </kbd>
            </div>
            <h2 className="text-lg font-black text-slate-900">{titulo}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{texto}</p>
          </Link>
        ))}
      </section>

      {helpAberto && <ShortcutHelp onClose={() => setHelpAberto(false)} />}
    </div>
  );
}
