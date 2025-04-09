
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Image, Trash2, Upload, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

interface GalleryImage {
  id: string;
  title: string;
  section: string;
  image_url: string;
  created_at: string;
}

const GalleryManager: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [section, setSection] = useState('memes');
  const [imageToDelete, setImageToDelete] = useState<GalleryImage | null>(null);
  const [activeTab, setActiveTab] = useState('upload');

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('Failed to load gallery images');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile || !title.trim()) {
      toast.error('Please select an image and provide a title');
      return;
    }
    
    try {
      setUploading(true);
      
      // 1. Upload image to storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${section}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, selectedFile);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // 2. Get public URL
      const { data: urlData } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);
      
      const publicUrl = urlData.publicUrl;
      
      // 3. Save record in database
      const { error: insertError } = await supabase
        .from('gallery_images')
        .insert({
          title: title.trim(),
          section,
          image_url: publicUrl
        });
      
      if (insertError) {
        throw insertError;
      }
      
      toast.success('Image uploaded successfully');
      
      // Reset form
      setSelectedFile(null);
      setPreviewUrl(null);
      setTitle('');
      
      // Refresh images
      fetchImages();
      
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(`Upload failed: ${error.message || 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  const confirmDelete = (image: GalleryImage) => {
    setImageToDelete(image);
  };

  const handleDelete = async () => {
    if (!imageToDelete) return;
    
    try {
      // 1. Extract file path from URL
      const storageUrl = supabase.storage.from('gallery').getPublicUrl('').data.publicUrl;
      const filePath = imageToDelete.image_url.replace(storageUrl + '/', '');
      
      // 2. Delete from storage
      const { error: storageError } = await supabase.storage
        .from('gallery')
        .remove([filePath]);
      
      if (storageError) {
        console.warn('Storage error, proceeding with database deletion:', storageError);
      }
      
      // 3. Delete from database
      const { error: dbError } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', imageToDelete.id);
      
      if (dbError) {
        throw dbError;
      }
      
      setImages(images.filter(img => img.id !== imageToDelete.id));
      toast.success('Image deleted successfully');
      
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(`Delete failed: ${error.message || 'Unknown error'}`);
    } finally {
      setImageToDelete(null);
    }
  };

  return (
    <div className="neo-brutal-border p-6 bg-white">
      <Tabs defaultValue="upload" onValueChange={setActiveTab}>
        <TabsList className="mb-6 neo-brutal-border">
          <TabsTrigger value="upload">Upload New Image</TabsTrigger>
          <TabsTrigger value="manage">Manage Images</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload">
          <form onSubmit={handleUpload} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 font-medium">Image Title</label>
                  <Input
                    type="text"
                    placeholder="Enter image title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-2 font-medium">Section</label>
                  <Select value={section} onValueChange={setSection}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="memes">Memes</SelectItem>
                      <SelectItem value="profile_pictures">Profile Pictures</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="block mb-2 font-medium">Image</label>
                <div className="flex items-center space-x-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => document.getElementById('image-upload')?.click()}
                    className="neo-brutal-border"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Select Image
                  </Button>
                  
                  <span className="text-sm text-gray-500">
                    {selectedFile ? selectedFile.name : 'No file selected'}
                  </span>
                  
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </div>
            
            {previewUrl && (
              <div className="mt-6">
                <label className="block mb-2 font-medium">Preview</label>
                <div className="p-2 border border-gray-200 rounded-md w-64 h-64">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}
            
            <Button 
              type="submit" 
              disabled={uploading || !selectedFile || !title.trim()}
              className="neo-brutal-button"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Image
                </>
              )}
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="manage">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-dawg" />
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-10">
              <Image className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium">No images uploaded</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by uploading your first image.
              </p>
              <Button
                className="mt-4"
                onClick={() => setActiveTab('upload')}
              >
                Upload Image
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {images.map((image) => (
                  <TableRow key={image.id}>
                    <TableCell>
                      <div className="w-16 h-16 overflow-hidden">
                        <img 
                          src={image.image_url} 
                          alt={image.title} 
                          className="w-full h-full object-cover neo-brutal-border"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{image.title}</TableCell>
                    <TableCell className="capitalize">{image.section.replace('_', ' ')}</TableCell>
                    <TableCell>{new Date(image.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => confirmDelete(image)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>
      </Tabs>
      
      <AlertDialog open={!!imageToDelete} onOpenChange={(open) => !open && setImageToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the image "{imageToDelete?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GalleryManager;
