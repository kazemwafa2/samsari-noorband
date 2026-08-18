'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAppStore } from '@/store/appStore'
import { Globe, DollarSign, ChevronDown } from 'lucide-react'
import type { Language, Currency } from '@/types'

export function LocaleSelector() {
  const supabase = createClient()
  const {
    currentLanguage,
    languages,
    setCurrentLanguage,
    setLanguages,
    currentCurrency,
    currencies,
    setCurrentCurrency,
    setCurrencies,
  } = useAppStore()

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const [langRes, currRes] = await Promise.all([
      supabase.from('languages').select('*').eq('is_active', true).order('sort_order'),
      supabase.from('currencies').select('*').eq('is_active', true).order('sort_order'),
    ])

    if (langRes.data) setLanguages(langRes.data as Language[])
    if (currRes.data) setCurrencies(currRes.data as Currency[])
  }

  async function changeLanguage(language: Language) {
    setCurrentLanguage(language)
    
    // ذخیره در localStorage و بروزرسانی HTML
    document.documentElement.lang = language.code
    document.documentElement.dir = language.direction
    
    // به‌روزرسانی پروفایل کاربر (اگر لاگین است)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase
        .from('profiles')
        .update({ preferred_language: language.code })
        .eq('id', user.id)
    }
    
    // رفرش صفحه برای اعمال ترجمه‌ها
    window.location.reload()
  }

  async function changeCurrency(currency: Currency) {
    setCurrentCurrency(currency)
    
    // ذخیره در localStorage
    localStorage.setItem('preferred_currency', currency.code)
  }

  return (
    <div className="flex items-center gap-2">
      {/* سلکتور زبان */}
      <div className="relative group">
        <button className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50">
          <Globe className="w-4 h-4" />
          <span>{currentLanguage?.name_local || currentLanguage?.name}</span>
          <ChevronDown className="w-3 h-3" />
        </button>
        
        <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg hidden group-hover:block min-w-[150px] z-50">
          {languages.map(lang => (
            <button
              key={lang.id}
              onClick={() => changeLanguage(lang)}
              className={`w-full text-right px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${
                currentLanguage?.id === lang.id ? 'bg-blue-50 text-blue-600' : ''
              }`}
            >
              <span>{lang.name_local || lang.name}</span>
              {lang.is_default && (
                <span className="text-xs text-gray-400">(پیش‌فرض)</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* سلکتور ارز */}
      <div className="relative group">
        <button className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50">
          <DollarSign className="w-4 h-4" />
          <span>{currentCurrency?.symbol} {currentCurrency?.code}</span>
          <ChevronDown className="w-3 h-3" />
        </button>
        
        <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg hidden group-hover:block min-w-[150px] z-50">
          {currencies.map(curr => (
            <button
              key={curr.id}
              onClick={() => changeCurrency(curr)}
              className={`w-full text-right px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${
                currentCurrency?.id === curr.id ? 'bg-blue-50 text-blue-600' : ''
              }`}
            >
              <span>{curr.symbol}</span>
              <span>{curr.name_fa || curr.name}</span>
              <span className="text-xs text-gray-400">({curr.code})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
