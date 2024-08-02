import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Client } from 'pg'

const connectionString = process.env.DB_URL
const client = new Client({
  connectionString,
})

client.connect()
export const db = drizzle(client)
export { client }
