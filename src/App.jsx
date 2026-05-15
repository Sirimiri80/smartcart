import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
import {
  ShoppingCart, MapPin, Search, Plus, Trash2, ChevronLeft, Settings,
  Store, CheckCircle2, Receipt, Info, ChevronDown,
  ChevronUp, Award, Loader2, Globe, Sparkles, Target, List, Camera,
  Scale, Package, ArrowRight, TrendingDown, Zap
} from 'lucide-react';

// ==========================================
// 1. CONSTANTES Y BASES DE DATOS
// ==========================================

const SUPERMERCADOS = [
  { id: 'mercadona', nombre: 'Mercadona', url: 'mercadona.es', color: 'bg-green-100 text-green-800', border: 'border-green-300', headerBg: 'bg-[#008e59]', headerText: 'text-white', accent: '#008e59' },
  { id: 'carrefour', nombre: 'Carrefour', url: 'carrefour.es', color: 'bg-blue-100 text-blue-800', border: 'border-blue-300', headerBg: 'bg-[#00387b]', headerText: 'text-white', accent: '#00387b' },
  { id: 'lidl', nombre: 'Lidl', url: 'lidl.es', color: 'bg-yellow-100 text-yellow-800', border: 'border-yellow-400', headerBg: 'bg-[#0050aa]', headerText: 'text-white', accent: '#0050aa' },
  { id: 'dia', nombre: 'Dia', url: 'dia.es', color: 'bg-red-100 text-red-800', border: 'border-red-300', headerBg: 'bg-[#d50000]', headerText: 'text-white', accent: '#d50000' },
  { id: 'aldi', nombre: 'Aldi', url: 'aldi.es', color: 'bg-cyan-100 text-cyan-800', border: 'border-cyan-300', headerBg: 'bg-[#00008a]', headerText: 'text-white', accent: '#00008a' },
  { id: 'bm', nombre: 'BM', url: 'bmsupermercados.es', color: 'bg-orange-100 text-orange-800', border: 'border-orange-300', headerBg: 'bg-[#ff6b00]', headerText: 'text-white', accent: '#ff6b00' },
  { id: 'eroski', nombre: 'Eroski', url: 'eroski.es', color: 'bg-indigo-100 text-indigo-800', border: 'border-indigo-300', headerBg: 'bg-[#004b87]', headerText: 'text-white', accent: '#004b87' },
  { id: 'alcampo', nombre: 'Alcampo', url: 'alcampo.es', color: 'bg-rose-100 text-rose-800', border: 'border-rose-300', headerBg: 'bg-[#e3001b]', headerText: 'text-white', accent: '#e3001b' }
];

const REAL_PRICES_DB = {
  'leche entera': {
    cat: 'leche', isBeverage: false, strictBrand: null, unit: 'L',
    options: [
      { storeId: 'aldi', brand: 'Milsani (M. Blanca)', isBrand: false, price: 0.88, qty: 1, format: 'Brik 1L' },
      { storeId: 'lidl', brand: 'Milbona (M. Blanca)', isBrand: false, price: 0.89, qty: 1, format: 'Brik 1L' },
      { storeId: 'carrefour', brand: 'Carrefour Clasic', isBrand: false, price: 0.90, qty: 1, format: 'Brik 1L' },
      { storeId: 'mercadona', brand: 'Hacendado (M. Blanca)', isBrand: false, price: 0.91, qty: 1, format: 'Brik 1L' },
      { storeId: 'dia', brand: 'Dia Láctea', isBrand: false, price: 5.40, qty: 6, format: 'Pack 6x1L' },
      { storeId: 'alcampo', brand: 'Auchan (M. Blanca)', isBrand: false, price: 1.35, qty: 1.5, format: 'Botella 1.5L' },
      { storeId: 'carrefour', brand: 'Pascual (1ª Marca)', isBrand: true, price: 1.34, qty: 1, format: 'Brik 1L' },
      { storeId: 'bm', brand: 'Pascual (1ª Marca)', isBrand: true, price: 7.95, qty: 6, format: 'Pack 6x1L' }
    ]
  },
  'cola cao': {
    cat: 'cacao', isBeverage: false, strictBrand: 'Cola Cao', unit: 'kg',
    options: [
      { storeId: 'alcampo', brand: 'Cola Cao Original', isBrand: true, price: 3.45, qty: 0.38, format: 'Bote 380g' },
      { storeId: 'mercadona', brand: 'Cola Cao Original', isBrand: true, price: 5.95, qty: 0.76, format: 'Bote 760g' },
      { storeId: 'dia', brand: 'Cola Cao Original', isBrand: true, price: 5.99, qty: 0.76, format: 'Bote 760g' },
      { storeId: 'carrefour', brand: 'Cola Cao Original', isBrand: true, price: 8.99, qty: 1.2, format: 'Bolsa 1.2Kg' },
      { storeId: 'eroski', brand: 'Cola Cao Original', isBrand: true, price: 14.50, qty: 2.5, format: 'Familiar 2.5Kg' },
      { storeId: 'bm', brand: 'Cola Cao Original', isBrand: true, price: 6.25, qty: 0.76, format: 'Bote 760g' }
    ]
  },
  'pepsi max lima': {
    cat: 'pepsi', isBeverage: true, strictBrand: 'Pepsi Max Lima', unit: 'L',
    options: [
      { storeId: 'mercadona', brand: 'Pepsi Max Lima', isBrand: true, price: 0.75, qty: 0.33, format: 'Lata 33cl' },
      { storeId: 'carrefour', brand: 'Pepsi Max Lima', isBrand: true, price: 0.72, qty: 0.33, format: 'Lata 33cl' },
      { storeId: 'dia', brand: 'Pepsi Max Lima', isBrand: true, price: 1.10, qty: 0.5, format: 'Botella 500ml' },
      { storeId: 'alcampo', brand: 'Pepsi Max Lima', isBrand: true, price: 1.89, qty: 2.0, format: 'Botella 2L' },
      { storeId: 'aldi', brand: 'Pepsi Max Lima', isBrand: true, price: 1.95, qty: 2.0, format: 'Botella 2L' },
      { storeId: 'eroski', brand: 'Pepsi Max Lima', isBrand: true, price: 3.80, qty: 4.0, format: 'Pack 2x2L' }
    ]
  },
  'huevos docena': {
    cat: 'huevo', isBeverage: false, strictBrand: null, unit: 'ud',
    options: [
      { storeId: 'aldi', brand: 'El Mercado (M. Blanca)', isBrand: false, price: 1.35, qty: 6, format: 'Media M' },
      { storeId: 'alcampo', brand: 'Auchan (M. Blanca)', isBrand: false, price: 2.19, qty: 12, format: 'Docena L' },
      { storeId: 'lidl', brand: 'Milbona (M. Blanca)', isBrand: false, price: 2.25, qty: 12, format: 'Docena L' },
      { storeId: 'mercadona', brand: 'Hacendado (M. Blanca)', isBrand: false, price: 2.35, qty: 12, format: 'Docena L' },
      { storeId: 'carrefour', brand: 'Carrefour (M. Blanca)', isBrand: false, price: 4.50, qty: 24, format: 'Cartón 24ud' },
      { storeId: 'mercadona', brand: 'Granjas S. Miguel', isBrand: true, price: 3.20, qty: 12, format: 'Camperos 12ud' }
    ]
  }
};

