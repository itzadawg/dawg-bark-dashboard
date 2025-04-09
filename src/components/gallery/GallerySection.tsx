
import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';

export interface GalleryImage {
  id: string;
  title: string;
  image_url: string;
  section: string;
  created_at: string;
}

interface GallerySectionProps {
  images: GalleryImage[];
  loading: boolean;
}

const GallerySection: React.FC<GallerySectionProps> = ({ images, loading }) => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleImageClick = (image: GalleryImage) => {
    setSelectedImage(image);
    setIsDialogOpen(true);
  };

  const handleDownload = async () => {
    if (!selectedImage) return;
    
    try {
      const response = await fetch(selectedImage.image_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedImage.title}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-dawg" />
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-gray-500">No images found in this section</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((image) => (
          <div 
            key={image.id} 
            className="relative overflow-hidden cursor-pointer group"
            onClick={() => handleImageClick(image)}
          >
            <div 
              className="aspect-square rounded-xl bg-white p-3 border-2 border-dawg-secondary 
                       shadow-[0_8px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)] 
                       hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] 
                       transition-all duration-300 hover:translate-y-[-8px]"
            >
              <div className="w-full h-full rounded-lg overflow-hidden">
                <img 
                  src={image.image_url} 
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="absolute left-0 right-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <p className="font-bold truncate">{image.title}</p>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedImage && (
          <DialogContent className="max-w-3xl bg-white rounded-2xl border-2 border-dawg-secondary p-6 shadow-[0_10px_40px_-5px_rgba(0,0,0,0.2)]">
            <div className="flex flex-col space-y-4">
              <h3 className="text-xl font-bold text-dawg-dark">{selectedImage.title}</h3>
              <div className="relative rounded-xl overflow-hidden border-2 border-dawg-secondary bg-white p-2">
                <img 
                  src={selectedImage.image_url} 
                  alt={selectedImage.title}
                  className="w-full h-auto object-contain max-h-[70vh] rounded-lg"
                />
              </div>
              <div className="flex justify-end mt-4">
                <Button 
                  onClick={handleDownload} 
                  className="flex items-center gap-2 bg-dawg hover:bg-dawg-dark border-2 border-dawg-dark rounded-xl px-6 py-3 font-bold text-dawg-dark hover:text-white transition-colors shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_0_rgba(0,0,0,0.15)]"
                >
                  <Download size={18} />
                  Download
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default GallerySection;
