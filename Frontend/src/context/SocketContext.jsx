import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    const newSocket = io(import.meta.env.VITE_SOCKET_URL, { // ✅ no more hardcoded localhost
      withCredentials: true,
      reconnection: true,
    });

    newSocket.on("connect", () => {
      console.log("🟢 Socket connected:", newSocket.id);
      setSocket(newSocket);
    });

    newSocket.on("connect_error", (err) =>
      console.log("🔴 Socket error:", err.message)
    );

    socketRef.current = newSocket;

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [currentUser?.id]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);