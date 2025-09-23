import { create } from 'zustand'
import type { Verkoop, Onderdeel } from '@/types'

interface CartItem {
  onderdeel: Onderdeel
  aantal: number
  prijs: number
}

interface VerkoopStore {
  cart: CartItem[]
  verkopen: Verkoop[]
  loading: boolean
  
  addToCart: (onderdeel: Onderdeel, aantal: number, prijs?: number) => void
  removeFromCart: (onderdeelId: string) => void
  updateCartItem: (onderdeelId: string, aantal: number, prijs?: number) => void
  clearCart: () => void
  
  getCartTotal: () => number
  getCartCount: () => number
  
  setVerkopen: (verkopen: Verkoop[]) => void
  addVerkoop: (verkoop: Verkoop) => void
}

export const useVerkoop = create<VerkoopStore>((set, get) => ({
  cart: [],
  verkopen: [],
  loading: false,
  
  addToCart: (onderdeel, aantal, prijs) => {
    const existingItem = get().cart.find(item => item.onderdeel.id === onderdeel.id)
    
    if (existingItem) {
      set((state) => ({
        cart: state.cart.map(item =>
          item.onderdeel.id === onderdeel.id
            ? { ...item, aantal: item.aantal + aantal }
            : item
        ),
      }))
    } else {
      set((state) => ({
        cart: [...state.cart, {
          onderdeel,
          aantal,
          prijs: prijs || onderdeel.verkoop_prijs,
        }],
      }))
    }
  },
  
  removeFromCart: (onderdeelId) =>
    set((state) => ({
      cart: state.cart.filter(item => item.onderdeel.id !== onderdeelId),
    })),
  
  updateCartItem: (onderdeelId, aantal, prijs) =>
    set((state) => ({
      cart: state.cart.map(item =>
        item.onderdeel.id === onderdeelId
          ? { ...item, aantal, prijs: prijs || item.prijs }
          : item
      ),
    })),
  
  clearCart: () => set({ cart: [] }),
  
  getCartTotal: () => {
    const { cart } = get()
    return cart.reduce((total, item) => total + (item.prijs * item.aantal), 0)
  },
  
  getCartCount: () => {
    const { cart } = get()
    return cart.reduce((count, item) => count + item.aantal, 0)
  },
  
  setVerkopen: (verkopen) => set({ verkopen }),
  
  addVerkoop: (verkoop) =>
    set((state) => ({ verkopen: [verkoop, ...state.verkopen] })),
}))