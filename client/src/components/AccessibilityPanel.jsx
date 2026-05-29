"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Accessibility,
  Eye,
  HelpCircle,
  Minus,
  Plus,
  RotateCcw,
  X,
} from "lucide-react";

const ZOOM_LEVELS = [
  { label: "75%", value: 75 },
  { label: "85%", value: 85 },
  { label: "90%", value: 90 },
  { label: "100%", value: 100 },
  { label: "112%", value: 112 },
  { label: "125%", value: 125 },
  { label: "140%", value: 140 },
  { label: "160%", value: 160 },
  { label: "180%", value: 180 },
  { label: "200%", value: 200 },
];

const CONTRAST_OPTIONS = [
  { label: "Padrao", value: "default" },
  { label: "Alto contraste", value: "high" },
  { label: "Daltonismo", value: "colorblind" },
  { label: "Escala de cinza", value: "gray" },
];

const SHORTCUTS = {
  F2: "/vendas",
  F3: "/produtos",
  F4: "/clientes",
  F6: "/funcionarios",
  F7: "/relatorios",
  F8: "/registro-ponto",
  F9: "/cameras",
};

const HELP_SECTIONS = [
  {
    title: "Atalhos do teclado",
    items: [
      "F1 ou F12 abre a ajuda do sistema.",
      "Esc fecha a ajuda aberta ou volta para o dashboard.",
      "F2 abre Vendas, F3 Produtos, F4 Clientes e F6 Funcionarios.",
      "F7 abre Relatorios, F8 Registro de Ponto e F9 Cameras.",
    ],
  },
  {
    title: "Como fazer uma venda",
    items: [
      "Abra Vendas pelo menu ou pelo atalho F2.",
      "Busque o produto por nome, categoria ou codigo de barras.",
      "Clique no botao de adicionar para colocar o produto no carrinho.",
      "Escolha cliente e forma de pagamento.",
      "Clique em Finalizar Venda para gerar a nota.",
    ],
  },
  {
    title: "Como cadastrar produto",
    items: [
      "Abra Produtos pelo menu ou pelo atalho F3.",
      "Clique em Novo Produto.",
      "Preencha nome, categoria, codigo de barras, preco e estoque.",
      "Salve o cadastro e confira se o item apareceu na tabela.",
    ],
  },
  {
    title: "Como cadastrar cliente",
    items: [
      "Abra Clientes pelo menu ou pelo atalho F4.",
      "Clique em Novo Cliente.",
      "Preencha CPF, contato e situacao do cliente.",
      "Use o status do cliente para controlar compras fiadas.",
    ],
  },
  {
    title: "Como cadastrar funcionario",
    items: [
      "Abra Funcionarios pelo menu ou pelo atalho F6.",
      "Clique em Novo Funcionario.",
      "Preencha dados pessoais, cargo, salario, admissao e endereco.",
      "Ferias so podem ser registradas apos um ano da data de admissao.",
    ],
  },
  {
    title: "Registro de ponto",
    items: [
      "Abra Registro de Ponto pelo menu ou pelo atalho F8.",
      "Selecione o funcionario.",
      "Registre entrada, saida para almoco, volta do almoco e saida.",
      "Confira o historico logo abaixo dos botoes.",
    ],
  },
  {
    title: "Acessibilidade",
    items: [
      "Clique no botao de acessibilidade no canto superior direito para abrir os controles.",
      "Use A+ e A- para aumentar ou reduzir a fonte do sistema entre 75% e 200%.",
      "Use contraste alto para melhorar leitura em ambientes claros ou escuros.",
      "Use modo Daltonismo para substituir cores criticas por uma paleta mais distinguivel.",
      "Use Esc para fechar janelas de ajuda quando estiverem abertas.",
    ],
  },
];

function getInitialZoom() {
  if (typeof window === "undefined") return 100;
  return Number(window.localStorage.getItem("accessibility.zoom") || 100);
}

function getInitialContrast() {
  if (typeof window === "undefined") return "default";
  return window.localStorage.getItem("accessibility.contrast") || "default";
}

