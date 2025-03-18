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
  { id: "1", name: "Oluwaseun Adegoke", grade: "300L", absences: 3, punishmentServed: true, lastAttendance: "2023-04-10" },
  { id: "2", name: "Chidinma Okafor", grade: "200L", absences: 1, punishmentServed: false, lastAttendance: "2023-04-15" },
  { id: "3", name: "Tunde Bakare", grade: "400L", absences: 5, punishmentServed: false, lastAttendance: "2023-04-05" },
  { id: "4", name: "Amina Ibrahim", grade: "100L", absences: 0, punishmentServed: true, lastAttendance: "2023-04-17" },
  { id: "5", name: "Emeka Okonkwo", grade: "300L", absences: 2, punishmentServed: true, lastAttendance: "2023-04-12" },
  { id: "6", name: "Folake Adeleke", grade: "200L", absences: 4, punishmentServed: false, lastAttendance: "2023-04-08" },
  { id: "7", name: "Olumide Johnson", grade: "400L", absences: 1, punishmentServed: true, lastAttendance: "2023-04-14" },
  { id: "8", name: "Nkechi Eze", grade: "100L", absences: 6, punishmentServed: false, lastAttendance: "2023-04-03" },
  { id: "9", name: "Yusuf Abubakar", grade: "300L", absences: 2, punishmentServed: true, lastAttendance: "2023-04-13" },
  { id: "10", name: "Blessing Ogedengbe", grade: "200L", absences: 3, punishmentServed: false, lastAttendance: "2023-04-11" },
  { id: "11", name: "Chinedu Okeke", grade: "400L", absences: 0, punishmentServed: true, lastAttendance: "2023-04-17" },
  { id: "12", name: "Aminat Bello", grade: "100L", absences: 5, punishmentServed: false, lastAttendance: "2023-04-06" },
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
    location: "MTU Main Auditorium",
    speaker: "Dr. Samuel Oloyede",
    color: "#4f46e5"
  },
  {
    id: "2",
    title: "Guest Speaker: Pastor D.K. Olukoya",
    start: new Date(today.getTime() + oneDay * 5),
    end: new Date(today.getTime() + oneDay * 5 + 3600000),
    description: "Special chapel with MFM General Overseer",
    location: "MTU Main Auditorium",
    speaker: "Pastor D.K. Olukoya",
    color: "#7c3aed"
  },
  {
    id: "3",
    title: "Praise Night",
    start: new Date(today.getTime() + oneDay * 10),
    end: new Date(today.getTime() + oneDay * 10 + 7200000),
    description: "Extended worship night with the MTU chapel choir",
    location: "Prayer City Chapel",
    speaker: "MTU Chapel Choir",
    color: "#0ea5e9"
  },
  {
    id: "4",
    title: "Student Testimonies",
    start: new Date(today.getTime() + oneDay * 3),
    end: new Date(today.getTime() + oneDay * 3 + 3600000),
    description: "Students share testimonies and experiences from Prayer City",
    location: "MTU Main Auditorium",
    speaker: "Various Students",
    color: "#10b981"
  },
];

export const mockMessages: Message[] = [
  {
    id: "1",
    sender: "Chaplain",
    content: "Good morning! Just a reminder about our special prayer service tomorrow at Prayer City.",
    timestamp: new Date(today.getTime() - oneDay * 1),
    read: true
  },
  {
    id: "2",
    sender: "You",
    content: "Thank you for the reminder. Will there be transportation from campus?",
    timestamp: new Date(today.getTime() - oneDay * 1 + 3600000),
    read: true
  },
  {
    id: "3",
    sender: "Chaplain",
    content: "Yes, buses will leave from the university gate at 7:30 AM. Please be punctual.",
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
