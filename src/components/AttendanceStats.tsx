
import { useState } from 'react';
import { 
  AlertCircle,
  ChevronDown,
  AlertTriangle
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockStudents } from '@/utils/mockData';

const AttendanceStats = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Calculate overall stats
  const totalStudents = mockStudents.length;
  const totalAbsences = mockStudents.reduce((sum, student) => sum + student.absences, 0);
  const absenteeCount = mockStudents.filter(student => student.absences > 0).length;
  const studentsRequiringAction = mockStudents.filter(student => student.absences > 3).length;
  
  // Generate special event data
  const specialEvents = [
    { name: 'MTU Prays', date: '24/04/2023', absentees: 18 },
    { name: 'PMCH', date: '12/05/2023', absentees: 25 },
    { name: 'Convocation Service', date: '30/05/2023', absentees: 5 },
    { name: 'Chapel Anniversary', date: '15/06/2023', absentees: 12 }
  ];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 border-dashed hover:border-primary transition-colors"
        >
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <span className="text-sm font-medium">View Attendance Stats</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <h4 className="font-medium">MTU Chapel Attendance Summary</h4>
          <p className="text-sm text-muted-foreground">
            Overview of absenteeism and special events
          </p>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Total Absences</p>
              <p className="text-xl font-semibold">{totalAbsences}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Students With Absences</p>
              <p className="text-xl font-semibold">{absenteeCount}</p>
            </div>
          </div>
          
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <h5 className="text-sm font-medium">Attention Required</h5>
              <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                {studentsRequiringAction}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span>{studentsRequiringAction} students need disciplinary action</span>
            </div>
          </div>
          
          <div className="pt-2 border-t">
            <h5 className="text-sm font-medium mb-2">Special Events Attendance</h5>
            
            <div className="space-y-2">
              {specialEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between text-sm p-2 rounded-md bg-slate-50">
                  <div className="flex flex-col">
                    <span className="font-medium">{event.name}</span>
                    <span className="text-xs text-muted-foreground">{event.date}</span>
                  </div>
                  <Badge variant={event.absentees > 20 ? "destructive" : "outline"} className="text-xs">
                    {event.absentees} absent
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 border-t bg-muted/30">
          <span className="text-xs text-muted-foreground">Last updated: Today, 10:45 AM</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs"
            onClick={() => setIsOpen(false)}
          >
            Close
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AttendanceStats;
