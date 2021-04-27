import { config as dotenvConfig } from 'dotenv';
dotenvConfig();
import http from 'http';
import app from './app';

http.createServer(app).listen(3000);
