
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { FileSpreadsheet, Upload, AlertCircle, CheckCircle, X, Save } from 'lucide-react';
import { parseCSV, convertToStudentFormat } from '@/utils/csvParser';
import { storeAttendanceData } from '@/utils/githubStorage';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';

interface CsvUploadProps {
  onDataUploaded: (data: any[]) => void;
}

const CsvUpload = ({ onDataUploaded }: CsvUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  // Check if user is admin
  if (user?.role !== 'admin') {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>
          You don't have permission to access this feature.
        </AlertDescription>
      </Alert>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    // Check file type (should be CSV)
    if (!selectedFile.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }
    
    setFile(selectedFile);
    setError(null);
    
    // Read file for preview
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const { students } = parseCSV(content);
        const formattedStudents = convertToStudentFormat({ students });
        
        // Just preview the first 5 records
        setPreviewData(formattedStudents.slice(0, 5));
      } catch (err) {
        setError('Error parsing CSV file. Please check the format.');
        console.error(err);
      }
    };
    reader.readAsText(selectedFile);
  };

  const handleUpload = async () => {
    if (!file || !user) return;
    
    setUploading(true);
    setProgress(0);
    setSaving(false);
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 5;
      });
    }, 100);
    
    try {
      // Read and parse file
      const reader = new FileReader();
      const fileContent = await new Promise<string>((resolve, reject) => {
        reader.onload = (event) => resolve(event.target?.result as string);
        reader.onerror = reject;
        reader.readAsText(file);
      });
      
      const parsedData = parseCSV(fileContent);
      const formattedStudents = convertToStudentFormat(parsedData);
      
      // Set upload progress to 95%
      setProgress(95);
      
      // Now save to GitHub
      setSaving(true);
      
      await storeAttendanceData(
        parsedData,
        file.name,
        user.name
      );
      
      // Complete the progress
      setProgress(100);
      
      // Call the callback with the parsed data
      onDataUploaded(formattedStudents);
      
      toast.success(`Successfully processed and stored ${formattedStudents.length} student records`);
      
      // Reset after successful upload
      setTimeout(() => {
        setUploading(false);
        setSaving(false);
        setFile(null);
        setPreviewData(null);
        setProgress(0);
      }, 1000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error processing CSV file';
      setError(errorMessage);
      toast.error(errorMessage);
      setUploading(false);
      setSaving(false);
    } finally {
      clearInterval(interval);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setPreviewData(null);
    setError(null);
  };

  return (
    <Card className="shadow-md border border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-primary" />
              CSV Upload
            </CardTitle>
            <CardDescription>
              Upload student attendance data in CSV format
            </CardDescription>
          </div>
          {file && (
            <Badge variant="outline" className="px-3 py-1 text-xs">
              {file.name}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {!file ? (
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => document.getElementById('csv-upload')?.click()}
          >
            <div className="mx-auto flex flex-col items-center justify-center gap-1">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium mt-2">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                CSV file (max 10MB)
              </p>
            </div>
            <Input 
              id="csv-upload" 
              type="file" 
              accept=".csv" 
              className="hidden" 
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="space-y-4">
            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{saving ? 'Saving to GitHub...' : 'Uploading...'}</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
            
            {previewData && previewData.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Preview:</h3>
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matric No.</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Absences</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {previewData.map((student, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm">{student.name}</td>
                          <td className="px-4 py-2 text-sm">{student.matricNumber}</td>
                          <td className="px-4 py-2 text-sm">{student.grade}</td>
                          <td className="px-4 py-2 text-sm text-center">{student.absences}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {previewData.length < 5 ? (
                  <p className="text-xs text-muted-foreground mt-1">
                    Showing all {previewData.length} records
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1">
                    Showing 5 of {file ? 'many' : '0'} records
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="ghost" 
          disabled={!file || uploading}
          onClick={handleCancel}
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button 
          disabled={!file || uploading}
          onClick={handleUpload}
        >
          {progress === 100 ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Completed
            </>
          ) : saving ? (
            <>
              <Save className="h-4 w-4 mr-2 animate-pulse" />
              Saving...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload'}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CsvUpload;
