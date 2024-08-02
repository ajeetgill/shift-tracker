import { pgEnum } from 'drizzle-orm/pg-core'

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

export const roleEnum = pgEnum('role', ['admin', 'businessOwner', 'worker'])

export const shiftTypeEnum = pgEnum('shift_type', [
  'regular',
  'overtime',
  'holiday',
  'n/a',
])
