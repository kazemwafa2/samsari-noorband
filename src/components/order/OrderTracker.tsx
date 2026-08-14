'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Check, Truck, Package, XCircle, RotateCcw, Clock } from 'lucide-react'
import type { Order, OrderStatusHistory } from '@/types'

const statusIcons: Record<string, any> = {
  pending: Clock,
  confirmed: Package,
  processing: Package,
  shipped: Truck,
  delivered: Check,
  cancelled: XCircle,
  returned: RotateCcw,
}

interface OrderTrackerProps {
  orderId: string
}

export function OrderTracker({ orderId }: OrderTrackerProps) {
  const [statusHistory, setStatusHistory] = useState<OrderStatusHistory[]>([])
  const [currentStatus, setCurrentStatus] = useState<string>('')
  const supabase = createClient()

  useEffect(() => {
    async function loadStatusHistory() {
      const { data } = await supabase
        .from('order_status_history')
        .select('*, to_status:to_status_id(name, label_fa, color)')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true })
      
      if (data) {
        setStatusHistory(data)
        if (data.length > 0) {
          setCurrentStatus(data[data.length - 1].to_status?.name || '')
        }
      }
    }

    loadStatusHistory()

    // گوش دادن به تغییرات زنده
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
          setStatusHistory(prev => [...prev, payload.new as OrderStatusHistory])
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [orderId])

  const getStatusStep = (statusName: string) => {
    const steps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']
    return steps.indexOf(statusName)
  }

  const currentStep = getStatusStep(currentStatus)
  const isCancelled = currentStatus === 'cancelled'
  const isReturned = currentStatus === 'returned'

  if (isCancelled) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <XCircle className="w-12 h-12 mx-auto text-red-500 mb-2" />
        <h3 className="text-lg font-semibold text-red-700">سفارش لغو شده است</h3>
        <p className="text-red-600 text-sm">
          این سفارش در تاریخ {new Date(statusHistory[statusHistory.length - 1]?.created_at).toLocaleDateString('fa')} لغو شده است
        </p>
      </div>
    )
  }

  if (isReturned) {
    return (
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
        <RotateCcw className="w-12 h-12 mx-auto text-orange-500 mb-2" />
        <h3 className="text-lg font-semibold text-orange-700">سفارش مرجوع شده است</h3>
      </div>
    )
  }

  const steps = [
    { name: 'pending', label: 'در انتظار تأیید' },
    { name: 'confirmed', label: 'تأیید شده' },
    { name: 'processing', label: 'در حال پردازش' },
    { name: 'shipped', label: 'ارسال شده' },
    { name: 'delivered', label: 'تحویل شده' },
  ]

  return (
    <div className="py-6">
      {/* نوار پیشرفت */}
      <div className="relative">
        {/* خط زمینه */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
          <div 
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* مراحل */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const Icon = statusIcons[step.name]
            const isCompleted = index <= currentStep
            const isCurrent = index === currentStep

            return (
              <div key={step.name} className="flex flex-col items-center">
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
                  {step.label}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* تاریخچه */}
      <div className="mt-8 space-y-4">
        <h3 className="font-semibold">تاریخچه وضعیت</h3>
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
              <p className="font-medium text-sm">{history.to_status?.label_fa || history.to_status?.name}</p>
              {history.note && (
                <p className="text-gray-500 text-xs">{history.note}</p>
              )}
              <p className="text-gray-400 text-xs">
                {new Date(history.created_at).toLocaleString('fa')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
