
-- Create enums for DepEd standards
CREATE TYPE public.school_level AS ENUM ('elementary', 'junior_high', 'senior_high');
CREATE TYPE public.student_status AS ENUM ('active', 'inactive', 'transferred', 'graduated', 'dropped');
CREATE TYPE public.teacher_status AS ENUM ('active', 'on_leave', 'resigned', 'retired');
CREATE TYPE public.enrollment_status AS ENUM ('enrolled', 'pending', 'cancelled', 'completed');
CREATE TYPE public.semester AS ENUM ('first', 'second');
CREATE TYPE public.shs_track AS ENUM ('academic', 'tvl', 'sports', 'arts_design');
CREATE TYPE public.shs_strand AS ENUM ('stem', 'abm', 'humss', 'gas', 'ict', 'he', 'ia', 'afa', 'sports', 'arts_design');

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lrn VARCHAR(12) UNIQUE,
  first_name TEXT NOT NULL,
  middle_name TEXT,
  last_name TEXT NOT NULL,
  suffix TEXT,
  date_of_birth DATE NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female')),
  nationality TEXT DEFAULT 'Filipino',
  birth_place TEXT,
  mother_tongue TEXT,
  religion TEXT,
  address_street TEXT,
  address_barangay TEXT,
  address_municipality TEXT,
  address_province TEXT,
  address_region TEXT,
  contact_number TEXT,
  email TEXT,
  guardian_name TEXT,
  guardian_contact TEXT,
  guardian_relationship TEXT,
  school_level school_level NOT NULL DEFAULT 'elementary',
  current_grade_level INTEGER NOT NULL CHECK (current_grade_level BETWEEN 1 AND 12),
  shs_track shs_track,
  shs_strand shs_strand,
  status student_status NOT NULL DEFAULT 'active',
  photo_url TEXT,
  previous_school TEXT,
  psa_birth_cert_no TEXT,
  is_indigenous_people BOOLEAN DEFAULT false,
  is_4ps_beneficiary BOOLEAN DEFAULT false,
  is_pwd BOOLEAN DEFAULT false,
  remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.teachers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id VARCHAR(20) UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  middle_name TEXT,
  last_name TEXT NOT NULL,
  suffix TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('Male', 'Female')),
  civil_status TEXT,
  contact_number TEXT,
  email TEXT,
  address TEXT,
  position TEXT NOT NULL DEFAULT 'Teacher I',
  department TEXT,
  specialization TEXT,
  education_level TEXT,
  license_number TEXT,
  license_expiry DATE,
  date_hired DATE,
  employment_type TEXT DEFAULT 'Regular' CHECK (employment_type IN ('Regular', 'Contractual', 'Part-time', 'Substitute')),
  status teacher_status NOT NULL DEFAULT 'active',
  salary_grade INTEGER,
  tin TEXT,
  sss_number TEXT,
  philhealth_number TEXT,
  pagibig_number TEXT,
  photo_url TEXT,
  remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.subjects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(20) UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  school_level school_level NOT NULL,
  grade_level INTEGER NOT NULL CHECK (grade_level BETWEEN 1 AND 12),
  semester semester,
  units NUMERIC(3,1) DEFAULT 1.0,
  is_core BOOLEAN DEFAULT true,
  shs_track shs_track,
  shs_strand shs_strand,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  school_level school_level NOT NULL,
  grade_level INTEGER NOT NULL CHECK (grade_level BETWEEN 1 AND 12),
  school_year VARCHAR(9) NOT NULL,
  adviser_id UUID REFERENCES public.teachers(id) ON DELETE SET NULL,
  room TEXT,
  capacity INTEGER DEFAULT 40,
  shs_track shs_track,
  shs_strand shs_strand,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(name, grade_level, school_year)
);

CREATE TABLE public.enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  section_id UUID NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  school_year VARCHAR(9) NOT NULL,
  grade_level INTEGER NOT NULL CHECK (grade_level BETWEEN 1 AND 12),
  date_enrolled TIMESTAMPTZ DEFAULT now(),
  status enrollment_status NOT NULL DEFAULT 'pending',
  remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(student_id, school_year)
);

CREATE TABLE public.section_subjects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_id UUID NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES public.teachers(id) ON DELETE SET NULL,
  schedule TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(section_id, subject_id)
);

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.section_subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Anyone can insert students" ON public.students FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update students" ON public.students FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete students" ON public.students FOR DELETE USING (true);

CREATE POLICY "Anyone can read teachers" ON public.teachers FOR SELECT USING (true);
CREATE POLICY "Anyone can insert teachers" ON public.teachers FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update teachers" ON public.teachers FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete teachers" ON public.teachers FOR DELETE USING (true);

CREATE POLICY "Anyone can read subjects" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Anyone can insert subjects" ON public.subjects FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update subjects" ON public.subjects FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete subjects" ON public.subjects FOR DELETE USING (true);

CREATE POLICY "Anyone can read sections" ON public.sections FOR SELECT USING (true);
CREATE POLICY "Anyone can insert sections" ON public.sections FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update sections" ON public.sections FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete sections" ON public.sections FOR DELETE USING (true);

CREATE POLICY "Anyone can read enrollments" ON public.enrollments FOR SELECT USING (true);
CREATE POLICY "Anyone can insert enrollments" ON public.enrollments FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update enrollments" ON public.enrollments FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete enrollments" ON public.enrollments FOR DELETE USING (true);

CREATE POLICY "Anyone can read section_subjects" ON public.section_subjects FOR SELECT USING (true);
CREATE POLICY "Anyone can insert section_subjects" ON public.section_subjects FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update section_subjects" ON public.section_subjects FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete section_subjects" ON public.section_subjects FOR DELETE USING (true);

CREATE INDEX idx_students_lrn ON public.students(lrn);
CREATE INDEX idx_students_last_name ON public.students(last_name);
CREATE INDEX idx_students_grade_level ON public.students(current_grade_level);
CREATE INDEX idx_students_status ON public.students(status);
CREATE INDEX idx_teachers_employee_id ON public.teachers(employee_id);
CREATE INDEX idx_teachers_status ON public.teachers(status);
CREATE INDEX idx_subjects_code ON public.subjects(code);
CREATE INDEX idx_subjects_grade_level ON public.subjects(grade_level);
CREATE INDEX idx_sections_school_year ON public.sections(school_year);
CREATE INDEX idx_enrollments_student_id ON public.enrollments(student_id);
CREATE INDEX idx_enrollments_section_id ON public.enrollments(section_id);
CREATE INDEX idx_enrollments_school_year ON public.enrollments(school_year);

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON public.teachers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON public.subjects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_sections_updated_at BEFORE UPDATE ON public.sections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON public.enrollments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
