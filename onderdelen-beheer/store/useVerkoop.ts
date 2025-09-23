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
  
  addToCart: (onderdeel: Onderdeel, aantal: number, prijs?: number) => {
    const existingItem = get().cart.find((item: CartItem) => item.onderdeel.id === onderdeel.id)
    
    if (existingItem) {
      set((state: VerkoopStore) => ({
        cart: state.cart.map((item: CartItem) =>
          item.onderdeel.id === onderdeel.id
            ? { ...item, aantal: item.aantal + aantal }
            : item
        ),
      }))
    } else {
      set((state: VerkoopStore) => ({
        cart: [...state.cart, {
          onderdeel,
          aantal,
          prijs: prijs || onderdeel.verkoop_prijs,
        }],
      }))
    }
  },
  
  removeFromCart: (onderdeelId: string) =>
    set((state: VerkoopStore) => ({
      cart: state.cart.filter((item: CartItem) => item.onderdeel.id !== onderdeelId),
    })),
  
  updateCartItem: (onderdeelId: string, aantal: number, prijs?: number) =>
    set((state: VerkoopStore) => ({
      cart: state.cart.map((item: CartItem) =>
        item.onderdeel.id === onderdeelId
          ? { ...item, aantal, prijs: prijs || item.prijs }
          : item
      ),
    })),
  
  clearCart: () => set({ cart: [] }),
  
  getCartTotal: () => {
    const { cart } = get()
    return cart.reduce((total: number, item: CartItem) => total + (item.prijs * item.aantal), 0)
  },
  
  getCartCount: () => {
    const { cart } = get()
    return cart.reduce((count: number, item: CartItem) => count + item.aantal, 0)
  },
  
  setVerkopen: (verkopen: Verkoop[]) => set({ verkopen }),
  
  addVerkoop: (verkoop: Verkoop) =>
    set((state: VerkoopStore) => ({ verkopen: [verkoop, ...state.verkopen] })),
}) as VerkoopStore)