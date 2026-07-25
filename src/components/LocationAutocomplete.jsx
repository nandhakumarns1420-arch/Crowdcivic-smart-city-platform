import { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Loader2, Search, X } from 'lucide-react';

const LocationAutocomplete = ({ value, onChange, onSelect, placeholder = "Search location..." }) => {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [cache, setCache] = useState({});
  const dropdownRef = useRef(null);
  const debounceTimer = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchLocation = useCallback(async (searchQuery) => {
    if (searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    // Check cache
    if (cache[searchQuery]) {
      setSuggestions(cache[searchQuery]);
      setShowDropdown(true);
      return;
    }

    setIsLoading(true);
    try {
      // Prioritize Tamil Nadu, Restrict to India
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&countrycodes=in&viewbox=76.2,13.5,80.3,8.0&bounded=0&addressdetails=1&limit=5`,
        {
          headers: {
            'Accept-Language': 'en-US,en;q=0.9',
            'User-Agent': 'CrowdCivic-App'
          }
        }
      );
      const data = await response.json();
      
      const formattedSuggestions = data.map(item => ({
        display_name: item.display_name,
        lat: item.lat,
        lon: item.lon,
        address: item.address
      }));

      setSuggestions(formattedSuggestions);
      setCache(prev => ({ ...prev, [searchQuery]: formattedSuggestions }));
      setShowDropdown(true);
    } catch (error) {
      console.error("Location search error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [cache]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setQuery(newValue);
    onChange(newValue);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    
    if (newValue.length >= 3) {
      debounceTimer.current = setTimeout(() => {
        searchLocation(newValue);
      }, 500);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  const handleSelect = (suggestion) => {
    setQuery(suggestion.display_name);
    setShowDropdown(false);
    onSelect({
      address: suggestion.display_name,
      lat: parseFloat(suggestion.lat),
      lng: parseFloat(suggestion.lon)
    });
  };

  const clearInput = () => {
    setQuery('');
    onChange('');
    setSuggestions([]);
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.length >= 3 && setShowDropdown(true)}
          placeholder={placeholder}
          required
          className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 pl-10 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
          ) : (
            <Search className="w-4 h-4 text-slate-500" />
          )}
        </div>
        {query && (
          <button
            type="button"
            onClick={clearInput}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {showDropdown && (suggestions.length > 0 || isLoading) && (
        <div className="absolute z-[100] mt-2 w-full bg-[#1e293b] border border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" /> Searching locations...
            </div>
          ) : suggestions.length > 0 ? (
            <ul className="py-2">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSelect(suggestion)}
                  className="px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5 last:border-none group"
                >
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-slate-500 mt-0.5 group-hover:text-blue-400 transition-colors" />
                    <div>
                      <p className="text-sm text-white font-medium line-clamp-1">{suggestion.display_name.split(',')[0]}</p>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{suggestion.display_name}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-slate-400 text-xs">
              No locations found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationAutocomplete;
