'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Layers, Maximize2, Minimize2, MapPin } from 'lucide-react';

export default function RomaniaExploreMap({
  citiesData = [],
  selectedCityId,
  selectedPlaceId,
  onSelectCity,
  onSelectPlace,
  appLang = 'ar',
  activeCategoryFilter = 'all'
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const cityMarkersRef = useRef({});
  const placeMarkersRef = useRef({});
  const tileLayerRef = useRef(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(7);
  const [mapStyle, setMapStyle] = useState('standard'); // 'standard' | 'topo' | 'satellite' | 'dark'
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Map Tile Style URLs
  const tileUrls = {
    standard: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    topo: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
  };

  const tileAttributions = {
    standard: '&copy; OpenStreetMap contributors & Explore Romania',
    topo: '&copy; OpenTopoMap & OpenStreetMap',
    satellite: '&copy; Esri & Earthstar Geographics',
    dark: '&copy; CARTO & OpenStreetMap'
  };

  // Initialize Map
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    import('leaflet').then((L) => {
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      // Romania Center: 45.9432, 24.9668, Zoom 7
      const map = L.map(mapContainerRef.current, {
        center: [45.9432, 24.9668],
        zoom: 7,
        minZoom: 6,
        maxZoom: 18,
        zoomControl: false
      });

      const tileLayer = L.tileLayer(tileUrls.standard, {
        attribution: tileAttributions.standard,
        maxZoom: 19
      }).addTo(map);

      tileLayerRef.current = tileLayer;
      mapInstanceRef.current = map;
      setMapLoaded(true);

      map.on('zoomend', () => {
        setCurrentZoom(map.getZoom());
      });
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer when mapStyle changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    if (typeof window === 'undefined') return;

    const newUrl = tileUrls[mapStyle] || tileUrls.standard;
    const newAttr = tileAttributions[mapStyle] || tileAttributions.standard;
    tileLayerRef.current.setUrl(newUrl);
  }, [mapStyle]);

  // Render City Pins & Granular Place Pins dynamically
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;
    if (typeof window === 'undefined') return;

    import('leaflet').then((L) => {
      const map = mapInstanceRef.current;

      // Clear existing markers
      Object.values(cityMarkersRef.current).forEach(m => map.removeLayer(m));
      Object.values(placeMarkersRef.current).forEach(m => map.removeLayer(m));
      cityMarkersRef.current = {};
      placeMarkersRef.current = {};

      // Render City Markers
      citiesData.forEach((city) => {
        const lat = city.basic_info?.lat || city.lat;
        const lng = city.basic_info?.lng || city.lng;
        const cityName = appLang === 'ar' ? city.basic_info?.name_ar || city.name_ar : appLang === 'en' ? city.basic_info?.name_en || city.name_en : city.basic_info?.name_ro || city.name_ro;
        const countyName = appLang === 'ar' ? city.basic_info?.county_ar || city.county_ar : city.basic_info?.county_ro || city.county_ro;
        const heroImg = city.hero_image?.url || city.image_url;
        const introText = appLang === 'ar' ? city.intro_ar : appLang === 'en' ? city.intro_en : city.intro_ro;

        const cityHtmlIcon = L.divIcon({
          className: 'custom-city-marker',
          html: `
            <div class="relative flex items-center justify-center cursor-pointer group">
              <div class="absolute -inset-2 rounded-full bg-amber-400/50 animate-ping"></div>
              <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-amber-500 to-blue-600 flex items-center justify-center text-white font-black text-xs shadow-2xl border-2 border-white transform group-hover:scale-125 transition-transform">
                🏙️
              </div>
              <div class="absolute top-11 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-lg bg-slate-900/90 text-amber-300 border border-slate-700 text-[11px] font-black whitespace-nowrap shadow-md">
                ${cityName}
              </div>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 20],
          popupAnchor: [0, -20]
        });

        const cityMarker = L.marker([lat, lng], { icon: cityHtmlIcon }).addTo(map);

        // Build City Popup Card
        const cityPopupContent = document.createElement('div');
        cityPopupContent.className = 'p-1 font-latin text-right max-w-[280px] space-y-2';
        cityPopupContent.innerHTML = `
          <div class="rounded-2xl overflow-hidden relative shadow-md">
            <img src="${heroImg}" alt="${cityName}" class="w-full h-28 object-cover" />
            <span class="absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white shadow-md">
              ${countyName}
            </span>
          </div>
          <div class="space-y-1">
            <h4 class="text-sm font-black text-slate-900 leading-snug">${cityName}</h4>
            <p class="text-[11px] text-slate-600 font-semibold line-clamp-2 leading-relaxed">${introText || ''}</p>
          </div>
        `;

        const exploreCityBtn = document.createElement('button');
        exploreCityBtn.className = 'w-full mt-2 py-2 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white text-xs font-black shadow-md hover:from-rose-500 hover:to-amber-500 transition-all flex items-center justify-center gap-1.5';
        exploreCityBtn.innerHTML = `<span>${appLang === 'ar' ? 'استكشف المدينة 🏛️' : 'Explore City 🏛️'}</span>`;
        exploreCityBtn.addEventListener('click', () => {
          onSelectCity(city);
          map.flyTo([city.lat, city.lng], 13, { duration: 1.5 });
        });

        cityPopupContent.appendChild(exploreCityBtn);
        cityMarker.bindPopup(cityPopupContent, { maxWidth: 300 });

        cityMarker.on('click', () => {
          onSelectCity(city);
          map.flyTo([city.lat, city.lng], 13, { duration: 1.5 });
        });

        cityMarkersRef.current[city.id] = cityMarker;

        // Render Granular Place Pins inside/around City
        if (city.places && city.places.length > 0) {
          city.places.forEach((place) => {
            if (activeCategoryFilter !== 'all' && place.category !== activeCategoryFilter) return;

            const placeEmoji = place.category === 'castle' ? '🏰' : place.category === 'museum' ? '🏛️' : place.category === 'church' ? '⛪' : place.category === 'nature' ? '🌲' : '📍';
            const placeColor = place.category === 'castle' ? '#9333EA' : place.category === 'museum' ? '#2563EB' : place.category === 'church' ? '#D97706' : place.category === 'nature' ? '#059669' : '#E11D48';

            const placeHtmlIcon = L.divIcon({
              className: 'custom-place-marker',
              html: `
                <div class="relative flex items-center justify-center cursor-pointer group">
                  <div class="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-xl border-2 border-white transform group-hover:scale-125 transition-all" style="background-color: ${placeColor};">
                    <span class="text-xs font-black">${placeEmoji}</span>
                  </div>
                  <div class="absolute top-9 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-slate-900/90 text-white border border-slate-700 text-[9px] font-black whitespace-nowrap shadow-md">
                    ${appLang === 'ar' ? place.name_ar : place.name_ro}
                  </div>
                </div>
              `,
              iconSize: [32, 32],
              iconAnchor: [16, 16],
              popupAnchor: [0, -16]
            });

            const placeMarker = L.marker([place.lat, place.lng], { icon: placeHtmlIcon }).addTo(map);

            const placePopupContent = document.createElement('div');
            placePopupContent.className = 'p-1 font-latin text-right max-w-[280px] space-y-2';
            placePopupContent.innerHTML = `
              <div class="rounded-2xl overflow-hidden relative shadow-md">
                <img src="${place.image_url}" alt="${place.name_ro}" class="w-full h-28 object-cover" />
                <span class="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-black bg-rose-600 text-white">
                  ${appLang === 'ar' ? place.category_label_ar : place.category_label_en}
                </span>
              </div>
              <div class="space-y-1">
                <h4 class="text-sm font-black text-slate-900">${appLang === 'ar' ? place.name_ar : place.name_ro}</h4>
                <p class="text-[10px] font-extrabold text-amber-600">${place.period}</p>
                <p class="text-[11px] text-slate-600 font-semibold line-clamp-2 leading-relaxed">${appLang === 'ar' ? place.desc_ar : place.desc_ro}</p>
              </div>
            `;

            const explorePlaceBtn = document.createElement('button');
            explorePlaceBtn.className = 'w-full mt-2 py-2 px-3 rounded-xl bg-slate-900 text-white text-xs font-black shadow-md hover:bg-rose-600 transition-all flex items-center justify-center gap-1.5';
            explorePlaceBtn.innerHTML = `<span>${appLang === 'ar' ? 'معاينة القصة الكاملة 📖' : 'View Full Story 📖'}</span>`;
            explorePlaceBtn.addEventListener('click', () => {
              if (onSelectPlace) onSelectPlace(place, city);
            });

            placePopupContent.appendChild(explorePlaceBtn);
            placeMarker.bindPopup(placePopupContent, { maxWidth: 300 });

            placeMarker.on('click', () => {
              if (onSelectPlace) onSelectPlace(place, city);
            });

            placeMarkersRef.current[place.id] = placeMarker;
          });
        }
      });
    });
  }, [citiesData, mapLoaded, appLang, activeCategoryFilter]);

  // Fly to selected city
  useEffect(() => {
    if (!selectedCityId || !mapInstanceRef.current) return;
    const targetCity = citiesData.find(c => c.id === selectedCityId);
    if (targetCity) {
      const lat = targetCity.basic_info?.lat || targetCity.lat;
      const lng = targetCity.basic_info?.lng || targetCity.lng;
      mapInstanceRef.current.flyTo([lat, lng], 13, { duration: 1.5 });
      const targetMarker = cityMarkersRef.current[targetCity.id];
      if (targetMarker) targetMarker.openPopup();
    }
  }, [selectedCityId, citiesData]);

  return (
    <div className={`relative w-full h-full bg-slate-950 transition-all ${
      isFullscreen ? 'fixed inset-0 z-50' : 'w-full h-full absolute inset-0'
    }`}>
      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Leaflet CSS */}
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css" 
      />

      {/* Map Control Buttons Overlay */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        {/* Style Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 shadow-xl text-xs font-black">
          <button
            onClick={() => setMapStyle('standard')}
            className={`px-2.5 py-1.5 rounded-xl transition-all ${mapStyle === 'standard' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            Standard
          </button>
          <button
            onClick={() => setMapStyle('topo')}
            className={`px-2.5 py-1.5 rounded-xl transition-all ${mapStyle === 'topo' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            🏔️ Relief
          </button>
          <button
            onClick={() => setMapStyle('satellite')}
            className={`px-2.5 py-1.5 rounded-xl transition-all ${mapStyle === 'satellite' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            🛰️ Satellite
          </button>
          <button
            onClick={() => setMapStyle('dark')}
            className={`px-2.5 py-1.5 rounded-xl transition-all ${mapStyle === 'dark' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            🌙 Dark
          </button>
        </div>
      </div>
    </div>
  );
}
