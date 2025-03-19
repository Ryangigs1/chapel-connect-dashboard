export interface Student {
  id: string;
  name: string;
  grade: string;
  absences: number;
  punishmentServed: boolean;
  lastAttendance: string;
  matricNumber?: string;
}

export interface Attendance {
  id: string;
  date: string;
  studentsPresent: number;
  studentsAbsent: number;
  students: Student[];
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  present: boolean;
  excuse: string | null;
}

export interface ChapelEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
  speaker?: string;
  color?: string;
}

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface WeeklyStats {
  week: string;
  attendance: number;
  absences: number;
}

export interface MonthlyStats {
  month: string;
  attendance: number;
  absences: number;
}

export interface PunishmentRecord {
  id: string;
  studentId: string;
  date: string;
  reason: string;
  type: string;
  status: 'pending' | 'completed' | 'excused';
}
