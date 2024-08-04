import Link from 'next/link'

const SecondaryLink = ({
  text,
  ...linkProps
}: {
  text: String
} & React.ComponentProps<typeof Link>) => {
  return (
    <Link
      className="text-sm w-max mx-auto hover:text-white text-[#b0b0b0] pb-1 px-2 border-b-1 border-b-[#b0b0b0]"
      {...linkProps}
    >
      {text}
    </Link>
  )
}
export default SecondaryLink
