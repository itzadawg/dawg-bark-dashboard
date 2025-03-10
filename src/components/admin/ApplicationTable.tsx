
import React, { useState } from 'react';
import { Check, X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';

interface Application {
  id: string;
  wallet_address: string;
  twitter_username: string | null;
  amount: number;
  reason: string;
  contribution: string;
  size: string;
  status: string;
  created_at: string;
}

interface ApplicationTableProps {
  applications: Application[];
  onStatusChange: () => void;
}

export const ApplicationTable: React.FC<ApplicationTableProps> = ({ 
  applications, 
  onStatusChange 
}) => {
  const [processing, setProcessing] = useState<string | null>(null);

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    setProcessing(id);
    try {
      const { error } = await supabase
        .from('presale_applications')
        .update({ status })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      toast.success(`Application ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
      onStatusChange();
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error('Failed to update application status');
    } finally {
      setProcessing(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-500">Pending</Badge>;
    }
  };

  // Format wallet address to show beginning and end with ellipsis in the middle
  const formatWalletAddress = (address) => {
    if (!address || address.length < 10) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Twitter</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Amount (AVAX)</TableHead>
            <TableHead>Wallet</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                No applications found
              </TableCell>
            </TableRow>
          ) : (
            applications.map((app) => (
              <TableRow key={app.id}>
                <TableCell className="font-medium">
                  {new Date(app.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {app.twitter_username ? (
                    <a 
                      href={`https://twitter.com/${app.twitter_username}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-500 hover:underline"
                    >
                      @{app.twitter_username}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>{app.size}</TableCell>
                <TableCell>{app.amount}</TableCell>
                <TableCell className="font-mono text-xs">{formatWalletAddress(app.wallet_address)}</TableCell>
                <TableCell>{getStatusBadge(app.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {app.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-green-50 hover:bg-green-100 text-green-700 flex items-center gap-1"
                          onClick={() => handleUpdateStatus(app.id, 'approved')}
                          disabled={processing === app.id}
                        >
                          <Check className="h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-red-50 hover:bg-red-100 text-red-700 flex items-center gap-1"
                          onClick={() => handleUpdateStatus(app.id, 'rejected')}
                          disabled={processing === app.id}
                        >
                          <X className="h-4 w-4" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
