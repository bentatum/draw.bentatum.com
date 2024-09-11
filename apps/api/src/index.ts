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
  const { data, error } = await supabase
    .from('lines')
    .insert(req.body);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json(data);
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
