"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { API_LOADING_EVENT } from "@/services/api";

export default function GlobalApiLoader() {
  const [state, setState] = useState({
    showLoader: false,
    pendingRequests: 0,
  });

  useEffect(() => {
    function handleLoading(event) {
      setState({
        showLoader: Boolean(event.detail?.showLoader),
        pendingRequests: Number(event.detail?.pendingRequests || 0),
      });
    }

    window.addEventListener(API_LOADING_EVENT, handleLoading);
    return () => window.removeEventListener(API_LOADING_EVENT, handleLoading);
  }, []);

  if (!state.showLoader) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed right-4 top-4 z-[70] flex items-center gap-3 border border-orange-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-lg"
    >
      <Loader2 size={18} className="animate-spin text-orange-600" />
      <span>
        Servidor respondendo
        {state.pendingRequests > 1 ? ` (${state.pendingRequests})` : ""}...
      </span>
    </div>
  );
}
