import React, { useState, useEffect, useRef } from 'react';
import { Product, CartItem, ProfitSettings } from '../types';
import { 
  ShoppingBag, Search, Menu, X, ArrowRight, User, Instagram, Facebook, Twitter, 
  LogIn, LogOut, Package, Loader2, Zap, Flame, Eye, Star, TrendingUp, CheckCircle, 
  ChevronRight, Truck, ShieldCheck, Ticket, Gift, Sparkles, CreditCard, Lock, PartyPopper,
  Sun, Moon, Snowflake
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StorefrontProps {
  products: Product[];
  onAdminLogin: () => void;
  profitSettings: ProfitSettings;
}

interface CustomerUser {
  name: string;
  email: string;
  avatar: string;
}

// Simulated Social Proof Data
const RECENT_PURCHASES = [
  { name: "Sarah M.", location: "New York", item: "Neon Cyber Jacket" },
  { name: "James L.", location: "London", item: "Titanium Smart Watch" },
  { name: "Aiko T.", location: "Tokyo", item: "Hololens Glasses" },
  { name: "Omar K.", location: "Dubai", item: "Urban Tech Hoodie" },
];

// Profit Wheel Segments (Rigged for House Edge)
// Type: 'discount' (percentage), 'credit' (flat amount), 'shipping' (boolean), 'none' (try again), 'points' (loyalty)
const WHEEL_SEGMENTS = [
  { id: 1, label: "Try Again", type: 'none', value: 0, color: "#6b7280", probability: 0.40, text: "Better Luck Tomorrow!" },
  { id: 2, label: "5% OFF", type: 'discount', value: 0.05, color: "#3b82f6", probability: 0.25, text: "You won 5% Discount!" },
  { id: 3, label: "100 Pts", type: 'points', value: 100, color: "#8b5cf6", probability: 0.15, text: "100 Loyalty Points Added!" },
  { id: 4, label: "Free Ship", type: 'shipping', value: 0, color: "#10b981", probability: 0.08, text: "Free Shipping Unlocked!" },
  { id: 5, label: "$10 Credit", type: 'credit', value: 10, color: "#f59e0b", probability: 0.06, text: "$10 Store Credit Added!" },
  { id: 6, label: "Mystery", type: 'none', value: 0, color: "#ec4899", probability: 0.03, text: "Mystery Box Unlocked!" },
  { id: 7, label: "10% OFF", type: 'discount', value: 0.10, color: "#f97316", probability: 0.02, text: "Huge 10% Discount!" },
  { id: 8, label: "$50 Credit", type: 'credit', value: 50, color: "#eab308", probability: 0.01, text: "JACKPOT! $50 Credit!" },
];

const Storefront: React.FC<StorefrontProps> = ({ products, onAdminLogin, profitSettings }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Checkout Boosters State
  const [hasInsurance, setHasInsurance] = useState(profitSettings.addProtectionFee);
  
  // Advanced UI State
  const [scrolled, setScrolled] = useState(false);
  const [viewingCounts, setViewingCounts] = useState<Record<string, number>>({});
  const [showRecentPurchase, setShowRecentPurchase] = useState(false);
  const [currentRecentPurchase, setCurrentRecentPurchase] = useState(RECENT_PURCHASES[0]);
  
  // Profit Wheel State
  const [isProfitWheelOpen, setIsProfitWheelOpen] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<typeof WHEEL_SEGMENTS[0] | null>(null);
  const [hasSpun, setHasSpun] = useState(false);
  const [activeReward, setActiveReward] = useState<typeof WHEEL_SEGMENTS[0] | null>(null);
  
  // Customer State
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Typewriter Effect State
  const [heroText, setHeroText] = useState("");
  const fullHeroText = "DISCOVER YOUR FUTURE STYLE";

  // --- Dynamic Theme Engine ---
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Check every minute
    return () => clearInterval(timer);
  }, []);

  const hour = currentTime.getHours();
  const month = currentTime.getMonth();

  // Theme Logic
  const isNight = hour < 6 || hour >= 18; // 6 PM to 6 AM is Night Mode
  const isHoliday = month === 11; // December is Holiday Season

  const theme = {
    bg: isNight ? 'bg-[#050505]' : 'bg-white',
    text: isNight ? 'text-gray-100' : 'text-gray-900',
    muted: isNight ? 'text-gray-400' : 'text-gray-500',
    border: isNight ? 'border-white/10' : 'border-gray-100',
    cardBg: isNight ? 'bg-[#121212] border border-white/10' : 'bg-gray-50 border border-transparent',
    navScrolled: isNight 
      ? 'bg-[#050505]/90 backdrop-blur-md border-b border-white/10 shadow-lg' 
      : 'bg-white/90 backdrop-blur-md shadow-sm',
    navTransparent: 'bg-transparent',
    navTextScrolled: isNight ? 'text-white' : 'text-black',
    navHover: isNight ? 'hover:text-[#00f0ff]' : 'hover:text-black',
    announcement: isHoliday 
      ? 'bg-gradient-to-r from-red-900 via-green-900 to-red-900' 
      : (isNight ? 'bg-gradient-to-r from-blue-900 to-purple-900' : 'bg-black'),
    btnPrimary: isHoliday
      ? 'bg-gradient-to-r from-red-600 to-green-600 text-white hover:shadow-red-500/50'
      : (isNight ? 'bg-[#00f0ff] text-black hover:bg-[#00c8d5] hover:shadow-[#00f0ff]/50' : 'bg-black text-white hover:bg-gray-800'),
    btnSecondary: isNight 
      ? 'bg-white text-black hover:bg-gray-200' 
      : 'bg-white text-black border border-black hover:bg-gray-100 shadow-xl',
    accent: isHoliday ? 'text-red-500' : (isNight ? 'text-[#00f0ff]' : 'text-orange-500'),
    flame: isHoliday ? 'text-green-500' : (isNight ? 'text-[#00f0ff]' : 'text-orange-500'),
    badge: isHoliday ? 'bg-red-600 text-white' : (isNight ? 'bg-[#00f0ff] text-black' : 'bg-black text-white'),
    input: isNight ? 'bg-white/5 border-white/10 text-white placeholder-gray-500' : 'bg-transparent border-black/10 text-black placeholder-gray-500',
    footer: isNight ? 'bg-[#020202] border-white/10' : 'bg-[#050505] border-white/10', // Footer stays dark usually
    drawerBg: isNight ? 'bg-[#0a0a0a] text-white' : 'bg-white text-gray-900',
    drawerBorder: isNight ? 'border-white/10' : 'border-gray-100',
  };

  // Derived State
  const categories: string[] = ['All', ...Array.from(new Set(products.map(p => p.category))) as string[]];
  const freeShippingThreshold = 200;
  
  // --- Profit Engine Logic ---
  
  const getDynamicPrice = (price: number) => {
    // 1. Apply Margin Uplift
    const uplift = 1 + (profitSettings.globalMarginPct / 100);
    let newPrice = price * uplift;
    
    // 2. Psychological Rounding
    if (profitSettings.psychologicalPricing) {
      newPrice = Math.ceil(newPrice) - 0.01; // e.g., 100.5 -> 101 -> 100.99
    }
    return Number(newPrice.toFixed(2));
  };

  const getAnchorPrice = (dynamicPrice: number) => {
    // Fake MSRP is always 30% higher to show "savings"
    return (dynamicPrice * 1.3).toFixed(2);
  };
  
  // Cart Calculations
  const cartProductTotal = cart.reduce((acc, item) => acc + (getDynamicPrice(item.price) * item.quantity), 0);
  
  const INSURANCE_FEE = 4.99;
  const PROCESSING_FEE_PCT = 0.025; // 2.5%
  
  const processingFee = profitSettings.addProcessingFee ? (cartProductTotal * PROCESSING_FEE_PCT) : 0;
  const insuranceCost = (hasInsurance && profitSettings.addProtectionFee) ? INSURANCE_FEE : 0;

  // --- Apply Wheel Rewards ---
  let discountAmount = 0;
  let creditAmount = 0;
  let isFreeShippingReward = false;

  if (activeReward) {
    if (activeReward.type === 'discount') {
      discountAmount = cartProductTotal * activeReward.value;
    } else if (activeReward.type === 'credit') {
      creditAmount = activeReward.value;
    } else if (activeReward.type === 'shipping') {
      isFreeShippingReward = true;
    }
  }
  
  const cartGrandTotal = Math.max(0, cartProductTotal + processingFee + insuranceCost - discountAmount - creditAmount);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  
  // Shipping Progress (Instant 100% if reward active)
  const shippingProgress = isFreeShippingReward ? 100 : Math.min((cartProductTotal / freeShippingThreshold) * 100, 100);

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Effects
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Reset Insurance default when settings change
    setHasInsurance(profitSettings.addProtectionFee);
  }, [profitSettings.addProtectionFee]);

  useEffect(() => {
    // Simulate Typewriter
    let i = 0;
    const interval = setInterval(() => {
      setHeroText(fullHeroText.slice(0, i + 1));
      i++;
      if (i > fullHeroText.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Generate random viewing counts
    const counts: Record<string, number> = {};
    products.forEach(p => counts[p.id] = Math.floor(Math.random() * 15) + 3);
    setViewingCounts(counts);

    // Simulate Social Proof Popup
    const interval = setInterval(() => {
      setCurrentRecentPurchase(RECENT_PURCHASES[Math.floor(Math.random() * RECENT_PURCHASES.length)]);
      setShowRecentPurchase(true);
      setTimeout(() => setShowRecentPurchase(false), 5000);
    }, 20000);
    return () => clearInterval(interval);
  }, [products]);

  // Handlers
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    
    confetti({
      particleCount: 30,
      spread: 40,
      origin: { y: 0.8 },
      colors: isHoliday ? ['#ef4444', '#22c55e'] : (isNight ? ['#00f0ff', '#7000ff'] : ['#000000', '#FFD700'])
    });
    
    setIsCartOpen(true);
  };

  const handleBuyNow = (product: Product) => {
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#00f0ff', '#000000']
    });
    const price = getDynamicPrice(product.price);
    // Simulate immediate checkout redirect
    setTimeout(() => {
      alert(`⚡ EXPRESS CHECKOUT INITIATED\n\nProduct: ${product.title}\nTotal: $${price}\n\n(This bypasses the cart for 1-click purchase)`);
    }, 500);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleCheckout = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#000000', '#FFD700', '#FFFFFF']
    });
    const customerName = user ? user.name.split(' ')[0] : 'Guest';
    alert(`Order Placed Successfully! \n\nThank you, ${customerName}. \nTotal: $${cartGrandTotal.toFixed(2)}\nIncludes processing & insurance fees.\n\nA confirmation email has been sent to ${user ? user.email : 'your inbox'}.`);
    setCart([]);
    setIsCartOpen(false);
  };

  const handleGoogleLogin = () => {
    setIsLoggingIn(true);
    setTimeout(() => {
      setUser({
        name: "Alex Shopper",
        email: "alex.shopper@gmail.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
      });
      setIsLoggingIn(false);
      setIsLoginModalOpen(false);
    }, 1500);
  };

  const handleSpinWheel = () => {
    if (!user) {
      alert("Please login to verify your eligibility for prizes!");
      setIsLoginModalOpen(true);
      return;
    }
    if (isSpinning) return;
    if (hasSpun) {
       alert("You have already used your daily free spin! Come back tomorrow.");
       return;
    }
    
    setIsSpinning(true);
    setSpinResult(null);

    // Probability Logic (House Edge)
    const rand = Math.random();
    let cumulative = 0;
    let selected = WHEEL_SEGMENTS[0];
    
    for (const seg of WHEEL_SEGMENTS) {
       cumulative += seg.probability;
       if (rand < cumulative) {
         selected = seg;
         break;
       }
    }

    // Calculate Animation
    const index = WHEEL_SEGMENTS.indexOf(selected);
    const segmentDegree = 360 / WHEEL_SEGMENTS.length; 
    const segmentCenter = (index * segmentDegree) + (segmentDegree / 2);
    // Add multiple spins (1800deg) + alignment
    const spinTarget = 3600 + (360 - segmentCenter);
    const jitter = Math.random() * 10 - 5; // Small random offset

    setWheelRotation(prev => prev + spinTarget + jitter);

    setTimeout(() => {
       setSpinResult(selected);
       setIsSpinning(false);
       setHasSpun(true);
       
       if (selected.type !== 'none') { 
         confetti({
            particleCount: 200,
            spread: 120,
            origin: { y: 0.5 },
            colors: [selected.color, '#FFD700']
         });
       }
    }, 4500);
  };
  
  const handleClaimPrize = () => {
    if (spinResult && spinResult.type !== 'none') {
       setActiveReward(spinResult);
       setIsCartOpen(true); // Open cart to show applied reward
    }
    setIsProfitWheelOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    setActiveReward(null);
    setHasSpun(false);
  };

  const wheelGradient = `conic-gradient(${WHEEL_SEGMENTS.map((s, i) => `${s.color} ${i * 45}deg ${(i + 1) * 45}deg`).join(', ')})`;

  return (
    <div className={`min-h-screen font-sans selection:bg-[#00f0ff] selection:text-black storefront-mode overflow-x-hidden transition-colors duration-500 ${theme.bg} ${theme.text}`}>
      
      {/* 0. Announcement Bar (Urgency) */}
      <div className={`${theme.announcement} text-white text-xs font-bold py-2 px-4 text-center overflow-hidden relative transition-colors duration-500`}>
         <div className="flex gap-8 justify-center items-center animate-pulse-slow">
            <span className="flex items-center gap-2">
              {isHoliday && <Snowflake className="w-3 h-3" />}
              {isHoliday ? "❄️ HOLIDAY SPECIAL: FREE GIFT WRAPPING" : "🔥 FREE WORLDWIDE SHIPPING ON ORDERS OVER $200"}
            </span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">⚡ FLASH SALE: EXTRA 10% OFF CRYPTO PAYMENTS</span>
         </div>
      </div>

      {/* 1. Navigation (Sticky & Frosted) */}
      <nav className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? theme.navScrolled : theme.navTransparent}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
                <Menu className={`w-6 h-6 ${scrolled ? theme.navTextScrolled : 'text-white'}`} />
              </button>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer group" onClick={() => { setActiveCategory('All'); window.scrollTo(0,0); }}>
              <div className={`w-10 h-10 flex items-center justify-center font-bold text-xl rounded-sm transition-colors duration-500 ${isNight ? 'bg-white text-black' : 'bg-black text-white'} group-hover:bg-[#00f0ff] group-hover:text-black`}>V</div>
              <span className={`font-bold text-2xl tracking-tighter brand-font ${scrolled ? theme.navTextScrolled : 'text-white mix-blend-difference'}`}>VANGUARD</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {categories.slice(0, 5).map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-sm font-bold uppercase tracking-widest transition-all hover:tracking-[0.2em] ${scrolled ? (activeCategory === cat ? `${theme.navTextScrolled} border-b-2 ${theme.navTextScrolled.replace('text-', 'border-')}` : `${theme.muted} ${theme.navHover}`) : 'text-white/80 hover:text-white'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Right Icons */}
            <div className={`flex items-center gap-4 ${scrolled ? theme.navTextScrolled : 'text-white'}`}>
              <div className="hidden sm:flex relative group">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`bg-transparent border-b ${scrolled ? `${theme.border} ${theme.muted}` : 'border-white/50 placeholder-white/70 text-white'} px-4 py-1.5 pl-8 text-sm focus:outline-none focus:border-[#00f0ff] w-32 group-hover:w-64 transition-all duration-500`}
                />
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 opacity-70" />
              </div>

              {/* User Profile / Login */}
              {user ? (
                <div className="relative group">
                   <button className="flex items-center gap-2 focus:outline-none">
                     <img src={user.avatar} className="w-8 h-8 rounded-full border border-gray-200" alt="User" />
                   </button>
                   <div className={`absolute right-0 top-full mt-2 w-56 rounded-xl shadow-xl border p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50 ${theme.cardBg} ${theme.text}`}>
                      <div className={`px-3 py-2 border-b ${theme.border} mb-2`}>
                         <p className="text-sm font-bold truncate">{user.name}</p>
                         <p className={`text-xs ${theme.muted} truncate`}>{user.email}</p>
                      </div>
                      <button className={`w-full text-left px-3 py-2 text-sm ${theme.muted} hover:bg-gray-500/10 rounded-lg flex items-center gap-2 transition-colors`}>
                         <Package className="w-4 h-4" /> My Orders
                      </button>
                      <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm hover:bg-red-500/10 rounded-lg text-red-500 flex items-center gap-2 transition-colors">
                         <LogOut className="w-4 h-4" /> Logout
                      </button>
                   </div>
                </div>
              ) : (
                <button onClick={() => setIsLoginModalOpen(true)} className="p-2 hover:scale-110 transition-transform" title="Login">
                  <User className="w-5 h-5" />
                </button>
              )}

              <button onClick={() => setIsCartOpen(true)} className="p-2 relative hover:scale-110 transition-transform">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className={`absolute -top-1 -right-1 ${theme.badge} text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold animate-bounce`}>
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. Cinematic Hero Section (Visual Magnet) */}
      {activeCategory === 'All' && !searchQuery && (
        <div className="relative h-screen -mt-20 overflow-hidden">
          {/* Video Background */}
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover"
            poster="https://images.unsplash.com/photo-1537832816519-689ad163238b?auto=format&fit=crop&q=80&w=2000"
          >
             <source src="https://cdn.coverr.co/videos/coverr-walking-in-a-fashion-show-2656/1080p.mp4" type="video/mp4" />
          </video>
          
          <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

          {/* Holiday Overlay */}
          {isHoliday && <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/snow.png')]"></div>}

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
            <span className={`inline-block px-4 py-1 border border-white/30 rounded-full backdrop-blur-md text-xs font-bold tracking-[0.3em] mb-6 uppercase animate-[fadeIn_1s_ease-out] ${isHoliday ? 'bg-red-600/50 border-red-500/50' : ''}`}>
              Collection 2025
            </span>
            <h1 className="text-5xl md:text-8xl font-bold mb-8 brand-font tracking-tight h-24 md:h-32 drop-shadow-2xl">
              {heroText}<span className="animate-pulse">|</span>
            </h1>
            
            <div className="flex gap-4 animate-[slideUp_1.2s_ease-out]">
              <button 
                onClick={() => { document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth' }) }}
                className="group relative px-8 py-4 bg-white text-black font-bold tracking-wide overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">SHOP NOW <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
                <div className={`absolute inset-0 ${isHoliday ? 'bg-red-600' : 'bg-[#00f0ff]'} transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out`} />
              </button>
              <button className="px-8 py-4 border border-white text-white font-bold tracking-wide hover:bg-white/10 transition-colors backdrop-blur-sm">
                VIEW LOOKBOOK
              </button>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 text-xs tracking-widest uppercase animate-bounce">
            Scroll for Magic
          </div>
        </div>
      )}

      {/* 3. Main Content - "Can't Look Away" Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20" id="product-grid">
        
        {/* Filter Bar with Visual Flair */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-bold brand-font mb-2 flex items-center gap-3">
              {activeCategory === 'All' ? 'Trending Now' : activeCategory}
              <Flame className={`w-6 h-6 ${theme.flame} animate-pulse`} />
            </h2>
            <p className={`${theme.muted} text-sm flex items-center gap-2`}>
              <Eye className="w-4 h-4" /> {filteredProducts.length} items curated for you
            </p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar w-full md:w-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  activeCategory === cat 
                  ? `${theme.badge} shadow-lg scale-105` 
                  : `${theme.cardBg} ${theme.text} hover:opacity-80`
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry-Style Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product, index) => {
            const dynamicPrice = getDynamicPrice(product.price);
            return (
            <div 
              key={product.id} 
              className="group relative flex flex-col"
              style={{ animationDelay: `${index * 50}ms` }} 
            >
              {/* Card Image Area */}
              <div className={`aspect-[3/4] w-full overflow-hidden rounded-xl relative mb-4 ${isNight ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className={`h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out ${isNight ? 'opacity-80 group-hover:opacity-100' : ''}`}
                />
                
                {/* Overlay Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-t ${isNight ? 'from-black/90' : 'from-black/60'} via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {(product.status === 'LOW_STOCK' || profitSettings.scarcityMode) && (
                    <span className="bg-red-500 text-white text-[10px] px-2 py-1 font-bold uppercase tracking-wider flex items-center gap-1 shadow-md animate-pulse">
                      <Flame className="w-3 h-3" /> Only {Math.floor(Math.random() * 4) + 2} Left
                    </span>
                  )}
                  {product.status === 'ON_SALE' && (
                    <span className="bg-white text-black text-[10px] px-2 py-1 font-bold uppercase tracking-wider shadow-md">
                      Sale
                    </span>
                  )}
                </div>

                {/* Social Proof Badge */}
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <Eye className={`w-3 h-3 ${theme.accent}`} /> {viewingCounts[product.id]} viewing
                </div>

                {/* Quick Add & Buy Now Buttons (Slide Up) */}
                <div className="absolute bottom-4 left-4 right-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out flex gap-2">
                  <button 
                    onClick={() => addToCart(product)}
                    className={`flex-1 ${theme.btnSecondary} py-3 font-bold text-sm uppercase tracking-wide transition-colors shadow-xl flex items-center justify-center gap-2`}
                  >
                    <ShoppingBag className="w-4 h-4" /> Add
                  </button>
                  <button 
                    onClick={() => handleBuyNow(product)}
                    className={`flex-1 ${theme.btnPrimary} py-3 font-bold text-sm uppercase tracking-wide transition-colors shadow-xl flex items-center justify-center gap-2`}
                  >
                    <Zap className="w-4 h-4" /> Buy Now
                  </button>
                </div>
              </div>

              {/* Details */}
              <div>
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`text-base font-bold ${theme.text} group-hover:opacity-70 transition-opacity cursor-pointer`}>
                    {product.title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs font-bold">
                    <Star className="w-3 h-3 text-orange-400 fill-orange-400" /> 4.9
                  </div>
                </div>
                <div className="flex items-center justify-between">
                   <p className={`text-sm ${theme.muted}`}>{product.category}</p>
                   <div className="text-right">
                      <span className={`text-xs ${theme.muted} line-through mr-2`}>${getAnchorPrice(dynamicPrice)}</span>
                      <span className={`text-base font-bold ${theme.text}`}>${dynamicPrice.toFixed(2)}</span>
                   </div>
                </div>
              </div>
            </div>
          )}})}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-32 flex flex-col items-center">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
               <Search className="w-8 h-8 text-gray-300" />
             </div>
             <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
             <p className="text-gray-500 max-w-md mx-auto">We couldn't find what you're looking for. Try adjusting your search or filters to discover our collection.</p>
          </div>
        )}

      </main>

      {/* 4. Footer (Trust & Design) */}
      <footer className={`${theme.footer} text-white border-t mt-24`}>
        {/* ... existing footer ... */}
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 border-b border-white/10 pb-12">
             <div className="flex flex-col items-center text-center p-4">
                <Truck className={`w-8 h-8 ${theme.accent} mb-4`} />
                <h4 className="font-bold mb-2">Global Shipping</h4>
                <p className="text-xs text-gray-400">Fast delivery to 150+ countries via DHL Express.</p>
             </div>
             <div className="flex flex-col items-center text-center p-4">
                <ShieldCheck className={`w-8 h-8 ${theme.accent} mb-4`} />
                <h4 className="font-bold mb-2">Secure Payment</h4>
                <p className="text-xs text-gray-400">256-bit SSL encryption. We accept Crypto & Cards.</p>
             </div>
             <div className="flex flex-col items-center text-center p-4">
                <TrendingUp className={`w-8 h-8 ${theme.accent} mb-4`} />
                <h4 className="font-bold mb-2">Quality Guarantee</h4>
                <p className="text-xs text-gray-400">30-day return policy if you aren't completely satisfied.</p>
             </div>
             <div className="flex flex-col items-center text-center p-4">
                <Zap className={`w-8 h-8 ${theme.accent} mb-4`} />
                <h4 className="font-bold mb-2">24/7 Support</h4>
                <p className="text-xs text-gray-400">Our concierge team is always available to help.</p>
             </div>
          </div>
          {/* ... existing footer content ... */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <div className="font-bold text-2xl mb-6 brand-font">VANGUARD</div>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">Defining the future of commerce with minimalist aesthetics, premium quality, and technological innovation.</p>
              <div className="flex gap-4">
               <Instagram className={`w-5 h-5 hover:${theme.accent} cursor-pointer transition-colors`} />
               <Facebook className={`w-5 h-5 hover:${theme.accent} cursor-pointer transition-colors`} />
               <Twitter className={`w-5 h-5 hover:${theme.accent} cursor-pointer transition-colors`} />
             </div>
            </div>
            <div>
              <h4 className={`font-bold mb-6 text-sm uppercase tracking-widest ${theme.accent}`}>Collection</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">New Arrivals</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Best Sellers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Limited Edition</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sale</a></li>
              </ul>
            </div>
            <div>
              <h4 className={`font-bold mb-6 text-sm uppercase tracking-widest ${theme.accent}`}>Support</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Track Order</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Returns & Exchanges</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
            <div>
               <h4 className={`font-bold mb-6 text-sm uppercase tracking-widest ${theme.accent}`}>Newsletter</h4>
               <p className="text-xs text-gray-400 mb-4">Subscribe for exclusive drops and early access.</p>
               <div className="flex gap-2">
                 <input type="email" placeholder="Email address" className="bg-white/5 border border-white/10 px-4 py-3 text-sm w-full focus:outline-none focus:border-[#00f0ff] text-white rounded-lg" />
                 <button className={`bg-white text-black px-4 rounded-lg font-bold hover:bg-[#00f0ff] transition-colors`}><ArrowRight className="w-5 h-5" /></button>
               </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-20 pt-8 flex flex-col items-center">
             <div className="flex gap-4 mb-6">
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border border-white/10 ${isHoliday ? 'bg-red-900/50 text-red-200' : (isNight ? 'bg-blue-900/30 text-blue-200' : 'bg-yellow-100 text-yellow-800')}`}>
                   {isHoliday ? <Snowflake className="w-3 h-3" /> : (isNight ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />)}
                   {isHoliday ? 'HOLIDAY MODE' : (isNight ? 'NIGHT MODE' : 'DAY MODE')}
                </div>
             </div>
             <button onClick={onAdminLogin} className="text-[10px] text-gray-600 hover:text-gray-400 flex items-center justify-center gap-1 mb-4 transition-colors uppercase tracking-widest">
                <LogIn className="w-3 h-3" /> Staff Entry
             </button>
             <p className="text-xs text-gray-500">© 2024 Vanguard Commerce. Powered by Next-Gen OS.</p>
          </div>
        </div>
      </footer>

      {/* 5. Gamified Cart Drawer (Existing + Profit Boosters) */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)} />
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className={`w-screen max-w-md ${theme.drawerBg} shadow-2xl flex flex-col animate-[slideInRight_0.3s_ease-out]`}>
              <div className={`flex items-center justify-between p-6 border-b ${theme.drawerBorder}`}>
                <h2 className="text-lg font-bold brand-font flex items-center gap-2">
                  SHOPPING BAG 
                  <span className={`${theme.badge} text-xs px-2 py-0.5 rounded-full`}>{cartCount}</span>
                </h2>
                <button onClick={() => setIsCartOpen(false)}><X className={`w-6 h-6 ${theme.muted} hover:${theme.text}`} /></button>
              </div>
              <div className={`${isNight ? 'bg-white/5' : 'bg-gray-50'} px-6 py-4 border-b ${theme.drawerBorder}`}>
                 <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-wide">
                    <span>{shippingProgress < 100 ? `Spend $${(freeShippingThreshold - cartProductTotal).toFixed(2)} for Free Shipping` : "🎉 You've unlocked Free Shipping!"}</span>
                    <span>{Math.round(shippingProgress)}%</span>
                 </div>
                 <div className={`w-full h-2 ${isNight ? 'bg-white/10' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                    <div 
                      className={`h-full bg-gradient-to-r ${isHoliday ? 'from-green-500 to-red-500' : 'from-black to-[#00f0ff]'} transition-all duration-500`}
                      style={{ width: `${shippingProgress}%` }}
                    />
                 </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                 {cart.length === 0 ? (
                   <div className={`h-full flex flex-col items-center justify-center ${theme.muted}`}>
                      <div className={`w-20 h-20 ${isNight ? 'bg-white/5' : 'bg-gray-50'} rounded-full flex items-center justify-center mb-6`}>
                        <ShoppingBag className="w-8 h-8 opacity-20" />
                      </div>
                      <p className={`text-lg font-bold ${theme.text}`}>Your bag is empty</p>
                      <button onClick={() => setIsCartOpen(false)} className={`px-8 py-3 ${theme.btnPrimary} rounded-lg mt-4`}>Start Shopping</button>
                   </div>
                 ) : (
                   <div className="space-y-6">
                     {cart.map(item => {
                       const dynamicPrice = getDynamicPrice(item.price);
                       return (
                       <div key={item.id} className="flex gap-4 group">
                         <div className={`w-24 h-32 ${isNight ? 'bg-white/5' : 'bg-gray-100'} rounded-lg overflow-hidden flex-shrink-0 relative`}>
                           <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                         </div>
                         <div className="flex-1 flex flex-col justify-between py-1">
                           <div>
                             <div className="flex justify-between mb-1">
                               <h3 className={`font-bold text-sm ${theme.text} leading-tight`}>{item.title}</h3>
                               <p className="font-bold text-sm ml-2">${(dynamicPrice * item.quantity).toFixed(2)}</p>
                             </div>
                             <p className={`text-xs ${theme.muted} mb-2`}>{item.category}</p>
                           </div>
                           <div className="flex justify-between items-center">
                              <div className={`flex items-center border ${theme.drawerBorder} rounded-lg ${isNight ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <button onClick={() => updateQuantity(item.id, -1)} className={`px-3 py-1 hover:${isNight ? 'bg-white/10' : 'bg-gray-200'} transition-colors ${theme.muted}`}>-</button>
                                <span className="px-2 text-xs font-bold w-6 text-center">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, 1)} className={`px-3 py-1 hover:${isNight ? 'bg-white/10' : 'bg-gray-200'} transition-colors ${theme.muted}`}>+</button>
                              </div>
                              <button onClick={() => removeFromCart(item.id)} className="text-xs text-gray-400 hover:text-red-500 underline decoration-gray-300 underline-offset-2 transition-colors">Remove</button>
                           </div>
                         </div>
                       </div>
                     )})}
                   </div>
                 )}
              </div>
              {cart.length > 0 && (
                <div className={`border-t ${theme.drawerBorder} p-6 ${theme.drawerBg} shadow-[0_-5px_20px_rgba(0,0,0,0.05)]`}>
                   {/* Profit Boosters: Add-ons */}
                   {profitSettings.addProtectionFee && (
                     <div className="flex items-center justify-between mb-3 text-sm">
                        <div className={`flex items-center gap-2 ${theme.muted}`}>
                           <ShieldCheck className="w-4 h-4 text-[#00ff9d]" />
                           <span className="font-medium">Shipping Protection</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            checked={hasInsurance} 
                            onChange={(e) => setHasInsurance(e.target.checked)}
                            className="accent-black h-4 w-4"
                          />
                          <span className={`font-bold ${theme.text}`}>+{INSURANCE_FEE}</span>
                        </div>
                     </div>
                   )}
                   {profitSettings.addProcessingFee && (
                     <div className="flex items-center justify-between mb-3 text-sm">
                        <span className={`${theme.muted} text-xs`}>Processing & Handling</span>
                        <span className={`${theme.text} text-xs font-bold`}>+${processingFee.toFixed(2)}</span>
                     </div>
                   )}
                   
                   {/* Active Reward Display */}
                   {activeReward && activeReward.type !== 'none' && (
                     <div className="flex items-center justify-between mb-3 text-sm text-green-600 font-bold bg-green-500/10 p-2 rounded-lg">
                        <span className="flex items-center gap-2"><Ticket className="w-4 h-4" /> {activeReward.label} Applied</span>
                        <span>{activeReward.type === 'discount' || activeReward.type === 'credit' ? `-$${(discountAmount + creditAmount).toFixed(2)}` : 'Active'}</span>
                     </div>
                   )}
                   
                   {/* Upsell: Priority */}
                   <div className={`${isNight ? 'bg-white/5' : 'bg-gray-50'} p-3 rounded-lg flex items-center justify-between mb-4 border ${theme.drawerBorder}`}>
                      <div className="flex items-center gap-2">
                         <Zap className="w-4 h-4 text-orange-500 fill-orange-500" />
                         <span className={`text-xs font-bold ${isNight ? 'text-gray-300' : 'text-gray-700'}`}>Priority Dispatch (+$9.99)</span>
                      </div>
                      <button className="text-[10px] font-bold bg-black text-white px-2 py-1 rounded hover:bg-gray-800">ADD</button>
                   </div>
                   
                   {profitSettings.enablePrimeUpsell && (
                      <div className="bg-gradient-to-r from-[#7000ff] to-[#a000ff] p-3 rounded-lg flex items-center justify-between mb-4 text-white shadow-lg">
                        <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 fill-white text-white" />
                            <div>
                              <p className="text-xs font-bold">Join Vanguard Prime</p>
                              <p className="text-[10px] opacity-80">Free Shipping on all orders</p>
                            </div>
                        </div>
                        <button className="text-[10px] font-bold bg-white text-[#7000ff] px-2 py-1 rounded hover:bg-gray-100">ADD ($29)</button>
                      </div>
                   )}

                   <div className="flex justify-between mb-6 text-lg font-bold">
                     <span>Total</span>
                     <span>${cartGrandTotal.toFixed(2)}</span>
                   </div>
                   <button 
                     onClick={handleCheckout}
                     className={`w-full ${theme.btnPrimary} py-4 rounded-xl font-bold tracking-wide transition-all flex items-center justify-center gap-2 group relative overflow-hidden`}
                   >
                     <span className="relative z-10 flex items-center gap-2">CHECKOUT <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
                   </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. Social Proof Toast (Bottom Left) */}
      {showRecentPurchase && (
        <div className={`fixed bottom-6 left-6 z-30 ${theme.cardBg} shadow-xl rounded-lg p-4 flex items-center gap-4 animate-[slideUp_0.5s_ease-out] max-w-xs border border-gray-100`}>
           <div className={`w-12 h-12 ${isNight ? 'bg-white/10' : 'bg-gray-100'} rounded-md overflow-hidden flex-shrink-0`}>
             <img src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=100" className="w-full h-full object-cover" alt="Product" />
           </div>
           <div>
              <p className={`text-xs ${theme.muted}`}><span className={`font-bold ${theme.text}`}>{currentRecentPurchase.name}</span> in {currentRecentPurchase.location}</p>
              <p className={`text-xs ${theme.text} mt-0.5`}>Just purchased <span className="font-bold">{currentRecentPurchase.item}</span></p>
           </div>
           <button onClick={() => setShowRecentPurchase(false)} className={`absolute top-1 right-1 ${theme.muted} hover:${theme.text}`}><X className="w-3 h-3" /></button>
        </div>
      )}

      {/* 7. Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className={`${theme.cardBg} ${theme.text} rounded-2xl w-full max-w-sm p-8 shadow-2xl relative animate-[scaleIn_0.2s_ease-out]`}>
              <button onClick={() => setIsLoginModalOpen(false)} className={`absolute top-4 right-4 ${theme.muted} hover:${theme.text}`}><X className="w-5 h-5" /></button>
              <div className="text-center mb-8">
                 <div className={`w-16 h-16 ${isNight ? 'bg-white/10' : 'bg-gray-50'} rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse`}><User className={`w-8 h-8 ${theme.text}`} /></div>
                 <h2 className="text-2xl font-bold mb-2 brand-font tracking-tight">Access Your World</h2>
                 <p className={`text-sm ${theme.muted}`}>Sign in for exclusive drops and early access.</p>
              </div>
              <button onClick={handleGoogleLogin} disabled={isLoggingIn} className={`w-full flex items-center justify-center gap-3 ${theme.bg} border ${theme.border} hover:opacity-80 py-3 rounded-xl transition-all mb-4`}>
                 {isLoggingIn ? <Loader2 className={`w-5 h-5 animate-spin ${theme.muted}`} /> : <span className={`font-medium ${theme.text}`}>Continue with Google</span>}
              </button>
              <button onClick={() => setIsLoginModalOpen(false)} className={`w-full ${theme.btnPrimary} py-3 rounded-xl font-bold transition-all`}>Browse Collection</button>
          </div>
        </div>
      )}
      
      {/* 8. Profit Wheel Floating Trigger */}
      {!hasSpun && (
        <button 
          onClick={() => setIsProfitWheelOpen(true)}
          className={`fixed bottom-6 right-6 z-40 ${isHoliday ? 'bg-gradient-to-r from-red-500 to-green-500' : 'bg-gradient-to-r from-yellow-400 to-yellow-600'} text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform animate-bounce group`}
        >
           <Ticket className="w-8 h-8 fill-white/20" />
           <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white">FREE SPIN</span>
        </button>
      )}

      {/* 9. Profit Wheel Modal */}
      {isProfitWheelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-[fadeIn_0.3s_ease-out]">
           <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl relative border-4 border-yellow-400 overflow-hidden">
              <button onClick={() => setIsProfitWheelOpen(false)} className="absolute top-4 right-4 z-10 bg-black/10 rounded-full p-1 text-black hover:bg-black/20"><X className="w-6 h-6" /></button>
              
              <div className="text-center mb-6">
                 <h2 className="text-3xl font-bold brand-font text-black mb-1">SPIN & WIN</h2>
                 <p className="text-gray-500 text-sm font-medium">Daily prizes unlocked for members</p>
              </div>

              <div className="relative w-72 h-72 mx-auto mb-8">
                 {/* Pointer */}
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20">
                    <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-black filter drop-shadow-lg"></div>
                 </div>

                 {/* Wheel */}
                 <div 
                   className="w-full h-full rounded-full border-8 border-white shadow-xl relative overflow-hidden transition-transform duration-[4000ms] cubic-bezier(0.2, 0.8, 0.2, 1)"
                   style={{ 
                     background: wheelGradient,
                     transform: `rotate(${wheelRotation}deg)`
                   }}
                 >
                    {/* Render Segments Text */}
                    {WHEEL_SEGMENTS.map((seg, i) => {
                       // 8 segments = 45deg each. Center of segment is i*45 + 22.5
                       const rotation = (i * 45) + 22.5;
                       return (
                         <div 
                           key={seg.id}
                           className="absolute top-0 left-0 w-full h-full flex justify-center pt-4 pointer-events-none"
                           style={{ transform: `rotate(${rotation}deg)` }}
                         >
                           <span className="text-white font-bold text-xs uppercase tracking-wider drop-shadow-md" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                              {seg.label}
                           </span>
                         </div>
                       )
                    })}
                 </div>
              </div>

              {spinResult ? (
                 <div className="text-center animate-[scaleIn_0.3s_ease-out]">
                    <div className="flex justify-center mb-3">
                       {spinResult.type !== 'none' ? <PartyPopper className="w-12 h-12 text-yellow-500 animate-bounce" /> : <Loader2 className="w-10 h-10 text-gray-400" />}
                    </div>
                    <h3 className="text-2xl font-bold text-black mb-2">{spinResult.label}</h3>
                    <p className="text-gray-600 text-sm mb-6">{spinResult.text}</p>
                    {spinResult.type !== 'none' ? (
                      <button onClick={handleClaimPrize} className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors uppercase animate-pulse">
                         Claim Prize & Shop
                      </button>
                    ) : (
                      <button onClick={() => setIsProfitWheelOpen(false)} className="w-full bg-gray-200 text-gray-800 py-4 rounded-xl font-bold hover:bg-gray-300 transition-colors uppercase">
                         Close
                      </button>
                    )}
                 </div>
              ) : (
                 <button 
                   onClick={handleSpinWheel} 
                   disabled={isSpinning}
                   className={`w-full py-4 rounded-xl font-bold text-lg uppercase transition-all shadow-lg flex items-center justify-center gap-2 ${
                     isSpinning ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#00f0ff] text-black hover:bg-[#00c8d5] hover:scale-105'
                   }`}
                 >
                   {isSpinning ? 'Spinning...' : 'SPIN NOW'}
                 </button>
              )}
              
              {!user && (
                 <p className="text-center text-xs text-gray-400 mt-4">Login required to claim prizes.</p>
              )}
           </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
         <div className="fixed inset-0 z-50 bg-white md:hidden animate-[slideIn_0.2s_ease-out] flex flex-col">
            <div className="p-4 flex justify-between items-center border-b">
               <span className="font-bold text-xl tracking-tight">MENU</span>
               <button onClick={() => setIsMobileMenuOpen(false)}><X className="w-6 h-6" /></button>
            </div>
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
               {user && (
                 <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                    <img src={user.avatar} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" alt={user.name} />
                    <div>
                      <p className="font-bold text-lg">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                 </div>
               )}
               <div className="space-y-2">
                 {categories.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => { setActiveCategory(cat); setIsMobileMenuOpen(false); }}
                      className="flex justify-between w-full text-left text-2xl font-bold py-3 border-b border-gray-100 active:scale-95 transition-transform"
                    >
                      {cat} <ChevronRight className="w-5 h-5 text-gray-300" />
                    </button>
                  ))}
               </div>
               <div className="pt-4">
                  {!user ? (
                    <button onClick={() => { setIsMobileMenuOpen(false); setIsLoginModalOpen(true); }} className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg shadow-lg">Login / Join</button>
                  ) : (
                    <button onClick={handleLogout} className="w-full border-2 border-gray-100 text-red-500 py-4 rounded-xl font-bold">Log Out</button>
                  )}
               </div>
            </div>
         </div>
      )}

    </div>
  );
};

export default Storefront;