import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { toast } from "sonner";

export type Subject = Tables<"subjects">;
export type SubjectInsert = TablesInsert<"subjects">;
export type SubjectUpdate = TablesUpdate<"subjects">;

export function useSubjects(filters?: { search?: string; gradeLevel?: number; schoolLevel?: string }) {
  return useQuery({
    queryKey: ["subjects", filters],
    queryFn: async () => {
      let query = supabase.from("subjects").select("*").order("code");
      if (filters?.search) query = query.or(`name.ilike.%${filters.search}%,code.ilike.%${filters.search}%`);
      if (filters?.gradeLevel) query = query.eq("grade_level", filters.gradeLevel);
      if (filters?.schoolLevel) query = query.eq("school_level", filters.schoolLevel as Subject["school_level"]);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateSubject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (s: SubjectInsert) => {
      const { data, error } = await supabase.from("subjects").insert(s).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["subjects"] }); toast.success("Subject added"); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateSubject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...u }: SubjectUpdate & { id: string }) => {
      const { data, error } = await supabase.from("subjects").update(u).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["subjects"] }); toast.success("Subject updated"); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteSubject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("subjects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["subjects"] }); toast.success("Subject deleted"); },
    onError: (e: Error) => toast.error(e.message),
  });
}
