
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/dashboard/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Twitter } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://pibsyclrftbwwkkgztek.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpYnN5Y2xyZnRid3dra2d6dGVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1OTU2NjgsImV4cCI6MjA1NzE3MTY2OH0.iqkvsiGNLojybh4Jhje9khmNRgksu3p_0FBGDkAeREM';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const PresaleApplication = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
      if (data.session?.provider_token) {
        setIsAuthenticated(true);
      }
    };
    
    checkUser();
    
    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.provider_token) {
        setIsAuthenticated(true);
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
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'twitter',
        options: {
          redirectTo: window.location.origin + '/presale-application',
        },
      });

      if (error) {
        toast.error('Failed to connect X account: ' + error.message);
        setLoading(false);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('X authentication error:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    
    try {
      // Here you would submit the form data to your database
      // For now, we'll just show a success message
      toast.success('Application submitted successfully!');
      setTimeout(() => navigate('/presale'), 2000);
    } catch (error) {
      toast.error('Failed to submit application');
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
        )}
      </div>
    </>
  );
};

export default PresaleApplication;
