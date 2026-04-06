import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { toast } from "sonner";

export type Enrollment = Tables<"enrollments">;
export type EnrollmentInsert = TablesInsert<"enrollments">;
export type EnrollmentUpdate = TablesUpdate<"enrollments">;

export function useEnrollments(filters?: { search?: string; gradeLevel?: number; schoolYear?: string; status?: string }) {
  return useQuery({
    queryKey: ["enrollments", filters],
    queryFn: async () => {
      let query = supabase
        .from("enrollments")
        .select("*, students(first_name, last_name, lrn, middle_name), sections(name, grade_level)")
        .order("created_at", { ascending: false });
      if (filters?.gradeLevel) query = query.eq("grade_level", filters.gradeLevel);
      if (filters?.schoolYear) query = query.eq("school_year", filters.schoolYear);
      if (filters?.status) query = query.eq("status", filters.status as Enrollment["status"]);
      const { data, error } = await query;
      if (error) throw error;
      // client-side search on student name
      if (filters?.search) {
        const s = filters.search.toLowerCase();
        return data.filter((e: any) => {
          const name = `${e.students?.last_name} ${e.students?.first_name} ${e.students?.lrn || ""}`.toLowerCase();
          return name.includes(s);
        });
      }
      return data;
    },
  });
}

export function useCreateEnrollment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (e: EnrollmentInsert) => {
      const { data, error } = await supabase.from("enrollments").insert(e).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["enrollments"] }); toast.success("Student enrolled"); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateEnrollment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...u }: EnrollmentUpdate & { id: string }) => {
      const { data, error } = await supabase.from("enrollments").update(u).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["enrollments"] }); toast.success("Enrollment updated"); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteEnrollment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("enrollments").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["enrollments"] }); toast.success("Enrollment removed"); },
    onError: (e: Error) => toast.error(e.message),
  });
}
