import { useState } from "react";
import { useStudents, useCreateStudent, useUpdateStudent, useDeleteStudent, type Student, type StudentInsert } from "@/hooks/useStudents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Search, Plus, Pencil, Trash2, UserPlus, Download, Filter } from "lucide-react";
import { toast } from "sonner";
import SideNavigation from "@/components/SideNavigation";
import DashboardHeader from "@/components/DashboardHeader";
import MouseFollower from "@/components/MouseFollower";

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  inactive: "bg-muted text-muted-foreground",
  transferred: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  graduated: "bg-purple-500/15 text-purple-700 dark:text-purple-400",
  dropped: "bg-destructive/15 text-destructive",
};

const gradeLabel = (g: number) => g <= 6 ? `Grade ${g}` : g <= 10 ? `Grade ${g}` : `Grade ${g} (SHS)`;
const schoolLevelFromGrade = (g: number): "elementary" | "junior_high" | "senior_high" =>
  g <= 6 ? "elementary" : g <= 10 ? "junior_high" : "senior_high";

const emptyStudent: Partial<StudentInsert> = {
  first_name: "", last_name: "", date_of_birth: "", gender: "Male",
  current_grade_level: 1, status: "active", school_level: "elementary",
};

const Students = () => {
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [form, setForm] = useState<Partial<StudentInsert>>(emptyStudent);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: students, isLoading } = useStudents({
    search: search || undefined,
    gradeLevel: gradeFilter ? Number(gradeFilter) : undefined,
    status: statusFilter || undefined,
  });

  const createMut = useCreateStudent();
  const updateMut = useUpdateStudent();
  const deleteMut = useDeleteStudent();

  const openCreate = () => { setEditing(null); setForm(emptyStudent); setDialogOpen(true); };
  const openEdit = (s: Student) => { setEditing(s); setForm(s); setDialogOpen(true); };

  const handleSave = () => {
    if (!form.first_name || !form.last_name || !form.date_of_birth) {
      toast.error("Please fill required fields"); return;
    }
    const payload = {
      ...form,
      school_level: schoolLevelFromGrade(form.current_grade_level || 1),
    } as StudentInsert;

    if (editing) {
      updateMut.mutate({ ...payload, id: editing.id }, { onSuccess: () => setDialogOpen(false) });
    } else {
      createMut.mutate(payload, { onSuccess: () => setDialogOpen(false) });
    }
  };

  const handleExport = () => {
    if (!students?.length) return;
    const headers = ["LRN","Last Name","First Name","Grade Level","Status","Gender","Date of Birth"];
    const rows = students.map(s => [s.lrn||"",s.last_name,s.first_name,s.current_grade_level,s.status,s.gender,s.date_of_birth]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "students.csv"; a.click();
    toast.success("Exported to CSV");
  };

  const updateField = (key: string, value: unknown) => setForm(p => ({ ...p, [key]: value }));

  return (
    <div className="min-h-screen bg-background transition-colors duration-500">
      <MouseFollower />
      <SideNavigation />
      <div className="pl-16 lg:pl-56 transition-all duration-300">
        <div className="p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-5 relative z-10">
            <DashboardHeader />

            {/* Page Header */}
            <div className="glass-card p-6 animate-slide-up">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <UserPlus className="h-6 w-6 text-primary" />
                    Students & Enrollment
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Manage learner records • {students?.length || 0} total students
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="h-4 w-4 mr-1" /> Export
                  </Button>
                  <Button size="sm" onClick={openCreate}>
                    <Plus className="h-4 w-4 mr-1" /> Add Student
                  </Button>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="glass-card p-4 animate-slide-up" style={{ animationDelay: "100ms" }}>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search by name or LRN..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
                </div>
                <Select value={gradeFilter} onValueChange={setGradeFilter}>
                  <SelectTrigger className="w-[160px]"><Filter className="h-4 w-4 mr-1" /><SelectValue placeholder="Grade Level" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Grades</SelectItem>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i + 1} value={String(i + 1)}>{gradeLabel(i + 1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {["active","inactive","transferred","graduated","dropped"].map(s => (
                      <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Table */}
            <div className="glass-card animate-slide-up" style={{ animationDelay: "200ms" }}>
              {isLoading ? (
                <div className="p-12 text-center text-muted-foreground">Loading students...</div>
              ) : !students?.length ? (
                <div className="p-12 text-center text-muted-foreground">
                  No students found. Click "Add Student" to get started.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>LRN</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((s, i) => (
                      <TableRow key={s.id} className="animate-slide-up" style={{ animationDelay: `${i * 30}ms` }}>
                        <TableCell className="font-mono text-xs">{s.lrn || "—"}</TableCell>
                        <TableCell className="font-medium">{s.last_name}, {s.first_name} {s.middle_name || ""}</TableCell>
                        <TableCell>{gradeLabel(s.current_grade_level)}</TableCell>
                        <TableCell>{s.gender}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={statusColors[s.status] || ""}>{s.status}</Badge>
                        </TableCell>
                        <TableCell className="text-xs">{s.contact_number || s.guardian_contact || "—"}</TableCell>
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

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Student" : "Add New Student"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>LRN</Label><Input placeholder="12-digit LRN" value={form.lrn || ""} onChange={e => updateField("lrn", e.target.value)} maxLength={12} /></div>
            <div><Label>Gender *</Label>
              <Select value={form.gender || "Male"} onValueChange={v => updateField("gender", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent>
              </Select>
            </div>
            <div><Label>First Name *</Label><Input value={form.first_name || ""} onChange={e => updateField("first_name", e.target.value)} /></div>
            <div><Label>Middle Name</Label><Input value={form.middle_name || ""} onChange={e => updateField("middle_name", e.target.value)} /></div>
            <div><Label>Last Name *</Label><Input value={form.last_name || ""} onChange={e => updateField("last_name", e.target.value)} /></div>
            <div><Label>Suffix</Label><Input placeholder="Jr., III" value={form.suffix || ""} onChange={e => updateField("suffix", e.target.value)} /></div>
            <div><Label>Date of Birth *</Label><Input type="date" value={form.date_of_birth || ""} onChange={e => updateField("date_of_birth", e.target.value)} /></div>
            <div><Label>Grade Level *</Label>
              <Select value={String(form.current_grade_level || 1)} onValueChange={v => updateField("current_grade_level", Number(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{Array.from({ length: 12 }, (_, i) => <SelectItem key={i+1} value={String(i+1)}>{gradeLabel(i+1)}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Contact Number</Label><Input value={form.contact_number || ""} onChange={e => updateField("contact_number", e.target.value)} /></div>
            <div><Label>Email</Label><Input type="email" value={form.email || ""} onChange={e => updateField("email", e.target.value)} /></div>
            <div><Label>Guardian Name</Label><Input value={form.guardian_name || ""} onChange={e => updateField("guardian_name", e.target.value)} /></div>
            <div><Label>Guardian Contact</Label><Input value={form.guardian_contact || ""} onChange={e => updateField("guardian_contact", e.target.value)} /></div>
            <div className="col-span-2"><Label>Address (Barangay, Municipality, Province)</Label>
              <div className="grid grid-cols-3 gap-2">
                <Input placeholder="Barangay" value={form.address_barangay || ""} onChange={e => updateField("address_barangay", e.target.value)} />
                <Input placeholder="Municipality" value={form.address_municipality || ""} onChange={e => updateField("address_municipality", e.target.value)} />
                <Input placeholder="Province" value={form.address_province || ""} onChange={e => updateField("address_province", e.target.value)} />
              </div>
            </div>
            <div><Label>Status</Label>
              <Select value={form.status || "active"} onValueChange={v => updateField("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["active","inactive","transferred","graduated","dropped"].map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Previous School</Label><Input value={form.previous_school || ""} onChange={e => updateField("previous_school", e.target.value)} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={createMut.isPending || updateMut.isPending}>
              {createMut.isPending || updateMut.isPending ? "Saving..." : editing ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Student?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This action cannot be undone. The student record will be permanently removed.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { if (deleteId) deleteMut.mutate(deleteId, { onSuccess: () => setDeleteId(null) }); }}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Students;
