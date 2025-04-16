
import React, { useState } from 'react';
import { Copy, Check, Info } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ProgressIndicator } from '@/components/presale/ProgressIndicator';
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
}

interface ApplicationPreviewProps {
  application: Application;
}

export const ApplicationPreview: React.FC<ApplicationPreviewProps> = ({ application }) => {
  const [copied, setCopied] = useState(false);

  const formatWalletAddress = (address) => {
    if (!address || address.length < 10) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Ensure progress is at least 1 for UI display purposes
  const displayProgress = application.progress || 1;

  const getStatusContent = () => {
    switch (application.status) {
      case 'pending':
        return {
          title: 'Application Under Review',
          description: 'Your application is being reviewed by our team. We will notify you once a decision has been made.',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-300',
          textColor: 'text-yellow-800'
        };
      case 'approved':
        return {
          title: 'Application Approved!',
          description: 'Congratulations! Your presale application has been approved. Please follow the payment instructions below to complete your purchase.',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-300',
          textColor: 'text-green-800'
        };
      case 'rejected':
        return {
          title: 'Application Not Approved',
          description: 'We regret to inform you that your application was not approved at this time. You may contact our team for more information.',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-300',
          textColor: 'text-red-800'
        };
      default:
        return {
          title: 'Application Status Unknown',
          description: 'There was an issue retrieving your application status. Please try again or contact support.',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-300',
          textColor: 'text-gray-800'
        };
    }
  };

  const status = getStatusContent();

  return (
    <div className="rounded-xl border-2 border-dawg-dark p-6 bg-[#f7f7ff]">
      <div className="mb-4 bg-dawg/10 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 border border-gray-200">
            <AvatarFallback>
              {(application.twitter_username || 'U').charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">@{application.twitter_username || 'user'}</span>
        </div>
      </div>
      
      <div className={`clay-card p-8 ${status.bgColor} mb-6 rounded-xl`}>
        <h2 className={`text-2xl font-bold mb-3 ${status.textColor} text-center`}>{status.title}</h2>
        <p className="mb-4 text-center">{status.description}</p>
        <div className="flex flex-col space-y-4">
          {application.status === 'approved' && (
            <div className="flex flex-col items-center justify-center py-6">
              <img 
                src="/lovable-uploads/5dc48878-91e7-46af-aa2c-6de382f62915.png" 
                alt="DAWG application approved" 
                className="max-w-full h-auto rounded-lg mb-4 max-h-96 object-contain"
                loading="eager" 
                width="700"
                height="700"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <p className="text-gray-600 font-semibold">
                    Congratulations on being approved for the DAWG presale!
                    Follow the payment instructions to secure your allocation.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {application.status === 'rejected' && (
            <div className="flex flex-col items-center justify-center py-6">
              <img 
                src="/lovable-uploads/0bd08fc9-6677-4eea-be6f-537d093293ee.png" 
                alt="DAWG application rejected" 
                className="max-w-full h-auto rounded-lg mb-4 max-h-96 object-contain"
                loading="eager" 
                width="700"
                height="400"
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="text-center text-sm text-gray-500">
        <p>This is a preview of what the user sees</p>
      </div>
    </div>
  );
};
