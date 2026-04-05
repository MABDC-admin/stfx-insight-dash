import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { toast } from "sonner";

export type Teacher = Tables<"teachers">;
export type TeacherInsert = TablesInsert<"teachers">;
export type TeacherUpdate = TablesUpdate<"teachers">;

export function useTeachers(filters?: {
  search?: string;
  status?: string;
  department?: string;
}) {
  return useQuery({
    queryKey: ["teachers", filters],
    queryFn: async () => {
      let query = supabase.from("teachers").select("*").order("last_name");
      if (filters?.search) {
        query = query.or(
          `first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,employee_id.ilike.%${filters.search}%`
        );
      }
      if (filters?.status) query = query.eq("status", filters.status as Teacher["status"]);
      if (filters?.department) query = query.eq("department", filters.department);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateTeacher() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (teacher: TeacherInsert) => {
      const { data, error } = await supabase.from("teachers").insert(teacher).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["teachers"] }); toast.success("Teacher added"); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateTeacher() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: TeacherUpdate & { id: string }) => {
      const { data, error } = await supabase.from("teachers").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["teachers"] }); toast.success("Teacher updated"); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteTeacher() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("teachers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["teachers"] }); toast.success("Teacher deleted"); },
    onError: (e: Error) => toast.error(e.message),
  });
}
