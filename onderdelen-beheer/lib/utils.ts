import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('nl-NL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('nl-NL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function generateSKU(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `OND-${year}-${random}`
}

export function getStockStatus(voorraad: number, minVoorraad: number) {
  if (voorraad === 0) {
    return { color: 'text-red-600', bg: 'bg-red-50', label: 'Uit voorraad', emoji: '🔴' }
  } else if (voorraad <= minVoorraad) {
    return { color: 'text-orange-600', bg: 'bg-orange-50', label: 'Kritiek', emoji: '🟠' }
  } else if (voorraad <= minVoorraad * 2) {
    return { color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Laag', emoji: '🟡' }
  } else {
    return { color: 'text-green-600', bg: 'bg-green-50', label: 'Goed', emoji: '🟢' }
  }
}

export function calculateProfit(verkoopPrijs: number, inkoopPrijs: number, aantal: number = 1): number {
  return (verkoopPrijs - inkoopPrijs) * aantal
}

export function calculateMargin(verkoopPrijs: number, inkoopPrijs: number): number {
  if (verkoopPrijs === 0) return 0
  return ((verkoopPrijs - inkoopPrijs) / verkoopPrijs) * 100
}