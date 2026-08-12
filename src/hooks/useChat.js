import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getConversations, getMessages, sendMessage, markConversationRead,
} from "@/api/chat";
import { useSocket } from "@/hooks/useSocket";

export function useConversations(filters = {}) {
  return useQuery({
    queryKey: ["conversations", filters],
    queryFn: () => getConversations(filters),
    placeholderData: (prev) => prev,
    refetchInterval: 8000, // stand-in for live updates until a socket server is connected
  });
}

export function useMarkConversationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }) => markConversationRead(id, role),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["conversations"] }),
  });
}

/**
 * Messages for one open conversation, plus a live socket subscription.
 * Falls back to a fetch-on-open flow when no socket server is connected so
 * the thread still works fully in the demo.
 */
export function useMessages(conversationId) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { socket, status, connect } = useSocket("/chat");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!conversationId) return;
    setIsLoading(true);
    getMessages(conversationId).then((data) => {
      setMessages(data);
      setIsLoading(false);
    });
  }, [conversationId]);

  // Join the live room once connected (no-op until a real server exists)
  useEffect(() => {
    if (!conversationId) return;
    connect();
  }, [conversationId, connect]);

  useEffect(() => {
    if (!socket || status !== "connected" || !conversationId) return;
    socket.emit("chat:joinConversation", conversationId);

    function onNewMessage({ conversationId: cid, message }) {
      if (cid !== conversationId) return;
      setMessages((prev) => [...prev, message]);
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    }

    socket.on("chat:newMessage", onNewMessage);
    return () => {
      socket.emit("chat:leaveConversation", conversationId);
      socket.off("chat:newMessage", onNewMessage);
    };
  }, [socket, status, conversationId, queryClient]);

  return {
    messages,
    isLoading,
    socketStatus: status,
    addLocalMessage: (msg) => setMessages((prev) => [...prev, msg]),
  };
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    // mutationFn: ({ conversationId, text, senderRole }) => sendMessage(conversationId, { text, senderRole, senderId }),
    // onSuccess: () => queryClient.invalidateQueries({ queryKey: ["conversations"] }),
    /////////////////////////////
    // Fixed: explicit destruction of senderId from the payload
    mutationFn: ({ conversationId, text, senderRole, senderId }) =>
      sendMessage(conversationId, { text, senderRole, senderId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["conversations"] }),
  });
}