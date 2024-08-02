import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Client } from 'pg'

const connectionString = process.env.DB_URL
const client = new Client({
  connectionString,
})

// or
// const env = process.env
// const client = new Client({
//   host: env.DB_HOST,
//   port: env.DB_PORT ? Number(env.DB_PORT) : 3333,
//   user: env.DB_USER,
//   password: env.DB_PASS,
//   database: env.DB_DATABASE_NAME,
// })
client.connect()
export const db = drizzle(client)
export { client }
