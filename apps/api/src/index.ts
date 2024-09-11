import express from 'express';
import cors from 'cors';
import http from 'http';
import { PORT } from './config';
import { supabase } from './lib/clients/supabase';

const app = express();
const server = http.createServer(app);

app.use(cors());
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

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
