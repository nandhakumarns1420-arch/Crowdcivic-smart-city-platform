import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { usePlatform } from '../context/PlatformContext';
import { useLanguage } from '../context/LanguageContext';

// Custom Marker component to update center
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

const LiveMap = ({ filterWard, filterStatus, filterCategory }) => {
  const { complaints } = usePlatform();
  const { t } = useLanguage();

  // Dindigul Center Coordinates
  const centerPosition = [10.3673, 77.9803];

  // Create custom glowing div icons based on status
  const createIcon = (status) => {
    let colorClass = '';
    let glowColor = '';
    
    if (status === 'Resolved') {
      colorClass = 'border-green-400 bg-green-500';
      glowColor = 'rgba(34,197,94,0.3)';
    } else if (status === 'Work In Progress' || status === 'In Progress' || status === 'Assigned') {
      colorClass = 'border-yellow-400 bg-yellow-500';
      glowColor = 'rgba(234,179,8,0.3)';
    } else {
      // Pending, Submitted, Reopened
      colorClass = 'border-red-400 bg-red-500';
      glowColor = 'rgba(239,68,68,0.3)';
    }

    const html = `
      <div style="position: relative; width: 100%; height: 100%;">
        <div class="marker-pulse" style="background: ${glowColor}"></div>
        <div class="marker-core ${colorClass}"></div>
      </div>
    `;

    return L.divIcon({
      className: 'custom-leaflet-marker',
      html: html,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
  };

  const safeComplaints = Array.isArray(complaints) ? complaints : [];

  // Filter complaints based on props
  const filteredComplaints = safeComplaints.filter(c => {
    if (filterWard && filterWard !== 'All Wards' && c.ward !== filterWard) return false;
    if (filterStatus && filterStatus !== 'All Status' && c.status !== filterStatus) return false;
    if (filterCategory && filterCategory !== 'All Categories' && c.category !== filterCategory) return false;
    // Basic check for lat/lng
    if (!c.lat || !c.lng) return false;
    return true;
  });

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl relative" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
      <MapContainer 
        center={centerPosition} 
        zoom={13} 
        style={{ width: '100%', height: '100%', background: '#050D1A' }}
        zoomControl={false}
      >
        <ChangeView center={centerPosition} zoom={13} />
        
        {/* Dark theme tile layer for Smart City look */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {filteredComplaints.map(complaint => (
          <Marker 
            key={complaint.id} 
            position={[complaint.lat, complaint.lng]}
            icon={createIcon(complaint.status)}
          >
            <Popup className="custom-popup">
              <div className="p-1 min-w-[200px]">
                <img 
                  src={complaint.image || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400'} 
                  alt={complaint.title}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono px-2 py-1 rounded bg-slate-100 text-slate-800 font-bold">{complaint.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider
                    ${complaint.status === 'Resolved' ? 'bg-green-100 text-green-700' : 
                      (complaint.status === 'Submitted' || complaint.status === 'Pending' || complaint.status === 'Reopened' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700')}
                  `}>
                    {t(complaint.status)}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 leading-tight mb-1">{complaint.title}</h4>
                <p className="text-xs text-slate-500 mb-2">{typeof complaint.location === 'object' && complaint.location !== null ? complaint.location.address : complaint.location} • {complaint.ward}</p>
                <div className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-100">
                  Reported: {complaint.date}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Overlay controls/legend */}
      <div className="absolute bottom-4 right-4 z-[400] glass rounded-xl p-3 flex flex-col gap-2 pointer-events-auto shadow-2xl">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
          <span className="text-xs text-white font-medium drop-shadow-md">{t('Pending')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]"></div>
          <span className="text-xs text-white font-medium drop-shadow-md">{t('In Progress')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
          <span className="text-xs text-white font-medium drop-shadow-md">{t('Resolved')}</span>
        </div>
      </div>
    </div>
  );
};

export default LiveMap;

// Leaflet styles
const style = document.createElement('style');
style.innerHTML = `
  .leaflet-popup-content-wrapper { background: #ffffff; border-radius: 12px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5); }
  .leaflet-popup-tip { background: #ffffff; }
  .leaflet-container a.leaflet-popup-close-button { color: #64748b; font-size: 16px; padding: 4px; }
`;
document.head.appendChild(style);
