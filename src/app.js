import express from 'express';

import routes from './routes/index.js';
import simulateDelay from './middlewares/simulateDelay.js';
import simulateError from './middlewares/simulateError.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

app.use(express.json());
app.use(simulateDelay);
app.use(simulateError);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({
    error: true,
    status: 404,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

app.use(errorHandler);

export default app;
