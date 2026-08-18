import type { Currency } from '@/types'

export function formatPrice(
  amount: number,
  currency: Currency,
  options?: {
    showSymbol?: boolean
    showCode?: boolean
    useGrouping?: boolean
  }
): string {

  const {
    showSymbol = true,
    showCode = false,
    useGrouping = true,
  } = options || {}

  try {

    const formatter = new Intl.NumberFormat("fa-AF", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      useGrouping,
    })

    const formattedAmount = formatter.format(amount)

    const symbol = showSymbol
      ? ` ${currency.symbol ?? ""}`
      : ""

    const code = showCode
      ? ` ${currency.code ?? ""}`
      : ""

    return `${formattedAmount}${symbol}${code}`

  } catch {

    const integerPart = useGrouping
      ? amount
          .toFixed(0)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      : amount.toFixed(0)

    return `${integerPart} ${currency.symbol ?? ""}`

  }
}


export function convertCurrency(
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency,
  rates: Record<string, number>
): number {

  if (fromCurrency.id === toCurrency.id) {
    return amount
  }

  const fromToUsd =
    rates[`${fromCurrency.id}_USD`] || 1

  const usdToTarget =
    rates[`USD_${toCurrency.id}`] || 1

  const inUsd = amount / fromToUsd

  return inUsd * usdToTarget
}
