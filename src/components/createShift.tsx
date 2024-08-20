'use client'
import { useEffect, useRef, useState, useTransition } from 'react'
import { useFormState } from 'react-dom'
import { clockInShift, endActiveShift } from '@/actions/shifts'
import {
  Button,
  Chip,
  Input,
  Select,
  SelectItem,
  Textarea,
} from '@nextui-org/react'
import Submit from './submitBtn'
import { formatLiveTimeHHMM } from '@/utils/helpers'
import { useRouter } from 'next/navigation'
import { SHIFT_NOTES_LENGTH } from '@/utils/constants'

const initState = { message: null }

const CreateShift = ({
  name,
  currentWorkStatus,
  shiftLocations,
}: {
  name: string
  currentWorkStatus: any
  shiftLocations: [{ id: string; name: string }]
}) => {
  const currentDate = `${new Date().toDateString()}`
  const [currentUnixTime, setCurrentUnixTime] = useState<number | null>(null)

  const fmtTimeHHAMPM = (dateToFmt: Date) => {
    const getDayEmoji = (hrOfDay: number) => {
      if (hrOfDay > 6 && hrOfDay < 17) return '☀️ '
      else return '🌕 '
    }
    const hr = dateToFmt.getHours()
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
  const formRef = useRef<HTMLFormElement>(null)

  const router = useRouter()

  const isOnActiveShift: boolean =
    currentWorkStatus === 'on_shift' ? true : false
  const [isPending, startTransition] = useTransition()
  const handleClockOut = () => {
    startTransition(() => {
      endActiveShift(Date.now()).then(() => {
        formRef.current.reset()
        router.refresh()
      })
    })
  }

  return (
    <div>
      <h3 className="my-4 text-2xl font-bold capitalize py-2">Clockin shift</h3>

      <form
        ref={formRef}
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

        <Select
          label="Shift Location"
          className="w-full"
          name="location"
          isRequired
          isDisabled={isOnActiveShift}
        >
          {shiftLocations.map((location) => (
            <SelectItem value={location?.id} key={location?.id}>
              {location?.name}
            </SelectItem>
          ))}
        </Select>
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
        <Textarea
          name="notes"
          disabled={isOnActiveShift}
          maxLength={SHIFT_NOTES_LENGTH}
          label={
            isOnActiveShift
              ? 'Saved shift details'
              : 'Additional details for shift (enter before clockin)'
          }
          contentEditable={isOnActiveShift}
          placeholder="Before starting shift. You can enter details like your ride partner, etc."
          className="w-full"
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
