
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type Student = {
  id: string;
  matricNumber: string;
  name: string;
  level: string;
  absences: number;
  lastAttendance: string;
  punishmentServed: boolean;
};

interface AttendanceDataVizProps {
  data: Student[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AttendanceDataViz = ({ data }: AttendanceDataVizProps) => {
  // Calculate absences by level
  const absencesByLevel = useMemo(() => {
    const levels: Record<string, { absent: number; present: number }> = {};
    
    data.forEach(student => {
      if (!levels[student.level]) {
        levels[student.level] = { absent: 0, present: 0 };
      }
      
      if (student.absences > 0) {
        levels[student.level].absent += 1;
      } else {
        levels[student.level].present += 1;
      }
    });
    
    return Object.entries(levels).map(([level, counts]) => ({
      level,
      absent: counts.absent,
      present: counts.present,
      total: counts.absent + counts.present
    }));
  }, [data]);
  
  // Calculate punishment served stats
  const punishmentStats = useMemo(() => {
    const absentStudents = data.filter(student => student.absences > 0);
    const served = absentStudents.filter(student => student.punishmentServed).length;
    const pending = absentStudents.filter(student => !student.punishmentServed).length;
    
    return [
      { name: 'Served', value: served },
      { name: 'Pending', value: pending }
    ];
  }, [data]);
  
  // Calculate absence distribution
  const absenceDistribution = useMemo(() => {
    const distribution: Record<number, number> = {};
    
    data.forEach(student => {
      if (distribution[student.absences] === undefined) {
        distribution[student.absences] = 0;
      }
      distribution[student.absences] += 1;
    });
    
    return Object.entries(distribution)
      .map(([absences, count]) => ({
        absences: Number(absences),
        count
      }))
      .sort((a, b) => a.absences - b.absences);
  }, [data]);
  
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Attendance by Level</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={absencesByLevel}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="level" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" stackId="a" name="Present" fill="#0088FE" />
                <Bar dataKey="absent" stackId="a" name="Absent" fill="#FF8042" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Punishment Status</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={punishmentStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {punishmentStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Absence Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={absenceDistribution}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="absences" label={{ value: 'Number of Absences', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'Number of Students', angle: -90, position: 'insideLeft', offset: 10 }} />
              <Tooltip formatter={(value) => [`${value} Students`, 'Count']} />
              <Bar dataKey="count" name="Students" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceDataViz;
