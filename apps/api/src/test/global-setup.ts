import { execSync } from 'node:child_process'
import pg from 'pg'

const TEST_DATABASE_URL = 'postgresql://postgres:postgres@127.0.0.1:5432/testdb'

export async function setup() {
	const client = new pg.Client({
		connectionString:
			'postgresql://postgres:postgres@127.0.0.1:5432/postgres',
	})

	await client.connect()
	await client.query('CREATE DATABASE testdb').catch(() => {})
	await client.end()

	execSync('npx prisma migrate deploy', {
		cwd: process.cwd(),
		env: {
			...process.env,
			DATABASE_URL: TEST_DATABASE_URL,
		},
		stdio: 'inherit',
	})
}
