'use client'

import { useEffect, useState } from 'react'
import { WifiOff, RefreshCw, Home, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

function Button({
  children,
  className = '',
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl bg-blue-600 text-white hover:opacity-90 transition ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <WifiOff className="w-16 h-16 mx-auto text-green-400 mb-4" />

          <h1 className="text-2xl font-bold mb-2">
            اتصال برقرار است!
          </h1>

          <p className="text-gray-500 mb-6">
            شما آنلاین هستید و می‌توانید به مرور ادامه دهید
          </p>

          <Button>
            <Link href="/" className="flex items-center">
              <Home className="w-4 h-4 ml-2" />
              بازگشت به صفحه اصلی
            </Link>
          </Button>

        </div>
      </div>
    )
  }


  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">

      <div className="max-w-md text-center">

        <div className="w-24 h-24 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
          <WifiOff className="w-12 h-12 text-orange-500" />
        </div>


        <h1 className="text-2xl font-bold mb-2">
          اتصال اینترنت برقرار نیست
        </h1>


        <p className="text-gray-500 mb-8">
          شما به اینترنت متصل نیستید. پس از اتصال دوباره تلاش کنید.
        </p>


        <div className="grid grid-cols-2 gap-3 mb-8">

          <Link
            href="/"
            className="bg-white p-4 rounded-xl border hover:shadow transition"
          >
            <Home className="w-6 h-6 mx-auto mb-2 text-blue-500" />
            <span className="text-sm font-medium">
              صفحه اصلی
            </span>
          </Link>


          <Link
            href="/products"
            className="bg-white p-4 rounded-xl border hover:shadow transition"
          >
            <ShoppingBag className="w-6 h-6 mx-auto mb-2 text-green-500" />
            <span className="text-sm font-medium">
              محصولات
            </span>
          </Link>

        </div>


        <div className="flex gap-3 justify-center">

          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 ml-2 inline" />
            تلاش مجدد
          </Button>


          <Button>
            <Link href="/" className="flex items-center">
              <Home className="w-4 h-4 ml-2" />
              صفحه اصلی
            </Link>
          </Button>

        </div>

      </div>

    </div>
  )
}
