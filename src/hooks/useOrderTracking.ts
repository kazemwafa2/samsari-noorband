'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Order, OrderStatusHistory } from '@/types'

// اصلاح: این هوک به جدول "deliveries" و رابطه status:status_id ارجاع
// می‌داد که در schema.sql وجود ندارند (اطلاعات تحویل مستقیم روی خود
// orders است: delivery_status/delivery_code). چون ردیابی زنده سفارش
// همین الان توسط <OrderTracker/> در src/app/site/orders/[id]/page.tsx
// انجام می‌شود، این هوک فعلا در هیچ صفحه‌ای وصل نیست — فقط برای
// استفاده احتمالی بعدی (مثلا در پنل ادمین) درست شد تا با اسکیمای واقعی
// یکی باشد.
export function useOrderTracking(orderId: string) {
  const [order, setOrder] = useState<Order | null>(null)
  const [statusHistory, setStatusHistory] = useState<OrderStatusHistory[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!orderId) return

    async function loadOrder() {
      const { data } = await supabase
        .from('orders')
        .select('*, status:status_id(*), items:order_items(*)')
        .eq('id', orderId)
        .single()

      if (data) {
        setOrder(data as Order)
      }
      setLoading(false)
    }

    async function loadHistory() {
      const { data } = await supabase
        .from('order_status_history')
        .select('*, to_status:to_status_id(*), from_status:from_status_id(*)')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true })

      if (data) {
        setStatusHistory(data as OrderStatusHistory[])
      }
    }

    loadOrder()
    loadHistory()

    // کانال زنده برای تغییرات
    const channel = supabase
      .channel(`order-tracking-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          setOrder((prev) => ({ ...prev, ...(payload.new as Order) }))
        }
      )
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
      supabase.removeChannel(channel)
    }
  }, [orderId])

  return { order, statusHistory, loading }
}
