import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
import {
  MapPin, Plus, Trash2, ChevronLeft, Settings,
  Store, CheckCircle2, Receipt, Info,
  Loader2, Globe, Sparkles, Target, List, Camera,
  Scale, Package, ArrowRight, Zap, Star, Clock,
  ShoppingBasket, TrendingDown, Bell, Heart, X
} from 'lucide-react';

// ==========================================
// 1. CONSTANTES Y BASE DE DATOS AMPLIADA
// ==========================================

const SUPERMERCADOS = [
  { id: 'mercadona', nombre: 'Mercadona', color: 'bg-green-100 text-green-800', border: 'border-green-300', headerBg: 'bg-[#008e59]', headerText: 'text-white', accent: '#008e59' },
  { id: 'carrefour', nombre: 'Carrefour', color: 'bg-blue-100 text-blue-800', border: 'border-blue-300', headerBg: 'bg-[#00387b]', headerText: 'text-white', accent: '#00387b' },
  { id: 'lidl', nombre: 'Lidl', color: 'bg-yellow-100 text-yellow-800', border: 'border-yellow-400', headerBg: 'bg-[#0050aa]', headerText: 'text-white', accent: '#0050aa' },
  { id: 'dia', nombre: 'Dia', color: 'bg-red-100 text-red-800', border: 'border-red-300', headerBg: 'bg-[#d50000]', headerText: 'text-white', accent: '#d50000' },
  { id: 'aldi', nombre: 'Aldi', color: 'bg-cyan-100 text-cyan-800', border: 'border-cyan-300', headerBg: 'bg-[#00008a]', headerText: 'text-white', accent: '#00008a' },
  { id: 'bm', nombre: 'BM', color: 'bg-orange-100 text-orange-800', border: 'border-orange-300', headerBg: 'bg-[#ff6b00]', headerText: 'text-white', accent: '#ff6b00' },
  { id: 'eroski', nombre: 'Eroski', color: 'bg-indigo-100 text-indigo-800', border: 'border-indigo-300', headerBg: 'bg-[#004b87]', headerText: 'text-white', accent: '#004b87' },
  { id: 'alcampo', nombre: 'Alcampo', color: 'bg-rose-100 text-rose-800', border: 'border-rose-300', headerBg: 'bg-[#e3001b]', headerText: 'text-white', accent: '#e3001b' }
];

