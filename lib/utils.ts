import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { AdditionalCharge } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fmtPrice(price: number | string) {
  const num = Number(price);
  return num.toLocaleString('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true
  });
}

export function validateAdditionalCharge(charge: Partial<AdditionalCharge>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!charge.description || charge.description.trim().length === 0) {
    errors.push('Description is required');
  }
  
  if (typeof charge.amount !== 'number' || charge.amount < 0) {
    errors.push('Amount must be a positive number');
  }
  
  if (!charge.type || !['income', 'expense'].includes(charge.type)) {
    errors.push('Type must be either income or expense');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function calculateAdditionalChargesTotal(charges: AdditionalCharge[]): number {
  return charges.reduce((sum, charge) => sum + charge.amount, 0);
}

export function getChargeAnalytics(charges: AdditionalCharge[]): { totalIncome: number; totalExpense: number; netAmount: number } {
  const totalIncome = charges
    .filter(charge => charge.type === 'income')
    .reduce((sum, charge) => sum + charge.amount, 0);
  
  const totalExpense = charges
    .filter(charge => charge.type === 'expense')
    .reduce((sum, charge) => sum + charge.amount, 0);
  
  return {
    totalIncome,
    totalExpense,
    netAmount: totalIncome - totalExpense
  };
}

export function generatePrefix(name: string): string {
  const clean = name.replace(/[^a-zA-Z ]/g, "").trim()
  const words = clean.split(/\s+/)

  if (words.length === 1) {
    return words[0].slice(0, 3).toUpperCase()
  }

  return words
    .map(w => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 4)
}

export function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function generateInvoiceRef(name: string): string {
  const prefix = generatePrefix(name)
  const randomPart = generateRandomString(5)
  return `${prefix}-${randomPart}`
}