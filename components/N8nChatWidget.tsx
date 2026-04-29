"use client";

import { useState } from "react";

export default function N8nChatWidget() {
  const [visible, setVisible] = useState(false);

  const toggleChat = () => {
    setVisible((v) => !v);
  };

  return (
    <>
      {/* Botón flotante - Lado izquierdo */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 left-6 z-[9999] flex items-center gap-2 bg-[#2d7a3e] hover:bg-[#1e5a2a] text-white border-none rounded-full px-5 py-3 shadow-lg transition-all duration-300 hover:scale-105"
        aria-label={visible ? "Cerrar chat" : "Abrir chat de asistencia"}
      >
        {visible ? (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="text-sm font-medium">Cerrar</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-sm font-medium">Asistente</span>
          </>
        )}
      </button>

      {/* Iframe del chatbot - Lado izquierdo */}
      {visible && (
        <div className="fixed bottom-24 left-6 z-[9998] animate-in slide-in-from-bottom-4 duration-300">
          <iframe
            src="https://n8n.neuralflow.space/webhook/3b4b4795-e0ee-4755-9d16-3db27739e5f1/chat"
            title="Chat de asistencia Juan Becerra"
            className="w-[380px] h-[600px] border-0 rounded-2xl shadow-2xl"
            style={{
              maxHeight: 'calc(100vh - 140px)',
            }}
          />
        </div>
      )}
    </>
  );
}
