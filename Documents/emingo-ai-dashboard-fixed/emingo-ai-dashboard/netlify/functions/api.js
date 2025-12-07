// Netlify Serverless Function - API Proxy
// This is an alternative approach if you want to run the backend on Netlify Functions
// Note: This requires Netlify Functions (serverless) which has limitations

import serverless from 'serverless-http';
import express from 'express';
import cors from 'cors';
import pg from 'pg';
import { randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import bcrypt from 'bcryptjs';

const { Pool } = pg;

const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Google OAuth Client
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'https://eloquent-parfait-8fa33b.netlify.app/auth/callback';

let oauth2Client = null;
if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  oauth2Client = new OAuth2Client(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
  );
}

// Generate JWT token
function generateToken(userId, email) {
  return jwt.sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Verify JWT token
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Database connection
const connectionString = process.env.DATABASE_URL;
const isLocalhost = connectionString?.includes('localhost') || connectionString?.includes('127.0.0.1');

let pool = null;
if (connectionString) {
  pool = new Pool({
    connectionString,
    ssl: isLocalhost ? false : {
      rejectUnauthorized: false
    },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Netlify Functions API is running' });
});

// Get Google OAuth URL
app.get('/api/auth/google/url', (req, res) => {
  try {
    console.log('📡 GET /api/auth/google/url called');
    
    if (!oauth2Client) {
      console.log('⚠️  OAuth2Client not initialized');
      return res.status(500).json({ 
        error: 'Google OAuth not configured',
        message: 'Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in Netlify environment variables'
      });
    }

    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
      ],
      prompt: 'consent'
    });

    console.log('✅ Generated OAuth URL');
    res.json({ url });
  } catch (error) {
    console.error('❌ Error generating OAuth URL:', error);
    res.status(500).json({ 
      error: 'Failed to generate OAuth URL',
      message: error.message 
    });
  }
});

// Handle Google OAuth callback
app.post('/api/auth/google/callback', async (req, res) => {
  try {
    console.log('📡 POST /api/auth/google/callback called');
    
    if (!oauth2Client) {
      console.error('❌ OAuth2Client not initialized');
      return res.status(500).json({ error: 'Google OAuth not configured' });
    }

    if (!pool) {
      console.error('❌ Database not configured');
      return res.status(500).json({ error: 'Database not configured' });
    }

    const { code } = req.body;
    if (!code) {
      console.error('❌ No authorization code provided');
      return res.status(400).json({ error: 'Authorization code required' });
    }

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user info from Google
    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name;
    const avatar_url = payload.picture;

    // Check if user exists
    let userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    let user;
    if (userResult.rows.length === 0) {
      // Create new user
      const insertResult = await pool.query(
        'INSERT INTO users (email, name, avatar_url) VALUES ($1, $2, $3) RETURNING *',
        [email, name, avatar_url]
      );
      user = insertResult.rows[0];
    } else {
      user = userResult.rows[0];
      // Update user info
      await pool.query(
        'UPDATE users SET name = $1, avatar_url = $2, updated_at = NOW() WHERE id = $3',
        [name, avatar_url, user.id]
      );
    }

    // Generate JWT token
    const token = generateToken(user.id, user.email);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar_url: user.avatar_url
      }
    });
  } catch (error) {
    console.error('❌ Error in OAuth callback:', error);
    res.status(500).json({ 
      error: 'Authentication failed',
      message: error.message 
    });
  }
});

// Export as serverless function
export const handler = serverless(app);
