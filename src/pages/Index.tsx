
import React, { useState, useEffect } from 'react';
import Header from '../components/dashboard/Header';
import GallerySection from '../components/gallery/GallerySection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/integrations/supabase/client';
import { GalleryImage } from '../components/gallery/GallerySection';
import { toast } from 'sonner';

const Index = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('memes');

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

  const filteredImages = images.filter(image => image.section === activeTab);

  return (
    <div className="min-h-screen bg-dawg-light">
      <div className="relative">
        <Header />
        <div className="container mx-auto px-4 py-8 flex justify-center items-center">
          <div className="rounded-xl bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-2 border-dawg mb-12 w-full max-w-4xl">
            <Tabs defaultValue="memes" onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6 bg-dawg-secondary overflow-hidden rounded-lg p-1 border border-dawg/30 w-full max-w-md mx-auto">
                <TabsTrigger 
                  value="memes"
                  className="text-dawg-dark font-bold rounded-md data-[state=active]:bg-dawg data-[state=active]:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all duration-200 w-1/2"
                >
                  Memes
                </TabsTrigger>
                <TabsTrigger 
                  value="profile_pictures"
                  className="text-dawg-dark font-bold rounded-md data-[state=active]:bg-dawg data-[state=active]:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all duration-200 w-1/2"
                >
                  Profile Pictures
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="memes">
                <GallerySection 
                  images={filteredImages} 
                  loading={loading} 
                />
              </TabsContent>
              
              <TabsContent value="profile_pictures">
                <GallerySection 
                  images={filteredImages}
                  loading={loading}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
