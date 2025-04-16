import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { baseUrl } from "../helper/useAxios";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
const [allOnlineUsers, setAllOnlineUsers]=useState([])

  useEffect(() => {
    // Initialize the socket connection
    const newSocket = io(baseUrl, {
      autoConnect: true, // Automatically connect
      reconnection: true, // Attempt reconnection on disconnect
      reconnectionAttempts: 5, // Number of reconnection attempts
      timeout: 10000, // Timeout for connection
    });

    setSocket(newSocket);

    // Event listeners
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

    newSocket.on('auctionStarted',(data)=>{
      console.log({auctionStarted:data._doc})
      alert('New Auction started')
      })
    // newSocket.on("onlineUsers",(users)=>{
    //   console.log("allOnlineUsers",users)
    // })
    // Cleanup the connection when the component unmounts
    return () => {
      newSocket.disconnect();
      newSocket.off('auctionStarted')
      // newSocket.off("onlineUsers")
      console.log("Socket disconnected on cleanup");
    };
  }, []);

  
  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use the SocketContext
export const useSocket = () => useContext(SocketContext);
