'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Country, Province, District, City } from '@/types'

export function useLocation() {
  const supabase = createClient()
  const [countries, setCountries] = useState<Country[]>([])
  const [provinces, setProvinces] = useState<Province[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(false)

  // بارگذاری کشورها
  useEffect(() => {
    async function loadCountries() {
      const { data } = await supabase
        .from('countries')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')
      
      if (data) setCountries(data)
    }
    loadCountries()
  }, [])

  // بارگذاری ولایت‌ها/استان‌ها
  async function loadProvinces(countryId: string) {
    setLoading(true)
    const { data } = await supabase
      .from('provinces')
      .select('*')
      .eq('country_id', countryId)
      .eq('is_active', true)
      .order('sort_order')
    
    if (data) setProvinces(data)
    setDistricts([])
    setCities([])
    setLoading(false)
  }

  // بارگذاری ولسوالی‌ها/شهرستان‌ها
  async function loadDistricts(provinceId: string) {
    setLoading(true)
    const { data } = await supabase
      .from('districts')
      .select('*')
      .eq('province_id', provinceId)
      .eq('is_active', true)
      .order('sort_order')
    
    if (data) setDistricts(data)
    setCities([])
    setLoading(false)
  }

  // بارگذاری شهرها/مناطق
  async function loadCities(districtId: string) {
    setLoading(true)
    const { data } = await supabase
      .from('cities')
      .select('*')
      .eq('district_id', districtId)
      .eq('is_active', true)
    
    if (data) setCities(data)
    setLoading(false)
  }

  return {
    countries,
    provinces,
    districts,
    cities,
    loading,
    loadProvinces,
    loadDistricts,
    loadCities,
  }
}
