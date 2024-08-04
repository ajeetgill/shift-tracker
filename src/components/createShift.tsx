import { Input } from '@nextui-org/react'
import Submit from './submitBtn'

const CreateShift = async () => {
  return (
    <div>
      <h1 className="text-xl uppercase font-bold py-6">Create Shift</h1>
      <form className="bg-content1 border border-default-100 shadow-lg rounded-md p-3 flex flex-col gap-2 ">
        <h3 className="my-4">Clockin shift</h3>
        <Input
          fullWidth
          required
          size="lg"
          placeholder="shiftTime"
          name="shiftStartTime"
          type="tel"
        />
        <Input
          name="shiftDate"
          fullWidth
          required
          size="lg"
          placeholder="shiftDate"
        />
        <Submit label={'Clockin'} />
      </form>
    </div>
  )
}
export default CreateShift
