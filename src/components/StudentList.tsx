
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  Search,
  User,
  XCircle
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Student } from '@/types';
import { mockStudents } from '@/utils/mockData';
import { cn } from '@/lib/utils';

interface StudentListProps {
  limit?: number;
  filterAbsentees?: boolean;
  className?: string;
}

const StudentList = ({ limit, filterAbsentees = false, className }: StudentListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const itemsPerPage = limit || 8;
  
  // Filter students
  const filteredStudents = mockStudents
    .filter(student => filterAbsentees ? student.absences > 0 : true)
    .filter(student => 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      student.grade.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(student => gradeFilter === 'all' ? true : student.grade === gradeFilter);
  
  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>
              {filterAbsentees ? 'Absentee Students' : 'Student Attendance'}
            </CardTitle>
            <CardDescription>
              {filterAbsentees 
                ? 'Students who have missed chapel services' 
                : 'Overview of student attendance records'}
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="pl-8 w-full sm:w-auto"
              />
            </div>
            <Select 
              value={gradeFilter} 
              onValueChange={(value) => {
                setGradeFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                <SelectItem value="9th">9th Grade</SelectItem>
                <SelectItem value="10th">10th Grade</SelectItem>
                <SelectItem value="11th">11th Grade</SelectItem>
                <SelectItem value="12th">12th Grade</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">#</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead className="text-center">Absences</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Last Attendance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedStudents.length > 0 ? (
                paginatedStudents.map((student, index) => (
                  <StudentRow 
                    key={student.id} 
                    student={student} 
                    index={(page - 1) * itemsPerPage + index + 1} 
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    {searchQuery || gradeFilter !== 'all' ? (
                      <div className="flex flex-col items-center">
                        <Search className="h-8 w-8 mb-2 text-muted-foreground/50" />
                        <p>No students match your search</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <User className="h-8 w-8 mb-2 text-muted-foreground/50" />
                        <p>No students to display</p>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {(page - 1) * itemsPerPage + 1}-{Math.min(page * itemsPerPage, filteredStudents.length)} of {filteredStudents.length}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(1)}
                disabled={page === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const StudentRow = ({ student, index }: { student: Student; index: number }) => {
  const getAbsenceBadge = (absences: number) => {
    if (absences === 0) return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">None</Badge>;
    if (absences <= 2) return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">{absences}</Badge>;
    return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">{absences}</Badge>;
  };

  const getStatusBadge = (absences: number, punishmentServed: boolean) => {
    if (absences === 0) return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Good Standing</Badge>;
    if (absences > 0 && punishmentServed) return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Completed</Badge>;
    if (absences > 3) return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Action Required</Badge>;
    return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Warning</Badge>;
  };

  return (
    <TableRow className="hover:bg-muted/30 transition-colors">
      <TableCell className="font-medium">{index}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
          <Link to={`/students/${student.id}`} className="font-medium hover:text-primary transition-colors">
            {student.name}
          </Link>
        </div>
      </TableCell>
      <TableCell>{student.grade}</TableCell>
      <TableCell className="text-center">
        {getAbsenceBadge(student.absences)}
      </TableCell>
      <TableCell className="text-center">
        {getStatusBadge(student.absences, student.punishmentServed)}
      </TableCell>
      <TableCell className="text-right flex items-center justify-end gap-1 text-muted-foreground">
        <Clock className="h-3 w-3" />
        <span>{student.lastAttendance}</span>
      </TableCell>
    </TableRow>
  );
};

export default StudentList;
