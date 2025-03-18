
import { 
  Student, 
  Attendance, 
  ChapelEvent, 
  Message, 
  WeeklyStats, 
  MonthlyStats,
  PunishmentRecord,
  AttendanceRecord
} from "@/types";

export const mockStudents: Student[] = [
  { id: "1", name: "John Smith", grade: "11th", absences: 3, punishmentServed: true, lastAttendance: "2023-04-10" },
  { id: "2", name: "Emily Johnson", grade: "10th", absences: 1, punishmentServed: false, lastAttendance: "2023-04-15" },
  { id: "3", name: "Michael Brown", grade: "12th", absences: 5, punishmentServed: false, lastAttendance: "2023-04-05" },
  { id: "4", name: "Jessica Davis", grade: "9th", absences: 0, punishmentServed: true, lastAttendance: "2023-04-17" },
  { id: "5", name: "David Wilson", grade: "11th", absences: 2, punishmentServed: true, lastAttendance: "2023-04-12" },
  { id: "6", name: "Sarah Martinez", grade: "10th", absences: 4, punishmentServed: false, lastAttendance: "2023-04-08" },
  { id: "7", name: "Daniel Anderson", grade: "12th", absences: 1, punishmentServed: true, lastAttendance: "2023-04-14" },
  { id: "8", name: "Olivia Thomas", grade: "9th", absences: 6, punishmentServed: false, lastAttendance: "2023-04-03" },
  { id: "9", name: "James Taylor", grade: "11th", absences: 2, punishmentServed: true, lastAttendance: "2023-04-13" },
  { id: "10", name: "Sophia White", grade: "10th", absences: 3, punishmentServed: false, lastAttendance: "2023-04-11" },
  { id: "11", name: "Ethan Harris", grade: "12th", absences: 0, punishmentServed: true, lastAttendance: "2023-04-17" },
  { id: "12", name: "Ava Clark", grade: "9th", absences: 5, punishmentServed: false, lastAttendance: "2023-04-06" },
];

export const mockAttendance: Attendance[] = [
  { 
    id: "1", 
    date: "2023-04-01", 
    studentsPresent: 180, 
    studentsAbsent: 20, 
    students: mockStudents.filter(s => s.id !== "3" && s.id !== "8")
  },
  { 
    id: "2", 
    date: "2023-04-08", 
    studentsPresent: 185, 
    studentsAbsent: 15, 
    students: mockStudents.filter(s => s.id !== "1" && s.id !== "6" && s.id !== "10")
  },
  { 
    id: "3", 
    date: "2023-04-15", 
    studentsPresent: 175, 
    studentsAbsent: 25, 
    students: mockStudents.filter(s => s.id !== "3" && s.id !== "6" && s.id !== "8" && s.id !== "12")
  },
];

export const mockAttendanceRecords: AttendanceRecord[] = [
  { id: "1", studentId: "1", date: "2023-04-01", present: true, excuse: null },
  { id: "2", studentId: "1", date: "2023-04-08", present: false, excuse: "Doctor's appointment" },
  { id: "3", studentId: "1", date: "2023-04-15", present: true, excuse: null },
  { id: "4", studentId: "2", date: "2023-04-01", present: true, excuse: null },
  { id: "5", studentId: "2", date: "2023-04-08", present: true, excuse: null },
  { id: "6", studentId: "2", date: "2023-04-15", present: true, excuse: null },
  { id: "7", studentId: "3", date: "2023-04-01", present: false, excuse: "Sick" },
  { id: "8", studentId: "3", date: "2023-04-08", present: true, excuse: null },
  { id: "9", studentId: "3", date: "2023-04-15", present: false, excuse: "Family emergency" },
];

const today = new Date();
const oneDay = 24 * 60 * 60 * 1000;

