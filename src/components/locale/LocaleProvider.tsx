'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAppStore } from '@/store/appStore'
import type { Language, Currency } from '@/types'

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const { setLanguages, setCurrencies, currentLanguage, currentCurrency } = useAppStore()
  const supabase = createClient()

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    if (currentLanguage) {
      document.documentElement.lang = currentLanguage.code
      document.documentElement.dir = currentLanguage.direction
    }
  }, [currentLanguage])

  async function loadInitialData() {
    const [langRes, currRes] = await Promise.all([
      supabase.from('languages').select('*').eq('is_active', true).order('sort_order'),
      supabase.from('currencies').select('*').eq('is_active', true).order('sort_order'),
    ])

    if (langRes.data) setLanguages(langRes.data as Language[])
    if (currRes.data) setCurrencies(currRes.data as Currency[])
  }

  return <>{children}</>
}
