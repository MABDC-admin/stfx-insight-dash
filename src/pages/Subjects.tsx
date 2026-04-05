import { useState } from "react";
import { useSubjects, useCreateSubject, useUpdateSubject, useDeleteSubject, type Subject, type SubjectInsert } from "@/hooks/useSubjects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Plus, Pencil, Trash2, BookOpen, Download } from "lucide-react";
import { toast } from "sonner";
import SideNavigation from "@/components/SideNavigation";
import DashboardHeader from "@/components/DashboardHeader";
import MouseFollower from "@/components/MouseFollower";

const gradeLabel = (g: number) => g <= 6 ? `Grade ${g}` : g <= 10 ? `Grade ${g}` : `Grade ${g} (SHS)`;

const emptySubject: Partial<SubjectInsert> = {
  code: "", name: "", school_level: "elementary", grade_level: 1, is_core: true, units: 1,
};

const Subjects = () => {
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Subject | null>(null);
  const [form, setForm] = useState<Partial<SubjectInsert>>(emptySubject);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: subjects, isLoading } = useSubjects({ search: search || undefined, gradeLevel: gradeFilter ? Number(gradeFilter) : undefined });
  const createMut = useCreateSubject();
  const updateMut = useUpdateSubject();
  const deleteMut = useDeleteSubject();

  const openCreate = () => { setEditing(null); setForm(emptySubject); setDialogOpen(true); };
  const openEdit = (s: Subject) => { setEditing(s); setForm(s); setDialogOpen(true); };
  const updateField = (key: string, value: unknown) => setForm(p => ({ ...p, [key]: value }));

  const schoolLevelFromGrade = (g: number): "elementary" | "junior_high" | "senior_high" =>
    g <= 6 ? "elementary" : g <= 10 ? "junior_high" : "senior_high";

  const handleSave = () => {
    if (!form.code || !form.name) { toast.error("Fill required fields"); return; }
    const payload = { ...form, school_level: schoolLevelFromGrade(form.grade_level || 1) } as SubjectInsert;
    if (editing) updateMut.mutate({ ...payload, id: editing.id }, { onSuccess: () => setDialogOpen(false) });
    else createMut.mutate(payload, { onSuccess: () => setDialogOpen(false) });
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
                    <BookOpen className="h-6 w-6 text-primary" /> Subjects / Curriculum
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">{subjects?.length || 0} subjects</p>
                </div>
                <Button size="sm" onClick={openCreate}><Plus className="h-4 w-4 mr-1" /> Add Subject</Button>
              </div>
            </div>

            <div className="glass-card p-4 animate-slide-up" style={{ animationDelay: "100ms" }}>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search subjects..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
                </div>
                <Select value={gradeFilter} onValueChange={setGradeFilter}>
                  <SelectTrigger className="w-[160px]"><SelectValue placeholder="Grade Level" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Grades</SelectItem>
                    {Array.from({ length: 12 }, (_, i) => <SelectItem key={i+1} value={String(i+1)}>{gradeLabel(i+1)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="glass-card animate-slide-up" style={{ animationDelay: "200ms" }}>
              {isLoading ? <div className="p-12 text-center text-muted-foreground">Loading...</div> :
              !subjects?.length ? <div className="p-12 text-center text-muted-foreground">No subjects found.</div> : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Subject Name</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Units</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subjects.map((s, i) => (
                      <TableRow key={s.id} className="animate-slide-up" style={{ animationDelay: `${i*30}ms` }}>
                        <TableCell className="font-mono text-xs">{s.code}</TableCell>
                        <TableCell className="font-medium">{s.name}</TableCell>
                        <TableCell><Badge variant="outline">{s.school_level.replace("_"," ")}</Badge></TableCell>
                        <TableCell>{gradeLabel(s.grade_level)}</TableCell>
                        <TableCell>{s.units}</TableCell>
                        <TableCell>{s.is_core ? <Badge variant="secondary" className="bg-primary/10 text-primary">Core</Badge> : <Badge variant="outline">Elective</Badge>}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(s)}><Pencil className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => setDeleteId(s.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
          <DialogHeader><DialogTitle>{editing ? "Edit Subject" : "Add Subject"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Code *</Label><Input placeholder="e.g. MATH-7" value={form.code || ""} onChange={e => updateField("code", e.target.value)} /></div>
            <div><Label>Grade Level *</Label>
              <Select value={String(form.grade_level || 1)} onValueChange={v => updateField("grade_level", Number(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{Array.from({ length: 12 }, (_, i) => <SelectItem key={i+1} value={String(i+1)}>{gradeLabel(i+1)}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="col-span-2"><Label>Subject Name *</Label><Input value={form.name || ""} onChange={e => updateField("name", e.target.value)} /></div>
            <div><Label>Units</Label><Input type="number" min={0.5} step={0.5} value={form.units || 1} onChange={e => updateField("units", Number(e.target.value))} /></div>
            <div className="flex items-end gap-2 pb-1">
              <Checkbox checked={form.is_core ?? true} onCheckedChange={v => updateField("is_core", v)} id="is_core" />
              <Label htmlFor="is_core">Core Subject</Label>
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
          <DialogHeader><DialogTitle>Delete Subject?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This will permanently remove this subject.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { if (deleteId) deleteMut.mutate(deleteId, { onSuccess: () => setDeleteId(null) }); }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Subjects;
