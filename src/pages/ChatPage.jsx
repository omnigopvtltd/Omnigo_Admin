// import { MessageSquare, Wifi, WifiOff, Loader2 } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { useSocket } from "@/hooks/useSocket";

// const THREADS = [
//   { pair: "Customer ↔ Rider", desc: "Live delivery coordination" },
//   { pair: "Customer ↔ Restaurant", desc: "Order clarifications" },
//   { pair: "Admin ↔ Customer", desc: "Support & disputes" },
//   { pair: "Admin ↔ Rider", desc: "Dispatch & incidents" },
//   { pair: "Admin ↔ Restaurant", desc: "Onboarding & payouts" },
// ];

// const STATUS_META = {
//   idle: { label: "Not connected", icon: WifiOff, className: "text-muted-foreground" },
//   connecting: { label: "Connecting…", icon: Loader2, className: "text-warning animate-spin" },
//   connected: { label: "Connected", icon: Wifi, className: "text-success" },
//   error: { label: "Couldn't reach socket server", icon: WifiOff, className: "text-destructive" },
// };

// export default function ChatPage() {
//   const { status, connect } = useSocket("/chat");
//   const meta = STATUS_META[status];
//   const StatusIcon = meta.icon;

//   return (
//     <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
//       <Card className="lg:col-span-2">
//         <CardHeader>
//           <CardTitle>Conversation Types</CardTitle>
//           <CardDescription>Five channels the platform routes messages through</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-2">
//           {THREADS.map((t) => (
//             <div
//               key={t.pair}
//               className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
//             >
//               <div className="flex items-center gap-3">
//                 <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy/10 text-navy">
//                   <MessageSquare className="h-4 w-4" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-foreground">{t.pair}</p>
//                   <p className="text-xs text-muted-foreground">{t.desc}</p>
//                 </div>
//               </div>
//               <Badge variant="secondary">No messages yet</Badge>
//             </div>
//           ))}
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Realtime Connection</CardTitle>
//           <CardDescription>socket.io-client status for this session</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2.5">
//             <StatusIcon className={`h-4 w-4 ${meta.className}`} />
//             <span className="text-sm font-medium text-foreground">{meta.label}</span>
//           </div>
//           <p className="text-xs leading-relaxed text-muted-foreground">
//             No chat server is running yet, so this will show a connection error until one is
//             deployed at <code className="rounded bg-muted px-1 py-0.5">VITE_SOCKET_URL</code>.
//             The hook and UI are wired and ready.
//           </p>
//           <Button className="w-full" onClick={connect} disabled={status === "connecting"}>
//             {status === "connecting" ? "Connecting…" : "Test Connection"}
//           </Button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, 
  Wifi, 
  WifiOff, 
  Loader2, 
  Phone, 
  PhoneOff, 
  Send, 
  Users,
  Search,
  UserCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import { useSocket } from "@/hooks/useSocket";
import { 
  useConversations, 
  useMessages, 
  useSendMessage, 
  useMarkConversationRead 
} from "@/hooks/useChat";
import { getOrCreateConversation, getContacts } from "@/api/chat";
import { useCall } from "@/hooks/useCall";

const senderId = "6a50f90383cbf83bbac2b5f2"

const THREAD_METADATA = {
  customer_rider: "Customer ↔ Rider",
  customer_restaurant: "Customer ↔ Restaurant",
  admin_customer: "Admin ↔ Customer",
  admin_rider: "Admin ↔ Rider",
  admin_restaurant: "Admin ↔ Restaurant"
};

const STATUS_META = {
  idle: { label: "Not connected", icon: WifiOff, className: "text-muted-foreground" },
  connecting: { label: "Connecting…", icon: Loader2, className: "text-amber-500 animate-spin" },
  connected: { label: "Connected", icon: Wifi, className: "text-emerald-500" },
  error: { label: "Server Unreachable", icon: WifiOff, className: "text-destructive" },
};