const REAL_PRICES_DB = {
  'leche entera': { cat: 'leche', isBeverage: true, strictBrand: null, unit: 'L', options: [
    { storeId: 'aldi', brand: 'Milsani (M. Blanca)', isBrand: false, price: 0.88, qty: 1, format: 'Brik 1L' },
    { storeId: 'lidl', brand: 'Milbona (M. Blanca)', isBrand: false, price: 0.89, qty: 1, format: 'Brik 1L' },
    { storeId: 'carrefour', brand: 'Carrefour Clasic', isBrand: false, price: 0.90, qty: 1, format: 'Brik 1L' },
    { storeId: 'mercadona', brand: 'Hacendado (M. Blanca)', isBrand: false, price: 0.91, qty: 1, format: 'Brik 1L' },
    { storeId: 'dia', brand: 'Dia Láctea', isBrand: false, price: 5.40, qty: 6, format: 'Pack 6x1L' },
    { storeId: 'alcampo', brand: 'Auchan (M. Blanca)', isBrand: false, price: 1.35, qty: 1.5, format: 'Botella 1.5L' },
    { storeId: 'carrefour', brand: 'Pascual (1ª Marca)', isBrand: true, price: 1.34, qty: 1, format: 'Brik 1L' },
    { storeId: 'bm', brand: 'Pascual (1ª Marca)', isBrand: true, price: 7.95, qty: 6, format: 'Pack 6x1L' }
  ]},
  'cola cao': { cat: 'cacao', isBeverage: false, strictBrand: 'Cola Cao', unit: 'kg', options: [
    { storeId: 'alcampo', brand: 'Cola Cao Original', isBrand: true, price: 3.45, qty: 0.38, format: 'Bote 380g' },
    { storeId: 'mercadona', brand: 'Cola Cao Original', isBrand: true, price: 5.95, qty: 0.76, format: 'Bote 760g' },
    { storeId: 'dia', brand: 'Cola Cao Original', isBrand: true, price: 5.99, qty: 0.76, format: 'Bote 760g' },
    { storeId: 'carrefour', brand: 'Cola Cao Original', isBrand: true, price: 8.99, qty: 1.2, format: 'Bolsa 1.2Kg' },
    { storeId: 'eroski', brand: 'Cola Cao Original', isBrand: true, price: 14.50, qty: 2.5, format: 'Familiar 2.5Kg' },
    { storeId: 'bm', brand: 'Cola Cao Original', isBrand: true, price: 6.25, qty: 0.76, format: 'Bote 760g' }
  ]},
  'pepsi max lima': { cat: 'pepsi', isBeverage: true, strictBrand: 'Pepsi Max Lima', unit: 'L', options: [
    { storeId: 'mercadona', brand: 'Pepsi Max Lima', isBrand: true, price: 0.75, qty: 0.33, format: 'Lata 33cl' },
    { storeId: 'carrefour', brand: 'Pepsi Max Lima', isBrand: true, price: 0.72, qty: 0.33, format: 'Lata 33cl' },
    { storeId: 'dia', brand: 'Pepsi Max Lima', isBrand: true, price: 1.10, qty: 0.5, format: 'Botella 500ml' },
    { storeId: 'alcampo', brand: 'Pepsi Max Lima', isBrand: true, price: 1.89, qty: 2.0, format: 'Botella 2L' },
    { storeId: 'aldi', brand: 'Pepsi Max Lima', isBrand: true, price: 1.95, qty: 2.0, format: 'Botella 2L' },
    { storeId: 'eroski', brand: 'Pepsi Max Lima', isBrand: true, price: 3.80, qty: 4.0, format: 'Pack 2x2L' }
  ]},
  'huevos docena': { cat: 'huevo', isBeverage: false, strictBrand: null, unit: 'ud', options: [
    { storeId: 'aldi', brand: 'El Mercado (M. Blanca)', isBrand: false, price: 1.35, qty: 6, format: 'Media M' },
    { storeId: 'alcampo', brand: 'Auchan (M. Blanca)', isBrand: false, price: 2.19, qty: 12, format: 'Docena L' },
    { storeId: 'lidl', brand: 'Milbona (M. Blanca)', isBrand: false, price: 2.25, qty: 12, format: 'Docena L' },
    { storeId: 'mercadona', brand: 'Hacendado (M. Blanca)', isBrand: false, price: 2.35, qty: 12, format: 'Docena L' },
    { storeId: 'carrefour', brand: 'Carrefour (M. Blanca)', isBrand: false, price: 4.50, qty: 24, format: 'Cartón 24ud' },
    { storeId: 'mercadona', brand: 'Granjas S. Miguel', isBrand: true, price: 3.20, qty: 12, format: 'Camperos 12ud' }
  ]},
  'aceite oliva': { cat: 'aceite', isBeverage: false, strictBrand: null, unit: 'L', options: [
    { storeId: 'mercadona', brand: 'Hacendado', isBrand: false, price: 3.99, qty: 0.75, format: 'Botella 750ml' },
    { storeId: 'lidl', brand: 'Belivos', isBrand: false, price: 3.79, qty: 0.75, format: 'Botella 750ml' },
    { storeId: 'carrefour', brand: 'Carrefour', isBrand: false, price: 7.49, qty: 1.5, format: 'Botella 1.5L' },
    { storeId: 'dia', brand: 'Dia', isBrand: false, price: 3.85, qty: 0.75, format: 'Botella 750ml' },
    { storeId: 'alcampo', brand: 'Auchan', isBrand: false, price: 7.20, qty: 1.5, format: 'Botella 1.5L' },
    { storeId: 'aldi', brand: 'Primadonna', isBrand: false, price: 3.69, qty: 0.75, format: 'Botella 750ml' }
  ]},
  'pan de molde': { cat: 'pan', isBeverage: false, strictBrand: null, unit: 'kg', options: [
    { storeId: 'mercadona', brand: 'Hacendado', isBrand: false, price: 1.05, qty: 0.45, format: 'Bolsa 450g' },
    { storeId: 'lidl', brand: 'Lieken Urkorn', isBrand: false, price: 1.25, qty: 0.5, format: 'Bolsa 500g' },
    { storeId: 'dia', brand: 'Dia', isBrand: false, price: 0.99, qty: 0.45, format: 'Bolsa 450g' },
    { storeId: 'carrefour', brand: 'Bimbo', isBrand: true, price: 1.75, qty: 0.68, format: 'Grande 680g' },
    { storeId: 'alcampo', brand: 'Auchan', isBrand: false, price: 1.10, qty: 0.5, format: 'Bolsa 500g' },
    { storeId: 'aldi', brand: 'El Molino', isBrand: false, price: 0.95, qty: 0.45, format: 'Bolsa 450g' }
  ]},
  'arroz': { cat: 'arroz', isBeverage: false, strictBrand: null, unit: 'kg', options: [
    { storeId: 'mercadona', brand: 'Hacendado', isBrand: false, price: 0.99, qty: 1, format: 'Bolsa 1Kg' },
    { storeId: 'lidl', brand: 'Combino', isBrand: false, price: 0.89, qty: 1, format: 'Bolsa 1Kg' },
    { storeId: 'dia', brand: 'Dia', isBrand: false, price: 0.95, qty: 1, format: 'Bolsa 1Kg' },
    { storeId: 'carrefour', brand: 'Carrefour', isBrand: false, price: 1.85, qty: 2, format: 'Bolsa 2Kg' },
    { storeId: 'alcampo', brand: 'Auchan', isBrand: false, price: 0.92, qty: 1, format: 'Bolsa 1Kg' },
    { storeId: 'aldi', brand: 'Grandessa', isBrand: false, price: 0.85, qty: 1, format: 'Bolsa 1Kg' }
  ]},
  'pasta macarrones': { cat: 'pasta', isBeverage: false, strictBrand: null, unit: 'kg', options: [
    { storeId: 'mercadona', brand: 'Hacendado', isBrand: false, price: 0.75, qty: 0.5, format: 'Bolsa 500g' },
    { storeId: 'lidl', brand: 'Combino', isBrand: false, price: 0.69, qty: 0.5, format: 'Bolsa 500g' },
    { storeId: 'dia', brand: 'Dia', isBrand: false, price: 0.72, qty: 0.5, format: 'Bolsa 500g' },
    { storeId: 'carrefour', brand: 'Gallo', isBrand: true, price: 1.29, qty: 0.5, format: 'Bolsa 500g' },
    { storeId: 'alcampo', brand: 'Auchan', isBrand: false, price: 0.70, qty: 0.5, format: 'Bolsa 500g' },
    { storeId: 'aldi', brand: 'Combino', isBrand: false, price: 0.65, qty: 0.5, format: 'Bolsa 500g' }
  ]},
  'yogur natural': { cat: 'yogur', isBeverage: false, strictBrand: null, unit: 'kg', options: [
    { storeId: 'mercadona', brand: 'Hacendado', isBrand: false, price: 0.79, qty: 0.5, format: 'Pack 4x125g' },
    { storeId: 'lidl', brand: 'Milbona', isBrand: false, price: 0.69, qty: 0.5, format: 'Pack 4x125g' },
    { storeId: 'dia', brand: 'Dia', isBrand: false, price: 0.75, qty: 0.5, format: 'Pack 4x125g' },
    { storeId: 'carrefour', brand: 'Danone', isBrand: true, price: 1.49, qty: 0.5, format: 'Pack 4x125g' },
    { storeId: 'alcampo', brand: 'Auchan', isBrand: false, price: 0.72, qty: 0.5, format: 'Pack 4x125g' },
    { storeId: 'aldi', brand: 'Milsani', isBrand: false, price: 0.65, qty: 0.5, format: 'Pack 4x125g' }
  ]},
  'mantequilla': { cat: 'mantequilla', isBeverage: false, strictBrand: null, unit: 'kg', options: [
    { storeId: 'mercadona', brand: 'Hacendado', isBrand: false, price: 1.45, qty: 0.25, format: 'Tarrina 250g' },
    { storeId: 'lidl', brand: 'Milbona', isBrand: false, price: 1.35, qty: 0.25, format: 'Tarrina 250g' },
    { storeId: 'dia', brand: 'Dia', isBrand: false, price: 1.40, qty: 0.25, format: 'Tarrina 250g' },
    { storeId: 'carrefour', brand: 'Président', isBrand: true, price: 2.99, qty: 0.25, format: 'Tarrina 250g' },
    { storeId: 'alcampo', brand: 'Auchan', isBrand: false, price: 1.39, qty: 0.25, format: 'Tarrina 250g' },
    { storeId: 'aldi', brand: 'Milsani', isBrand: false, price: 1.29, qty: 0.25, format: 'Tarrina 250g' }
  ]},
  'tomate frito': { cat: 'tomate', isBeverage: false, strictBrand: null, unit: 'kg', options: [
    { storeId: 'mercadona', brand: 'Hacendado', isBrand: false, price: 0.85, qty: 0.4, format: 'Bote 400g' },
    { storeId: 'lidl', brand: 'Combino', isBrand: false, price: 0.79, qty: 0.4, format: 'Bote 400g' },
    { storeId: 'dia', brand: 'Dia', isBrand: false, price: 0.82, qty: 0.4, format: 'Bote 400g' },
    { storeId: 'carrefour', brand: 'Orlando', isBrand: true, price: 1.29, qty: 0.4, format: 'Bote 400g' },
    { storeId: 'alcampo', brand: 'Auchan', isBrand: false, price: 0.80, qty: 0.4, format: 'Bote 400g' },
    { storeId: 'aldi', brand: 'Grandessa', isBrand: false, price: 0.75, qty: 0.4, format: 'Bote 400g' }
  ]},
  'pollo entero': { cat: 'carne', isBeverage: false, strictBrand: null, unit: 'kg', options: [
    { storeId: 'mercadona', brand: 'Campofrío', isBrand: true, price: 4.50, qty: 1.5, format: 'Pollo 1.5Kg' },
    { storeId: 'lidl', brand: 'Lidl Fresh', isBrand: false, price: 3.99, qty: 1.5, format: 'Pollo 1.5Kg' },
    { storeId: 'dia', brand: 'Dia Fresh', isBrand: false, price: 4.20, qty: 1.5, format: 'Pollo 1.5Kg' },
    { storeId: 'carrefour', brand: 'Carrefour Fresh', isBrand: false, price: 4.80, qty: 1.8, format: 'Pollo 1.8Kg' },
    { storeId: 'alcampo', brand: 'Auchan Fresh', isBrand: false, price: 4.10, qty: 1.5, format: 'Pollo 1.5Kg' },
    { storeId: 'aldi', brand: 'Aldi Fresh', isBrand: false, price: 3.89, qty: 1.5, format: 'Pollo 1.5Kg' }
  ]},
  'detergente ropa': { cat: 'limpieza', isBeverage: false, strictBrand: null, unit: 'kg', options: [
    { storeId: 'mercadona', brand: 'Bosque Verde', isBrand: false, price: 3.99, qty: 2.7, format: 'Caja 27 dosis' },
    { storeId: 'lidl', brand: 'W5', isBrand: false, price: 3.49, qty: 2.4, format: 'Caja 24 dosis' },
    { storeId: 'dia', brand: 'Dia', isBrand: false, price: 3.75, qty: 2.5, format: 'Caja 25 dosis' },
    { storeId: 'carrefour', brand: 'Ariel', isBrand: true, price: 9.99, qty: 3.6, format: 'Caja 36 dosis' },
    { storeId: 'alcampo', brand: 'Auchan', isBrand: false, price: 3.89, qty: 2.7, format: 'Caja 27 dosis' },
    { storeId: 'aldi', brand: 'Tandil', isBrand: false, price: 3.29, qty: 2.4, format: 'Caja 24 dosis' }
  ]}
};

