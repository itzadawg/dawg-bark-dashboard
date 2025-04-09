
import React, { ReactNode, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { Loader2, AlertTriangle, User, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';

interface AdminProtectedProps {
  children: ReactNode;
}

// Define the form schema
const formSchema = z.object({
  email: z.string().email("Must be a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export const AdminProtected: React.FC<AdminProtectedProps> = ({ children }) => {
  const { isAdmin, isLoading, userEmail, error, checkAdminStatus } = useAdmin();
  const navigate = useNavigate();
  const [authInProgress, setAuthInProgress] = useState(false);
  
  // Define the form with validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setAuthInProgress(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Login successful");
      await checkAdminStatus();
    } catch (error: any) {
      toast.error(error.message || "Invalid email or password");
    } finally {
      setAuthInProgress(false);
    }
  };

  // Log out function
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.info("Logged out successfully");
      await checkAdminStatus();
    } catch (error: any) {
      toast.error(error.message || "Error logging out");
    }
  };

  // Render login form
  const renderLoginForm = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="admin@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full rounded-xl bg-dawg border-2 border-dawg-dark shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] transform hover:translate-y-[-2px] transition-all duration-200"
          disabled={authInProgress}
        >
          {authInProgress ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <User className="h-4 w-4 mr-2" />}
          {authInProgress ? 'Logging in...' : 'Log in'}
        </Button>
      </form>
    </Form>
  );

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen p-4">
        <div className="bg-white rounded-2xl border-2 border-dawg-dark p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] max-w-md w-full">
          <Loader2 className="h-12 w-12 animate-spin text-dawg mb-4 mx-auto" />
          <h2 className="text-xl font-bold mb-2 text-center">Checking Admin Status</h2>
          <p className="text-gray-600 text-center mb-6">This should only take a moment...</p>
          
          <div className="flex flex-col items-center gap-4">
            <Button 
              onClick={checkAdminStatus} 
              variant="outline"
              className="rounded-xl border-2 border-gray-300 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] transform hover:translate-y-[-2px] transition-all duration-200"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
            
            <Link 
              to="/" 
              className="text-sm text-gray-500 hover:underline mt-2"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen p-4">
        <div className="bg-white rounded-2xl border-2 border-dawg-dark p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] max-w-md w-full">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4 mx-auto" />
          <h2 className="text-xl font-bold mb-2 text-center">Authentication Error</h2>
          <p className="text-center max-w-md mb-6 text-gray-600">{error}</p>
          
          <div className="flex flex-col items-center gap-4">
            <Button 
              onClick={checkAdminStatus} 
              variant="outline"
              className="rounded-xl border-2 border-gray-300 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] transform hover:translate-y-[-2px] transition-all duration-200"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            
            <Link 
              to="/" 
              className="text-sm text-gray-500 hover:underline mt-2"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div>
        <div className="fixed top-4 right-4 z-50">
          <Button 
            onClick={handleLogout} 
            className="bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] border-2 border-red-600 transform hover:translate-y-[-2px] transition-all duration-200"
          >
            Logout
          </Button>
        </div>
        {children}
      </div>
    );
  }

  // Not an admin - show login form
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="max-w-md w-full border-2 border-dawg-dark rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Admin Access</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access the admin dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          {renderLoginForm()}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link to="/" className="text-dawg hover:underline text-sm">
            Return to Home
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};
