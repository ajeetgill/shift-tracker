import { relations } from 'drizzle-orm'
import {
  pgTable,
  text,
  boolean,
  uuid,
  timestamp,
  date,
  time,
  integer,
  pgEnum,
  primaryKey,
} from 'drizzle-orm/pg-core'
import type { AdapterAccountType } from 'next-auth/adapters'

const workStatusEnum = pgEnum('work_status', [
  'on_shift',
  'off_shift',
  'break',
  'leave',
  'terminated',
])

const employmentStatusEnum = pgEnum('employment_status', [
  'employed',
  'onLeave',
  'retired',
  'terminated',
  'resigned',
])

const roleEnum = pgEnum('role', ['admin', 'businessOwner', 'worker'])

const shiftTypeEnum = pgEnum('shift_type', [
  'regular',
  'overtime',
  'holiday',
  'n/a',
])

const id = () => uuid('id').primaryKey().defaultRandom()
const createdAt = () => timestamp('created_at').defaultNow().notNull()

// Users table
export const users = pgTable('users', {
  id: id(),
  createdAt: createdAt(),
  name: text('name').notNull(),
  password: text('password').notNull(),
  phoneNumber: text('phone_number').unique().notNull(),
  email: text('email').unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  phoneNumVerified: timestamp('phoneNumVerified', { mode: 'date' }),
  image: text('image'),
  currentWorkStatus: workStatusEnum('current_work_status')
    .default('off_shift')
    .notNull(),
  currentShiftId: uuid('current_shift_id'),
  employmentStatus: employmentStatusEnum('employment_status')
    .default('employed')
    .notNull(),
  role: roleEnum('role').default('worker').notNull(),
})

// Business Types table
export const businessTypes = pgTable('business_types', {
  id: id(),
  name: text('name').notNull(),
})

export const accounts = pgTable(
  'account',
  {
    userId: uuid('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
)

// Businesses table
export const businesses = pgTable('businesses', {
  id: id(),
  createdAt: createdAt(),
  name: text('name').notNull(),
  location: text('location').notNull(),
  contactNumber: text('contact_number'),
  businessTypeId: uuid('business_type_id').notNull(),
  ownerId: uuid('owner_id').notNull(),
  gpsLocation: text('gps_location'),
})

// Shifts table
// todo: confirm is server time is same as user time, check previous commit for psql-timestamp
// later try servertime with - check previous commit for psql-timestamp
export const shifts = pgTable('shifts', {
  id: id(),
  createdAt: createdAt(),
  employeeId: uuid('employee_id').notNull(),
  businessId: uuid('business_id').notNull(),
  date: text('date').notNull(),
  serverDate: date('server_date').notNull().defaultNow(),
  startUnixTimeSecs: text('start_unixtime_secs'),
  serverStartTime: time('server_start_time').defaultNow(),
  endUnixTimeSecs: text('end_unixtime_secs'),
  summary: text('summary'),
  notes: text('notes'),
  type: shiftTypeEnum('shift_type').default('n/a').notNull(),
  gpsShiftLocation: text('gps_shift_location'),
})

export const businessesRelations = relations(businesses, ({ one, many }) => ({
  businessType: one(businessTypes, {
    references: [businessTypes.id],
    fields: [businesses.businessTypeId],
  }),
  owner: one(users, {
    references: [users.id],
    fields: [businesses.ownerId],
  }),
  shifts: many(shifts),
}))

export const shiftsRelations = relations(shifts, ({ one }) => ({
  employee: one(users, {
    references: [users.id],
    fields: [shifts.employeeId],
  }),
  business: one(businesses, {
    references: [businesses.id],
    fields: [shifts.businessId],
  }),
}))

export const usersRelations = relations(users, ({ many }) => ({
  shifts: many(shifts),
}))

export const businessTypeRelations = relations(businessTypes, ({ many }) => ({
  businesses: many(businesses),
}))

export const authDBSchema = {
  usersTable: users,
  accountsTable: accounts,
}
