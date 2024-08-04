'use client'

import { Button } from '@nextui-org/react'
import { useFormStatus } from 'react-dom'

const Submit = ({
  label,
  ...btnProps
}: { label: string } & React.ComponentProps<typeof Button>) => {
  const { pending } = useFormStatus()

  return (
    <Button {...btnProps} type="submit" isLoading={pending} color="primary">
      {label}
    </Button>
  )
}
export default Submit
