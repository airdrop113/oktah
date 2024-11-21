import { z } from 'zod';

const taskSchema = z.object({
  userId: z.string().min(1),
  tweetId: z.string().optional(),
  targetUserId: z.string().optional(),
});

export const validateTask = (req, res, next) => {
  try {
    taskSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ error: error.errors });
  }
};