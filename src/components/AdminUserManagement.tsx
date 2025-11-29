import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Trash2, Shield } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type UserRole = {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
};

const AdminUserManagement = () => {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUserId, setNewUserId] = useState("");
  const [addingUser, setAddingUser] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  const fetchAdminUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("*")
        .eq("role", "admin")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUserRoles(data || []);
    } catch (error) {
      console.error("Error fetching admin users:", error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se načíst administrátory",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addAdminUser = async () => {
    if (!newUserId.trim()) {
      toast({
        title: "Chyba",
        description: "Zadejte ID uživatele",
        variant: "destructive",
      });
      return;
    }

    setAddingUser(true);
    try {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: newUserId.trim(), role: "admin" });

      if (error) throw error;

      toast({
        title: "Úspěch",
        description: "Admin práva byla přidána",
      });

      setNewUserId("");
      fetchAdminUsers();
    } catch (error: any) {
      console.error("Error adding admin:", error);
      toast({
        title: "Chyba",
        description: error.message || "Nepodařilo se přidat admin práva",
        variant: "destructive",
      });
    } finally {
      setAddingUser(false);
    }
  };

  const confirmDeleteAdmin = (userId: string) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const deleteAdminUser = async () => {
    if (!userToDelete) return;

    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userToDelete)
        .eq("role", "admin");

      if (error) throw error;

      toast({
        title: "Úspěch",
        description: "Admin práva byla odebrána",
      });

      fetchAdminUsers();
    } catch (error) {
      console.error("Error removing admin:", error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se odebrat admin práva",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Správa administrátorů
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="userId">ID uživatele</Label>
              <Input
                id="userId"
                type="text"
                placeholder="Zadejte UUID uživatele"
                value={newUserId}
                onChange={(e) => setNewUserId(e.target.value)}
                disabled={addingUser}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Zadejte UUID uživatele z auth.users tabulky
              </p>
            </div>
            <div className="flex items-end">
              <Button
                onClick={addAdminUser}
                disabled={addingUser || !newUserId.trim()}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Přidat admina
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Přidáno</TableHead>
                  <TableHead>Akce</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userRoles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      Žádní administrátoři
                    </TableCell>
                  </TableRow>
                ) : (
                  userRoles.map((userRole) => (
                    <TableRow key={userRole.id}>
                      <TableCell className="font-mono text-sm">
                        {userRole.user_id}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          <Shield className="w-3 h-3" />
                          {userRole.role}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(userRole.created_at).toLocaleDateString("cs-CZ", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => confirmDeleteAdmin(userRole.user_id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Odebrat
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Opravdu odebrat admin práva?</AlertDialogTitle>
            <AlertDialogDescription>
              Tato akce odebere administrátorská práva tomuto uživateli. Operaci lze vrátit
              přidáním práv zpět.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zrušit</AlertDialogCancel>
            <AlertDialogAction onClick={deleteAdminUser}>
              Odebrat práva
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminUserManagement;
