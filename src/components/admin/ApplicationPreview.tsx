
import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

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
        <h2 className={`text-2xl font-bold mb-3 ${status.textColor}`}>{status.title}</h2>
        <p className="mb-4">{status.description}</p>
        <div className="flex flex-col space-y-4">
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
            
            <div className="space-y-2 md:col-span-2">
              <p className="font-semibold">Join Brawl of Dawgs beta:</p>
              <p>{application.join_beta ? 'Yes' : 'No'}</p>
            </div>
            
            {application.join_beta && application.beta_reason && (
              <div className="space-y-2 md:col-span-2">
                <p className="font-semibold">Why you should be chosen for the beta:</p>
                <p className="bg-white p-3 rounded border border-gray-200">{application.beta_reason}</p>
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
      </div>
      
      <div className="text-center text-sm text-gray-500">
        <p>This is a preview of what the user sees</p>
      </div>
    </div>
  );
};
