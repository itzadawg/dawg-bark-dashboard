
import React, { useState, useEffect } from 'react';
import Header from '../components/dashboard/Header';
import GallerySection from '../components/gallery/GallerySection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [images, setImages] = useState<any[]>([]);
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
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = images.filter(image => image.section === activeTab);

  return (
    <div className="min-h-screen bg-white">
      <div className="relative">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-black text-dawg-dark mb-6">
            DAWG Gallery
          </h1>
          
          <div className="neo-brutal-border p-6 bg-white mb-12">
            <Tabs defaultValue="memes" onValueChange={setActiveTab}>
              <TabsList className="mb-6 neo-brutal-border">
                <TabsTrigger value="memes">Memes</TabsTrigger>
                <TabsTrigger value="profile_pictures">Profile Pictures</TabsTrigger>
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
