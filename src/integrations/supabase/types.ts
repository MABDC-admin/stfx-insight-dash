export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      attendance: {
        Row: {
          created_at: string
          date: string
          id: string
          remarks: string | null
          section_id: string | null
          status: Database["public"]["Enums"]["attendance_status"]
          student_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          remarks?: string | null
          section_id?: string | null
          status?: Database["public"]["Enums"]["attendance_status"]
          student_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          remarks?: string | null
          section_id?: string | null
          status?: Database["public"]["Enums"]["attendance_status"]
          student_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          created_at: string
          date_enrolled: string | null
          grade_level: number
          id: string
          remarks: string | null
          school_year: string
          section_id: string
          status: Database["public"]["Enums"]["enrollment_status"]
          student_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_enrolled?: string | null
          grade_level: number
          id?: string
          remarks?: string | null
          school_year: string
          section_id: string
          status?: Database["public"]["Enums"]["enrollment_status"]
          student_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_enrolled?: string | null
          grade_level?: number
          id?: string
          remarks?: string | null
          school_year?: string
          section_id?: string
          status?: Database["public"]["Enums"]["enrollment_status"]
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      grades: {
        Row: {
          created_at: string
          grade: number
          id: string
          quarter: Database["public"]["Enums"]["grade_quarter"]
          remarks: string | null
          school_year: string
          section_id: string | null
          student_id: string
          subject_id: string
          teacher_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          grade: number
          id?: string
          quarter: Database["public"]["Enums"]["grade_quarter"]
          remarks?: string | null
          school_year: string
          section_id?: string | null
          student_id: string
          subject_id: string
          teacher_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          grade?: number
          id?: string
          quarter?: Database["public"]["Enums"]["grade_quarter"]
          remarks?: string | null
          school_year?: string
          section_id?: string | null
          student_id?: string
          subject_id?: string
          teacher_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      section_subjects: {
        Row: {
          created_at: string
          id: string
          schedule: string | null
          section_id: string
          subject_id: string
          teacher_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          schedule?: string | null
          section_id: string
          subject_id: string
          teacher_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          schedule?: string | null
          section_id?: string
          subject_id?: string
          teacher_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "section_subjects_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "section_subjects_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "section_subjects_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      sections: {
        Row: {
          adviser_id: string | null
          capacity: number | null
          created_at: string
          grade_level: number
          id: string
          is_active: boolean | null
          name: string
          room: string | null
          school_level: Database["public"]["Enums"]["school_level"]
          school_year: string
          shs_strand: Database["public"]["Enums"]["shs_strand"] | null
          shs_track: Database["public"]["Enums"]["shs_track"] | null
          updated_at: string
        }
        Insert: {
          adviser_id?: string | null
          capacity?: number | null
          created_at?: string
          grade_level: number
          id?: string
          is_active?: boolean | null
          name: string
          room?: string | null
          school_level: Database["public"]["Enums"]["school_level"]
          school_year: string
          shs_strand?: Database["public"]["Enums"]["shs_strand"] | null
          shs_track?: Database["public"]["Enums"]["shs_track"] | null
          updated_at?: string
        }
        Update: {
          adviser_id?: string | null
          capacity?: number | null
          created_at?: string
          grade_level?: number
          id?: string
          is_active?: boolean | null
          name?: string
          room?: string | null
          school_level?: Database["public"]["Enums"]["school_level"]
          school_year?: string
          shs_strand?: Database["public"]["Enums"]["shs_strand"] | null
          shs_track?: Database["public"]["Enums"]["shs_track"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sections_adviser_id_fkey"
            columns: ["adviser_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          address_barangay: string | null
          address_municipality: string | null
          address_province: string | null
          address_region: string | null
          address_street: string | null
          birth_place: string | null
          contact_number: string | null
          created_at: string
          current_grade_level: number
          date_of_birth: string
          email: string | null
          first_name: string
          gender: string
          guardian_contact: string | null
          guardian_name: string | null
          guardian_relationship: string | null
          id: string
          is_4ps_beneficiary: boolean | null
          is_indigenous_people: boolean | null
          is_pwd: boolean | null
          last_name: string
          lrn: string | null
          middle_name: string | null
          mother_tongue: string | null
          nationality: string | null
          photo_url: string | null
          previous_school: string | null
          psa_birth_cert_no: string | null
          religion: string | null
          remarks: string | null
          school_level: Database["public"]["Enums"]["school_level"]
          shs_strand: Database["public"]["Enums"]["shs_strand"] | null
          shs_track: Database["public"]["Enums"]["shs_track"] | null
          status: Database["public"]["Enums"]["student_status"]
          suffix: string | null
          updated_at: string
        }
        Insert: {
          address_barangay?: string | null
          address_municipality?: string | null
          address_province?: string | null
          address_region?: string | null
          address_street?: string | null
          birth_place?: string | null
          contact_number?: string | null
          created_at?: string
          current_grade_level: number
          date_of_birth: string
          email?: string | null
          first_name: string
          gender: string
          guardian_contact?: string | null
          guardian_name?: string | null
          guardian_relationship?: string | null
          id?: string
          is_4ps_beneficiary?: boolean | null
          is_indigenous_people?: boolean | null
          is_pwd?: boolean | null
          last_name: string
          lrn?: string | null
          middle_name?: string | null
          mother_tongue?: string | null
          nationality?: string | null
          photo_url?: string | null
          previous_school?: string | null
          psa_birth_cert_no?: string | null
          religion?: string | null
          remarks?: string | null
          school_level?: Database["public"]["Enums"]["school_level"]
          shs_strand?: Database["public"]["Enums"]["shs_strand"] | null
          shs_track?: Database["public"]["Enums"]["shs_track"] | null
          status?: Database["public"]["Enums"]["student_status"]
          suffix?: string | null
          updated_at?: string
        }
        Update: {
          address_barangay?: string | null
          address_municipality?: string | null
          address_province?: string | null
          address_region?: string | null
          address_street?: string | null
          birth_place?: string | null
          contact_number?: string | null
          created_at?: string
          current_grade_level?: number
          date_of_birth?: string
          email?: string | null
          first_name?: string
          gender?: string
          guardian_contact?: string | null
          guardian_name?: string | null
          guardian_relationship?: string | null
          id?: string
          is_4ps_beneficiary?: boolean | null
          is_indigenous_people?: boolean | null
          is_pwd?: boolean | null
          last_name?: string
          lrn?: string | null
          middle_name?: string | null
          mother_tongue?: string | null
          nationality?: string | null
          photo_url?: string | null
          previous_school?: string | null
          psa_birth_cert_no?: string | null
          religion?: string | null
          remarks?: string | null
          school_level?: Database["public"]["Enums"]["school_level"]
          shs_strand?: Database["public"]["Enums"]["shs_strand"] | null
          shs_track?: Database["public"]["Enums"]["shs_track"] | null
          status?: Database["public"]["Enums"]["student_status"]
          suffix?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      subjects: {
        Row: {
          code: string
          created_at: string
          description: string | null
          grade_level: number
          id: string
          is_core: boolean | null
          name: string
          school_level: Database["public"]["Enums"]["school_level"]
          semester: Database["public"]["Enums"]["semester"] | null
          shs_strand: Database["public"]["Enums"]["shs_strand"] | null
          shs_track: Database["public"]["Enums"]["shs_track"] | null
          units: number | null
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          grade_level: number
          id?: string
          is_core?: boolean | null
          name: string
          school_level: Database["public"]["Enums"]["school_level"]
          semester?: Database["public"]["Enums"]["semester"] | null
          shs_strand?: Database["public"]["Enums"]["shs_strand"] | null
          shs_track?: Database["public"]["Enums"]["shs_track"] | null
          units?: number | null
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          grade_level?: number
          id?: string
          is_core?: boolean | null
          name?: string
          school_level?: Database["public"]["Enums"]["school_level"]
          semester?: Database["public"]["Enums"]["semester"] | null
          shs_strand?: Database["public"]["Enums"]["shs_strand"] | null
          shs_track?: Database["public"]["Enums"]["shs_track"] | null
          units?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      teachers: {
        Row: {
          address: string | null
          civil_status: string | null
          contact_number: string | null
          created_at: string
          date_hired: string | null
          date_of_birth: string | null
          department: string | null
          education_level: string | null
          email: string | null
          employee_id: string
          employment_type: string | null
          first_name: string
          gender: string | null
          id: string
          last_name: string
          license_expiry: string | null
          license_number: string | null
          middle_name: string | null
          pagibig_number: string | null
          philhealth_number: string | null
          photo_url: string | null
          position: string
          remarks: string | null
          salary_grade: number | null
          specialization: string | null
          sss_number: string | null
          status: Database["public"]["Enums"]["teacher_status"]
          suffix: string | null
          tin: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          civil_status?: string | null
          contact_number?: string | null
          created_at?: string
          date_hired?: string | null
          date_of_birth?: string | null
          department?: string | null
          education_level?: string | null
          email?: string | null
          employee_id: string
          employment_type?: string | null
          first_name: string
          gender?: string | null
          id?: string
          last_name: string
          license_expiry?: string | null
          license_number?: string | null
          middle_name?: string | null
          pagibig_number?: string | null
          philhealth_number?: string | null
          photo_url?: string | null
          position?: string
          remarks?: string | null
          salary_grade?: number | null
          specialization?: string | null
          sss_number?: string | null
          status?: Database["public"]["Enums"]["teacher_status"]
          suffix?: string | null
          tin?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          civil_status?: string | null
          contact_number?: string | null
          created_at?: string
          date_hired?: string | null
          date_of_birth?: string | null
          department?: string | null
          education_level?: string | null
          email?: string | null
          employee_id?: string
          employment_type?: string | null
          first_name?: string
          gender?: string | null
          id?: string
          last_name?: string
          license_expiry?: string | null
          license_number?: string | null
          middle_name?: string | null
          pagibig_number?: string | null
          philhealth_number?: string | null
          photo_url?: string | null
          position?: string
          remarks?: string | null
          salary_grade?: number | null
          specialization?: string | null
          sss_number?: string | null
          status?: Database["public"]["Enums"]["teacher_status"]
          suffix?: string | null
          tin?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      attendance_status: "present" | "absent" | "late" | "excused"
      enrollment_status: "enrolled" | "pending" | "cancelled" | "completed"
      grade_quarter: "Q1" | "Q2" | "Q3" | "Q4"
      school_level: "elementary" | "junior_high" | "senior_high"
      semester: "first" | "second"
      shs_strand:
        | "stem"
        | "abm"
        | "humss"
        | "gas"
        | "ict"
        | "he"
        | "ia"
        | "afa"
        | "sports"
        | "arts_design"
      shs_track: "academic" | "tvl" | "sports" | "arts_design"
      student_status:
        | "active"
        | "inactive"
        | "transferred"
        | "graduated"
        | "dropped"
      teacher_status: "active" | "on_leave" | "resigned" | "retired"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      attendance_status: ["present", "absent", "late", "excused"],
      enrollment_status: ["enrolled", "pending", "cancelled", "completed"],
      grade_quarter: ["Q1", "Q2", "Q3", "Q4"],
      school_level: ["elementary", "junior_high", "senior_high"],
      semester: ["first", "second"],
      shs_strand: [
        "stem",
        "abm",
        "humss",
        "gas",
        "ict",
        "he",
        "ia",
        "afa",
        "sports",
        "arts_design",
      ],
      shs_track: ["academic", "tvl", "sports", "arts_design"],
      student_status: [
        "active",
        "inactive",
        "transferred",
        "graduated",
        "dropped",
      ],
      teacher_status: ["active", "on_leave", "resigned", "retired"],
    },
  },
} as const
