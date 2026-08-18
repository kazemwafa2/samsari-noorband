// تولید شماره سفارش (قابل فهم برای کاربر)
export function generateOrderNumber(): string {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  
  return `SMS-${year}${month}${day}-${random}`
}

// تولید کد سفارش (داخلی)
export function generateOrderCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// تولید شماره مرجوعی
export function generateReturnNumber(): string {
  const date = new Date()
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `RTN-${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2, '0')}-${random}`
}

// محاسبه مبلغ سفارش
export function calculateOrderTotal(
  items: { price: number; quantity: number; discount_percent?: number }[],
  shippingCost: number = 0,
  taxRate: number = 0
) {
  const subtotal = items.reduce((sum, item) => {
    const discount = item.discount_percent 
      ? item.price * (item.discount_percent / 100) 
      : 0
    return sum + ((item.price - discount) * item.quantity)
  }, 0)
  
  const taxAmount = subtotal * taxRate
  const total = subtotal + shippingCost + taxAmount
  
  return { subtotal, taxAmount, total }
}
