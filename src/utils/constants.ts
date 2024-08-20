export const LENGTH_OF_YEAR = 4
export const CREATE_BUSINESS_MAX_ALLOWED: number = 5
export const USER_ROLES = {
  WORKER: 'worker',
  OWNER: 'businessowner',
  ADMIN: 'admin',
} as const
export const DEFAULT_BUSSINESS_TYPE = 'farm'

export const AUTH_JS_ACTION = ['signup', 'signin'] as const
export const PHONE_NUM_LENGTH: number = 10
export const NAME_LENGTH_MIN = 2
export const NAME_LENGTH_MAX = 16
export const SHIFT_NOTES_LENGTH: number = 120
