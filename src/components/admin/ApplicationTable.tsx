
import React, { useState } from 'react';
import { Check, X, ExternalLink, Eye, UserCheck, BarChart, Info, Search, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ApplicationPreview } from './ApplicationPreview';
import { ProgressIndicator } from '@/components/presale/ProgressIndicator';
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  join_beta: boolean | null;
  beta_reason: string | null;
  progress?: number;
  payment_completed?: boolean;
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
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [progressDialogOpen, setProgressDialogOpen] = useState<boolean>(false);
  const [progressValue, setProgressValue] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

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

  const handleUpdateProgress = async () => {
    if (!selectedApp) return;

    setProcessing(selectedApp.id);
    try {
      const { error } = await supabase
        .from('presale_applications')
        .update({ progress: progressValue })
        .eq('id', selectedApp.id);
      
      if (error) {
        throw error;
      }
      
      toast.success('Social score updated successfully');
      onStatusChange();
      setProgressDialogOpen(false);
    } catch (error) {
      console.error('Error updating application progress:', error);
      toast.error('Failed to update social score');
    } finally {
      setProcessing(null);
    }
  };

  const handleUpdatePaymentStatus = async (id: string, payment_completed: boolean) => {
    setProcessing(id);
    try {
      const { error } = await supabase
        .from('presale_applications')
        .update({ payment_completed })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      toast.success(`Payment status ${payment_completed ? 'confirmed' : 'unconfirmed'} successfully`);
      onStatusChange();
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error('Failed to update payment status');
    } finally {
      setProcessing(null);
    }
  };

  const openProgressDialog = (app: Application) => {
    setSelectedApp(app);
    setProgressValue(app.progress || 0);
    setProgressDialogOpen(true);
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

  const getPaymentBadge = (payment_completed: boolean | undefined) => {
    if (payment_completed === true) {
      return <Badge className="bg-green-500 ml-2">Paid</Badge>;
    }
    return null;
  };

  const formatWalletAddress = (address) => {
    if (!address || address.length < 10) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const viewDetails = (app: Application) => {
    setSelectedApp(app);
    setDetailsOpen(true);
  };
  
  const viewUserPreview = (app: Application) => {
    setSelectedApp(app);
    setPreviewOpen(true);
  };

  const SocialScoreInfoText = "The social score bar is updated every 72 hours. Your score is determined by your X account activity. This includes engaging with posts by the @itzadawg account, engaging with posts that contain $Dawg or @itzadawg and posting with $Dawg or @itzadawg. The higher your score the higher your chances you get accepted for the presale.";

  const getDisplayProgress = (progress?: number) => {
    return progress || 1;
  };

  // Filter applications based on search query
  const filteredApplications = applications.filter(app => 
    app.wallet_address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (app.twitter_username && app.twitter_username.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="w-full overflow-auto">
      <div className="mb-4 relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Search by wallet address or Twitter username..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 py-2 border-dawg border-opacity-30 focus:border-dawg"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Twitter</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Amount (AVAX)</TableHead>
            <TableHead>Wallet</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>
              <div className="flex items-center gap-1">
                Social Score
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full p-0">
                        <Info className="h-4 w-4 text-gray-500" />
                        <span className="sr-only">Social Score Info</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs text-xs">
                      {SocialScoreInfoText}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredApplications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                {searchQuery ? 'No matching applications found' : 'No applications found'}
              </TableCell>
            </TableRow>
          ) : (
            filteredApplications.map((app) => (
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
                <TableCell>
                  <div className="flex items-center">
                    {getStatusBadge(app.status)}
                    {getPaymentBadge(app.payment_completed)}
                  </div>
                </TableCell>
                <TableCell>
                  {app.status === 'pending' && (
                    <div className="flex items-center justify-center gap-2">
                      <ProgressIndicator value={getDisplayProgress(app.progress)} size="sm" showLabel={false} />
                      <span className="text-xs">{getDisplayProgress(app.progress)}/10</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 flex items-center gap-1"
                      onClick={() => viewDetails(app)}
                    >
                      <Eye className="h-4 w-4" />
                      Details
                    </Button>
                    <Button
                      size="sm"
                      variant="outline" 
                      className="bg-purple-50 hover:bg-purple-100 text-purple-700 flex items-center gap-1"
                      onClick={() => viewUserPreview(app)}
                    >
                      <UserCheck className="h-4 w-4" />
                      Preview
                    </Button>
                    {app.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 flex items-center gap-1"
                          onClick={() => openProgressDialog(app)}
                        >
                          <BarChart className="h-4 w-4" />
                          Social Score
                        </Button>
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
                    {app.status === 'approved' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className={`${app.payment_completed 
                          ? 'bg-gray-50 hover:bg-gray-100 text-gray-700' 
                          : 'bg-amber-50 hover:bg-amber-100 text-amber-700'} flex items-center gap-1`}
                        onClick={() => handleUpdatePaymentStatus(app.id, !app.payment_completed)}
                        disabled={processing === app.id}
                      >
                        <DollarSign className="h-4 w-4" />
                        {app.payment_completed ? 'Unmark Paid' : 'Mark Paid'}
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Submitted on {selectedApp && new Date(selectedApp.created_at).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          
          {selectedApp && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div className="font-semibold">Twitter:</div>
                <div>{selectedApp.twitter_username ? `@${selectedApp.twitter_username}` : 'Not provided'}</div>
                
                <div className="font-semibold">Size:</div>
                <div>{selectedApp.size}</div>
                
                <div className="font-semibold">Amount:</div>
                <div>{selectedApp.amount} AVAX</div>
                
                <div className="font-semibold">Wallet Address:</div>
                <div className="font-mono text-xs break-words">{selectedApp.wallet_address}</div>
                
                <div className="font-semibold">Status:</div>
                <div className="flex items-center">
                  {getStatusBadge(selectedApp.status)}
                  {selectedApp.status === 'approved' && (
                    <span className="ml-2">
                      {selectedApp.payment_completed ? 
                        <Badge className="bg-green-500">Payment Completed</Badge> : 
                        <Badge className="bg-yellow-500">Payment Pending</Badge>}
                    </span>
                  )}
                </div>

                {selectedApp.status === 'pending' && (
                  <>
                    <div className="font-semibold">
                      <div className="flex items-center gap-1">
                        Social Score
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full p-0">
                                <Info className="h-4 w-4 text-gray-500" />
                                <span className="sr-only">Social Score Info</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-xs text-xs">
                              {SocialScoreInfoText}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ProgressIndicator value={getDisplayProgress(selectedApp.progress)} size="sm" showLabel={false} />
                      <span>{getDisplayProgress(selectedApp.progress)}/10</span>
                    </div>
                  </>
                )}

                <div className="font-semibold">Join Beta:</div>
                <div>{selectedApp.join_beta ? 'Yes' : 'No'}</div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-1">Why join the Dawg presale:</h4>
                <p className="text-sm p-2 bg-gray-50 rounded">{selectedApp.reason}</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-1">How they plan to contribute:</h4>
                <p className="text-sm p-2 bg-gray-50 rounded">{selectedApp.contribution}</p>
              </div>
              
              {selectedApp.join_beta && selectedApp.beta_reason && (
                <div>
                  <h4 className="font-semibold mb-1">Why they should be chosen for the beta:</h4>
                  <p className="text-sm p-2 bg-gray-50 rounded">{selectedApp.beta_reason}</p>
                </div>
              )}
              
              {selectedApp.status === 'approved' && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
                  <h3 className="text-lg font-bold text-green-800 mb-2">Payment Instructions</h3>
                  <div className="space-y-2">
                    <p className="font-medium">Selected size: <span className="font-semibold">{selectedApp.size} ({selectedApp.amount} AVAX)</span></p>
                    <p className="font-medium">Wallet address:</p>
                    <p className="font-mono text-xs break-words bg-white p-2 rounded border border-green-200">{selectedApp.wallet_address}</p>
                    <p className="font-medium mt-4">Send {selectedApp.amount} AVAX to this wallet address:</p>
                    <p className="font-mono text-xs break-words bg-white p-2 rounded border border-green-200">0x829b054cf1a5A791aEaE52f509A8D0eF93416b63</p>
                    
                    <div className="flex items-center mt-4">
                      <div className="font-medium mr-2">Payment status:</div>
                      {selectedApp.payment_completed ? (
                        <Badge className="bg-green-500">Completed</Badge>
                      ) : (
                        <Badge className="bg-yellow-500">Pending</Badge>
                      )}
                    </div>
                    
                    {!selectedApp.payment_completed && (
                      <Button
                        className="mt-2 bg-amber-500 hover:bg-amber-600"
                        onClick={() => {
                          handleUpdatePaymentStatus(selectedApp.id, true);
                          setDetailsOpen(false);
                        }}
                        disabled={processing === selectedApp.id}
                      >
                        <DollarSign className="h-4 w-4 mr-1" />
                        Mark Payment as Completed
                      </Button>
                    )}
                    
                    {selectedApp.payment_completed && (
                      <Button
                        variant="outline"
                        className="mt-2"
                        onClick={() => {
                          handleUpdatePaymentStatus(selectedApp.id, false);
                          setDetailsOpen(false);
                        }}
                        disabled={processing === selectedApp.id}
                      >
                        <DollarSign className="h-4 w-4 mr-1" />
                        Mark Payment as Pending
                      </Button>
                    )}
                  </div>
                </div>
              )}
              
              {selectedApp.status === 'pending' && (
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 flex items-center gap-1"
                    onClick={() => {
                      setDetailsOpen(false);
                      openProgressDialog(selectedApp);
                    }}
                  >
                    <BarChart className="h-4 w-4" />
                    Update Social Score
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-green-50 hover:bg-green-100 text-green-700 flex items-center gap-1"
                    onClick={() => {
                      handleUpdateStatus(selectedApp.id, 'approved');
                      setDetailsOpen(false);
                    }}
                    disabled={processing === selectedApp.id}
                  >
                    <Check className="h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-red-50 hover:bg-red-100 text-red-700 flex items-center gap-1"
                    onClick={() => {
                      handleUpdateStatus(selectedApp.id, 'rejected');
                      setDetailsOpen(false);
                    }}
                    disabled={processing === selectedApp.id}
                  >
                    <X className="h-4 w-4" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>User View Preview</DialogTitle>
            <DialogDescription>
              This is what the user sees on their application page
            </DialogDescription>
          </DialogHeader>
          
          {selectedApp && (
            <div className="pt-4 overflow-auto max-h-[calc(90vh-120px)]">
              <ApplicationPreview application={selectedApp} />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={progressDialogOpen} onOpenChange={setProgressDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Social Score</DialogTitle>
            <DialogDescription>
              {selectedApp?.twitter_username ? `Update social score for @${selectedApp.twitter_username}` : 'Update application social score'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 pt-4">
            <div className="flex flex-col items-center gap-6">
              <ProgressIndicator value={progressValue} size="lg" />
              
              <div className="w-full px-4">
                <Slider 
                  max={10}
                  step={1}
                  value={[progressValue]}
                  onValueChange={(values) => setProgressValue(values[0])}
                  className="w-full"
                />
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                    <span key={value}>{value}</span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col space-y-2">
              <h3 className="text-sm font-medium">What determines the social score?</h3>
              <p className="text-xs text-gray-600">{SocialScoreInfoText}</p>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setProgressDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateProgress}
                disabled={processing === selectedApp?.id}
                className="bg-dawg hover:bg-dawg/90"
              >
                Save Social Score
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
