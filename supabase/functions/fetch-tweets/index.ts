import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createHmac } from "node:crypto";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

const API_KEY = Deno.env.get("TWITTER_CONSUMER_KEY")?.trim();
const API_SECRET = Deno.env.get("TWITTER_CONSUMER_SECRET")?.trim();
const ACCESS_TOKEN = Deno.env.get("TWITTER_ACCESS_TOKEN")?.trim();
const ACCESS_TOKEN_SECRET = Deno.env.get("TWITTER_ACCESS_TOKEN_SECRET")?.trim();
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")?.trim();
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")?.trim();
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")?.trim();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function validateEnvironmentVariables() {
  if (!API_KEY) {
    throw new Error("Missing TWITTER_CONSUMER_KEY environment variable");
  }
  if (!API_SECRET) {
    throw new Error("Missing TWITTER_CONSUMER_SECRET environment variable");
  }
  if (!ACCESS_TOKEN) {
    throw new Error("Missing TWITTER_ACCESS_TOKEN environment variable");
  }
  if (!ACCESS_TOKEN_SECRET) {
    throw new Error("Missing TWITTER_ACCESS_TOKEN_SECRET environment variable");
  }
  if (!SUPABASE_URL) {
    throw new Error("Missing SUPABASE_URL environment variable");
  }
  if (!SUPABASE_ANON_KEY) {
    throw new Error("Missing SUPABASE_ANON_KEY environment variable");
  }
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable");
  }
}

// Initialize Supabase client with service role key for database operations
const initSupabaseClient = () => {
  return createClient(
    SUPABASE_URL!,
    SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
      }
    }
  );
};

function generateOAuthSignature(
  method: string,
  url: string,
  params: Record<string, string>,
  consumerSecret: string,
  tokenSecret: string
): string {
  const signatureBaseString = `${method}&${encodeURIComponent(
    url
  )}&${encodeURIComponent(
    Object.entries(params)
      .sort()
      .map(([k, v]) => `${k}=${v}`)
      .join("&")
  )}`;
  const signingKey = `${encodeURIComponent(
    consumerSecret
  )}&${encodeURIComponent(tokenSecret)}`;
  const hmacSha1 = createHmac("sha1", signingKey);
  const signature = hmacSha1.update(signatureBaseString).digest("base64");

  console.log("Signature Base String:", signatureBaseString);
  console.log("Signing Key:", signingKey);
  console.log("Generated Signature:", signature);

  return signature;
}

function generateOAuthHeader(method: string, url: string, params: Record<string, string> = {}): string {
  const oauthParams = {
    oauth_consumer_key: API_KEY!,
    oauth_nonce: Math.random().toString(36).substring(2),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: ACCESS_TOKEN!,
    oauth_version: "1.0",
    ...params
  };

  const signature = generateOAuthSignature(
    method,
    url,
    oauthParams,
    API_SECRET!,
    ACCESS_TOKEN_SECRET!
  );

  const signedOAuthParams = {
    ...oauthParams,
    oauth_signature: signature,
  };

  return (
    "OAuth " +
    Object.entries(signedOAuthParams)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([k, v]) => `${encodeURIComponent(k)}="${encodeURIComponent(v)}"`)
      .join(", ")
  );
}

