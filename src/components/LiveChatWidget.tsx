import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Minimize2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  sender_type: "visitor" | "agent";
  sender_name: string | null;
  message: string;
  created_at: string;
}

interface ChatConversation {
  id: string;
  visitor_id: string;
  visitor_name: string | null;
  visitor_email: string | null;
  status: string;
}

const LiveChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [visitorName, setVisitorName] = useState("");
  const [visitorEmail, setVisitorEmail] = useState("");
  const [showNameForm, setShowNameForm] = useState(true);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Get or create visitor ID
  const getVisitorId = () => {
    let visitorId = localStorage.getItem("chat_visitor_id");
    if (!visitorId) {
      visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("chat_visitor_id", visitorId);
    }
    return visitorId;
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize conversation
  const initializeConversation = async () => {
    const visitorId = getVisitorId();
    
    try {
      // Check if conversation exists via edge function
      const { data, error } = await supabase.functions.invoke('get-chat-conversation', {
        body: { visitorId }
      });

      if (error) throw error;

      if (data?.data) {
        setConversationId(data.data.id);
        loadMessages(data.data.id);
      }
    } catch (error) {
      console.log("No existing conversation found");
    }
  };

  // Create new conversation
  const createConversation = async () => {
    const visitorId = getVisitorId();

    try {
      const { data, error } = await supabase
        .from("chat_conversations")
        .insert({
          visitor_id: visitorId,
          visitor_name: visitorName,
          visitor_email: visitorEmail,
          status: "active"
        })
        .select()
        .single();

      if (error) throw error;

      setConversationId(data.id);
      setShowNameForm(false);
      
      // Send welcome message
      await sendWelcomeMessage(data.id);
      
      toast({
        title: "Chat zahájen",
        description: "Brzy vám odpovíme!",
      });
    } catch (error) {
      console.error("Error creating conversation:", error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se zahájit chat",
        variant: "destructive"
      });
    }
  };

  // Send welcome message from "agent"
  const sendWelcomeMessage = async (convId: string) => {
    await supabase.from("chat_messages").insert({
      conversation_id: convId,
      sender_type: "agent",
      sender_name: "Podpora",
      message: `Ahoj ${visitorName}! 👋 Jsme tu pro vás. Jak vám můžeme pomoci?`
    });
  };

  // Load messages
  const loadMessages = async (convId: string) => {
    const visitorId = getVisitorId();
    
    try {
      const { data, error } = await supabase.functions.invoke('get-chat-messages', {
        body: { 
          conversationId: convId,
          visitorId 
        }
      });

      if (error) throw error;
      if (data?.data) setMessages(data.data as Message[]);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  // Subscribe to real-time messages
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`chat:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => [...prev, newMsg]);
          
          // Show notification if chat is closed
          if (!isOpen && newMsg.sender_type === "agent") {
            setUnreadCount((prev) => prev + 1);
          }
          
          // Simulate typing indicator
          if (newMsg.sender_type === "agent") {
            setIsTyping(false);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, isOpen]);

  // Initialize on mount
  useEffect(() => {
    initializeConversation();
  }, []);

  // Handle send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversationId) return;

    const messageText = newMessage.trim();
    setNewMessage("");

    try {
      const { error } = await supabase.from("chat_messages").insert({
        conversation_id: conversationId,
        sender_type: "visitor",
        sender_name: visitorName,
        message: messageText
      });

      if (error) throw error;

      // Simulate agent typing
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 2000);
      
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Chyba",
        description: "Zprávu se nepodařilo odeslat",
        variant: "destructive"
      });
    }
  };

  // Handle opening chat
  const handleOpenChat = () => {
    setIsOpen(true);
    setUnreadCount(0);
    setIsMinimized(false);
  };

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={handleOpenChat}
              size="lg"
              className="relative w-16 h-16 rounded-full shadow-2xl bg-primary hover:bg-primary/90 transition-all hover:scale-110"
            >
              <MessageCircle className="w-7 h-7 text-primary-foreground" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-destructive text-destructive-foreground rounded-full text-xs font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className={`fixed bottom-6 right-6 z-50 bg-card border-2 border-border rounded-2xl shadow-2xl overflow-hidden ${
              isMinimized ? "w-80" : "w-96 h-[600px]"
            } flex flex-col transition-all`}
          >
            {/* Header */}
            <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold">Live podpora</h3>
                  <p className="text-xs opacity-90">Obvykle odpovíme do 5 minut</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-primary-foreground hover:bg-primary-foreground/20"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-primary-foreground hover:bg-primary-foreground/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            {!isMinimized && (
              <>
                {showNameForm ? (
                  /* Name Form */
                  <div className="flex-1 p-6 flex flex-col justify-center">
                    <h4 className="text-xl font-bold text-foreground mb-2">
                      Začněme chat!
                    </h4>
                    <p className="text-sm text-muted-foreground mb-6">
                      Sdělte nám své jméno a email, abychom vás mohli lépe obsloužit.
                    </p>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (visitorName.trim()) createConversation();
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <Input
                          placeholder="Vaše jméno *"
                          value={visitorName}
                          onChange={(e) => setVisitorName(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Input
                          type="email"
                          placeholder="Email (volitelné)"
                          value={visitorEmail}
                          onChange={(e) => setVisitorEmail(e.target.value)}
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={!visitorName.trim()}>
                        Zahájit chat
                      </Button>
                    </form>
                  </div>
                ) : (
                  <>
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${
                            msg.sender_type === "visitor" ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                              msg.sender_type === "visitor"
                                ? "bg-primary text-primary-foreground"
                                : "bg-card border border-border"
                            }`}
                          >
                            {msg.sender_type === "agent" && (
                              <p className="text-xs font-semibold mb-1 text-primary">
                                {msg.sender_name || "Podpora"}
                              </p>
                            )}
                            <p className="text-sm">{msg.message}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {new Date(msg.created_at).toLocaleTimeString("cs-CZ", {
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-card border border-border rounded-2xl px-4 py-3">
                            <div className="flex gap-1">
                              <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                              <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                              <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-border bg-background">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Napište zprávu..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="flex-1"
                        />
                        <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </form>
                  </>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LiveChatWidget;
