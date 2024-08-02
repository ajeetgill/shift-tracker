import { sql } from 'drizzle-orm'
import { db, client } from '@/db/db'

async function dropTables() {
  try {
    await db.execute(sql`DROP TABLE IF EXISTS shifts;`)
    await db.execute(sql`DROP TABLE IF EXISTS businesses;`)
    await db.execute(sql`DROP TABLE IF EXISTS business_types;`)
    await db.execute(sql`DROP TABLE IF EXISTS users;`)
  } catch (err) {
    console.error('Error dropping tables:', err)
  }
}

dropTables()
  .then(() => {
    console.log('Tables dropped successfully.')
  })
  .catch((error) => {
    console.error('Error dropping tables:', error)
  })
  .finally(() => {
    client.end()
    console.log('db-client ended open connection.')
    process.exit(0)
  })
