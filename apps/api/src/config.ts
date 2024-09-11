import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 3001;
export const SUPABASE_URL = process.env.SUPABASE_URL;
export const SUPABASE_KEY = process.env.SUPABASE_KEY;
export const ORIGIN = process.env.ORIGIN || process.env.VERCEL_URL || 'http://localhost:3000';