async function searchTweets(query: string, since_id?: string) {
  const baseUrl = "https://api.twitter.com/2/tweets/search/recent";
  let url = `${baseUrl}?query=${encodeURIComponent(query)}&tweet.fields=created_at,public_metrics&expansions=author_id&user.fields=name,username,profile_image_url`;
  
  if (since_id) {
    url += `&since_id=${since_id}`;
  }
  
  const method = "GET";

  const oauthHeader = generateOAuthHeader(method, baseUrl);
  console.log("OAuth Header for search:", oauthHeader);

  const response = await fetch(url, {
    method: method,
    headers: {
      Authorization: oauthHeader,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Twitter API Error:", text);
    throw new Error(`Twitter API error: ${response.status} ${text}`);
  }

  return response.json();
}

function calculateTweetPoints(tweet: any): number {
  const { public_metrics } = tweet;
  
  if (!public_metrics) return 1; // Base points if no metrics
  
  let points = 1; // Base point for tweeting
  
  points += (public_metrics.retweet_count || 0) * 3;  // 3 points per retweet
  points += (public_metrics.reply_count || 0) * 2;    // 2 points per reply
  points += (public_metrics.like_count || 0);         // 1 point per like
  points += (public_metrics.quote_count || 0) * 2;    // 2 points per quote
  
  return points;
}

async function processTweets(tweets: any) {
  if (!tweets?.data || tweets.data.length === 0) {
    console.log("No tweets to process");
    return { processedCount: 0, newPoints: 0, lastTweetId: null };
  }
  
  const supabase = initSupabaseClient();
  let totalNewPoints = 0;
  let processedCount = 0;
  let lastTweetId = null;
  
  const sortedTweets = [...tweets.data].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  
  if (sortedTweets.length > 0) {
    lastTweetId = sortedTweets[0].id;
  }
  
  const userMap = new Map();
  if (tweets.includes?.users) {
    tweets.includes.users.forEach((user: any) => {
      userMap.set(user.id, user);
    });
  }
  
  for (const tweet of tweets.data) {
    const tweetId = tweet.id;
    
    const { data: existingTweet } = await supabase
      .from('processed_tweets')
      .select('*')
      .eq('tweet_id', tweetId)
      .maybeSingle();
      
    if (existingTweet) {
      console.log(`Tweet ${tweetId} already processed, skipping`);
      continue;
    }
    
    const author = userMap.get(tweet.author_id);
    if (!author) {
      console.log(`No author information for tweet ${tweetId}, skipping`);
      continue;
    }
    
    const twitterUsername = author.username;
    const points = calculateTweetPoints(tweet);
    totalNewPoints += points;
    
    const { error } = await supabase.rpc('update_tweet_points', {
      p_tweet_id: tweetId,
      p_twitter_username: twitterUsername,
      p_points: points,
      p_last_tweet_id: lastTweetId
    });
    
    if (error) {
      console.error(`Error processing tweet ${tweetId}:`, error);
      continue;
    }
    
    processedCount++;
  }
  
  return { processedCount, newPoints: totalNewPoints, lastTweetId };
}

async function getLeaderboard() {
  const supabase = initSupabaseClient();
  
  const { data, error } = await supabase
    .from('tweet_points')
    .select('*')
    .order('points', { ascending: false })
    .limit(20);
    
  if (error) {
    console.error("Error fetching leaderboard:", error);
    throw new Error(`Error fetching leaderboard: ${error.message}`);
  }
  
  return data;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    validateEnvironmentVariables();
    
    let action = 'fetch';
    
    if (req.body) {
      try {
        const body = await req.json();
        if (body && body.action) {
          action = body.action;
        }
      } catch (e) {
        console.log("No valid JSON body or no action specified");
      }
    }
    
    if (action === 'fetch') {
      const url = new URL(req.url);
      action = url.searchParams.get('action') || 'fetch';
    }

    console.log(`Processing action: ${action}`);
    
    if (action === 'leaderboard') {
      const leaderboard = await getLeaderboard();
      return new Response(JSON.stringify({ leaderboard }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      const supabase = initSupabaseClient();
      
      const { data: latestEntry } = await supabase
        .from('tweet_points')
        .select('last_tweet_id')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      const latestTweetId = latestEntry?.last_tweet_id;
      console.log(`Using last_tweet_id: ${latestTweetId || 'none'}`);
      
      const searchResults = await searchTweets('($Dawg OR @itzadawg) -is:retweet', latestTweetId);
      
      const processingResults = await processTweets(searchResults);
      
      const leaderboard = await getLeaderboard();
      
      const response = {
        tweets: searchResults,
        processing: processingResults,
        leaderboard
      };
      
      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error: any) {
    console.error("Error in fetch-tweets function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
