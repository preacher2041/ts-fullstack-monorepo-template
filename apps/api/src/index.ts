import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, {Express} from 'express';
import session from 'express-session';
import morgan from 'morgan';

import router from './routes';

declare module 'express-session' {
	export interface SessionData {
	  user: { id: number; username: string; email: string };
	}
  }

dotenv.config()

const app: Express = express();

app.use(cors({
	credentials: true,
	origin: process.env['CORS_ORIGIN'] || 'http://localhost:9000'
}))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(morgan('tiny'))
const sessionSecret = process.env['ACCESS_TOKEN_SECRET'];
if (!sessionSecret) {
	throw new Error('ACCESS_TOKEN_SECRET environment variable is not set');
}

app.use(session({
	name: 'MySessionID',
	cookie: {
		httpOnly: true,
		domain: process.env['COOKIE_DOMAIN'] || 'localhost'
	},
	secret: sessionSecret,
	resave: true,
	saveUninitialized: true,
}));

//redirect to routes/index.js
app.use('/api/v1', router);

const port = process.env['API_PORT'] || 3000;
app.listen(port, () => 
	console.log(`
	🚀 Server ready at: http://localhost:${port}
	⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`),
)