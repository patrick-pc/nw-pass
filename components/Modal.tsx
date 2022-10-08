import { Fragment, ReactNode } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/solid'

interface ModalProps {
  isActive: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export default function Modal({ title, children, isActive, onClose }: ModalProps) {
  return (
    <Transition.Root show={isActive} as={Fragment}>
      <Dialog as="div" className="fixed z-40 inset-0 overflow-y-auto" onClose={onClose}>
        <div className="flex items-end sm:items-center justify-center h-screen w-screen">
          {/* Overlay */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40 transition-opacity" />
          </Transition.Child>

          {/* Content */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="bg-[#1F2022] border border-[#39393D] rounded-lg shadow-xl transform transition-all sm:max-w-sm w-full px-6 py-7">
              <div className="flex items-center justify-between">
                <button className="p-1 invisible">
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
                <div className="text-lg">{title && title}</div>
                <button
                  className="flex items-center justify-center rounded-full select-none cursor-pointer hover:bg-zinc-750 transition duration-300 ease-in-out p-1"
                  onClick={onClose}
                >
                  <XMarkIcon
                    className="h-6 w-6 stroke-[.5px] stroke-white text-white opacity-50"
                    aria-hidden="true"
                  />
                </button>
              </div>
              {children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
