
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface GameOverScreenProps {
  score: number;
  onRestart: () => void;
  onMainMenu: () => void;
}

// Manually creating a typed client for the dawg_pac_scores table
// since the auto-generated types haven't been updated yet
const submitScore = async (playerName: string, score: number) => {
  return await supabase
    .from('dawg_pac_scores')
    .insert([{ player_name: playerName, score }], { 
      count: 'exact' 
    });
};

const GameOverScreen: React.FC<GameOverScreenProps> = ({ 
  score, 
  onRestart, 
  onMainMenu 
}) => {
  const [playerName, setPlayerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmitScore = async () => {
    if (!playerName.trim() || playerName.length > 12) {
      toast({
        title: "Error",
        description: "Please enter a valid name (max 12 characters)",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await submitScore(playerName.trim(), score);
      
      if (error) throw error;
      
      toast({
        title: "Score submitted!",
        description: `Your score of ${score} has been recorded.`
      });
      setIsSubmitted(true);
      
    } catch (error) {
      console.error('Error submitting score:', error);
      toast({
        title: "Failed to submit score",
        description: "Something went wrong. Try again?",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex-1 flex flex-col items-center justify-center neo-brutal-box p-8 bg-white">
      <h2 className="text-4xl font-bold text-dawg mb-4">Game Over!</h2>
      <p className="text-2xl mb-8">Your score: <span className="font-bold">{score}</span></p>
      
      {!isSubmitted ? (
        <div className="mb-8 w-full max-w-md">
          <h3 className="text-xl mb-4">Submit your score to the leaderboard</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name (max 12 chars)"
              className="flex-1 p-2 border border-black bg-white neo-brutal-input"
              maxLength={12}
              disabled={isSubmitting}
            />
            <Button 
              onClick={handleSubmitScore}
              disabled={isSubmitting || !playerName.trim()}
              className="neo-brutal-button bg-dawg text-white"
            >
              Submit
            </Button>
          </div>
        </div>
      ) : (
        <div className="mb-8">
          <p className="text-green-600 text-lg">Your score has been submitted!</p>
        </div>
      )}
      
      <div className="flex gap-4">
        <Button 
          onClick={onRestart} 
          className="neo-brutal-button bg-dawg text-white"
        >
          Play Again
        </Button>
        <Button 
          onClick={onMainMenu}
          variant="outline"
          className="neo-brutal-button"
        >
          Main Menu
        </Button>
      </div>
    </div>
  );
};

export default GameOverScreen;
