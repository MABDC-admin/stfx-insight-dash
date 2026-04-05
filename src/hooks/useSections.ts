import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { toast } from "sonner";

export type Section = Tables<"sections">;
export type SectionInsert = TablesInsert<"sections">;
export type SectionUpdate = TablesUpdate<"sections">;

export function useSections(filters?: { search?: string; gradeLevel?: number; schoolYear?: string }) {
  return useQuery({
    queryKey: ["sections", filters],
    queryFn: async () => {
      let query = supabase.from("sections").select("*, teachers(first_name, last_name)").order("grade_level").order("name");
      if (filters?.search) query = query.ilike("name", `%${filters.search}%`);
      if (filters?.gradeLevel) query = query.eq("grade_level", filters.gradeLevel);
      if (filters?.schoolYear) query = query.eq("school_year", filters.schoolYear);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateSection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (s: SectionInsert) => {
      const { data, error } = await supabase.from("sections").insert(s).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["sections"] }); toast.success("Section created"); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateSection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...u }: SectionUpdate & { id: string }) => {
      const { data, error } = await supabase.from("sections").update(u).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["sections"] }); toast.success("Section updated"); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteSection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("sections").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["sections"] }); toast.success("Section deleted"); },
    onError: (e: Error) => toast.error(e.message),
  });
}
