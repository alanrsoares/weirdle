import {
  Fragment,
  useRef,
  type FC,
  type PropsWithChildren,
  type ReactNode,
} from "react";

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";

export type Props = PropsWithChildren<{
  open: boolean;
  title: ReactNode;
  onClose: (open: boolean) => void;
  actionLabel?: string;
}>;

const Modal: FC<Props> = (props) => {
  const cancelButtonRef = useRef(null);

  return (
    <Transition show={props.open} as={Fragment}>
      <Dialog
        className="relative z-10"
        onClose={props.onClose}
        initialFocus={cancelButtonRef}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500/50 backdrop-blur-xs transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel
                className={clsx(
                  "relative transform overflow-hidden rounded-2xl bg-white text-left align-bottom shadow-xl transition-all",
                  "dark:bg-slate-800 dark:text-white",
                  "sm:my-8 sm:w-full sm:max-w-lg sm:align-middle",
                )}
              >
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 w-full text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <DialogTitle
                        as="h3"
                        className="text-lg leading-6 font-semibold text-gray-900 uppercase dark:text-slate-100"
                      >
                        {props.title}
                      </DialogTitle>
                      <div className="grid w-full place-items-center pt-4">
                        {props.children}
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  ref={cancelButtonRef}
                  className="absolute top-0 right-0 m-1 h-8 w-8 rounded-full bg-gray-300/30 p-1 transition-colors hover:bg-gray-300 md:m-3"
                  onClick={() => props.onClose(false)}
                >
                  <XMarkIcon className="h-full w-full" />
                </button>
              </DialogPanel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
