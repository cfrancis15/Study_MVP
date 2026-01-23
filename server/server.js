import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { clerkMiddleware, requireAuth } from '@clerk/express';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
if (!CLERK_SECRET_KEY) {
  throw new Error('CLERK_SECRET_KEY not found in environment variables');
}

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(clerkMiddleware());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY not found in environment variables');
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Dynamic rate limiting based on subscription tier
const rateLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  keyGenerator: (req) => {
    // Use user ID as the key so each user has their own rate limit
    return req.auth?.userId || req.ip;
  },
  max: (req) => {
    // Check user's subscription from Clerk session claims
    const subscription = req.auth?.sessionClaims?.subscription || 'free';
    return subscription === 'paid' ? 30 : 10;
  },
  message: { error: 'Rate limit exceeded. Please upgrade to premium for more requests.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.post('/api/generate-questions', requireAuth(), rateLimiter, async (req, res) => {
  try {
    const { text, goal } = req.body;
    
    if (!text || !goal) {
      return res.status(400).json({ error: 'Text and goal are required' });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a study coach that helps learners develop deep understanding through recall practice. Always respond with valid JSON only, no additional text.'
          },
          {
            role: 'user',
            content: `Given this study text:\n${text.substring(0, 8000)}\n\nand the user's goal: ${goal}\n\nSelect three short relevant passages (max 250 words each) and generate three short-answer questions to test comprehension. Return structured JSON in this exact format: {"passages": ["passage 1 text", "passage 2 text", "passage 3 text"], "questions": ["question 1", "question 2", "question 3"]}`
          }
        ],
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({ 
        error: errorData.error?.message || 'OpenAI API error' 
      });
    }

    const data = await response.json();
    const content = JSON.parse(data.choices[0].message.content);
    
    res.json({
      passages: content.passages || [],
      questions: content.questions || []
    });
  } catch (error) {
    console.error('Generate questions error:', error);
    res.status(500).json({ error: 'An error occurred processing your request' });
  }
});

app.post('/api/evaluate-answers', requireAuth(), rateLimiter, async (req, res) => {
  try {
    const { text, goal, questions, answers } = req.body;
    
    if (!text || !goal || !questions || !answers) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a study coach evaluating a student\'s understanding. Always respond with valid JSON only, no additional text.'
          },
          {
            role: 'user',
            content: `Here is the study text:\n${text.substring(0, 8000)}\n\nGoal: ${goal}\n\nQuestions:\n${questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}\n\nUser Answers:\n${answers.map((a, i) => `${i + 1}. ${a}`).join('\n')}\n\nEvaluate each answer on a scale of 0-1 and give a brief 1-2 sentence feedback for each. Return a JSON object with a "feedback" key containing an array. Use this exact format: {"feedback": [{"question": "question text", "score": 0.8, "comment": "feedback text"}, ...]}`
          }
        ],
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({ 
        error: errorData.error?.message || 'OpenAI API error' 
      });
    }

    const data = await response.json();
    const content = JSON.parse(data.choices[0].message.content);
    const feedbackArray = content.feedback || [];
    
    res.json({ feedback: feedbackArray });
  } catch (error) {
    console.error('Evaluate answers error:', error);
    res.status(500).json({ error: 'An error occurred processing your request' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
