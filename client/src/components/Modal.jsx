"use client";

import { X } from "lucide-react";

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
    >
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 bg-orange-50/40 p-6">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="border border-slate-200 p-2 text-gray-500 transition-colors hover:bg-white hover:text-gray-700"
            aria-label="Fechar modal"
            title="Fechar"
          >
            <X size={22} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
