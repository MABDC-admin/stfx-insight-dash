import { useState } from "react";
import { useGrades, useCreateGrade, useUpdateGrade, useDeleteGrade, type GradeInsert } from "@/hooks/useGrades";
import { useStudents } from "@/hooks/useStudents";
import { useSubjects } from "@/hooks/useSubjects";
import { useSections } from "@/hooks/useSections";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Search, Plus, Pencil, Trash2, BarChart3, Download } from "lucide-react";
import { toast } from "sonner";
import SideNavigation from "@/components/SideNavigation";
import DashboardHeader from "@/components/DashboardHeader";
import MouseFollower from "@/components/MouseFollower";

const currentSY = () => { const y = new Date().getFullYear(); return `${y}-${y + 1}`; };
const empty: Partial<GradeInsert> = { student_id: "", subject_id: "", quarter: "Q1", school_year: currentSY(), grade: 75 };

const gradeRemark = (g: number) => g >= 90 ? "Outstanding" : g >= 85 ? "Very Satisfactory" : g >= 80 ? "Satisfactory" : g >= 75 ? "Fairly Satisfactory" : "Did Not Meet Expectations";
const remarkColor = (g: number) => g >= 90 ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" : g >= 75 ? "bg-blue-500/15 text-blue-700 dark:text-blue-400" : "bg-destructive/15 text-destructive";

