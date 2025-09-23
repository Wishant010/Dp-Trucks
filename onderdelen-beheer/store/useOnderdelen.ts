import { create } from 'zustand'
import type { Onderdeel, Categorie } from '@/types'

interface OnderdelenStore {
  onderdelen: Onderdeel[]
  categories: Categorie[]
  loading: boolean
  error: string | null
  searchQuery: string
  selectedCategory: string | null
  
  setOnderdelen: (onderdelen: Onderdeel[]) => void
  setCategories: (categories: Categorie[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSearchQuery: (query: string) => void
  setSelectedCategory: (category: string | null) => void
  
  addOnderdeel: (onderdeel: Onderdeel) => void
  updateOnderdeel: (id: string, onderdeel: Partial<Onderdeel>) => void
  deleteOnderdeel: (id: string) => void
  
  getFilteredOnderdelen: () => Onderdeel[]
}

export const useOnderdelen = create<OnderdelenStore>((set, get) => ({
  onderdelen: [],
  categories: [],
  loading: false,
  error: null,
  searchQuery: '',
  selectedCategory: null,
  
  setOnderdelen: (onderdelen) => set({ onderdelen }),
  setCategories: (categories) => set({ categories }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  
  addOnderdeel: (onderdeel) => 
    set((state) => ({ onderdelen: [...state.onderdelen, onderdeel] })),
  
  updateOnderdeel: (id, updates) =>
    set((state) => ({
      onderdelen: state.onderdelen.map((o) =>
        o.id === id ? { ...o, ...updates } : o
      ),
    })),
  
  deleteOnderdeel: (id) =>
    set((state) => ({
      onderdelen: state.onderdelen.filter((o) => o.id !== id),
    })),
  
  getFilteredOnderdelen: () => {
    const { onderdelen, searchQuery, selectedCategory } = get()
    
    return onderdelen.filter((onderdeel) => {
      const matchesSearch = !searchQuery || 
        onderdeel.naam.toLowerCase().includes(searchQuery.toLowerCase()) ||
        onderdeel.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        onderdeel.barcode?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategory = !selectedCategory || 
        onderdeel.categorie_id === selectedCategory
      
      return matchesSearch && matchesCategory && onderdeel.actief
    })
  },
}))