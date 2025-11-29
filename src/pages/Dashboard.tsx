import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MessageSquare, Package, MapPin, Clock, Euro } from "lucide-react";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  package_type: string;
  preferred_date: string;
  preferred_time: string;
  total_price: number;
  status: string;
  created_at: string;
  notes?: string;
}

interface ChatConversation {
  id: string;
  visitor_name: string | null;
  visitor_email: string | null;
  status: string;
  created_at: string;
  messages: ChatMessage[];
}

interface ChatMessage {
  id: string;
  message: string;
  sender_type: string;
  sender_name: string | null;
  created_at: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    setUser(user);
    await loadUserData(user.email!);
    setLoading(false);
  };

  const loadUserData = async (email: string) => {
    try {
      // Load reservations
      const { data: reservationsData, error: reservationsError } = await supabase
        .from("reservations")
        .select("*")
        .eq("email", email)
        .order("created_at", { ascending: false });

      if (reservationsError) throw reservationsError;
      setReservations(reservationsData || []);

      // Load chat conversations
      const { data: conversationsData, error: conversationsError } = await supabase
        .from("chat_conversations")
        .select(`
          *,
          messages:chat_messages(*)
        `)
        .eq("visitor_email", email)
        .order("created_at", { ascending: false });

      if (conversationsError) throw conversationsError;
      setConversations(conversationsData || []);
    } catch (error: any) {
      toast({
        title: "Chyba",
        description: "Nepodařilo se načíst vaše data",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "confirmed":
        return "bg-green-500";
      case "completed":
        return "bg-blue-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Čeká na potvrzení";
      case "confirmed":
        return "Potvrzeno";
      case "completed":
        return "Dokončeno";
      case "cancelled":
        return "Zrušeno";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-32 pb-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Vítejte zpět!</h1>
          <p className="text-muted-foreground">
            Zde najdete přehled vašich rezervací a zpráv
          </p>
        </div>

        <Tabs defaultValue="reservations" className="space-y-6">
          <TabsList>
            <TabsTrigger value="reservations" className="gap-2">
              <CalendarDays className="h-4 w-4" />
              Moje rezervace
            </TabsTrigger>
            <TabsTrigger value="chats" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Moje konverzace
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reservations" className="space-y-4">
            {reservations.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CalendarDays className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center">
                    Zatím nemáte žádné rezervace
                  </p>
                </CardContent>
              </Card>
            ) : (
              reservations.map((reservation) => (
                <Card key={reservation.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Package className="h-5 w-5" />
                          {reservation.package_type}
                        </CardTitle>
                        <CardDescription>
                          Rezervace z {format(new Date(reservation.created_at), "d. MMMM yyyy", { locale: cs })}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(reservation.status)}>
                        {getStatusText(reservation.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{reservation.address}, {reservation.city}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {format(new Date(reservation.preferred_date), "d. MMMM yyyy", { locale: cs })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{reservation.preferred_time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Euro className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{reservation.total_price} Kč</span>
                      </div>
                    </div>
                    {reservation.notes && (
                      <div className="pt-3 border-t">
                        <p className="text-sm text-muted-foreground">
                          <strong>Poznámky:</strong> {reservation.notes}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="chats" className="space-y-4">
            {conversations.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center">
                    Zatím nemáte žádné konverzace
                  </p>
                </CardContent>
              </Card>
            ) : (
              conversations.map((conversation) => (
                <Card key={conversation.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <MessageSquare className="h-5 w-5" />
                          Konverzace
                        </CardTitle>
                        <CardDescription>
                          {format(new Date(conversation.created_at), "d. MMMM yyyy HH:mm", { locale: cs })}
                        </CardDescription>
                      </div>
                      <Badge variant={conversation.status === "active" ? "default" : "secondary"}>
                        {conversation.status === "active" ? "Aktivní" : "Uzavřeno"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {conversation.messages?.map((message: ChatMessage) => (
                        <div
                          key={message.id}
                          className={`p-3 rounded-lg ${
                            message.sender_type === "visitor"
                              ? "bg-primary/10 ml-8"
                              : "bg-muted mr-8"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold">
                              {message.sender_type === "visitor" ? "Vy" : "Podpora"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(message.created_at), "HH:mm")}
                            </span>
                          </div>
                          <p className="text-sm">{message.message}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
