import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';
import jwksClient from 'jwks-rsa';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Neon database connection
const sql = neon(process.env.DATABASE_URL!);

// Initialize JWKS client for Neon Auth validation
const client = jwksClient({
  jwksUri: 'https://ep-crimson-math-aoshrer4.neonauth.c-2.ap-southeast-1.aws.neon.tech/neondb/auth/.well-known/jwks.json',
});

function getKey(header: any, callback: any) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) return callback(err);
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

// Middleware to verify Neon Auth JWT
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, getKey, {}, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
};

// Test route to verify DB connection
app.get('/api/health', async (req, res) => {
  try {
    const result = await sql`SELECT version()`;
    res.json({ status: 'ok', db: result[0].version });
  } catch (error) {
    console.error('DB Connection Error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Example protected route for complaints
app.get('/api/complaints', authenticateToken, async (req, res) => {
  try {
    // In a real app, you would fetch from the actual table
    // const complaints = await sql`SELECT * FROM complaints LIMIT 10`;
    res.json({ message: 'Authenticated successfully. Complaints fetch would happen here.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});


app.post('/api/auth/register', async (req, res) => {
  const { email, name, role } = req.body;
  
  if (!email || !name || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // In production, insert user into Neon DB here
    res.json({ 
      success: true, 
      message: 'User registered successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
