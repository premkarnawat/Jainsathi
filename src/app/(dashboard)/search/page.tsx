'use client';

import React, { useState } from 'react';
import { Search as SearchIcon, Filter, Heart, User, CheckCircle, MapPin, X, SlidersHorizontal } from 'lucide-react';
import { useCandidateProfile } from '@/hooks/useCandidateProfile';
import Link from 'next/link';
import { getStorageUrl } from '@/lib/storage';

const FallbackAvatar = () => (
  <div className="w-full h-full bg-[#EDE1D7] flex items-center justify-center text-[#766B70]">
    <User className="w-1/2 h-1/2 opacity-50" />
  </div>
);

export default function SearchPage() {
  const { profile: loggedInUser } = useCandidateProfile();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Filters state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedSect, setSelectedSect] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState('');
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(50);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [city, setCity] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    setSearched(true);

    try {
      // Build query string for /api/search
      const params = new URLSearchParams();
      if (searchTerm.trim()) params.set('query', searchTerm.trim());
      if (selectedSect) params.set('sect', selectedSect);
      if (selectedCommunity) params.set('community', selectedCommunity);
      if (minAge > 18) params.set('minAge', minAge.toString());
      if (maxAge < 50) params.set('maxAge', maxAge.toString());
      if (verifiedOnly) params.set('verifiedOnly', 'true');
      if (city.trim()) params.set('city', city.trim());

      const res = await fetch(`/api/search?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.candidates)) {
          setResults(data.candidates);
        } else {
          setResults([]);
        }
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error('Search error:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSelectedSect('');
    setSelectedCommunity('');
    setMinAge(18);
    setMaxAge(50);
    setVerifiedOnly(false);
    setCity('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-3xl border border-[#EDE1D7] shadow-sm">
        <h1 className="font-serif text-3xl font-bold text-burgundy mb-4">Advanced Search</h1>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-grow flex items-center gap-3 bg-[#FDF9F4] border border-[#EDE1D7] rounded-xl px-4 focus-within:border-burgundy transition-colors">
            <SearchIcon className="w-5 h-5 text-[#766B70]" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search by candidate name, native place, or keywords..."
              className="w-full py-3.5 bg-transparent outline-none text-sm text-text font-semibold placeholder-[#766B70]/60"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button 
            type="button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`px-4 py-3 border rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all ${
              isFilterOpen || selectedSect || selectedCommunity || city || verifiedOnly
                ? 'bg-[#8F173D] text-white border-[#8F173D]' 
                : 'bg-[#FFF9F2] border-gold/30 text-burgundy hover:bg-[#F8EFE5]'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>

          <button 
            onClick={handleSearch}
            className="px-8 py-3 bg-[#8F173D] hover:bg-[#72002E] text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-sm"
          >
            Search
          </button>
        </div>

        {/* Expandable Filter Controls Drawer */}
        {isFilterOpen && (
          <div className="mt-4 pt-4 border-t border-[#EDE1D7] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in">
            <div>
              <label className="text-[11px] font-bold text-[#766B70] uppercase tracking-wider block mb-1">Jain Sect</label>
              <select 
                value={selectedSect} 
                onChange={(e) => setSelectedSect(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#EDE1D7] text-xs bg-[#FDF9F4] font-medium outline-none focus:border-[#8F173D]"
              >
                <option value="">All Sects</option>
                <option value="Shwetambar">Shwetambar</option>
                <option value="Digambar">Digambar</option>
                <option value="Sthanakvasi">Sthanakvasi</option>
                <option value="Terapanthi">Terapanthi</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#766B70] uppercase tracking-wider block mb-1">Community</label>
              <select 
                value={selectedCommunity} 
                onChange={(e) => setSelectedCommunity(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#EDE1D7] text-xs bg-[#FDF9F4] font-medium outline-none focus:border-[#8F173D]"
              >
                <option value="">All Communities</option>
                <option value="Oswal">Oswal</option>
                <option value="Porwal">Porwal</option>
                <option value="Khandelwal">Khandelwal</option>
                <option value="Agarwal">Agarwal</option>
                <option value="Shrimal">Shrimal</option>
                <option value="Humad">Humad</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#766B70] uppercase tracking-wider block mb-1">City / Location</label>
              <input
                type="text"
                placeholder="e.g. Mumbai, Ahmedabad"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#EDE1D7] text-xs bg-[#FDF9F4] font-medium outline-none focus:border-[#8F173D]"
              />
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <label className="text-[11px] font-bold text-[#766B70] uppercase tracking-wider block mb-1">
                  Age: {minAge} - {maxAge} yrs
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="18"
                    max="60"
                    value={minAge}
                    onChange={(e) => setMinAge(Number(e.target.value))}
                    className="w-full accent-[#8F173D]"
                  />
                  <input
                    type="range"
                    min="18"
                    max="60"
                    value={maxAge}
                    onChange={(e) => setMaxAge(Number(e.target.value))}
                    className="w-full accent-[#8F173D]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="accent-[#8F173D] rounded"
                  />
                  <span>Verified Only</span>
                </label>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-[11px] font-bold text-gray-400 hover:text-[#8F173D] underline"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Area */}
      <div className="pt-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-[#8F173D] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs text-gray-500 font-medium">Searching verified candidates...</p>
          </div>
        ) : searched && results.length === 0 ? (
          <div className="bg-white border border-[#EDE1D7] rounded-3xl p-12 text-center shadow-sm">
            <SearchIcon className="w-12 h-12 text-[#EDE1D7] mx-auto mb-4" />
            <h3 className="font-serif text-xl font-bold text-text mb-2">No candidates found</h3>
            <p className="text-sm text-[#766B70] max-w-sm mx-auto">
              We couldn't find any profiles matching your search criteria. Try broadening your location or age range.
            </p>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.map((cand) => {
              const photoUrl = cand.photos?.[0]?.url || (typeof cand.photos?.[0] === 'string' ? cand.photos[0] : null);
              const sect = cand.jain_identities?.sect || cand.sect || 'Jain';
              const community = cand.jain_identities?.community || cand.community;

              return (
                <div key={cand.id} className="bg-white border border-[#EDE1D7] rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow group">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 bg-[#F8EFE5] border-2 border-[#FFF9F2] shadow-xs">
                      {photoUrl ? (
                        <img 
                          src={getStorageUrl(photoUrl, 'profile-photos')} 
                          alt="" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                        />
                      ) : (
                        <FallbackAvatar />
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="font-serif font-bold text-base text-text truncate flex items-center gap-1.5">
                        <span>{cand.first_name} {cand.last_name}</span>
                        {cand.verification_status === 'verified' && (
                          <CheckCircle className="w-4 h-4 text-[#C59A4E] shrink-0" />
                        )}
                      </h3>
                      <p className="text-xs text-[#766B70] mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#8F173D]" />
                        <span>{cand.current_city || 'City not specified'}</span>
                        {cand.age && <span>• {cand.age} yrs</span>}
                      </p>
                      <p className="text-[11px] text-gray-500 font-medium mt-1">
                        {sect}{community ? `, ${community}` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {cand.verification_status || 'Verified'}
                    </span>
                    <Link 
                      href={`/profile/${cand.id}`}
                      className="px-4 py-1.5 rounded-xl bg-[#8F173D] hover:bg-[#72002E] text-white text-xs font-bold transition-all shadow-xs"
                    >
                      View Profile →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 opacity-60">
            <SearchIcon className="w-12 h-12 text-[#EDE1D7] mx-auto mb-3" />
            <p className="text-sm font-semibold">Enter a name, city, or click Filters to discover verified Jain candidates.</p>
          </div>
        )}
      </div>
    </div>
  );
}
