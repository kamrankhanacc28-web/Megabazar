import React, { useState } from 'react';
import { Product, ViewMode, ProfitSettings } from './types';
import AdminDashboard from './components/AdminDashboard';
import Storefront from './components/Storefront';

// Mock Initial Products (Shared State)
const INITIAL_PRODUCTS: Product[] = [
  { id: '1', title: 'Neon Cyber Jacket', sku: 'CYB-001', price: 129.99, stock: 45, category: 'Clothing', image: 'https://images.unsplash.com/photo-1551488852-080175b22349?auto=format&fit=crop&q=80&w=600', status: 'IN_STOCK', description: "High-tech luminous jacket with integrated LEDs and weather-resistant fabric." },
  { id: '2', title: 'Neural Interface Headset', sku: 'TEC-992', price: 299.50, stock: 5, category: 'Electronics', image: 'https://images.unsplash.com/photo-1592136952766-0775940d99ba?auto=format&fit=crop&q=80&w=600', status: 'LOW_STOCK', description: "Direct neural link device for immersive gaming and productivity." },
  { id: '3', title: 'Quantum Data Drive', sku: 'STO-554', price: 89.00, stock: 0, category: 'Electronics', image: 'https://images.unsplash.com/photo-1531297424005-063412b61bba?auto=format&fit=crop&q=80&w=600', status: 'OUT_OF_STOCK', description: "Infinite storage capacity crystal drive using quantum state retention." },
  { id: '4', title: 'Hololens Glasses', sku: 'VIS-101', price: 450.00, stock: 120, category: 'Electronics', image: 'https://images.unsplash.com/photo-1572569028738-411a56103324?auto=format&fit=crop&q=80&w=600', status: 'ON_SALE', description: "Augmented reality eyewear with 8K resolution and gesture control." },
  { id: '5', title: 'Titanium Smart Watch', sku: 'WAT-002', price: 199.99, stock: 18, category: 'Accessories', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600', status: 'IN_STOCK', description: "Indestructible casing with 30-day battery life and health tracking." },
  { id: '6', title: 'Ergo Mech Keyboard', sku: 'INP-883', price: 159.00, stock: 32, category: 'Electronics', image: 'https://images.unsplash.com/photo-1587829741301-dc798b91a603?auto=format&fit=crop&q=80&w=600', status: 'IN_STOCK', description: "Tactile response keys with programmable RGB underglow and layers." },
  { id: '7', title: 'Urban Tech Hoodie', sku: 'CLO-442', price: 85.00, stock: 60, category: 'Clothing', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=600', status: 'IN_STOCK', description: "Water-repellent streetwear essential." },
  { id: '8', title: 'Cyberpunk Visor', sku: 'ACC-110', price: 45.00, stock: 15, category: 'Accessories', image: 'https://images.unsplash.com/photo-1620506305607-b3c942eb7861?auto=format&fit=crop&q=80&w=600', status: 'LOW_STOCK', description: "Decorative LED visor for cosplay and night events." }
];

const INITIAL_PROFIT_SETTINGS: ProfitSettings = {
  globalMarginPct: 15, // 15% markup default
  psychologicalPricing: true,
  scarcityMode: true,
  addProtectionFee: true,
  addProcessingFee: true,
  enablePrimeUpsell: true
};

const App: React.FC = () => {
  // Master State
  const [view, setView] = useState<ViewMode>('store'); 
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [profitSettings, setProfitSettings] = useState<ProfitSettings>(INITIAL_PROFIT_SETTINGS);

  return (
    <>
      {view === 'admin' ? (
        <AdminDashboard 
          products={products} 
          setProducts={setProducts} 
          profitSettings={profitSettings}
          setProfitSettings={setProfitSettings}
          onSwitchToStore={() => setView('store')}
        />
      ) : (
        <Storefront 
          products={products} 
          profitSettings={profitSettings}
          onAdminLogin={() => setView('admin')}
        />
      )}
    </>
  );
};

export default App;