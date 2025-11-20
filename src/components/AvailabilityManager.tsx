import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { CalendarIcon, Clock, Lock, Unlock, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvailabilitySlot {
  id: string;
  date: string;
  time_slot: string;
  is_available: boolean;
  max_bookings: number;
  current_bookings: number;
  blocked_reason?: string;
}

const AvailabilityManager = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [blockReason, setBlockReason] = useState("");
  const [maxBookings, setMaxBookings] = useState(2);
  const { toast } = useToast();

  const timeSlots = [
    "08:00 - 10:00",
    "10:00 - 12:00",
    "12:00 - 14:00",
    "14:00 - 16:00",
    "16:00 - 18:00",
  ];

  useEffect(() => {
    if (selectedDate) {
      loadSlots();
    }

    // Setup realtime subscription
    const channel = supabase
      .channel('availability-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'availability_slots',
        },
        () => {
          if (selectedDate) {
            loadSlots();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedDate]);

  const loadSlots = async () => {
    if (!selectedDate) return;

    setLoading(true);
    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const { data, error } = await supabase
        .from("availability_slots")
        .select("*")
        .eq("date", dateStr)
        .order("time_slot");

      if (error) throw error;

      // If no slots exist for this date, create default ones
      if (!data || data.length === 0) {
        await createDefaultSlots(dateStr);
        await loadSlots(); // Reload after creation
        return;
      }

      setSlots(data as AvailabilitySlot[]);
    } catch (error) {
      console.error("Error loading slots:", error);
      toast({
        title: "Chyba při načítání termínů",
        description: "Zkuste to prosím znovu",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createDefaultSlots = async (dateStr: string) => {
    const defaultSlots = timeSlots.map((slot) => ({
      date: dateStr,
      time_slot: slot,
      is_available: true,
      max_bookings: 2,
      current_bookings: 0,
    }));

    await supabase.from("availability_slots").insert(defaultSlots);
  };

  const toggleSlotAvailability = async (slot: AvailabilitySlot) => {
    try {
      const { error } = await supabase
        .from("availability_slots")
        .update({
          is_available: !slot.is_available,
          blocked_reason: !slot.is_available ? null : blockReason || "Blokováno administrátorem",
        })
        .eq("id", slot.id);

      if (error) throw error;

      toast({
        title: slot.is_available ? "Termín zablokován" : "Termín odblokován",
        description: `${slot.time_slot} byl ${slot.is_available ? "zablokován" : "odblokován"}`,
      });

      setBlockReason("");
    } catch (error) {
      console.error("Error toggling slot:", error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se změnit dostupnost termínu",
        variant: "destructive",
      });
    }
  };

  const updateMaxBookings = async (slot: AvailabilitySlot) => {
    try {
      const { error } = await supabase
        .from("availability_slots")
        .update({
          max_bookings: maxBookings,
          is_available: slot.current_bookings < maxBookings,
        })
        .eq("id", slot.id);

      if (error) throw error;

      toast({
        title: "Kapacita aktualizována",
        description: `Maximum rezervací nastaveno na ${maxBookings}`,
      });
    } catch (error) {
      console.error("Error updating max bookings:", error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se aktualizovat kapacitu",
        variant: "destructive",
      });
    }
  };

  const blockAllSlots = async () => {
    if (!selectedDate) return;

    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const { error } = await supabase
        .from("availability_slots")
        .update({
          is_available: false,
          blocked_reason: blockReason || "Blokováno administrátorem",
        })
        .eq("date", dateStr);

      if (error) throw error;

      toast({
        title: "Všechny termíny zablokovány",
        description: `Den ${format(selectedDate, "d. MMMM yyyy", { locale: cs })} byl zablokován`,
      });

      setBlockReason("");
    } catch (error) {
      console.error("Error blocking all slots:", error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se zablokovat termíny",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Správa dostupnosti termínů</h2>
          <p className="text-muted-foreground">
            Spravujte dostupné termíny pro rezervace v reálném čase
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            Vyberte datum
          </h3>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            className="rounded-md border pointer-events-auto"
            locale={cs}
          />
        </div>

        {/* Slots Management */}
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Časové sloty
            </h3>
            {selectedDate && (
              <Badge variant="outline">
                {format(selectedDate, "d. MMMM yyyy", { locale: cs })}
              </Badge>
            )}
          </div>

          {!selectedDate ? (
            <div className="text-center py-12 text-muted-foreground">
              <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Vyberte datum pro zobrazení časových slotů</p>
            </div>
          ) : loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-muted-foreground mt-3">Načítání...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  className={cn(
                    "p-4 rounded-lg border-2 transition-all",
                    slot.is_available
                      ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                      : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span className="font-semibold">{slot.time_slot}</span>
                    </div>
                    <Badge variant={slot.is_available ? "default" : "destructive"}>
                      {slot.is_available ? (
                        <><CheckCircle2 className="w-3 h-3 mr-1" /> Volný</>
                      ) : (
                        <><XCircle className="w-3 h-3 mr-1" /> Obsazený</>
                      )}
                    </Badge>
                  </div>

                  <div className="text-sm text-muted-foreground mb-3">
                    <span>Rezervace: {slot.current_bookings} / {slot.max_bookings}</span>
                    {slot.blocked_reason && (
                      <p className="text-xs mt-1 text-destructive">
                        Důvod: {slot.blocked_reason}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={slot.is_available ? "destructive" : "default"}
                      onClick={() => toggleSlotAvailability(slot)}
                      className="flex-1"
                    >
                      {slot.is_available ? (
                        <><Lock className="w-3 h-3 mr-1" /> Zablokovat</>
                      ) : (
                        <><Unlock className="w-3 h-3 mr-1" /> Odblokovat</>
                      )}
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={maxBookings}
                      onChange={(e) => setMaxBookings(Number(e.target.value))}
                      className="w-20"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateMaxBookings(slot)}
                    >
                      Kapacita
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedDate && (
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Hromadné akce</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Důvod blokování (volitelné)
              </label>
              <Textarea
                placeholder="Např. Dovolená, veřejný svátek, technické problémy..."
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                rows={2}
              />
            </div>
            <Button
              variant="destructive"
              onClick={blockAllSlots}
              className="w-full"
            >
              <Lock className="w-4 h-4 mr-2" />
              Zablokovat všechny termíny pro tento den
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailabilityManager;