export const mockEvents: ChapelEvent[] = [
  {
    id: "1",
    title: "Regular Chapel Service",
    start: new Date(today.getTime() - oneDay * 2),
    end: new Date(today.getTime() - oneDay * 2 + 3600000),
    description: "Weekly chapel service with worship and message",
    location: "Main Auditorium",
    speaker: "Dr. James Wilson",
    color: "#4f46e5"
  },
  {
    id: "2",
    title: "Guest Speaker: David Thompson",
    start: new Date(today.getTime() + oneDay * 5),
    end: new Date(today.getTime() + oneDay * 5 + 3600000),
    description: "Special chapel with guest speaker from Local Church",
    location: "Main Auditorium",
    speaker: "David Thompson",
    color: "#7c3aed"
  },
  {
    id: "3",
    title: "Worship Night",
    start: new Date(today.getTime() + oneDay * 10),
    end: new Date(today.getTime() + oneDay * 10 + 7200000),
    description: "Extended worship night with the chapel band",
    location: "Prayer Chapel",
    speaker: "Chapel Band",
    color: "#0ea5e9"
  },
  {
    id: "4",
    title: "Student Testimonies",
    start: new Date(today.getTime() + oneDay * 3),
    end: new Date(today.getTime() + oneDay * 3 + 3600000),
    description: "Students share testimonies and experiences",
    location: "Main Auditorium",
    speaker: "Various Students",
    color: "#10b981"
  },
];

export const mockMessages: Message[] = [
  {
    id: "1",
    sender: "Chaplain",
    content: "Good morning! Just a reminder about our special chapel service tomorrow.",
    timestamp: new Date(today.getTime() - oneDay * 1),
    read: true
  },
  {
    id: "2",
    sender: "You",
    content: "Thank you for the reminder. Will there be any special arrangements?",
    timestamp: new Date(today.getTime() - oneDay * 1 + 3600000),
    read: true
  },
  {
    id: "3",
    sender: "Chaplain",
    content: "Yes, we'll have our guest speaker arrive 30 minutes early. Could you help greet them?",
    timestamp: new Date(today.getTime() - oneDay * 1 + 7200000),
    read: false
  },
];

export const mockWeeklyStats: WeeklyStats[] = [
  { week: "Week 1", attendance: 92, absences: 8 },
  { week: "Week 2", attendance: 88, absences: 12 },
  { week: "Week 3", attendance: 95, absences: 5 },
  { week: "Week 4", attendance: 90, absences: 10 },
  { week: "Week 5", attendance: 93, absences: 7 },
  { week: "Week 6", attendance: 91, absences: 9 },
];

export const mockMonthlyStats: MonthlyStats[] = [
  { month: "January", attendance: 91, absences: 9 },
  { month: "February", attendance: 89, absences: 11 },
  { month: "March", attendance: 93, absences: 7 },
  { month: "April", attendance: 90, absences: 10 },
];

export const mockPunishments: PunishmentRecord[] = [
  { 
    id: "1", 
    studentId: "1", 
    date: "2023-04-10", 
    reason: "Missed 3 chapel services", 
    type: "Detention", 
    status: "completed" 
  },
  { 
    id: "2", 
    studentId: "3", 
    date: "2023-04-12", 
    reason: "Missed 5 chapel services", 
    type: "Saturday School", 
    status: "pending" 
  },
  { 
    id: "3", 
    studentId: "6", 
    date: "2023-04-11", 
    reason: "Missed 4 chapel services", 
    type: "Community Service", 
    status: "pending" 
  },
  { 
    id: "4", 
    studentId: "8", 
    date: "2023-04-09", 
    reason: "Missed 6 chapel services", 
    type: "Parent Conference", 
    status: "completed" 
  },
  { 
    id: "5", 
    studentId: "12", 
    date: "2023-04-13", 
    reason: "Missed 5 chapel services", 
    type: "Detention", 
    status: "excused" 
  },
];

export const getStudentById = (id: string): Student | undefined => {
  return mockStudents.find(student => student.id === id);
};

export const getPunishmentsByStudentId = (studentId: string): PunishmentRecord[] => {
  return mockPunishments.filter(punishment => punishment.studentId === studentId);
};

export const getAttendanceRecordsByStudentId = (studentId: string): AttendanceRecord[] => {
  return mockAttendanceRecords.filter(record => record.studentId === studentId);
};
