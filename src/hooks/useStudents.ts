import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { toast } from "sonner";

export type Student = Tables<"students">;
export type StudentInsert = TablesInsert<"students">;
export type StudentUpdate = TablesUpdate<"students">;

export function useStudents(filters?: {
  search?: string;
  gradeLevel?: number;
  status?: string;
  schoolLevel?: string;
}) {
  return useQuery({
    queryKey: ["students", filters],
    queryFn: async () => {
      let query = supabase.from("students").select("*").order("last_name");

      if (filters?.search) {
        query = query.or(
          `first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,lrn.ilike.%${filters.search}%`
        );
      }
      if (filters?.gradeLevel) {
        query = query.eq("current_grade_level", filters.gradeLevel);
      }
      if (filters?.status) {
        query = query.eq("status", filters.status as Student["status"]);
      }
      if (filters?.schoolLevel) {
        query = query.eq("school_level", filters.schoolLevel as Student["school_level"]);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (student: StudentInsert) => {
      const { data, error } = await supabase.from("students").insert(student).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student added successfully");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: StudentUpdate & { id: string }) => {
      const { data, error } = await supabase.from("students").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student updated successfully");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("students").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
