import { socket } from "./socket";
import React from "react";

export default function useWebSocket(){
  const [isConnected, setIsConnected] = React.useState(socket.connected);

  React.useEffect(() => {
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  return {
    emit: socket.emit.bind(socket),
    on: (ev, cb) => {
      socket.off(ev);
      socket.on(ev, cb);
    },
    isConnected,
  };
};