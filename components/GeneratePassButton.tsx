import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'

export default function GeneratePassButton({ generatePass, disabled }) {
  return (
    <Popover className="relative">
      <Popover.Button
        className="flex items-center justify-center bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg text-lg gap-2 px-4 py-2 focus:outline-none hover:scale-105 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={disabled}
      >
        <span>Generate Pass</span>
        <ChevronDownIcon className="h-6 w-6" aria-hidden="true" />
      </Popover.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-[300px] max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl">
          {({ close }) => (
            <div className="flex flex-col bg-[#1F2022] border border-[#39393D] rounded-lg shadow-xl p-6 gap-4">
              <button
                className="flex items-center justify-center text-lg rounded-lg bg-zinc-750 border border-[#3B3C3F] hover:bg-zinc-650 transition w-full px-4 py-3 gap-2"
                onClick={() => {
                  generatePass('apple')
                  close()
                }}
              >
                Apple Wallet
              </button>
              <button
                className="flex items-center justify-center text-lg rounded-lg bg-zinc-750 border border-[#3B3C3F] hover:bg-zinc-650 transition w-full px-4 py-3 gap-2"
                onClick={() => {
                  generatePass('google')
                  close()
                }}
              >
                Google Wallet
              </button>
            </div>
          )}
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}
