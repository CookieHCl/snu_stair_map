"use client";

import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  duration?: number; // ms 단위, 기본값 3000
  onClose: () => void;
}

export default function Toast({ message, duration = 3000, onClose }: ToastProps) {
  const [progressWidth, setProgressWidth] = useState("100%");

  // progress bar 애니메이션 시작
  useEffect(() => {
    requestAnimationFrame(() => setProgressWidth("0%"));
  }, []);

  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      style={{
        position: "relative",
        background: "#333",
        color: "#fff",
        padding: "16px 24px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        zIndex: 9999,
        minWidth: "200px",
        textAlign: "center",
      }}
    >
      {message}
      {/* 진행 표시 바 */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: "4px",
          background: "#fff",
          width: progressWidth,
          transition: `width ${duration - 100}ms linear`,
          borderBottomLeftRadius: "8px",
          borderBottomRightRadius: "8px",
        }}
      />
    </div>
  );
}