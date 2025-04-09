
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, Medal } from 'lucide-react';

interface Score {
  id: string;
  player_name: string;
  score: number;
  created_at: string;
}

interface LeaderboardProps {
  currentScore: number;
}

// Type-safe fetch for scores since the auto-generated types haven't been updated yet
const fetchScores = async (): Promise<Score[]> => {
  const { data, error } = await supabase
    .from('dawg_pac_scores')
    .select('*')
    .order('score', { ascending: false })
    .limit(10);
    
  if (error) throw error;
  return (data as Score[]) || [];
};

const Leaderboard: React.FC<LeaderboardProps> = ({ currentScore }) => {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const getScores = async () => {
      try {
        setLoading(true);
        const data = await fetchScores();
        setScores(data);
      } catch (error) {
        console.error('Error fetching scores:', error);
      } finally {
        setLoading(false);
      }
    };
    
    getScores();
    
    // Set up realtime subscription
    const scoresSubscription = supabase
      .channel('scores-changes')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'dawg_pac_scores' 
        }, 
        () => getScores()
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(scoresSubscription);
    };
  }, []);
  
  // Check if current score would make the leaderboard
  const wouldBeOnLeaderboard = scores.length < 10 || currentScore > (scores[scores.length - 1]?.score || 0);
  
  return (
    <div className="p-2">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Top Scores</h2>
        <Trophy size={24} className="text-yellow-500" />
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-dawg"></div>
        </div>
      ) : scores.length > 0 ? (
        <div className="space-y-2">
          {scores.map((score, index) => (
            <div 
              key={score.id}
              className={`p-3 flex items-center justify-between neo-brutal-box ${
                index < 3 ? 'bg-yellow-50' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 text-center font-bold">
                  {index === 0 ? (
                    <Medal size={20} className="text-yellow-500" />
                  ) : index === 1 ? (
                    <Medal size={20} className="text-gray-400" />
                  ) : index === 2 ? (
                    <Medal size={20} className="text-amber-700" />
                  ) : (
                    `#${index + 1}`
                  )}
                </div>
                <span className="font-semibold">{score.player_name}</span>
              </div>
              <span className="font-bold">{score.score}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center py-8 text-gray-500">No scores yet. Be the first to play!</p>
      )}
      
      {currentScore > 0 && !loading && (
        <div className="mt-8 p-4 border-t border-gray-200">
          <p className="text-center">
            Your current score: <span className="font-bold">{currentScore}</span>
            {wouldBeOnLeaderboard && (
              <span className="block text-green-600 mt-2">
                This score could make the leaderboard!
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
