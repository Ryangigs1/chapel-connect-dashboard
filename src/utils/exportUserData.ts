
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
