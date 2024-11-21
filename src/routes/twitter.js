import { Router } from 'express';
import { TwitterApi } from 'twitter-api-v2';
import { supabase } from '../config/supabase.js';
import { twitter } from '../config/twitter.js';

const router = Router();

router.get('/auth/url', (req, res) => {
  const authUrl = twitter.generateOAuth2AuthLink(process.env.TWITTER_CALLBACK_URL, {
    scope: ['tweet.read', 'users.read', 'follows.read', 'like.read'],
  });
  res.json({ url: authUrl });
});

router.post('/auth/callback', async (req, res) => {
  const { code } = req.body;
  
  try {
    const { accessToken, client: loggedClient } = await twitter.loginWithOAuth2({
      code,
      codeVerifier: process.env.TWITTER_CODE_VERIFIER,
      redirectUri: process.env.TWITTER_CALLBACK_URL,
    });

    const { data: user } = await loggedClient.v2.me();

    // Store user in Supabase
    await supabase.from('users').upsert({
      twitter_id: user.id,
      username: user.username,
      access_token: accessToken,
    });

    res.json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export const twitterRouter = router;