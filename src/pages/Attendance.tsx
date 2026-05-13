import { useState } from "react";
import { useAttendance, useCreateAttendance, useUpdateAttendance, useDeleteAttendance, type AttendanceInsert } from "@/hooks/useAttendance";
import { useStudents } from "@/hooks/useStudents";
import { useSections } from "@/hooks/useSections";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Search, Plus, Pencil, Trash2, ClipboardList, Download, CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import SideNavigation from "@/components/SideNavigation";
import DashboardHeader from "@/components/DashboardHeader";
import MouseFollower from "@/components/MouseFollower";

const today = () => new Date().toISOString().slice(0, 10);
const empty: Partial<AttendanceInsert> = { student_id: "", date: today(), status: "present" };

const statusColors: Record<string, string> = {
  present: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  absent: "bg-destructive/15 text-destructive",
  late: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  excused: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
};

const statusIcons: Record<string, any> = { present: CheckCircle2, absent: XCircle, late: Clock, excused: AlertCircle };

const Attendance = () => {
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<Partial<AttendanceInsert>>(empty);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: records, isLoading } = useAttendance({ search: search || undefined, date: dateFilter || undefined, status: statusFilter || undefined });
  const { data: students } = useStudents({ status: "active" });
  const { data: sections } = useSections();
  const createMut = useCreateAttendance();
  const updateMut = useUpdateAttendance();
  const deleteMut = useDeleteAttendance();

  const openCreate = () => { setEditing(null); setForm(empty); setDialogOpen(true); };
  const openEdit = (r: any) => { setEditing(r); setForm({ student_id: r.student_id, section_id: r.section_id, date: r.date, status: r.status, remarks: r.remarks }); setDialogOpen(true); };
  const updateField = (k: string, v: unknown) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = () => {
    if (!form.student_id || !form.date) { toast.error("Please fill all required fields"); return; }
    const payload = { ...form } as AttendanceInsert;
    if (editing) updateMut.mutate({ ...payload, id: editing.id }, { onSuccess: () => setDialogOpen(false) });
    else createMut.mutate(payload, { onSuccess: () => setDialogOpen(false) });
  };

  const handleExport = () => {
    if (!records?.length) return;
    const headers = ["Date", "LRN", "Student", "Section", "Status", "Remarks"];
    const rows = records.map((r: any) => [r.date, r.students?.lrn || "", `${r.students?.last_name} ${r.students?.first_name}`, r.sections?.name || "", r.status, r.remarks || ""]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "attendance.csv"; a.click();
    toast.success("Exported attendance (DepEd SF2 ready)");
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
                  <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><ClipboardList className="h-6 w-6 text-primary" /> Attendance Management</h1>
                  <p className="text-sm text-muted-foreground mt-1">DepEd SF2 Daily Attendance • {records?.length || 0} records</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleExport}><Download className="h-4 w-4 mr-1" /> Export SF2</Button>
                  <Button size="sm" onClick={openCreate}><Plus className="h-4 w-4 mr-1" /> Mark Attendance</Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-slide-up" style={{ animationDelay: "80ms" }}>
              {(["present", "absent", "late", "excused"] as const).map(st => {
                const count = records?.filter((r: any) => r.status === st).length || 0;
                const Icon = statusIcons[st];
                return (
                  <div key={st} className="glass-card p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-foreground">{count}</div>
                        <div className="text-xs text-muted-foreground capitalize">{st}</div>
                      </div>
                      <Icon className="h-6 w-6 text-primary opacity-60" />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="glass-card p-4 animate-slide-up" style={{ animationDelay: "120ms" }}>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search by student name or LRN..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
                </div>
                <Input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="w-[180px]" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {["present", "absent", "late", "excused"].map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="glass-card animate-slide-up" style={{ animationDelay: "200ms" }}>
              {isLoading ? <div className="p-12 text-center text-muted-foreground">Loading attendance...</div> :
                !records?.length ? <div className="p-12 text-center text-muted-foreground">No attendance records yet. Click "Mark Attendance" to begin.</div> : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>LRN</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Section</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Remarks</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {records.map((r: any, i: number) => (
                        <TableRow key={r.id} className="animate-slide-up" style={{ animationDelay: `${i * 30}ms` }}>
                          <TableCell className="text-xs">{new Date(r.date).toLocaleDateString("en-PH")}</TableCell>
                          <TableCell className="font-mono text-xs">{r.students?.lrn || "—"}</TableCell>
                          <TableCell className="font-medium">{r.students?.last_name}, {r.students?.first_name}</TableCell>
                          <TableCell>{r.sections?.name || "—"}</TableCell>
                          <TableCell><Badge variant="secondary" className={statusColors[r.status]}>{r.status}</Badge></TableCell>
                          <TableCell className="text-xs text-muted-foreground">{r.remarks || "—"}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => openEdit(r)}><Pencil className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => setDeleteId(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Edit Attendance" : "Mark Attendance"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Student *</Label>
              <Select value={form.student_id || ""} onValueChange={v => updateField("student_id", v)}>
                <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                <SelectContent>{students?.map(s => <SelectItem key={s.id} value={s.id}>{s.last_name}, {s.first_name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Section</Label>
              <Select value={form.section_id || ""} onValueChange={v => updateField("section_id", v)}>
                <SelectTrigger><SelectValue placeholder="Optional" /></SelectTrigger>
                <SelectContent>{sections?.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Date *</Label>
              <Input type="date" value={form.date || ""} onChange={e => updateField("date", e.target.value)} />
            </div>
            <div className="col-span-2">
              <Label>Status *</Label>
              <Select value={form.status || "present"} onValueChange={v => updateField("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["present", "absent", "late", "excused"].map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label>Remarks</Label>
              <Input value={form.remarks || ""} onChange={e => updateField("remarks", e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={createMut.isPending || updateMut.isPending}>{editing ? "Update" : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Remove Attendance?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This will permanently remove this attendance record.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { if (deleteId) deleteMut.mutate(deleteId, { onSuccess: () => setDeleteId(null) }); }}>Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Attendance;