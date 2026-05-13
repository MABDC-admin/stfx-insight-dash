import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { toast } from "sonner";

export type Attendance = Tables<"attendance">;
export type AttendanceInsert = TablesInsert<"attendance">;
export type AttendanceUpdate = TablesUpdate<"attendance">;

export function useAttendance(filters?: { search?: string; date?: string; status?: string; sectionId?: string }) {
  return useQuery({
    queryKey: ["attendance", filters],
    queryFn: async () => {
      let q = supabase
        .from("attendance")
        .select("*, students(first_name,last_name,lrn), sections(name,grade_level)")
        .order("date", { ascending: false });
      if (filters?.date) q = q.eq("date", filters.date);
      if (filters?.status) q = q.eq("status", filters.status as Attendance["status"]);
      if (filters?.sectionId) q = q.eq("section_id", filters.sectionId);
      const { data, error } = await q;
      if (error) throw error;
      if (filters?.search) {
        const s = filters.search.toLowerCase();
        return data.filter((a: any) => `${a.students?.last_name} ${a.students?.first_name} ${a.students?.lrn || ""}`.toLowerCase().includes(s));
      }
      return data;
    },
  });
}

export function useCreateAttendance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (a: AttendanceInsert) => {
      const { data, error } = await supabase.from("attendance").insert(a).select().single();
      if (error) throw error; return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["attendance"] }); toast.success("Attendance recorded"); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateAttendance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...u }: AttendanceUpdate & { id: string }) => {
      const { data, error } = await supabase.from("attendance").update(u).eq("id", id).select().single();
      if (error) throw error; return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["attendance"] }); toast.success("Attendance updated"); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteAttendance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("attendance").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["attendance"] }); toast.success("Attendance removed"); },
    onError: (e: Error) => toast.error(e.message),
  });
}