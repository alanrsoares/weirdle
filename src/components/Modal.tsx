import { FC, Fragment, ReactNode, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import clsx from "clsx";

import { XIcon } from "@heroicons/react/solid";

export type Props = {
  open: boolean;
  title: ReactNode;
  onClose(open: boolean): void;
  actionLabel?: string;
};

const Modal: FC<Props> = (props) => {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={props.open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={props.onClose}
      >
        <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="backdrop-blur-xs fixed inset-0 bg-gray-500/50 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              className={clsx(
                "relative inline-block transform overflow-hidden rounded-2xl text-left align-bottom shadow-xl",
                "transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle"
              )}
            >
              <div className="bg-white px-4 pt-5 pb-4 dark:bg-slate-800 dark:text-white sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 w-full text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold uppercase leading-6 text-gray-900 dark:text-slate-100"
                    >
                      {props.title}
                    </Dialog.Title>
                    <div className="grid w-full place-items-center pt-4">
                      {props.children}
                    </div>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="absolute top-0 right-0 m-1 h-8 w-8 rounded-full bg-gray-300/30 p-1 transition-colors hover:bg-gray-300 md:m-3"
                onClick={props.onClose.bind(null, false)}
              >
                <XIcon />
              </button>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;
