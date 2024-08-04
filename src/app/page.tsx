import SecondaryLink from '@/components/secondaryLinks'
import { Button } from '@nextui-org/react'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      hi, you&apos;re in {process.env.NODE_ENV} env.
      <section className="flex flex-col gap-4 items-center">
        <SecondaryLink text="Already have an account? Login" link="/signin" />
        <SecondaryLink text="Need an account? Signup" link="/signup" />
      </section>
    </main>
  )
}
