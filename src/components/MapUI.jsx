import { useState, useEffect, useRef } from 'react';
import { MapPin, Filter, Layers, AlertCircle } from 'lucide-react';
import { dindigulWards } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';
import { usePlatform } from '../context/PlatformContext';

const statusColors = {
  'Submitted': '#EF4444',
  'Pending': '#EF4444',
  'Assigned': '#F59E0B',
  'Work In Progress': '#F59E0B',
  'In Progress': '#F59E0B',
  'Resolved': '#22C55E',
  'Awaiting Citizen Confirmation': '#A855F7',
  'Reopened': '#EF4444',
};

const MapUI = () => {
  const { t } = useLanguage();
  const { complaints, refreshComplaints } = usePlatform();
  const [filterWard, setFilterWard] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const markerGroupRef = useRef(null);

  const safeComplaints = Array.isArray(complaints) ? complaints : [];

  const filteredData = safeComplaints.filter(c =>
    (filterWard === 'All' || c.ward === filterWard) &&
    (filterStatus === 'All' || c.status === filterStatus)
  );

  useEffect(() => {
    // Auto-refresh data every 30 seconds
    const interval = setInterval(refreshComplaints, 30000);
    return () => clearInterval(interval);
  }, [refreshComplaints]);

  useEffect(() => {
    // Dynamically load Leaflet
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => setMapLoaded(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!mapLoaded || typeof window.L === 'undefined') return;

    const L = window.L;
    const container = document.getElementById('dindigul-map');
    if (!container) return;

    if (!mapRef.current) {
      mapRef.current = L.map('dindigul-map', { zoomControl: true }).setView([10.3673, 77.9803], 14);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© CARTO contributors'
      }).addTo(mapRef.current);
      markerGroupRef.current = L.layerGroup().addTo(mapRef.current);
    }

    // Clear existing markers
    markerGroupRef.current.clearLayers();

    filteredData.forEach(complaint => {
      const color = statusColors[complaint.status] || '#EF4444';
      const icon = L.divIcon({
        className: '',
        html: `<div style="background:${color};width:18px;height:18px;border-radius:50%;border:3px solid white;box-shadow:0 0 12px ${color};"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });

      const lat = complaint.location?.latitude || complaint.lat;
      const lng = complaint.location?.longitude || complaint.lng;

      if (lat && lng) {
        L.marker([lat, lng], { icon })
          .addTo(markerGroupRef.current)
          .bindPopup(`
            <div style="min-width:180px;font-family:Inter,sans-serif;background:#1e293b;color:white;padding:10px;border-radius:12px">
              <img src="${complaint.image || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400'}" 
                   style="width:100%;height:100px;object-fit:cover;border-radius:8px;margin-bottom:8px;border:1px solid rgba(255,255,255,0.1)"/>
              <strong style="font-size:14px;display:block;margin-bottom:4px">${complaint.title}</strong>
              <span style="color:#94a3b8;font-size:11px;display:block;margin-bottom:8px">${complaint.ward} · ${complaint.category}</span>
              <div style="display:inline-block;padding:2px 10px;border-radius:99px;font-size:10px;font-weight:700;text-transform:uppercase;color:white;background:${color}">
                ${t(complaint.status)}
              </div>
              <p style="margin-top:8px;font-size:9px;color:#64748b;border-top:1px solid rgba(255,255,255,0.05);padding-top:8px">${complaint.id}</p>
            </div>
          `, {
            className: 'dark-popup'
          });
      }
    });
  }, [mapLoaded, filteredData, t]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Map */}
        <div className="lg:w-3/4 rounded-3xl overflow-hidden border border-white/5 shadow-2xl relative" style={{ height: 600, position: 'relative' }}>
          <div className="absolute top-6 left-6 z-[400] glass px-5 py-3 rounded-2xl border border-white/10 text-white font-bold flex items-center gap-3 shadow-2xl">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Live Dindigul Civic Grid
          </div>
          
          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#050D1A] text-gray-400 z-50">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4 shadow-[0_0_15px_rgba(6,182,212,0.4)]"></div>
                <p className="font-bold tracking-widest uppercase text-xs">Initializing Satellite Map...</p>
              </div>
            </div>
          )}
          <div id="dindigul-map" className="w-full h-full" />
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/4 space-y-4">
          <div className="glass-card rounded-[2rem] p-6 border border-white/5 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-widest">
              <Filter className="w-4 h-4 text-cyan-400" /> Map Filters
            </h3>
            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Ward Sector</label>
                <select
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs outline-none focus:border-cyan-500 transition-all appearance-none"
                  value={filterWard}
                  onChange={e => setFilterWard(e.target.value)}
                >
                  <option value="All">All Wards</option>
                  {dindigulWards.map(w => <option key={w} value={w} className="bg-slate-900">{w}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Status Node</label>
                <select
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs outline-none focus:border-cyan-500 transition-all appearance-none"
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                >
                  <option value="All">{t('allStatus')}</option>
                  <option value="Submitted">{t('Submitted')}</option>
                  <option value="Pending">{t('Pending')}</option>
                  <option value="In Progress">{t('In Progress')}</option>
                  <option value="Resolved">{t('Resolved')}</option>
                  <option value="Awaiting Citizen Confirmation">{t('Awaiting Citizen Confirmation')}</option>
                </select>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-[2rem] p-6 border border-white/5 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-widest">
              <Layers className="w-4 h-4 text-green-400" /> Sector Legend
            </h3>
            <ul className="space-y-4">
              {[
                {c: '#EF4444', l: t('Pending'), desc: 'Awaiting Action'},
                {c: '#F59E0B', l: t('In Progress'), desc: 'Field Work Active'},
                {c: '#22C55E', l: t('Resolved'), desc: 'Work Verified'}
              ].map((item) => (
                <li key={item.l} className="flex items-center gap-4">
                  <div style={{ width:12, height:12, borderRadius:'50%', background: item.c, border:'2px solid white', flexShrink:0, boxShadow: `0 0 8px ${item.c}` }}/>
                  <div>
                    <p className="text-xs font-bold text-white leading-none">{item.l}</p>
                    <p className="text-[9px] text-slate-500 uppercase mt-1">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card rounded-[2rem] p-6 border border-white/5 shadow-xl overflow-hidden max-h-[220px]">
            <h3 className="text-[10px] font-bold text-slate-400 mb-4 flex items-center justify-between uppercase tracking-widest">
              <span className="flex items-center gap-2"><AlertCircle className="w-4 h-4 text-blue-400" /> Active Nodes</span>
              <span className="text-white bg-blue-500 px-2 py-0.5 rounded-full">{filteredData.length}</span>
            </h3>
            <div className="space-y-2 overflow-y-auto max-h-[140px] pr-2 scrollbar-hide">
              {filteredData.map(c => (
                <div key={c.id} className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse" style={{ background: statusColors[c.status] || '#fff' }} />
                  <span className="text-[10px] text-slate-300 truncate font-medium">{c.title}</span>
                </div>
              ))}
              {filteredData.length === 0 && <p className="text-center py-4 text-[10px] text-slate-600">No active nodes in this sector.</p>}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .leaflet-popup-content-wrapper { background: #1e293b !important; border-radius: 16px !important; border: 1px solid rgba(255,255,255,0.1) !important; overflow: hidden !important; padding: 0 !important; }
        .leaflet-popup-content { margin: 0 !important; }
        .leaflet-popup-tip { background: #1e293b !important; border: 1px solid rgba(255,255,255,0.1) !important; }
        .leaflet-container a.leaflet-popup-close-button { color: #ffffff !important; padding: 8px !important; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default MapUI;
