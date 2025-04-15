import React, { useState, useEffect } from 'react';
import Header from '../components/dashboard/Header';
import { AdminProtected } from '../components/admin/AdminProtected';
import { ApplicationTable } from '../components/admin/ApplicationTable';
import { AdminList } from '../components/admin/AdminList';
import GalleryManager from '../components/admin/GalleryManager';
import AppSettings from '../components/admin/AppSettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';

const AdminDashboard: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [tabFilter, setTabFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('applications');
  const { isAdmin } = useAdmin();

  const fetchApplications = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('presale_applications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (tabFilter !== 'all') {
        query = query.eq('status', tabFilter);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'applications' && isAdmin) {
      fetchApplications();
    }
  }, [tabFilter, activeTab, isAdmin]);

  const getApplicationCount = (status: string): number => {
    if (status === 'all') {
      return applications.length;
    }
    return applications.filter(app => app.status === status).length;
  };

  return (
    <AdminProtected>
      <Header />
      <div className="min-h-screen px-4 md:px-8 py-12 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-dawg-dark mb-4">
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Manage presale applications, gallery images, admin users and application settings
          </p>
        </div>

        <Tabs defaultValue="applications" onValueChange={setActiveTab}>
          <TabsList className="mb-6 bg-white rounded-xl border-2 border-dawg-dark shadow-[5px_5px_0px_0px_rgba(0,0,0,0.2)] p-1 overflow-hidden">
            <TabsTrigger 
              value="applications" 
              className="data-[state=active]:bg-dawg data-[state=active]:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1)] rounded-lg transition-all duration-200"
            >
              Applications
            </TabsTrigger>
            
            <TabsTrigger 
              value="gallery" 
              className="data-[state=active]:bg-dawg data-[state=active]:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1)] rounded-lg transition-all duration-200"
            >
              Gallery
            </TabsTrigger>
            
            <TabsTrigger 
              value="admins" 
              className="data-[state=active]:bg-dawg data-[state=active]:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1)] rounded-lg transition-all duration-200"
            >
              Admin Users
            </TabsTrigger>

            <TabsTrigger 
              value="settings" 
              className="data-[state=active]:bg-dawg data-[state=active]:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1)] rounded-lg transition-all duration-200"
            >
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="applications">
            <div className="bg-white rounded-xl border-2 border-dawg-dark p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]">
              <Tabs defaultValue="all" onValueChange={setTabFilter}>
                <div className="mb-6">
                  <TabsList className="bg-gray-100 rounded-xl border-2 border-dawg/50 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] p-1 overflow-hidden">
                    <TabsTrigger 
                      value="all"
                      className="data-[state=active]:bg-dawg data-[state=active]:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1)] rounded-lg transition-all duration-200"
                    >
                      All
                      <span className="ml-2 bg-gray-100 px-2 py-0.5 rounded-full text-xs">
                        {getApplicationCount('all')}
                      </span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="pending"
                      className="data-[state=active]:bg-dawg data-[state=active]:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1)] rounded-lg transition-all duration-200"
                    >
                      Pending
                      <span className="ml-2 bg-yellow-100 px-2 py-0.5 rounded-full text-xs text-yellow-800">
                        {getApplicationCount('pending')}
                      </span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="approved"
                      className="data-[state=active]:bg-dawg data-[state=active]:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1)] rounded-lg transition-all duration-200"
                    >
                      Approved
                      <span className="ml-2 bg-green-100 px-2 py-0.5 rounded-full text-xs text-green-800">
                        {getApplicationCount('approved')}
                      </span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="rejected"
                      className="data-[state=active]:bg-dawg data-[state=active]:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1)] rounded-lg transition-all duration-200"
                    >
                      Rejected
                      <span className="ml-2 bg-red-100 px-2 py-0.5 rounded-full text-xs text-red-800">
                        {getApplicationCount('rejected')}
                      </span>
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                {['all', 'pending', 'approved', 'rejected'].map((status) => (
                  <TabsContent key={status} value={status} className="mt-0">
                    {loading ? (
                      <div className="flex justify-center items-center p-12">
                        <Loader2 className="h-8 w-8 animate-spin text-dawg" />
                        <span className="ml-2">Loading applications...</span>
                      </div>
                    ) : (
                      <ApplicationTable 
                        applications={applications} 
                        onStatusChange={fetchApplications} 
                      />
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </TabsContent>
          
          <TabsContent value="gallery">
            <GalleryManager />
          </TabsContent>
          
          <TabsContent value="admins">
            <div className="bg-white rounded-xl border-2 border-dawg-dark p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]">
              <AdminList />
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="bg-white rounded-xl border-2 border-dawg-dark p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]">
              <AppSettings />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminProtected>
  );
};

export default AdminDashboard;
