
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { TrophyIcon, TrendingUpIcon, AlertTriangleIcon } from 'lucide-react';

type TweetPoints = {
  id: string;
  twitter_username: string;
  points: number;
  total_tweets: number;
  created_at: string;
  updated_at: string;
};

const LeaderboardTable = () => {
  const fetchLeaderboard = async () => {
    // Call our edge function to get the leaderboard with a URL parameter instead of a body
    const { data, error } = await supabase.functions.invoke('fetch-tweets', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Using query parameters instead of body for GET request
      queryParams: { action: 'leaderboard' }
    });
    
    if (error) throw new Error(error.message);
    return data.leaderboard as TweetPoints[];
  };

  const { 
    data: leaderboard, 
    isLoading, 
    isError,
    error
  } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: fetchLeaderboard,
    refetchInterval: 60000, // Refresh every minute
  });

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-pulse flex space-x-4">
          <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 flex flex-col items-center text-red-500">
        <AlertTriangleIcon className="h-12 w-12 mb-2" />
        <h3 className="text-lg font-semibold">Error loading leaderboard</h3>
        <p>{error?.message || 'Unknown error occurred'}</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-lg border bg-background shadow">
      <div className="p-4 flex items-center border-b">
        <TrophyIcon className="mr-2 h-5 w-5 text-yellow-500" />
        <h3 className="text-lg font-semibold">$DAWG Tweet Leaderboard</h3>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Rank</TableHead>
            <TableHead>Username</TableHead>
            <TableHead className="text-right">Tweets</TableHead>
            <TableHead className="text-right">Points</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaderboard && leaderboard.length > 0 ? (
            leaderboard.map((entry, index) => (
              <TableRow key={entry.id}>
                <TableCell className="font-medium">
                  {index === 0 ? (
                    <span className="flex items-center justify-center w-6 h-6 bg-yellow-100 text-yellow-800 rounded-full">1</span>
                  ) : index === 1 ? (
                    <span className="flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-800 rounded-full">2</span>
                  ) : index === 2 ? (
                    <span className="flex items-center justify-center w-6 h-6 bg-amber-100 text-amber-800 rounded-full">3</span>
                  ) : (
                    <span className="text-center">{index + 1}</span>
                  )}
                </TableCell>
                <TableCell>
                  <a 
                    href={`https://twitter.com/${entry.twitter_username}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    @{entry.twitter_username}
                  </a>
                </TableCell>
                <TableCell className="text-right">{entry.total_tweets}</TableCell>
                <TableCell className="text-right font-semibold flex items-center justify-end">
                  {entry.points}
                  <TrendingUpIcon className="ml-1 h-4 w-4 text-green-500" />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                No tweet activity yet. Be the first to tweet about $DAWG!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeaderboardTable;
