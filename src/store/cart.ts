import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  product_id: string
  title: string
  price: number
  discount_percent: number
  final_price: number
  quantity: number
  image?: string
  sku?: string
  stock_quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getSubtotal: () => number
  getDiscountAmount: () => number
  getTotal: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const items = get().items
        const existing = items.find(i => i.product_id === item.product_id)
        
        if (existing) {
          set({
            items: items.map(i =>
              i.product_id === item.product_id
                ? { ...i, quantity: Math.min(i.quantity + 1, i.stock_quantity) }
                : i
            ),
          })
        } else {
          set({ items: [...items, { ...item, quantity: 1 }] })
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter(i => i.product_id !== productId) })
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        
        set({
          items: get().items.map(i =>
            i.product_id === productId
              ? { ...i, quantity: Math.min(quantity, i.stock_quantity) }
              : i
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      getSubtotal: () => get().items.reduce((sum, i) => sum + (i.final_price * i.quantity), 0),

      getDiscountAmount: () => get().items.reduce((sum, i) => {
        const discount = i.discount_percent 
          ? i.price * (i.discount_percent / 100) * i.quantity 
          : 0
        return sum + discount
      }, 0),

      getTotal: () => get().getSubtotal(),
    }),
    {
      name: 'samsari-cart',
    }
  )
)
