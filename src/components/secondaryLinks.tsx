import Link from 'next/link'

const SecondaryLink = ({ text, link }: { text: String; link: String }) => {
  return (
    <Link
      className="text-sm  hover:text-white text-[#b0b0b0] pb-1 px-2 border-b-1 border-b-[#b0b0b0]"
      href={`${link}`}
    >
      {text}
    </Link>
  )
}
export default SecondaryLink
