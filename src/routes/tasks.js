import { Router } from 'express';
import { TwitterApi } from 'twitter-api-v2';
import { supabase } from '../config/supabase.js';
import { validateTask } from '../middleware/validateTask.js';

const router = Router();

router.post('/verify/like', validateTask, async (req, res) => {
  const { tweetId, userId } = req.body;
  
  try {
    const { data: user } = await supabase
      .from('users')
      .select('access_token')
      .eq('twitter_id', userId)
      .single();

    const userClient = new TwitterApi(user.access_token);
    const liked = await userClient.v2.tweetLikedBy(tweetId, userId);

    await supabase.from('task_completions').upsert({
      user_id: userId,
      task_type: 'like',
      tweet_id: tweetId,
      completed: liked,
    });

    res.json({ completed: liked });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/verify/retweet', validateTask, async (req, res) => {
  const { tweetId, userId } = req.body;
  
  try {
    const { data: user } = await supabase
      .from('users')
      .select('access_token')
      .eq('twitter_id', userId)
      .single();

    const userClient = new TwitterApi(user.access_token);
    const retweeted = await userClient.v2.tweetRetweetedBy(tweetId, userId);

    await supabase.from('task_completions').upsert({
      user_id: userId,
      task_type: 'retweet',
      tweet_id: tweetId,
      completed: retweeted,
    });

    res.json({ completed: retweeted });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/verify/follow', validateTask, async (req, res) => {
  const { targetUserId, userId } = req.body;
  
  try {
    const { data: user } = await supabase
      .from('users')
      .select('access_token')
      .eq('twitter_id', userId)
      .single();

    const userClient = new TwitterApi(user.access_token);
    const following = await userClient.v2.following(userId, targetUserId);

    await supabase.from('task_completions').upsert({
      user_id: userId,
      task_type: 'follow',
      target_user_id: targetUserId,
      completed: following,
    });

    res.json({ completed: following });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export const tasksRouter = router;