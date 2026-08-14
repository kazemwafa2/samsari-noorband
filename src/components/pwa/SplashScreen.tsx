'use client'

import { useEffect, useState } from 'react'

export function SplashScreen() {
  const [show, setShow] = useState(true)

  useEffect(() => {
    // مخفی کردن بعد از لود کامل
    const timer = setTimeout(() => {
      setShow(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (!show) return null

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-700"
      style={{ 
        transition: 'opacity 0.5s ease-out',
        opacity: show ? 1 : 0,
      }}
    >
      <div className="text-center text-white">
        {/* لوگو */}
        <div className="w-24 h-24 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center">
          <span className="text-4xl">🏪</span>
        </div>
        
        {/* نام */}
        <h1 className="text-2xl font-bold mb-2">سمساری نوربند جاغوری</h1>
        <p className="text-blue-200 text-sm">خرید و فروش مطمئن</p>
        
        {/* لودینگ */}
        <div className="mt-8 flex justify-center">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      </div>
    </div>
  )
}
