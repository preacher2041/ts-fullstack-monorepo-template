import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Express } from 'express'
import rateLimit from 'express-rate-limit'
import session from 'express-session'
import helmet from 'helmet'
import morgan from 'morgan'

import { env } from './env'
import router from './routes'

declare module 'express-session' {
	export interface SessionData {
		user: { id: string; username: string; email: string }
	}
}

const app: Express = express()

app.use(helmet())
app.use(
	cors({
		credentials: true,
		origin: env.CORS_ORIGIN ?? 'http://localhost:9000',
	})
)
app.use(bodyParser.urlencoded({ extended: true, limit: '10kb' }))
app.use(bodyParser.json({ limit: '10kb' }))
app.use(cookieParser())
app.use(morgan('tiny'))

app.use(
	session({
		name: 'MySessionID',
		cookie: {
			httpOnly: true,
			sameSite: 'strict',
			secure: env.NODE_ENV === 'production',
			maxAge: 24 * 60 * 60 * 1000,
			domain: process.env['COOKIE_DOMAIN'],
		},
		secret: env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
	})
)

const globalLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	standardHeaders: true,
	legacyHeaders: false,
})

const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 5,
	standardHeaders: true,
	legacyHeaders: false,
})

app.use(globalLimiter)

//redirect to routes/index.js
app.use('/api/v1', router)

const port = env.API_PORT ?? 3000
app.listen(port, () =>
	console.log(`
	🚀 Server ready at: http://localhost:${port}
	⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`)
)
