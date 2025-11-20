import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
  id: string;
  name: string;
  city: string;
  timeAgo: string;
}

const RealtimeSocialProof = () => {
  const [notification, setNotification] = useState<Notification | null>(null);
  const [show, setShow] = useState(false);

  // Mock names and cities for demo purposes
  const mockNotifications: Notification[] = [
    { id: "1", name: "Jana", city: "Černošice", timeAgo: "před 3 minutami" },
    { id: "2", name: "Petr", city: "Radotín", timeAgo: "před 8 minutami" },
    { id: "3", name: "Marie", city: "Zbraslav", timeAgo: "před 12 minutami" },
    { id: "4", name: "Tomáš", city: "Černošice", timeAgo: "před 15 minutami" },
    { id: "5", name: "Eva", city: "Radotín", timeAgo: "před 20 minutami" },
  ];

  useEffect(() => {
    // Show initial notification after 5 seconds
    const initialTimer = setTimeout(() => {
      const randomNotification = mockNotifications[Math.floor(Math.random() * mockNotifications.length)];
      setNotification(randomNotification);
      setShow(true);
    }, 5000);

    // Subscribe to real-time reservations
    const channel = supabase
      .channel('reservations-social-proof')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'reservations'
        },
        (payload: any) => {
          const newReservation = payload.new;
          setNotification({
            id: newReservation.id,
            name: newReservation.name.split(' ')[0], // First name only
            city: newReservation.city,
            timeAgo: "právě teď"
          });
          setShow(true);
        }
      )
      .subscribe();

    // Rotate mock notifications every 15-30 seconds
    const rotationInterval = setInterval(() => {
      const randomNotification = mockNotifications[Math.floor(Math.random() * mockNotifications.length)];
      setNotification(randomNotification);
      setShow(true);
    }, Math.random() * 15000 + 15000); // 15-30 seconds

    return () => {
      clearTimeout(initialTimer);
      clearInterval(rotationInterval);
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setShow(false);
      }, 8000); // Hide after 8 seconds

      return () => clearTimeout(timer);
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && notification && (
        <motion.div
          initial={{ x: -400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -400, opacity: 0 }}
          className="fixed bottom-24 md:bottom-8 left-4 md:left-8 z-50 max-w-sm"
        >
          <div className="bg-card border border-border rounded-lg shadow-lg p-4 flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">
                {notification.name} z {notification.city}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                právě rezervoval/a úklid {notification.timeAgo}
              </p>
            </div>
            <button
              onClick={() => setShow(false)}
              className="text-muted-foreground hover:text-foreground text-xs"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RealtimeSocialProof;
