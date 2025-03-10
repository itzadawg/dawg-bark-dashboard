
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Tweet {
  id: string;
  text: string;
  created_at: string;
  author: {
    name: string;
    username: string;
    profile_image_url: string;
  };
  public_metrics: {
    like_count: number;
    reply_count: number;
    retweet_count: number;
  };
}

export const TweetFeed = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('fetch-tweets');
        
        if (error) throw error;
        
        if (data?.data) {
          const formattedTweets = data.data.map((tweet: any) => ({
            id: tweet.id,
            text: tweet.text,
            created_at: tweet.created_at,
            author: {
              name: data.includes.users.find((u: any) => u.id === tweet.author_id)?.name || 'Unknown',
              username: data.includes.users.find((u: any) => u.id === tweet.author_id)?.username || 'unknown',
              profile_image_url: data.includes.users.find((u: any) => u.id === tweet.author_id)?.profile_image_url || '',
            },
            public_metrics: tweet.public_metrics || {
              like_count: 0,
              reply_count: 0,
              retweet_count: 0,
            },
          }));
          setTweets(formattedTweets);
        }
      } catch (error) {
        console.error('Error fetching tweets:', error);
        toast({
          title: "Error",
          description: "Failed to fetch tweets. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
    const interval = setInterval(fetchTweets, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-dawg" />
      </div>
    );
  }

  if (tweets.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        No tweets found mentioning $Dawg or @itzadawg
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tweets.map((tweet) => (
        <div key={tweet.id} className="neo-brutal-box p-4">
          <div className="flex items-start gap-3">
            <img 
              src={tweet.author.profile_image_url} 
              alt={tweet.author.name} 
              className="w-12 h-12 rounded-full neo-brutal-border"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold">{tweet.author.name}</span>
                <span className="text-gray-500">@{tweet.author.username}</span>
                <span className="text-gray-500 text-sm">
                  {new Date(tweet.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-2 whitespace-pre-wrap">{tweet.text}</p>
              <div className="flex gap-6 mt-3 text-sm text-gray-500">
                <span>{tweet.public_metrics.reply_count} replies</span>
                <span>{tweet.public_metrics.retweet_count} retweets</span>
                <span>{tweet.public_metrics.like_count} likes</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
