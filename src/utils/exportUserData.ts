
import { User } from '@/lib/auth';

interface UserExportData {
  name: string;
  email: string;
  role: string;
  department?: string;
  level?: string;
  phone?: string;
  address?: string;
  emergencyContact?: string;
  lastLogin?: string;
  attendancePercentage?: number;
  totalServices?: number;
  absences?: number;
}

export const exportUserDataToCsv = (userData: UserExportData): void => {
  // Convert object to array of values
  const headers = Object.keys(userData);
  const values = Object.values(userData);
  
  // Create CSV content
  let csvContent = headers.join(',') + '\n';
  csvContent += values.map(value => {
    // Handle values that might contain commas
    if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }).join(',');
  
  // Create blob and download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `user_data_${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Function to download student records as CSV
export const exportStudentDataToCsv = (students: any[]): void => {
  if (!students || students.length === 0) {
    throw new Error('No student data to export');
  }
  
  // Get headers from the first student object
  const headers = Object.keys(students[0]);
  
  // Create CSV rows from student data
  const rows = students.map(student => 
    headers.map(header => {
      const value = student[header];
      // Handle values that might contain commas
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',')
  );
  
  // Combine headers and rows
  const csvContent = [headers.join(','), ...rows].join('\n');
  
  // Create blob and download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `student_records_${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
