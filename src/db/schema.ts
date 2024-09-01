import { USER_ROLES } from '@/utils/constants'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { relations } from 'drizzle-orm'
import {
  pgTable,
  text,
  uuid,
  timestamp,
  date,
  time,
  integer,
  pgEnum,
  primaryKey,
  index,
} from 'drizzle-orm/pg-core'
import type { AdapterAccountType } from 'next-auth/adapters'

export const workStatusEnum = pgEnum('work_status', [
  'on_shift',
  'off_shift',
  'break',
  'leave',
  'terminated',
])

export const employmentStatusEnum = pgEnum('employment_status', [
  'employed',
  'onLeave',
  'retired',
  'terminated',
  'resigned',
])

export const roleEnum = pgEnum('role', [
  USER_ROLES.ADMIN,
  USER_ROLES.OWNER,
  USER_ROLES.WORKER,
])

export const shiftTypeEnum = pgEnum('shift_type', [
  'regular',
  'overtime',
  'holiday',
  'n/a',
])

const id = () => uuid('id').primaryKey().defaultRandom()
const createdAt = () => timestamp('created_at').defaultNow().notNull()
const updatedAt = () => timestamp('updated_at').defaultNow().notNull()

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
  updatedAt: updatedAt(),
}, (table) => ({
  phoneNumberIdx: index('phone_number_idx').on(table.phoneNumber),
  emailIdx: index('email_idx').on(table.email),
}))
export const insertUserSchema = createInsertSchema(users)
export const selectUserSchema = createSelectSchema(users)

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
  createdAt: createdAt(),
  id: id(),
  ownerId: uuid('owner_id').notNull().references(() => users.id, { onDelete: 'set null' }),
  name: text('name').notNull(),
  location: text('location').notNull(),
  businessTypeId: uuid('business_type_id').notNull(),
  contactNumber: text('contact_number'),
  gpsLocation: text('gps_location'),
  updatedAt: updatedAt(),
})

// Shifts table
// todo: confirm is server time is same as user time, check previous commit for psql-timestamp
// later try servertime with - check previous commit for psql-timestamp
export const shifts = pgTable('shifts', {
  id: id(),
  createdAt: createdAt(),
  employeeId: uuid('employee_id').notNull().references(() => users.id, { onDelete: 'set null' }),
  businessId: uuid('business_id').notNull().references(() => businesses.id, { onDelete: 'set null' }),
  date: text('date').notNull(),
  serverDate: date('server_date').notNull().defaultNow(),
  startUnixTimeSecs: text('start_unixtime_secs'),
  serverStartTime: time('server_start_time').defaultNow(),
  endUnixTimeSecs: text('end_unixtime_secs'),
  summary: text('summary'),
  notes: text('notes'),
  type: shiftTypeEnum('shift_type').default('n/a').notNull(),
  gpsShiftLocation: text('gps_shift_location'),
  updatedAt: updatedAt(),
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