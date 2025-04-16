import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/dashboard/Header';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, Copy, Check } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';

type ApplicationStatus = 'pending' | 'approved' | 'rejected' | null;
type InvestmentSize = 'Smol Dawg' | 'Dawg' | 'Big Dawg';

const addClayStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    .clay-card {
      border-radius: 24px;
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.8);
      box-shadow: 
        0 8px 20px rgba(0, 0, 0, 0.08),
        0 2px 8px rgba(0, 0, 0, 0.06),
        inset 0 1px 1px rgba(255, 255, 255, 0.8);
      transition: all 0.3s ease;
    }
    
    .clay-card:hover {
      box-shadow: 
        0 10px 25px rgba(0, 0, 0, 0.1),
        0 3px 10px rgba(0, 0, 0, 0.08),
        inset 0 1px 1px rgba(255, 255, 255, 0.9);
      transform: translateY(-2px);
    }
    
    .clay-input {
      background: rgba(255, 255, 255, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.8);
      border-radius: 16px;
      box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.1);
      padding: 12px 16px;
      transition: all 0.2s ease;
    }
    
    .clay-input:focus {
      box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.15);
      background: rgba(255, 255, 255, 0.85);
    }
    
    .clay-button {
      border-radius: 16px;
      background: rgb(248, 211, 71);
      box-shadow: 
        0 4px 10px rgba(0, 0, 0, 0.1),
        0 1px 4px rgba(0, 0, 0, 0.08),
        inset 0 1px 1px rgba(255, 255, 255, 0.4);
      transition: all 0.2s ease;
      border: 1px solid rgba(248, 211, 71, 0.8);
      font-weight: bold;
      padding: 12px 24px;
    }
    
    .clay-button:hover {
      box-shadow: 
        0 6px 14px rgba(0, 0, 0, 0.12),
        0 2px 6px rgba(0, 0, 0, 0.1),
        inset 0 1px 1px rgba(255, 255, 255, 0.5);
      transform: translateY(-1px);
      background: rgb(250, 217, 95);
    }
    
    .clay-radio-item {
      background: rgba(255, 255, 255, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.8);
      border-radius: 16px;
      padding: 16px;
      transition: all 0.2s ease;
      box-shadow: 
        0 2px 8px rgba(0, 0, 0, 0.06),
        inset 0 1px 1px rgba(255, 255, 255, 0.7);
    }
    
    .clay-radio-item:hover {
      background: rgba(255, 255, 255, 0.85);
      box-shadow: 
        0 4px 12px rgba(0, 0, 0, 0.08),
        inset 0 1px 1px rgba(255, 255, 255, 0.8);
    }
    
    .clay-container {
      background-color: #FFFBEB; /* Updated to match dawg-light from tailwind */
      min-height: 100vh;
      padding: 2rem 1rem;
      overscroll-behavior: contain; /* Prevent pull-to-refresh and overscroll */
      touch-action: pan-y; /* Allow vertical scrolling only */
    }
    
    @media (max-width: 768px) {
      .mobile-safe-area {
        overscroll-behavior: contain;
        touch-action: pan-y;
        height: 100%;
        width: 100%;
      }
    }
  `;
  document.head.appendChild(style);
};

const PresaleApplication = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [existingApplication, setExistingApplication] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus>(null);
  const [checkingApplication, setCheckingApplication] = useState(false);
  const [formData, setFormData] = useState({
    reason: '',
    contribution: '',
    size: 'Dawg' as InvestmentSize,
    walletAddress: '',
  });
  const [copied, setCopied] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const isMobile = useIsMobile();
  
  const [authCheckTimedOut, setAuthCheckTimedOut] = useState(false);
  const [appCheckTimedOut, setAppCheckTimedOut] = useState(false);

  useEffect(() => {
    addClayStyles();
    
    const preventDefaultTouchMove = (e) => {
      if (Math.abs(e.touches[0].clientX - e.touches[0].initialClientX) > 10) {
        e.preventDefault();
      }
    };

    if (isMobile) {
      document.addEventListener('touchmove', preventDefaultTouchMove, { passive: false });
    }
    
    return () => {
      if (isMobile) {
        document.removeEventListener('touchmove', preventDefaultTouchMove);
      }
    };
  }, [isMobile]);

  const debugAuthFlow = (message, data = null) => {
    console.log(`[Auth Debug] ${message}`, data || '');
  };

  const checkExistingApplication = async (userId) => {
    try {
      setCheckingApplication(true);
      setAppCheckTimedOut(false);
      
      const appCheckTimeout = setTimeout(() => {
        debugAuthFlow('Application check timed out after 3 seconds');
        setAppCheckTimedOut(true);
        setCheckingApplication(false);
      }, 3000);
      
      const { data, error } = await supabase
        .from('presale_applications')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      clearTimeout(appCheckTimeout);
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error checking application:', error);
        return;
      }
      
      if (data) {
        console.log('Found existing application:', data);
        setExistingApplication(data);
        setApplicationStatus(data.status as ApplicationStatus);
      }
    } catch (error) {
      console.error('Error in checkExistingApplication:', error);
    } finally {
      setCheckingApplication(false);
    }
  };

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

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const error = queryParams.get('error');
    const errorDescription = queryParams.get('error_description');
    
    debugAuthFlow('Page loaded with query params', location.search);
    
    if (error) {
      console.error('Auth redirect error:', error, errorDescription);
      setAuthError(`${error}: ${errorDescription || 'Unknown error'}`);
      toast.error(`Authentication error: ${errorDescription || error}`);
    }
    
    addClayStyles();
    
    const checkUser = async () => {
      setIsCheckingAuth(true);
      setAuthCheckTimedOut(false);
      
      const authCheckTimeout = setTimeout(() => {
        debugAuthFlow('Session check timed out after 3 seconds, forcing completion');
        setAuthCheckTimedOut(true);
        setIsCheckingAuth(false);
      }, 3000);
      
      try {
        debugAuthFlow('Checking user session');
        const { data, error } = await supabase.auth.getSession();
        
        clearTimeout(authCheckTimeout);
        
        if (error) {
          console.error('Session error:', error);
          setAuthError(`Session error: ${error.message}`);
          navigate('/presale');
          return;
        }
        
        if (data.session) {
          debugAuthFlow('User authenticated', data.session.user.id);
          setIsAuthenticated(true);
          setUserInfo(data.session.user);
          
          await checkExistingApplication(data.session.user.id);
        } else {
          debugAuthFlow('No active session found, redirecting to /presale');
          toast.error('Please connect with X first');
          navigate('/presale');
          return;
        }
      } catch (error) {
        console.error('Error checking user session:', error);
        setAuthError(`Error checking session: ${error.message}`);
        navigate('/presale');
      } finally {
        clearTimeout(authCheckTimeout);
        setIsCheckingAuth(false);
      }
    };
    
    checkUser();
    
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
        navigate('/presale');
      }
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [location, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSizeChange = (value: InvestmentSize) => {
    setFormData(prev => ({ ...prev, size: value }));
  };

  const handleConnectX = async () => {
    setLoading(true);
    setAuthError(null);
    
    try {
      debugAuthFlow('Initiating Twitter auth');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'twitter',
        options: {
          redirectTo: window.location.origin + '/presale-application'
        }
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
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please connect with X first');
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('presale_applications')
        .select('id')
        .eq('user_id', userInfo.id)
        .single();
      
      if (data) {
        toast.error('You have already submitted an application');
        await checkExistingApplication(userInfo.id);
        return;
      }
    } catch (error) {
      console.error('Error checking for existing application:', error);
    }
    
    setLoading(true);
    
    const getAmountFromSize = (size: InvestmentSize) => {
      switch (size) {
        case 'Smol Dawg': return 10;
        case 'Dawg': return 25;
        case 'Big Dawg': return 40;
        default: return 25;
      }
    };

    try {
      console.log('Submitting application with data:', {
        user_id: userInfo.id,
        reason: formData.reason,
        contribution: formData.contribution,
        size: formData.size,
        amount: getAmountFromSize(formData.size),
        wallet_address: formData.walletAddress,
        twitter_username: userInfo.user_metadata?.preferred_username || '',
      });
      
      const { error } = await supabase
        .from('presale_applications')
        .insert([{ 
          user_id: userInfo.id,
          reason: formData.reason,
          contribution: formData.contribution,
          size: formData.size,
          amount: getAmountFromSize(formData.size),
          wallet_address: formData.walletAddress,
          twitter_username: userInfo.user_metadata?.preferred_username || '',
          join_beta: false,
          beta_reason: null
        }]);
      
      if (error) {
        throw error;
      }
      
      toast.success('Application submitted successfully!');
      
      await checkExistingApplication(userInfo.id);
      
      setTimeout(() => navigate('/presale'), 2000);
    } catch (error) {
      toast.error('Failed to submit application: ' + error.message);
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };

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
      <div className={`clay-card p-8 ${status.bgColor} mb-6`}>
        <h2 className={`text-2xl font-bold mb-3 ${status.textColor} text-center`}>{status.title}</h2>
        <p className="mb-4 text-center">{status.description}</p>
        <div className="flex flex-col space-y-4">
          {existingApplication && (
            <>
              {applicationStatus === 'pending' && (
                <div className="flex flex-col items-center justify-center py-6">
                  <img 
                    src="/lovable-uploads/2c0ff9de-72c1-4acf-ac6d-3e4ef34504ae.png" 
                    alt="DAWG review in progress" 
                    className="max-w-full h-auto rounded-lg mb-4 max-h-96 object-contain"
                    loading="eager" 
                    width="700"
                    height="400"
                  />
                  <p className="text-center mt-4 text-gray-600">
                    The DAWG team is reviewing your application carefully.
                  </p>
                </div>
              )}
              
              {applicationStatus === 'approved' && (
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
              
              {applicationStatus === 'rejected' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <p className="font-semibold">Why you want to join the DAWG presale:</p>
                    <p className="clay-card bg-white p-3 rounded">{existingApplication.reason}</p>
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <p className="font-semibold">How you plan to contribute:</p>
                    <p className="clay-card bg-white p-3 rounded">{existingApplication.contribution}</p>
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
                </div>
              )}
              
              {applicationStatus === 'approved' && (
                <div className="space-y-3 md:col-span-2 mt-4 p-4 clay-card bg-green-50 rounded-md">
                  <h3 className="text-lg font-bold text-green-800">Payment Instructions</h3>
                  <p className="font-medium">Please send <span className="font-bold">{existingApplication.amount} AVAX</span> to this wallet address:</p>
                  <div 
                    className="font-mono text-sm clay-input bg-white p-3 break-all flex items-center justify-between gap-2 cursor-pointer hover:bg-gray-50"
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
            </>
          )}
          <div className="pt-4">
            <Button 
              onClick={() => navigate('/presale')}
              className="clay-button"
            >
              Return to Presale Page
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => (
    <>
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-black text-dawg-dark mb-4">Presale Application</h1>
        <p className="text-lg text-gray-600">
          Complete your details to participate in the DAWG presale
        </p>
      </div>
      
      {authError && (
        <div className="p-4 mb-6 clay-card bg-red-50 text-red-700">
          <h3 className="font-bold">Authentication Error:</h3>
          <p className="break-words">{authError}</p>
        </div>
      )}
      
      {!isAuthenticated ? (
        <div className="text-center clay-card p-8 flex flex-col items-center">
          <p className="mb-6 text-lg">Connect with X (Twitter) to access the application form</p>
          <Button 
            onClick={handleConnectX}
            disabled={loading}
            className="py-6 text-lg clay-button flex items-center justify-center gap-2 max-w-md"
          >
            {loading ? 'Connecting...' : 'Connect with X'}
          </Button>
        </div>
      ) : checkingApplication && !appCheckTimedOut ? (
        <div className="text-center clay-card p-8 flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-dawg mb-4" />
          <p>Checking application status...</p>
        </div>
      ) : existingApplication ? (
        <ApplicationStatusDisplay />
      ) : (
        <div className="space-y-6">
          <div className="clay-card p-4 bg-dawg/10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
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
                disabled={loading}
                className="clay-button bg-white mt-2 md:mt-0"
              >
                Disconnect
              </Button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8 clay-card p-6">
            <div>
              <label htmlFor="reason" className="block mb-2 font-medium text-lg">Why do you want to join the DAWG presale?</label>
              <Textarea
                id="reason"
                name="reason"
                required
                value={formData.reason}
                onChange={handleChange}
                placeholder="Share your reasons for joining the DAWG community..."
                className="clay-input h-32 w-full"
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
                className="clay-input h-32 w-full"
              />
            </div>
            
            <div>
              <label className="block mb-2 font-medium text-lg">Choose your size</label>
              <RadioGroup value={formData.size} onValueChange={handleSizeChange} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2 clay-radio-item hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="Smol Dawg" id="size-small" />
                  <Label htmlFor="size-small" className="font-medium cursor-pointer flex-1">
                    Smol Dawg <span className="block text-sm text-gray-500 mt-1">10 AVAX</span>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 clay-radio-item hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="Dawg" id="size-medium" />
                  <Label htmlFor="size-medium" className="font-medium cursor-pointer flex-1">
                    Dawg <span className="block text-sm text-gray-500 mt-1">25 AVAX</span>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 clay-radio-item hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="Big Dawg" id="size-large" />
                  <Label htmlFor="size-large" className="font-medium cursor-pointer flex-1">
                    Big Dawg <span className="block text-sm text-gray-500 mt-1">40 AVAX</span>
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
                className="clay-input font-mono w-full"
              />
              <p className="text-sm text-gray-500 mt-1">
                Please ensure this is an AVAX C-Chain compatible address
              </p>
            </div>
            
            <Button 
              type="submit"
              disabled={loading}
              className="w-full py-6 text-lg clay-button"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </Button>
          </form>
        </div>
      )}
    </>
  );

  if (isCheckingAuth && !authCheckTimedOut) {
    return (
      <div className="clay-container mobile-safe-area bg-dawg-light">
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center clay-card p-8">
            <Loader2 className="h-8 w-8 animate-spin text-dawg mx-auto mb-4" />
            <p className="text-lg">Verifying authentication...</p>
          </div>
        </div>
      </div>
    );
  }

  if (authCheckTimedOut) {
    return (
      <div className="clay-container mobile-safe-area bg-dawg-light">
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center clay-card p-8 max-w-md">
            <h2 className="text-xl font-bold mb-4">Authentication Check Timed Out</h2>
            <p className="mb-4">There was a problem verifying your authentication status. Please try again.</p>
            <div className="flex flex-col gap-3">
              <Button 
                onClick={() => navigate('/presale')}
                className="clay-button"
              >
                Go to presale page
              </Button>
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
                className="clay-button bg-white"
              >
                Refresh page
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="clay-container mobile-safe-area bg-dawg-light">
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center clay-card p-8">
            <p className="text-lg mb-4">Please connect with X to view your application</p>
            <Button 
              onClick={() => navigate('/presale')}
              className="clay-button"
            >
              Go to presale page
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="clay-container mobile-safe-area bg-dawg-light">
      <Header />
      <div className="min-h-screen px-4 md:px-8 py-12 max-w-3xl mx-auto">
        {isMobile ? (
          <ScrollArea className="h-full w-full px-1">
            {renderContent()}
          </ScrollArea>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
};

export default PresaleApplication;
