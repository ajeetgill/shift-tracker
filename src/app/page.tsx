import { Button } from '@nextui-org/react'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      hi, you&apos;re in {process.env.NODE_ENV} env.
      <Button>Click me</Button>
    </main>
  )
}
