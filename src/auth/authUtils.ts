// install 'server-only' before using, had uninstalled previous one to cleanup before commiting code
// import 'server-only'
import bcrypt from 'bcrypt'

const SALT_ROUNDS = Number(process.env.AUTH_SALT_ROUNDS!)
if (!SALT_ROUNDS) {
  throw new Error('Environment variable missing `SALT_ROUNDS`')
}
export const hashPW = (password: string) => {
  return bcrypt.hash(password, SALT_ROUNDS)
}
export const comparePW = (password: string, hashedPW: string) => {
  return bcrypt.compare(password, hashedPW)
}