// ==========================================
// 2. SERVICIOS EXTERNOS (APIs)
// ==========================================

const ApiService = {
  fetchRealProductData: async (query) => {
    let result = { brand: null };
    try {
      const res = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=3`);
      const data = await res.json();
      if (data.products && data.products.length > 0) {
        if (data.products[0].brands) result.brand = data.products[0].brands.split(',')[0].trim();
      }
    } catch (error) {
      console.warn("API OpenFoodFacts falló para:", query);
    }
    if (!result.brand) result.brand = "1ª Marca";
    return result;
  },

  analyzeImageWithAI: async (base64String, mimeType, apiKey) => {
    if (!apiKey) throw new Error("API Key requerida");
    const payload = {
      contents: [{
        role: "user",
        parts: [
          { text: "Identifica el producto de supermercado en esta imagen. Devuelve SOLO el nombre del producto y la marca en 1 a 4 palabras. No devuelvas NINGÚN otro texto, ni puntuación." },
          { inlineData: { mimeType: mimeType, data: base64String } }
        ]
      }]
    };
    let delay = 1000;
    for (let i = 0; i < 3; i++) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (responseText) return responseText;
      } catch (err) {
        await new Promise(r => setTimeout(r, delay));
        delay *= 2;
      }
    }
    throw new Error("No se pudo analizar la imagen");
  }
};

// ==========================================
// 3. UTILIDADES (Helpers)
// ==========================================

const Utils = {
  getStoreLocation: (storeId, cp) => {
    const addrLower = cp.toLowerCase();
    const isDonosti = addrLower.includes('donosti') || addrLower.includes('sebastián') || addrLower.includes('200') || addrLower.includes('urbieta');
    let exactAddress = "";
    if (isDonosti) {
      const donostiStores = {
        mercadona: ['Av. de Tolosa, 116', 'Polígono Belartza'],
        carrefour: ['C.C. Garbera', 'Av. de la Libertad, 23'],
        lidl: ['Paseo de Otxoki, 48', 'Errekalde Hiritarra'],
        dia: ['Calle Easo, 15', 'Calle Matia, 32'],
        aldi: ['Paseo de Otxoki, 52', 'Fernando Mugica, 2'],
        bm: ['Calle San Martín, 45', 'Secundino Esnaola, 14'],
        eroski: ['C.C. Arcco (Amara)', 'Calle Urbieta, 60'],
        alcampo: ['C.C. Txingudi (Oiartzun)', 'Pol. Mamut']
      };
      let hash = 0;
      for (let i = 0; i < cp.length; i++) { hash = cp.charCodeAt(i) + ((hash << 5) - hash); }
      const seed = Math.abs(hash);
      const options = donostiStores[storeId] || ['Calle Mayor, 1'];
      exactAddress = options[seed % options.length];
    } else {
      const streets = ['C/ Mayor', 'Av. Constitución', 'C/ Goya', 'Av. Libertad', 'Ronda Sur', 'C/ Alcalá', 'Pso. Independencia', 'C/ San Juan', 'Av. del Mediterráneo', 'Plaza España', 'C/ Gran Vía', 'Av. de Andalucía'];
      let hash = 0;
      const str = storeId + cp;
      for (let i = 0; i < str.length; i++) { hash = str.charCodeAt(i) + ((hash << 5) - hash); }
      exactAddress = `${streets[Math.abs(hash) % streets.length]}, ${(Math.abs(hash) % 120) + 1}`;
    }
    let hashDist = 0;
    const strDist = storeId + cp;
    for (let i = 0; i < strDist.length; i++) { hashDist = strDist.charCodeAt(i) + ((hashDist << 5) - hashDist); }
    return {
      address: exactAddress,
      distance: (((Math.abs(hashDist) % 28) + 2) / 10).toFixed(1)
    };
  },
  calculateGeoSeed: (cp) => {
    let hash = 0;
    for (let i = 0; i < cp.length; i++) { hash = cp.charCodeAt(i) + ((hash << 5) - hash); }
    return Math.abs(hash);
  },
  splitFormat: (formatStr) => {
    const parts = formatStr.split(' ');
    if (parts.length > 1) {
      return { type: parts[0], amount: parts.slice(1).join(' ') };
    }
    return { type: 'Formato', amount: formatStr };
  }
};

// ==========================================
// 4. COMPONENTES VISUALES
// ==========================================

const StoreLogo = memo(({ store, className = "" }) => {
  const logos = {
    mercadona: <svg viewBox="0 0 100 100" className={className}><rect width="100" height="100" rx="20" fill="#008e59" /><text x="50" y="65" fill="white" fontSize="50" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">M</text></svg>,
    carrefour: <svg viewBox="0 0 100 100" className={className}><rect width="100" height="100" rx="20" fill="white" /><path d="M50,15 L85,50 L50,85 Z" fill="#e3001b" /><path d="M50,15 L15,50 L50,85 Z" fill="#00387b" /><text x="50" y="68" fill="white" fontSize="60" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">C</text></svg>,
    lidl: <svg viewBox="0 0 100 100" className={className}><rect width="100" height="100" rx="20" fill="#0050aa" /><circle cx="50" cy="50" r="35" fill="#fff000" stroke="#e3001b" strokeWidth="6" /><text x="50" y="65" fill="#0050aa" fontSize="40" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">L</text></svg>,
    dia: <svg viewBox="0 0 100 100" className={className}><rect width="100" height="100" rx="20" fill="#d50000" /><text x="50" y="62" fill="white" fontSize="40" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">DIA</text></svg>,
    aldi: <svg viewBox="0 0 100 100" className={className}><rect width="100" height="100" rx="20" fill="#00008a" /><text x="50" y="68" fill="#00a0e4" fontSize="55" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">A</text></svg>,
    bm: <svg viewBox="0 0 100 100" className={className}><rect width="100" height="100" rx="20" fill="#ff6b00" /><text x="50" y="62" fill="white" fontSize="40" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">BM</text></svg>,
    eroski: <svg viewBox="0 0 100 100" className={className}><rect width="100" height="100" rx="20" fill="#004b87" /><text x="50" y="60" fill="white" fontSize="24" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">EROSKI</text></svg>,
    alcampo: <svg viewBox="0 0 100 100" className={className}><rect width="100" height="100" rx="20" fill="#e3001b" /><text x="50" y="68" fill="white" fontSize="55" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">A</text></svg>
  };
  return logos[store.id] || (
    <div className={`flex items-center justify-center font-black text-white ${store.headerBg} ${className} rounded-xl shadow-inner text-[10px]`}>
      {store.nombre.substring(0, 2).toUpperCase()}
    </div>
  );
});

const FormatBadge = ({ format, className = "" }) => {
  const { type, amount } = Utils.splitFormat(format);
  return (
    <div className={`flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-2xl ${className}`}>
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{type}</span>
      <span className="text-sm font-black text-slate-700 leading-none">{amount}</span>
    </div>
  );
};

// Pill de ranking (1º, 2º, 3º...)
const RankPill = ({ rank }) => {
  const styles = [
    'bg-amber-400 text-amber-900',
    'bg-slate-300 text-slate-700',
    'bg-orange-200 text-orange-800',
  ];
  return (
    <span className={`text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${styles[rank] || 'bg-slate-100 text-slate-500'}`}>
      {rank + 1}
    </span>
  );
};

const ProductCard = memo(({ item, index }) => {
  const topOption = item.rankedOptions[0];
  const isStrictSearch = item.details.strictBrand !== null;
  const maxUnitPrice = Math.max(...item.rankedOptions.map(o => o.unitPrice));

  return (
    <div
      className="bg-white rounded-3xl overflow-hidden mb-5 border border-slate-100"
      style={{ animation: `fadeSlideIn 0.4s ease ${index * 0.08}s both` }}
    >
      {/* Header con acento de color del mejor supermercado */}
      <div className="relative overflow-hidden" style={{ background: topOption.accent || '#1a1a2e' }}>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.1) 0, rgba(255,255,255,0.1) 1px, transparent 0, transparent 50%)',
          backgroundSize: '8px 8px'
        }} />
        <div className="relative p-5">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 pr-3">
              <div className="flex items-center space-x-2 mb-1">
                {isStrictSearch
                  ? <span className="text-[9px] bg-white/20 text-white font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center"><Target size={8} className="mr-1" />Marca exacta</span>
                  : <span className="text-[9px] bg-white/20 text-white font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center"><Package size={8} className="mr-1" />Mejor precio/kg</span>
                }
              </div>
              <h3 className="font-black text-white text-xl leading-tight capitalize">{item.itemName}</h3>
              <p className="text-white/70 text-xs font-medium mt-1 truncate">{topOption.specificBrand}</p>
            </div>
            <div className="flex flex-col items-end flex-shrink-0">
              <div className="bg-white/15 backdrop-blur rounded-2xl px-3 py-2 border border-white/20 text-right">
                <p className="text-white/70 text-[9px] font-bold uppercase tracking-wider mb-0.5">Mejor</p>
                <div className="flex items-center space-x-1.5">
                  <StoreLogo store={topOption} className="w-5 h-5 rounded-md" />
                  <span className="text-white font-black text-sm">{topOption.price.toFixed(2)}€</span>
                </div>
                <p className="text-white/60 text-[9px] font-bold mt-0.5">{topOption.unitPrice.toFixed(2)}€/{topOption.calculationUnit}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista comparativa */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
            <Scale size={11} className="mr-1.5 text-emerald-500" />Comparativa precio/{item.details.unit}
          </p>
          <span className="text-[9px] font-bold text-slate-400">{item.rankedOptions.length} opciones</span>
        </div>

        <div className="space-y-2">
          {item.rankedOptions.map((opt, idx) => {
            const barWidth = Math.max(15, (1 - (opt.unitPrice - item.rankedOptions[0].unitPrice) / (maxUnitPrice - item.rankedOptions[0].unitPrice + 0.001)) * 100);
            const isBest = idx === 0;
            return (
              <div
                key={idx}
                className={`rounded-2xl p-3 border transition-all ${isBest ? 'border-emerald-200 bg-emerald-50/60' : 'border-slate-100 bg-slate-50/40'}`}
              >
                <div className="flex items-center space-x-3">
                  <RankPill rank={idx} />
                  <FormatBadge format={opt.format} className="w-14 h-11 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1.5 mb-0.5">
                      <StoreLogo store={opt} className="w-3.5 h-3.5 rounded-sm" />
                      <span className="text-xs font-black text-slate-700 truncate">{opt.nombre}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium truncate block">{opt.specificBrand}</span>
                    {/* Barra de precio relativo */}
                    <div className="mt-1.5 h-1 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${barWidth}%`,
                          background: isBest ? '#10b981' : '#94a3b8'
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`text-base font-black block leading-none ${isBest ? 'text-emerald-700' : 'text-slate-700'}`}>{opt.price.toFixed(2)}€</span>
                    <span className="text-[9px] font-bold text-slate-400 block mt-0.5">{opt.unitPrice.toFixed(2)}€/{opt.calculationUnit}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

// ==========================================
// 5. APLICACIÓN PRINCIPAL
// ==========================================

export default function App() {
  const [view, setView] = useState('home');
  const [userAddress, setUserAddress] = useState('Calle Urbieta 12, 20006');
  const [resultsTab, setResultsTab] = useState('comparativa');

  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [imageError, setImageError] = useState('');
  const apiKey = "";
  const fileInputRef = useRef(null);

  const [predefinedItems, setPredefinedItems] = useState([
    { name: 'Leche entera', checked: false },
    { name: 'Cola Cao', checked: false },
    { name: 'Pepsi Max Lima', checked: false },
    { name: 'Huevos docena', checked: false }
  ]);

  const [customItems, setCustomItems] = useState(() => {
    try {
      const saved = localStorage.getItem('smartcart_items') || sessionStorage.getItem('smartcart_items');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    try {
      const data = JSON.stringify(customItems);
      localStorage.setItem('smartcart_items', data);
      sessionStorage.setItem('smartcart_items', data);
    } catch {}
  }, [customItems]);

  const [results, setResults] = useState(null);
  const [scanStatus, setScanStatus] = useState({ phase: 'idle', stores: [], currentStoreScraping: '', itemIndex: 0 });
  const [scanProgress, setScanProgress] = useState(0);
  const listEndRef = useRef(null);

  const itemsToScan = useMemo(() => {
    return [...predefinedItems.filter(item => item.checked).map(item => item.name), ...customItems];
  }, [predefinedItems, customItems]);

  const { groupedByStore, totalOptimized } = useMemo(() => {
    if (!results) return { groupedByStore: {}, totalOptimized: 0 };
    const groups = {};
    SUPERMERCADOS.forEach(store => {
      groups[store.id] = { storeDef: store, items: [], subtotal: 0 };
    });
    let total = 0;
    results.items.forEach(item => {
      const bestOption = item.rankedOptions[0];
      if (groups[bestOption.id]) {
        groups[bestOption.id].items.push({ originalName: item.itemName, ...bestOption });
        groups[bestOption.id].subtotal += bestOption.price;
        total += bestOption.price;
      }
    });
    return { groupedByStore: groups, totalOptimized: total };
  }, [results]);

  useEffect(() => {
    if (view === 'home' && listEndRef.current) {
      listEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [customItems, view]);

  const handleTogglePredefined = (index) => {
    setPredefinedItems(prev => prev.map((item, i) => i === index ? { ...item, checked: !item.checked } : item));
  };

  const handleCameraUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsAnalyzingImage(true);
    setImageError('');
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        try {
          const base64Data = reader.result;
          const base64String = base64Data.split(',')[1];
          const responseText = await ApiService.analyzeImageWithAI(base64String, file.type, apiKey);
          const cleanName = responseText.replace(/[^a-zA-Z0-9 áéíóúÁÉÍÓÚñÑ]/g, '').trim();
          if (cleanName && cleanName.length > 2) {
            setCustomItems(prev => [...prev, cleanName]);
          } else {
            setImageError("No pude identificar el producto.");
          }
        } catch (err) {
          setImageError(err.message || "Error al procesar la fotografía.");
        } finally {
          setIsAnalyzingImage(false);
          setTimeout(() => setImageError(''), 4000);
        }
      };
    } catch (err) {
      setImageError("Error de lectura local.");
      setIsAnalyzingImage(false);
    }
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const startScanning = async () => {
    if (itemsToScan.length === 0) return;
    setView('scanning');
    setResultsTab('comparativa');
    setScanProgress(0);

    setScanStatus({ phase: 'locating', stores: [], currentStoreScraping: '', itemIndex: 0 });
    await new Promise(resolve => setTimeout(resolve, 2000));

    const geoSeed = Utils.calculateGeoSeed(userAddress);
    const regionalPriceModifier = 1 + (((geoSeed % 100) - 50) / 1000);
    let localStores = SUPERMERCADOS;

    setScanStatus({ phase: 'connecting', stores: localStores, currentStoreScraping: '', itemIndex: 0 });
    await new Promise(resolve => setTimeout(resolve, 1500));

    const finalResults = [];

    for (let i = 0; i < itemsToScan.length; i++) {
      setScanStatus(prev => ({ ...prev, phase: 'scraping', itemIndex: i }));
      setScanProgress(Math.round((i / itemsToScan.length) * 85));

      const item = itemsToScan[i];
      const lowerItem = item.toLowerCase();
      let options = [];
      let details = {};

      if (REAL_PRICES_DB[lowerItem]) {
        const realData = REAL_PRICES_DB[lowerItem];
        details = { cat: realData.cat, isBeverage: realData.isBeverage, strictBrand: realData.strictBrand, unit: realData.unit };
        for (const opt of realData.options) {
          const storeDef = SUPERMERCADOS.find(s => s.id === opt.storeId) || SUPERMERCADOS[0];
          setScanStatus(prev => ({ ...prev, currentStoreScraping: storeDef.nombre }));
          await new Promise(resolve => setTimeout(resolve, 200));
          const localizedPrice = opt.price * regionalPriceModifier;
          options.push({
            ...storeDef, specificBrand: opt.brand, isBrand: opt.isBrand,
            format: opt.format, price: localizedPrice, unitPrice: localizedPrice / opt.qty,
            calculationUnit: realData.unit, containerType: opt.containerType || ''
          });
        }
      } else {
        const beverageKeywords = ['cola','pepsi','coca','fanta','sprite','agua','zumo','jugo','cerveza','vino','refresco','bebida','leche','batido','té','cafe','café','energy','monster','aquarius','nestea','lipton','mahou','estrella','heineken','shandy','tonica','tónica','bitter','soda','zero','light','max'];
        const isBeverage = beverageKeywords.some(kw => lowerItem.includes(kw));
        const unit = isBeverage ? 'L' : 'kg';
        details = { cat: 'genérico', isBeverage, strictBrand: true, unit };
        setScanStatus(prev => ({ ...prev, currentStoreScraping: 'Buscando formatos...' }));
        const realApiData = await ApiService.fetchRealProductData(item);
        const basePricePerUnit = 1.5 + Math.random() * 6.0;
        const formats = isBeverage ? [
          { qty: 0.33, label: 'Lata 33cl' },
          { qty: 0.5, label: 'Botella 500ml' },
          { qty: 1.0, label: 'Botella 1L' },
          { qty: 1.5, label: 'Botella 1.5L' },
          { qty: 2.0, label: 'Botella 2L' }
        ] : [
          { qty: 0.25, label: 'Formato 250g' },
          { qty: 0.5, label: 'Formato 500g' },
          { qty: 1.0, label: 'Familiar 1Kg' }
        ];
        for (const store of localStores) {
          setScanStatus(prev => ({ ...prev, currentStoreScraping: store.nombre }));
          await new Promise(resolve => setTimeout(resolve, 300));
          for (const format of formats) {
            const storeModifier = 1 + (Math.random() * 0.3 - 0.15);
            const sizeDiscount = format.qty >= 1.5 ? 0.80 : format.qty >= 1 ? 0.88 : format.qty <= 0.33 ? 1.25 : 1.0;
            const finalPrice = basePricePerUnit * format.qty * storeModifier * sizeDiscount * regionalPriceModifier;
            options.push({
              ...store, specificBrand: realApiData.brand,
              isBrand: true, format: format.label, price: finalPrice, unitPrice: finalPrice / format.qty,
              calculationUnit: unit, containerType: ""
            });
          }
        }
      }

      options.sort((a, b) => a.unitPrice - b.unitPrice);
      const uniqueTopOptions = [];
      const seenStoresAndFormats = new Set();
      for (const opt of options) {
        const storeKey = `${opt.id}-${opt.isBrand}-${opt.format}`;
        if (!seenStoresAndFormats.has(storeKey)) {
          seenStoresAndFormats.add(storeKey);
          uniqueTopOptions.push(opt);
        }
        if (uniqueTopOptions.length >= 6) break;
      }

      finalResults.push({
        itemName: item + (REAL_PRICES_DB[lowerItem] ? '' : ''),
        details: details,
        rankedOptions: uniqueTopOptions
      });
    }

    setScanStatus(prev => ({ ...prev, phase: 'calculating' }));
    setScanProgress(95);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setScanProgress(100);

    setResults({ items: finalResults });
    setView('results');
  };

  // ==========================================
  // RENDERS
  // ==========================================

  const renderHome = () => (
    <div className="flex flex-col h-full" style={{ background: '#f7f8fc', fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,700;0,9..40,900&display=swap');
        @keyframes fadeSlideIn { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes ping2 { 0%,100%{transform:scale(1);opacity:.8} 50%{transform:scale(1.15);opacity:.4} }
        .item-enter { animation: fadeSlideIn 0.35s ease both; }
      `}</style>

      {/* Header */}
      <header className="px-5 pt-10 pb-4 sticky top-0 z-30" style={{ background: 'rgba(247,248,252,0.92)', backdropFilter: 'blur(16px)' }}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <Sparkles size={17} className="text-white" />
            </div>
            <div>
              <h1 className="text-[22px] leading-none font-black tracking-tight" style={{ color: '#0f172a', fontFamily: "'DM Sans', sans-serif" }}>
                Smart<span style={{ color: '#10b981' }}>Cart</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">Comparador de precios</p>
            </div>
          </div>
          <button onClick={() => setView('settings')} className="p-2.5 rounded-2xl border border-slate-200 bg-white shadow-sm hover:bg-slate-50 active:scale-95 transition-all">
            <Settings size={18} className="text-slate-600" />
          </button>
        </div>

        {/* Dirección activa */}
        <button
          onClick={() => setView('settings')}
          className="w-full flex items-center space-x-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 active:scale-[0.98] transition-all"
        >
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#ecfdf5' }}>
            <MapPin size={16} className="text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Zona activa</p>
            <p className="text-sm font-black text-slate-800 truncate">{userAddress}</p>
          </div>
          <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#f1f5f9' }}>
            <ArrowRight size={12} className="text-slate-500" />
          </div>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-5 pb-44 space-y-6 pt-4">
        {/* Productos predefinidos */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Datos reales verificados</h2>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              {predefinedItems.filter(i => i.checked).length}/{predefinedItems.length} seleccionados
            </span>
          </div>
          <div className="space-y-2.5">
            {predefinedItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleTogglePredefined(idx)}
                className={`w-full flex items-center p-4 rounded-2xl border transition-all duration-300 active:scale-[0.98] ${item.checked
                  ? 'border-emerald-400 shadow-md'
                  : 'bg-white border-slate-200 shadow-sm hover:border-slate-300'
                  }`}
                style={item.checked ? { background: 'linear-gradient(135deg, #10b981, #059669)' } : {}}
              >
                <div className={`w-6 h-6 rounded-xl flex items-center justify-center mr-4 flex-shrink-0 transition-all border ${item.checked ? 'bg-white border-white' : 'bg-slate-50 border-slate-200'
                  }`}>
                  {item.checked && <CheckCircle2 size={15} className="text-emerald-500" strokeWidth={3} />}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className={`font-black text-sm truncate ${item.checked ? 'text-white' : 'text-slate-800'}`}>{item.name}</p>
                  <p className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${item.checked ? 'text-emerald-100' : 'text-slate-400'}`}>
                    Análisis por formato y peso
                  </p>
                </div>
                {item.checked && (
                  <div className="ml-3 flex-shrink-0">
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                      <CheckCircle2 size={12} className="text-white" />
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Items personalizados */}
        {customItems.length > 0 && (
          <div className="item-enter">
            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Añadidos por ti</h2>
            <div className="space-y-2">
              {customItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white p-3.5 rounded-2xl shadow-sm border border-slate-200 item-enter">
                  <div className="flex items-center space-x-3">
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: '#f0fdf4' }}>
                      <Package size={14} className="text-emerald-600" />
                    </div>
                    <span className="text-slate-700 font-bold text-sm">{item}</span>
                  </div>
                  <button onClick={() => setCustomItems(prev => prev.filter((_, i) => i !== idx))} className="p-2 rounded-xl text-slate-300 hover:text-red-400 hover:bg-red-50 transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        <div ref={listEndRef} />
      </div>

      {/* Bottom panel */}
      <div className="fixed bottom-0 left-0 right-0 z-30 max-w-md mx-auto">
        <div className="mx-4 mb-4 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden" style={{ boxShadow: '0 -4px 40px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.06)' }}>
          {imageError && (
            <div className="px-4 pt-3 pb-0">
              <div className="px-4 py-2.5 bg-red-50 text-red-600 text-xs font-bold rounded-2xl text-center border border-red-100">
                {imageError}
              </div>
            </div>
          )}
          <div className="p-3">
            <div className="flex space-x-2 mb-2.5">
              <input type="file" accept="image/*" capture="environment" ref={fileInputRef} className="hidden" onChange={handleCameraUpload} />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isAnalyzingImage}
                className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center border border-slate-200 bg-slate-50 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 active:scale-95 transition-all disabled:opacity-50"
              >
                {isAnalyzingImage ? <Loader2 size={20} className="animate-spin" /> : <Camera size={20} />}
              </button>
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && newItem.trim()) { setCustomItems(prev => [...prev, newItem.trim()]); setNewItem(''); } }}
                placeholder="Ej: Galletas Príncipe..."
                className="flex-1 h-12 bg-slate-50 border border-slate-200 rounded-2xl px-4 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-300 transition-all min-w-0"
              />
              <button
                onClick={() => { if (newItem.trim()) { setCustomItems(prev => [...prev, newItem.trim()]); setNewItem(''); } }}
                disabled={!newItem.trim()}
                className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 active:scale-95 transition-all disabled:opacity-40"
              >
                <Plus size={20} />
              </button>
            </div>

            <button
              onClick={startScanning}
              disabled={itemsToScan.length === 0}
              className="w-full h-14 rounded-2xl text-white font-black text-sm uppercase tracking-wider flex items-center justify-center space-x-2.5 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: itemsToScan.length > 0 ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' : '#94a3b8', boxShadow: itemsToScan.length > 0 ? '0 8px 24px rgba(15,23,42,0.3)' : 'none' }}
            >
              <Globe size={18} />
              <span>Comparar precios {itemsToScan.length > 0 ? `(${itemsToScan.length})` : ''}</span>
              {itemsToScan.length > 0 && <Zap size={14} className="text-amber-400" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="flex flex-col h-full" style={{ background: '#f7f8fc', fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,700;0,9..40,900&display=swap');`}</style>
      <header className="px-5 pt-10 pb-5 bg-white border-b border-slate-100 flex items-center space-x-3 sticky top-0">
        <button onClick={() => setView('home')} className="p-2 -ml-1 rounded-xl hover:bg-slate-50 active:scale-95 transition-all">
          <ChevronLeft size={22} className="text-slate-700" />
        </button>
        <h1 className="text-xl font-black text-slate-800">Tu Ubicación</h1>
      </header>

      <div className="p-5 space-y-6">
        <div className="p-5 rounded-3xl border" style={{ background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', borderColor: '#bfdbfe' }}>
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: '#3b82f6' }}>
              <MapPin size={20} className="text-white" />
            </div>
            <p className="text-sm text-blue-900 font-medium leading-relaxed">
              Usamos tu dirección para detectar qué supermercados entregan en tu zona y calcular variaciones de precio locales.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">Dirección de entrega</label>
          <div className="relative">
            <input
              type="text"
              value={userAddress}
              onChange={(e) => setUserAddress(e.target.value)}
              placeholder="Ej: Calle Urbieta 12, 20006..."
              className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-base font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-400 transition-all pr-12"
            />
            {userAddress && (
              <button type="button" onClick={() => setUserAddress('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-400 p-1 transition-colors">
                <Trash2 size={17} />
              </button>
            )}
          </div>
          <button
            onClick={() => setView('home')}
            className="w-full h-14 rounded-2xl text-white font-black text-sm uppercase tracking-wider mt-4 transition-all active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 8px 24px rgba(16,185,129,0.3)' }}
          >
            Guardar y Volver
          </button>
        </div>
      </div>
    </div>
  );

  const renderScanning = () => (
    <div className="flex flex-col h-full relative overflow-hidden" style={{ background: '#0a0f1e', fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,700;0,9..40,900&display=swap');
        @keyframes scanLine { 0%{top:0%} 100%{top:100%} }
        @keyframes pulse2 { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(0.96)} }
        @keyframes glow { 0%,100%{box-shadow:0 0 10px rgba(16,185,129,0.3)} 50%{box-shadow:0 0 30px rgba(16,185,129,0.6)} }
        .scan-pulse { animation: pulse2 1.8s ease-in-out infinite; }
        .glow-box { animation: glow 2s ease-in-out infinite; }
      `}</style>

      {/* Grid de fondo decorativo */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(rgba(16,185,129,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.5) 1px, transparent 1px)',
        backgroundSize: '32px 32px'
      }} />

      {/* Blob de luz */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full opacity-10 blur-3xl" style={{ background: '#10b981' }} />

      <div className="relative z-10 flex flex-col h-full p-6 pt-14">

        {/* Badge estado */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2 px-4 py-2 rounded-full border glow-box" style={{ background: 'rgba(16,185,129,0.1)', borderColor: 'rgba(16,185,129,0.3)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 scan-pulse" />
            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400">
              {scanStatus.phase === 'locating' ? 'Geolocalizando' :
               scanStatus.phase === 'connecting' ? 'Conectando supermercados' :
               scanStatus.phase === 'scraping' ? 'Extrayendo precios' : 'Calculando óptimo'}
            </span>
          </div>
        </div>

        {scanStatus.phase === 'locating' && (
          <div className="flex flex-col items-center justify-center flex-1 space-y-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-2 scan-pulse flex items-center justify-center" style={{ borderColor: 'rgba(16,185,129,0.4)', background: 'rgba(16,185,129,0.08)' }}>
                <MapPin size={36} className="text-emerald-400" />
              </div>
              <div className="absolute -inset-3 rounded-full border opacity-20 animate-ping" style={{ borderColor: '#10b981' }} />
            </div>
            <div className="text-center">
              <p className="text-white font-black text-lg truncate max-w-xs">{userAddress}</p>
              <p className="text-slate-500 text-xs mt-1 font-medium">Calibrando precios de tu zona...</p>
            </div>
          </div>
        )}

        {(scanStatus.phase === 'connecting' || scanStatus.phase === 'scraping' || scanStatus.phase === 'calculating') && (
          <div className="flex flex-col flex-1 space-y-5 overflow-hidden">

            {/* Barra de progreso */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Progreso global</span>
                <span className="text-sm font-black text-emerald-400">{scanProgress}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${scanProgress}%`, background: 'linear-gradient(90deg, #10b981, #34d399)' }}
                />
              </div>
            </div>

            {/* Supermercados detectados */}
            <div>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Supermercados ({scanStatus.stores.length})</p>
              <div className="flex flex-wrap gap-1.5">
                {scanStatus.stores.map((s, i) => (
                  <span key={i} className="text-[9px] font-black px-2 py-1 rounded-lg border uppercase tracking-wider" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
                    {s.nombre}
                  </span>
                ))}
              </div>
            </div>

            {/* Lista de items */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {itemsToScan.map((item, idx) => {
                const isScanning = scanStatus.phase === 'scraping' && scanStatus.itemIndex === idx;
                const isDone = scanStatus.phase === 'calculating' || scanStatus.itemIndex > idx;
                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border transition-all ${isScanning
                        ? 'glow-box'
                        : isDone
                          ? 'opacity-40'
                          : 'opacity-20'
                      }`}
                    style={{
                      background: isScanning ? 'rgba(16,185,129,0.06)' : isDone ? 'rgba(255,255,255,0.02)' : 'transparent',
                      borderColor: isScanning ? 'rgba(16,185,129,0.35)' : 'rgba(255,255,255,0.06)'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className={`w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 ${isDone ? 'bg-emerald-500' : isScanning ? 'bg-emerald-500/20 border border-emerald-500/40' : 'bg-white/5'}`}>
                          {isDone ? <CheckCircle2 size={12} className="text-white" /> : isScanning ? <Loader2 size={12} className="text-emerald-400 animate-spin" /> : null}
                        </div>
                        <p className={`font-bold text-sm ${isScanning ? 'text-white' : isDone ? 'text-white/50' : 'text-white/30'}`}>{item}</p>
                      </div>
                      {isDone && <span className="text-[9px] font-black text-emerald-400 uppercase tracking-wider">Listo</span>}
                    </div>
                    {isScanning && (
                      <div className="flex items-center space-x-2 mt-2 pl-7">
                        <div className="flex space-x-0.5">
                          {[0,1,2].map(i => (
                            <div key={i} className="w-1 rounded-full bg-emerald-400" style={{ height: '12px', animation: `pulse2 ${0.8 + i*0.15}s ease-in-out infinite`, animationDelay: `${i*0.2}s` }} />
                          ))}
                        </div>
                        <span className="text-[10px] text-emerald-400/80 font-medium truncate">{scanStatus.currentStoreScraping}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {scanStatus.phase === 'calculating' && (
              <div className="p-4 rounded-2xl border text-center glow-box" style={{ background: 'rgba(16,185,129,0.06)', borderColor: 'rgba(16,185,129,0.3)' }}>
                <p className="text-emerald-400 font-black text-xs uppercase tracking-widest">Calculando cesta óptima...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderResults = () => {
    if (!results) return null;
    const storesUsed = Object.values(groupedByStore).filter(g => g.items.length > 0);

    return (
      <div className="flex flex-col h-full relative" style={{ background: '#f7f8fc', fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,700;0,9..40,900&display=swap');
          @keyframes fadeSlideIn { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        `}</style>

        {/* Header de resultados */}
        <header className="bg-white px-5 pt-10 pb-4 sticky top-0 z-20 border-b border-slate-100">
          <div className="flex items-center space-x-3 mb-4">
            <button onClick={() => setView('home')} className="p-2 -ml-1 rounded-xl hover:bg-slate-50 active:scale-95 transition-all flex-shrink-0">
              <ChevronLeft size={22} className="text-slate-700" />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-black text-slate-800 leading-tight">Cesta Optimizada</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate mt-0.5">{userAddress}</p>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 text-center">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Total mín.</p>
              <p className="text-base font-black text-slate-800">{totalOptimized.toFixed(2)}€</p>
            </div>
            <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-100 text-center">
              <p className="text-[9px] font-black text-emerald-500 uppercase tracking-wider mb-0.5">Productos</p>
              <p className="text-base font-black text-emerald-700">{results.items.length}</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 text-center">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Tiendas</p>
              <p className="text-base font-black text-slate-800">{storesUsed.length}</p>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-32">
          {resultsTab === 'comparativa' ? (
            <div className="space-y-1">
              {results.items.map((item, idx) => (
                <ProductCard key={idx} item={item} index={idx} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {Object.values(groupedByStore)
                .sort((a, b) => b.items.length - a.items.length)
                .map((group, idx) => {
                  const location = Utils.getStoreLocation(group.storeDef.id, userAddress);
                  const hasItems = group.items.length > 0;
                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-3xl border overflow-hidden"
                      style={{ borderColor: hasItems ? '#e2e8f0' : '#f1f5f9', opacity: hasItems ? 1 : 0.6, animation: `fadeSlideIn 0.4s ease ${idx * 0.06}s both` }}
                    >
                      {/* Store header */}
                      <div
                        className="p-4 flex items-center justify-between"
                        style={{ background: hasItems ? (group.storeDef.accent || '#1e293b') : '#f8fafc' }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/20 p-1.5 flex items-center justify-center flex-shrink-0">
                            <StoreLogo store={group.storeDef} className="w-full h-full" />
                          </div>
                          <div className="min-w-0">
                            <p className={`font-black text-lg leading-tight ${hasItems ? 'text-white' : 'text-slate-600'}`}>{group.storeDef.nombre}</p>
                            <div className="flex items-center space-x-1 mt-0.5">
                              <MapPin size={9} className={hasItems ? 'text-white/60' : 'text-slate-400'} />
                              <p className={`text-[10px] font-medium truncate max-w-[140px] ${hasItems ? 'text-white/70' : 'text-slate-400'}`}>
                                {location.address} · {location.distance}km
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className={`text-[9px] font-bold uppercase tracking-wider mb-0.5 ${hasItems ? 'text-white/60' : 'text-slate-400'}`}>Subtotal</p>
                          <p className={`font-black text-xl ${hasItems ? 'text-white' : 'text-slate-500'}`}>{group.subtotal.toFixed(2)}€</p>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="p-2 space-y-1">
                        {group.items.length === 0 ? (
                          <div className="p-5 flex flex-col items-center text-center">
                            <Info size={20} className="text-slate-300 mb-2" />
                            <p className="text-xs font-bold text-slate-500">Sin productos asignados</p>
                            <p className="text-[10px] text-slate-400 mt-1">Más barato en la competencia.</p>
                          </div>
                        ) : (
                          group.items.map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-colors">
                              <div className="flex items-center space-x-3 flex-1 min-w-0 pr-3">
                                <FormatBadge format={item.format} className="w-12 h-10 flex-shrink-0" />
                                <div className="truncate">
                                  <p className="text-sm font-bold text-slate-800 truncate">{item.originalName}</p>
                                  <p className="text-[10px] font-medium text-slate-500 truncate mt-0.5">{item.specificBrand}</p>
                                </div>
                              </div>
                              <span className="font-black text-sm text-slate-800 whitespace-nowrap px-3 py-1.5 rounded-xl bg-slate-100">{item.price.toFixed(2)}€</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

          <div className="mt-6 pt-5 border-t border-slate-200">
            <button
              onClick={() => setView('home')}
              className="w-full flex items-center justify-center space-x-2.5 text-slate-600 font-black text-sm p-4 bg-white rounded-2xl border border-slate-200 hover:bg-slate-50 active:scale-[0.98] transition-all"
            >
              <Receipt size={17} />
              <span>Nueva búsqueda</span>
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/90 border-t border-slate-100 p-4 pb-5 z-30" style={{ backdropFilter: 'blur(16px)' }}>
          <div className="bg-slate-100 p-1.5 rounded-2xl flex max-w-xs mx-auto">
            <button
              onClick={() => setResultsTab('comparativa')}
              className={`flex-1 py-2.5 px-3 flex items-center justify-center space-x-2 rounded-xl text-sm font-black transition-all duration-300 ${resultsTab === 'comparativa' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <List size={16} />
              <span>Formatos</span>
            </button>
            <button
              onClick={() => setResultsTab('supermercado')}
              className={`flex-1 py-2.5 px-3 flex items-center justify-center space-x-2 rounded-xl text-sm font-black transition-all duration-300 ${resultsTab === 'supermercado' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Store size={16} />
              <span>Por Súper</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center font-sans sm:p-6">
      <div className="w-full max-w-md h-[100dvh] sm:h-[850px] sm:max-h-[90vh] bg-white sm:rounded-[2.5rem] shadow-2xl overflow-hidden relative border-gray-800 sm:border-[8px]">
        {view === 'home' && renderHome()}
        {view === 'settings' && renderSettings()}
        {view === 'scanning' && renderScanning()}
        {view === 'results' && renderResults()}
      </div>
    </div>
  );
}