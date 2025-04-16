
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
          {application.status === 'pending' && (
            <div className="flex flex-col items-center justify-center py-6">
              <img 
                src="/lovable-uploads/2c0ff9de-72c1-4acf-ac6d-3e4ef34504ae.png" 
                alt="DAWG review in progress" 
                className="max-w-full h-auto rounded-lg mb-4 max-h-96 object-contain"
                loading="eager" 
                width="700"
                height="400"
              />
              
              <div className="my-6 w-full max-w-xs mx-auto">
                <div className="flex items-center justify-center mb-2">
                  <p className="text-center text-gray-600 font-medium mr-2">Social Score</p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" className="h-6 w-6 p-0 rounded-full">
                          <Info className="h-3 w-3" />
                          <span className="sr-only">Social Score Info</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="w-80 text-sm">
                        <div className="space-y-2">
                          <p>
                            The social score bar is updated every 72 hours. Your score is determined by your X account activity.
                          </p>
                          <p>
                            This includes engaging with posts by the @itzadawg account, engaging with posts that contain $Dawg or @itzadawg and posting with $Dawg or @itzadawg.
                          </p>
                          <p className="font-medium">
                            The higher your score the higher your chances you get accepted for the presale.
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <ProgressIndicator value={application.progress || 0} size="lg" />
              </div>
              
              <p className="text-center mt-4 text-gray-600">
                The DAWG team is reviewing your application carefully.
              </p>
            </div>
          )}
          
          {application.status === 'approved' && (
            <div className="flex flex-col items-center justify-center py-6">
              <img 
                src="/lovable-uploads/893f38ba-aab8-4078-a860-71eab4acda53.png" 
                alt="DAWG approved celebration" 
                className="max-w-full h-auto rounded-lg mb-4 max-h-96 object-contain"
                loading="eager"
                width="700"
                height="400"
              />
              <p className="text-center mt-4 text-green-700 font-semibold">
                Congratulations! Your application has been approved.
              </p>
            </div>
          )}
          
          {application.status === 'rejected' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <p className="font-semibold">Why you want to join the DAWG presale:</p>
                <p className="bg-white p-3 rounded border border-gray-200">{application.reason}</p>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <p className="font-semibold">How you plan to contribute:</p>
                <p className="bg-white p-3 rounded border border-gray-200">{application.contribution}</p>
              </div>
              
              <div className="space-y-2">
                <p className="font-semibold">Selected size:</p>
                <p>{application.size} ({application.amount} AVAX)</p>
              </div>
              
              <div className="space-y-2">
                <p className="font-semibold">Wallet address:</p>
                <div 
                  className="font-mono flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors"
                  onClick={() => copyToClipboard(application.wallet_address)}
                  title="Click to copy full address"
                >
                  <span>{formatWalletAddress(application.wallet_address)}</span>
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </div>
            </div>
          )}
          
          {application.status === 'approved' && (
            <div className="space-y-3 md:col-span-2 mt-4 p-4 bg-green-50 rounded-md border border-green-200">
              <h3 className="text-lg font-bold text-green-800">Payment Instructions</h3>
              <p className="font-medium">Please send <span className="font-bold">{application.amount} AVAX</span> to this wallet address:</p>
              <div 
                className="font-mono text-sm bg-white p-3 break-all flex items-center justify-between gap-2 cursor-pointer hover:bg-gray-50 border border-green-100 rounded"
                onClick={() => copyToClipboard("0x829b054cf1a5A791aEaE52f509A8D0eF93416b63")}
                title="Click to copy"
              >
                <span>0x829b054cf1a5A791aEaE52f509A8D0eF93416b63</span>
                {copied ? (
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                ) : (
                  <Copy className="h-4 w-4 text-gray-400 flex-shrink-0" />
                )}
              </div>
              <p className="text-sm text-green-700 mt-2">Once your payment is confirmed, your allocation will be secured.</p>
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
