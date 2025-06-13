import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import userRoutes from './routes/UserRoutes.js'
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// middlewares
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: true}));

// rotas
app.use('/api/users', userRoutes)

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString()
   });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo deu errado!' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

export default app;