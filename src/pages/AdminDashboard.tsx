
import React, { useState, useEffect } from 'react';
import Header from '../components/dashboard/Header';
import { AdminProtected } from '../components/admin/AdminProtected';
import { ApplicationTable } from '../components/admin/ApplicationTable';
import { AdminList } from '../components/admin/AdminList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [tabFilter, setTabFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('applications');

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
    if (activeTab === 'applications') {
      fetchApplications();
    }
  }, [tabFilter, activeTab]);

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
            Manage presale applications and review user submissions
          </p>
        </div>

        <Tabs defaultValue="applications" onValueChange={setActiveTab}>
          <TabsList className="mb-6 neo-brutal-border">
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="admins">Admin Users</TabsTrigger>
          </TabsList>
          
          <TabsContent value="applications">
            <div className="neo-brutal-border p-6 bg-white">
              <Tabs defaultValue="all" onValueChange={setTabFilter}>
                <div className="mb-6">
                  <TabsList className="neo-brutal-border">
                    <TabsTrigger value="all">
                      All
                      <span className="ml-2 bg-gray-100 px-2 py-0.5 rounded-full text-xs">
                        {getApplicationCount('all')}
                      </span>
                    </TabsTrigger>
                    <TabsTrigger value="pending">
                      Pending
                      <span className="ml-2 bg-yellow-100 px-2 py-0.5 rounded-full text-xs text-yellow-800">
                        {getApplicationCount('pending')}
                      </span>
                    </TabsTrigger>
                    <TabsTrigger value="approved">
                      Approved
                      <span className="ml-2 bg-green-100 px-2 py-0.5 rounded-full text-xs text-green-800">
                        {getApplicationCount('approved')}
                      </span>
                    </TabsTrigger>
                    <TabsTrigger value="rejected">
                      Rejected
                      <span className="ml-2 bg-red-100 px-2 py-0.5 rounded-full text-xs text-red-800">
                        {getApplicationCount('rejected')}
                      </span>
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="all" className="mt-0">
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
                
                <TabsContent value="pending" className="mt-0">
                  {loading ? (
                    <div className="flex justify-center items-center p-12">
                      <Loader2 className="h-8 w-8 animate-spin text-dawg" />
                      <span className="ml-2">Loading pending applications...</span>
                    </div>
                  ) : (
                    <ApplicationTable 
                      applications={applications} 
                      onStatusChange={fetchApplications} 
                    />
                  )}
                </TabsContent>
                
                <TabsContent value="approved" className="mt-0">
                  {loading ? (
                    <div className="flex justify-center items-center p-12">
                      <Loader2 className="h-8 w-8 animate-spin text-dawg" />
                      <span className="ml-2">Loading approved applications...</span>
                    </div>
                  ) : (
                    <ApplicationTable 
                      applications={applications} 
                      onStatusChange={fetchApplications} 
                    />
                  )}
                </TabsContent>
                
                <TabsContent value="rejected" className="mt-0">
                  {loading ? (
                    <div className="flex justify-center items-center p-12">
                      <Loader2 className="h-8 w-8 animate-spin text-dawg" />
                      <span className="ml-2">Loading rejected applications...</span>
                    </div>
                  ) : (
                    <ApplicationTable 
                      applications={applications} 
                      onStatusChange={fetchApplications} 
                    />
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>
          
          <TabsContent value="admins">
            <div className="neo-brutal-border p-6 bg-white">
              <AdminList />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminProtected>
  );
};

export default AdminDashboard;
