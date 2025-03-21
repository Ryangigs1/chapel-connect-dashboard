
import { useState, useRef } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Music as MusicIcon,
  Upload,
  Download,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  List,
  Music2,
  Clock,
  Search,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/lib/auth';
import { MusicTrack, getTracks, addTrack, uploadMusicToGitHub } from '@/utils/musicStorage';

// Initial mock tracks
const mockTracks: MusicTrack[] = [
  {
    id: '1',
    title: 'Amazing Grace',
    artist: 'Chapel Choir',
    uploadedBy: 'Chaplain Emmanuel',
    uploadDate: '2023-06-15',
    fileUrl: 'https://example.com/music/amazing-grace.mp3',
    coverArtUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop',
    duration: '4:15',
    genre: 'Hymn'
  },
  {
    id: '2',
    title: 'How Great Thou Art',
    artist: 'University Choir',
    uploadedBy: 'Dr. Adebayo Oladele',
    uploadDate: '2023-07-21',
    fileUrl: 'https://example.com/music/how-great-thou-art.mp3',
    coverArtUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&auto=format&fit=crop',
    duration: '5:30',
    genre: 'Hymn'
  },
  {
    id: '3',
    title: 'Praise Him',
    artist: 'MTU Praise Team',
    uploadedBy: 'Student Worship Leader',
    uploadDate: '2023-08-05',
    fileUrl: 'https://example.com/music/praise-him.mp3',
    coverArtUrl: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&auto=format&fit=crop',
    duration: '3:45',
    genre: 'Contemporary'
  }
];

const Music = () => {
  const { user } = useAuth();
  const [tracks, setTracks] = useState<MusicTrack[]>(() => {
    const storedTracks = getTracks();
    return storedTracks.length > 0 ? storedTracks : mockTracks;
  });
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [newTrack, setNewTrack] = useState({
    title: '',
    artist: '',
    genre: ''
  });
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Filter tracks based on search
  const filteredTracks = tracks.filter(track => 
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (track.genre && track.genre.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.includes('audio')) {
        setSelectedFile(file);
      } else {
        toast.error('Please select a valid audio file');
      }
    }
  };
  
  // Handle track upload
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }
    
    if (!newTrack.title || !newTrack.artist) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setUploading(true);
    
    try {
      // Upload to GitHub (simulated)
      const fileUrl = await uploadMusicToGitHub(selectedFile);
      
      // Create new track
      const track: MusicTrack = {
        id: Date.now().toString(),
        title: newTrack.title,
        artist: newTrack.artist,
        uploadedBy: user?.name || 'Anonymous',
        uploadDate: new Date().toISOString().split('T')[0],
        fileUrl,
        genre: newTrack.genre,
        duration: '00:00' // Would be calculated from the actual file
      };
      
      // Add track to storage
      const updatedTracks = addTrack(track);
      setTracks(updatedTracks);
      
      // Reset form
      setSelectedFile(null);
      setNewTrack({
        title: '',
        artist: '',
        genre: ''
      });
      
      toast.success('Track uploaded successfully');
      setShowUploadDialog(false);
    } catch (error) {
      toast.error('Error uploading track');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };
  
  // Play/pause track
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  // Play a specific track
  const playTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play();
      }
    }, 100);
  };
  
  // Download a track
  const downloadTrack = (track: MusicTrack) => {
    const link = document.createElement('a');
    link.href = track.fileUrl;
    link.download = `${track.title} - ${track.artist}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloading "${track.title}"`);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold animate-fade-up">
            Chapel Music
          </h1>
          <p className="text-muted-foreground animate-fade-up [animation-delay:100ms]">
            Browse and download chapel worship music
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 space-y-4">
            <Card className="shadow-sm bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MusicIcon className="h-4 w-4 text-primary" />
                  Music Library
                </CardTitle>
                <CardDescription>
                  Browse and play tracks
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search music..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => setSearchQuery('')}
                  >
                    <Music2 className="h-4 w-4 mr-2" />
                    All Music
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => setSearchQuery('hymn')}
                  >
                    <List className="h-4 w-4 mr-2" />
                    Hymns
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => setSearchQuery('contemporary')}
                  >
                    <List className="h-4 w-4 mr-2" />
                    Contemporary
                  </Button>
                  
                  <Separator />
                  
                  <Button 
                    className="w-full" 
                    onClick={() => setShowUploadDialog(true)}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Music
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {currentTrack && (
              <Card className="shadow-sm bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Now Playing</CardTitle>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="text-center">
                    {currentTrack.coverArtUrl && (
                      <div className="aspect-square overflow-hidden rounded-md mb-4">
                        <img 
                          src={currentTrack.coverArtUrl} 
                          alt={currentTrack.title} 
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                    
                    <h3 className="font-medium text-lg truncate">{currentTrack.title}</h3>
                    <p className="text-muted-foreground truncate">{currentTrack.artist}</p>
                    
                    <div className="flex justify-center items-center gap-4 mt-4">
                      <Button variant="ghost" size="icon">
                        <SkipBack className="h-4 w-4" />
                      </Button>
                      <Button onClick={togglePlay} variant="outline" size="icon" className="h-10 w-10">
                        {isPlaying ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <Button variant="ghost" size="icon">
                        <SkipForward className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="mt-4">
                      <audio
                        ref={audioRef}
                        src={currentTrack.fileUrl}
                        onEnded={() => setIsPlaying(false)}
                        className="w-full"
                        controls
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="md:col-span-3">
            <Card className="shadow-sm bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
              <CardHeader>
                <CardTitle>Music Collection</CardTitle>
                <CardDescription>
                  {filteredTracks.length} tracks available
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredTracks.length > 0 ? (
                    filteredTracks.map((track) => (
                      <div key={track.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md hover:bg-muted transition-colors">
                        <div className="flex items-center gap-3">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-full"
                            onClick={() => playTrack(track)}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                          <div>
                            <h3 className="font-medium">{track.title}</h3>
                            <p className="text-sm text-muted-foreground">{track.artist}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground mr-2 hidden md:inline-block">
                            {track.duration}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => downloadTrack(track)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <MusicIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
                      <h3 className="text-lg font-medium">No tracks found</h3>
                      <p className="text-sm text-muted-foreground">
                        Try adjusting your search or upload new music
                      </p>
                      <Button 
                        className="mt-4" 
                        onClick={() => setShowUploadDialog(true)}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Music
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Upload Music</DialogTitle>
            <DialogDescription>
              Share your worship music with the community
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Track Title <span className="text-destructive">*</span></Label>
              <Input
                id="title"
                value={newTrack.title}
                onChange={(e) => setNewTrack({...newTrack, title: e.target.value})}
                placeholder="Amazing Grace"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="artist">Artist/Performer <span className="text-destructive">*</span></Label>
              <Input
                id="artist"
                value={newTrack.artist}
                onChange={(e) => setNewTrack({...newTrack, artist: e.target.value})}
                placeholder="Chapel Choir"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="genre">Genre</Label>
              <Input
                id="genre"
                value={newTrack.genre}
                onChange={(e) => setNewTrack({...newTrack, genre: e.target.value})}
                placeholder="Hymn, Contemporary, etc."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="file">Audio File <span className="text-destructive">*</span></Label>
              <div className="grid grid-cols-1 gap-2">
                <Input
                  ref={fileInputRef}
                  id="file"
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {selectedFile ? selectedFile.name : 'Select audio file'}
                </Button>
                {selectedFile && (
                  <p className="text-xs text-muted-foreground truncate">
                    Selected: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload Music'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Music;
