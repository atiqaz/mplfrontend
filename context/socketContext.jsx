import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { baseUrl } from "../helper/useAxios";
import { Snackbar, Portal } from "react-native-paper";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [allOnlineUsers, setAllOnlineUsers] = useState([]);

  useEffect(() => {
    const newSocket = io(baseUrl, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      timeout: 10000,
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    newSocket.on("auctionStarted", (data) => {
      const message = `${data._doc.title} auction has ${data._doc.status}`;
      console.log({ auctionStarted: data._doc });
      setSnackbarMessage(message);
      setSnackbarVisible(true);
    });

    return () => {
      newSocket.disconnect();
      newSocket.off("auctionStarted");
      console.log("Socket disconnected on cleanup");
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      <Portal>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={4000}
          action={{
            label: 'Dismiss',
            onPress: () => setSnackbarVisible(false),
          }}
        >
          {snackbarMessage}
        </Snackbar>
      </Portal>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
