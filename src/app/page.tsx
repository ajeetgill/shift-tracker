import { auth } from '@/auth/auth'
import SecondaryLink from '@/components/secondaryLinks'
import { USER_ROLES } from '@/utils/constants'
import { Button } from '@nextui-org/button'
import { Link } from '@nextui-org/link'

export default async function Home() {
  const session = await auth()
  if (!session)
    return (
      <main className="flex min-h-[50vh] flex-col justify-between p-4 md:p-24 gap-4">
        <p>
          Hi, We&apos;sre Chief Janitorial
          <br />
          Island&apos;s Service Provider :)
        </p>
        <section className="flex flex-col items-center gap-4">
          <SecondaryLink text="Already have an account? Login" href="/signin" />
          <SecondaryLink text="Need an account? Signup" href="/signup" />
        </section>
      </main>
    )
  else {
    return (
      <main className="flex min-h-[50vh] flex-col justify-between p-4 md:p-24 gap-4">
        <p>
          Hi {session.user.name} ({session.user.role}),
          <br />
          Chief Janitorial welcomes you,
          <br />
          Island&apos;s Service Provider :)
        </p>
        <Button
          as={Link}
          color="primary"
          href={
            session.user.role === USER_ROLES.WORKER ? '/dashboard' : '/employer'
          }
          variant="flat"
        >
          {session.user.role === USER_ROLES.WORKER
            ? 'Log New Shift'
            : 'Add business'}
        </Button>
      </main>
    )
  }
}
