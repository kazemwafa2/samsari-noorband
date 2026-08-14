import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Language, Currency } from '@/types'

interface AppStore {
  // زبان
  currentLanguage: Language | null
  languages: Language[]
  setCurrentLanguage: (language: Language) => void
  setLanguages: (languages: Language[]) => void
  
  // ارز
  currentCurrency: Currency | null
  currencies: Currency[]
  setCurrentCurrency: (currency: Currency) => void
  setCurrencies: (currencies: Currency[]) => void
  
  // جهت صفحه
  direction: 'rtl' | 'ltr'
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // زبان
      currentLanguage: null,
      languages: [],
      setCurrentLanguage: (language) => set({ 
        currentLanguage: language,
        direction: language.direction || 'rtl',
      }),
      setLanguages: (languages) => {
        const defaultLang = languages.find(l => l.is_default) || languages[0]
        set({ 
          languages,
          currentLanguage: get().currentLanguage || defaultLang,
          direction: (get().currentLanguage || defaultLang).direction || 'rtl',
        })
      },
      
      // ارز
      currentCurrency: null,
      currencies: [],
      setCurrentCurrency: (currency) => set({ currentCurrency: currency }),
      setCurrencies: (currencies) => {
        const defaultCurrency = currencies.find(c => c.is_default) || currencies[0]
        set({ 
          currencies,
          currentCurrency: get().currentCurrency || defaultCurrency,
        })
      },
      
      // جهت
      direction: 'rtl',
    }),
    {
      name: 'samsari-app',
      partialize: (state) => ({
        currentLanguage: state.currentLanguage?.code,
        currentCurrency: state.currentCurrency?.code,
      }),
    }
  )
)
