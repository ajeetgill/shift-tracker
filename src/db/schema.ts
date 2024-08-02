import { relations } from 'drizzle-orm'
import {
  pgTable,
  text,
  boolean,
  uuid,
  timestamp,
  date,
  time,
} from 'drizzle-orm/pg-core'
import {
  employmentStatusEnum,
  roleEnum,
  shiftTypeEnum,
  workStatusEnum,
} from './schemaEnums'

const id = () => uuid('id').primaryKey().defaultRandom()
const createdAt = () => timestamp('created_at').defaultNow().notNull()

// Users table
export const users = pgTable('users', {
  id: id(),
  createdAt: createdAt(),
  email: text('email').unique(),
  password: text('password').notNull(),
  phoneNumber: text('phone_number').unique().notNull(),
  fullName: text('full_name').notNull(),
  currentWorkStatus: workStatusEnum('current_work_status')
    .default('off_shift')
    .notNull(),
  currentShiftId: uuid('current_shift_id'),
  isPhoneNumberVerified: boolean('is_phone_number_verified')
    .default(false)
    .notNull(),
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
  startTime: text('start_time'),
  serverStartTime: time('server_start_time').defaultNow(),
  endTime: text('end_time'),
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
