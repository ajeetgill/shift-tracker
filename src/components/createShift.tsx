'use client'
import { useCallback, useEffect, useState } from 'react'
import { useFormState } from 'react-dom'
import { clockInShift } from '@/actions/shifts'
import { Chip, Input } from '@nextui-org/react'
import Submit from './submitBtn'

const initState = { message: null }

const CreateShift = ({ name }: { name: string }) => {
  const currentDate = `${new Date().toDateString()}`
  const [currentUnixTime, setCurrentUnixTime] = useState(new Date().getTime())
  useEffect(() => {
    const increaseTimer = setInterval(() => {
      setCurrentUnixTime(new Date().getTime())
    }, 1000)
    return () => clearInterval(increaseTimer)
  }, [])
  useEffect(() => {
    const increaseTimer = setInterval(() => {
      setCurrentUnixTime(new Date().getTime())
    }, 1000)
    return () => clearInterval(increaseTimer)
  }, [])
  const [hr, setHr] = useState('☀️ 8 AM')
  useEffect(() => {
    let currTime = new Date(currentUnixTime)
      .toLocaleTimeString()
      .substring(0, 5)
    const hr = Number(currTime.substring(0, 2))
    const hr12fmt = hr > 12 ? `🌕 ${hr - 12} PM` : `☀️ ${hr} AM`

    setHr(hr12fmt)
  }, [currentUnixTime])

  const displayTime = useCallback(() => {
    let currTime = new Date(currentUnixTime)
      .toLocaleTimeString()
      .substring(0, 5)
    return currTime
  }, [currentUnixTime])

  const [formState, action] = useFormState(clockInShift, initState)
  const [businessName, setName] = useState('PEI Farms')

  return (
    <div>
      <h3 className="my-4 text-2xl font-bold capitalize py-2">Clockin shift</h3>

      <form
        action={action}
        className="bg-content1 border border-default-100 shadow-lg rounded-md p-3 flex flex-col gap-8"
      >
        <div>
          <h5 className="my-4 text-lg font-bold capitalize py-2">Hi, {name}</h5>
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
          name="shiftStartUnixTimeMS"
          className="hidden"
          value={currentUnixTime}
        />
        <input
          required
          disabled
          contentEditable="false"
          className="w-full text-center font-semibold text-5xl bg-[#27272a] rounded-2xl py-2 pointer-events-none"
          placeholder="shiftTime"
          value={displayTime()}
          type="text"
        />

        <Submit label={'Clockin'} />
      </form>
    </div>
  )
}
export default CreateShift
