import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Product, StockStatus, ProfitSettings, BlueprintData } from '../types';
import AIModal from './AIModal';
import { INITIAL_BLUEPRINT } from '../constants';
import { 
  LayoutDashboard, 
  Package, 
  Settings, 
  Zap, 
  Search, 
  Plus, 
  Filter, 
  Cpu, 
  Mic, 
  UploadCloud, 
  Wand2, 
  Trash2, 
  Copy, 
  Tag, 
  CheckSquare, 
  X, 
  FileSpreadsheet, 
  Globe, 
  Share2, 
  Shield, 
  Bot, 
  RefreshCw, 
  Check, 
  Loader2, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle, 
  Lock, 
  BookOpen, 
  Circle, 
  Play,
  Eye,
  Sparkles
} from 'lucide-react';
import { generateBlueprintContent } from '../services/geminiService';

// --- Utils ---
const generateId = () => Math.random().toString(36).substr(2, 9);

interface AdminDashboardProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  profitSettings: ProfitSettings;
  setProfitSettings: React.Dispatch<React.SetStateAction<ProfitSettings>>;
  onSwitchToStore: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  products, 
  setProducts, 
  profitSettings, 
  setProfitSettings, 
  onSwitchToStore 
}) => {
  // --- Local State ---
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'profit' | 'automation' | 'settings' | 'blueprint'>('blueprint');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);

  // Blueprint State
  const [blueprint, setBlueprint] = useState<BlueprintData>(INITIAL_BLUEPRINT);
  const [expandedPhases, setExpandedPhases] = useState<Set<number>>(new Set([0]));

  // Settings State
  const [storeSettings, setStoreSettings] = useState({
    name: 'Vanguard Store',
    currency: 'USD',
    autoPublish: true,
    lowStockThreshold: 10
  });

  // AI Modal State
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [currentAiPrompt, setCurrentAiPrompt] = useState('');
  const [currentAiTitle, setCurrentAiTitle] = useState('');

  // New Product Form State
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    title: '',
    sku: '',
    price: 0,
    stock: 0,
    category: 'Clothing',
    description: '',
    image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=300' // Default placeholder
  });
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);

  // --- Helpers ---
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00f0ff', '#7000ff', '#ffffff']
    });
  };

  // --- Logic Implementations ---

  const togglePhase = (id: number) => {
    const newSet = new Set(expandedPhases);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedPhases(newSet);
  };

  const toggleTask = (phaseIndex: number, catIndex: number, taskIndex: number) => {
    const newBlueprint = { ...blueprint };
    const task = newBlueprint.phases[phaseIndex].categories[catIndex].tasks[taskIndex];
    task.completed = !task.completed;
    
    if (task.completed) {
      showToast('Task Completed', 'success');
      // Check if phase is complete for celebration
      const allTasks = newBlueprint.phases[phaseIndex].categories.flatMap(c => c.tasks);
      if (allTasks.every(t => t.completed)) {
        triggerCelebration();
        showToast(`Phase ${phaseIndex + 1} Mastered!`, 'success');
      }
    }
    setBlueprint(newBlueprint);
  };

  const launchAI = (prompt: string | undefined, title: string) => {
    if (!prompt) return;
    setCurrentAiPrompt(prompt);
    setCurrentAiTitle(title);
    setAiModalOpen(true);
  };

  const toggleProductSelection = (id: string) => {
    const newSet = new Set(selectedProductIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedProductIds(newSet);
  };

  const selectAll = () => {
    if (selectedProductIds.size === filteredProducts.length) {
      setSelectedProductIds(new Set());
    } else {
      setSelectedProductIds(new Set(filteredProducts.map(p => p.id)));
    }
  };

  const handleBulkAction = (action: 'price' | 'duplicate' | 'delete' | 'export') => {
    if (selectedProductIds.size === 0) return;

    if (action === 'delete') {
      if (confirm(`Are you sure you want to delete ${selectedProductIds.size} products?`)) {
        setProducts(products.filter(p => !selectedProductIds.has(p.id)));
        setSelectedProductIds(new Set());
        showToast('Products deleted successfully', 'error');
      }
    } 
    else if (action === 'duplicate') {
      const duplicates = products
        .filter(p => selectedProductIds.has(p.id))
        .map(p => ({ ...p, id: generateId(), title: `${p.title} (Copy)`, sku: `${p.sku}-COPY` }));
      setProducts([...duplicates, ...products]);
      setSelectedProductIds(new Set());
      showToast(`Duplicated ${duplicates.length} products`);
    }
    else if (action === 'price') {
      const updated = products.map(p => selectedProductIds.has(p.id) ? { ...p, price: Number((p.price * 1.1).toFixed(2)) } : p);
      setProducts(updated);
      showToast('Prices increased by 10%');
    }
    else if (action === 'export') {
       handleExportCSV();
    }
  };

  const handleAddProduct = () => {
    if (!newProduct.title || !newProduct.price) {
      showToast('Please fill in Title and Price', 'error');
      return;
    }

    const productToAdd: Product = {
      id: generateId(),
      title: newProduct.title || 'Untitled',
      sku: newProduct.sku || `SKU-${Math.floor(Math.random() * 10000)}`,
      price: Number(newProduct.price),
      stock: Number(newProduct.stock),
      category: newProduct.category || 'Uncategorized',
      image: newProduct.image || 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2',
      status: Number(newProduct.stock) > 10 ? 'IN_STOCK' : Number(newProduct.stock) > 0 ? 'LOW_STOCK' : 'OUT_OF_STOCK',
      description: newProduct.description
    };

    setProducts([productToAdd, ...products]);
    setIsUploadOpen(false);
    setNewProduct({ title: '', sku: '', price: 0, stock: 0, category: 'Clothing', description: '', image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2' });
    triggerCelebration();
    showToast('Product published successfully!');
  };

  const handleAutoGenerateDescription = async () => {
     if (!newProduct.title) {
       showToast('Enter a product title first', 'error');
       return;
     }
     setIsGeneratingDesc(true);
     const prompt = `Write a compelling, SEO-optimized product description for a product named "${newProduct.title}" in the category "${newProduct.category}". Keep it under 50 words. Tone: Futuristic and exciting.`;
     const desc = await generateBlueprintContent(prompt);
     setNewProduct(prev => ({ ...prev, description: desc }));
     setIsGeneratingDesc(false);
     showToast('Description generated by AI');
  };

  const handleVoiceInput = () => {
    showToast('Listening...', 'info');
    setTimeout(() => {
      setNewProduct(prev => ({
        ...prev,
        title: "Voice Added: Cyber Sneakers",
        price: 150,
        stock: 50,
        category: "Clothing",
        description: "Auto-detected from voice input: Durable, neon-lit sneakers suitable for night running."
      }));
      showToast('Voice command processed');
    }, 1500);
  };

  const handleCompetitorClone = () => {
    showToast('Scanning competitor URL...', 'info');
    setTimeout(() => {
      setNewProduct(prev => ({
        ...prev,
        title: "Competitor Clone: Tech Backpack",
        price: 85.00,
        description: "Waterproof, anti-theft design with USB charging port. (Cloned data)"
      }));
      showToast('Product data cloned successfully');
    }, 1500);
  };

  const handleAutoFill = () => {
    const adjectives = ["Neon", "Quantum", "Holographic", "Void", "Plasma", "Titanium", "Orbital", "Hyper"];
    const nouns = ["Strider", "Visor", "Flux Capacitor", "Gauntlet", "Drone", "Synthesizer", "Link"];
    const images = [
      "https://images.unsplash.com/photo-1618193139062-2c5bf4f935b7",
      "https://images.unsplash.com/photo-1550989460-0adf9ea622e2",
      "https://images.unsplash.com/photo-1592478411213-61535fdd861d",
      "https://images.unsplash.com/photo-1535732759880-bbd5c7265e3f",
      "https://images.unsplash.com/photo-1605810230434-7631ac76ec81"
    ];
    
    const randomTitle = `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`;
    
    setNewProduct({
      title: randomTitle,
      sku: `GEN-${Math.floor(Math.random() * 9000) + 1000}`,
      price: Math.floor(Math.random() * 400) + 50,
      stock: Math.floor(Math.random() * 200),
      category: ["Electronics", "Clothing", "Accessories"][Math.floor(Math.random() * 3)],
      image: `${images[Math.floor(Math.random() * images.length)]}?auto=format&fit=crop&q=80&w=600`,
      description: `High-performance ${randomTitle.toLowerCase()} designed for the modern avant-garde ecosystem. Features premium materials and next-gen integration capabilities.`
    });
    
    showToast('✨ Form auto-filled with synthetic data');
  };

  const handleInstantAdd = () => {
    const adjectives = ["Neon", "Quantum", "Holographic", "Void", "Plasma", "Titanium", "Orbital", "Hyper"];
    const nouns = ["Strider", "Visor", "Flux Capacitor", "Gauntlet", "Drone", "Synthesizer", "Link"];
    const images = [
      "https://images.unsplash.com/photo-1618193139062-2c5bf4f935b7",
      "https://images.unsplash.com/photo-1550989460-0adf9ea622e2",
      "https://images.unsplash.com/photo-1592478411213-61535fdd861d",
      "https://images.unsplash.com/photo-1535732759880-bbd5c7265e3f",
      "https://images.unsplash.com/photo-1605810230434-7631ac76ec81"
    ];
    
    const randomTitle = `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`;
    const randomStock = Math.floor(Math.random() * 200);
    
    const productToAdd: Product = {
      id: generateId(),
      title: randomTitle,
      sku: `INST-${Math.floor(Math.random() * 9000) + 1000}`,
      price: Math.floor(Math.random() * 400) + 50,
      stock: randomStock,
      category: ["Electronics", "Clothing", "Accessories"][Math.floor(Math.random() * 3)],
      image: `${images[Math.floor(Math.random() * images.length)]}?auto=format&fit=crop&q=80&w=600`,
      status: randomStock > 10 ? 'IN_STOCK' : (randomStock > 0 ? 'LOW_STOCK' : 'OUT_OF_STOCK'),
      description: `High-performance ${randomTitle.toLowerCase()} auto-generated for instant deployment. Features premium materials and next-gen integration capabilities.`
    };

    setProducts([productToAdd, ...products]);
    triggerCelebration();
    showToast('⚡ Instant Product Deployed!');
  };

  const handleExportCSV = () => {
    const headers = ['ID,Title,SKU,Price,Stock,Category,Status\n'];
    const rows = products.map(p => 
      `${p.id},"${p.title}",${p.sku},${p.price},${p.stock},${p.category},${p.status}`
    );
    const csvContent = "data:text/csv;charset=utf-8," + headers + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "vanguard_inventory.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Inventory exported to CSV');
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getStatusColor = (status: StockStatus) => {
    switch(status) {
      case 'IN_STOCK': return 'border-green-500/50 text-green-400 bg-green-500/10';
      case 'LOW_STOCK': return 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10';
      case 'OUT_OF_STOCK': return 'border-red-500/50 text-red-400 bg-red-500/10';
      case 'ON_SALE': return 'border-blue-500/50 text-blue-400 bg-blue-500/10';
    }
  };

  const SidebarItem = ({ icon: Icon, label, id, active, onClick }: any) => (
    <div 
      onClick={() => onClick(id)}
      className={`relative group flex items-center gap-4 p-3 mb-2 rounded-xl cursor-pointer transition-all duration-300 ${
        active ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'text-gray-500 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon className={`w-5 h-5 ${active ? 'text-[#00f0ff]' : ''}`} />
      <span className="font-medium text-sm tracking-wide">{label}</span>
      {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#00f0ff] rounded-r-full shadow-[0_0_10px_#00f0ff]"></div>}
    </div>
  );

  const StatCard = ({ title, value, trend, icon: Icon }: any) => (
    <div className="glass-card p-6 rounded-2xl">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1">{title}</p>
          <h3 className="text-2xl font-bold brand-font text-white">{value}</h3>
        </div>
        <div className="p-2 rounded-lg bg-white/5 text-[#00f0ff]">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="flex items-center text-xs">
        <span className="text-[#00ff9d] font-bold mr-2">{trend}</span>
        <span className="text-gray-500">vs last week</span>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="p-8 space-y-8 animate-[fadeIn_0.5s_ease-out]">
            <h2 className="text-2xl font-bold brand-font glow-text mb-6">Command Center</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard title="Total Inventory" value={products.length.toString()} trend="+2" icon={Package} />
              <StatCard title="Est. Revenue" value={`$${products.reduce((acc, p) => acc + (p.price * p.stock), 0).toLocaleString()}`} trend="+8%" icon={Zap} />
              <StatCard title="Low Stock" value={products.filter(p => p.stock < 10 && p.stock > 0).length.toString()} trend="-2" icon={Filter} />
              <StatCard title="Avg. Price" value={`$${(products.reduce((a, b) => a + b.price, 0) / (products.length || 1)).toFixed(2)}`} trend="+5%" icon={Cpu} />
            </div>
            <div className="glass-card p-6 rounded-2xl border border-white/10 h-80 flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-t from-[#00f0ff]/5 to-transparent"></div>
               <div className="text-center z-10">
                  <Bot className="w-12 h-12 text-[#00f0ff] mx-auto mb-3 opacity-50" />
                  <h3 className="text-lg font-bold text-white">Live System Activity</h3>
                  <p className="text-gray-500 text-sm">Monitoring global transactions...</p>
               </div>
               <div className="absolute bottom-0 left-0 right-0 h-40 flex items-end justify-between px-10 gap-2 opacity-30">
                  {[40, 60, 30, 80, 50, 90, 70, 40, 60, 80, 50, 70].map((h, i) => (
                    <div key={i} className="w-full bg-[#00f0ff] rounded-t-sm transition-all duration-1000" style={{ height: `${h}%` }}></div>
                  ))}
               </div>
            </div>
          </div>
        );

      case 'blueprint':
        return (
          <div className="p-8 space-y-8 animate-[fadeIn_0.5s_ease-out] pb-24">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-2xl font-bold brand-font glow-text flex items-center gap-3">
                 <BookOpen className="w-6 h-6 text-[#00f0ff]" />
                 Launch Blueprint
               </h2>
               <div className="text-xs font-mono text-gray-400">
                  STATUS: <span className="text-[#00ff9d]">ACTIVE</span>
               </div>
            </div>

            <div className="space-y-4">
               {blueprint.phases.map((phase, pIndex) => (
                 <div key={phase.id} className="glass-card rounded-2xl overflow-hidden border border-white/10">
                    <div 
                      onClick={() => togglePhase(phase.id)}
                      className="p-6 bg-white/5 flex justify-between items-center cursor-pointer hover:bg-white/10 transition-colors"
                    >
                       <div>
                          <h3 className="text-lg font-bold text-white">{phase.title}</h3>
                          <p className="text-xs text-gray-500 uppercase tracking-widest">{phase.subtitle}</p>
                       </div>
                       <div className="flex items-center gap-4">
                          <div className="text-xs font-mono text-gray-400">
                             {phase.categories.flatMap(c => c.tasks).filter(t => t.completed).length} / {phase.categories.flatMap(c => c.tasks).length}
                          </div>
                          <div className={`transition-transform duration-300 ${expandedPhases.has(phase.id) ? 'rotate-180' : ''}`}>
                             <Bot className="w-5 h-5 text-gray-500" />
                          </div>
                       </div>
                    </div>
                    
                    {expandedPhases.has(phase.id) && (
                       <div className="p-6 border-t border-white/10 space-y-8">
                          {phase.categories.map((category, cIndex) => (
                             <div key={cIndex}>
                                <h4 className="text-sm font-bold text-[#00f0ff] mb-4 uppercase tracking-wider flex items-center gap-2">
                                   <Circle className="w-2 h-2 fill-[#00f0ff]" /> {category.title}
                                </h4>
                                <div className="space-y-3">
                                   {category.tasks.map((task, tIndex) => (
                                      <div key={task.id} className={`p-4 rounded-xl border transition-all duration-300 ${task.completed ? 'bg-[#00ff9d]/5 border-[#00ff9d]/20' : 'bg-white/5 border-white/10 hover:border-white/30'}`}>
                                         <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                               <button 
                                                 onClick={() => toggleTask(pIndex, cIndex, tIndex)}
                                                 className={`mt-1 w-5 h-5 rounded border flex items-center justify-center transition-colors ${task.completed ? 'bg-[#00ff9d] border-[#00ff9d]' : 'border-gray-500 hover:border-white'}`}
                                               >
                                                  {task.completed && <Check className="w-3 h-3 text-black" />}
                                               </button>
                                               <div>
                                                  <h5 className={`font-bold text-sm mb-1 ${task.completed ? 'text-gray-400 line-through' : 'text-white'}`}>{task.title}</h5>
                                                  <p className="text-xs text-gray-400 leading-relaxed max-w-2xl">{task.description}</p>
                                               </div>
                                            </div>
                                            {task.aiPrompt && (
                                               <button 
                                                 onClick={() => launchAI(task.aiPrompt, task.aiActionLabel || task.title)}
                                                 className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#7000ff]/10 text-[#7000ff] border border-[#7000ff]/20 hover:bg-[#7000ff] hover:text-white transition-all text-xs font-bold"
                                               >
                                                  <Wand2 className="w-3 h-3" /> {task.aiActionLabel || "Generate"}
                                               </button>
                                            )}
                                         </div>
                                      </div>
                                   ))}
                                </div>
                             </div>
                          ))}
                       </div>
                    )}
                 </div>
               ))}
            </div>
          </div>
        );

      case 'profit':
        return (
          <div className="p-8 space-y-8 animate-[fadeIn_0.5s_ease-out]">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold brand-font glow-text flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-[#00f0ff]" />
                  Profit Maximization Engine
                </h2>
                <div className="text-xs font-mono text-[#00f0ff] border border-[#00f0ff] px-3 py-1 rounded">
                   HOUSE EDGE: ACTIVE
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 1. Dynamic Pricing Control */}
                <div className="glass-card p-6 rounded-2xl border-t-2 border-t-[#00f0ff]">
                   <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                     <DollarSign className="w-5 h-5 text-[#00f0ff]" /> Pricing Psychology
                   </h3>
                   <div className="space-y-6">
                      <div>
                         <label className="flex justify-between text-sm text-gray-400 mb-2">
                            <span>Artificial Margin Uplift</span>
                            <span className="text-[#00f0ff] font-bold">+{profitSettings.globalMarginPct}%</span>
                         </label>
                         <input 
                           type="range" 
                           min="0" 
                           max="50" 
                           value={profitSettings.globalMarginPct}
                           onChange={(e) => setProfitSettings({...profitSettings, globalMarginPct: Number(e.target.value)})}
                           className="w-full accent-[#00f0ff] h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                         />
                         <p className="text-xs text-gray-500 mt-2">Inflates base prices globally. Hidden from cost basis.</p>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                         <div>
                            <div className="text-sm font-bold text-white">Psychological Rounding</div>
                            <div className="text-xs text-gray-500">Ends prices in .99 or .95</div>
                         </div>
                         <button 
                           onClick={() => setProfitSettings({...profitSettings, psychologicalPricing: !profitSettings.psychologicalPricing})}
                           className={`w-12 h-6 rounded-full p-1 transition-colors ${profitSettings.psychologicalPricing ? 'bg-[#00f0ff]' : 'bg-gray-700'}`}
                         >
                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${profitSettings.psychologicalPricing ? 'translate-x-6' : ''}`} />
                         </button>
                      </div>
                   </div>
                </div>

                {/* 2. Scarcity & Urgency */}
                <div className="glass-card p-6 rounded-2xl border-t-2 border-t-orange-500">
                   <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                     <AlertTriangle className="w-5 h-5 text-orange-500" /> Scarcity Engine
                   </h3>
                   <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                         <div>
                            <div className="text-sm font-bold text-white">Artificial Low Stock</div>
                            <div className="text-xs text-gray-500">Shows "Only 3 left" regardless of inventory</div>
                         </div>
                         <button 
                           onClick={() => setProfitSettings({...profitSettings, scarcityMode: !profitSettings.scarcityMode})}
                           className={`w-12 h-6 rounded-full p-1 transition-colors ${profitSettings.scarcityMode ? 'bg-orange-500' : 'bg-gray-700'}`}
                         >
                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${profitSettings.scarcityMode ? 'translate-x-6' : ''}`} />
                         </button>
                      </div>
                   </div>
                </div>

                {/* 3. Checkout Snipers */}
                <div className="glass-card p-6 rounded-2xl border-t-2 border-t-[#00ff9d]">
                   <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                     <Lock className="w-5 h-5 text-[#00ff9d]" /> Checkout Profit Boosters
                   </h3>
                   <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                         <div>
                            <div className="text-sm font-bold text-white">Auto-Add Shipping Protection</div>
                            <div className="text-xs text-gray-500">Adds $4.99 fee (High margin)</div>
                         </div>
                         <button 
                           onClick={() => setProfitSettings({...profitSettings, addProtectionFee: !profitSettings.addProtectionFee})}
                           className={`w-12 h-6 rounded-full p-1 transition-colors ${profitSettings.addProtectionFee ? 'bg-[#00ff9d]' : 'bg-gray-700'}`}
                         >
                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${profitSettings.addProtectionFee ? 'translate-x-6' : ''}`} />
                         </button>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                         <div>
                            <div className="text-sm font-bold text-white">Hidden Processing Fee</div>
                            <div className="text-xs text-gray-500">Adds 2.5% "Handling" fee</div>
                         </div>
                         <button 
                           onClick={() => setProfitSettings({...profitSettings, addProcessingFee: !profitSettings.addProcessingFee})}
                           className={`w-12 h-6 rounded-full p-1 transition-colors ${profitSettings.addProcessingFee ? 'bg-[#00ff9d]' : 'bg-gray-700'}`}
                         >
                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${profitSettings.addProcessingFee ? 'translate-x-6' : ''}`} />
                         </button>
                      </div>
                   </div>
                </div>
                
                {/* 4. Subscription */}
                 <div className="glass-card p-6 rounded-2xl border-t-2 border-t-[#7000ff]">
                   <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                     <RefreshCw className="w-5 h-5 text-[#7000ff]" /> Recurring Revenue
                   </h3>
                   <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div>
                         <div className="text-sm font-bold text-white">Prime Member Upsell</div>
                         <div className="text-xs text-gray-500">Push $29/mo subscription in cart</div>
                      </div>
                      <button 
                        onClick={() => setProfitSettings({...profitSettings, enablePrimeUpsell: !profitSettings.enablePrimeUpsell})}
                        className={`w-12 h-6 rounded-full p-1 transition-colors ${profitSettings.enablePrimeUpsell ? 'bg-[#7000ff]' : 'bg-gray-700'}`}
                      >
                         <div className={`w-4 h-4 bg-white rounded-full transition-transform ${profitSettings.enablePrimeUpsell ? 'translate-x-6' : ''}`} />
                      </button>
                   </div>
                </div>
             </div>
          </div>
        );

      case 'settings':
        return (
          <div className="p-8 max-w-4xl mx-auto animate-[fadeIn_0.5s_ease-out]">
            <h2 className="text-2xl font-bold brand-font glow-text mb-8 flex items-center gap-3">
              <Settings className="w-6 h-6 text-[#00f0ff]" />
              System Configuration
            </h2>
            <div className="space-y-6">
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-gray-400" />
                  General Store Info
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wide">Store Name</label>
                    <input type="text" value={storeSettings.name} onChange={(e) => setStoreSettings({...storeSettings, name: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-[#00f0ff] outline-none text-white transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wide">Currency</label>
                    <select value={storeSettings.currency} onChange={(e) => setStoreSettings({...storeSettings, currency: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-[#00f0ff] outline-none text-white appearance-none">
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="PKR">PKR (₨)</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="glass-card p-6 rounded-2xl border border-red-500/20 bg-red-500/5">
                <h3 className="text-lg font-bold text-red-400 mb-2 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Danger Zone
                </h3>
                <button onClick={() => showToast('System Reset Complete', 'error')} className="px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg text-sm font-medium transition-colors border border-red-500/20">
                  Factory Reset
                </button>
              </div>
            </div>
          </div>
        );

      case 'import':
        return (
          <div className="p-8 space-y-8 animate-[fadeIn_0.5s_ease-out]">
            <h2 className="text-2xl font-bold brand-font glow-text mb-6 flex items-center gap-3">
              <UploadCloud className="w-6 h-6 text-[#00ff9d]" />
              Import / Export Portal
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-8 rounded-2xl flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                  <FileSpreadsheet className="w-8 h-8 text-[#00ff9d]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Bulk Product Import</h3>
                <p className="text-sm text-gray-400 mb-6 max-w-xs">Upload your CSV or Excel file containing product data.</p>
                <div className="w-full border-2 border-dashed border-white/20 rounded-xl p-6 mb-4 hover:border-[#00ff9d] hover:bg-[#00ff9d]/5 transition-all cursor-pointer" onClick={() => setIsUploadOpen(true)}>
                  <p className="text-sm font-bold text-gray-300">Drag & Drop CSV here</p>
                </div>
              </div>
              <div className="glass-card p-8 rounded-2xl flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                  <Share2 className="w-8 h-8 text-[#7000ff]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Data Export</h3>
                <p className="text-sm text-gray-400 mb-6 max-w-xs">Export your inventory and sales reports.</p>
                <button onClick={handleExportCSV} className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                  <FileSpreadsheet className="w-4 h-4" /> Export as CSV
                </button>
              </div>
            </div>
          </div>
        );

      case 'automation':
        return (
          <div className="p-8 space-y-8 animate-[fadeIn_0.5s_ease-out]">
            <h2 className="text-2xl font-bold brand-font glow-text mb-6 flex items-center gap-3">
              <Cpu className="w-6 h-6 text-[#7000ff]" />
              AI Automation Studio
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="glass-card p-6 rounded-2xl border-t-2 border-t-[#00f0ff] hover:bg-white/5 transition-all group">
                  <Wand2 className="w-8 h-8 text-[#00f0ff] mb-4 group-hover:scale-100 transition-transform" />
                  <h3 className="text-lg font-bold text-white mb-2">Description Generator</h3>
                  <p className="text-xs text-gray-400 mb-4">Create SEO-optimized descriptions from simple product titles.</p>
                  <button onClick={() => { setCurrentAiTitle("Description Gen"); setCurrentAiPrompt("Generate a generic SEO product description template."); setAiModalOpen(true); }} className="w-full py-2 rounded-lg bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/20 hover:bg-[#00f0ff] hover:text-black transition-colors font-medium text-sm">Launch Agent</button>
               </div>
               <div className="glass-card p-6 rounded-2xl border-t-2 border-t-[#7000ff] hover:bg-white/5 transition-all group">
                  <Search className="w-8 h-8 text-[#7000ff] mb-4 group-hover:scale-100 transition-transform" />
                  <h3 className="text-lg font-bold text-white mb-2">Competitor Analysis</h3>
                  <p className="text-xs text-gray-400 mb-4">Analyze top 10 competitors for pricing strategies.</p>
                  <button onClick={() => { setCurrentAiTitle("Market Analysis"); setCurrentAiPrompt("Analyze the current market trends."); setAiModalOpen(true); }} className="w-full py-2 rounded-lg bg-[#7000ff]/10 text-[#7000ff] border border-[#7000ff]/20 hover:bg-[#7000ff] hover:text-white transition-colors font-medium text-sm">Launch Agent</button>
               </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex-1 overflow-y-auto p-8 relative">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <StatCard title="Total Inventory" value={products.length.toString()} trend="+12%" icon={Package} />
              <StatCard title="Stock Value" value={`$${products.reduce((acc, p) => acc + (p.price * p.stock), 0).toLocaleString()}`} trend="+8%" icon={Zap} />
              <StatCard title="Low Stock Alerts" value={products.filter(p => p.stock < 10).length.toString()} trend="-2" icon={Filter} />
              <StatCard title="Avg. Price" value={`$${(products.reduce((a, b) => a + b.price, 0) / (products.length || 1)).toFixed(2)}`} trend="+5%" icon={Cpu} />
            </div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold brand-font glow-text">Visual Inventory</h2>
                <span className="px-2 py-0.5 rounded text-xs bg-white/10 border border-white/10 text-gray-400">{products.length} Items</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="relative">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                   <input type="text" placeholder="Filter products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-black/20 border border-white/10 rounded-lg py-1.5 pl-9 pr-3 text-sm text-gray-300 focus:border-[#7000ff] focus:outline-none w-64" />
                 </div>
                 <button onClick={selectAll} className="p-2 border border-white/10 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white">
                   <CheckSquare className={`w-4 h-4 ${selectedProductIds.size === filteredProducts.length && filteredProducts.length > 0 ? 'text-[#00f0ff]' : ''}`} />
                 </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-24">
              {filteredProducts.map((product) => (
                <div key={product.id} onClick={() => toggleProductSelection(product.id)} className={`glass-card rounded-2xl overflow-hidden group relative cursor-pointer border-2 ${selectedProductIds.has(product.id) ? 'border-[#00f0ff]' : 'border-transparent'}`}>
                  <div className="relative h-48 bg-gray-800 overflow-hidden">
                    <img src={product.image} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                       <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase border ${getStatusColor(product.status)}`}>{product.status.replace('_', ' ')}</span>
                    </div>
                    <div className={`absolute top-3 right-3 w-5 h-5 rounded border ${selectedProductIds.has(product.id) ? 'bg-[#00f0ff] border-[#00f0ff]' : 'border-white/40 bg-black/40'} flex items-center justify-center`}>
                      {selectedProductIds.has(product.id) && <CheckSquare className="w-3 h-3 text-black" />}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-white truncate pr-2">{product.title}</h3>
                    </div>
                    <p className="text-xs text-gray-500 mono-font mb-3">{product.sku}</p>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide">Price</p>
                        <p className="text-lg font-bold text-[#00f0ff]">${product.price.toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] text-gray-400 uppercase tracking-wide">Stock</p>
                         <p className={`font-mono font-bold ${product.stock < 10 ? 'text-red-400' : 'text-white'}`}>{product.stock}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div onClick={() => setIsUploadOpen(true)} className="border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center h-[340px] text-gray-500 hover:border-[#00f0ff] hover:text-[#00f0ff] hover:bg-[#00f0ff]/5 transition-all cursor-pointer group">
                <div className="w-12 h-12 rounded-full bg-white/5 group-hover:bg-[#00f0ff]/20 flex items-center justify-center mb-3 transition-colors">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="font-bold text-sm">Add New Product</span>
              </div>
            </div>
            {selectedProductIds.size > 0 && (
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#0f1115] border border-white/10 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.5)] px-6 py-3 flex items-center gap-6 animate-float z-30">
                <span className="text-sm font-bold text-white">{selectedProductIds.size} Selected</span>
                <div className="h-4 w-[1px] bg-white/20"></div>
                <div className="flex gap-2">
                   <button onClick={() => handleBulkAction('price')} className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-white/10 text-sm text-gray-300 hover:text-white transition-colors"><Tag className="w-4 h-4" /> Price +10%</button>
                   <button onClick={() => handleBulkAction('duplicate')} className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-white/10 text-sm text-gray-300 hover:text-white transition-colors"><Copy className="w-4 h-4" /> Duplicate</button>
                   <button onClick={() => handleBulkAction('delete')} className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-red-500/20 text-sm text-red-400 hover:text-red-300 transition-colors"><Trash2 className="w-4 h-4" /> Delete</button>
                </div>
                <button onClick={() => setSelectedProductIds(new Set())} className="ml-2 text-gray-500 hover:text-white"><X className="w-4 h-4" /></button>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505] text-white">
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-lg shadow-2xl border flex items-center gap-3 animate-[slideIn_0.3s_ease-out] ${toast.type === 'error' ? 'bg-red-900/80 border-red-500' : 'bg-green-900/80 border-green-500'}`}>
          <Check className="w-4 h-4" />
          <span className="font-medium text-sm">{toast.message}</span>
        </div>
      )}
      <aside className="w-64 glass-panel border-r border-white/10 flex flex-col p-6 z-20">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00f0ff] to-[#7000ff] flex items-center justify-center shadow-[0_0_20px_rgba(112,0,255,0.5)]"><Zap className="w-5 h-5 text-white fill-white" /></div>
          <span className="text-xl font-bold brand-font tracking-tight">Vanguard<span className="text-[#00f0ff]">OS</span></span>
        </div>
        <nav className="flex-1">
          <SidebarItem icon={LayoutDashboard} label="Command Center" id="dashboard" active={activeTab === 'dashboard'} onClick={setActiveTab} />
          <SidebarItem icon={BookOpen} label="Launch Blueprint" id="blueprint" active={activeTab === 'blueprint'} onClick={setActiveTab} />
          <SidebarItem icon={Package} label="Inventory Grid" id="inventory" active={activeTab === 'inventory'} onClick={setActiveTab} />
           <SidebarItem icon={TrendingUp} label="Profit Engine" id="profit" active={activeTab === 'profit'} onClick={setActiveTab} />
          <SidebarItem icon={UploadCloud} label="Import / Export" id="import" active={activeTab === 'import'} onClick={setActiveTab} />
          <SidebarItem icon={Cpu} label="AI Automation" id="automation" active={activeTab === 'automation'} onClick={setActiveTab} />
          <SidebarItem icon={Settings} label="System Config" id="settings" active={activeTab === 'settings'} onClick={setActiveTab} />
        </nav>
        <div className="mt-auto space-y-4 pt-6 border-t border-white/10">
          <button onClick={onSwitchToStore} className="w-full py-2 bg-[#00f0ff]/10 hover:bg-[#00f0ff] text-[#00f0ff] hover:text-black rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all">
             <Eye className="w-4 h-4" /> View Live Store
          </button>
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden border border-white/20"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Founder" alt="User" /></div>
            <div className="flex flex-col"><span className="text-sm font-bold">The Architect</span><span className="text-[10px] text-gray-400">Admin Access</span></div>
          </div>
        </div>
      </aside>
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#050505]">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#050505]/80 backdrop-blur-md z-10">
           <div className="relative w-96">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
             <input type="text" placeholder="Search entire ecosystem..." className="w-full bg-white/5 border border-white/10 rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] transition-all placeholder-gray-600 text-white" />
           </div>
           <div className="flex items-center gap-4">
              <button onClick={handleInstantAdd} className="flex items-center gap-2 bg-[#7000ff] hover:bg-[#8020ff] text-white px-4 py-1.5 rounded-lg font-bold text-sm transition-all shadow-[0_0_15px_rgba(112,0,255,0.3)] hover:shadow-[0_0_25px_rgba(112,0,255,0.5)]">
                 <Zap className="w-4 h-4" /> Instant Add
              </button>
              <button onClick={() => setIsUploadOpen(true)} className="flex items-center gap-2 bg-[#00f0ff] hover:bg-[#00c8d5] text-black px-4 py-1.5 rounded-lg font-bold text-sm transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)]"><Plus className="w-4 h-4" /> Add Product</button>
           </div>
        </header>
        {renderContent()}
        {isUploadOpen && (
          <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex justify-end">
            <div className="w-full max-w-2xl bg-[#0f1115] border-l border-white/10 h-full shadow-2xl flex flex-col animate-[slideIn_0.3s_ease-out]">
              <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#0f1115]">
                <h2 className="text-lg font-bold brand-font flex items-center gap-2 text-white"><UploadCloud className="w-5 h-5 text-[#00f0ff]" /> Smart Product Upload</h2>
                <button onClick={() => setIsUploadOpen(false)} className="text-gray-500 hover:text-white"><X className="w-6 h-6" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-8 text-white">
                <div className="border-2 border-dashed border-white/20 rounded-2xl bg-white/5 p-8 text-center hover:border-[#00f0ff] hover:bg-[#00f0ff]/5 transition-all cursor-pointer group relative overflow-hidden">
                  <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none"></div>
                  <UploadCloud className="w-12 h-12 text-gray-500 group-hover:text-[#00f0ff] mx-auto mb-4 transition-colors" />
                  <h3 className="text-lg font-bold text-white mb-1">Drag Product Photos or CSV</h3>
                  <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">Browse Files</button>
                </div>
                <div>
                   <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">AI Automation Tools</h4>
                   <div className="grid grid-cols-2 gap-3">
                      <button onClick={handleVoiceInput} className="p-4 rounded-xl border border-white/10 bg-white/5 hover:border-[#7000ff] hover:bg-[#7000ff]/10 text-left transition-all group">
                         <div className="w-8 h-8 rounded-full bg-[#7000ff]/20 flex items-center justify-center mb-2 group-hover:scale-100 transition-transform"><Mic className="w-4 h-4 text-[#7000ff]" /></div>
                         <div className="font-bold text-sm text-white">Voice Input</div>
                      </button>
                      <button onClick={handleCompetitorClone} className="p-4 rounded-xl border border-white/10 bg-white/5 hover:border-[#00f0ff] hover:bg-[#00f0ff]/10 text-left transition-all group">
                         <div className="w-8 h-8 rounded-full bg-[#00f0ff]/20 flex items-center justify-center mb-2 group-hover:scale-100 transition-transform"><Copy className="w-4 h-4 text-[#00f0ff]" /></div>
                         <div className="font-bold text-sm text-white">Competitor Clone</div>
                      </button>
                   </div>
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Manual Details</h4>
                      <button onClick={handleAutoFill} className="text-xs flex items-center gap-1 text-[#00ff9d] hover:text-white transition-colors bg-[#00ff9d]/10 px-2 py-1 rounded-md border border-[#00ff9d]/20"><Sparkles className="w-3 h-3" /> Quick Fill</button>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                     <div><label className="block text-xs text-gray-400 mb-1">Product Title</label><input type="text" value={newProduct.title} onChange={(e) => setNewProduct({...newProduct, title: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#00f0ff] outline-none text-white" placeholder="e.g. Cyberpunk Jacket" /></div>
                     <div><label className="block text-xs text-gray-400 mb-1">SKU</label><input type="text" value={newProduct.sku} onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#00f0ff] outline-none text-white" placeholder="Auto-generated" /></div>
                   </div>
                   <div className="grid grid-cols-3 gap-4">
                     <div><label className="block text-xs text-gray-400 mb-1">Price</label><input type="number" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#00f0ff] outline-none text-white" placeholder="0.00" /></div>
                     <div><label className="block text-xs text-gray-400 mb-1">Stock</label><input type="number" value={newProduct.stock} onChange={(e) => setNewProduct({...newProduct, stock: Number(e.target.value)})} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#00f0ff] outline-none text-white" placeholder="0" /></div>
                     <div><label className="block text-xs text-gray-400 mb-1">Category</label><select value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#00f0ff] outline-none text-gray-300"><option value="Clothing">Clothing</option><option value="Electronics">Electronics</option><option value="Accessories">Accessories</option></select></div>
                   </div>
                   <div>
                      <label className="block text-xs text-gray-400 mb-1">AI Description</label>
                      <div className="relative">
                        <textarea value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} className="w-full h-24 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#00f0ff] outline-none resize-none text-white" placeholder="Describe the product..."></textarea>
                        <button onClick={handleAutoGenerateDescription} className="absolute bottom-2 right-2 p-1.5 bg-[#7000ff] rounded-md hover:bg-[#8020ff] text-white transition-colors disabled:opacity-50" title="Auto-Write" disabled={isGeneratingDesc}>{isGeneratingDesc ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}</button>
                      </div>
                   </div>
                </div>
              </div>
              <div className="p-6 border-t border-white/10 bg-[#0f1115] flex justify-between items-center">
                 <div className="text-xs text-gray-500">Auto-saving to drafts...</div>
                 <div className="flex gap-3">
                   <button onClick={() => setIsUploadOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white transition-colors">Cancel</button>
                   <button onClick={handleAddProduct} className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#00f0ff] to-[#00aaff] text-black text-sm font-bold hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all transform hover:scale-105">Publish Product</button>
                 </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <AIModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} prompt={currentAiPrompt} title={currentAiTitle} />
    </div>
  );
};

export default AdminDashboard;