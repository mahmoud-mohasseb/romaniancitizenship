'use client';

import React, { useEffect, useRef, useState } from 'react';
import { 
  MapPin, 
  Layers, 
  Maximize2, 
  Minimize2, 
  Phone, 
  Globe, 
  Clock, 
  ExternalLink,
  Info,
  Building2,
  ShieldCheck,
  FileText
} from 'lucide-react';

export default function RomanianMap({ 
  locations = [], 
  selectedLocationId, 
  onSelectLocation,
  onOpenDetailsModal,
  appLang = 'ar',
  activeCategory = 'all'
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const tileLayerRef = useRef(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [tileMode, setTileMode] = useState('standard'); // 'standard' | 'satellite'
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Filter locations by activeCategory
  const filteredLocations = locations.filter(loc => {
    if (activeCategory === 'all') return true;
    return loc.category === activeCategory;
  });

  // Tile layer URLs
  const standardTileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const satelliteTileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

  // Initialize Leaflet Map
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // Already initialized

    // Dynamically import Leaflet
    import('leaflet').then((L) => {
      // Fix default Leaflet icon paths
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      // Center map on Romania (Lat: 45.9432, Lng: 24.9668, Zoom: 7)
      const map = L.map(mapContainerRef.current, {
        center: [45.9432, 24.9668],
        zoom: 7,
        minZoom: 6,
        maxZoom: 17,
        zoomControl: false
      });

      // Standard Tile Layer
      const tileLayer = L.tileLayer(standardTileUrl, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> & &copy; ANC Romania',
        maxZoom: 19
      }).addTo(map);

      tileLayerRef.current = tileLayer;
      mapInstanceRef.current = map;
      setMapLoaded(true);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer when tileMode changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    if (typeof window === 'undefined') return;

    import('leaflet').then((L) => {
      const newUrl = tileMode === 'satellite' ? satelliteTileUrl : standardTileUrl;
      const attribution = tileMode === 'satellite' 
        ? '&copy; Esri & Earthstar Geographics & ANC Romania' 
        : '&copy; OpenStreetMap & ANC Romania';

      tileLayerRef.current.setUrl(newUrl);
    });
  }, [tileMode]);

  // Update Markers on Map when filteredLocations change
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;
    if (typeof window === 'undefined') return;

    import('leaflet').then((L) => {
      const map = mapInstanceRef.current;

      // Clear existing markers
      Object.values(markersRef.current).forEach((marker) => {
        map.removeLayer(marker);
      });
      markersRef.current = {};

      // Add new markers
      filteredLocations.forEach((loc) => {
        const isAnc = loc.anc_office;
        
        // Custom HTML Marker Icon with pulsing glow ring
        const markerColor = isAnc ? '#E11D48' : loc.category === 'passport' ? '#3B82F6' : loc.category === 'immigration' ? '#F59E0B' : '#10B981';
        
        const customHtmlIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `
            <div class="relative flex items-center justify-center cursor-pointer group">
              <!-- Pulsing Outer Ring -->
              <div class="absolute -inset-2 rounded-full animate-ping opacity-60" style="background-color: ${markerColor};"></div>
              <!-- Glowing Marker Core -->
              <div class="w-9 h-9 rounded-2xl flex items-center justify-center text-white shadow-2xl border-2 border-white transition-all transform group-hover:scale-125 group-hover:-translate-y-1" style="background-color: ${markerColor};">
                <span class="text-sm font-black">${isAnc ? '🏛️' : '📍'}</span>
              </div>
              <!-- City Label Pill -->
              <div class="absolute top-10 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-lg bg-slate-900/90 text-white border border-slate-700 text-[10px] font-black whitespace-nowrap shadow-md pointer-events-none">
                ${loc.name_ro.split(' - ')[0]}
              </div>
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
          popupAnchor: [0, -18]
        });

        const marker = L.marker([loc.lat, loc.lng], { icon: customHtmlIcon }).addTo(map);

        // Build HTML Popup Card
        const titleName = appLang === 'ar' ? loc.name_ar : appLang === 'en' ? loc.name_en : loc.name_ro;
        const countyName = appLang === 'ar' ? loc.county_ar : appLang === 'en' ? loc.county_en : loc.county_ro;
        const categoryLabel = appLang === 'ar' ? loc.category_label_ar : appLang === 'en' ? loc.category_label_en : loc.category_label_ro;
        const descriptionText = appLang === 'ar' ? loc.description_ar : appLang === 'en' ? loc.description_en : loc.description_ro;

        const popupContent = document.createElement('div');
        popupContent.className = 'p-1 font-latin text-right max-w-[280px] space-y-2';
        popupContent.innerHTML = `
          <div class="rounded-2xl overflow-hidden relative shadow-md">
            <img src="${loc.image_url}" alt="${loc.name_ro}" class="w-full h-28 object-cover" />
            <span class="absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white shadow-md">
              ${categoryLabel}
            </span>
          </div>
          <div class="space-y-1">
            <h4 class="text-sm font-black text-slate-900 leading-snug">${titleName}</h4>
            <p className="text-[11px] font-extrabold text-rose-600">${countyName}</p>
            <p class="text-[11px] text-slate-600 font-semibold line-clamp-2 leading-relaxed">${descriptionText}</p>
          </div>
          <div class="pt-1 text-[11px] text-slate-700 font-semibold border-t border-slate-200 space-y-1">
            <div class="flex items-center gap-1.5 text-slate-800">
              <span class="font-black text-rose-500">📍</span>
              <span class="truncate">${appLang === 'ar' ? loc.address_ar : loc.address_ro}</span>
            </div>
            <div class="flex items-center gap-1.5 text-slate-800">
              <span class="font-black text-blue-500">📞</span>
              <span>${loc.phone}</span>
            </div>
          </div>
        `;

        // Details Button inside Popup Card
        const detailsBtn = document.createElement('button');
        detailsBtn.className = 'w-full mt-2 py-2 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white text-xs font-black shadow-md hover:from-rose-500 hover:to-amber-500 transition-all flex items-center justify-center gap-1.5';
        detailsBtn.innerHTML = `<span>${appLang === 'ar' ? 'عرض التفاصيل الكاملة 🏛️' : 'View Details 🏛️'}</span>`;
        detailsBtn.addEventListener('click', () => {
          if (onOpenDetailsModal) onOpenDetailsModal(loc);
        });

        popupContent.appendChild(detailsBtn);

        marker.bindPopup(popupContent, { maxWidth: 300 });

        marker.on('click', () => {
          onSelectLocation(loc);
          map.flyTo([loc.lat, loc.lng], 13, { duration: 1.5 });
        });

        markersRef.current[loc.id] = marker;
      });
    });
  }, [filteredLocations, mapLoaded, appLang]);

  // Fly camera to selectedLocationId when changed externally (from search or list)
  useEffect(() => {
    if (!selectedLocationId || !mapInstanceRef.current) return;
    const targetLoc = locations.find(l => l.id === selectedLocationId);
    if (targetLoc) {
      mapInstanceRef.current.flyTo([targetLoc.lat, targetLoc.lng], 13, { duration: 1.5 });
      const targetMarker = markersRef.current[targetLoc.id];
      if (targetMarker) {
        targetMarker.openPopup();
      }
    }
  }, [selectedLocationId, locations]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`relative rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-700/60 bg-slate-900 transition-all ${
      isFullscreen ? 'fixed inset-4 z-50 rounded-3xl' : 'w-full h-[480px] sm:h-[560px]'
    }`}>
      {/* Map Element Container */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Leaflet CSS Link dynamically injected */}
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css" 
      />

      {/* Map Control Buttons overlay */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        {/* Layer Switcher Button */}
        <button
          onClick={() => setTileMode(tileMode === 'standard' ? 'satellite' : 'standard')}
          className="p-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700/80 shadow-xl transition-all flex items-center gap-1.5 text-xs font-black backdrop-blur-md"
          title="Toggle Satellite Map"
        >
          <Layers className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">{tileMode === 'standard' ? (appLang === 'ar' ? 'خريطة أقمار صناعية' : 'Satellite') : (appLang === 'ar' ? 'خريطة قياسية' : 'Standard')}</span>
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="p-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700/80 shadow-xl transition-all flex items-center gap-1.5 text-xs font-black backdrop-blur-md"
          title="Toggle Fullscreen Map"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4 text-rose-400" /> : <Maximize2 className="w-4 h-4 text-rose-400" />}
          <span className="hidden sm:inline">{isFullscreen ? (appLang === 'ar' ? 'إنهاء التكبير' : 'Exit') : (appLang === 'ar' ? 'ملء الشاشة' : 'Fullscreen')}</span>
        </button>
      </div>

      {/* Legend Badge Overlay */}
      <div className="absolute bottom-4 right-4 z-20 p-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md shadow-xl text-[11px] font-bold text-white space-y-1 hidden sm:block">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-600 animate-pulse" />
          <span>{appLang === 'ar' ? 'مقرات ومكاتب ANC للجنسية 🏛️' : 'ANC Citizenship Offices 🏛️'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500" />
          <span>{appLang === 'ar' ? 'مكاتب الجوازات والإقامة 🛂' : 'Passport & Immigration 🛂'}</span>
        </div>
      </div>
    </div>
  );
}
