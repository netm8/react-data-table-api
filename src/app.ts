import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import routes from '@/http/routes';

const app = express();

app.use(
  cors({
    origin: '*',
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
  })
);

app.use(logger('dev'));
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', routes);

export default app;
