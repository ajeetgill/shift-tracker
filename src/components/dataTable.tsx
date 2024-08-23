'use client'
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from '@nextui-org/react'

const detailedShiftColumns = [
  {
    key: 'startDate',
    label: 'Start Date',
  },
  {
    key: 'startTimeAtlantic',
    label: 'Start Time',
  },
  {
    key: 'endTimeAtlantic',
    label: 'End Time',
  },
  {
    key: 'employeeName',
    label: 'Name',
  },
  {
    key: 'businessName',
    label: 'Location',
  },
  {
    key: 'notes',
    label: 'Additional Details',
  },
]

export default function DataTable({ allData }) {
  return (
    <div className="w-full space-y-4">
      <div className="rounded-md max-w-[1050px] mx-auto">
        <Table aria-label="Shift details of employees">
          <TableHeader columns={detailedShiftColumns}>
            {(column) => (
              <TableColumn
                className={`${column.key === 'notes' ? 'w-24' : 'w-max'}`}
                key={column.key}
              >
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody emptyContent={'No users found'} items={allData}>
            {(item: { id }) => (
              <TableRow key={item?.id}>
                {(columnKey) => (
                  <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
