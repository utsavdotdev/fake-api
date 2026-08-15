import express from 'express';

import env from './config/env.js';
import routes from './routes/index.js';
import { NotFoundError } from './services/resourceService.js';
import simulateDelay from './middlewares/simulateDelay.js';

const app = express();

app.use(express.json());
app.use(simulateDelay);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', routes);

app.use((err, req, res, next) => {
  if (err instanceof NotFoundError) {
    return res.status(404).json({ error: err.message });
  }
  console.error(err);
  return res.status(500).json({ error: 'Internal Server Error' });
});

export default app;