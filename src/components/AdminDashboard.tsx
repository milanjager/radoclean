import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Calendar, Mail, Phone, MapPin, Package, DollarSign, Eye, FileText, Clock, MessageCircle } from "lucide-react";
import AvailabilityManager from "./AvailabilityManager";
import AdminChatManager from "./AdminChatManager";
import AdminInquiriesManager from "./AdminInquiriesManager";

type Reservation = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string | null;
  preferred_date: string;
  preferred_time: string;
  package_type: string;
  base_price: number;
  extras_price: number;
  total_price: number;
  extras: any;
  notes: string | null;
  status: string;
  created_at: string;
};

const AdminDashboard = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const { data, error } = await supabase
        .from("reservations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReservations(data || []);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      toast({
        title: "Error",
        description: "Failed to load reservations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("reservations")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );

      toast({
        title: "Success",
        description: "Reservation status updated",
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const filteredReservations = reservations.filter((r) => {
    const statusMatch = statusFilter === "all" || r.status === statusFilter;
    const dateMatch = !dateFilter || r.preferred_date === dateFilter;
    return statusMatch && dateMatch;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500",
      confirmed: "bg-green-500",
      completed: "bg-blue-500",
      cancelled: "bg-red-500",
    };
    return colors[status] || "bg-gray-500";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="reservations" className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-3xl">
          <TabsTrigger value="reservations">
            <Calendar className="w-4 h-4 mr-2" />
            Rezervace
          </TabsTrigger>
          <TabsTrigger value="availability">
            <Clock className="w-4 h-4 mr-2" />
            Dostupnost
          </TabsTrigger>
          <TabsTrigger value="chat">
            <MessageCircle className="w-4 h-4 mr-2" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="inquiries">
            <Mail className="w-4 h-4 mr-2" />
            Dotazy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reservations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Přehled rezervací</CardTitle>
            </CardHeader>
            <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{reservations.length}</div>
                <p className="text-sm text-muted-foreground">Total Reservations</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {reservations.filter((r) => r.status === "pending").length}
                </div>
                <p className="text-sm text-muted-foreground">Pending</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {reservations.filter((r) => r.status === "confirmed").length}
                </div>
                <p className="text-sm text-muted-foreground">Confirmed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {reservations.reduce((sum, r) => sum + r.total_price, 0)} Kč
                </div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-4 mb-6">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-[200px]"
              placeholder="Filter by date"
            />

            {(statusFilter !== "all" || dateFilter) && (
              <Button
                variant="outline"
                onClick={() => {
                  setStatusFilter("all");
                  setDateFilter("");
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell>
                      <div className="font-medium">{reservation.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {reservation.address}, {reservation.city}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="text-sm flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {reservation.email}
                        </div>
                        <div className="text-sm flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {reservation.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <div>
                          <div className="font-medium">
                            {format(new Date(reservation.preferred_date), "MMM dd, yyyy")}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {reservation.preferred_time}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        <span className="capitalize">{reservation.package_type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        <span className="font-medium">{reservation.total_price} Kč</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(reservation.status)}>
                        {reservation.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={reservation.status}
                        onValueChange={(value) => updateStatus(reservation.id, value)}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedReservation(reservation)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredReservations.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No reservations found
            </div>
          )}
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="availability" className="mt-6">
          <AvailabilityManager />
        </TabsContent>

        <TabsContent value="chat" className="mt-6">
          <AdminChatManager />
        </TabsContent>

        <TabsContent value="inquiries" className="mt-6">
          <AdminInquiriesManager />
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedReservation} onOpenChange={() => setSelectedReservation(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Reservation Details</DialogTitle>
          </DialogHeader>
          
          {selectedReservation && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Customer Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Name:</span> {selectedReservation.name}</p>
                      <p><span className="font-medium">Email:</span> {selectedReservation.email}</p>
                      <p><span className="font-medium">Phone:</span> {selectedReservation.phone}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Address
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p>{selectedReservation.address}</p>
                      <p>{selectedReservation.city}</p>
                      {selectedReservation.postal_code && (
                        <p>{selectedReservation.postal_code}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Schedule
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Date:</span> {format(new Date(selectedReservation.preferred_date), "MMMM dd, yyyy")}</p>
                      <p><span className="font-medium">Time:</span> {selectedReservation.preferred_time}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Package & Pricing
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Package:</span> <span className="capitalize">{selectedReservation.package_type}</span></p>
                      <p><span className="font-medium">Base Price:</span> {selectedReservation.base_price} Kč</p>
                      <p><span className="font-medium">Extras:</span> {selectedReservation.extras_price} Kč</p>
                      <p className="text-lg font-bold"><span className="font-medium">Total:</span> {selectedReservation.total_price} Kč</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {selectedReservation.extras && Array.isArray(selectedReservation.extras) && selectedReservation.extras.length > 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Selected Extras
                    </h3>
                    <div className="space-y-2">
                      {selectedReservation.extras.map((extra: any, index: number) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-md">
                          <span className="font-medium">{extra.name}</span>
                          <Badge variant="secondary">{extra.price} Kč</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {selectedReservation.notes && (
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Customer Notes
                    </h3>
                    <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded-md">
                      {selectedReservation.notes}
                    </p>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold mb-1">Status</h3>
                      <Badge className={getStatusColor(selectedReservation.status)}>
                        {selectedReservation.status}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Created</p>
                      <p className="text-sm font-medium">{format(new Date(selectedReservation.created_at), "MMM dd, yyyy 'at' HH:mm")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;