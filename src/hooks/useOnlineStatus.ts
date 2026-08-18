'use client'

import { useState, useEffect } from 'react'

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [wasOffline, setWasOffline] = useState(false)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      setIsOnline(true)
      setWasOffline(true)
      
      // نوتیفیکیشن بازگشت آنلاین
      if (wasOffline) {
        if ('notification' in window && Notification.permission === 'granted') {
          new Notification('اتصال برقرار شد!', {
            body: 'شما دوباره آنلاین شدید',
            icon: '/icons/icon-192x192.png',
          })
        }
      }
      
      // رفرش خودکار بعد از ۲ ثانیه
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setWasOffline(true)
      
      if ('notification' in window && Notification.permission === 'granted') {
        new Notification('اتصال قطع شد!', {
          body: 'شما آفلاین شدید. برخی از بخش‌ها در دسترس نیستند.',
          icon: '/icons/icon-192x192.png',
        })
      }
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return { isOnline, wasOffline }
}
