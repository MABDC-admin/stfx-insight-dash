import { useState } from "react";
import { useTeachers, useCreateTeacher, useUpdateTeacher, useDeleteTeacher, type Teacher, type TeacherInsert } from "@/hooks/useTeachers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Search, Plus, Pencil, Trash2, Shield, Download } from "lucide-react";
import { toast } from "sonner";
import SideNavigation from "@/components/SideNavigation";
import DashboardHeader from "@/components/DashboardHeader";
import MouseFollower from "@/components/MouseFollower";

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  on_leave: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400",
  resigned: "bg-muted text-muted-foreground",
  retired: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
};

const emptyTeacher: Partial<TeacherInsert> = {
  employee_id: "", first_name: "", last_name: "", position: "Teacher I", status: "active",
};

const Teachers = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Teacher | null>(null);
  const [form, setForm] = useState<Partial<TeacherInsert>>(emptyTeacher);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: teachers, isLoading } = useTeachers({ search: search || undefined, status: statusFilter || undefined });
  const createMut = useCreateTeacher();
  const updateMut = useUpdateTeacher();
  const deleteMut = useDeleteTeacher();

  const openCreate = () => { setEditing(null); setForm(emptyTeacher); setDialogOpen(true); };
  const openEdit = (t: Teacher) => { setEditing(t); setForm(t); setDialogOpen(true); };
  const updateField = (key: string, value: unknown) => setForm(p => ({ ...p, [key]: value }));

  const handleSave = () => {
    if (!form.employee_id || !form.first_name || !form.last_name) { toast.error("Fill required fields"); return; }
    if (editing) updateMut.mutate({ ...(form as TeacherInsert), id: editing.id }, { onSuccess: () => setDialogOpen(false) });
    else createMut.mutate(form as TeacherInsert, { onSuccess: () => setDialogOpen(false) });
  };

  const handleExport = () => {
    if (!teachers?.length) return;
    const csv = [["Employee ID","Name","Position","Department","Status","Contact"],
      ...teachers.map(t => [t.employee_id, `${t.last_name}, ${t.first_name}`, t.position, t.department||"", t.status, t.contact_number||""])
    ].map(r => r.join(",")).join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = "teachers.csv"; a.click();
    toast.success("Exported");
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-500">
      <MouseFollower />
      <SideNavigation />
      <div className="pl-16 lg:pl-56 transition-all duration-300">
        <div className="p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-5 relative z-10">
            <DashboardHeader />
            <div className="glass-card p-6 animate-slide-up">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <Shield className="h-6 w-6 text-primary" /> Faculty & Staff
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">{teachers?.length || 0} total faculty members</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleExport}><Download className="h-4 w-4 mr-1" /> Export</Button>
                  <Button size="sm" onClick={openCreate}><Plus className="h-4 w-4 mr-1" /> Add Teacher</Button>
                </div>
              </div>
            </div>

            <div className="glass-card p-4 animate-slide-up" style={{ animationDelay: "100ms" }}>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search by name or employee ID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {["active","on_leave","resigned","retired"].map(s => <SelectItem key={s} value={s}>{s.replace("_"," ")}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="glass-card animate-slide-up" style={{ animationDelay: "200ms" }}>
              {isLoading ? <div className="p-12 text-center text-muted-foreground">Loading...</div> :
              !teachers?.length ? <div className="p-12 text-center text-muted-foreground">No teachers found.</div> : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teachers.map((t, i) => (
                      <TableRow key={t.id} className="animate-slide-up" style={{ animationDelay: `${i*30}ms` }}>
                        <TableCell className="font-mono text-xs">{t.employee_id}</TableCell>
                        <TableCell className="font-medium">{t.last_name}, {t.first_name}</TableCell>
                        <TableCell>{t.position}</TableCell>
                        <TableCell>{t.department || "—"}</TableCell>
                        <TableCell className="text-xs">{t.employment_type || "—"}</TableCell>
                        <TableCell><Badge variant="secondary" className={statusColors[t.status] || ""}>{t.status.replace("_"," ")}</Badge></TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(t)}><Pencil className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => setDeleteId(t.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit Teacher" : "Add New Teacher"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Employee ID *</Label><Input value={form.employee_id || ""} onChange={e => updateField("employee_id", e.target.value)} /></div>
            <div><Label>Position *</Label>
              <Select value={form.position || "Teacher I"} onValueChange={v => updateField("position", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Teacher I","Teacher II","Teacher III","Master Teacher I","Master Teacher II","Head Teacher I","Head Teacher III","Principal I","Principal II"].map(p =>
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div><Label>First Name *</Label><Input value={form.first_name || ""} onChange={e => updateField("first_name", e.target.value)} /></div>
            <div><Label>Last Name *</Label><Input value={form.last_name || ""} onChange={e => updateField("last_name", e.target.value)} /></div>
            <div><Label>Middle Name</Label><Input value={form.middle_name || ""} onChange={e => updateField("middle_name", e.target.value)} /></div>
            <div><Label>Gender</Label>
              <Select value={form.gender || ""} onValueChange={v => updateField("gender", v)}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent>
              </Select>
            </div>
            <div><Label>Department</Label><Input placeholder="e.g. Science, Math" value={form.department || ""} onChange={e => updateField("department", e.target.value)} /></div>
            <div><Label>Specialization</Label><Input value={form.specialization || ""} onChange={e => updateField("specialization", e.target.value)} /></div>
            <div><Label>Employment Type</Label>
              <Select value={form.employment_type || "Regular"} onValueChange={v => updateField("employment_type", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["Regular","Contractual","Part-time","Substitute"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Date Hired</Label><Input type="date" value={form.date_hired || ""} onChange={e => updateField("date_hired", e.target.value)} /></div>
            <div><Label>License Number</Label><Input value={form.license_number || ""} onChange={e => updateField("license_number", e.target.value)} /></div>
            <div><Label>Contact</Label><Input value={form.contact_number || ""} onChange={e => updateField("contact_number", e.target.value)} /></div>
            <div><Label>Email</Label><Input type="email" value={form.email || ""} onChange={e => updateField("email", e.target.value)} /></div>
            <div><Label>Status</Label>
              <Select value={form.status || "active"} onValueChange={v => updateField("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["active","on_leave","resigned","retired"].map(s => <SelectItem key={s} value={s}>{s.replace("_"," ")}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={createMut.isPending || updateMut.isPending}>
              {createMut.isPending || updateMut.isPending ? "Saving..." : editing ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Teacher?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This will permanently remove this faculty record.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { if (deleteId) deleteMut.mutate(deleteId, { onSuccess: () => setDeleteId(null) }); }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Teachers;
