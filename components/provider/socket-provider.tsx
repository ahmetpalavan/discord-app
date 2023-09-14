"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { io as ClientIO } from "socket.io-client";

type SocketContextType = {
  socket: any | null;
  isConnecting: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnecting: true,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<any | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const socket = new (ClientIO as any)(process.env.NEXT_PUBLIC_SITE_URL!, {
      path: "/api/socket/io",
      addTrailingSlash: false,
    });
    socket.on("connect", () => {
      setIsConnecting(true);
    });
    socket.on("disconnect", () => {
      setIsConnecting(false);
    });
    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  return <SocketContext.Provider value={{ socket, isConnecting }}>{children}</SocketContext.Provider>;
};
