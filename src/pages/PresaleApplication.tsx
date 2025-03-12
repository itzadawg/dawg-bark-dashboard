import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/dashboard/Header';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

type ApplicationStatus = 'pending' | 'approved' | 'rejected' | null;

type InvestmentSize = 'Smol Dawg' | 'Dawg' | 'Big Dawg';

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
    walletAddress: ''
  });

  const debugAuthFlow = (message, data = null) => {
    console.log(`[Auth Debug] ${message}`, data || '');
  };

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
      }
    } catch (error) {
      console.error('Error in checkExistingApplication:', error);
    } finally {
      setCheckingApplication(false);
    }
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
    
    const checkUser = async () => {
      try {
        debugAuthFlow('Checking user session');
        const { data, error } = await supabase.auth.getSession();
        console.log('Session data:', data);
        
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
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
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
      }
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [location]);

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
      <div className={`neo-brutal-border p-8 ${status.bgColor} ${status.borderColor} mb-6`}>
        <h2 className={`text-2xl font-bold mb-3 ${status.textColor}`}>{status.title}</h2>
        <p className="mb-4">{status.description}</p>
        <div className="flex flex-col space-y-4">
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
                <p className="font-mono">{formatWalletAddress(existingApplication.wallet_address)}</p>
              </div>
              
              {applicationStatus === 'approved' && (
                <div className="space-y-3 md:col-span-2 mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                  <h3 className="text-lg font-bold text-green-800">Payment Instructions</h3>
                  <p className="font-medium">Please send <span className="font-bold">{existingApplication.amount} AVAX</span> to this wallet address:</p>
                  <p className="font-mono text-sm bg-white p-3 rounded border border-green-200 break-all">0x829b054cf1a5A791aEaE52f509A8D0eF93416b63</p>
                  <p className="text-sm text-green-700 mt-2">Once your payment is confirmed, your allocation will be secured.</p>
                </div>
              )}
            </div>
          )}
          <div className="pt-4">
            <Button 
              onClick={() => navigate('/presale')}
              className="neo-brutal-border bg-dawg hover:bg-dawg-secondary"
            >
              Return to Presale Page
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className="min-h-screen px-4 md:px-8 py-12 max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-black text-dawg-dark mb-4">Presale Application</h1>
          <p className="text-lg text-gray-600">
            Complete your details to participate in the DAWG presale
          </p>
        </div>
        
        {authError && (
          <div className="p-4 mb-6 neo-brutal-border bg-red-50 text-red-700">
            <h3 className="font-bold">Authentication Error:</h3>
            <p className="break-words">{authError}</p>
          </div>
        )}
        
        {!isAuthenticated ? (
          <div className="text-center neo-brutal-border p-8 flex flex-col items-center">
            <p className="mb-6 text-lg">Connect with X (Twitter) to access the application form</p>
            <Button 
              onClick={handleConnectX}
              disabled={loading}
              className="py-6 text-lg neo-brutal-border bg-dawg hover:bg-dawg-secondary flex items-center justify-center gap-2 max-w-md"
            >
              {loading ? 'Connecting...' : 'Connect with X'}
            </Button>
          </div>
        ) : checkingApplication ? (
          <div className="text-center neo-brutal-border p-8 flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-dawg mb-4" />
            <p>Checking application status...</p>
          </div>
        ) : existingApplication ? (
          <ApplicationStatusDisplay />
        ) : (
          <div className="space-y-6">
            <div className="neo-brutal-border p-4 flex items-center justify-between bg-dawg/10">
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
                disabled={loading}
                className="neo-brutal-border bg-white"
              >
                Disconnect
              </Button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8 neo-brutal-border p-6">
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
                disabled={loading}
                className="w-full py-6 text-lg neo-brutal-border bg-dawg hover:bg-dawg-secondary"
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </Button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default PresaleApplication;
