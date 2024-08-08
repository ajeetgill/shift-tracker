'use client'
import { useEffect, useState, useTransition } from 'react'
import { useFormState } from 'react-dom'
import { clockInShift, endActiveShift } from '@/actions/shifts'
import { Button, Chip, Input } from '@nextui-org/react'
import Submit from './submitBtn'
import { formatLiveTimeHHMM } from '@/utils/helpers'
import { useRouter } from 'next/navigation'

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

  const fmtTimeHHAMPM = (dateToFmt: Date) => {
    const getDayEmoji = (hrOfDay: number) => {
      if (hrOfDay > 6 && hrOfDay < 17) return '☀️ '
      else return '🌕 '
    }
    const hr = dateToFmt.getHours()
    // console.log('hr == ', hr)
    const sunmoon = getDayEmoji(hr)
    const hr12fmt = sunmoon + (hr > 12 ? `${hr - 12} PM` : `${hr} AM`)
    return hr12fmt
  }
  const [hr, setHr] = useState(fmtTimeHHAMPM(new Date()))
  const [liveTime, setLiveTime] = useState(formatLiveTimeHHMM(Date.now()))

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date()
      setCurrentUnixTime(now.getTime())
      setHr(fmtTimeHHAMPM(now))
      setLiveTime(formatLiveTimeHHMM(now.getTime()))
    }

    updateCurrentTime()
    const timer = setInterval(updateCurrentTime, 1000)
    return () => clearInterval(timer)
  }, [])

  const [formState, action] = useFormState(clockInShift, initState)
  const [businessName, setName] = useState('PEI Farms')

  const router = useRouter()

  const isOnActiveShift: boolean =
    currentWorkStatus === 'on_shift' ? true : false
  const [isPending, startTransition] = useTransition()
  const handleClockOut = () => {
    startTransition(() => {
      endActiveShift(Date.now()).finally(() => router.refresh())
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
          value={liveTime}
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
