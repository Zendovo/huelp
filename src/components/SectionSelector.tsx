export default function SectionSelector({ closeSelector }: { closeSelector: Function }) {
  return (
    <div className="fixed top-0 bottom-0 h-full w-full inset-0 bg-neutral-900 bg-opacity-50 transition-opacity">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="bg-neutral-900 px-4 py-6 rounded-2xl">
          <div className="text-4xl font-bold">Select Sections</div>
          <div onClick={() => closeSelector()}>Close</div>
        </div>
      </div>
    </div>
  )
}