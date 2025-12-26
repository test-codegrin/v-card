'use client';

import Link from 'next/link';
import { Home, ArrowLeft, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="h-full  flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Decorative elements */}
        <div className="relative mb-8">
          <div className="absolute -top-10 -left-10 h-32 w-32 bg-[#9f2b34]/5 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-8 -right-8 h-24 w-24 bg-[#9f2b34]/10 rounded-full blur-xl"></div>
          
          <div className="relative">
            <div className="h-40 w-40 mx-auto mb-6 flex items-center justify-center">
              <div className="absolute h-full w-full bg-gradient-to-br from-[#9f2b34]/20 to-[#9f2b34]/5 rounded-full animate-pulse"></div>
              <AlertTriangle className="h-24 w-24 text-[#9f2b34]" />
            </div>
          </div>
        </div>

        {/* Error code */}
        <div className="mb-4">
          <h1 className="text-8xl md:text-9xl font-bold text-gray-900 leading-none">
            4<span className="text-[#9f2b34]">0</span>4
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-[#9f2b34] to-[#9f2b34]/70 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Error message */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            Oops! The page you're looking for seems to have wandered off into the digital void.
          </p>
          <p className="text-sm text-gray-500">
            Don't worry, let's get you back on track.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="group flex items-center justify-center gap-2 bg-[#9f2b34] text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-[#9f2b34]/90 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          >
            <Home className="h-5 w-5" />
            Go to Homepage
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="group flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-6 py-3.5 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          >
            <ArrowLeft className="h-5 w-5" />
            Go Back
          </button>
        </div>

        {/* Helpful links */}
        <div className="mt-10 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Need help finding something?</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/dashboard"
              className="text-sm text-[#9f2b34] hover:text-[#9f2b34]/80 font-medium hover:underline"
            >
              Dashboard
            </Link>
            <Link
              href="/cards/new"
              className="text-sm text-[#9f2b34] hover:text-[#9f2b34]/80 font-medium hover:underline"
            >
              Create v-Card
            </Link>
           
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-8 text-xs text-gray-400">
          If you believe this is an error, please{' '}
          <a href="mailto:support@example.com" className="text-[#9f2b34] hover:underline">
            contact our support team
          </a>
        </p>
      </div>

      {/* Background pattern */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 bg-[#9f2b34]/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 bg-[#9f2b34]/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}