
/**
 * Utility for parsing CSV files and processing student attendance data
 */

export interface ParsedCsvData {
  students: {
    matricNumber: string;
    name: string;
    level: string;
    absences: number;
    lastAttendance: string;
    punishmentServed: boolean;
  }[];
}

export const parseCSV = (content: string): ParsedCsvData => {
  // Split the content by newlines
  const lines = content.split('\n');
  
  // Get the header row and convert to lowercase for case-insensitive matching
  const headers = lines[0].split(',').map(header => header.trim().toLowerCase());
  
  // Find the indices of required columns
  const nameIndex = headers.findIndex(h => h === 'name' || h === 'fullname' || h === 'student name');
  const matricIndex = headers.findIndex(h => h === 'matric' || h === 'matric number' || h === 'matricnumber');
  const levelIndex = headers.findIndex(h => h === 'level' || h === 'grade' || h === 'class');
  const absencesIndex = headers.findIndex(h => h === 'absences' || h === 'absent' || h === 'missed');
  const lastAttendanceIndex = headers.findIndex(h => h === 'last attendance' || h === 'lastattendance');
  const punishmentIndex = headers.findIndex(h => h === 'punishment served' || h === 'punishmentserved' || h === 'completed');
  
  // Process data rows
  const students = lines.slice(1)
    .filter(line => line.trim().length > 0) // Skip empty lines
    .map((line, index) => {
      const values = line.split(',').map(val => val.trim());
      
      return {
        id: (index + 1).toString(), // Generate an ID
        matricNumber: matricIndex >= 0 ? values[matricIndex] : `MTU/${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        name: nameIndex >= 0 ? values[nameIndex] : 'Unknown Student',
        level: levelIndex >= 0 ? values[levelIndex] : '100L',
        absences: absencesIndex >= 0 ? parseInt(values[absencesIndex]) || 0 : 0,
        lastAttendance: lastAttendanceIndex >= 0 ? values[lastAttendanceIndex] : new Date().toISOString().split('T')[0],
        punishmentServed: punishmentIndex >= 0 ? values[punishmentIndex].toLowerCase() === 'true' || values[punishmentIndex] === '1' : false,
      };
    });
  
  return { students };
};

export const convertToStudentFormat = (parsedData: ParsedCsvData) => {
  // Convert the parsed data to the format expected by our application
  return parsedData.students.map(student => ({
    id: student.id,
    name: student.name,
    grade: student.level,
    absences: student.absences,
    punishmentServed: student.punishmentServed,
    lastAttendance: student.lastAttendance,
    matricNumber: student.matricNumber
  }));
};
