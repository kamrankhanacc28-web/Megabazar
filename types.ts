export enum PhaseStatus {
  LOCKED = 'LOCKED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  aiPrompt?: string; 
  aiActionLabel?: string;
}

export interface SubCategory {
  title: string;
  tasks: Task[];
}

export interface Phase {
  id: number;
  title: string;
  subtitle: string;
  categories: SubCategory[];
}

export interface BlueprintData {
  phases: Phase[];
}

// --- New Types for Commerce OS ---

export type StockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'ON_SALE';

export interface Product {
  id: string;
  title: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  status: StockStatus;
  selected?: boolean;
  description?: string;
  rating?: number;
  reviews?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export type ViewMode = 'admin' | 'store';

export interface AIResponse {
  text: string;
  loading: boolean;
  error?: string;
}

// --- Profit Engine Types ---

export interface ProfitSettings {
  globalMarginPct: number; // 0 to 100% uplift
  psychologicalPricing: boolean; // Round to .99
  scarcityMode: boolean; // Show fake low stock
  addProtectionFee: boolean; // Auto-add insurance
  addProcessingFee: boolean; // Hidden fee
  enablePrimeUpsell: boolean; // Subscription push
}