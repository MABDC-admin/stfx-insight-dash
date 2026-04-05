import { useState } from "react";
import { useSections, useCreateSection, useUpdateSection, useDeleteSection, type SectionInsert } from "@/hooks/useSections";
import { useTeachers } from "@/hooks/useTeachers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Search, Plus, Pencil, Trash2, Layers } from "lucide-react";
import { toast } from "sonner";
import SideNavigation from "@/components/SideNavigation";
import DashboardHeader from "@/components/DashboardHeader";
import MouseFollower from "@/components/MouseFollower";

const gradeLabel = (g: number) => g <= 6 ? `Grade ${g}` : g <= 10 ? `Grade ${g}` : `Grade ${g} (SHS)`;
const schoolLevelFromGrade = (g: number): "elementary" | "junior_high" | "senior_high" =>
  g <= 6 ? "elementary" : g <= 10 ? "junior_high" : "senior_high";

const currentSY = () => {
  const y = new Date().getFullYear();
  return `${y}-${y + 1}`;
};

const emptySection: Partial<SectionInsert> = {
  name: "", grade_level: 1, school_year: currentSY(), school_level: "elementary", capacity: 40, is_active: true,
};

const Sections = () => {
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<Partial<SectionInsert>>(emptySection);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: sections, isLoading } = useSections({ search: search || undefined, gradeLevel: gradeFilter ? Number(gradeFilter) : undefined });
  const { data: teachers } = useTeachers({ status: "active" });
  const createMut = useCreateSection();
  const updateMut = useUpdateSection();
  const deleteMut = useDeleteSection();

  const openCreate = () => { setEditing(null); setForm(emptySection); setDialogOpen(true); };
  const openEdit = (s: any) => { setEditing(s); setForm(s); setDialogOpen(true); };
  const updateField = (key: string, value: unknown) => setForm(p => ({ ...p, [key]: value }));

  const handleSave = () => {
    if (!form.name || !form.school_year) { toast.error("Fill required fields"); return; }
    const payload = { ...form, school_level: schoolLevelFromGrade(form.grade_level || 1) } as SectionInsert;
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
                    <Layers className="h-6 w-6 text-primary" /> Sections & Classes
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">{sections?.length || 0} sections</p>
                </div>
                <Button size="sm" onClick={openCreate}><Plus className="h-4 w-4 mr-1" /> Add Section</Button>
              </div>
            </div>

            <div className="glass-card p-4 animate-slide-up" style={{ animationDelay: "100ms" }}>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search sections..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
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
              !sections?.length ? <div className="p-12 text-center text-muted-foreground">No sections found.</div> : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Section Name</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>School Year</TableHead>
                      <TableHead>Adviser</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sections.map((s: any, i: number) => (
                      <TableRow key={s.id} className="animate-slide-up" style={{ animationDelay: `${i*30}ms` }}>
                        <TableCell className="font-medium">{s.name}</TableCell>
                        <TableCell>{gradeLabel(s.grade_level)}</TableCell>
                        <TableCell>{s.school_year}</TableCell>
                        <TableCell>{s.teachers ? `${s.teachers.last_name}, ${s.teachers.first_name}` : "—"}</TableCell>
                        <TableCell>{s.room || "—"}</TableCell>
                        <TableCell>{s.capacity}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={s.is_active ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" : "bg-muted text-muted-foreground"}>
                            {s.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
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
          <DialogHeader><DialogTitle>{editing ? "Edit Section" : "Add Section"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Section Name *</Label><Input placeholder="e.g. Rizal, Bonifacio" value={form.name || ""} onChange={e => updateField("name", e.target.value)} /></div>
            <div><Label>School Year *</Label><Input placeholder="2025-2026" value={form.school_year || ""} onChange={e => updateField("school_year", e.target.value)} /></div>
            <div><Label>Grade Level *</Label>
              <Select value={String(form.grade_level || 1)} onValueChange={v => updateField("grade_level", Number(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{Array.from({ length: 12 }, (_, i) => <SelectItem key={i+1} value={String(i+1)}>{gradeLabel(i+1)}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Room</Label><Input placeholder="Room 101" value={form.room || ""} onChange={e => updateField("room", e.target.value)} /></div>
            <div><Label>Adviser</Label>
              <Select value={form.adviser_id || "none"} onValueChange={v => updateField("adviser_id", v === "none" ? null : v)}>
                <SelectTrigger><SelectValue placeholder="Select adviser" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No adviser</SelectItem>
                  {teachers?.map(t => <SelectItem key={t.id} value={t.id}>{t.last_name}, {t.first_name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Capacity</Label><Input type="number" min={1} value={form.capacity || 40} onChange={e => updateField("capacity", Number(e.target.value))} /></div>
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
          <DialogHeader><DialogTitle>Delete Section?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This will permanently remove this section and its enrollments.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { if (deleteId) deleteMut.mutate(deleteId, { onSuccess: () => setDeleteId(null) }); }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sections;
