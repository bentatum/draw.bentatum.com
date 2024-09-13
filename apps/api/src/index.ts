import express from 'express';
import cors from 'cors';
import http from 'http';
import { ALLOWED_ORIGIN, PORT } from './config';
import { supabase } from './lib/clients/supabase';

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: ALLOWED_ORIGIN,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/lines', async (req, res) => {
  const { data, error } = await supabase
    .from('lines')
    .select('*');

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.post('/lines', async (req, res) => {
  try {
    // @ts-ignore
    const lines = req.body.map(({ id, ...rest }) => rest); // Exclude id from each line

    const { data, error } = await supabase
      .from('lines')
      .insert(lines);

    if (error) {
      throw error;
    }

    res.status(201).json(data);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

app.get('/connections', async (req, res) => {
  const { status } = req.query;

  let query = supabase.from('connections').select('*');

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});

app.post('/connections', async (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const { data, error } = await supabase
    .from('connections')
    .insert([{ user_id }]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json(data);
});

app.get('/connections/:id', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('connections')
    .select('*')
    .eq('user_id', id)
    .single();

  if (!data || error) {
    const statusCode = error?.code === 'PGRST116' ? 404 : 500;
    const errorMessage = error?.code === 'PGRST116' ? 'Connection not found' : error?.message;
    return res.status(statusCode).json({ error: errorMessage });
  }

  res.json(data);
});

// New endpoint to update connection status
app.put('/connections/:userId/status', async (req, res) => {
  const { userId } = req.params;
  const { status } = req.body;

  try {
    const { data, error } = await supabase
      .from('connections')
      .update({ status })
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error updating connection status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
