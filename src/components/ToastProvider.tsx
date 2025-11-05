"use client";

import { ToastContainer, type TypeOptions } from "react-toastify";

import { XMarkIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";

import tw from "~/lib/tw";

const contextClass: Record<TypeOptions, string> = {
  success: tw`ring-2 ring-blue-600 text-blue-600 bg-blue-50`,
  error: tw`ring-2 ring-red-600 text-red-600 bg-red-50`,
  info: tw`ring-2 ring-gray-600 text-gray-600 bg-gray-50`,
  warning: tw`ring-2 ring-orange-600 text-orange-600 bg-orange-50`,
  default: tw`ring-2 ring-indigo-600 text-indigo-600 bg-indigo-50`,
};

export default function ToastProvider() {
  return (
    <ToastContainer
      style={{ padding: "1rem", display: "grid", gap: ".75rem" }}
      hideProgressBar
      closeButton={<XMarkIcon className="h-6 w-6 p-1" />}
      toastClassName={(ctx) =>
        clsx(
          contextClass[ctx?.type || "default"],
          "relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer",
        )
      }
    />
  );
}
