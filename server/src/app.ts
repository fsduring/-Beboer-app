import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import tenantRoutes from './routes/tenantRoutes';
import managerRoutes from './routes/managerRoutes';
import sharedRoutes from './routes/sharedRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', tenantRoutes);
app.use('/api', managerRoutes);
app.use('/api', sharedRoutes);

app.use(errorHandler);

export default app;
