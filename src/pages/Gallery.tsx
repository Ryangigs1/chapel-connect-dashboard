
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ImagePlus, Filter, ChevronLeft } from "lucide-react";
import { useAuth } from '@/lib/auth';
import { storeImageInGithub, getStoredImages } from '@/utils/githubImageStorage';

// Mock image data for initial display
const mockGalleryImages = [
  { id: '1', title: 'Sunday Service', url: 'https://picsum.photos/id/237/800/500', date: '2023-05-15', category: 'worship' },
  { id: '2', title: 'Youth Event', url: 'https://picsum.photos/id/238/800/500', date: '2023-06-10', category: 'youth' },
  { id: '3', title: 'Chapel Construction', url: 'https://picsum.photos/id/239/800/500', date: '2023-07-12', category: 'campus' },
  { id: '4', title: 'Christmas Celebration', url: 'https://picsum.photos/id/240/800/500', date: '2023-12-25', category: 'events' },
  { id: '5', title: 'Easter Service', url: 'https://picsum.photos/id/241/800/500', date: '2023-04-09', category: 'worship' },
  { id: '6', title: 'Mission Trip', url: 'https://picsum.photos/id/242/800/500', date: '2023-08-20', category: 'outreach' },
  { id: '7', title: 'Bible Study', url: 'https://picsum.photos/id/243/800/500', date: '2023-09-05', category: 'study' },
  { id: '8', title: 'Prayer Meeting', url: 'https://picsum.photos/id/244/800/500', date: '2023-10-15', category: 'prayer' },
];

interface GalleryImage {
  id: string;
  title: string;
  url: string;
  date: string;
  category: string;
  uploadedBy?: string;
}

const Gallery = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [featured, setFeatured] = useState<GalleryImage[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isUploading, setIsUploading] = useState(false);
  const [newImageTitle, setNewImageTitle] = useState('');
  const [newImageCategory, setNewImageCategory] = useState('worship');

  // Fetch images when component mounts
  useEffect(() => {
    const fetchImages = async () => {
      try {
        // Try to fetch from GitHub storage
        const storedImages = await getStoredImages();
        
        if (storedImages && storedImages.length > 0) {
          setImages(storedImages);
          setFeatured(storedImages.slice(0, 4));
        } else {
          // Fall back to mock data if no stored images
          setImages(mockGalleryImages);
          setFeatured(mockGalleryImages.slice(0, 4));
        }
      } catch (error) {
        console.error('Error fetching images:', error);
        // Fall back to mock data
        setImages(mockGalleryImages);
        setFeatured(mockGalleryImages.slice(0, 4));
      }
    };

    fetchImages();
  }, []);

  // Filter images based on active tab
  const filteredImages = activeTab === 'all' 
    ? images 
    : images.filter(img => img.category === activeTab);

  // Handle file upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Basic validation
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive"
      });
      return;
    }
    
    // Size validation (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive"
      });
      return;
    }
    
    if (!newImageTitle) {
      toast({
        title: "Title required",
        description: "Please enter a title for the image.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        const base64Image = reader.result as string;
        
        // Create new image object
        const newImage: GalleryImage = {
          id: `gallery-${Date.now()}`,
          title: newImageTitle,
          url: base64Image,
          date: new Date().toISOString().split('T')[0],
          category: newImageCategory,
          uploadedBy: user?.name
        };
        
        // Store in GitHub
        await storeImageInGithub(newImage);
        
        // Update state
        setImages(prev => [newImage, ...prev]);
        
        toast({
          title: "Upload successful",
          description: "Your image has been added to the gallery."
        });
        
        // Reset form
        setNewImageTitle('');
        setIsUploading(false);
      };
      
      reader.onerror = () => {
        toast({
          title: "Upload failed",
          description: "An error occurred while reading the file.",
          variant: "destructive"
        });
        setIsUploading(false);
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: "An error occurred while uploading the image.",
        variant: "destructive"
      });
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-6 space-y-8">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <h1 className="text-2xl font-bold animate-fade-up">
            Chapel Gallery
          </h1>
        </div>
        
        {/* Featured Images Carousel */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Featured Images</CardTitle>
            <CardDescription>Recent highlights from chapel events</CardDescription>
          </CardHeader>
          <CardContent>
            <Carousel className="w-full max-w-5xl mx-auto">
              <CarouselContent>
                {featured.map((image) => (
                  <CarouselItem key={image.id}>
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex aspect-video items-center justify-center p-0">
                          <img
                            src={image.url}
                            alt={image.title}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </CardContent>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4 rounded-b-md">
                          <h3 className="text-xl font-semibold">{image.title}</h3>
                          <p className="text-sm opacity-80">{image.date}</p>
                        </div>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-4 bg-background/80 backdrop-blur-sm" />
              <CarouselNext className="-right-4 bg-background/80 backdrop-blur-sm" />
            </Carousel>
          </CardContent>
        </Card>
        
        {/* Upload Form */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Add to Gallery</CardTitle>
            <CardDescription>Share your chapel moments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              <div className="space-y-2 flex-1">
                <Label htmlFor="image-title">Image Title</Label>
                <Input 
                  id="image-title" 
                  placeholder="Enter a title for your image" 
                  value={newImageTitle}
                  onChange={(e) => setNewImageTitle(e.target.value)}
                />
              </div>
              
              <div className="space-y-2 md:w-1/4">
                <Label htmlFor="image-category">Category</Label>
                <select 
                  id="image-category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newImageCategory}
                  onChange={(e) => setNewImageCategory(e.target.value)}
                >
                  <option value="worship">Worship</option>
                  <option value="events">Events</option>
                  <option value="youth">Youth</option>
                  <option value="campus">Campus</option>
                  <option value="outreach">Outreach</option>
                  <option value="study">Study</option>
                  <option value="prayer">Prayer</option>
                </select>
              </div>
              
              <div className="flex-shrink-0">
                <Button disabled={isUploading} className="relative overflow-hidden" variant="outline">
                  <ImagePlus className="h-4 w-4 mr-2" />
                  {isUploading ? 'Uploading...' : 'Upload Image'}
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Gallery Tabs and Grid */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="worship">Worship</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="youth">Youth</TabsTrigger>
              <TabsTrigger value="campus">Campus</TabsTrigger>
              <TabsTrigger value="outreach">Outreach</TabsTrigger>
            </TabsList>
            
            <Button variant="ghost" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
          
          <TabsContent value={activeTab} className="animate-fade-up">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredImages.map(image => (
                <Card key={image.id} className="overflow-hidden hover:shadow-md transition-shadow group">
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={image.url} 
                      alt={image.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                      <div className="p-4 text-white w-full">
                        <h3 className="text-lg font-semibold">{image.title}</h3>
                        <p className="text-sm opacity-90">{image.date}</p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium">{image.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {image.category.charAt(0).toUpperCase() + image.category.slice(1)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {filteredImages.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No images found in this category</p>
                <Button variant="outline" className="mt-4">
                  <ImagePlus className="h-4 w-4 mr-2" />
                  Add Images
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Gallery;
