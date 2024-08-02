import type { Config } from 'drizzle-kit'

const dbUrl = process.env.DB_URL!

export default {
  schema: './src/db/schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: dbUrl,
  },
  verbose: true,
  strict: true,
} satisfies Config
