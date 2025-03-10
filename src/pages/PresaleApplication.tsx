
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/dashboard/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const PresaleApplication = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [debugLogs, setDebugLogs] = useState([]);
  const [formData, setFormData] = useState({
    email: '',
    telegram: '',
    amount: '',
    reason: ''
  });

  // Enhanced debug function for better troubleshooting
  const debugAuthFlow = (message, data = null) => {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} - ${message}`;
    console.log(`[Auth Debug] ${logMessage}`, data || '');
    setDebugLogs(prev => [...prev, { time: timestamp, message, data: data ? JSON.stringify(data) : '' }]);
  };

  useEffect(() => {
    // Check if we have an error in the URL (from OAuth redirect)
    const queryParams = new URLSearchParams(location.search);
    debugAuthFlow('URL Query Parameters', Object.fromEntries(queryParams.entries()));
    
    const error = queryParams.get('error');
    const errorDescription = queryParams.get('error_description');
    
    if (error) {
      const errorMsg = `${error}: ${errorDescription || 'Unknown error'}`;
      debugAuthFlow('Auth redirect error detected', errorMsg);
      setAuthError(errorMsg);
      toast.error(`Authentication error: ${errorDescription || error}`);
    }
    
    const checkUser = async () => {
      try {
        debugAuthFlow('Checking user session');
        const { data, error } = await supabase.auth.getSession();
        debugAuthFlow('Session data received', data);
        
        if (error) {
          debugAuthFlow('Session error', error);
          setAuthError(`Session error: ${error.message}`);
          return;
        }
        
        if (data.session) {
          debugAuthFlow('Active session found', {
            userId: data.session.user.id,
            provider: data.session.user.app_metadata?.provider
          });
          setIsAuthenticated(true);
          setUserInfo(data.session.user);
          
          if (data.session.user?.email) {
            setFormData(prev => ({ ...prev, email: data.session.user.email }));
          }
        } else {
          debugAuthFlow('No active session found');
        }
      } catch (error) {
        debugAuthFlow('Error checking session', error);
        setAuthError(`Error checking session: ${error.message}`);
      }
    };
    
    checkUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      debugAuthFlow('Auth state changed', { 
        event, 
        userId: session?.user?.id,
        provider: session?.user?.app_metadata?.provider 
      });
      
      if (event === 'SIGNED_IN' && session) {
        debugAuthFlow('Sign in successful', {
          userId: session.user.id,
          metadata: session.user.user_metadata
        });
        setIsAuthenticated(true);
        setUserInfo(session.user);
        
        if (session.user?.email) {
          setFormData(prev => ({ ...prev, email: session.user.email }));
        }
        
        toast.success('Successfully connected with X');
      } else if (event === 'SIGNED_OUT') {
        debugAuthFlow('User signed out');
        setIsAuthenticated(false);
        setUserInfo(null);
      }
    });
    
    return () => {
      debugAuthFlow('Cleaning up auth listener');
      authListener?.subscription.unsubscribe();
    };
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleConnectX = async () => {
    setLoading(true);
    setAuthError(null);
    
    try {
      // Get the absolute URL for redirect - using window.location.origin to ensure proper domain
      const origin = window.location.origin;
      const path = '/presale-application';
      const redirectUrl = `${origin}${path}`;
      
      debugAuthFlow('Initiating Twitter auth', {
        redirectUrl,
        windowLocation: window.location.href,
        origin: window.location.origin
      });
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'twitter',
        options: {
          redirectTo: redirectUrl,
          scopes: 'tweet.read users.read',
        },
      });

      if (error) {
        debugAuthFlow('Twitter auth error', error);
        setAuthError(`Twitter auth error: ${error.message}`);
        toast.error('Failed to connect X account: ' + error.message);
        console.error('X auth error details:', error);
      } else {
        debugAuthFlow('Auth initiated successfully', {
          provider: 'twitter',
          url: data?.url
        });
        // The user will be redirected to Twitter for authentication
      }
    } catch (error) {
      debugAuthFlow('Unexpected error during auth', error);
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
      debugAuthFlow('Signing out user');
      await supabase.auth.signOut();
      debugAuthFlow('User signed out successfully');
      toast.success('Signed out successfully');
    } catch (error) {
      debugAuthFlow('Sign out error', error);
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
    
    setLoading(true);
    
    try {
      debugAuthFlow('Submitting application', {
        userId: userInfo?.id,
        email: formData.email,
        telegram: formData.telegram
      });
      
      const { error } = await supabase
        .from('presale_applications')
        .insert(
          { 
            user_id: userInfo.id,
            email: formData.email,
            telegram: formData.telegram,
            amount: Number(formData.amount),
            reason: formData.reason,
            twitter_username: userInfo.user_metadata?.preferred_username || ''
          }
        );
      
      if (error) {
        debugAuthFlow('Application submission error', error);
        throw error;
      }
      
      debugAuthFlow('Application submitted successfully');
      toast.success('Application submitted successfully!');
      setTimeout(() => navigate('/presale'), 2000);
    } catch (error) {
      debugAuthFlow('Submit error', error);
      toast.error('Failed to submit application: ' + error.message);
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
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
        
        {/* Authentication Error Display */}
        {authError && (
          <div className="p-4 mb-6 neo-brutal-border bg-red-50 text-red-700">
            <h3 className="font-bold">Authentication Error:</h3>
            <p className="break-words">{authError}</p>
          </div>
        )}
        
        {/* Debug Logs Display */}
        {debugLogs.length > 0 && (
          <div className="p-4 mb-6 neo-brutal-border bg-gray-50 text-gray-700 overflow-auto max-h-60">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold">Debug Logs:</h3>
              <button 
                onClick={() => setDebugLogs([])}
                className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
              >
                Clear
              </button>
            </div>
            <div className="text-xs font-mono">
              {debugLogs.map((log, idx) => (
                <div key={idx} className="mb-1 border-b border-gray-200 pb-1">
                  <div><span className="opacity-70">{log.time}</span> - {log.message}</div>
                  {log.data && <div className="text-blue-600 pl-4 break-words">{log.data}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {!isAuthenticated ? (
          <div className="text-center neo-brutal-border p-8 flex flex-col items-center">
            <div className="mb-4 text-lg">
              <p className="mb-1">Current URL: <span className="font-mono text-xs">{window.location.href}</span></p>
              <p className="mb-1">Origin: <span className="font-mono text-xs">{window.location.origin}</span></p>
              <p className="mb-6">Redirect Path: <span className="font-mono text-xs">/presale-application</span></p>
            </div>
            <p className="mb-6 text-lg">Connect with X (Twitter) to access the application form</p>
            <Button 
              onClick={handleConnectX}
              disabled={loading}
              className="py-6 text-lg neo-brutal-border bg-dawg hover:bg-dawg-secondary flex items-center justify-center gap-2 max-w-md"
            >
              {loading ? 'Connecting...' : 'Connect with X'}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="neo-brutal-border p-4 flex items-center justify-between bg-dawg/10">
              <div className="flex items-center gap-2">
                <span>Connected as: @{userInfo?.user_metadata?.preferred_username || 'user'}</span>
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
            
            <form onSubmit={handleSubmit} className="space-y-6 neo-brutal-border p-6">
              <div>
                <label htmlFor="email" className="block mb-2 font-medium">Email Address</label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="neo-brutal-border"
                />
              </div>
              
              <div>
                <label htmlFor="telegram" className="block mb-2 font-medium">Telegram Username</label>
                <Input
                  id="telegram"
                  name="telegram"
                  required
                  value={formData.telegram}
                  onChange={handleChange}
                  placeholder="@username"
                  className="neo-brutal-border"
                />
              </div>
              
              <div>
                <label htmlFor="amount" className="block mb-2 font-medium">Amount you want to invest (USD)</label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  required
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="500"
                  className="neo-brutal-border"
                />
              </div>
              
              <div>
                <label htmlFor="reason" className="block mb-2 font-medium">Why do you want to join the DAWG presale?</label>
                <Textarea
                  id="reason"
                  name="reason"
                  required
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Tell us why you're excited about DAWG..."
                  className="neo-brutal-border h-32"
                />
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