export default function AccessibilityPanel() {
  const router = useRouter();
  const [zoom, setZoom] = useState(getInitialZoom);
  const [contrast, setContrast] = useState(getInitialContrast);
  const [helpOpen, setHelpOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  const zoomIndex = useMemo(() => {
    const index = ZOOM_LEVELS.findIndex((level) => level.value === zoom);
    return index >= 0 ? index : 0;
  }, [zoom]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${zoom}%`;
    document.documentElement.dataset.contrast = contrast;
    window.localStorage.setItem("accessibility.zoom", String(zoom));
    window.localStorage.setItem("accessibility.contrast", contrast);
  }, [zoom, contrast]);

  useEffect(() => {
    function handleKeyDown(event) {
      const key = event.key.toUpperCase();

      if (key === "ESCAPE") {
        event.preventDefault();
        if (helpOpen) {
          setHelpOpen(false);
        } else if (panelOpen) {
          setPanelOpen(false);
        } else {
          router.push("/");
        }
        return;
      }

      if (key === "F1" || key === "F12") {
        event.preventDefault();
        setHelpOpen(true);
        return;
      }

      const route = SHORTCUTS[key];
      if (route) {
        event.preventDefault();
        router.push(route);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [helpOpen, panelOpen, router]);

  const changeZoom = (direction) => {
    const nextIndex =
      direction === "increase"
        ? Math.min(zoomIndex + 1, ZOOM_LEVELS.length - 1)
        : Math.max(zoomIndex - 1, 0);

    setZoom(ZOOM_LEVELS[nextIndex].value);
  };

  const reset = () => {
    setZoom(100);
    setContrast("default");
  };

  return (
    <>
      <section
        aria-label="Ferramentas de acessibilidade"
        className="fixed right-4 top-4 z-40 flex flex-col items-end gap-2"
      >
        <span className="sr-only" aria-live="polite">
          Zoom atual {zoom} por cento. Contraste {contrast}.
        </span>

        <button
          type="button"
          onClick={() => setPanelOpen((current) => !current)}
          className="inline-flex h-11 w-11 items-center justify-center border border-orange-700 bg-orange-600 text-white shadow-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-800"
          aria-expanded={panelOpen}
          aria-controls="accessibility-controls"
          aria-label="Abrir ou fechar painel de acessibilidade"
          title="Acessibilidade"
        >
          <Accessibility size={22} />
        </button>

        {panelOpen && (
          <div
            id="accessibility-controls"
            className="w-[min(92vw,22rem)] border border-slate-300 bg-white p-3 shadow-lg"
          >
            <div className="mb-3 flex items-center justify-between border-b border-slate-200 pb-2">
              <strong className="text-sm font-black text-slate-900">
                Acessibilidade
              </strong>
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-600"
                aria-label="Fechar painel de acessibilidade"
                title="Fechar painel"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => changeZoom("decrease")}
            className="inline-flex h-9 w-9 items-center justify-center border border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-600"
            aria-label="Diminuir tamanho da fonte"
            title="Diminuir fonte"
          >
            <Minus size={17} />
          </button>

          <span className="min-w-14 text-center text-sm font-bold text-slate-800">
            {ZOOM_LEVELS[zoomIndex].label}
          </span>

          <button
            type="button"
            onClick={() => changeZoom("increase")}
            className="inline-flex h-9 w-9 items-center justify-center border border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-600"
            aria-label="Aumentar tamanho da fonte"
            title="Aumentar fonte"
          >
            <Plus size={17} />
          </button>

          <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <Eye size={17} aria-hidden="true" />
            <select
              value={contrast}
              onChange={(event) => setContrast(event.target.value)}
              className="border border-slate-300 bg-white px-2 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-600"
              aria-label="Modo de contraste"
            >
              {CONTRAST_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={reset}
            className="inline-flex h-9 w-9 items-center justify-center border border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-600"
            aria-label="Restaurar acessibilidade padrao"
            title="Restaurar padrao"
          >
            <RotateCcw size={17} />
          </button>

          <button
            type="button"
            onClick={() => setHelpOpen(true)}
            className="inline-flex h-9 items-center gap-2 border border-orange-700 bg-orange-600 px-3 text-sm font-bold text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-800"
            aria-label="Abrir ajuda do sistema"
            title="Ajuda do sistema"
          >
            <HelpCircle size={17} />
            Help
          </button>
        </div>
          </div>
        )}
      </section>

      {helpOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="system-help-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4"
        >
          <section className="max-h-[86vh] w-full max-w-4xl overflow-hidden border border-slate-300 bg-white shadow-2xl">
            <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h2
                  id="system-help-title"
                  className="text-xl font-black text-slate-900"
                >
                  Ajuda do sistema
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Guia rapido de operacao, atalhos e recursos de acessibilidade.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setHelpOpen(false)}
                className="border border-slate-300 p-2 text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-600"
                aria-label="Fechar ajuda"
              >
                <X size={20} />
              </button>
            </header>

            <div className="max-h-[70vh] overflow-y-auto p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {HELP_SECTIONS.map((section) => (
                  <article
                    key={section.title}
                    className="border border-slate-200 bg-slate-50 p-4"
                  >
                    <h3 className="text-base font-black text-slate-900">
                      {section.title}
                    </h3>
                    <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-700">
                      {section.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ol>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
