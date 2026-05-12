import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import morgan from 'morgan';
import authRoutes from './modules/auth/auth.routes.js';
import complaintRoutes from './modules/complaints/complaint.routes.js';
import analyticsRoutes from './modules/analytics/analytics.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';
import incidentRoutes from './modules/incidents/incident.route.js';
import leaderboardRoutes from './modules/leaderboard/leaderboard.routes.js';
import citizenRoutes from './modules/citizen/citizen.routes.js';
import publicRoutes from './modules/public/public.routes.js';
import speechRoutes from './modules/speech/speech.routes.js';
import whatsappRoutes from './modules/whatsapp/whatsapp.routes.js';
import { prisma } from './prisma/client.js';
import { errorMiddleware, notFoundHandler } from './middleware/error.middleware.js';
import { requestLogger } from './middleware/requestLogger.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const allowedOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(helmet());
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  }),
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(requestLogger);

app.get('/health', async (req, res, next) => {
  try {
    const [userCount, complaintCount] = await Promise.all([
      prisma.user.count(),
      prisma.complaint.count(),
    ]);

    res.json({
      success: true,
      message: 'OK',
      data: {
        database: 'PostgreSQL',
        users: userCount,
        complaints: complaintCount,
      },
    });
  } catch (error) {
    next(error);
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/speech', speechRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/citizen', citizenRoutes);

app.use(notFoundHandler);
app.use(errorMiddleware);

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  server.close(() => process.exit(0));
});

export default app;
