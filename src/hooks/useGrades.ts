import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { toast } from "sonner";

export type Grade = Tables<"grades">;
export type GradeInsert = TablesInsert<"grades">;
export type GradeUpdate = TablesUpdate<"grades">;

export function useGrades(filters?: { search?: string; quarter?: string; subjectId?: string; schoolYear?: string }) {
  return useQuery({
    queryKey: ["grades", filters],
    queryFn: async () => {
      let q = supabase
        .from("grades")
        .select("*, students(first_name,last_name,lrn), subjects(name,code), sections(name)")
        .order("created_at", { ascending: false });
      if (filters?.quarter) q = q.eq("quarter", filters.quarter as Grade["quarter"]);
      if (filters?.subjectId) q = q.eq("subject_id", filters.subjectId);
      if (filters?.schoolYear) q = q.eq("school_year", filters.schoolYear);
      const { data, error } = await q;
      if (error) throw error;
      if (filters?.search) {
        const s = filters.search.toLowerCase();
        return data.filter((g: any) => `${g.students?.last_name} ${g.students?.first_name} ${g.students?.lrn || ""}`.toLowerCase().includes(s));
      }
      return data;
    },
  });
}

export function useCreateGrade() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (g: GradeInsert) => {
      const { data, error } = await supabase.from("grades").insert(g).select().single();
      if (error) throw error; return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["grades"] }); toast.success("Grade recorded"); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateGrade() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...u }: GradeUpdate & { id: string }) => {
      const { data, error } = await supabase.from("grades").update(u).eq("id", id).select().single();
      if (error) throw error; return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["grades"] }); toast.success("Grade updated"); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteGrade() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("grades").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["grades"] }); toast.success("Grade removed"); },
    onError: (e: Error) => toast.error(e.message),
  });
}