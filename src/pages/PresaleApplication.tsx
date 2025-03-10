
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/dashboard/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client - use the client from a central location to avoid duplicate warnings
const supabaseUrl = 'https://pibsyclrftbwwkkgztek.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpYnN5Y2xyZnRid3dra2d6dGVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1OTU2NjgsImV4cCI6MjA1NzE3MTY2OH0.iqkvsiGNLojybh4Jhje9khmNRgksu3p_0FBGDkAeREM';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const PresaleApplication = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    telegram: '',
    amount: '',
    reason: ''
  });

  useEffect(() => {
    // Check if user is authenticated
    const checkUser = async () => {
      try {
        // Log URL for debugging
        console.log('Application Page URL:', window.location.href);
        
        // Check for session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          toast.error('Authentication error: ' + error.message);
          setAuthChecked(true);
          setLoading(false);
          return;
        }
        
        if (!data.session) {
          console.log('No active session found, redirecting to presale page');
          toast.error('Please connect your X account first');
          navigate('/presale');
          return;
        }
        
        console.log('Session found:', data.session);
        setUser(data.session.user);
        
        // Pre-fill email if available
        if (data.session.user.email) {
          setFormData(prev => ({ ...prev, email: data.session.user.email }));
        }
        
      } catch (error) {
        console.error('Auth check error:', error);
        toast.error('An unexpected error occurred');
      } finally {
        setAuthChecked(true);
        setLoading(false);
      }
    };
    
    checkUser();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('User not authenticated');
      return;
    }
    
    try {
      setLoading(true);
      
      // Save application to Supabase
      const { error } = await supabase
        .from('presale_applications')
        .insert([
          { 
            user_id: user.id,
            x_username: user.user_metadata?.preferred_username || 'unknown',
            profile_image: user.user_metadata?.avatar_url,
            email: formData.email,
            telegram: formData.telegram,
            amount: formData.amount,
            reason: formData.reason
          }
        ]);
      
      if (error) throw error;
      
      toast.success('Application submitted successfully!');
      navigate('/presale');
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Error submitting application: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !authChecked) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse">Checking authentication...</div>
        </div>
      </>
    );
  }

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
        
        {user && (
          <div className="mb-8 flex items-center justify-center flex-col">
            <img 
              src={user.user_metadata?.avatar_url} 
              alt="Profile" 
              className="w-16 h-16 rounded-full neo-brutal-border"
            />
            <p className="mt-2 font-medium">@{user.user_metadata?.preferred_username}</p>
          </div>
        )}
        
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
    </>
  );
};

export default PresaleApplication;
