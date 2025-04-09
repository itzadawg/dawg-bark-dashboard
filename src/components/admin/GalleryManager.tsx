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
import { GalleryImage } from '../gallery/GallerySection';

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
        .order('created_at', { ascending: false }) as { data: GalleryImage[] | null, error: any };
      
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
      
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${section}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, selectedFile);
      
      if (uploadError) {
        throw uploadError;
      }
      
      const { data: urlData } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);
      
      const publicUrl = urlData.publicUrl;
      
      const { error: insertError } = await supabase
        .from('gallery_images')
        .insert({
          title: title.trim(),
          section,
          image_url: publicUrl
        }) as { error: any };
      
      if (insertError) {
        throw insertError;
      }
      
      toast.success('Image uploaded successfully');
      
      setSelectedFile(null);
      setPreviewUrl(null);
      setTitle('');
      
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
      const storageUrl = supabase.storage.from('gallery').getPublicUrl('').data.publicUrl;
      const filePath = imageToDelete.image_url.replace(storageUrl + '/', '');
      
      const { error: storageError } = await supabase.storage
        .from('gallery')
        .remove([filePath]);
      
      if (storageError) {
        console.warn('Storage error, proceeding with database deletion:', storageError);
      }
      
      const { error: dbError } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', imageToDelete.id) as { error: any };
      
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
    <div className="bg-white rounded-xl border-2 border-dawg-dark p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]">
      <Tabs defaultValue="upload" onValueChange={setActiveTab}>
        <TabsList className="mb-6 bg-gray-100 rounded-xl border-2 border-dawg/50 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] p-1 overflow-hidden">
          <TabsTrigger 
            value="upload"
            className="data-[state=active]:bg-dawg data-[state=active]:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1)] rounded-lg transition-all duration-200"
          >
            Upload New Image
          </TabsTrigger>
          <TabsTrigger 
            value="manage"
            className="data-[state=active]:bg-dawg data-[state=active]:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1)] rounded-lg transition-all duration-200"
          >
            Manage Images
          </TabsTrigger>
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
                    className="border-2 border-gray-300 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)]"
                  />
                </div>
                
                <div>
                  <label className="block mb-2 font-medium">Section</label>
                  <Select value={section} onValueChange={setSection}>
                    <SelectTrigger className="border-2 border-gray-300 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)]">
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent className="border-2 border-gray-300 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)]">
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
                    className="border-2 border-gray-300 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] transform hover:translate-y-[-2px] transition-all duration-200"
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
                <div className="p-3 border-2 border-gray-200 bg-white rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] w-64 h-64">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
              </div>
            )}
            
            <Button 
              type="submit" 
              disabled={uploading || !selectedFile || !title.trim()}
              className="bg-dawg hover:bg-dawg-dark border-2 border-dawg-dark text-dawg-dark hover:text-white rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] transform hover:translate-y-[-2px] transition-all duration-200"
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
                className="mt-4 bg-dawg hover:bg-dawg-dark border-2 border-dawg-dark text-dawg-dark hover:text-white rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] transform hover:translate-y-[-2px] transition-all duration-200"
                onClick={() => setActiveTab('upload')}
              >
                Upload Image
              </Button>
            </div>
          ) : (
            <div className="border-2 border-gray-200 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50 border-b-2 border-gray-200">
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
                    <TableRow key={image.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="w-16 h-16 overflow-hidden rounded-lg border-2 border-gray-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]">
                          <img 
                            src={image.image_url} 
                            alt={image.title} 
                            className="w-full h-full object-cover"
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
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg border-2 border-red-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <AlertDialog open={!!imageToDelete} onOpenChange={(open) => !open && setImageToDelete(null)}>
        <AlertDialogContent className="bg-white rounded-xl border-2 border-dawg-dark shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the image "{imageToDelete?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg border-2 border-gray-300 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)]">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-red-500 hover:bg-red-600 text-white rounded-lg border-2 border-red-700 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)]"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GalleryManager;
