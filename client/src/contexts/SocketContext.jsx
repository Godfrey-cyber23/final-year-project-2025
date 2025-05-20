import { createContext, useContext } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  // Read the URL from Vite env
  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

  // Initialize the socket
  const socket = io(SOCKET_URL);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
