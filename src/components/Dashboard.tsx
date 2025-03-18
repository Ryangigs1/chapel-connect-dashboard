
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowUpRight,
  Calendar,
  CheckCheck,
  ChevronsUpDown,
  MessageSquare,
  Percent,
  Users,
  XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockAttendance, mockWeeklyStats, mockMonthlyStats } from '@/utils/mockData';
import AttendanceChart from './AttendanceChart';

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: { 
    value: number;
    positive: boolean;
  };
  className?: string;
}

const StatCard = ({ title, value, description, icon, trend, className }: StatCardProps) => {
  return (
    <Card className={cn("overflow-hidden transition-all hover-lift", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <div className="flex items-center mt-1">
          <CardDescription>{description}</CardDescription>
          {trend && (
            <div className={cn(
              "ml-auto flex items-center text-xs font-medium",
              trend.positive ? "text-green-500" : "text-red-500"
            )}>
              {trend.positive ? "+" : "-"}{Math.abs(trend.value)}%
              <ArrowUpRight className={cn(
                "h-3 w-3 ml-1",
                !trend.positive && "rotate-180"
              )} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const [timeFrame, setTimeFrame] = useState<'weekly' | 'monthly'>('weekly');
  
  // Calculate recent attendance statistics
  const recentAttendance = mockAttendance[mockAttendance.length - 1];
  const previousAttendance = mockAttendance[mockAttendance.length - 2];
  
  const totalStudents = recentAttendance.studentsPresent + recentAttendance.studentsAbsent;
  const attendanceRate = Math.round((recentAttendance.studentsPresent / totalStudents) * 100);
  const previousRate = Math.round((previousAttendance.studentsPresent / (previousAttendance.studentsPresent + previousAttendance.studentsAbsent)) * 100);
  const attendanceTrend = { value: attendanceRate - previousRate, positive: attendanceRate >= previousRate };
  
  const absenteesTrend = { 
    value: Math.round(((recentAttendance.studentsAbsent - previousAttendance.studentsAbsent) / previousAttendance.studentsAbsent) * 100), 
    positive: recentAttendance.studentsAbsent <= previousAttendance.studentsAbsent 
  };

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Attendance Rate"
          value={`${attendanceRate}%`}
          description="Last chapel service"
          icon={<Percent className="h-4 w-4 text-primary" />}
          trend={attendanceTrend}
          className="animate-fade-up [animation-delay:0ms]"
        />
        <StatCard
          title="Students Present"
          value={recentAttendance.studentsPresent}
          description={`Out of ${totalStudents} students`}
          icon={<CheckCheck className="h-4 w-4 text-green-500" />}
          className="animate-fade-up [animation-delay:75ms]"
        />
        <StatCard
          title="Absentees"
          value={recentAttendance.studentsAbsent}
          description="Students missed chapel"
          icon={<XCircle className="h-4 w-4 text-red-500" />}
          trend={absenteesTrend}
          className="animate-fade-up [animation-delay:150ms]"
        />
        <StatCard
          title="Next Chapel"
          value="Tomorrow"
          description="9:00 AM - Main Auditorium"
          icon={<Calendar className="h-4 w-4 text-blue-500" />}
          className="animate-fade-up [animation-delay:225ms]"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-5 animate-fade-up [animation-delay:300ms]">
          <CardHeader className="flex flex-row items-center">
            <div>
              <CardTitle>Attendance Overview</CardTitle>
              <CardDescription>
                {timeFrame === 'weekly' ? 'Weekly chapel attendance statistics' : 'Monthly chapel attendance trends'}
              </CardDescription>
            </div>
            <Button
              variant="outline" 
              size="sm" 
              className="ml-auto flex items-center gap-1"
              onClick={() => setTimeFrame(timeFrame === 'weekly' ? 'monthly' : 'weekly')}
            >
              {timeFrame === 'weekly' ? 'Weekly' : 'Monthly'}
              <ChevronsUpDown className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <AttendanceChart 
              data={timeFrame === 'weekly' ? mockWeeklyStats : mockMonthlyStats} 
              timeFrame={timeFrame}
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-2 animate-fade-up [animation-delay:375ms]">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and actions
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button className="justify-start gap-2 w-full">
              <Users className="h-4 w-4" />
              <span>Take Attendance</span>
            </Button>
            <Button className="justify-start gap-2 w-full" variant="outline">
              <MessageSquare className="h-4 w-4" />
              <span>Message Chaplain</span>
            </Button>
            <Button className="justify-start gap-2 w-full" variant="outline">
              <Calendar className="h-4 w-4" />
              <span>Add Event</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
