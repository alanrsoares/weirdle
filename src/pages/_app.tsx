import { useEffect } from "react";
import clsx from "clsx";
import { XIcon } from "@heroicons/react/solid";
import type { AppProps } from "next/app";
import Head from "next/head";
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
      style: { padding: "1rem", display: "grid", gap: ".75rem" },
      hideProgressBar: true,
      closeButton: <XIcon className="h-6 w-6 p-1" />,
      toastClassName: (ctx) =>
        clsx(
          contextClass[ctx?.type || "default"],
          "relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer"
        ),
    });
  }, []);

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta name="description" content="Wordle - a word puzzle game" />
        <meta name="keywords" content="wordle, puzzle, game" />
        <title>Wordle</title>
        <link rel="manifest" href="/manifest.json" />
        <link
          href="/icons/icon-32.png"
          rel="icon"
          type="image/png"
          sizes="32x32"
        />
        <link rel="apple-touch-icon" href="/icons/icon-192.png"></link>
        <meta name="theme-color" content="#6aaa64" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
