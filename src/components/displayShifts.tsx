'use client'
import { LENGTH_OF_YEAR } from '@/utils/constants'
import { formatTime } from '@/utils/helpers'
import {
  Button,
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
  notes: string | null
  business: { name: string }
}
const getShiftRow = (shift: Shift) => {
  // console.log('Shift', shift?.id!)
  const startTime = shift?.startUnixTimeSecs
  const startTimeStr: string = formatTime(startTime)
  const endTime = shift?.endUnixTimeSecs
  const endTimeStr: string = formatTime(endTime) ?? 'N/A'
  const notes: string = shift.notes ?? null

  const shiftLocationName = shift?.business?.name ?? 'N/A'

  const t = startTime ? new Date(+startTime * 1000) : undefined
  // the below string manipulation magic basically takes something which looks like (A) and gives back (B)
  // (A) = 'Tue Aug 20 2024' //  we get this from `t.toDateString()`
  // (B) = 'Aug 20, Tue'
  const shiftDate = t
    ? t
        .toDateString()
        .substring(0, t.toDateString().length - LENGTH_OF_YEAR)
        .replace(' ', ',')
        .trim()
        .split(',')[1]
    : 'N/A'

  return (
    <TableRow className="border-t-1 py-8 border-gray-600" key={shift?.id}>
      <TableCell className="align-baseline">{shiftDate}</TableCell>
      <TableCell className="align-baseline">{startTimeStr}</TableCell>
      <TableCell className="align-baseline">{endTimeStr}</TableCell>
      <TableCell className="align-baseline">{shiftLocationName}</TableCell>
      <TableCell className="align-baseline">{notes ?? '-'}</TableCell>
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
          <TableColumn>LOCATION</TableColumn>
          <TableColumn>NOTES</TableColumn>
        </TableHeader>
        <TableBody>
          {allShifts.map((shift: Shift) => getShiftRow(shift))}
        </TableBody>
      </Table>
    </div>
  )
}
export default DisplayShifts
