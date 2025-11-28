import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { RestaurantCard } from '@/components/RestaurantCard';
import { storage } from '@/lib/storage';
import { mockRestaurants, mockMenuItems } from '@/lib/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const Restaurants = () => {
  const [searchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState(mockRestaurants);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [filterVeg, setFilterVeg] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{ type: 'restaurant' | 'dish'; name: string; id?: string; itemId?: string }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (storage.getRestaurants().length === 0) {
      storage.setRestaurants(mockRestaurants);
      storage.setMenuItems(mockMenuItems);
    }

    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let filtered = mockRestaurants;

    if (category) {
      const normalize = (s: string) => s.replace(/[-_\s]/g, '').toLowerCase();
      const normCategory = normalize(category);
      filtered = filtered.filter(r =>
        r.cuisine.some(c => normalize(c).includes(normCategory))
      );
    }

    if (search) {
      setSearchTerm(search);
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.cuisine.some(c => c.toLowerCase().includes(search.toLowerCase()))
      );
    }

    setRestaurants(filtered);
  }, [searchParams]);

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
    const q = searchTerm.trim();
    if (q.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const qLower = q.toLowerCase();
    const restaurantMatches = mockRestaurants
      .filter(r => r.name.toLowerCase().includes(qLower) || r.cuisine.some(c => c.toLowerCase().includes(qLower)))
      .slice(0, 4)
      .map(r => ({ type: 'restaurant' as const, name: r.name, id: r.id }));
    const dishMatches = mockMenuItems
      .filter(d => d.name.toLowerCase().includes(qLower))
      .slice(0, 6)
      .map(d => ({ type: 'dish' as const, name: d.name, id: d.restaurantId, itemId: d.id }));
    setSuggestions([...restaurantMatches, ...dishMatches]);
    setShowSuggestions(true);
  }, [searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filtered = mockRestaurants.filter(r =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.cuisine.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setRestaurants(filtered);
  };

  const handleSuggestionClick = (s: { type: 'restaurant' | 'dish'; name: string; id?: string; itemId?: string }) => {
    if (s.type === 'restaurant' && s.id) {
      // Navigate to the restaurant page
      window.location.assign(`/restaurant/${s.id}`);
    } else if (s.type === 'dish' && s.id && s.itemId) {
      window.location.assign(`/restaurant/${s.id}?item=${encodeURIComponent(s.itemId)}`);
    } else {
      setSearchTerm(s.name);
    }
    setShowSuggestions(false);
  };

  const filteredRestaurants = filterVeg
    ? restaurants.filter(r => r.isVeg)
    : restaurants;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
            Restaurants
          </h1>

          <div ref={searchRef} className="mb-8 relative flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <Input
                type="text"
                placeholder="Search restaurants or dishes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => searchTerm.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
                className="glass-card border-border/50"
              />
              <Button type="submit">
                <Search className="h-4 w-4" />
              </Button>
            </form>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full mt-2 w-full md:w-1/2 glass-card rounded-2xl shadow-hover overflow-hidden z-50">
                {suggestions.map((s, i) => (
                  <button
                    key={`${s.type}-${s.name}-${i}`}
                    onClick={() => handleSuggestionClick(s)}
                    className="w-full px-4 py-3 text-left hover:bg-secondary/50 transition-smooth flex items-center gap-3"
                  >
                    <span className="text-2xl">{s.type === 'restaurant' ? '🏪' : '🍽️'}</span>
                    <div>
                      <p className="font-medium text-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.type === 'restaurant' ? 'Restaurant' : 'Dish'}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <Button
              variant={filterVeg ? 'default' : 'outline'}
              onClick={() => setFilterVeg(!filterVeg)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Veg Only
            </Button>
          </div>

          {filteredRestaurants.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">
                No restaurants found. Try adjusting your search.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Restaurants;
