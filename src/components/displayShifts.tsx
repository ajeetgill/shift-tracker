'use client'
import { LENGTH_OF_YEAR } from '@/utils/constants'
import { formatTime } from '@/utils/helpers'
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react'
type Shift = {
  id: React.Key
  startUnixTimeSecs: '1722983504'
  endUnixTimeSecs: null
}
const getShiftRow = (shift: Shift) => {
  // console.log('Shift', shift?.id!)
  const startTime = shift?.startUnixTimeSecs
  const startTimeStr: string = formatTime(startTime)
  const endTime = shift?.endUnixTimeSecs
  const endTimeStr: string = formatTime(endTime) ?? 'N/A'

  const t = startTime ? new Date(+startTime * 1000) : undefined
  const shiftDate = t
    ? t
        .toDateString()
        .substring(0, t.toDateString().length - LENGTH_OF_YEAR)
        .replace(' ', ',')
    : 'N/A'

  return (
    <TableRow key={shift?.id}>
      <TableCell>{shiftDate}</TableCell>
      <TableCell>{startTimeStr}</TableCell>
      <TableCell>{endTimeStr}</TableCell>
    </TableRow>
  )
}

const DisplayShifts = ({ allShifts }) => {
  return (
    <div>
      <Table aria-label="Example empty table">
        <TableHeader>
          <TableColumn>DATE</TableColumn>
          <TableColumn>START TIME</TableColumn>
          <TableColumn>END TIME</TableColumn>
        </TableHeader>
        <TableBody>
          {allShifts.map((shift: Shift) => getShiftRow(shift))}
        </TableBody>
      </Table>
    </div>
  )
}
export default DisplayShifts