const Grades = () => {
  const [search, setSearch] = useState("");
  const [quarterFilter, setQuarterFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<Partial<GradeInsert>>(empty);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: grades, isLoading } = useGrades({ search: search || undefined, quarter: quarterFilter || undefined, subjectId: subjectFilter || undefined });
  const { data: students } = useStudents({ status: "active" });
  const { data: subjects } = useSubjects();
  const { data: sections } = useSections();
  const createMut = useCreateGrade();
  const updateMut = useUpdateGrade();
  const deleteMut = useDeleteGrade();

  const openCreate = () => { setEditing(null); setForm(empty); setDialogOpen(true); };
  const openEdit = (g: any) => { setEditing(g); setForm({ student_id: g.student_id, subject_id: g.subject_id, section_id: g.section_id, quarter: g.quarter, school_year: g.school_year, grade: g.grade, remarks: g.remarks }); setDialogOpen(true); };
  const updateField = (k: string, v: unknown) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = () => {
    if (!form.student_id || !form.subject_id || !form.school_year || form.grade == null) { toast.error("Please fill all required fields"); return; }
    const payload = { ...form } as GradeInsert;
    if (editing) updateMut.mutate({ ...payload, id: editing.id }, { onSuccess: () => setDialogOpen(false) });
    else createMut.mutate(payload, { onSuccess: () => setDialogOpen(false) });
  };

  const handleExport = () => {
    if (!grades?.length) return;
    const headers = ["LRN", "Student", "Subject", "Quarter", "Grade", "Remark", "School Year"];
    const rows = grades.map((g: any) => [g.students?.lrn || "", `${g.students?.last_name} ${g.students?.first_name}`, g.subjects?.name || "", g.quarter, g.grade, gradeRemark(Number(g.grade)), g.school_year]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "grades.csv"; a.click();
    toast.success("Exported grades");
  };

  const avg = grades?.length ? (grades.reduce((s: number, g: any) => s + Number(g.grade), 0) / grades.length).toFixed(1) : "—";
  const passing = grades?.filter((g: any) => Number(g.grade) >= 75).length || 0;
  const failing = (grades?.length || 0) - passing;

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
                  <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><BarChart3 className="h-6 w-6 text-primary" /> Grades Management</h1>
                  <p className="text-sm text-muted-foreground mt-1">DepEd K-12 Grading System • {grades?.length || 0} records</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleExport}><Download className="h-4 w-4 mr-1" /> Export</Button>
                  <Button size="sm" onClick={openCreate}><Plus className="h-4 w-4 mr-1" /> Record Grade</Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-slide-up" style={{ animationDelay: "80ms" }}>
              <div className="glass-card p-4 text-center"><div className="text-2xl font-bold text-foreground">{grades?.length || 0}</div><div className="text-xs text-muted-foreground">Total Records</div></div>
              <div className="glass-card p-4 text-center"><div className="text-2xl font-bold text-primary">{avg}</div><div className="text-xs text-muted-foreground">Class Average</div></div>
              <div className="glass-card p-4 text-center"><div className="text-2xl font-bold text-emerald-600">{passing}</div><div className="text-xs text-muted-foreground">Passing (≥75)</div></div>
              <div className="glass-card p-4 text-center"><div className="text-2xl font-bold text-destructive">{failing}</div><div className="text-xs text-muted-foreground">At Risk</div></div>
            </div>

            <div className="glass-card p-4 animate-slide-up" style={{ animationDelay: "120ms" }}>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search by student name or LRN..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
                </div>
                <Select value={quarterFilter} onValueChange={setQuarterFilter}>
                  <SelectTrigger className="w-[140px]"><SelectValue placeholder="Quarter" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Quarters</SelectItem>
                    {["Q1", "Q2", "Q3", "Q4"].map(q => <SelectItem key={q} value={q}>{q}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                  <SelectTrigger className="w-[200px]"><SelectValue placeholder="Subject" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {subjects?.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.code} – {s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="glass-card animate-slide-up" style={{ animationDelay: "200ms" }}>
              {isLoading ? <div className="p-12 text-center text-muted-foreground">Loading grades...</div> :
                !grades?.length ? <div className="p-12 text-center text-muted-foreground">No grades yet. Click "Record Grade" to begin.</div> : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Quarter</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Remark</TableHead>
                        <TableHead>School Year</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {grades.map((g: any, i: number) => (
                        <TableRow key={g.id} className="animate-slide-up" style={{ animationDelay: `${i * 30}ms` }}>
                          <TableCell className="font-medium">{g.students?.last_name}, {g.students?.first_name}</TableCell>
                          <TableCell><span className="font-mono text-xs">{g.subjects?.code}</span> {g.subjects?.name}</TableCell>
                          <TableCell><Badge variant="outline">{g.quarter}</Badge></TableCell>
                          <TableCell className="font-bold tabular-nums">{Number(g.grade).toFixed(1)}</TableCell>
                          <TableCell><Badge variant="secondary" className={remarkColor(Number(g.grade))}>{gradeRemark(Number(g.grade))}</Badge></TableCell>
                          <TableCell className="text-xs">{g.school_year}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => openEdit(g)}><Pencil className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => setDeleteId(g.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
          <DialogHeader><DialogTitle>{editing ? "Edit Grade" : "Record Grade"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Student *</Label>
              <Select value={form.student_id || ""} onValueChange={v => updateField("student_id", v)}>
                <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                <SelectContent>{students?.map(s => <SelectItem key={s.id} value={s.id}>{s.last_name}, {s.first_name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label>Subject *</Label>
              <Select value={form.subject_id || ""} onValueChange={v => updateField("subject_id", v)}>
                <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                <SelectContent>{subjects?.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.code} – {s.name}</SelectItem>)}</SelectContent>
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
              <Label>Quarter *</Label>
              <Select value={form.quarter || "Q1"} onValueChange={v => updateField("quarter", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["Q1", "Q2", "Q3", "Q4"].map(q => <SelectItem key={q} value={q}>{q}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Grade (0–100) *</Label>
              <Input type="number" min={0} max={100} step={0.1} value={form.grade ?? ""} onChange={e => updateField("grade", Number(e.target.value))} />
            </div>
            <div>
              <Label>School Year *</Label>
              <Input value={form.school_year || ""} onChange={e => updateField("school_year", e.target.value)} />
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
          <DialogHeader><DialogTitle>Remove Grade?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This will permanently remove this grade record.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { if (deleteId) deleteMut.mutate(deleteId, { onSuccess: () => setDeleteId(null) }); }}>Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Grades;