import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { mockRestaurants, mockMenuItems } from '@/lib/mockData';
import { motion, AnimatePresence } from 'framer-motion';

export const SearchBar = ({ iconOnly = false }: { iconOnly?: boolean }) => {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState<Array<{ type: 'restaurant' | 'dish'; name: string; id?: string; itemId?: string }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (search.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const searchLower = search.toLowerCase();
    const restaurantMatches = mockRestaurants
      .filter(r => 
        r.name.toLowerCase().includes(searchLower) ||
        r.cuisine.some(c => c.toLowerCase().includes(searchLower))
      )
      .slice(0, 3)
      .map(r => ({ type: 'restaurant' as const, name: r.name, id: r.id }));

    const dishMatches = mockMenuItems
      .filter(d => d.name.toLowerCase().includes(searchLower))
      .slice(0, 6)
      .map(d => ({ type: 'dish' as const, name: d.name, id: d.restaurantId, itemId: d.id }));

    setSuggestions([...restaurantMatches, ...dishMatches]);
    setShowSuggestions(true);
  }, [search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(search)}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: typeof suggestions[0]) => {
    if (suggestion.type === 'restaurant' && suggestion.id) {
      navigate(`/restaurant/${suggestion.id}`);
    } else if (suggestion.type === 'dish' && suggestion.id && suggestion.itemId) {
      navigate(`/restaurant/${suggestion.id}?item=${encodeURIComponent(suggestion.itemId)}`);
    } else {
      setSearch(suggestion.name);
      navigate(`/restaurants?search=${encodeURIComponent(suggestion.name)}`);
    }
    setShowSuggestions(false);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearch}>
        <div className="flex gap-2 glass-card p-2 rounded-2xl shadow-hover">
          <Input
            type="text"
            placeholder="Search for restaurants or dishes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => search.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
            className="border-0 bg-transparent text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button
            type="submit"
            size={iconOnly ? 'icon' : 'lg'}
            aria-label="Search"
            className={iconOnly ? 'rounded-xl' : 'rounded-xl px-8'}
          >
            <Search className={iconOnly ? 'h-5 w-5' : 'mr-2 h-5 w-5'} />
            {!iconOnly && 'Search'}
          </Button>
        </div>
      </form>

      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full glass-card rounded-2xl shadow-hover overflow-hidden z-50"
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion.type}-${suggestion.name}-${index}`}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-secondary/50 transition-smooth flex items-center gap-3"
              >
                <span className="text-2xl">
                  {suggestion.type === 'restaurant' ? '🏪' : '🍽️'}
                </span>
                <div>
                  <p className="font-medium text-foreground">{suggestion.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {suggestion.type === 'restaurant' ? 'Restaurant' : 'Dish'}
                  </p>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
