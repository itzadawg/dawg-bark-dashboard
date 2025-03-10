
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/dashboard/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Twitter } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const PresaleApplication = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    telegram: '',
    amount: '',
    reason: ''
  });

  // Check if user is authenticated with Twitter
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setIsAuthenticated(true);
        setUserInfo(data.session.user);
        
        // Pre-fill email if available
        if (data.session.user?.email) {
          setFormData(prev => ({ ...prev, email: data.session.user.email }));
        }
      }
    };
    
    checkUser();
    
    // Handle auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      if (event === 'SIGNED_IN' && session) {
        setIsAuthenticated(true);
        setUserInfo(session.user);
        
        // Pre-fill email if available
        if (session.user?.email) {
          setFormData(prev => ({ ...prev, email: session.user.email }));
        }
        
        toast.success('Successfully connected with X');
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setUserInfo(null);
      }
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleConnectX = async () => {
    setLoading(true);
    
    try {
      // Get the current domain to use for the redirect URL
      const redirectUrl = window.location.origin + '/presale-application';
      console.log('Redirect URL:', redirectUrl); // For debugging
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'twitter',
        options: {
          redirectTo: redirectUrl,
          // Make sure we're explicitly setting a scopes parameter
          scopes: 'tweet.read users.read',
        },
      });

      if (error) {
        toast.error('Failed to connect X account: ' + error.message);
        console.error('X auth error details:', error);
      }
    } catch (error) {
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
    
    setLoading(true);
    
    try {
      // Submit application to Supabase
      const { error } = await supabase
        .from('presale_applications')
        .insert(
          { 
            user_id: userInfo.id,
            email: formData.email,
            telegram: formData.telegram,
            amount: Number(formData.amount), // Convert string to number
            reason: formData.reason,
            twitter_username: userInfo.user_metadata?.preferred_username || ''
          }
        );
      
      if (error) {
        throw error;
      }
      
      toast.success('Application submitted successfully!');
      setTimeout(() => navigate('/presale'), 2000);
    } catch (error) {
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
        
        {!isAuthenticated ? (
          <div className="text-center neo-brutal-border p-8 flex flex-col items-center">
            <p className="mb-6 text-lg">Connect with X (Twitter) to access the application form</p>
            <Button 
              onClick={handleConnectX}
              disabled={loading}
              className="py-6 text-lg neo-brutal-border bg-dawg hover:bg-dawg-secondary flex items-center justify-center gap-2 max-w-md"
            >
              {loading ? 'Connecting...' : 'Connect with X'}
              <Twitter className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="neo-brutal-border p-4 flex items-center justify-between bg-dawg/10">
              <div className="flex items-center gap-2">
                <Twitter className="h-5 w-5" />
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
