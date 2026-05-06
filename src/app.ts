import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import accountRoutes from './routes/account';
import { errorHandler } from './middleware/errorHandler';
import chatRoutes from './routes/chat';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/account', accountRoutes);
app.use('/api/chat', chatRoutes);

app.use(errorHandler);

export default app;
