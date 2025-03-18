
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, TooltipProps } from 'recharts';
import { WeeklyStats, MonthlyStats } from '@/types';
import { cn } from '@/lib/utils';

interface AttendanceChartProps {
  data: WeeklyStats[] | MonthlyStats[];
  timeFrame: 'weekly' | 'monthly';
  className?: string;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: any;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip glass-card p-3 shadow-lg">
        <p className="font-medium">{label}</p>
        <div className="mt-2 space-y-1">
          <p className="text-sm flex items-center">
            <div className="h-2 w-2 bg-primary rounded-full mr-2"></div>
            Present: {payload[0].value}%
          </p>
          <p className="text-sm flex items-center">
            <div className="h-2 w-2 bg-red-500 rounded-full mr-2"></div>
            Absent: {payload[1].value}%
          </p>
        </div>
      </div>
    );
  }

  return null;
};

const AttendanceChart = ({ data, timeFrame, className }: AttendanceChartProps) => {
  const [mounted, setMounted] = useState(false);
  
  // Transform data to have percentages
  const formattedData = data.map(item => ({
    name: timeFrame === 'weekly' ? (item as WeeklyStats).week : (item as MonthlyStats).month,
    attendance: item.attendance,
    absences: item.absences
  }));

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-80 w-full flex items-center justify-center">
        <div className="loading-bar w-32"></div>
      </div>
    );
  }

  return (
    <div className={cn("h-80 w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={formattedData}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          barGap={4}
          className="animate-fade-in"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#888', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#888', fontSize: 12 }}
            domain={[0, 100]}
            unit="%"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            iconType="circle" 
            iconSize={8}
            wrapperStyle={{ paddingTop: 10 }}
          />
          <Bar 
            dataKey="attendance" 
            name="Present" 
            fill="hsl(var(--primary))" 
            radius={[4, 4, 0, 0]} 
            animationDuration={800}
            animationEasing="ease-out"
          />
          <Bar 
            dataKey="absences" 
            name="Absent" 
            fill="#ef4444" 
            radius={[4, 4, 0, 0]} 
            animationDuration={800}
            animationEasing="ease-out"
            animationBegin={300}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceChart;
