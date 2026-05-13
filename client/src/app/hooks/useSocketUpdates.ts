import { useEffect } from "react";
import { io } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const socketUrl =
  import.meta.env.VITE_SOCKET_URL || apiUrl.replace(/\/api\/?$/, "").replace(/\/+$/, "");

export function useSocketUpdates(scope = "operations") {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = io(socketUrl, {
      withCredentials: true,
      reconnectionAttempts: 5,
    });

    socket.emit("join:dashboard", scope);

    const invalidate = () => {
      queryClient.invalidateQueries({ queryKey: ["officer", "complaints"] });
      queryClient.invalidateQueries({ queryKey: ["complaints"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "intelligence"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      queryClient.invalidateQueries({ queryKey: ["citizen", "profile"] });
    };

    socket.on("ai:queued", invalidate);
    socket.on("ai:processing", invalidate);
    socket.on("ai:completed", invalidate);
    socket.on("ai:failed", invalidate);
    socket.on("complaint:updated", invalidate);
    socket.on("complaint:feedback", invalidate);

    return () => {
      socket.disconnect();
    };
  }, [queryClient, scope]);
}
