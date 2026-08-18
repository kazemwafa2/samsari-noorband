'use client'

import { useState } from 'react'
import { useLocation } from '@/hooks/useLocation'
import { Select } from '@/components/ui/select'
import { MapPin, ChevronDown } from 'lucide-react'
import type { Country, Province, District, City } from '@/types'

interface LocationSelectorProps {
  countryId?: string
  provinceId?: string
  districtId?: string
  cityId?: string
  onChange: (data: {
    countryId?: string
    provinceId?: string
    districtId?: string
    cityId?: string
  }) => void
  showCountry?: boolean
  showCity?: boolean
  labels?: {
    country?: string
    province?: string
    district?: string
    city?: string
  }
}

export function LocationSelector({
  countryId,
  provinceId,
  districtId,
  cityId,
  onChange,
  showCountry = true,
  showCity = false,
  labels = {
    country: 'کشور',
    province: 'ولایت / استان',
    district: 'ولسوالی / شهرستان',
    city: 'شهر / منطقه',
  },
}: LocationSelectorProps) {
  const { countries, provinces, districts, cities, loadProvinces, loadDistricts, loadCities } = useLocation()
  const [selectedCountry, setSelectedCountry] = useState(countryId || '')
  const [selectedProvince, setSelectedProvince] = useState(provinceId || '')
  const [selectedDistrict, setSelectedDistrict] = useState(districtId || '')

  async function handleCountryChange(value: string) {
    setSelectedCountry(value)
    setSelectedProvince('')
    setSelectedDistrict('')
    onChange({ countryId: value, provinceId: undefined, districtId: undefined, cityId: undefined })
    if (value) await loadProvinces(value)
  }

  async function handleProvinceChange(value: string) {
    setSelectedProvince(value)
    setSelectedDistrict('')
    onChange({ countryId: selectedCountry, provinceId: value, districtId: undefined, cityId: undefined })
    if (value) await loadDistricts(value)
  }

  async function handleDistrictChange(value: string) {
    setSelectedDistrict(value)
    onChange({ countryId: selectedCountry, provinceId: selectedProvince, districtId: value, cityId: undefined })
    if (value && showCity) await loadCities(value)
  }

  function handleCityChange(value: string) {
    onChange({ 
      countryId: selectedCountry, 
      provinceId: selectedProvince, 
      districtId: selectedDistrict,
      cityId: value || undefined,
    })
  }

  return (
    <div className="space-y-3">
      {showCountry && (
        <div>
          <label className="block text-sm font-medium mb-1">{labels.country}</label>
          <select
            value={selectedCountry}
            onChange={(e) => handleCountryChange(e.target.value)}
            className="w-full border rounded-md p-2 text-sm"
          >
            <option value="">انتخاب کشور</option>
            {countries.map(country => (
              <option key={country.id} value={country.id}>
                {country.name_fa || country.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">{labels.province}</label>
        <select
          value={selectedProvince}
          onChange={(e) => handleProvinceChange(e.target.value)}
          className="w-full border rounded-md p-2 text-sm"
          disabled={!selectedCountry}
        >
          <option value="">انتخاب کنید</option>
          {provinces.map(province => (
            <option key={province.id} value={province.id}>
              {province.name_fa || province.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">{labels.district}</label>
        <select
          value={selectedDistrict}
          onChange={(e) => handleDistrictChange(e.target.value)}
          className="w-full border rounded-md p-2 text-sm"
          disabled={!selectedProvince}
        >
          <option value="">انتخاب کنید</option>
          {districts.map(district => (
            <option key={district.id} value={district.id}>
              {district.name_fa || district.name}
            </option>
          ))}
        </select>
      </div>

      {showCity && (
        <div>
          <label className="block text-sm font-medium mb-1">{labels.city}</label>
          <select
            value={cityId || ''}
            onChange={(e) => handleCityChange(e.target.value)}
            className="w-full border rounded-md p-2 text-sm"
            disabled={!selectedDistrict}
          >
            <option value="">انتخاب کنید</option>
            {cities.map(city => (
              <option key={city.id} value={city.id}>
                {city.name_fa || city.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}
