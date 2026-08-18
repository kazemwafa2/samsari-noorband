'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Check, Truck, Package, XCircle, RotateCcw, Clock, CreditCard } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageProvider'
import { t } from '@/lib/i18n/dictionaries'

// نکته اصلاح‌شده (دو باگ واقعی):
// ۱) این کامپوننت با order_statuses.to_status_id(name, label_fa, color)
//    join می‌زد، در حالی‌که ستون‌های label_fa و color اصلا در جدول
//    order_statuses وجود نداشتند — یعنی این کوئری همیشه با خطا مواجه
//    می‌شد و تاریخچه هیچ‌وقت نمایش داده نمی‌شد.
// ۲) حتی اگر کوئری کار می‌کرد، مراحل این کامپوننت از واژگان
//    pending/confirmed/processing/shipped/delivered استفاده می‌کردند
//    در حالی‌که بقیه‌ی سایت (orders.status، order_status_history.status،
//    پنل مدیریت) همیشه از pending/paid/packing/shipping/completed
//    استفاده می‌کند — یعنی even در بهترین حالت، نوار پیشرفت هیچ‌وقت با
//    وضعیت واقعی سفارش هم‌خوانی نداشت.
// حالا هم واژگان یکی شد، هم به‌جای join شکسته مستقیم از ستون متنی
// status در order_status_history خوانده می‌شود، و همه برچسب‌ها چندزبانه‌اند.

interface StatusHistoryRow {
  id: number
  status: string
  created_at: string
}

interface OrderTrackerProps {
  orderId: string
}

const STEP_ORDER = ['pending', 'paid', 'packing', 'shipping', 'completed']

const STEP_ICONS: Record<string, any> = {
  pending: Clock,
  paid: CreditCard,
  packing: Package,
  shipping: Truck,
  completed: Check,
}

export function OrderTracker({ orderId }: OrderTrackerProps) {
  const { language } = useLanguage()
  const [statusHistory, setStatusHistory] = useState<StatusHistoryRow[]>([])
  const [currentStatus, setCurrentStatus] = useState<string>('pending')
  const supabase = createClient()

  useEffect(() => {
    async function loadStatusHistory() {
      const { data } = await supabase
        .from('order_status_history')
        .select('id, status, created_at')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true })

      if (data) {
        setStatusHistory(data)
        if (data.length > 0) {
          setCurrentStatus(data[data.length - 1].status)
        }
      }
    }

    loadStatusHistory()

    const subscription = supabase
      .channel(`order-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'order_status_history',
          filter: `order_id=eq.${orderId}`,
        },
        (payload) => {
          const row = payload.new as StatusHistoryRow
          setStatusHistory((prev) => [...prev, row])
          setCurrentStatus(row.status)
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [orderId])

  const currentStep = STEP_ORDER.indexOf(currentStatus)
  const isCancelled = currentStatus === 'cancelled'
  const isReturned = currentStatus === 'returned'

  function statusLabel(status: string) {
    switch (status) {
      case 'pending': return t('statusPending', language)
      case 'paid': return t('statusPaid', language)
      case 'packing': return t('statusPacking', language)
      case 'shipping': return t('statusShipping', language)
      case 'completed': return t('statusCompleted', language)
      case 'cancelled': return t('statusCancelled', language)
      case 'returned': return t('statusReturned', language)
      default: return status
    }
  }

  if (isCancelled) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <XCircle className="w-12 h-12 mx-auto text-red-500 mb-2" />
        <h3 className="text-lg font-semibold text-red-700">{t('orderCancelledNotice', language)}</h3>
      </div>
    )
  }

  if (isReturned) {
    return (
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
        <RotateCcw className="w-12 h-12 mx-auto text-orange-500 mb-2" />
        <h3 className="text-lg font-semibold text-orange-700">{t('orderReturnedNotice', language)}</h3>
      </div>
    )
  }

  return (
    <div className="py-6">
      {/* نوار پیشرفت */}
      <div className="relative">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
          <div
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${(Math.max(currentStep, 0) / (STEP_ORDER.length - 1)) * 100}%` }}
          />
        </div>

        <div className="relative flex justify-between">
          {STEP_ORDER.map((step, index) => {
            const Icon = STEP_ICONS[step]
            const isCompleted = index <= currentStep
            const isCurrent = index === currentStep

            return (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 transition-all ${
                    isCompleted
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : isCurrent
                        ? 'bg-white border-blue-500 text-blue-500'
                        : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <p className={`text-xs mt-2 text-center ${
                  isCompleted ? 'text-blue-600 font-medium' : 'text-gray-400'
                }`}>
                  {statusLabel(step)}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* تاریخچه */}
      {statusHistory.length > 0 && (
        <div className="mt-8 space-y-4">
          <h3 className="font-semibold">{t('orderStatusHistoryTitle', language)}</h3>
          {statusHistory.map((history, index) => (
            <div key={history.id} className="flex gap-3 items-start">
              <div className="relative flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full mt-1.5 ${
                  index === statusHistory.length - 1 ? 'bg-blue-500' : 'bg-gray-300'
                }`} />
                {index < statusHistory.length - 1 && (
                  <div className="w-0.5 h-full bg-gray-200 absolute top-4" />
                )}
              </div>
              <div>
                <p className="font-medium text-sm">{statusLabel(history.status)}</p>
                <p className="text-gray-400 text-xs">
                  {new Date(history.created_at).toLocaleString(language === 'en' ? 'en-US' : 'fa-IR')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
