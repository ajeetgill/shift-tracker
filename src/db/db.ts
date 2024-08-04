import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './schema'
import { Client } from 'pg'

const connectionString = process.env.DB_URL
const client = new Client({
  connectionString,
})

client.connect()
export const db = drizzle(client, {
  schema,
})
export { client }
