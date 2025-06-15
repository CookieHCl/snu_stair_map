"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import Toast from "./Toast";

interface ToastContextType {
  showToast: (message: string, duration?: number) => void;
}

interface ToastItem {
  id: number;
  message: string;
  duration: number;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};

let toastId = 0;

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, duration = 3000) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, duration }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  }, []);

  const handleClose = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className="toast-container"
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column-reverse",
          gap: "8px",
          width: "350px",
          maxWidth: "90vw",
        }}
      >
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            duration={toast.duration}
            onClose={() => handleClose(toast.id)}
          />
        ))}
      </div>
      <style jsx global>{`
        @media (max-width: 600px) {
          .toast-container {
            width: 90vw !important;
            max-width: 90vw !important;
            right: 5vw !important;
            top: 5vw !important;
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
};