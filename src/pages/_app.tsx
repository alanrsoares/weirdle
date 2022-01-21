import { useEffect } from "react";
import clsx from "clsx";
import { XIcon } from "@heroicons/react/solid";
import type { AppProps } from "next/app";
import { toast, TypeOptions } from "react-toastify";

import "react-toastify/dist/ReactToastify.min.css";

import "../styles/globals.css";

const contextClass: Record<TypeOptions, string> = {
  success: "ring-2 ring-blue-600 text-blue-600 bg-blue-50",
  error: "ring-2 ring-red-600 text-red-600 bg-red-50",
  info: "ring-2 ring-gray-600 text-gray-600 bg-gray-50",
  warning: "ring-2 ring-orange-600 text-orange-600 bg-orange-50",
  default: "ring-2 ring-indigo-600 text-indigo-600 bg-indigo-50",
};

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    toast.configure({
      className: "md:p-[inherit] p-4",
      hideProgressBar: true,
      closeButton: <XIcon className="h-6 w-6 p-1" />,
      toastClassName: (ctx) =>
        clsx(
          contextClass[ctx?.type || "default"],
          "relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer"
        ),
    });
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
