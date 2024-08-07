import SignOutBtn from '@/components/signOutButton'

const Dashboard = ({
  children,
  allShifts,
}: {
  children: React.ReactNode
  allShifts: React.ReactNode
}) => {
  return (
    <div className="flex flex-col gap-20 w-full h-full max-w-[550px] mx-auto">
      <div className="w-full ">{children}</div>
      <div className="w-full border-r border-default-50">{allShifts}</div>
      <SignOutBtn />
    </div>
  )
}
export default Dashboard
