'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface SEOHeadProps {
  title?: string
  description?: string
  image?: string
  type?: string
  noIndex?: boolean
  breadcrumbs?: {
    name: string
    url: string
  }[]
}

export function SEOHead({
  title,
  description,
  image,
  type = 'website',
  noIndex = false,
}: SEOHeadProps) {

  const pathname = usePathname()

  useEffect(() => {

    if (title) {
      document.title = title
    }

    const setMeta = (name: string, content: string) => {
      let element = document.querySelector(
        `meta[name="${name}"]`
      ) as HTMLMetaElement | null

      if (!element) {
        element = document.createElement('meta')
        element.setAttribute('name', name)
        document.head.appendChild(element)
      }

      element.setAttribute('content', content)
    }

    const setProperty = (property: string, content: string) => {
      let element = document.querySelector(
        `meta[property="${property}"]`
      ) as HTMLMetaElement | null

      if (!element) {
        element = document.createElement('meta')
        element.setAttribute('property', property)
        document.head.appendChild(element)
      }

      element.setAttribute('content', content)
    }

    if (description) {
      setMeta('description', description)
    }

    if (title) {
      setProperty('og:title', title)
    }

    if (description) {
      setProperty('og:description', description)
    }

    if (type) {
      setProperty('og:type', type)
    }

    if (image) {
      setProperty('og:image', image)
    }

    setProperty(
      'og:url',
      typeof window !== 'undefined'
        ? window.location.href
        : pathname
    )

    if (noIndex) {
      setMeta('robots', 'noindex,nofollow')
    } else {
      setMeta('robots', 'index,follow')
    }

  }, [title, description, image, type, noIndex, pathname])

  return null
}
