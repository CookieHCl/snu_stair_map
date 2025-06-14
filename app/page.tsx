import ToastProvider from "@/components/toast/ToastProvider";
import Homepage from "./homepage";

export default function App() {
  return (
    <ToastProvider>
      <Homepage />
    </ToastProvider>
  );
}