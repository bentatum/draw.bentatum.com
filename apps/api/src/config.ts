import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 3001;
export const SUPABASE_URL = process.env.SUPABASE_URL;
export const SUPABASE_KEY = process.env.SUPABASE_KEY;
export const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';