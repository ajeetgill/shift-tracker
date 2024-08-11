'use client'

import { createBusinesses } from '@/db/dbTools'
import { CREATE_BUSINESS_MAX_ALLOWED } from '@/utils/constants'
import { Button, Input } from '@nextui-org/react'
import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { ListRestart, Plus } from 'lucide-react'
import Submit from './submitBtn'

export default function MultipleInput({ userId, fieldsName }) {
  const [allBusinessNames, setAllBusinessNames] = useState([''])
  const handleAddField = () => {
    if (allBusinessNames.length >= CREATE_BUSINESS_MAX_ALLOWED) {
      console.error(
        'Error: max businesse to add limit reached. MAX ALLOWED = ',
        CREATE_BUSINESS_MAX_ALLOWED,
      )
      return
    }
    setAllBusinessNames([...allBusinessNames, ''])
  }
  const handleRemoveField = (index: number) => {
    const updatedData = [...allBusinessNames]
    updatedData.splice(index, 1)
    setAllBusinessNames(updatedData)
  }
  const handleInputChange = (index: number, value: string) => {
    const updatedData = [...allBusinessNames]
    updatedData[index] = value
    setAllBusinessNames(updatedData)
  }
  const handleReset = () => {
    const updatedData = [...allBusinessNames.map((_val) => '')]
    setAllBusinessNames(updatedData)
  }

  const { pending } = useFormStatus()

  return (
    <form
      className="flex w-full max-w-[550px] flex-col items-center gap-6  rounded-md mx-auto bg-[#4504040]"
      action={async (formData: FormData) => {
        await createBusinesses(userId, formData)
      }}
    >
      <div className="space-y-4 w-full">
        {allBusinessNames.map((value, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              type="text"
              name={fieldsName}
              value={value}
              required
              placeholder="Your Business Name"
              onChange={(e) => handleInputChange(index, e.target.value)}
              className="flex-1"
            />
          </div>
        ))}

        <div className="hidden items-center content-center gap-2">
          <Button
            type="button"
            variant="bordered"
            className="w-full px-8 "
            onClick={handleAddField}
            isDisabled={allBusinessNames.length >= CREATE_BUSINESS_MAX_ALLOWED}
          >
            <Plus />
            Add Field
          </Button>
          <Button
            type="button"
            variant="bordered"
            onClick={handleReset}
            className="px-0 min-w-12"
          >
            <ListRestart />
          </Button>
        </div>
      </div>

      <Submit className="w-full mt-4" label="Add Business to Track shifts" />
    </form>
  )
}

/**
Todo:
for now simplified the add busienss interface to handle the Add-1 case
// <Button
//   type="button"
//   variant="flat"
//   className=" min-w-12 w-12 h-10"
//   onClick={() => handleRemoveField(index)}
//   isDisabled={allBusinessNames.length === 1}
// >
//   <MinusIcon className="w-4 h-4" />
// </Button>*/
