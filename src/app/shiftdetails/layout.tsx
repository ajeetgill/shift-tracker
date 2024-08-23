import SignOutBtn from '@/components/signOutButton'
import { Link } from '@nextui-org/react'
import { ChevronLeft } from 'lucide-react'

const ShiftDetailsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col gap-8 w-full h-full  mx-auto">
      <Link href="/">
        <ChevronLeft /> Home
      </Link>
      <div className="w-full ">{children}</div>
      <SignOutBtn />
    </div>
  )
}
export default ShiftDetailsLayout