export default function ChatPage() {
  const [selectedConvoId, setSelectedConvoId] = useState(null);
  const [inputText, setInputText] = useState("");
  const [activeTab, setActiveTab] = useState("chats"); // 'chats' | 'contacts'
  const [searchQuery, setSearchQuery] = useState("");
  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [startingChat, setStartingChat] = useState(false);

  const messagesEndRef = useRef(null);

  // Real-time Connection Status
  const { status, connect } = useSocket("/chat");
  const meta = STATUS_META[status] || STATUS_META.idle;
  const StatusIcon = meta.icon;

  // React Query / Custom Hooks
  const { data: convoData, isLoading: loadingConvos, refetch: refetchConvos } = useConversations();
  const conversations = convoData?.conversations || [];

  const { messages, isLoading: loadingMessages, addLocalMessage } = useMessages(selectedConvoId);
  const sendMessageMutation = useSendMessage();
  const markReadMutation = useMarkConversationRead();

  // WebRTC Call Hook
  const { 
    callState, 
    remoteName, 
    duration, 
    remoteAudioRef, 
    acceptCall, 
    hangUp 
  } = useCall();

  // Helper to resolve display name & role of participant
  const getParticipantDetails = (convo) => {
    if (!convo) return { name: "Unknown", role: "General" };
    
    if (convo.customerId) {
      return { 
        name: convo.customerId.name || convo.customerId.fullName || "Customer", 
        role: "Customer",
        subType: convo.type 
      };
    }
    if (convo.riderId) {
      return { 
        name: convo.riderId.name || convo.riderId.fullName || "Rider", 
        role: "Rider",
        subType: convo.type 
      };
    }
    if (convo.restaurantId) {
      return { 
        name: convo.restaurantId.name || convo.restaurantId.title || "Restaurant", 
        role: "Restaurant",
        subType: convo.type 
      };
    }
    return { name: "Direct Thread", role: convo.type || "Support" };
  };

  const activeConvo = conversations.find((c) => c._id === selectedConvoId);
  const activeParticipant = getParticipantDetails(activeConvo);

  // Fetch contacts list when switching to directory tab
  useEffect(() => {
    if (activeTab === "contacts") {
      setLoadingContacts(true);
      getContacts(searchQuery)
        .then((res) => {
          setContacts(res.contacts || res || []);
        })
        .catch(console.error)
        .finally(() => setLoadingContacts(false));
    }
  }, [activeTab, searchQuery]);

  // Auto-mark read on selection
  useEffect(() => {
    if (selectedConvoId) {
      markReadMutation.mutate({ id: selectedConvoId });
    }
  }, [selectedConvoId]);

  // Auto-scroll message feed
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectContact = async (user) => {
    try {
      setStartingChat(true);

      const userRole = (user.role || "customer").toLowerCase();
      
      // Determine conversation type dynamically based on role
      const type = `admin_${userRole}`;

      const payload = {
        type,
        // Match the field expected in your Conversation schema
        customerId: userRole === "customer" ? user._id : undefined,
        riderId: userRole === "rider" ? user._id : undefined,
        adminId: senderId,
        senderRole: "admin"
        // restaurantId: userRole === "restaurant" ? user._id : undefined,
      };

      const convo = await getOrCreateConversation(payload);
      await refetchConvos();
      
      setSelectedConvoId(convo._id || convo);
      setActiveTab("chats");
    } catch (err) {
      console.error("Failed to start chat with user:", err);
    } finally {
      setStartingChat(false);
    }
  };

  // WhatsApp-style: Select user -> Get existing or create new thread
  // const handleSelectContact = async (user) => {
  //   try {
  //     setStartingChat(true);

  //     const payload = {
  //       type: `admin_${user.role.toLowerCase()}`,
  //       [`${user.role.toLowerCase()}Id`]: user._id,
  //     };

  //     const convo = await getOrCreateConversation(payload);
  //     await refetchConvos();
      
  //     setSelectedConvoId(convo._id);
  //     setActiveTab("chats");
  //   } catch (err) {
  //     console.error("Failed to start chat with user:", err);
  //   } finally {
  //     setStartingChat(false);
  //   }
  // };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedConvoId) return;

    const text = inputText;
    setInputText("");
  console.log(selectedConvoId, text, senderId);

    sendMessageMutation.mutate(
      { conversationId: selectedConvoId, text },
      {
        onSuccess: (newMessage) => {
          addLocalMessage(newMessage);
        }
      }
    );
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 h-[calc(100vh-6rem)]">
      <audio ref={remoteAudioRef} autoPlay />

      {/* WEBRTC OVERLAY */}
      {callState !== "idle" && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <Card className="w-full max-w-md text-center p-6 space-y-4 shadow-2xl">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto animate-pulse">
              <Phone className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{remoteName || "Audio Call"}</h3>
              <p className="text-sm text-muted-foreground capitalize mt-1">
                {callState} {callState === "connected" && `(${duration}s)`}
              </p>
            </div>

            <div className="flex justify-center gap-4 pt-2">
              {callState === "ringing" && (
                <Button 
                  size="lg" 
                  className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-6"
                  onClick={acceptCall}
                >
                  <Phone className="h-5 w-5 mr-2" /> Answer
                </Button>
              )}
              <Button 
                size="lg" 
                variant="destructive" 
                className="rounded-full px-6"
                onClick={hangUp}
              >
                <PhoneOff className="h-5 w-5 mr-2" /> End Call
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* LEFT PANEL: CONVERSATIONS & DIRECTORY */}
      <div className="flex flex-col gap-4 lg:col-span-1 overflow-hidden">
        <Card className="flex-1 flex flex-col min-h-0">
          <CardHeader className="pb-3 pt-4 px-4">
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-lg">Messages</CardTitle>
              {/* Tab Selector */}
              <div className="flex bg-muted p-1 rounded-lg text-xs">
                <button
                  onClick={() => setActiveTab("chats")}
                  className={`px-3 py-1 rounded-md font-medium transition-all ${
                    activeTab === "chats"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Chats
                </button>
                <button
                  onClick={() => setActiveTab("contacts")}
                  className={`px-3 py-1 rounded-md font-medium transition-all ${
                    activeTab === "contacts"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Directory
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder={activeTab === "chats" ? "Search chats..." : "Search users by name..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 text-xs h-8"
              />
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto space-y-1.5 px-3">
            {/* TAB 1: ACTIVE CONVERSATIONS */}
            {activeTab === "chats" && (
              loadingConvos ? (
                <div className="flex justify-center py-8 text-muted-foreground text-xs">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading chats...
                </div>
              ) : conversations.length === 0 ? (
                <div className="text-center py-8 text-xs text-muted-foreground">
                  No active conversations found. Switch to Directory to start one!
                </div>
              ) : (
                conversations
                  .filter((c) => {
                    const participant = getParticipantDetails(c);
                    return participant.name.toLowerCase().includes(searchQuery.toLowerCase());
                  })
                  .map((convo) => {
                    const { name, role } = getParticipantDetails(convo);
                    const isSelected = selectedConvoId === convo._id;

                    return (
                      <div
                        key={convo._id}
                        onClick={() => setSelectedConvoId(convo._id)}
                        className={`flex items-center justify-between rounded-lg border p-2.5 cursor-pointer transition-colors ${
                          isSelected 
                            ? "border-primary bg-primary/5" 
                            : "border-border hover:bg-accent/50"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
                            {name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="text-xs font-semibold text-foreground truncate">{name}</p>
                              <span className="text-[10px] text-muted-foreground font-mono bg-muted px-1.5 py-0.2 rounded shrink-0">
                                {role}
                              </span>
                            </div>
                            <p className="text-[11px] text-muted-foreground truncate">
                              {convo.lastMessage?.text || "No messages yet"}
                            </p>
                          </div>
                        </div>

                        {convo.unreadCount > 0 && (
                          <Badge variant="default" className="shrink-0 text-[10px] px-1.5 py-0.5">
                            {convo.unreadCount}
                          </Badge>
                        )}
                      </div>
                    );
                  })
              )
            )}

            {/* TAB 2: USER DIRECTORY (Start conversation with anyone) */}
            {activeTab === "contacts" && (
              loadingContacts || startingChat ? (
                <div className="flex justify-center py-8 text-muted-foreground text-xs">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" /> 
                  {startingChat ? "Opening chat..." : "Loading directory..."}
                </div>
              ) : contacts.length === 0 ? (
                <div className="text-center py-8 text-xs text-muted-foreground">
                  No registered users found matching query.
                </div>
              ) : (
                contacts.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => handleSelectContact(user)}
                    className="flex items-center justify-between rounded-lg border border-border p-2.5 cursor-pointer hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground text-xs font-semibold">
                        {(user.name || user.fullName || "U").charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">
                          {user.name || user.fullName}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {user.email || user.phone || "User Contact"}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[9px] capitalize shrink-0">
                      {user.role || "User"}
                    </Badge>
                  </div>
                ))
              )
            )}
          </CardContent>
        </Card>

        {/* Real-time Connection Indicator */}
        <Card className="shrink-0">
          <CardContent className="py-2 px-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StatusIcon className={`h-3.5 w-3.5 ${meta.className}`} />
                <span className="text-[11px] font-medium text-foreground">{meta.label}</span>
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-6 text-[10px] px-2"
                onClick={connect} 
                disabled={status === "connecting"}
              >
                Reconnect
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RIGHT PANEL: ACTIVE CHAT MESSAGES */}
      <Card className="lg:col-span-2 flex flex-col h-full overflow-hidden">
        {selectedConvoId && activeConvo ? (
          <>
            {/* Header */}
            <CardHeader className="py-3 px-4 border-b flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                  {activeParticipant.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-sm font-semibold">
                      {activeParticipant.name}
                    </CardTitle>
                    <Badge variant="secondary" className="text-[10px]">
                      {activeParticipant.role}
                    </Badge>
                  </div>
                  <CardDescription className="text-[10px]">
                    Thread: {THREAD_METADATA[activeConvo.type] || activeConvo.type}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            {/* Message Feed */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
              {loadingMessages ? (
                <div className="flex justify-center py-12 text-muted-foreground text-xs">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading history...
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-xs">
                  <MessageSquare className="h-8 w-8 mb-2 opacity-30" />
                  No messages yet. Send a greeting to start chatting!
                </div>
              ) : (
                messages.map((msg) => {
                  const isUser = msg.senderRole === "admin";

                  return (
                    <div
                      key={msg._id || Math.random()}
                      className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-xs ${
                          isUser
                            ? "bg-primary text-primary-foreground rounded-br-xs"
                            : "bg-muted text-foreground rounded-bl-xs"
                        }`}
                      >
                        <p className="leading-relaxed">{msg.text}</p>
                      </div>
                      <span className="text-[9px] text-muted-foreground mt-0.5 px-1">
                        {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Input Bar */}
            <div className="p-3 border-t bg-background">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Message ${activeParticipant.name}...`}
                  className="flex-1 text-xs h-9"
                />
                <Button type="submit" size="sm" className="h-9 w-9 p-0" disabled={!inputText.trim()}>
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-2 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <MessageSquare className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="font-medium text-foreground text-sm">No Conversation Selected</p>
            <p className="text-xs text-center max-w-xs text-muted-foreground">
              Select an active thread or switch to the <strong>Directory</strong> tab to message any rider, customer, or partner.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}