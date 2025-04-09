
import React, { useState, useEffect } from 'react';
import Header from '../components/dashboard/Header';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2, Copy, Check } from 'lucide-react';
import { useAppSettings } from '../hooks/useAppSettings';
import PresaleDisabledPopup from '../components/presale/PresaleDisabledPopup';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerOverlay,
} from "@/components/ui/drawer";

type ApplicationStatus = 'pending' | 'approved' | 'rejected' | null;
type InvestmentSize = 'Smol Dawg' | 'Dawg' | 'Big Dawg';

const Presale = () => {
  // State management
  const { settings, loading: settingsLoading } = useAppSettings();
  const [showPopup, setShowPopup] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const isMobile = useIsMobile();
  
  // Auth states
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [authError, setAuthError] = useState(null);

  // Application states
  const [existingApplication, setExistingApplication] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus>(null);
  const [checkingApplication, setCheckingApplication] = useState(false);
  const [submittingApplication, setSubmittingApplication] = useState(false);
  const [formData, setFormData] = useState({
    reason: '',
    contribution: '',
    size: 'Dawg' as InvestmentSize,
    walletAddress: ''
  });
  const [copied, setCopied] = useState(false);
  
  // Debugging helper
  const debugAuthFlow = (message, data = null) => {
    console.log(`[Auth Debug] ${message}`, data || '');
  };

  // Check for existing application for the current user
  const checkExistingApplication = async (userId) => {
    try {
      setCheckingApplication(true);
      const { data, error } = await supabase
        .from('presale_applications')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error checking application:', error);
        return;
      }
      
      if (data) {
        console.log('Found existing application:', data);
        setExistingApplication(data);
        setApplicationStatus(data.status as ApplicationStatus);
        setShowApplicationForm(false);
      } else {
        // No existing application, allow form to be shown
        setShowApplicationForm(true);
      }
    } catch (error) {
      console.error('Error in checkExistingApplication:', error);
    } finally {
      setCheckingApplication(false);
    }
  };

  // Copy wallet address to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success('Wallet address copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
      toast.error('Failed to copy address');
    });
  };

  // Check user session and auth state on load
  useEffect(() => {
    const checkUser = async () => {
      try {
        debugAuthFlow('Checking user session');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          setAuthError(`Session error: ${error.message}`);
          return;
        }
        
        if (data.session) {
          debugAuthFlow('User authenticated', data.session.user.id);
          setIsAuthenticated(true);
          setUserInfo(data.session.user);
          
          await checkExistingApplication(data.session.user.id);
        } else {
          debugAuthFlow('No active session found');
        }
      } catch (error) {
        console.error('Error checking user session:', error);
        setAuthError(`Error checking session: ${error.message}`);
      }
    };
    
    checkUser();
    
    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      debugAuthFlow('Auth state changed', { event, userId: session?.user?.id });
      
      if (event === 'SIGNED_IN' && session) {
        setIsAuthenticated(true);
        setUserInfo(session.user);
        
        await checkExistingApplication(session.user.id);
        
        toast.success('Successfully connected with X');
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setUserInfo(null);
        setExistingApplication(null);
        setApplicationStatus(null);
        setShowApplicationForm(false);
      }
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSizeChange = (value: InvestmentSize) => {
    setFormData(prev => ({ ...prev, size: value }));
  };

  // X Auth handler
  const handleConnectX = async () => {
    // If presale is disabled, just show the popup
    if (!settingsLoading && settings.enable_presale_applications === false) {
      setShowPopup(true);
      return;
    }
    
    setIsAuthLoading(true);
    setAuthError(null);
    
    try {
      const currentUrl = window.location.href.split('?')[0];
      const redirectUrl = currentUrl;
      
      debugAuthFlow('Initiating Twitter auth with redirect URL', redirectUrl);
      console.log('Using redirect URL:', redirectUrl);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'twitter',
        options: {
          redirectTo: redirectUrl,
          scopes: 'tweet.read users.read',
        },
      });

      if (error) {
        setAuthError(`Twitter auth error: ${error.message}`);
        toast.error('Failed to connect X account: ' + error.message);
        console.error('X auth error details:', error);
      } else {
        debugAuthFlow('Auth initiated successfully');
        console.log('Auth initiated successfully:', data);
      }
    } catch (error) {
      setAuthError(`Unexpected error: ${error.message}`);
      toast.error('An unexpected error occurred');
      console.error('X authentication error:', error);
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Sign out handler
  const handleSignOut = async () => {
    setIsAuthLoading(true);
    try {
      await supabase.auth.signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
      console.error('Sign out error:', error);
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Submit application form
  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please connect with X first');
      return;
    }
    
    setSubmittingApplication(true);
    
    const getAmountFromSize = (size: InvestmentSize) => {
      switch (size) {
        case 'Smol Dawg': return 7.5;
        case 'Dawg': return 15;
        case 'Big Dawg': return 30;
        default: return 15;
      }
    };

    try {
      const { error } = await supabase
        .from('presale_applications')
        .insert(
          { 
            user_id: userInfo.id,
            reason: formData.reason,
            contribution: formData.contribution,
            size: formData.size,
            amount: getAmountFromSize(formData.size),
            wallet_address: formData.walletAddress,
            twitter_username: userInfo.user_metadata?.preferred_username || ''
          }
        );
      
      if (error) {
        throw error;
      }
      
      toast.success('Application submitted successfully!');
      
      await checkExistingApplication(userInfo.id);
      setShowApplicationForm(false);
      
    } catch (error) {
      toast.error('Failed to submit application: ' + error.message);
      console.error('Submit error:', error);
    } finally {
      setSubmittingApplication(false);
    }
  };

  // Helper functions
  const getProfilePictureUrl = () => {
    if (!userInfo || !userInfo.user_metadata) return null;
    
    return userInfo.user_metadata.avatar_url || 
           userInfo.user_metadata.picture ||
           userInfo.user_metadata.profile_image_url;
  };

  const formatWalletAddress = (address) => {
    if (!address || address.length < 10) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  // Popup close handler
  const closePopup = () => {
    setShowPopup(false);
  };
  
  // Application status display component
  const ApplicationStatusDisplay = () => {
    const getStatusContent = () => {
      switch (applicationStatus) {
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
      <div className={`neo-brutal-border p-8 ${status.bgColor} ${status.borderColor} mb-6`}>
        <h2 className={`text-2xl font-bold mb-3 ${status.textColor}`}>{status.title}</h2>
        <p className="mb-4">{status.description}</p>
        
        {existingApplication && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <p className="font-semibold">Why you want to join the DAWG presale:</p>
              <p className="bg-white p-3 rounded border border-gray-200">{existingApplication.reason}</p>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <p className="font-semibold">How you plan to contribute:</p>
              <p className="bg-white p-3 rounded border border-gray-200">{existingApplication.contribution}</p>
            </div>
            
            <div className="space-y-2">
              <p className="font-semibold">Selected size:</p>
              <p>{existingApplication.size} ({existingApplication.amount} AVAX)</p>
            </div>
            
            <div className="space-y-2">
              <p className="font-semibold">Wallet address:</p>
              <div 
                className="font-mono flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors"
                onClick={() => copyToClipboard(existingApplication.wallet_address)}
                title="Click to copy full address"
              >
                <span>{formatWalletAddress(existingApplication.wallet_address)}</span>
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </div>
            
            {applicationStatus === 'approved' && (
              <div className="space-y-3 md:col-span-2 mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                <h3 className="text-lg font-bold text-green-800">Payment Instructions</h3>
                <p className="font-medium">Please send <span className="font-bold">{existingApplication.amount} AVAX</span> to this wallet address:</p>
                <div 
                  className="font-mono text-sm bg-white p-3 rounded border border-green-200 break-all flex items-center justify-between gap-2 cursor-pointer hover:bg-gray-50"
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
        )}
      </div>
    );
  };

  // Application Form Component
  const ApplicationFormDisplay = () => (
    <form onSubmit={handleSubmitApplication} className="space-y-8 neo-brutal-border p-6">
      <div>
        <label htmlFor="reason" className="block mb-2 font-medium text-lg">Why do you want to join the DAWG presale?</label>
        <Textarea
          id="reason"
          name="reason"
          required
          value={formData.reason}
          onChange={handleChange}
          placeholder="Share your reasons for joining the DAWG community..."
          className="neo-brutal-border h-32"
        />
      </div>
      
      <div>
        <label htmlFor="contribution" className="block mb-2 font-medium text-lg">How do you plan to contribute to the DAWG coin?</label>
        <Textarea
          id="contribution"
          name="contribution"
          required
          value={formData.contribution}
          onChange={handleChange}
          placeholder="Tell us how you'll help grow the DAWG community..."
          className="neo-brutal-border h-32"
        />
      </div>
      
      <div>
        <label className="block mb-2 font-medium text-lg">Choose your size</label>
        <RadioGroup value={formData.size} onValueChange={handleSizeChange} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2 neo-brutal-border p-4 hover:bg-gray-50 cursor-pointer">
            <RadioGroupItem value="Smol Dawg" id="size-small" />
            <Label htmlFor="size-small" className="font-medium cursor-pointer flex-1">
              Smol Dawg <span className="block text-sm text-gray-500 mt-1">7.5 AVAX</span>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 neo-brutal-border p-4 hover:bg-gray-50 cursor-pointer">
            <RadioGroupItem value="Dawg" id="size-medium" />
            <Label htmlFor="size-medium" className="font-medium cursor-pointer flex-1">
              Dawg <span className="block text-sm text-gray-500 mt-1">15 AVAX</span>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 neo-brutal-border p-4 hover:bg-gray-50 cursor-pointer">
            <RadioGroupItem value="Big Dawg" id="size-large" />
            <Label htmlFor="size-large" className="font-medium cursor-pointer flex-1">
              Big Dawg <span className="block text-sm text-gray-500 mt-1">30 AVAX</span>
            </Label>
          </div>
        </RadioGroup>
      </div>
      
      <div>
        <label htmlFor="walletAddress" className="block mb-2 font-medium text-lg">Enter your AVAX C-Chain Wallet Address</label>
        <Input
          id="walletAddress"
          name="walletAddress"
          required
          value={formData.walletAddress}
          onChange={handleChange}
          placeholder="0x..."
          className="neo-brutal-border font-mono"
        />
        <p className="text-sm text-gray-500 mt-1">
          Please ensure this is an AVAX C-Chain compatible address
        </p>
      </div>
      
      <Button 
        type="submit"
        disabled={submittingApplication}
        className="w-full py-6 text-lg neo-brutal-border bg-dawg hover:bg-dawg-secondary"
      >
        {submittingApplication ? 'Submitting...' : 'Submit Application'}
      </Button>
    </form>
  );

  // Main render
  return (
    <div className="relative min-h-screen">
      {/* Background Image with slightly reduced opacity */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://i.imghippo.com/files/HdYk9772Jys.png" 
          alt="DAWG Background" 
          className="w-full h-full object-cover opacity-90" 
          loading="eager"
          width="1920"
          height="1080"
        />
      </div>
      
      {/* Dark overlay to improve text visibility */}
      <div className="absolute inset-0 z-0 bg-black bg-opacity-20"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <Header />
        <div className="min-h-screen flex flex-col">
          <div className="text-center max-w-7xl mx-auto px-4 md:px-8 mb-0">
            {/* Image removed from here */}
          </div>

          {/* Main content section */}
          <div className="w-full flex flex-col items-center px-4 md:px-8 lg:px-12 flex-grow justify-center mb-16">
            <div className="w-full max-w-3xl flex flex-col items-center justify-center">
              {isAuthenticated ? (
                <>
                  {/* User info display */}
                  <div className="neo-brutal-border p-4 mb-6 w-full flex items-center justify-between bg-dawg/10">
                    <div className="flex items-center gap-3">
                      <div className="font-medium">Connected as:</div>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8 border border-gray-200">
                          <AvatarImage src={getProfilePictureUrl()} alt={userInfo?.user_metadata?.preferred_username || 'User'} />
                          <AvatarFallback>
                            {(userInfo?.user_metadata?.preferred_username || 'U').charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">@{userInfo?.user_metadata?.preferred_username || 'user'}</span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={handleSignOut}
                      disabled={isAuthLoading}
                      className="neo-brutal-border bg-white"
                    >
                      Disconnect
                    </Button>
                  </div>
                  
                  {/* Show appropriate content based on application state */}
                  {checkingApplication ? (
                    <div className="text-center neo-brutal-border p-8 flex flex-col items-center w-full">
                      <Loader2 className="h-8 w-8 animate-spin text-dawg mb-4" />
                      <p>Checking application status...</p>
                    </div>
                  ) : existingApplication ? (
                    <ApplicationStatusDisplay />
                  ) : showApplicationForm ? (
                    <div className="w-full">
                      <h2 className="text-2xl font-bold mb-4 text-center text-white">Presale Application</h2>
                      <ApplicationFormDisplay />
                    </div>
                  ) : (
                    <div className="text-center neo-brutal-border p-8 flex flex-col items-center bg-white/80 w-full">
                      <p className="mb-6 text-lg">Click the button below to apply for the presale</p>
                      <Button 
                        onClick={() => setShowApplicationForm(true)}
                        className="py-6 text-lg neo-brutal-border bg-dawg hover:bg-dawg-secondary"
                      >
                        Apply for Presale
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Initial connect display */}
                  <p className="text-white text-lg font-medium mb-4">Want to apply for presale? Click the button below.</p>
                  <Button 
                    onClick={handleConnectX}
                    disabled={isAuthLoading} 
                    className="bg-dawg flex items-center justify-center gap-2 px-8 py-3 rounded-md text-lg font-medium text-white shadow-md hover:bg-dawg-dark transition-colors duration-300"
                  >
                    {isAuthLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      'Connect with X'
                    )}
                  </Button>
                </>
              )}
              
              {/* Error display */}
              {authError && (
                <div className="p-4 mt-6 w-full neo-brutal-border bg-red-50 text-red-700">
                  <h3 className="font-bold">Authentication Error:</h3>
                  <p className="break-words">{authError}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Use appropriate component based on device type for disabled popup */}
      {isMobile ? (
        <Drawer open={showPopup} onOpenChange={closePopup}>
          <DrawerOverlay />
          <DrawerContent className="h-[90%] max-h-[90vh] p-0">
            <PresaleDisabledPopup onClose={closePopup} />
          </DrawerContent>
        </Drawer>
      ) : (
        showPopup && <PresaleDisabledPopup onClose={closePopup} />
      )}
    </div>
  );
};

export default Presale;
