'use client'
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/table'
type Shift = {
  id: React.Key
  startUnixTimeSecs: '1722983504'
  endUnixTimeSecs: null
}

const DisplayBusinesses = ({ displayData }) => {
  return (
    <div>
      <Table aria-label="Example empty table">
        <TableHeader>
          <TableColumn className="w-8">SR.NO.</TableColumn>
          <TableColumn>BUSINESS NAME</TableColumn>
        </TableHeader>
        <TableBody>
          {displayData.map((item, index) => (
            <TableRow key={item?.id}>
              <TableCell>{+index + 1} )</TableCell>
              <TableCell>{item?.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
export default DisplayBusinesses