// ==========================================
// 2. STORAGE ROBUSTO
// ==========================================
const Storage = {
  get: (key, fallback = null) => {
    try {
      const v = localStorage.getItem(key) ?? sessionStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch { return fallback; }
  },
  set: (key, value) => {
    try {
      const s = JSON.stringify(value);
      localStorage.setItem(key, s);
      sessionStorage.setItem(key, s);
    } catch {}
  }
};

// ==========================================
// 3. SERVICIOS EXTERNOS
// ==========================================
const ApiService = {
  fetchRealProductData: async (query) => {
    let result = { brand: null };
    try {
      const res = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=3`);
      const data = await res.json();
      if (data.products?.[0]?.brands) result.brand = data.products[0].brands.split(',')[0].trim();
    } catch {}
    if (!result.brand) result.brand = "1ª Marca";
    return result;
  },
  analyzeImageWithAI: async (base64String, mimeType, apiKey) => {
    if (!apiKey) throw new Error("API Key requerida");
    const payload = {
      contents: [{
        role: "user",
        parts: [
          { text: "Identifica el producto de supermercado en esta imagen. Devuelve SOLO el nombre del producto y la marca en 1 a 4 palabras." },
          { inlineData: { mimeType, data: base64String } }
        ]
      }]
    };
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
    );
    const data = await res.json();
    console.log("Gemini response:", JSON.stringify(data));
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) return text;
    throw new Error(data.error?.message || "Sin respuesta de Gemini");
  }
}; 

// ==========================================
// 4. UTILIDADES
// ==========================================
const Utils = {
  getStoreLocation: (storeId, cp) => {
    const addrLower = cp.toLowerCase();
    const isDonosti = addrLower.includes('donosti') || addrLower.includes('sebastián') || addrLower.includes('200') || addrLower.includes('urbieta');
    let exactAddress = "";
    if (isDonosti) {
      const ds = { mercadona: ['Av. de Tolosa, 116', 'Polígono Belartza'], carrefour: ['C.C. Garbera', 'Av. de la Libertad, 23'], lidl: ['Paseo de Otxoki, 48', 'Errekalde Hiritarra'], dia: ['Calle Easo, 15', 'Calle Matia, 32'], aldi: ['Paseo de Otxoki, 52', 'Fernando Mugica, 2'], bm: ['Calle San Martín, 45', 'Secundino Esnaola, 14'], eroski: ['C.C. Arcco (Amara)', 'Calle Urbieta, 60'], alcampo: ['C.C. Txingudi (Oiartzun)', 'Pol. Mamut'] };
      let hash = 0; for (let i = 0; i < cp.length; i++) { hash = cp.charCodeAt(i) + ((hash << 5) - hash); }
      exactAddress = (ds[storeId] || ['Calle Mayor, 1'])[Math.abs(hash) % 2];
    } else {
      const streets = ['C/ Mayor', 'Av. Constitución', 'C/ Goya', 'Av. Libertad', 'Ronda Sur', 'C/ Alcalá', 'Pso. Independencia', 'C/ San Juan'];
      let hash = 0; const str = storeId + cp; for (let i = 0; i < str.length; i++) { hash = str.charCodeAt(i) + ((hash << 5) - hash); }
      exactAddress = `${streets[Math.abs(hash) % streets.length]}, ${(Math.abs(hash) % 120) + 1}`;
    }
    let hashDist = 0; const strDist = storeId + cp; for (let i = 0; i < strDist.length; i++) { hashDist = strDist.charCodeAt(i) + ((hashDist << 5) - hashDist); }
    return { address: exactAddress, distance: (((Math.abs(hashDist) % 28) + 2) / 10).toFixed(1) };
  },
  calculateGeoSeed: (cp) => { let h = 0; for (let i = 0; i < cp.length; i++) { h = cp.charCodeAt(i) + ((h << 5) - h); } return Math.abs(h); },
  splitFormat: (f) => { const p = f.split(' '); return p.length > 1 ? { type: p[0], amount: p.slice(1).join(' ') } : { type: 'Formato', amount: f }; },
  isBeverageItem: (name) => {
    const kw = ['cola','pepsi','coca','fanta','sprite','agua','zumo','jugo','cerveza','vino','refresco','bebida','leche','batido','té','cafe','café','energy','monster','aquarius','nestea','lipton','mahou','estrella','heineken','shandy','tonica','tónica','soda','zero','light','max','aceite'];
    return kw.some(k => name.toLowerCase().includes(k));
  }
};

// ==========================================
// 5. COMPONENTES VISUALES
// ==========================================
const StoreLogo = memo(({ store, className = "" }) => {
  const logos = {
    mercadona: <svg viewBox="0 0 100 100" className={className}><rect width="100" height="100" rx="20" fill="#008e59"/><text x="50" y="65" fill="white" fontSize="50" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">M</text></svg>,
    carrefour: <svg viewBox="0 0 100 100" className={className}><rect width="100" height="100" rx="20" fill="white"/><path d="M50,15 L85,50 L50,85 Z" fill="#e3001b"/><path d="M50,15 L15,50 L50,85 Z" fill="#00387b"/><text x="50" y="68" fill="white" fontSize="60" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">C</text></svg>,
    lidl: <svg viewBox="0 0 100 100" className={className}><rect width="100" height="100" rx="20" fill="#0050aa"/><circle cx="50" cy="50" r="35" fill="#fff000" stroke="#e3001b" strokeWidth="6"/><text x="50" y="65" fill="#0050aa" fontSize="40" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">L</text></svg>,
    dia: <svg viewBox="0 0 100 100" className={className}><rect width="100" height="100" rx="20" fill="#d50000"/><text x="50" y="62" fill="white" fontSize="40" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">DIA</text></svg>,
    aldi: <svg viewBox="0 0 100 100" className={className}><rect width="100" height="100" rx="20" fill="#00008a"/><text x="50" y="68" fill="#00a0e4" fontSize="55" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">A</text></svg>,
    bm: <svg viewBox="0 0 100 100" className={className}><rect width="100" height="100" rx="20" fill="#ff6b00"/><text x="50" y="62" fill="white" fontSize="40" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">BM</text></svg>,
    eroski: <svg viewBox="0 0 100 100" className={className}><rect width="100" height="100" rx="20" fill="#004b87"/><text x="50" y="60" fill="white" fontSize="24" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">EROSKI</text></svg>,
    alcampo: <svg viewBox="0 0 100 100" className={className}><rect width="100" height="100" rx="20" fill="#e3001b"/><text x="50" y="68" fill="white" fontSize="55" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">A</text></svg>
  };
  return logos[store.id] || <div className={`flex items-center justify-center font-black text-white rounded-xl text-[10px] ${className}`} style={{ background: store.accent }}>{store.nombre.substring(0,2).toUpperCase()}</div>;
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

const RankPill = ({ rank }) => {
  const styles = ['bg-amber-400 text-amber-900','bg-slate-300 text-slate-700','bg-orange-200 text-orange-800'];
  return <span className={`text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${styles[rank]||'bg-slate-100 text-slate-500'}`}>{rank+1}</span>;
};

const ProductCard = memo(({ item, index, onAddToBasket }) => {
  const topOption = item.rankedOptions[0];
  const maxUnitPrice = Math.max(...item.rankedOptions.map(o => o.unitPrice));
  const minUnitPrice = topOption.unitPrice;
  const savings = maxUnitPrice - minUnitPrice;
  return (
    <div className="bg-white rounded-3xl overflow-hidden mb-3 border border-slate-100" style={{ animation: `fadeSlideIn 0.4s ease ${index*0.08}s both` }}>
      <div className="relative overflow-hidden" style={{ background: topOption.accent||'#1a1a2e' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage:'repeating-linear-gradient(45deg,rgba(255,255,255,.1) 0,rgba(255,255,255,.1) 1px,transparent 0,transparent 50%)', backgroundSize:'8px 8px' }}/>
        <div className="relative p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 pr-3">
              <h3 className="font-black text-white text-lg leading-tight capitalize">{item.itemName}</h3>
              <p className="text-white/70 text-xs font-medium mt-0.5 truncate">{topOption.specificBrand}</p>
            </div>
            <div className="flex flex-col items-end flex-shrink-0 space-y-1">
              <div className="bg-white/15 rounded-2xl px-3 py-2 border border-white/20 text-right">
                <div className="flex items-center space-x-1.5">
                  <StoreLogo store={topOption} className="w-4 h-4 rounded-sm"/>
                  <span className="text-white font-black text-sm">{topOption.price.toFixed(2)}€</span>
                </div>
                <p className="text-white/60 text-[9px] font-bold mt-0.5">{topOption.unitPrice.toFixed(2)}€/{topOption.calculationUnit}</p>
              </div>
              {savings > 0.01 && (
                <div className="bg-amber-400/90 rounded-xl px-2 py-1">
                  <p className="text-amber-900 text-[9px] font-black">Ahorro {savings.toFixed(2)}€/{item.details.unit}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="space-y-2 mb-3">
          {item.rankedOptions.map((opt, idx) => {
            const barWidth = Math.max(15, (1-(opt.unitPrice-minUnitPrice)/(maxUnitPrice-minUnitPrice+0.001))*100);
            const isBest = idx === 0;
            return (
              <div key={idx} className={`rounded-2xl p-3 border ${isBest?'border-emerald-200 bg-emerald-50/60':'border-slate-100 bg-slate-50/40'}`}>
                <div className="flex items-center space-x-3">
                  <RankPill rank={idx}/>
                  <FormatBadge format={opt.format} className="w-14 h-10 flex-shrink-0"/>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1.5 mb-0.5">
                      <StoreLogo store={opt} className="w-3.5 h-3.5 rounded-sm"/>
                      <span className="text-xs font-black text-slate-700 truncate">{opt.nombre}</span>
                    </div>
                    <div className="mt-1 h-1 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width:`${barWidth}%`, background: isBest?'#10b981':'#94a3b8' }}/>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`text-sm font-black block leading-none ${isBest?'text-emerald-700':'text-slate-700'}`}>{opt.price.toFixed(2)}€</span>
                    <span className="text-[9px] font-bold text-slate-400 block mt-0.5">{opt.unitPrice.toFixed(2)}€/{opt.calculationUnit}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <button onClick={() => onAddToBasket(item.itemName, item.rankedOptions[0])}
          className="w-full py-2.5 text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center space-x-1.5 active:scale-[0.98] transition-all">
          <ShoppingBasket size={13}/><span>Añadir mejor opción a la cesta</span>
        </button>
      </div>
    </div>
  );
});

// ==========================================
// 6. APP PRINCIPAL
// ==========================================
export default function App() {
  const [view, setView] = useState('home');
  const [homeTab, setHomeTab] = useState('lista');
  const [userAddress, setUserAddress] = useState(() => Storage.get('smartcart_address','Calle Urbieta 12, 20006'));
  const [resultsTab, setResultsTab] = useState('comparativa');
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [imageError, setImageError] = useState('');
  const apiKey = "AIzaSyBO0KR9duDYFti1xJzHazohVVW_KVigveo";
  const fileInputRef = useRef(null);

  const [predefinedItems, setPredefinedItems] = useState([
    { name:'Leche entera',checked:false },{ name:'Cola Cao',checked:false },{ name:'Pepsi Max Lima',checked:false },
    { name:'Huevos docena',checked:false },{ name:'Aceite oliva',checked:false },{ name:'Pan de molde',checked:false },
    { name:'Arroz',checked:false },{ name:'Pasta macarrones',checked:false },{ name:'Yogur natural',checked:false },
    { name:'Mantequilla',checked:false },{ name:'Tomate frito',checked:false },{ name:'Pollo entero',checked:false },
    { name:'Detergente ropa',checked:false },
  ]);

  const [customItems, setCustomItems] = useState(() => Storage.get('smartcart_items',[]));
  const [newItem, setNewItem] = useState('');
  const [favorites, setFavorites] = useState(() => Storage.get('smartcart_favorites',[]));
  const [history, setHistory] = useState(() => Storage.get('smartcart_history',[]));
  const [basket, setBasket] = useState(() => Storage.get('smartcart_basket',[]));
  const [priceAlerts, setPriceAlerts] = useState(() => Storage.get('smartcart_alerts',{}));
  const [alertNotifications, setAlertNotifications] = useState([]);
  const [results, setResults] = useState(null);
  const [scanStatus, setScanStatus] = useState({ phase:'idle', stores:[], currentStoreScraping:'', itemIndex:0 });
  const [scanProgress, setScanProgress] = useState(0);
  const listEndRef = useRef(null);

  useEffect(()=>{ Storage.set('smartcart_items',customItems); },[customItems]);
  useEffect(()=>{ Storage.set('smartcart_favorites',favorites); },[favorites]);
  useEffect(()=>{ Storage.set('smartcart_history',history); },[history]);
  useEffect(()=>{ Storage.set('smartcart_basket',basket); },[basket]);
  useEffect(()=>{ Storage.set('smartcart_alerts',priceAlerts); },[priceAlerts]);
  useEffect(()=>{ Storage.set('smartcart_address',userAddress); },[userAddress]);

  const itemsToScan = useMemo(()=>[...predefinedItems.filter(i=>i.checked).map(i=>i.name),...customItems],[predefinedItems,customItems]);

  const { groupedByStore, totalOptimized } = useMemo(()=>{
    if(!results) return { groupedByStore:{}, totalOptimized:0 };
    const groups = {}; SUPERMERCADOS.forEach(s=>{ groups[s.id]={ storeDef:s, items:[], subtotal:0 }; });
    let total = 0;
    results.items.forEach(item=>{
      const best = item.rankedOptions[0];
      if(groups[best.id]){ groups[best.id].items.push({ originalName:item.itemName,...best }); groups[best.id].subtotal+=best.price; total+=best.price; }
    });
    return { groupedByStore:groups, totalOptimized:total };
  },[results]);

  const totalExpensive = useMemo(()=>{ if(!results) return 0; return results.items.reduce((a,item)=>a+Math.max(...item.rankedOptions.map(o=>o.price)),0); },[results]);

  const toggleFavorite = (name) => setFavorites(prev=>prev.includes(name)?prev.filter(f=>f!==name):[...prev,name]);

  const addToBasket = (itemName, option) => {
    setBasket(prev=>{
      const exists = prev.find(b=>b.name===itemName);
      if(exists) return prev.map(b=>b.name===itemName?{...b,...option,name:itemName}:b);
      return [...prev,{name:itemName,...option}];
    });
  };

  const handleTogglePredefined = (index) => setPredefinedItems(prev=>prev.map((item,i)=>i===index?{...item,checked:!item.checked}:item));

  const handleCameraUpload = async (e) => {
    const file = e.target.files?.[0]; if(!file) return;
    setIsAnalyzingImage(true); setImageError('');
    try {
      const reader = new FileReader(); reader.readAsDataURL(file);
      reader.onload = async () => {
        try {
          const b64 = reader.result.split(',')[1];
          const text = await ApiService.analyzeImageWithAI(b64,file.type,apiKey);
          const clean = text.replace(/[^a-zA-Z0-9 áéíóúÁÉÍÓÚñÑ]/g,'').trim();
          if(clean&&clean.length>2) setCustomItems(prev=>[...prev,clean]); else setImageError("No pude identificar.");
        } catch(err){ setImageError(err.message||"Error."); } finally{ setIsAnalyzingImage(false); setTimeout(()=>setImageError(''),4000); }
      };
    } catch{ setImageError("Error lectura."); setIsAnalyzingImage(false); }
    if(fileInputRef.current) fileInputRef.current.value=null;
  };

  const startScanning = async () => {
    if(itemsToScan.length===0) return;
    setView('scanning'); setResultsTab('comparativa'); setScanProgress(0);
    setScanStatus({ phase:'locating', stores:[], currentStoreScraping:'', itemIndex:0 });
    await new Promise(r=>setTimeout(r,2000));
    const geoSeed = Utils.calculateGeoSeed(userAddress);
    const regMod = 1+(((geoSeed%100)-50)/1000);
    const localStores = SUPERMERCADOS;
    setScanStatus({ phase:'connecting', stores:localStores, currentStoreScraping:'', itemIndex:0 });
    await new Promise(r=>setTimeout(r,1500));
    const finalResults = [];
    const newAlerts = {...priceAlerts};
    const notifications = [];

    for(let i=0;i<itemsToScan.length;i++){
      setScanStatus(prev=>({...prev,phase:'scraping',itemIndex:i}));
      setScanProgress(Math.round((i/itemsToScan.length)*85));
      const item = itemsToScan[i];
      const lowerItem = item.toLowerCase();
      let options=[],details={};

      if(REAL_PRICES_DB[lowerItem]){
        const rd = REAL_PRICES_DB[lowerItem];
        details={ cat:rd.cat, isBeverage:rd.isBeverage, strictBrand:rd.strictBrand, unit:rd.unit };
        for(const opt of rd.options){
          const storeDef = SUPERMERCADOS.find(s=>s.id===opt.storeId)||SUPERMERCADOS[0];
          setScanStatus(prev=>({...prev,currentStoreScraping:storeDef.nombre}));
          await new Promise(r=>setTimeout(r,200));
          const lp = opt.price*regMod;
          options.push({...storeDef, specificBrand:opt.brand, isBrand:opt.isBrand, format:opt.format, price:lp, unitPrice:lp/opt.qty, calculationUnit:rd.unit, containerType:''});
        }
      } else {
        const isBev = Utils.isBeverageItem(item);
        const unit = isBev?'L':'kg';
        details={ cat:'genérico', isBeverage:isBev, strictBrand:true, unit };
        setScanStatus(prev=>({...prev,currentStoreScraping:'Buscando formatos...'}));
        const apiData = await ApiService.fetchRealProductData(item);
        const basePPU = 1.5+Math.random()*6.0;
        const formats = isBev
          ?[{qty:0.33,label:'Lata 33cl'},{qty:0.5,label:'Botella 500ml'},{qty:1.0,label:'Botella 1L'},{qty:1.5,label:'Botella 1.5L'},{qty:2.0,label:'Botella 2L'}]
          :[{qty:0.25,label:'Formato 250g'},{qty:0.5,label:'Formato 500g'},{qty:1.0,label:'Familiar 1Kg'}];
        for(const store of localStores){
          setScanStatus(prev=>({...prev,currentStoreScraping:store.nombre}));
          await new Promise(r=>setTimeout(r,300));
          for(const fmt of formats){
            const sm=1+(Math.random()*0.3-0.15);
            const sd=fmt.qty>=1.5?0.80:fmt.qty>=1?0.88:fmt.qty<=0.33?1.25:1.0;
            const fp=basePPU*fmt.qty*sm*sd*regMod;
            options.push({...store, specificBrand:apiData.brand, isBrand:true, format:fmt.label, price:fp, unitPrice:fp/fmt.qty, calculationUnit:unit, containerType:''});
          }
        }
      }

      options.sort((a,b)=>a.unitPrice-b.unitPrice);
      const unique=[]; const seen=new Set();
      for(const opt of options){ const k=`${opt.id}-${opt.isBrand}-${opt.format}`; if(!seen.has(k)){ seen.add(k); unique.push(opt); } if(unique.length>=6) break; }

      // Alertas precio
      const bestPrice = unique[0].price;
      if(newAlerts[lowerItem]!==undefined && bestPrice<newAlerts[lowerItem]*0.95){
        notifications.push({ name:item, oldPrice:newAlerts[lowerItem], newPrice:bestPrice });
      }
      newAlerts[lowerItem] = bestPrice;

      finalResults.push({ itemName:item, details, rankedOptions:unique });
    }

    setPriceAlerts(newAlerts);
    if(notifications.length>0) setAlertNotifications(notifications);
    setHistory(prev=>[{ items:itemsToScan, date:new Date().toLocaleDateString('es-ES',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}) },...prev].slice(0,10));

    setScanStatus(prev=>({...prev,phase:'calculating'}));
    setScanProgress(95);
    await new Promise(r=>setTimeout(r,1500));
    setScanProgress(100);
    setResults({ items:finalResults });
    setView('results');
  };

  // ==========================================
  // RENDERS
  // ==========================================
  const STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,700;9..40,900&display=swap');
    @keyframes fadeSlideIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
    @keyframes pulse2{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.6;transform:scale(0.96)}}
    @keyframes glow{0%,100%{box-shadow:0 0 10px rgba(16,185,129,.3)}50%{box-shadow:0 0 30px rgba(16,185,129,.6)}}
    .item-enter{animation:fadeSlideIn .35s ease both}
    .scan-pulse{animation:pulse2 1.8s ease-in-out infinite}
    .glow-box{animation:glow 2s ease-in-out infinite}
  `;

  const renderHome = () => {
    const allCount = itemsToScan.length;
    return (
      <div className="flex flex-col h-full" style={{ background:'#f7f8fc', fontFamily:"'DM Sans','Segoe UI',system-ui,sans-serif" }}>
        <style>{STYLES}</style>
        <header className="px-5 pt-10 pb-3 sticky top-0 z-30" style={{ background:'rgba(247,248,252,0.92)', backdropFilter:'blur(16px)' }}>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-2xl flex items-center justify-center shadow-lg" style={{ background:'linear-gradient(135deg,#10b981,#059669)' }}>
                <Sparkles size={17} className="text-white"/>
              </div>
              <div>
                <h1 className="text-[22px] leading-none font-black tracking-tight" style={{ color:'#0f172a' }}>Smart<span style={{ color:'#10b981' }}>Cart</span></h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">Comparador de precios</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {basket.length>0 && (
                <button onClick={()=>setHomeTab('cesta')} className="relative p-2.5 rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <ShoppingBasket size={18} className="text-emerald-600"/>
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] font-black flex items-center justify-center">{basket.length}</span>
                </button>
              )}
              <button onClick={()=>setView('settings')} className="p-2.5 rounded-2xl border border-slate-200 bg-white shadow-sm">
                <Settings size={18} className="text-slate-600"/>
              </button>
            </div>
          </div>
          <button onClick={()=>setView('settings')} className="w-full flex items-center space-x-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm mb-3">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background:'#ecfdf5' }}>
              <MapPin size={14} className="text-emerald-600"/>
            </div>
            <p className="flex-1 text-sm font-black text-slate-800 truncate text-left">{userAddress}</p>
            <ArrowRight size={12} className="text-slate-400 flex-shrink-0"/>
          </button>
          <div className="bg-slate-100 p-1 rounded-2xl flex">
            {[['lista',List,'Lista'],['favoritos',Heart,'Favoritos'],['historial',Clock,'Historial'],['cesta',ShoppingBasket,'Cesta']].map(([tab,Icon,label])=>(
              <button key={tab} onClick={()=>setHomeTab(tab)}
                className={`flex-1 py-2 flex items-center justify-center space-x-1 rounded-xl text-[10px] font-black transition-all ${homeTab===tab?'bg-white text-slate-800 shadow-sm':'text-slate-500'}`}>
                <Icon size={11}/><span>{label}</span>
                {tab==='cesta'&&basket.length>0&&<span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white text-[8px] flex items-center justify-center">{basket.length}</span>}
              </button>
            ))}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-5 pb-44 pt-3 space-y-4">
          {homeTab==='lista' && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Productos</h2>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">{allCount} seleccionados</span>
              </div>
              <div className="space-y-2">
                {predefinedItems.map((item,idx)=>(
                  <div key={idx} className="flex items-center space-x-2">
                    <button onClick={()=>handleTogglePredefined(idx)}
                      className={`flex-1 flex items-center p-3.5 rounded-2xl border transition-all active:scale-[0.98] ${item.checked?'border-emerald-400':'bg-white border-slate-200 shadow-sm'}`}
                      style={item.checked?{ background:'linear-gradient(135deg,#10b981,#059669)' }:{}}>
                      <div className={`w-5 h-5 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 border ${item.checked?'bg-white border-white':'bg-slate-50 border-slate-200'}`}>
                        {item.checked&&<CheckCircle2 size={13} className="text-emerald-500" strokeWidth={3}/>}
                      </div>
                      <span className={`font-black text-sm ${item.checked?'text-white':'text-slate-800'}`}>{item.name}</span>
                    </button>
                    <button onClick={()=>toggleFavorite(item.name)}
                      className={`p-3 rounded-2xl border transition-all ${favorites.includes(item.name)?'bg-rose-50 border-rose-200 text-rose-500':'bg-white border-slate-200 text-slate-300'}`}>
                      <Heart size={16} fill={favorites.includes(item.name)?'currentColor':'none'}/>
                    </button>
                  </div>
                ))}
              </div>
              {customItems.length>0&&(
                <div className="item-enter">
                  <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Añadidos por ti</h2>
                  <div className="space-y-2">
                    {customItems.map((item,idx)=>(
                      <div key={idx} className="flex items-center justify-between bg-white p-3.5 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex items-center space-x-3"><Package size={14} className="text-emerald-600"/><span className="text-slate-700 font-bold text-sm">{item}</span></div>
                        <div className="flex items-center space-x-1">
                          <button onClick={()=>toggleFavorite(item)} className={`p-1.5 rounded-xl ${favorites.includes(item)?'text-rose-500':'text-slate-300'}`}><Heart size={14} fill={favorites.includes(item)?'currentColor':'none'}/></button>
                          <button onClick={()=>setCustomItems(prev=>prev.filter((_,i)=>i!==idx))} className="p-1.5 rounded-xl text-slate-300 hover:text-red-400"><Trash2 size={14}/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {homeTab==='favoritos'&&(
            <>
              <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Mis favoritos</h2>
              {favorites.length===0?(
                <div className="bg-white rounded-3xl p-8 text-center border border-slate-100">
                  <Heart size={32} className="text-slate-200 mx-auto mb-3"/>
                  <p className="text-slate-500 font-bold text-sm">Sin favoritos todavía</p>
                  <p className="text-slate-400 text-xs mt-1">Toca el corazón en cualquier producto</p>
                </div>
              ):(
                <div className="space-y-2">
                  {favorites.map((fav,idx)=>{
                    const isPred = predefinedItems.find(p=>p.name===fav);
                    const isSelected = isPred?.checked||customItems.includes(fav);
                    return (
                      <div key={idx} className="flex items-center space-x-2">
                        <button onClick={()=>{ if(isPred){ const i=predefinedItems.findIndex(p=>p.name===fav); handleTogglePredefined(i); } else if(!customItems.includes(fav)){ setCustomItems(prev=>[...prev,fav]); } }}
                          className={`flex-1 flex items-center p-3.5 rounded-2xl border transition-all active:scale-[0.98] ${isSelected?'border-emerald-400':'bg-white border-slate-200 shadow-sm'}`}
                          style={isSelected?{ background:'linear-gradient(135deg,#10b981,#059669)' }:{}}>
                          <Star size={14} className={`mr-3 flex-shrink-0 ${isSelected?'text-white':'text-amber-400'}`} fill="currentColor"/>
                          <span className={`font-black text-sm ${isSelected?'text-white':'text-slate-800'}`}>{fav}</span>
                          {isSelected&&<CheckCircle2 size={14} className="ml-auto text-white"/>}
                        </button>
                        <button onClick={()=>toggleFavorite(fav)} className="p-3 rounded-2xl border bg-rose-50 border-rose-200 text-rose-500"><X size={14}/></button>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {homeTab==='historial'&&(
            <>
              <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Últimas búsquedas</h2>
              {history.length===0?(
                <div className="bg-white rounded-3xl p-8 text-center border border-slate-100">
                  <Clock size={32} className="text-slate-200 mx-auto mb-3"/>
                  <p className="text-slate-500 font-bold text-sm">Sin historial todavía</p>
                </div>
              ):(
                <div className="space-y-3">
                  {history.map((entry,idx)=>(
                    <div key={idx} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center"><Clock size={10} className="mr-1"/>{entry.date}</span>
                        <button onClick={()=>{ entry.items.forEach(item=>{ const i=predefinedItems.findIndex(p=>p.name.toLowerCase()===item.toLowerCase()); if(i>=0) handleTogglePredefined(i); else if(!customItems.includes(item)) setCustomItems(prev=>[...prev,item]); }); setHomeTab('lista'); }}
                          className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">Repetir</button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {entry.items.map((item,i)=><span key={i} className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">{item}</span>)}
                      </div>
                    </div>
                  ))}
                  <button onClick={()=>setHistory([])} className="w-full p-3 text-xs font-bold text-slate-400 hover:text-red-400 transition-colors">Borrar historial</button>
                </div>
              )}
            </>
          )}

          {homeTab==='cesta'&&(
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Cesta acumulada</h2>
                {basket.length>0&&<button onClick={()=>setBasket([])} className="text-[10px] font-bold text-red-400">Vaciar</button>}
              </div>
              {basket.length===0?(
                <div className="bg-white rounded-3xl p-8 text-center border border-slate-100">
                  <ShoppingBasket size={32} className="text-slate-200 mx-auto mb-3"/>
                  <p className="text-slate-500 font-bold text-sm">Cesta vacía</p>
                  <p className="text-slate-400 text-xs mt-1">Después de comparar, añade productos aquí</p>
                </div>
              ):(
                <>
                  <div className="space-y-2">
                    {basket.map((item,idx)=>(
                      <div key={idx} className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FormatBadge format={item.format||'Ud.'} className="w-12 h-10 flex-shrink-0"/>
                          <div>
                            <p className="text-sm font-black text-slate-800">{item.name}</p>
                            <div className="flex items-center space-x-1 mt-0.5">
                              <StoreLogo store={SUPERMERCADOS.find(s=>s.id===item.id)||SUPERMERCADOS[0]} className="w-3 h-3 rounded-sm"/>
                              <p className="text-[10px] font-medium text-slate-500">{item.nombre}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-black text-sm text-slate-800">{item.price?.toFixed(2)}€</span>
                          <button onClick={()=>setBasket(prev=>prev.filter((_,i)=>i!==idx))} className="text-slate-300 hover:text-red-400 p-1"><X size={14}/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 flex justify-between items-center">
                    <span className="font-black text-emerald-800 text-sm">Total cesta</span>
                    <span className="font-black text-emerald-700 text-xl">{basket.reduce((a,b)=>a+(b.price||0),0).toFixed(2)}€</span>
                  </div>
                </>
              )}
            </>
          )}
          <div ref={listEndRef}/>
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-30 max-w-md mx-auto">
          <div className="mx-4 mb-4 bg-white rounded-3xl border border-slate-200 overflow-hidden" style={{ boxShadow:'0 -4px 40px rgba(0,0,0,0.08),0 8px 32px rgba(0,0,0,0.06)' }}>
            {imageError&&<div className="px-4 pt-3"><div className="px-4 py-2.5 bg-red-50 text-red-600 text-xs font-bold rounded-2xl text-center border border-red-100">{imageError}</div></div>}
            <div className="p-3">
              <div className="flex space-x-2 mb-2.5">
                <input type="file" accept="image/*" capture="environment" ref={fileInputRef} className="hidden" onChange={handleCameraUpload}/>
                <button type="button" onClick={()=>fileInputRef.current?.click()} disabled={isAnalyzingImage}
                  className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center border border-slate-200 bg-slate-50 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 active:scale-95 transition-all disabled:opacity-50">
                  {isAnalyzingImage?<Loader2 size={20} className="animate-spin"/>:<Camera size={20}/>}
                </button>
                <input type="text" value={newItem} onChange={e=>setNewItem(e.target.value)}
                  onKeyDown={e=>{ if(e.key==='Enter'&&newItem.trim()){ setCustomItems(prev=>[...prev,newItem.trim()]); setNewItem(''); }}}
                  placeholder="Ej: Galletas Príncipe..." className="flex-1 h-12 bg-slate-50 border border-slate-200 rounded-2xl px-4 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 min-w-0"/>
                <button onClick={()=>{ if(newItem.trim()){ setCustomItems(prev=>[...prev,newItem.trim()]); setNewItem(''); }}} disabled={!newItem.trim()}
                  className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center border border-slate-200 bg-slate-50 text-slate-500 active:scale-95 disabled:opacity-40">
                  <Plus size={20}/>
                </button>
              </div>
              <button onClick={startScanning} disabled={itemsToScan.length===0}
                className="w-full h-14 rounded-2xl text-white font-black text-sm uppercase tracking-wider flex items-center justify-center space-x-2.5 transition-all active:scale-[0.98] disabled:opacity-50"
                style={{ background:itemsToScan.length>0?'linear-gradient(135deg,#0f172a,#1e293b)':'#94a3b8', boxShadow:itemsToScan.length>0?'0 8px 24px rgba(15,23,42,.3)':'none' }}>
                <Globe size={18}/><span>Comparar precios {itemsToScan.length>0?`(${itemsToScan.length})`:''}</span>
                {itemsToScan.length>0&&<Zap size={14} className="text-amber-400"/>}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSettings = () => (
    <div className="flex flex-col h-full" style={{ background:'#f7f8fc', fontFamily:"'DM Sans','Segoe UI',system-ui,sans-serif" }}>
      <style>{STYLES}</style>
      <header className="px-5 pt-10 pb-5 bg-white border-b border-slate-100 flex items-center space-x-3 sticky top-0">
        <button onClick={()=>setView('home')} className="p-2 -ml-1 rounded-xl hover:bg-slate-50 active:scale-95"><ChevronLeft size={22} className="text-slate-700"/></button>
        <h1 className="text-xl font-black text-slate-800">Tu Ubicación</h1>
      </header>
      <div className="p-5 space-y-6">
        <div className="p-5 rounded-3xl border" style={{ background:'linear-gradient(135deg,#eff6ff,#dbeafe)', borderColor:'#bfdbfe' }}>
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background:'#3b82f6' }}><MapPin size={20} className="text-white"/></div>
            <p className="text-sm text-blue-900 font-medium leading-relaxed">Usamos tu dirección para detectar supermercados cercanos y calcular variaciones de precio locales.</p>
          </div>
        </div>
        <div className="space-y-3">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">Dirección de entrega</label>
          <div className="relative">
            <input type="text" value={userAddress} onChange={e=>setUserAddress(e.target.value)} placeholder="Ej: Calle Urbieta 12, 20006..."
              className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-base font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-400 transition-all pr-12"/>
            {userAddress&&<button type="button" onClick={()=>setUserAddress('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-400 p-1"><Trash2 size={17}/></button>}
          </div>
          <button onClick={()=>setView('home')} className="w-full h-14 rounded-2xl text-white font-black text-sm uppercase tracking-wider mt-4 active:scale-[0.98]"
            style={{ background:'linear-gradient(135deg,#10b981,#059669)', boxShadow:'0 8px 24px rgba(16,185,129,.3)' }}>
            Guardar y Volver
          </button>
        </div>
      </div>
    </div>
  );

  const renderScanning = () => (
    <div className="flex flex-col h-full relative overflow-hidden" style={{ background:'#0a0f1e', fontFamily:"'DM Sans','Segoe UI',system-ui,sans-serif" }}>
      <style>{STYLES}</style>
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage:'linear-gradient(rgba(16,185,129,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(16,185,129,.5) 1px,transparent 1px)', backgroundSize:'32px 32px' }}/>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full opacity-10 blur-3xl" style={{ background:'#10b981' }}/>
      <div className="relative z-10 flex flex-col h-full p-6 pt-14">
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2 px-4 py-2 rounded-full border glow-box" style={{ background:'rgba(16,185,129,.1)', borderColor:'rgba(16,185,129,.3)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 scan-pulse"/>
            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400">
              {scanStatus.phase==='locating'?'Geolocalizando':scanStatus.phase==='connecting'?'Conectando':scanStatus.phase==='scraping'?'Extrayendo precios':'Calculando óptimo'}
            </span>
          </div>
        </div>
        {scanStatus.phase==='locating'&&(
          <div className="flex flex-col items-center justify-center flex-1 space-y-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-2 scan-pulse flex items-center justify-center" style={{ borderColor:'rgba(16,185,129,.4)', background:'rgba(16,185,129,.08)' }}>
                <MapPin size={36} className="text-emerald-400"/>
              </div>
              <div className="absolute -inset-3 rounded-full border opacity-20 animate-ping" style={{ borderColor:'#10b981' }}/>
            </div>
            <div className="text-center">
              <p className="text-white font-black text-lg truncate max-w-xs">{userAddress}</p>
              <p className="text-slate-500 text-xs mt-1">Calibrando precios de tu zona...</p>
            </div>
          </div>
        )}
        {scanStatus.phase!=='locating'&&(
          <div className="flex flex-col flex-1 space-y-5 overflow-hidden">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Progreso</span>
                <span className="text-sm font-black text-emerald-400">{scanProgress}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background:'rgba(255,255,255,.05)' }}>
                <div className="h-full rounded-full transition-all duration-700" style={{ width:`${scanProgress}%`, background:'linear-gradient(90deg,#10b981,#34d399)' }}/>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2">
              {itemsToScan.map((item,idx)=>{
                const isScanning = scanStatus.phase==='scraping'&&scanStatus.itemIndex===idx;
                const isDone = scanStatus.phase==='calculating'||scanStatus.itemIndex>idx;
                return (
                  <div key={idx} className={`p-3.5 rounded-2xl border transition-all ${isScanning?'glow-box':isDone?'opacity-40':'opacity-20'}`}
                    style={{ background:isScanning?'rgba(16,185,129,.06)':'rgba(255,255,255,.02)', borderColor:isScanning?'rgba(16,185,129,.35)':'rgba(255,255,255,.06)' }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className={`w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 ${isDone?'bg-emerald-500':isScanning?'bg-emerald-500/20 border border-emerald-500/40':'bg-white/5'}`}>
                          {isDone?<CheckCircle2 size={12} className="text-white"/>:isScanning?<Loader2 size={12} className="text-emerald-400 animate-spin"/>:null}
                        </div>
                        <p className={`font-bold text-sm ${isScanning?'text-white':isDone?'text-white/50':'text-white/30'}`}>{item}</p>
                      </div>
                      {isDone&&<span className="text-[9px] font-black text-emerald-400 uppercase">Listo</span>}
                    </div>
                    {isScanning&&(
                      <div className="flex items-center space-x-2 mt-2 pl-7">
                        <div className="flex space-x-0.5">{[0,1,2].map(i=><div key={i} className="w-1 rounded-full bg-emerald-400" style={{ height:'12px', animation:`pulse2 ${0.8+i*.15}s ease-in-out infinite`, animationDelay:`${i*.2}s` }}/>)}</div>
                        <span className="text-[10px] text-emerald-400/80 truncate">{scanStatus.currentStoreScraping}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {scanStatus.phase==='calculating'&&(
              <div className="p-4 rounded-2xl border text-center glow-box" style={{ background:'rgba(16,185,129,.06)', borderColor:'rgba(16,185,129,.3)' }}>
                <p className="text-emerald-400 font-black text-xs uppercase tracking-widest">Calculando cesta óptima...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderResults = () => {
    if(!results) return null;
    const storesUsed = Object.values(groupedByStore).filter(g=>g.items.length>0);
    const savings = totalExpensive-totalOptimized;
    return (
      <div className="flex flex-col h-full relative" style={{ background:'#f7f8fc', fontFamily:"'DM Sans','Segoe UI',system-ui,sans-serif" }}>
        <style>{STYLES}</style>

        {alertNotifications.length>0&&(
          <div className="absolute top-4 left-4 right-4 z-50 space-y-2">
            {alertNotifications.map((n,i)=>(
              <div key={i} className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-center justify-between shadow-lg">
                <div className="flex items-center space-x-2">
                  <Bell size={14} className="text-amber-600 flex-shrink-0"/>
                  <div>
                    <p className="text-xs font-black text-amber-800">{n.name} bajó de precio</p>
                    <p className="text-[10px] text-amber-600">{n.oldPrice.toFixed(2)}€ → <span className="font-black">{n.newPrice.toFixed(2)}€</span></p>
                  </div>
                </div>
                <button onClick={()=>setAlertNotifications(prev=>prev.filter((_,j)=>j!==i))} className="text-amber-400 p-1"><X size={14}/></button>
              </div>
            ))}
          </div>
        )}

        <header className="bg-white px-5 pt-10 pb-4 sticky top-0 z-20 border-b border-slate-100">
          <div className="flex items-center space-x-3 mb-3">
            <button onClick={()=>setView('home')} className="p-2 -ml-1 rounded-xl hover:bg-slate-50 active:scale-95 flex-shrink-0"><ChevronLeft size={22} className="text-slate-700"/></button>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-black text-slate-800 leading-tight">Cesta Optimizada</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate mt-0.5">{userAddress}</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[['Total mín.',totalOptimized.toFixed(2)+'€','bg-slate-50 border-slate-100 text-slate-400 text-slate-800'],
              ['Productos',results.items.length,'bg-emerald-50 border-emerald-100 text-emerald-500 text-emerald-700'],
              ['Tiendas',storesUsed.length,'bg-slate-50 border-slate-100 text-slate-400 text-slate-800'],
              ['Ahorro',savings.toFixed(2)+'€','bg-amber-50 border-amber-100 text-amber-600 text-amber-700']
            ].map(([label,val,cls],i)=>{
              const [bg,,labelCls,valCls] = cls.split(' ');
              return (
                <div key={i} className={`${bg} rounded-2xl p-2.5 border ${cls.split(' ')[1]} text-center`}>
                  <p className={`text-[8px] font-black uppercase tracking-wider mb-0.5 ${cls.split(' ')[2]}`}>{label}</p>
                  <p className={`text-sm font-black ${cls.split(' ')[3]}`}>{val}</p>
                </div>
              );
            })}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-32">
          {resultsTab==='comparativa'&&(
            <div>{results.items.map((item,idx)=><ProductCard key={idx} item={item} index={idx} onAddToBasket={addToBasket}/>)}</div>
          )}
          {resultsTab==='supermercado'&&(
            <div className="space-y-4">
              {Object.values(groupedByStore).sort((a,b)=>b.items.length-a.items.length).map((group,idx)=>{
                const location = Utils.getStoreLocation(group.storeDef.id,userAddress);
                const hasItems = group.items.length>0;
                return (
                  <div key={idx} className="bg-white rounded-3xl border overflow-hidden" style={{ borderColor:hasItems?'#e2e8f0':'#f1f5f9', opacity:hasItems?1:0.6, animation:`fadeSlideIn 0.4s ease ${idx*0.06}s both` }}>
                    <div className="p-4 flex items-center justify-between" style={{ background:hasItems?(group.storeDef.accent||'#1e293b'):'#f8fafc' }}>
                      <div className="flex items-center space-x-3">
                        <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/20 p-1.5 flex items-center justify-center flex-shrink-0"><StoreLogo store={group.storeDef} className="w-full h-full"/></div>
                        <div className="min-w-0">
                          <p className={`font-black text-lg leading-tight ${hasItems?'text-white':'text-slate-600'}`}>{group.storeDef.nombre}</p>
                          <div className="flex items-center space-x-1 mt-0.5"><MapPin size={9} className={hasItems?'text-white/60':'text-slate-400'}/><p className={`text-[10px] font-medium truncate max-w-[140px] ${hasItems?'text-white/70':'text-slate-400'}`}>{location.address} · {location.distance}km</p></div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className={`text-[9px] font-bold uppercase tracking-wider mb-0.5 ${hasItems?'text-white/60':'text-slate-400'}`}>Subtotal</p>
                        <p className={`font-black text-xl ${hasItems?'text-white':'text-slate-500'}`}>{group.subtotal.toFixed(2)}€</p>
                      </div>
                    </div>
                    <div className="p-2 space-y-1">
                      {group.items.length===0?(
                        <div className="p-5 flex flex-col items-center text-center"><Info size={20} className="text-slate-300 mb-2"/><p className="text-xs font-bold text-slate-500">Sin productos asignados</p></div>
                      ):group.items.map((item,i)=>(
                        <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-colors">
                          <div className="flex items-center space-x-3 flex-1 min-w-0 pr-3">
                            <FormatBadge format={item.format} className="w-12 h-10 flex-shrink-0"/>
                            <div className="truncate"><p className="text-sm font-bold text-slate-800 truncate">{item.originalName}</p><p className="text-[10px] font-medium text-slate-500 truncate mt-0.5">{item.specificBrand}</p></div>
                          </div>
                          <span className="font-black text-sm text-slate-800 whitespace-nowrap px-3 py-1.5 rounded-xl bg-slate-100">{item.price.toFixed(2)}€</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {resultsTab==='ahorro'&&(
            <div className="space-y-4">
              <div className="rounded-3xl p-6 text-white" style={{ background:'linear-gradient(135deg,#10b981,#059669)' }}>
                <p className="text-white/70 text-xs font-black uppercase tracking-widest mb-1">Ahorro total vs. más caro</p>
                <p className="text-4xl font-black mb-1">{savings.toFixed(2)}€</p>
                <p className="text-white/70 text-xs">Comprando la opción más barata por producto</p>
              </div>
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Por producto</h3>
              {results.items.map((item,idx)=>{
                const best = item.rankedOptions[0].price;
                const worst = Math.max(...item.rankedOptions.map(o=>o.price));
                const saved = worst-best;
                const pct = worst>0?Math.round((saved/worst)*100):0;
                return (
                  <div key={idx} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-black text-sm text-slate-800 capitalize">{item.itemName}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">-{pct}%</span>
                        <span className="font-black text-sm text-emerald-700">{saved.toFixed(2)}€</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                      <span className="flex items-center space-x-1"><StoreLogo store={item.rankedOptions[0]} className="w-3 h-3 rounded-sm"/><span>{item.rankedOptions[0].nombre} {item.rankedOptions[0].price.toFixed(2)}€</span></span>
                      <span className="line-through text-slate-300">{worst.toFixed(2)}€</span>
                    </div>
                    <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-emerald-400" style={{ width:`${pct}%` }}/>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <button onClick={()=>setView('home')} className="w-full flex items-center justify-center space-x-2.5 text-slate-600 font-black text-sm p-4 bg-white rounded-2xl border border-slate-200 shadow-sm active:scale-[0.98] transition-all">
              <Receipt size={17}/><span>Nueva búsqueda</span>
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-white/90 border-t border-slate-100 p-4 pb-5 z-30" style={{ backdropFilter:'blur(16px)' }}>
          <div className="bg-slate-100 p-1.5 rounded-2xl flex">
            {[['comparativa',List,'Formatos'],['supermercado',Store,'Por Súper'],['ahorro',TrendingDown,'Ahorro']].map(([tab,Icon,label])=>(
              <button key={tab} onClick={()=>setResultsTab(tab)}
                className={`flex-1 py-2.5 px-2 flex items-center justify-center space-x-1.5 rounded-xl text-xs font-black transition-all ${resultsTab===tab?'bg-white text-slate-800 shadow-sm':'text-slate-500'}`}>
                <Icon size={14}/><span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center font-sans sm:p-6">
      <div className="w-full max-w-md h-[100dvh] sm:h-[850px] sm:max-h-[90vh] bg-white sm:rounded-[2.5rem] shadow-2xl overflow-hidden relative border-gray-800 sm:border-[8px]">
        {view==='home'&&renderHome()}
        {view==='settings'&&renderSettings()}
        {view==='scanning'&&renderScanning()}
        {view==='results'&&renderResults()}
      </div>
    </div>
  );
}