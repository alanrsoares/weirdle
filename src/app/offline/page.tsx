"use client";

import Link from "next/link";

import { Button } from "~/components/ui/button";
import { APP_NAME } from "~/stores/game/constants";

export default function OfflinePage() {
  return (
    <>
      <header className="w-full border-b border-brand/20 bg-brand shadow-sm dark:border-gray-800/50">
        <div className="m-auto flex max-w-lg items-center justify-center px-4 py-3.5">
          <div className="pointer-events-none text-center text-3xl font-bold tracking-[0.2em] text-white uppercase md:text-4xl">
            {APP_NAME}
          </div>
        </div>
      </header>
      <main className="m-auto flex max-w-lg flex-1 flex-col items-center justify-center px-4 py-6 md:py-8">
        <div className="w-full max-w-md text-center">
          <div className="mb-6 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/10">
              <svg
                className="h-8 w-8 text-brand"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
                />
              </svg>
            </div>
          </div>
          <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
            You&apos;re Offline
          </h1>
          <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
            It looks like you&apos;re not connected to the internet. Please
            check your connection and try again.
          </p>
          <Button
            asChild
            size="lg"
            className="shadow-md transition-shadow hover:shadow-lg"
          >
            <Link href="/">Try Again</Link>
          </Button>
        </div>
      </main>
    </>
  );
}
