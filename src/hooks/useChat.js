// import { useEffect, useState } from "react";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import {
//   getConversations,
//   getMessages,
//   sendMessage,
//   markConversationRead,
// } from "@/api/chat";
// import { useSocket } from "@/hooks/useSocket";

// export function useConversations(filters = {}) {
//   return useQuery({
//     queryKey: ["conversations", filters],
//     queryFn: () => getConversations(filters),
//     placeholderData: (prev) => prev,
//     refetchInterval: 8000, // stand-in for live updates until a socket server is connected
//   });
// }

// export function useMarkConversationRead() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ id, role }) => markConversationRead(id, role),
//     onSuccess: () =>
//       queryClient.invalidateQueries({ queryKey: ["conversations"] }),
//   });
// }

// /**
//  * Messages for one open conversation, plus a live socket subscription.
//  * Falls back to a fetch-on-open flow when no socket server is connected so
//  * the thread still works fully in the demo.
//  */
// export function useMessages(conversationId) {
//   const [messages, setMessages] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const { socket, status, connect } = useSocket("/chat");
//   const queryClient = useQueryClient();

//   useEffect(() => {
//     if (!conversationId) return;
//     setIsLoading(true);
//     getMessages(conversationId).then((data) => {
//       setMessages(data);
//       setIsLoading(false);
//     });
//   }, [conversationId]);

//   // Join the live room once connected (no-op until a real server exists)
//   useEffect(() => {
//     if (!conversationId) return;
//     connect();
//   }, [conversationId, connect]);

//   useEffect(() => {
//     if (!socket || status !== "connected" || !conversationId) return;
//     socket.emit("chat:joinConversation", conversationId);

//     function onNewMessage({ conversationId: cid, message }) {
//       if (cid !== conversationId) return;
//       setMessages((prev) => [...prev, message]);
//       queryClient.invalidateQueries({ queryKey: ["conversations"] });
//     }

//     socket.on("chat:newMessage", onNewMessage);
//     return () => {
//       socket.emit("chat:leaveConversation", conversationId);
//       socket.off("chat:newMessage", onNewMessage);
//     };
//   }, [socket, status, conversationId, queryClient]);

//   return {
//     messages,
//     isLoading,
//     socketStatus: status,
//     addLocalMessage: (msg) => setMessages((prev) => [...prev, msg]),
//   };
// }

// export function useSendMessage() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     // mutationFn: ({ conversationId, text, senderRole }) => sendMessage(conversationId, { text, senderRole, senderId }),
//     // onSuccess: () => queryClient.invalidateQueries({ queryKey: ["conversations"] }),
//     /////////////////////////////
//     // Fixed: explicit destruction of senderId from the payload
//     mutationFn: ({
//       conversationId,
//       text,
//       senderRole,
//       senderId,
//       receiverId,
//       receiverRole,
//     }) =>
//       sendMessage(conversationId, {
//         text,
//         senderRole,
//         senderId,
//         receiverId,
//         receiverRole,
//       }),
//     onSuccess: () =>
//       queryClient.invalidateQueries({ queryKey: ["conversations"] }),
//   });
// }
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { axiosClient } from "@/api/axiosClient";

/**
 * Fetch active conversations for a user.
 */
export function useConversations(userId, role) {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    // Dynamic field name fallback
    const fieldName = role ? `${role}Id` : "adminId";
    const q = userId
      ? query(
          collection(db, "conversations"),
          where(fieldName, "==", userId),
          orderBy("updatedAt", "desc")
        )
      : query(collection(db, "conversations"), orderBy("updatedAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const convos = snapshot.docs.map((docSnap) => ({
          _id: docSnap.id,
          ...docSnap.data(),
        }));
        setConversations(convos);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching conversations:", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId, role]);

  return {
    data: { conversations },
    isLoading,
  };
}

/**
 * Mark a conversation as read
 */
export function useMarkConversationRead() {
  return useMutation({
    mutationFn: async ({ id }) => {
      if (!id) return;
      const convoRef = doc(db, "conversations", id);
      await updateDoc(convoRef, { unreadCount: 0 });
    },
  });
}

/**
 * Real-time message listener for a specific conversation
 */
export function useMessages(conversationId) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const messagesRef = collection(
      db,
      "conversations",
      conversationId,
      "messages"
    );
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msgs = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            _id: docSnap.id,
            ...data,
            createdAt: data.createdAt?.toDate
              ? data.createdAt.toDate().toISOString()
              : new Date().toISOString(),
          };
        });
        setMessages(msgs);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching messages:", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [conversationId]);

  return {
    messages,
    isLoading,
    socketStatus: "connected",
    addLocalMessage: (msg) => setMessages((prev) => [...prev, msg]),
  };
}

/**
 * Mutation to send a message
 */
export function useSendMessage() {
  return useMutation({
    mutationFn: async ({ conversationId, text, senderRole = "admin", senderId = "6a7b574e5cf4c5a6bba1a982" }) => {
      if (!conversationId || !text) return;

      const messageData = {
        text,
        senderRole,
        senderId,
        createdAt: serverTimestamp(),
      };

      const messagesRef = collection(
        db,
        "conversations",
        conversationId,
        "messages"
      );
      const newMsgRef = await addDoc(messagesRef, messageData);

      const convoRef = doc(db, "conversations", conversationId);
      await updateDoc(convoRef, {
        lastMessage: {
          text,
          createdAt: new Date().toISOString(),
        },
        updatedAt: serverTimestamp(),
      });

      return {
        _id: newMsgRef.id,
        ...messageData,
        createdAt: new Date().toISOString(),
      };
    },
  });
}

/**
 * Firestore fallback helper for getOrCreateConversation
 */
/**
 * Firestore fallback helper for getOrCreateConversation
 */
export async function getOrCreateConversation(payload) {
  const { type, userId, riderId, restaurantId, adminId } = payload;
  const convosRef = collection(db, "conversations");

  try {
    // 1. Check existing conversations (Simple Query)
    let q;
    if (userId) {
      q = query(convosRef, where("userId._id", "==", userId));
    } else if (riderId) {
      q = query(convosRef, where("riderId._id", "==", riderId));
    } else if (restaurantId) {
      q = query(convosRef, where("restaurantId._id", "==", restaurantId));
    }

    if (q) {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const existingDoc = querySnapshot.docs[0];
        return { _id: existingDoc.id, ...existingDoc.data() };
      }
    }
  } catch (e) {
    console.warn("Firestore query error or index missing, creating new record...", e);
  }

  // 2. Fallback: Create new doc record
  const newConvoData = {
    type: type || "admin_user",
    adminId: adminId || "6a7b574e5cf4c5a6bba1a982",
    ...(userId && { userId: { _id: userId } }),
    ...(riderId && { riderId: { _id: riderId } }),
    ...(restaurantId && { restaurantId: { _id: restaurantId } }),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    unreadCount: 0,
    lastMessage: { text: "Chat started", createdAt: new Date().toISOString() },
  };

  const docRef = await addDoc(convosRef, newConvoData);
  return { _id: docRef.id, ...newConvoData };
}

/**
 * Fetch contacts list (Users, Riders, Vendors) from MongoDB via Express Backend
 */
export async function getContacts(searchQuery = "") {
  try {
    const response = await axiosClient.get("/chat/contacts", {
      params: { search: searchQuery }
    });

    console.log(response);
    
    // Return array of contacts from API response
    return response.data?.contacts || response.data || [];
  } catch (error) {
    console.error("Failed to fetch contacts from MongoDB:", error);
    throw error;
  }
}