'use client'
import { useCallback, useEffect, useState, useTransition } from 'react'
import { useFormState } from 'react-dom'
import { clockInShift, endActiveShift } from '@/actions/shifts'
import { Button, Chip, Input } from '@nextui-org/react'
import Submit from './submitBtn'

const initState = { message: null }

const CreateShift = ({
  name,
  currentWorkStatus,
}: {
  name: string
  currentWorkStatus: any
}) => {
  const currentDate = `${new Date().toDateString()}`
  const [currentUnixTime, setCurrentUnixTime] = useState<number | null>(null)
  const [hr, setHr] = useState('☀️ 8 AM')

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date().getTime()
      setCurrentUnixTime(now)
      const currTime = new Date(now).toLocaleTimeString().substring(0, 5)
      const hr = Number(currTime.substring(0, 2))
      const hr12fmt = hr > 12 ? `🌕 ${hr - 12} PM` : `☀️ ${hr} AM`
      setHr(hr12fmt)
    }

    updateCurrentTime()
    const timer = setInterval(updateCurrentTime, 1000)
    return () => clearInterval(timer)
  }, [])

  const displayTime = useCallback(() => {
    if (!currentUnixTime) return '00:00'
    let currTime = new Date(currentUnixTime)
      .toLocaleTimeString()
      .substring(0, 5)
    return currTime
  }, [currentUnixTime])

  const [formState, action] = useFormState(clockInShift, initState)
  const [businessName, setName] = useState('PEI Farms')

  const isOnActiveShift: boolean =
    currentWorkStatus === 'on_shift' ? true : false
  const [isPending, startTransition] = useTransition()
  const handleClockOut = () => {
    startTransition(() => {
      endActiveShift(Date.now())
    })
  }

  return (
    <div>
      <h3 className="my-4 text-2xl font-bold capitalize py-2">Clockin shift</h3>

      <form
        action={action}
        className="bg-content1 border border-default-100 shadow-lg rounded-md p-3 flex flex-col gap-8"
      >
        <div>
          <h5 className="my-4 text-lg font-bold capitalize py-2">Hi, {name}</h5>
          <h5 className="my-4 text-lg font-bold capitalize py-2">
            Shift Status: {`${currentWorkStatus}`.replace('_', ' ')}
          </h5>
          <Chip className="w-max mr-2">{hr}</Chip>
          {currentDate}
        </div>
        <Input
          required
          name="name"
          value={businessName}
          placeholder="Business Name"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          readOnly
          aria-readonly
          name="shiftStartUnixTimeMS"
          className="hidden"
          value={currentUnixTime || ''}
        />
        <input
          required
          disabled
          contentEditable="false"
          className="w-full text-center font-semibold text-5xl bg-[#27272a] rounded-2xl py-2 pointer-events-none"
          placeholder="shiftTime"
          value={displayTime()}
          name="liveTimer"
          type="text"
        />

        <Submit label={'Clockin'} disabled={isOnActiveShift} />
        {isOnActiveShift && (
          <Button
            color="secondary"
            onClick={handleClockOut}
            isLoading={isPending}
          >
            Clockout
          </Button>
        )}
      </form>
    </div>
  )
}
export default CreateShift
