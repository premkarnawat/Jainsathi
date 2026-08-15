'use client';

import React, { useState } from 'react';
import { Search as SearchIcon, Filter, Heart, User } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useCandidateProfile } from '@/hooks/useCandidateProfile';
import Link from 'next/link';

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

  const handleSearch = async () => {
    if (!loggedInUser || !searchTerm.trim()) return;
    
    setLoading(true);
    setSearched(true);
    
    try {
      // Basic fuzzy search across first_name, last_name, or current_city
      const { data, error } = await supabase
        .from('candidate_profiles')
        .select('*, photos(*)')
        .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,current_city.ilike.%${searchTerm}%`)
        .neq('id', loggedInUser.id) // Don't return self
        .eq('verification_status', 'verified')
        .limit(20);

      if (error) throw error;
      setResults(data || []);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-3xl border border-[#EDE1D7] shadow-sm">
        <h1 className="font-serif text-3xl font-bold text-burgundy mb-6">Advanced Search</h1>
        
        <div className="flex gap-4">
          <div className="flex-grow flex items-center gap-3 bg-[#FDF9F4] border border-[#EDE1D7] rounded-xl px-4 focus-within:border-burgundy transition-colors">
            <SearchIcon className="w-5 h-5 text-[#766B70]" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search by name, city, or community..."
              className="w-full py-4 bg-transparent outline-none text-sm text-text font-semibold placeholder-[#766B70]/60"
            />
          </div>
          <button className="px-5 bg-[#FFF9F2] border border-gold/30 text-burgundy rounded-xl flex items-center justify-center hover:bg-[#F8EFE5]">
            <Filter className="w-5 h-5" />
          </button>
          <button 
            onClick={handleSearch}
            className="px-8 bg-burgundy hover:bg-deepBurgundy text-white font-bold rounded-xl text-sm transition-all"
          >
            Search
          </button>
        </div>
      </div>

      {/* Results Area */}
      <div className="pt-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : searched && results.length === 0 ? (
          <div className="bg-white border border-[#EDE1D7] rounded-3xl p-12 text-center shadow-sm">
            <SearchIcon className="w-12 h-12 text-[#EDE1D7] mx-auto mb-4" />
            <h3 className="font-serif text-xl font-bold text-text mb-2">No results found</h3>
            <p className="text-sm text-[#766B70]">Try adjusting your search terms or using broader filters.</p>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((cand) => (
              <div key={cand.id} className="bg-white border border-[#EDE1D7] rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 bg-[#F8EFE5] border-2 border-[#FFF9F2]">
                  {cand.photos?.[0]?.url ? (
                    <img src={cand.photos[0].url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <FallbackAvatar />
                  )}
                </div>
                <div className="flex-grow overflow-hidden">
                  <h3 className="font-serif font-bold text-text truncate">{cand.first_name} {cand.last_name}</h3>
                  <p className="text-xs text-[#766B70] truncate">{cand.current_city} • {cand.age} yrs</p>
                  <button className="text-[10px] font-bold text-burgundy mt-1 hover:underline">View Profile</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 opacity-50">
            <SearchIcon className="w-12 h-12 text-[#EDE1D7] mx-auto mb-4" />
            <p className="text-sm font-semibold">Enter a search term above to find specific candidates.</p>
          </div>
        )}
      </div>
    </div>
  );
}
