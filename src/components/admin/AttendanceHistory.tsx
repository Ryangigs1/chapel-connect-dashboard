
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  FileText, 
  Calendar, 
  User, 
  Clock, 
  Database, 
  ChevronRight,
  RefreshCcw
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';
import { getStoredAttendanceData, StoredAttendanceData } from '@/utils/githubStorage';

const AttendanceHistory = () => {
  const [history, setHistory] = useState<StoredAttendanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Only admin can access this component
  if (user?.role !== 'admin') {
    return null;
  }
  
  const loadAttendanceHistory = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getStoredAttendanceData();
      setHistory(data);
    } catch (err) {
      console.error('Failed to load attendance history:', err);
      setError('Failed to load attendance history. Please try again later.');
      toast.error('Failed to load attendance history');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadAttendanceHistory();
  }, []);
  
  const handleViewData = (id: string) => {
    // For now, we'll just navigate to the students page
    // TODO: Implement a view that shows specific data
    navigate(`/admin/attendance/${id}`);
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (err) {
      return 'Invalid date';
    }
  };

  return (
    <Card className="shadow-md border border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Attendance Upload History
            </CardTitle>
            <CardDescription>
              Previously uploaded attendance data from CSV files
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadAttendanceHistory}
            disabled={loading}
          >
            <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border rounded-md">
                <Skeleton className="h-12 w-12 rounded-md" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Database className="h-12 w-12 mx-auto mb-3 text-muted-foreground/40" />
            <h3 className="text-lg font-medium mb-1">No uploads found</h3>
            <p className="text-sm">
              Upload your first CSV file to see the history here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <Table>
              <TableCaption>A list of your uploaded attendance data</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Date Uploaded</TableHead>
                  <TableHead>Record Count</TableHead>
                  <TableHead>Uploaded By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-primary" />
                        {item.filename}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formatDate(item.timestamp)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge>
                        {item.data.students.length} students
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        {item.uploadedBy}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewData(item.id)}
                      >
                        View
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AttendanceHistory;
