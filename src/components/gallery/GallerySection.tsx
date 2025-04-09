
import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';

interface GalleryImage {
  id: string;
  title: string;
  image_url: string;
  section: string;
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <div 
            key={image.id} 
            className="relative overflow-hidden neo-brutal-box cursor-pointer group"
            onClick={() => handleImageClick(image)}
          >
            <div className="aspect-square overflow-hidden">
              <img 
                src={image.image_url} 
                alt={image.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <p className="truncate">{image.title}</p>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedImage && (
          <DialogContent className="max-w-3xl">
            <div className="flex flex-col space-y-4">
              <h3 className="text-xl font-bold">{selectedImage.title}</h3>
              <div className="relative">
                <img 
                  src={selectedImage.image_url} 
                  alt={selectedImage.title}
                  className="w-full h-auto object-contain max-h-[70vh] neo-brutal-border"
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleDownload} className="flex items-center gap-2 neo-brutal-button">
                  <Download size={16} />
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
