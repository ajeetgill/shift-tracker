import SignOutBtn from '@/components/signOutButton'
import { Link } from '@nextui-org/react'
import { ChevronLeft } from 'lucide-react'

const BusinessesLayout = ({
  children,
  allBusinesses,
}: {
  children: React.ReactNode
  allBusinesses: React.ReactNode
}) => {
  return (
    <div className="flex flex-col gap-20 w-full h-full max-w-[550px] mx-auto">
      <Link href="/">
        <ChevronLeft /> Home
      </Link>
      <div className="w-full ">{children}</div>
      <div className="w-full border-r border-default-50">{allBusinesses}</div>
      <SignOutBtn />
    </div>
  )
}
export default BusinessesLayout
