
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, UserCheck, AlertCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from 'sonner';

interface AdminUser {
  id: string;
  email?: string;
}

export const AdminList: React.FC = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      
      // Fetch all admin users from the profiles table
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id')
        .eq('is_admin', true);
      
      if (profilesError) {
        throw profilesError;
      }
      
      if (!profilesData || profilesData.length === 0) {
        setAdmins([]);
        setLoading(false);
        return;
      }
      
      // Get user emails from auth users
      const adminUsers: AdminUser[] = [];
      
      for (const profile of profilesData) {
        const { data: userData, error: userError } = await supabase.auth.admin.getUserById(profile.id);
        
        if (userError) {
          console.error('Error fetching user data:', userError);
          adminUsers.push({ id: profile.id });
        } else if (userData) {
          adminUsers.push({ 
            id: profile.id,
            email: userData.user?.email
          });
        }
      }
      
      setAdmins(adminUsers);
    } catch (error) {
      console.error('Error fetching admin users:', error);
      toast.error('Failed to load admin users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-dawg" />
        <span className="ml-2">Loading admin users...</span>
      </div>
    );
  }

  if (admins.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
        <h3 className="text-lg font-semibold">No admin users found</h3>
        <p className="text-gray-500 mt-2">
          There are no admin users in the system or there was an error fetching the data.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Admin Users</h2>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User ID</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins.map((admin) => (
            <TableRow key={admin.id}>
              <TableCell className="font-mono text-xs">{admin.id}</TableCell>
              <TableCell>{admin.email || 'Unknown email'}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <UserCheck className="h-4 w-4 text-green-500 mr-2" />
                  <span>Admin</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
