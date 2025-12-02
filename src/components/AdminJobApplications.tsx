import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Mail, Phone, Briefcase, FileText, Eye, Download, Trash2 } from "lucide-react";
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

type JobApplication = {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  message: string | null;
  cv_url: string | null;
  created_at: string;
};

const positionLabels: Record<string, string> = {
  uklizecka: "Zkušená uklízečka",
  vedouci: "Vedoucí úklidu"
};

const AdminJobApplications = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from("job_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se načíst přihlášky",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadCV = async (cvUrl: string, applicantName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("cv-uploads")
        .download(cvUrl);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `CV_${applicantName.replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading CV:", error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se stáhnout CV",
        variant: "destructive",
      });
    }
  };

  const deleteApplication = async (id: string) => {
    try {
      const app = applications.find(a => a.id === id);
      
      // Delete CV from storage if exists
      if (app?.cv_url) {
        await supabase.storage.from("cv-uploads").remove([app.cv_url]);
      }

      const { error } = await supabase
        .from("job_applications")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setApplications(prev => prev.filter(a => a.id !== id));
      toast({
        title: "Smazáno",
        description: "Přihláška byla smazána",
      });
    } catch (error) {
      console.error("Error deleting application:", error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se smazat přihlášku",
        variant: "destructive",
      });
    } finally {
      setDeleteId(null);
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          Pracovní přihlášky
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{applications.length}</div>
              <p className="text-sm text-muted-foreground">Celkem přihlášek</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {applications.filter(a => a.position === "uklizecka").length}
              </div>
              <p className="text-sm text-muted-foreground">Uklízečky</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {applications.filter(a => a.position === "vedouci").length}
              </div>
              <p className="text-sm text-muted-foreground">Vedoucí</p>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Jméno</TableHead>
                <TableHead>Kontakt</TableHead>
                <TableHead>Pozice</TableHead>
                <TableHead>CV</TableHead>
                <TableHead>Datum</TableHead>
                <TableHead>Akce</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-sm">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {app.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {app.phone}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {positionLabels[app.position] || app.position}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {app.cv_url ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadCV(app.cv_url!, app.name)}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Stáhnout
                      </Button>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(app.created_at), "dd.MM.yyyy")}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedApplication(app)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(app.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {applications.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Zatím žádné přihlášky
          </div>
        )}

        {/* Detail Dialog */}
        <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Detail přihlášky</DialogTitle>
            </DialogHeader>
            {selectedApplication && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Jméno</p>
                    <p className="font-medium">{selectedApplication.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pozice</p>
                    <Badge variant="secondary">
                      {positionLabels[selectedApplication.position] || selectedApplication.position}
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <a href={`mailto:${selectedApplication.email}`} className="text-primary hover:underline">
                      {selectedApplication.email}
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Telefon</p>
                    <a href={`tel:${selectedApplication.phone}`} className="text-primary hover:underline">
                      {selectedApplication.phone}
                    </a>
                  </div>
                </div>
                {selectedApplication.message && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Zpráva</p>
                    <p className="bg-muted p-3 rounded-lg text-sm">{selectedApplication.message}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Přijato</p>
                  <p>{format(new Date(selectedApplication.created_at), "dd.MM.yyyy HH:mm")}</p>
                </div>
                {selectedApplication.cv_url && (
                  <Button
                    onClick={() => downloadCV(selectedApplication.cv_url!, selectedApplication.name)}
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Stáhnout CV
                  </Button>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Smazat přihlášku?</AlertDialogTitle>
              <AlertDialogDescription>
                Tato akce je nevratná. Přihláška a přiložené CV budou trvale smazány.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Zrušit</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteId && deleteApplication(deleteId)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Smazat
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default AdminJobApplications;