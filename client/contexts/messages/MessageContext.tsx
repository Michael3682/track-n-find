"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface MessageContextType {
  showMessage: boolean;
  setShowMessage: (value: boolean) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export function MessageProvider({ children }: { children: ReactNode }) {
  const [showMessage, setShowMessage] = useState(false);

  return (
    <MessageContext.Provider value={{ showMessage, setShowMessage }}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessage() {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessage must be used within MessageProvider");
  }
  return context;
}