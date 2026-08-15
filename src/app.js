import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';

import env from './config/env.js';
import routes from './routes/index.js';
import swaggerSpec from './docs/swagger.js';
import simulateDelay from './middlewares/simulateDelay.js';
import simulateError from './middlewares/simulateError.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: '*',
  }),
);

app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.use(express.json());
app.use(simulateDelay);
app.use(simulateError);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
