import { useState } from "react";
import { useEnrollments, useCreateEnrollment, useUpdateEnrollment, useDeleteEnrollment, type EnrollmentInsert } from "@/hooks/useEnrollments";
import { useStudents } from "@/hooks/useStudents";
import { useSections } from "@/hooks/useSections";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Search, Plus, Pencil, Trash2, ClipboardCheck, Download, Filter } from "lucide-react";
import { toast } from "sonner";
import SideNavigation from "@/components/SideNavigation";
import DashboardHeader from "@/components/DashboardHeader";
import MouseFollower from "@/components/MouseFollower";

const statusColors: Record<string, string> = {
  enrolled: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  cancelled: "bg-destructive/15 text-destructive",
  completed: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
};

const gradeLabel = (g: number) => g <= 6 ? `Grade ${g}` : g <= 10 ? `Grade ${g}` : `Grade ${g} (SHS)`;

const currentSY = () => {
  const y = new Date().getFullYear();
  return `${y}-${y + 1}`;
};

const emptyEnrollment: Partial<EnrollmentInsert> = {
  student_id: "", section_id: "", grade_level: 1, school_year: currentSY(), status: "pending",
};

const Enrollment = () => {
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<Partial<EnrollmentInsert>>(emptyEnrollment);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: enrollments, isLoading } = useEnrollments({
    search: search || undefined,
    gradeLevel: gradeFilter ? Number(gradeFilter) : undefined,
    status: statusFilter || undefined,
  });
  const { data: students } = useStudents({ status: "active" });
  const { data: sections } = useSections();
  const createMut = useCreateEnrollment();
  const updateMut = useUpdateEnrollment();
  const deleteMut = useDeleteEnrollment();

  const openCreate = () => { setEditing(null); setForm(emptyEnrollment); setDialogOpen(true); };
  const openEdit = (e: any) => { setEditing(e); setForm({ student_id: e.student_id, section_id: e.section_id, grade_level: e.grade_level, school_year: e.school_year, status: e.status, remarks: e.remarks }); setDialogOpen(true); };
  const updateField = (key: string, value: unknown) => setForm(p => ({ ...p, [key]: value }));

  const handleSave = () => {
    if (!form.student_id || !form.section_id || !form.school_year) { toast.error("Please fill all required fields"); return; }
    const payload = { ...form } as EnrollmentInsert;
    if (editing) updateMut.mutate({ ...payload, id: editing.id }, { onSuccess: () => setDialogOpen(false) });
    else createMut.mutate(payload, { onSuccess: () => setDialogOpen(false) });
  };

  const handleExport = () => {
    if (!enrollments?.length) return;
    const headers = ["Student", "LRN", "Section", "Grade", "School Year", "Status", "Date Enrolled"];
    const rows = enrollments.map((e: any) => [
      `${e.students?.last_name || ""} ${e.students?.first_name || ""}`,
      e.students?.lrn || "", e.sections?.name || "", e.grade_level, e.school_year, e.status, e.date_enrolled || "",
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "enrollments.csv"; a.click();
    toast.success("Exported enrollments");
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
                    <ClipboardCheck className="h-6 w-6 text-primary" /> Enrollment Management
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Manage student enrollments • {enrollments?.length || 0} records
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleExport}><Download className="h-4 w-4 mr-1" /> Export</Button>
                  <Button size="sm" onClick={openCreate}><Plus className="h-4 w-4 mr-1" /> Enroll Student</Button>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-slide-up" style={{ animationDelay: "80ms" }}>
              {(["enrolled", "pending", "completed", "cancelled"] as const).map((st, i) => {
                const count = enrollments?.filter((e: any) => e.status === st).length || 0;
                return (
                  <div key={st} className="glass-card p-4 text-center" style={{ animationDelay: `${i * 60}ms` }}>
                    <div className="text-2xl font-bold text-foreground">{count}</div>
                    <div className="text-xs text-muted-foreground capitalize">{st}</div>
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
                <Select value={gradeFilter} onValueChange={setGradeFilter}>
                  <SelectTrigger className="w-[160px]"><Filter className="h-4 w-4 mr-1" /><SelectValue placeholder="Grade Level" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Grades</SelectItem>
                    {Array.from({ length: 12 }, (_, i) => <SelectItem key={i + 1} value={String(i + 1)}>{gradeLabel(i + 1)}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {["enrolled", "pending", "completed", "cancelled"].map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="glass-card animate-slide-up" style={{ animationDelay: "200ms" }}>
              {isLoading ? <div className="p-12 text-center text-muted-foreground">Loading enrollments...</div> :
                !enrollments?.length ? <div className="p-12 text-center text-muted-foreground">No enrollments found. Click "Enroll Student" to begin.</div> : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>LRN</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Section</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>School Year</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date Enrolled</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {enrollments.map((e: any, i: number) => (
                        <TableRow key={e.id} className="animate-slide-up" style={{ animationDelay: `${i * 30}ms` }}>
                          <TableCell className="font-mono text-xs">{e.students?.lrn || "—"}</TableCell>
                          <TableCell className="font-medium">{e.students?.last_name}, {e.students?.first_name} {e.students?.middle_name || ""}</TableCell>
                          <TableCell>{e.sections?.name || "—"}</TableCell>
                          <TableCell>{gradeLabel(e.grade_level)}</TableCell>
                          <TableCell>{e.school_year}</TableCell>
                          <TableCell><Badge variant="secondary" className={statusColors[e.status] || ""}>{e.status}</Badge></TableCell>
                          <TableCell className="text-xs">{e.date_enrolled ? new Date(e.date_enrolled).toLocaleDateString("en-PH") : "—"}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => openEdit(e)}><Pencil className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => setDeleteId(e.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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

      {/* Enroll / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Edit Enrollment" : "Enroll Student"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Student *</Label>
              <Select value={form.student_id || ""} onValueChange={v => updateField("student_id", v)}>
                <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                <SelectContent>
                  {students?.map(s => <SelectItem key={s.id} value={s.id}>{s.last_name}, {s.first_name} {s.lrn ? `(${s.lrn})` : ""}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Section *</Label>
              <Select value={form.section_id || ""} onValueChange={v => updateField("section_id", v)}>
                <SelectTrigger><SelectValue placeholder="Select section" /></SelectTrigger>
                <SelectContent>
                  {sections?.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.name} (Gr. {s.grade_level})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Grade Level *</Label>
              <Select value={String(form.grade_level || 1)} onValueChange={v => updateField("grade_level", Number(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{Array.from({ length: 12 }, (_, i) => <SelectItem key={i + 1} value={String(i + 1)}>{gradeLabel(i + 1)}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>School Year *</Label>
              <Input placeholder="2026-2027" value={form.school_year || ""} onChange={e => updateField("school_year", e.target.value)} />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status || "pending"} onValueChange={v => updateField("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["pending", "enrolled", "completed", "cancelled"].map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label>Remarks</Label>
              <Input placeholder="Optional notes..." value={form.remarks || ""} onChange={e => updateField("remarks", e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={createMut.isPending || updateMut.isPending}>
              {createMut.isPending || updateMut.isPending ? "Saving..." : editing ? "Update" : "Enroll"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Remove Enrollment?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This will permanently remove this enrollment record.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { if (deleteId) deleteMut.mutate(deleteId, { onSuccess: () => setDeleteId(null) }); }}>Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Enrollment;
