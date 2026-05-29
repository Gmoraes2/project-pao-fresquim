import "./globals.css";
import Sidebar from "@/components/Sidebar";
import AccessibilityPanel from "@/components/AccessibilityPanel";
import GlobalApiLoader from "@/components/GlobalApiLoader";

import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Padaria System - Gestão de Vendas",
  description: "Sistema interno da Padaria Pão FresQUIM",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className="bg-gray-50 text-gray-900">
        <a
          href="#conteudo-principal"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:px-4 focus:py-3 focus:font-bold focus:text-orange-700 focus:ring-2 focus:ring-orange-600"
        >
          Ir para o conteudo principal
        </a>
        <div className="flex">
          <Sidebar />

          <main id="conteudo-principal" className="flex-1 ml-64 min-h-screen">
            {children}

            <Toaster
              position="top-center"
              toastOptions={{
                duration: 3000,
                style: {
                  background: "#fff",
                  color: "#374151",
                  fontWeight: "bold",
                },
                success: {
                  style: {
                    border: "1px solid #a7f3d0",
                  },
                },
                error: {
                  style: {
                    border: "1px solid #fecaca",
                  },
                },
              }}
            />
          </main>
        </div>
        <GlobalApiLoader />
        <AccessibilityPanel />
      </body>
    </html>
  );
}
